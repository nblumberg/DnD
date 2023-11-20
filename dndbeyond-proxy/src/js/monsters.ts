import { writeFileSync } from "fs";
import { join } from "path";

import axios from "axios";
import { JSDOM } from "jsdom";

import { addAuthHeader } from "./auth";
import { getElementText } from "./dom";
import { getAbility } from "./monster/abilities";
import { getActions } from "./monster/actions";
import { getAttributes } from "./monster/attributes";
import { getMeta } from "./monster/meta";
import { Spells, getSpells } from "./monster/spells";
import { getTidbits } from "./monster/tidbits";

const baseUrl = "https://www.dndbeyond.com";

const monsterHeaders = {
  Accept: `text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7`,
  "Accept-Encoding": "gzip, deflate, br",
  "Accept-Language": "en-US,en;q=0.9,nb;q=0.8",
  Referer: "https://www.dndbeyond.com/monsters",
  "Sec-Ch-Ua": `"Google Chrome";v="119", "Chromium";v="119", "Not?A_Brand";v="24"`,
  "Sec-Ch-Ua-Mobile": "?0",
  "Sec-Ch-Ua-Platform": `"macOS"`,
  "Sec-Fetch-Dest": "document",
  "Sec-Fetch-Mode": "navigate",
  "Sec-Fetch-Site": "same-origin",
  "Sec-Fetch-User": "?1",
  "Upgrade-Insecure-Requests": "1",
  "User-Agent": `Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36`,
};

function handleError(error: string): void {
  console.error(`\t${error}`);
  throw new Error(error);
}

export async function readMonster(name: string, href: string): Promise<void> {
  const url = href.startsWith(baseUrl) ? href : `${baseUrl}${href}`;
  const response = await axios.get(url, {
    headers: addAuthHeader(monsterHeaders),
  });
  // const response = await fetch(url, addAuthHeader(monsterHeaders));
  if (response.status !== 200) {
    handleError(
      `Monster ${name} request received a ${response.status} ${response.statusText} response`
    );
    throw new Error(`Failed to get monster ${name}`);
  } else {
    console.log(`Monster ${name}`);
  }
  const rawHTML = response.data as string;
  // const rawHTML = await response.text();
  const {
    window: { document },
  } = new JSDOM(rawHTML);
  const monsterDetails: HTMLElement = document.querySelector(
    ".monster-details .details-more-info"
  );
  if (!monsterDetails) {
    if (document.querySelector(".marketplace-button--add-to-cart")) {
      handleError(`${name} has not been purchased`);
    }
    handleError(`Could not find ${name} monster details`);
  }

  const image = (
    monsterDetails.querySelector(
      ".details-aside .image img.monster-image"
    ) as HTMLImageElement
  )?.src;

  const statBlock: HTMLElement = monsterDetails.querySelector(
    ".detail-content .mon-stat-block"
  );
  if (!statBlock) {
    handleError(`Could not find ${name} monster stat block`);
  }

  try {
    const { size, type, subtype, alignment } = getMeta(statBlock);

    const { ac, hp, hd, speeds } = getAttributes(statBlock);

    const abilitiesParent: HTMLElement =
      statBlock.querySelector(".ability-block");
    if (!abilitiesParent) {
      handleError(`Could not find ${name} abilities`);
    }
    const str = getAbility(abilitiesParent, "str");
    const dex = getAbility(abilitiesParent, "dex");
    const con = getAbility(abilitiesParent, "con");
    const int = getAbility(abilitiesParent, "int");
    const wis = getAbility(abilitiesParent, "wis");
    const cha = getAbility(abilitiesParent, "cha");

    const { saves, skills, senses, languages, cr, proficiency } = getTidbits(
      name,
      statBlock
    );

    let description: string;
    const monsterDescription: HTMLElement = monsterDetails.querySelector(
      ".mon-details__description-block-content"
    );
    if (monsterDescription) {
      description = monsterDescription.innerHTML.trim();
    }

    let environment: string[];
    const environmentTagElements: Element[] = Array.from(
      monsterDetails.querySelectorAll(".environment-tag")
    );
    if (environmentTagElements.length) {
      environment = environmentTagElements.map((element) =>
        element.textContent.trim()
      );
    }

    let source: string;
    const sourceElement: HTMLElement =
      monsterDetails.querySelector(".monster-source");
    if (sourceElement) {
      source = sourceElement.textContent.trim();
    }

    const { features, ...actions } = getActions(monsterDetails);

    const spells: Spells | undefined = getSpells(monsterDetails);

    const creature = {
      name,
      image,
      size,
      type,
      subtype,
      alignment,
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
    };

    const filePath = join(
      __dirname,
      "..",
      "..",
      "data",
      "monsters",
      `${name}.json`
    );
    writeFileSync(filePath, JSON.stringify(creature, null, 2), "utf8");
    console.log(`\tWrote ${filePath}`);
  } catch (e) {
    handleError(e.toString());
  }
}

export async function findEntries({
  window: { document },
}: JSDOM): Promise<string[]> {
  const listingBody = document.querySelector(".listing-body") as HTMLDivElement;
  if (!listingBody) {
    throw new Error("Could not find listing body");
  }
  // console.log("listing-body", listingBody.innerHTML);
  const rows: HTMLElement[] = Array.from(
    listingBody.querySelectorAll(".listing [data-slug]")
  );
  if (!rows.length) {
    throw new Error("Found no entries in listing body");
  }
  // console.log("Entries", entries.length);
  const entries: Record<string, string> = {};
  const promises = rows.map((row) => {
    const nameCell: HTMLAnchorElement = row.querySelector(
      ".monster-name .name .link"
    );
    // console.log(
    //   `${nameCell.tagName}${nameCell.id ? `#${nameCell.id}` : ""}.${
    //     nameCell.classList.value
    //   }`,
    //   nameCell.outerHTML
    // );
    const { href } = nameCell;
    const name = getElementText(nameCell);
    entries[name] = href;
    return readMonster(name, href);
  });
  await Promise.allSettled(promises);
  return Object.keys(entries);
}
