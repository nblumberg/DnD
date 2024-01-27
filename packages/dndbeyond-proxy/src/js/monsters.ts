import { AlignmentParam, CreatureParams } from "creature";
import { writeFileSync } from "fs";
import { JSDOM } from "jsdom";
import { join } from "path";
import { NotPurchasedError, ParseError } from "./error";
import { getAbility } from "./monster/abilities";
import { getActions } from "./monster/actions";
import { getAttributes } from "./monster/attributes";
import { getImage } from "./monster/image";
import { getMeta } from "./monster/meta";
import { Spells, getSpells } from "./monster/spells";
import { getTidbits } from "./monster/tidbits";
import { fileRelativeToData } from "./root";

const baseFilePath = fileRelativeToData("monsters");

// function handleError(error: string): void {
//   console.error(`\t${error}`);
//   throw new MonsterError(error);
// }

export function parseMonsterHTML(
  rawHTML: string,
  name: string,
  url: string
): void {
  const {
    window: { document },
  } = new JSDOM(rawHTML);
  const monsterDetails: HTMLElement | null = document.querySelector(
    ".monster-details .details-more-info"
  );
  if (!monsterDetails) {
    if (document.querySelector(".marketplace-button--add-to-cart")) {
      throw new NotPurchasedError(name);
    }
    throw new ParseError(`Could not find ${name} monster details`);
  }

  const image = getImage(monsterDetails);

  const statBlock: HTMLElement | null = monsterDetails.querySelector(
    ".detail-content .mon-stat-block"
  );
  if (!statBlock) {
    throw new ParseError(`Could not find ${name} monster stat block`);
  }

  try {
    const { size, type, subtype, alignment, swarm } = getMeta(statBlock);

    const { ac, hp, hd, speeds } = getAttributes(statBlock);

    const abilitiesParent: HTMLElement | null =
      statBlock.querySelector(".ability-block");
    if (!abilitiesParent) {
      throw new ParseError(`Could not find ${name} abilities`);
    }
    const str = getAbility(abilitiesParent, "str");
    const dex = getAbility(abilitiesParent, "dex");
    const con = getAbility(abilitiesParent, "con");
    const int = getAbility(abilitiesParent, "int");
    const wis = getAbility(abilitiesParent, "wis");
    const cha = getAbility(abilitiesParent, "cha");

    const {
      saves,
      skills,
      senses,
      languages,
      cr,
      proficiency,
      damageVulnerabilities,
      damageResistances,
      damageImmunities,
      conditionImmunities,
    } = getTidbits(name, statBlock, hd);

    let description = "";
    const monsterDescription: HTMLElement | null = monsterDetails.querySelector(
      ".mon-details__description-block-content"
    );
    if (monsterDescription) {
      description = monsterDescription.innerHTML.trim();
    }

    let environment: string[] = [];
    const environmentTagElements = Array.from(
      monsterDetails.querySelectorAll(".environment-tag")
    );
    if (environmentTagElements.length) {
      environment = environmentTagElements.map(
        (element) => element.textContent?.trim() ?? ""
      );
    }

    let source = "";
    const sourceElement: HTMLElement | null =
      monsterDetails.querySelector(".monster-source");
    if (sourceElement) {
      source = sourceElement.textContent?.trim() ?? "";
    }

    const { features, ...actions } = getActions(monsterDetails);

    const spells: Spells | undefined = getSpells(monsterDetails);

    const creature: CreatureParams = {
      name,
      url,
      image: image ?? "",
      size,
      type,
      subtype,
      alignment: alignment ?? AlignmentParam.ANY,
      ac,
      hp,
      hd,
      speeds,
      str,
      dex,
      con,
      int,
      wis,
      cha,
      saves,
      damageVulnerabilities,
      damageResistances,
      damageImmunities,
      conditionImmunities,
      skills,
      senses,
      languages,
      cr,
      proficiency,
      description,
      environment,
      source,
      features,
      actions,
      spells,
      swarm,
    };

    const filePath = join(baseFilePath, `${name}.json`);
    writeFileSync(filePath, JSON.stringify(creature, null, 2), "utf8");
    console.log(`\tWrote ${filePath}`);
  } catch (e) {
    throw new ParseError((e as Error).stack ?? "[missing stack]");
  }
}
