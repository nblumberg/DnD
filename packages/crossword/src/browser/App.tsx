import { useMemo, useState } from "react";
import styles from "./App.module.scss";
import { BoardContext } from "./BoardContext";
import { Crossword } from "./Crossword";
import { ModeContext } from "./ModeContext";
import { readBoard } from "./readBoard";
import { WordsContext, WordsCorrectMap } from "./WordsContext";

function App() {
  const { board, across, down, initialWords } = useMemo(() => {
    const board = readBoard();
    const across = board
      .getAcross()
      .map(({ word, clue, number, direction }) => {
        // console.log(
        //   direction === ACROSS ? "ACROSS" : "DOWN",
        //   number,
        //   word,
        //   clue
        // );
        return <li key={word}>{clue}</li>;
      });
    const down = board.getDown().map(({ word, clue, number, direction }) => {
      // console.log(direction === ACROSS ? "ACROSS" : "DOWN", number, word, clue);
      return <li key={word}>{clue}</li>;
    });
    const initialWords = board.getWords().reduce((map, word) => {
      map.set(word, false);
      return map;
    }, new Map());
    return { board, across, down, initialWords };
  }, []);
  const [words, setWords] = useState<WordsCorrectMap>(initialWords);

  return (
    <ModeContext.Provider value={window.mode}>
      <BoardContext.Provider value={board}>
        <WordsContext.Provider value={[words, setWords]}>
          <div className={styles.app}>
            <section id="buttons">
              <div>
                <label>id:</label>
                <span id="id">{window.id}</span>
              </div>
              <div>
                <button id="save" onClick={save}>
                  Save
                </button>
                <button id="play" onClick={play}>
                  Play
                </button>
              </div>
            </section>
            <h1>Board</h1>
            <Crossword board={board} />
            <h1>Clues</h1>
            <table className="clues">
              <thead>
                <th className={styles.across}>Across</th>
                <th className={styles.down}>Down</th>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <ol id="across" className={styles.across}>
                      {across}
                    </ol>
                  </td>
                  <td>
                    <ol id="down" className={styles.down}>
                      {down}
                    </ol>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </WordsContext.Provider>
      </BoardContext.Provider>
    </ModeContext.Provider>
  );
}

async function save(): Promise<void> {
  const id = document.getElementById("id")?.textContent?.trim();
  await fetch(`/crossword/save/${id}`);
}

function play(): void {
  const id = document.getElementById("id")?.textContent?.trim();
  window.location.href = `/crossword/${id}`;
}

export default App;
