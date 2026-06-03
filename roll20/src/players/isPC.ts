export function isPC(character: Character | string): boolean {
    let characterObject: Character | undefined;
    if (typeof character === "string") {
        characterObject = getObj("character", character);
        if (!characterObject) {
            log(`Character with ID ${character} not found`);
            return false;
        }
    } else {
        characterObject = character;
    }
    return getAttrByName(characterObject.get("id"), "npc") === "0";
}