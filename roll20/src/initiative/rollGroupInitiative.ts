import { getCurrentPageId } from "../utilities";
import { debug } from "./debug";
import { InitiativeResult, tokenIdToResult } from "./initiativeResult";
import { trackSummons } from "./summons";
import { getTurnOrder, setTurnOrder } from "./turnOrder";

export function rollGroupInitiative(tokens: Graphic[]): InitiativeResult[] {
  debug(`Rolling initiative for ${tokens.length} selected tokens`);

  // Collect information about each token and its initiative result,
  // and also track summons so that we can set their initiative to match their masters after we roll everything
  const results: InitiativeResult[] = [];
  // Track results by token name so that we can easily look up a token's initiative result when we're setting summon initiative to match their masters
  const resultsMap: Map<string, InitiativeResult> = new Map();
  // Track summons so that we can set their initiative to match their masters after we roll everything
  const summonsMap: Map<string, InitiativeResult[]> = new Map();
  for (const token of tokens) {
    const result = tokenIdToResult(token.id);
    if (!result) {
      continue;
    }
    results.push(result);
    resultsMap.set(result.graphic.get("name"), result);
    trackSummons(summonsMap, result);
  }

  const existingTurnOrder = getTurnOrder();
  for (const { id, pr } of existingTurnOrder) {
    const result = tokenIdToResult(id, parseInt(pr.toString(), 10) || 1);
    if (!result) {
      continue;
    }
    results.push(result);
    resultsMap.set(result.graphic.get("name"), result);
    trackSummons(summonsMap, result);
  }

  if (results.length === 0) {
    return [];
  }

  // Set summon initiative to match their master's initiative
  for (const [summonerName, summonResults] of summonsMap.entries()) {
    const summonerResult = resultsMap.get(summonerName);
    if (!summonerResult) {
      debug(`Summoner ${summonerName} is not in the initiative order`);
      continue;
    }
    const { roll } = summonerResult;
    if (!roll) {
      debug(`Summoner ${summonerName} does not have an initiative roll`);
      continue;
    }
    for (const summonResult of summonResults) {
      debug(
        `Setting ${summonResult.graphic.get("name")}'s initiative to match the summoner ${summonResult.summonOf}: ${roll}`
      );
      summonResult.roll = roll;
    }
  }

  // Sort descending by roll, then by dexterity score as tiebreaker.
  results.sort((a, b) => {
    return b.roll - a.roll || b.dex - a.dex;
  });

  // Take out all the summons
  for (const [, summonResults] of summonsMap.entries()) {
    for (const summonResult of summonResults) {
      results.splice(results.indexOf(summonResult), 1);
    }
  }
  // Inject the summons back directly below their summoner
  for (const [summonerName, summonResults] of summonsMap.entries()) {
    const summonerResult = resultsMap.get(summonerName);
    if (!summonerResult) {
      continue;
    }
    const index = results.indexOf(summonerResult);
    results.splice(index + 1, 0, ...summonResults);
  }

  const _pageid = getCurrentPageId();
  const newTurnOrder: TurnOrder = results.map(({ graphic, roll }) => ({
    id: graphic.get("id"),
    pr: `${roll}`, // must be a string
    custom: graphic.get("name") || "[Unknown Token]",
    _pageid,
  }));

  setTurnOrder(newTurnOrder);

  const lines = results.map(
    ({ graphic, roll, bonus }) =>
      `${graphic.get("name")}: ${roll} (d20[${roll - bonus}]${bonus >= 0 ? "+" : ""}${bonus})`
  );
  sendChat(
    "InitiativeAPI",
    `&{template:default} {{name=Initiative}} {{${lines.join("}} {{")}}}`
  );

  return results;
}
