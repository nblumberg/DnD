import {
  existsSync,
  readdirSync,
  readFileSync,
  unlinkSync,
  writeFileSync,
} from "fs";
import { join } from "path";

import axios from "axios";
import { JSDOM } from "jsdom";

import { AlignmentParam, CreatureParams } from "creature";
import { addAuthHeader } from "./auth";
import { getElementText, stripScripts } from "./dom";
import { getAbility } from "./monster/abilities";
import { getActions } from "./monster/actions";
import { getAttributes } from "./monster/attributes";
import { getImage } from "./monster/image";
import { getMeta } from "./monster/meta";
import { getSpells, Spells } from "./monster/spells";
import { getTidbits } from "./monster/tidbits";
import { parseRegExpGroups } from "./utils";

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

const baseFilePath = join(__dirname, "..", "..", "data", "monsters");

class MonsterError extends Error {
  constructor(message: string, props?: Record<string, any>) {
    super(message);
    console.error(`\t${message}`);
    if (props) {
      Object.assign(this, props);
    }
  }
}

class FatalMonsterError extends MonsterError {
  constructor(message: string, props: Record<string, any> = {}) {
    super(message, { ...props, fatal: true });
  }
}

class NotPurchasedError extends MonsterError {
  constructor(name: string) {
    super(`${name} has not been purchased`, { purchased: false });
  }
}

// function handleError(error: string): void {
//   console.error(`\t${error}`);
//   throw new MonsterError(error);
// }

const cacheResponse = true;

export async function readMonster(name: string, href: string): Promise<void> {
  // console.log(`readMonster(${name}, ${href})`);
  const url = href.startsWith(baseUrl) ? href : `${baseUrl}${href}`;
  let response: axios.AxiosResponse;
  try {
    response = await axios.get(url, {
      headers: addAuthHeader(monsterHeaders),
    });
  } catch (e) {
    console.error(`Monster ${name} request failed: ${e}`);
    throw e;
  }
  // const response = await fetch(url, addAuthHeader(monsterHeaders));
  if (response.status !== 200) {
    throw new FatalMonsterError(
      `Monster ${name} request received a ${response.status} ${response.statusText} response`
    );
  } else {
    console.log(`Monster ${name}`);
  }
  const rawHTML = response.data as string;

  if (cacheResponse) {
    const trimmedHTML = stripScripts(new JSDOM(rawHTML));
    const filePath = join(baseFilePath, "html", `${name}.html`);
    const data = { name, url };
    writeFileSync(
      filePath,
      `${trimmedHTML}\n<!-- ORIGINAL_REQUEST_DATA: ${JSON.stringify(
        data,
        null,
        2
      )} -->`,
      "utf8"
    );
    console.log(`\tWrote ${filePath}`);
  } else {
    parseMonsterHTML(rawHTML, name, url);
  }
}

function parseMonsterHTML(rawHTML: string, name: string, url: string): void {
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
    throw new MonsterError(`Could not find ${name} monster details`);
  }

  const image = getImage(monsterDetails);

  const statBlock: HTMLElement | null = monsterDetails.querySelector(
    ".detail-content .mon-stat-block"
  );
  if (!statBlock) {
    throw new MonsterError(`Could not find ${name} monster stat block`);
  }

  try {
    const { size, type, subtype, alignment, swarm } = getMeta(statBlock);

    const { ac, hp, hd, speeds } = getAttributes(statBlock);

    const abilitiesParent: HTMLElement | null =
      statBlock.querySelector(".ability-block");
    if (!abilitiesParent) {
      throw new MonsterError(`Could not find ${name} abilities`);
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
    throw new MonsterError((e as Error).stack ?? "[missing stack]");
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
    const nameCell: HTMLAnchorElement | null = row.querySelector(
      ".monster-name .name .link"
    );
    if (!nameCell) {
      throw new Error("Couldn't find name element");
    }
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
  const outcomes = await Promise.allSettled(promises);
  const authFailure = outcomes.find(
    (outcome) =>
      outcome.status === "rejected" &&
      (outcome.reason as axios.AxiosError)?.response?.status === 403
  );
  if (authFailure) {
    throw new Error("Auth failed");
  }
  return Object.keys(entries);
}

const originalRequestRegExp =
  /<!-- ORIGINAL_REQUEST_DATA: (?<data>[^}]+}) -->$/m;

const bookmarkFile = join(baseFilePath, ".last-written");

export function readMonsters(names?: string[], startAfter?: string): void {
  const htmlPath = join(baseFilePath, "html");
  const files = names?.map((name) => `${name}.html`) ?? readdirSync(htmlPath);
  if (!startAfter && existsSync(bookmarkFile)) {
    startAfter = readFileSync(bookmarkFile, "utf8");
  }
  let skip = startAfter && !names;
  for (const filename of files) {
    if (skip) {
      if (filename.endsWith(`${startAfter}.html`)) {
        skip = false;
      }
      continue;
    }
    if (
      !names &&
      existsSync(join(baseFilePath, filename.replace(".html", ".json")))
    ) {
      continue;
    }
    // checkMemoryUsage();
    try {
      const rawHtml = readFileSync(join(htmlPath, filename), "utf8");
      const { data } = parseRegExpGroups(
        "originalRequestRegExp",
        originalRequestRegExp,
        rawHtml
      );
      const { name, url } = JSON.parse(data);
      console.log(name);
      parseMonsterHTML(rawHtml, name, url);
      writeFileSync(bookmarkFile, name, "utf8");
    } catch (e) {
      // ignore errors
      if ((e as any).purchased === false) {
        continue;
      }
      throw e;
    }
  }
  if (!names) {
    unlinkSync(bookmarkFile);
  }
}
