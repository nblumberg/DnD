export interface DuplicateArgs {
  count: number;
  names: string[];
}

function tokenize(input: string): string[] {
  const tokens: string[] = [];
  let current = "";
  let inQuote = false;
  for (const char of input) {
    if (char === '"') {
      inQuote = !inQuote;
    } else if (char === " " && !inQuote) {
      if (current.length > 0) {
        tokens.push(current);
        current = "";
      }
    } else {
      current += char;
    }
  }
  if (current.length > 0) {
    tokens.push(current);
  }
  return tokens;
}

export function parseArgs(content: string, apiKey: string): DuplicateArgs {
  const rest = content.slice(apiKey.length).trim();
  if (!rest) {
    return { count: 1, names: [] };
  }

  const tokens = tokenize(rest);
  const firstToken = tokens[0];
  const firstAsNum = parseInt(firstToken, 10);

  if (!isNaN(firstAsNum) && firstAsNum > 0 && String(firstAsNum) === firstToken) {
    return { count: firstAsNum, names: tokens.slice(1) };
  }

  return { count: tokens.length, names: tokens };
}
