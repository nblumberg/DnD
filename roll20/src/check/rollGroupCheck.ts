import { CheckResult, tokenToResult } from "./checkResult";
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

  const results: CheckResult[] = [];
  for (const token of tokens) {
    results.push(tokenToResult(token, attribute, dc));
  }

  if (results.length === 0) {
    return [];
  }

  // Sort descending by roll
  results.sort((a, b) => b.roll - a.roll);

  const title = `${displayName}${hasDC ? ` (DC ${dc})` : ""}`;
  const rowsHtml = results
    .map(({ graphic, roll, bonus, success }) => {
      const name = graphic.get("name") as string;
      const breakdown = `${roll} (d20[${roll - bonus}]${bonus >= 0 ? "+" : ""}${bonus})`;
      if (hasDC) {
        const bg = success ? "#d4edda" : "#f8d7da";
        const color = success ? "#155724" : "#721c24";
        const label = success ? "[SUCCESS]" : "[FAIL]";
        return `<tr style="background-color:${bg};color:${color}"><td style="padding:2px 4px;font-weight:bold">${name}</td><td style="padding:2px 4px">${label} ${breakdown}</td></tr>`;
      }
      return `<tr><td style="padding:2px 4px;font-weight:bold">${name}</td><td style="padding:2px 4px">${breakdown}</td></tr>`;
    })
    .join("");
  sendChat(
    CHECK_API_PREFIX,
    `<table style="width:100%;border-collapse:collapse"><tr><th colspan="2" style="background-color:#333;color:#fff;padding:4px;text-align:left">${title}</th></tr>${rowsHtml}</table>`
  );

  return results;
}
