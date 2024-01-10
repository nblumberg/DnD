export function parseRegExpGroups(
  name: string,
  regexp: RegExp,
  text: string,
  allowNoMatch: boolean = false
): ReturnType<typeof RegExp.prototype.exec>["groups"] {
  let groups: ReturnType<typeof RegExp.prototype.exec>["groups"];
  try {
    const result = regexp.exec(text);
    if (!result) {
      if (allowNoMatch) {
        return {};
      }
      throw new Error(`${name} RegExp found no match in "${text}"`);
    }
    ({ groups } = regexp.exec(text));
  } catch (e) {
    throw new Error(`${name} RegExp failed to parse groups from ${text}`);
  }
  return groups;
}
