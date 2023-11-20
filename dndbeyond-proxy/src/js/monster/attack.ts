import { getElementText, getRemainingText } from "../dom";
import { parseRegExpGroups } from "../utils";
import { Action, DamageType } from "./types";

const attackTypeRegExp =
  /(?<attackMode>Melee or Ranged|Melee|Ranged)\s+(?<attackMethod>Weapon|Spell)?\s*Attack/;

// to hit, reach 5 ft., one target.
// to hit, reach 10 ft. one target.
// to hit, reach 5 ft. or range 30/120 ft., one target.
// to hit, reach 5 ft. or range 20/60 ft., one target.
// to hit, reach 5 ft. or range 120 ft., one target.
// to hit, range 60 ft., one target.
const reachRegExp = /reach\s+(?<reach>\d+)\s+ft/;
const rangeRegExp = /range\s+(?<nearRange>\d+)(\s*\/\s*(?<farRange>\d+))\s+ft/;
const targetRegExp = /,\s+(?<target>[^.]+)\.\s*$/;
const attackHitRegExp =
  /^\s*to\s+hit,\s+reach\s+(?<nearReach>\d+)\s*\/?\s*(?<farReach>\d+)?\s+ft\.,?\s+(?<target>.+).:$/;

export function getAttack(entry: Element): Action["attack"] | undefined {
  const header = entry.querySelector("em") || entry.querySelector("strong");
  if (!header) {
    return;
  }
  const nameElement = entry.querySelector("strong") || header;
  // The "Melee or Ranged|Melee|Ranged Weapon|Spell Attack:" can be
  // inside it's own <em> tag, partially inside it's own <em> tag,
  // or just a text node
  let attackSubtitle = getRemainingText(nameElement);
  if (!attackSubtitle) {
    // It can also be outside the header
    const tmp = getRemainingText(header);
    const index = tmp.indexOf("Attack:");
    if (index !== -1) {
      attackSubtitle = tmp.substring(0, index + "Attack:".length);
    }
  }
  if (!attackSubtitle) {
    return;
  }

  const { attackMode, attackMethod } = parseRegExpGroups(
    "attackTypeRegExp",
    attackTypeRegExp,
    attackSubtitle,
    true
  );
  if (!attackMode || !attackMethod) {
    return;
  }
  const toHit = entry.querySelector('[data-rolltype="to hit"]');
  const modifier = parseInt(getElementText(toHit), 10);

  const toHitText = toHit.nextSibling.textContent.trim();

  const { reach: reachText } = reachRegExp.exec(toHitText)?.groups ?? {};
  const reach = reachText ? parseInt(reachText, 10) : undefined;
  const { nearRange: nearRangeText, farRange: farRangeText } =
    rangeRegExp.exec(toHitText)?.groups ?? {};
  const nearRange = nearRangeText ? parseInt(nearRangeText, 10) : undefined;
  const farRange = farRangeText ? parseInt(farRangeText, 10) : undefined;
  const { target } = targetRegExp.exec(toHitText)?.groups ?? {};

  // This is more reliable than regexp because sometimes the punctuation is off
  // const { nearReach, farReach, target } =
  //   parseRegExpGroups("attackHitRegExp", attackHitRegExp, toHitText);
  // const [, remainder1] = toHitText.split("reach");
  // const [reach, remainder2] = remainder1.split("ft.");
  // let nearReach: number | undefined;
  // let farReach: number | undefined;
  // if (reach.includes("/")) {
  //   const [near, far] = reach.split("/");
  //   nearReach = parseInt(near, 10);
  //   farReach = parseInt(far, 10);
  // } else {
  //   nearReach = parseInt(reach, 10);
  // }
  // let target = remainder2;
  // while (/[.,\s]/.test(target.charAt(0))) {
  //   target = target.substring(1);
  // }
  // // Trim trailing period
  // target = target.substring(0, target.length - 1);

  let onHit: Action["attack"]["onHit"];
  const damageElement = entry.querySelector('[data-rolltype="damage"]');
  if (damageElement) {
    const amount = damageElement.getAttribute("data-dicenotation");
    const damageType = damageElement.getAttribute("data-rolldamagetype");

    onHit = {
      amount,
      type: damageType as DamageType,
    };

    let effect = getRemainingText(damageElement);
    [, effect = ""] = effect.split(`${damageType} damage. `);
    effect = effect.trim();
    if (effect) {
      onHit.effect = effect;
    }
  }

  let type: Action["attack"]["type"];
  switch (attackMode) {
    case "Melee":
    case "Ranged":
    case "Melee or Ranged":
      type = attackMode.toLowerCase() as Action["attack"]["type"];
      break;
    default:
      throw new Error(`Failed to determine attack type from ${attackMode}`);
  }

  const attack: Action["attack"] = {
    type,
    toHit: {
      modifier,
      target,
    },
    onHit,
  };
  if (attackMethod === "Weapon") {
    attack.weapon = true;
  }
  if (reach) {
    attack.toHit.reach = reach;
  }
  if (farRange) {
    attack.toHit.range = [nearRange, farRange];
  } else {
    attack.toHit.range = nearRange;
  }
  return attack;
}
