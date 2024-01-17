import { CastMember, Condition } from "creature";
import { SyntheticEvent, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { getSocket } from "../services/sockets";

const Dialog = styled.dialog`
  background: white;
  bottom: 0;
  min-width: 18em;
  z-index: 1;
`;
const Panel = styled.div<{ $dialog: boolean }>`
  align-items: center;
  bottom: 0;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  ${({ $dialog }) => ($dialog ? "position: relative;" : "position: absolute;")}
  text-align: left;
  width: 100%;
`;
const ConditionIcon = styled.div`
  font-size: 3em;
  flex-grow: 1;
`;

const Icons = {
  acid: "🧪",
  blinded: "🙈",
  bleeding: "🩸",
  bludgeoning: "🤜",
  charmed: "😍", // "😵‍💫",
  cold: "❄️",
  dead: "💀",
  deafened: "🙉",
  fire: "🔥",
  force: "🔮", // TODO
  frightened: "😱",
  grappled: "🤼",
  hasted: "⚡️",
  incapacitated: "😵",
  invisible: "🫥",
  lightning: "⚡️",
  necrotic: "☣️",
  paralyzed: "♿️",
  petrified: "🗿",
  piercing: "🏹",
  poisoned: "🤢",
  prone: "🧎",
  radiant: "🌟",
  restrained: "🪢",
  slashing: "🗡",
  slowed: "🐌",
  stunned: "😵‍💫",
  thunder: "🔊",
  unconscious: "😴",
};

function ChooseCondition({ castMember }: { castMember: CastMember }) {
  const { conditions } = castMember;
  const active = conditions.map(
    ({ condition }) => condition as keyof typeof Icons
  );

  const addCondition = (event: SyntheticEvent) => {
    const { target } = event;
    const condition = (target as HTMLElement).title as Condition;
    getSocket().emit("addCondition", castMember.id, condition);
  };

  const allConditions = (Object.keys(Icons) as Array<keyof typeof Icons>)
    .filter((condition) => !active.includes(condition))
    .map((condition) => (
      <ConditionIcon
        key={condition}
        title={`${condition.charAt(0).toUpperCase()}${condition.substring(1)}`}
        onClick={addCondition}
      >
        {Icons[condition]}
      </ConditionIcon>
    ));
  return (
    <Dialog open style={{ background: "white" }}>
      <Panel $dialog={true}>{allConditions}</Panel>
    </Dialog>
  );
}

export function ConditionOverlay({ castMember }: { castMember: CastMember }) {
  const [chooseConditionOpen, setChooseConditionOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chooseConditionOpen || !ref.current) {
      return;
    }
    const element = ref.current;
    const handler = (event: MouseEvent) => {
      if (element !== event.target) {
        // && !element.contains(event.target as Node)) {
        setChooseConditionOpen(false);
      }
    };
    setTimeout(() => {
      window.document.addEventListener("click", handler);
    }, 100);
    return () => {
      window.document.removeEventListener("click", handler);
    };
  }, [chooseConditionOpen, setChooseConditionOpen, ref]);

  const chooseCondition = () => {
    setChooseConditionOpen(true);
    console.log("chooseCondition");
  };

  const { conditions } = castMember;
  const icons = conditions.map(({ condition }) => (
    <ConditionIcon
      key={condition}
      title={`${condition.charAt(0).toUpperCase()}${condition.substring(1)}`}
    >
      {Icons[condition as unknown as keyof typeof Icons]}
    </ConditionIcon>
  ));
  icons.unshift(
    <ConditionIcon
      key="conditions"
      title="Conditions"
      onClick={chooseCondition}
    >
      ⏳️
    </ConditionIcon>
  );
  return (
    <Panel $dialog={false}>
      {icons}
      {chooseConditionOpen && (
        <div ref={ref}>
          <ChooseCondition castMember={castMember} />
        </div>
      )}
    </Panel>
  );
}

// Condition - onClick = creature remove condition
