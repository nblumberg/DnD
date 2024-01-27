import {
  AbilitiesList,
  AbilityType,
  CreatureType,
  CreatureTypes,
  DamageType,
  Spell,
  SpellRanges,
  SpellShape,
  SpellShapes,
} from "creature";
import { writeFileSync } from "fs";
import { JSDOM } from "jsdom";
import { join } from "path";
import { getElementText } from "./dom";
import { FatalParseError, NotPurchasedError, ParseError } from "./error";
import { fileRelativeToData } from "./root";
import { parseRegExpGroups } from "./utils";

const baseFilePath = fileRelativeToData("spells");

function getField(spellDetails: HTMLElement, selector: string): string {
  const element = spellDetails.querySelector(selector);
  if (!element) {
    throw new FatalParseError(`Could not find ${selector}`);
  }
  return getElementText(element).trim();
}

const materialComponentsRegExp = /\((?<materials>[^)]+)\)/;
const materialGPRegExp = /worth\s+at\s+least\s+(?<gp>[\d,]+)\s+gp/;
const damageRegExp = /(?<amount>\d+d\d+([-+]\d+)?)\s+(?<type>\w+)\s+damage/g;

export function parseSpellHTML(
  rawHTML: string,
  name: string,
  url: string
): void {
  const {
    window: { document },
  } = new JSDOM(rawHTML);
  const spellDetails: HTMLElement | null = document.querySelector(
    ".spell-details .details-more-info"
  );
  if (!spellDetails) {
    if (document.querySelector(".marketplace-button--add-to-cart")) {
      throw new NotPurchasedError(name);
    }
    throw new ParseError(`Could not find ${name} spell details`);
  }

  try {
    const levelText = getField(
      spellDetails,
      ".ddb-statblock-item-level .ddb-statblock-item-value"
    );
    const level =
      levelText.trim() === "Cantrip"
        ? 0
        : (parseInt(levelText, 10) as Spell["level"]);

    const school = getField(
      spellDetails,
      ".ddb-statblock-item-school .ddb-statblock-item-value"
    ) as Spell["school"];
    if (!school) {
      throw new FatalParseError(`Could not find school`);
    }

    const castingTimeText = getField(
      spellDetails,
      ".ddb-statblock-item-casting-time .ddb-statblock-item-value"
    ).toLowerCase();
    const castingTimeCount = parseInt(castingTimeText, 10) ?? 1;
    const castingTimePeriod = [
      "bonus action",
      "action",
      "reaction",
      "minute",
      "hour",
      "day",
    ].find((period) =>
      castingTimeText.includes(period)
    ) as Spell["castingTime"]["period"];
    const ritual = !!spellDetails.querySelector(
      ".ddb-statblock-item-casting-time .ddb-statblock-item-value .i-ritual"
    );

    const components: Spell["components"] = {};
    const componentsText = getField(
      spellDetails,
      ".ddb-statblock-item-components .ddb-statblock-item-value"
    );
    if (componentsText.includes("V")) {
      components.V = true;
    }
    if (componentsText.includes("S")) {
      components.S = true;
    }
    if (componentsText.includes("M")) {
      const materialsText = getField(spellDetails, ".components-blurb");
      const { materials } = parseRegExpGroups(
        "materialComponentsRegExp",
        materialComponentsRegExp,
        materialsText
      );
      components.M = materials;
      const { gp } = parseRegExpGroups(
        "materialGPRegExp",
        materialGPRegExp,
        materialsText,
        true
      );
      if (gp) {
        components.gp = parseInt(gp.replace(",", ""), 10);
      }
    }

    const durationText = getField(
      spellDetails,
      ".ddb-statblock-item-duration .ddb-statblock-item-value"
    ).toLowerCase();
    const specialDurations = [
      "instantaneous",
      "permanent",
      "until dispelled",
      "special",
    ];
    let duration: Spell["duration"] = specialDurations.find((durationType) =>
      durationText.includes(durationType)
    ) as Spell["duration"];
    if (!duration) {
      const durationCount = parseInt(durationText, 10) ?? 1;
      const times = {
        round: 1,
        minute: 10,
        hour: 600,
        day: 14400,
      };
      const durationPeriod = Object.keys(times).find((period) =>
        durationText.includes(period)
      ) as keyof typeof times;
      if (!durationPeriod) {
        throw new FatalParseError(`Could not find duration period`);
      }
      duration = durationCount * times[durationPeriod];
    }
    const concentration = !!spellDetails.querySelector(
      ".ddb-statblock-item-duration .ddb-statblock-item-value .i-concentration"
    );

    let range: Spell["range"];
    const rangeAreaText = getField(
      spellDetails,
      ".ddb-statblock-item-range-area .ddb-statblock-item-value"
    ).toLowerCase();
    const fixedRange = SpellRanges.find((rangeType) =>
      rangeAreaText.includes(rangeType)
    );
    if (fixedRange) {
      range = fixedRange;
    } else {
      // const rangeDistanceText = getField(
      //   spellDetails,
      //   ".ddb-statblock-item-range-area .ddb-statblock-item-value .range-distance"
      // ).toLowerCase();
      range = parseInt(rangeAreaText, 10);
    }

    let area: Spell["area"];
    const areaElement = spellDetails.querySelector(
      ".ddb-statblock-item-range-area .ddb-statblock-item-value .aoe-size"
    );
    if (areaElement) {
      area = {
        size: 0,
        shape: "cube",
      };
      area.shape = SpellShapes.find((shapeType) =>
        areaElement.querySelector(`.i-aoe-${shapeType}`)
      ) as SpellShape;
      if (!area.shape && !!areaElement.querySelector("sup")) {
        // See Forbiddance Touch (40,0000 ft2)
        const areaText = getElementText(areaElement)
          .replace(areaElement.querySelector("sup")!.outerHTML, "")
          .trim();
        area.size = parseInt(areaText.replaceAll(/\D/g, ""), 10);
        area.shape = "square";
      }
      if (!area.shape) {
        throw new ParseError(`Could not find area shape`);
      }
    }

    const materialComponentsElement =
      spellDetails.querySelector(".components-blurb")?.outerHTML;
    const description = getField(spellDetails, ".more-info-content")
      .replace(materialComponentsElement ?? "", "")
      .trim();

    let resist: Spell["resist"];
    const attackSaveElement = spellDetails.querySelector(
      ".ddb-statblock-item-attack-save .ddb-statblock-item-value"
    );
    if (!attackSaveElement) {
      throw new ParseError(`Could not find attack/save`);
    }
    const dcType = AbilitiesList.find(
      (ability) => !!attackSaveElement.querySelector(`.i-${ability}-save`)
    ) as AbilityType;
    if (dcType) {
      resist = {
        dc: 0,
        dcType,
      };
      if (description.includes("or half as much damage on a successful one")) {
        resist.halfDamage = true;
      }
    } else if (!!attackSaveElement.querySelector(".i-spell-melee")) {
      resist = "melee";
    } else if (!!attackSaveElement.querySelector(".i-spell-ranged")) {
      resist = "ranged";
    }

    let damage: Spell["damage"];
    let match;
    while ((match = damageRegExp.exec(description)) !== null) {
      if (!damage) {
        damage = [];
      }
      const { amount, type } = match.groups!;
      damage.push({
        amount,
        type: type as DamageType,
      });
    }

    let unaffected: Spell["unaffected"];
    if (description.includes("aren’t affected")) {
      unaffected = [];
      // Get the start of the sentence
      const targets =
        description
          .split("aren’t affected")[0]
          .split(".")
          .pop()
          ?.toLowerCase() ?? "";
      CreatureTypes.forEach((creatureType: CreatureType) => {
        if (targets.includes(creatureType)) {
          // @ts-expect-error ts2345
          unaffected.push(creatureType); // TODO: why is this an error?
        }
      });
    }

    const tags = Array.from(spellDetails.querySelectorAll(".spell-tag")).map(
      getElementText
    );
    const classes = Array.from(spellDetails.querySelectorAll(".class-tag")).map(
      getElementText
    );

    const source = getField(spellDetails, ".spell-source");

    const spell: Spell = {
      id: url.split("/").pop()!,
      name,
      level,
      school,
      castingTime: {
        count: castingTimeCount,
        period: castingTimePeriod,
      },
      components,
      resist,
      range,
      area,
      duration,

      description,

      damage,
      unaffected,

      classes,
      tags,
      source,
    };
    if (ritual) {
      spell.ritual = true;
    }
    if (concentration) {
      spell.concentration = true;
    }

    const filePath = join(baseFilePath, `${name}.json`);
    writeFileSync(filePath, JSON.stringify(spell, null, 2), "utf8");
    console.log(`\tWrote ${filePath}`);
  } catch (e) {
    throw new ParseError((e as Error).stack ?? "[missing stack]");
  }
}
