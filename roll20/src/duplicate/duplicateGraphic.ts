import { Id } from "../builtIns";

const GRID_COLUMNS = 10;

// Bar links store an Attribute ID tied to the original character.
// Remap to the same-named Attribute on the duplicate character.
function remapBarLink(duplicateCharId: Id, linkId: Id): Id {
  if (!linkId) return linkId;
  const attr = getObj("attribute", linkId);
  if (!attr) return "";
  const match = findObjs<Attribute>({
    type: "attribute",
    characterid: duplicateCharId,
    name: attr.get("name"),
  })[0];
  return match?.id ?? "";
}

export function duplicateGraphic(
  source: Graphic,
  duplicateChar: Character,
  index: number
): Graphic {
  const col = index % GRID_COLUMNS;
  const row = Math.floor(index / GRID_COLUMNS);
  const charId = duplicateChar.id;
  const width = source.get("width");
  const height = source.get("height");

  const newGraphic = createObj("graphic", {
    pageid: source.get("pageid"),
    imgsrc: source.get("imgsrc"),
    left: source.get("left") + (col + 1) * width,
    top: source.get("top") + row * height,
    width,
    height,
    name: duplicateChar.get("name"),
    represents: charId,
    // Layer / drawing
    layer: source.get("layer"),
    isdrawing: source.get("isdrawing"),
    fliph: source.get("fliph"),
    flipv: source.get("flipv"),
    rotation: source.get("rotation"),
    base_opacity: source.get("base_opacity"),
    tint_color: source.get("tint_color"),
    lockMovement: source.get("lockMovement"),
    disableSnapping: source.get("disableSnapping"),
    disableTokenMenu: source.get("disableTokenMenu"),
    renderAsScenery: source.get("renderAsScenery"),
    fadeOnOverlap: source.get("fadeOnOverlap"),
    fadeOpacity: source.get("fadeOpacity"),
    interactionManualReset: source.get("interactionManualReset"),
    interactionTriggered: source.get("interactionTriggered"),
    // Nameplate
    showname: source.get("showname"),
    showplayers_name: source.get("showplayers_name"),
    playersedit_name: source.get("playersedit_name"),
    // Bar 1
    bar1_value: source.get("bar1_value"),
    bar1_max: source.get("bar1_max"),
    bar1_link: remapBarLink(charId, source.get("bar1_link")),
    showplayers_bar1: source.get("showplayers_bar1"),
    playersedit_bar1: source.get("playersedit_bar1"),
    // Bar 2
    bar2_value: source.get("bar2_value"),
    bar2_max: source.get("bar2_max"),
    bar2_link: remapBarLink(charId, source.get("bar2_link")),
    showplayers_bar2: source.get("showplayers_bar2"),
    playersedit_bar2: source.get("playersedit_bar2"),
    // Bar 3
    bar3_value: source.get("bar3_value"),
    bar3_max: source.get("bar3_max"),
    bar3_link: remapBarLink(charId, source.get("bar3_link")),
    showplayers_bar3: source.get("showplayers_bar3"),
    playersedit_bar3: source.get("playersedit_bar3"),
    // Bar 4
    bar4_value: source.get("bar4_value"),
    bar4_max: source.get("bar4_max"),
    bar4_link: remapBarLink(charId, source.get("bar4_link")),
    showplayers_bar4: source.get("showplayers_bar4"),
    playersedit_bar4: source.get("playersedit_bar4"),
    // Bar display
    bar_location: source.get("bar_location"),
    compact_bar: source.get("compact_bar"),
    // Aura 1
    aura1_radius: source.get("aura1_radius"),
    aura1_color: source.get("aura1_color"),
    aura1_options: source.get("aura1_options"),
    aura1_square: source.get("aura1_square"),
    showplayers_aura1: source.get("showplayers_aura1"),
    playersedit_aura1: source.get("playersedit_aura1"),
    // Aura 2
    aura2_radius: source.get("aura2_radius"),
    aura2_color: source.get("aura2_color"),
    aura2_options: source.get("aura2_options"),
    aura2_square: source.get("aura2_square"),
    showplayers_aura2: source.get("showplayers_aura2"),
    playersedit_aura2: source.get("playersedit_aura2"),
    // Status markers
    statusmarkers: source.get("statusmarkers"),
    token_markers: source.get("token_markers"),
    // Permissions
    controlledby: source.get("controlledby"),
    // Dynamic lighting / vision
    light_radius: source.get("light_radius"),
    light_dimradius: source.get("light_dimradius"),
    light_otherplayers: source.get("light_otherplayers"),
    light_hassight: source.get("light_hassight"),
    light_angle: source.get("light_angle"),
    light_losangle: source.get("light_losangle"),
    light_multiplier: source.get("light_multiplier"),
    light_sensitivity_multiplier: source.get("light_sensitivity_multiplier"),
    night_vision_effect: source.get("night_vision_effect"),
    adv_fow_view_distance: source.get("adv_fow_view_distance"),
  });

  // gmnotes is a blob field — must use async get, separate set call
  (source as any).get("gmnotes", (value: string) => {
    newGraphic.set("gmnotes", value);
  });

  setDefaultTokenForCharacter(duplicateChar, newGraphic);

  return newGraphic;
}
