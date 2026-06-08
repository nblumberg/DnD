import { Id } from "../builtIns";
import { extractProperties } from "../utilities";
import { debug } from "./debug";
import { InitiativeResult } from "./initiativeResult";

export function trackSummons(
  summonsMap: Map<Id, InitiativeResult[]>,
  result: InitiativeResult
): void {
  const { name: graphicName, represents: characterId } = extractProperties(
    result.graphic,
    "name",
    "represents"
  );
  const summonOfName = characterId
    ? getAttrByName(characterId, "summonOf")
    : undefined;
  if (!summonOfName) {
    return;
  }
  debug(`${graphicName} is the summons of ${summonOfName}`);
  // const summoner = findObjs<Graphic>({ name: summonOfName })[0];
  // if (!summoner) {
  //   debug(`Can't find ${graphicName}'s summoner ${summonOfName}`);
  //   return;
  // }
  // const summonerId = summoner?.get("id");
  // if (!summonerId) {
  //   debug(`Can't find ${summonOfName}'s id`);
  //   return;
  // }
  if (!summonsMap.has(summonOfName)) {
    summonsMap.set(summonOfName, []);
  }
  summonsMap.get(summonOfName)!.push(result);
  result.summonOf = summonOfName;
  debug(
    `Tracking ${graphicName}'s initiative to match ${summonOfName}'s initiative`
  );
}
