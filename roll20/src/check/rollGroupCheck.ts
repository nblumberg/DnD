import { CheckResult, tokenIdToResult } from "./checkResult";
import { CHECK_API_PREFIX } from "./constants";
import { debug } from "./debug";

interface RollGroupCheck {
  tokens: Graphic[];
  displayName: string;
  attribute: keyof Character;
  dc?: number;
}

export function rollGroupCheck({
  tokens,
  displayName,
  attribute,
  dc,
}: RollGroupCheck): CheckResult[] {
  const hasDC = dc !== undefined;
  debug(
    `Rolling ${displayName} for ${tokens.length} selected tokens${hasDC ? ` against DC ${dc}` : ""}`
  );

  // Collect information about each token and its initiative result,
  // and also track summons so that we can set their initiative to match their masters after we roll everything
  const results: CheckResult[] = [];
  // Track results by token name so that we can easily look up a token's initiative result when we're setting summon initiative to match their masters
  const resultsMap: Map<string, CheckResult> = new Map();
  for (const token of tokens) {
    const result = tokenIdToResult(token.id, attribute, dc);
    if (!result) {
      continue;
    }
    results.push(result);
    resultsMap.set(result.graphic.get("name"), result);
  }

  if (results.length === 0) {
    return [];
  }

  // Sort descending by roll
  results.sort((a, b) => b.roll - a.roll);

  const lines = results.map(
    ({ graphic, roll, bonus, success }) =>
      `${graphic.get("name")}: ${hasDC ? `[${success ? "SUCCESS" : "FAIL"}] ` : ""}${roll} (d20[${roll - bonus}]${bonus >= 0 ? "+" : ""}${bonus})`
  );
  sendChat(
    CHECK_API_PREFIX,
    `&{template:default} {{name=${displayName}${hasDC ? `(DC ${dc})` : ""}}}} {{${lines.join("}} {{")}}}`
  );

  return results;
}
