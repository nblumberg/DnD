export function parseRegExpGroups(
  name: string,
  regexp: RegExp,
  text: string,
  allowNoMatch: boolean = false
): { [key: string]: string } {
  let groups: { [key: string]: string };
  try {
    const result = regexp.exec(text);
    if (!result) {
      if (allowNoMatch) {
        return {};
      }
      throw new Error(`${name} RegExp found no match in "${text}"`);
    }
    groups = result?.groups ?? {};
  } catch (e) {
    throw new Error(`${name} RegExp failed to parse groups from ${text}`);
  }
  return groups;
}
