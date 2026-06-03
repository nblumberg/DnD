const HTML_TAG_REG_EXP = /<[^>]+>/g;

/**
 * Get the portal name and target portal name from the portal gmnotes
 * @param {string} gmnotes The portal token's gmnotes, URL encoded HTML
 * @returns {{targetName: any, name: any}} The portal name and target portal name
 */
export function parseGmNotes(gmnotes: string): { name: string; targetName: string } {
  const decoded = decodeURI(gmnotes);
  const lines = decoded.split("</p>");
  if (lines.length < 2) {
    log(
      `ERROR: there appears to are ${lines.length} line(s) in ${decoded}, expected 2:\nname,\ntargetName`
    );
  }
  const name = lines[0].replace(HTML_TAG_REG_EXP, "").trim();
  const targetName = lines[1].replace(HTML_TAG_REG_EXP, "").trim();
  if (!name || !targetName) {
    log(`ERROR: couldn't parse gmnotes ${decoded}`);
  }
  return { name, targetName };
}
