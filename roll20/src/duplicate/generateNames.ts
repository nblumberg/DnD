export function generateNames(
  baseName: string,
  count: number,
  explicitNames: string[]
): string[] {
  const needed = count - explicitNames.length;
  if (needed <= 0) {
    return explicitNames.slice(0, count);
  }

  const taken = new Set(
    (findObjs<Character>({ type: "character" }) as Character[]).map((c) =>
      c.get("name")
    )
  );
  for (const name of explicitNames) {
    taken.add(name);
  }

  const autoNames: string[] = [];
  let n = 1;
  while (autoNames.length < needed) {
    const candidate = `${baseName} ${n}`;
    if (!taken.has(candidate)) {
      autoNames.push(candidate);
      taken.add(candidate);
    }
    n++;
  }

  return [...explicitNames, ...autoNames];
}
