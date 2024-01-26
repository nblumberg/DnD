import { Action, Attack, AttackType, DamageType } from "creature";
import { getElementText, getRemainingText } from "../dom";
import { parseRegExpGroups } from "../utils";

const attackTypeRegExp =
  /(?<attackMode>Melee or Ranged|Melee|Ranged)\s+(?<attackMethod>Weapon|Spell)?\s*Attack/;

const toHitRegExp =
  /((?<modifier>\d+)\s+to\s+hit)|(?<automaticHit>automatic\s+hit)/;

// to hit, reach 5 ft., one target.
// to hit, reach 10 ft. one target.
// to hit, reach 5 ft. or range 30/120 ft., one target.
// to hit, reach 5 ft. or range 20/60 ft., one target.
// to hit, reach 5 ft. or range 120 ft., one target.
// to hit, range 60 ft., one target.
const reachRegExp = /reach\s+(?<reach>\d+)\s*f(ee)?t/;
const rangeRegExp =
  /ranged?\s+(?<nearRange>\d+)(\s*\/\s*(?<farRange>\d+))?\s+f(ee)?t/;
const mistakeRangeRegExp =
  /reach\s+(?<nearRange>\d+)(\s*\/\s*(?<farRange>\d+))?\s+f(ee)?t/;
const targetRegExp = /,\s+(?<target>[^.]+)\.\s+/;
// const attackHitRegExp =
//   /^\s*to\s+hit,\s+reach\s+(?<nearReach>\d+)\s*\/?\s*(?<farReach>\d+)?\s+ft\.,?\s+(?<target>.+).:$/;

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

  let type: AttackType;
  switch (attackMode) {
    case "Melee":
    case "Ranged":
    case "Melee or Ranged":
      type = attackMode.toLowerCase() as AttackType;
      break;
    default:
      throw new Error(`Failed to determine attack type from ${attackMode}`);
  }

  const toHit =
    entry.querySelector('[data-rolltype="to hit"]') ??
    entry.querySelector('[data-rolltype="spell"]'); // See Bavlorna Blightstraw Withering Ray attack

  let modifier: number | "∞";
  let [toHitText] = entry.textContent?.split("Hit:") ?? [""];
  if (toHit) {
    modifier = parseInt(getElementText(toHit), 10);
    // toHitText = toHit.nextSibling.textContent.trim();
    // toHitText = getRemainingText(toHit);
  } else {
    // Fall back to RegExp
    const { modifier: modifierText, automaticHit } = parseRegExpGroups(
      "toHitRegExp",
      toHitRegExp,
      toHitText
    );
    modifier = automaticHit ? "∞" : parseInt(modifierText, 10);
    [, toHitText] = toHitText.split(modifierText || "automatic hit");
  }

  const { reach: reachText } = parseRegExpGroups(
    "reachRegExp",
    reachRegExp,
    toHitText,
    true
  );
  let reach: number | "∞" | undefined = reachText
    ? parseInt(reachText, 10)
    : undefined;
  let { nearRange: nearRangeText, farRange: farRangeText } = parseRegExpGroups(
    "rangeRegExp",
    rangeRegExp,
    toHitText,
    true
  );
  if (!nearRangeText && type === "ranged") {
    const name = nameElement.textContent?.trim() ?? "";
    if (name === "Drop." || name === "Dropped Rock.") {
      // See Piercer, https://www.dndbeyond.com/monsters/17191-piercer Drop, Winged Kobold, https://www.dndbeyond.com/monsters/17210-winged-kobold, Dropped Rock
      reach = "∞";
    } else {
      // See Storm Giant Skeleton, https://www.dndbeyond.com/monsters/1528984-storm-giant-skeleton, Rock
      ({ nearRange: nearRangeText, farRange: farRangeText } = parseRegExpGroups(
        "mistakeRangeRegExp",
        mistakeRangeRegExp,
        toHitText
      ));
    }
  }
  const nearRange = nearRangeText ? parseInt(nearRangeText, 10) : undefined;
  const farRange = farRangeText ? parseInt(farRangeText, 10) : undefined;
  if (!reach && !nearRange) {
    throw new Error(`Monster attack lacks a reach or a range`);
  }
  const { target } = parseRegExpGroups("targetRegExp", targetRegExp, toHitText);

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

  let onHit: Attack["onHit"] = {
    damage: [],
    effects: [],
  };
  const damageElements = entry.querySelectorAll('[data-rolltype="damage"]');
  for (const damageElement of damageElements) {
    const amount = damageElement.getAttribute("data-dicenotation") || "";
    const damageType = damageElement.getAttribute("data-rolldamagetype");

    onHit.damage.push({
      amount,
      type: damageType as DamageType,
    });

    let effect = getRemainingText(damageElement);
    [, effect = ""] = effect.split(`${damageType} damage. `);
    effect = effect.trim();
    if (effect) {
      // TODO: parse conditions, duration, saving throws, etc.
      onHit.effects!.push({
        description: effect,
      });
    }
  }

  const attack: Attack = {
    name: nameElement.textContent?.trim() ?? "",
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
    attack.toHit.range = [nearRange!, farRange];
  } else {
    attack.toHit.range = nearRange;
  }
  return attack;
}
