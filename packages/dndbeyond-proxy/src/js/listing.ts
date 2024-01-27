import axios from "axios";
import { writeFileSync } from "fs";
import { JSDOM } from "jsdom";
import { join } from "path";
import { ajax } from "./ajax";
import { addAuthHeader } from "./auth";
import { getElementText, stripScripts } from "./dom";
import { FatalParseError } from "./error";
import { PathParam, fileRelativeToData } from "./root";

async function getPage(pathParam: PathParam, page: number): Promise<JSDOM> {
  const rawHtml = await ajax(
    `https://www.dndbeyond.com/${pathParam}${page > 1 ? `?page=${page}` : ""}`,
    undefined,
    `Page ${page}`
  );
  console.log(`${pathParam} page ${page}`);
  const dom = new JSDOM(rawHtml);
  return dom;
}

function findTotalPages({ window: { document } }: JSDOM): number {
  try {
    const listingFooter: HTMLElement | null =
      document.querySelector(".listing-footer");
    if (!listingFooter) {
      throw new Error("Could not find listing footer");
    }
    const pages: HTMLLIElement[] = Array.from(
      listingFooter.querySelectorAll(
        "li.b-pagination-item:not(.b-pagination-item-next)"
      )
    );
    if (!pages.length) {
      throw new Error("Found no pages in listing footer");
    }
    const lastPageParent = pages.pop();
    if (!lastPageParent) {
      throw new Error("Could not find last page button");
    }
    // console.log(lastPageParent.outerHTML);
    const lastPage: HTMLElement | null =
      lastPageParent.querySelector(".b-pagination-item");
    if (!lastPage) {
      throw new Error("Couldn't find last page element");
    }
    const totalPages = parseInt(getElementText(lastPage), 10);
    return totalPages;
  } catch (e) {
    console.error("Failed to find total pages", e);
    throw e;
  }
}

const baseUrl = "https://www.dndbeyond.com";

const defaultHeaders = {
  Accept: `text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7`,
  "Accept-Encoding": "gzip, deflate, br",
  "Accept-Language": "en-US,en;q=0.9,nb;q=0.8",
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

async function saveHtml(
  type: string,
  name: string,
  href: string
): Promise<void> {
  const path = `${type.toLowerCase()}s`;
  const baseFilePath = fileRelativeToData(path);

  const url = href.startsWith(baseUrl) ? href : `${baseUrl}${href}`;
  let response: axios.AxiosResponse;
  try {
    response = await axios.get(url, {
      headers: addAuthHeader({
        ...defaultHeaders,
        Referer: join(baseUrl, path),
      }),
    });
  } catch (e) {
    console.error(`${type} ${name} request failed: ${e}`);
    throw e;
  }
  // const response = await fetch(url, addAuthHeader(monsterHeaders));
  if (response.status !== 200) {
    throw new FatalParseError(
      `${type} ${name} request received a ${response.status} ${response.statusText} response`
    );
  } else {
    console.log(`Spell ${name}`);
  }
  const rawHTML = response.data as string;

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
}

async function findEntries(
  path: PathParam,
  { window: { document } }: JSDOM
): Promise<string[]> {
  const type = path.toLowerCase().substring(0, path.length - 1);
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
      `.${type.toLowerCase()}-name .name .link`
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
    return saveHtml(type, name, href);
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

export async function listEntries(pathParam: PathParam, startingPage = 1) {
  const entries: string[] = [];
  let page = startingPage;

  let dom = await getPage(pathParam, page);
  if (!dom) {
    console.error("Missing DOM");
    return;
  }
  const totalPages = findTotalPages(dom);

  try {
    const names = await findEntries(pathParam, dom);
    entries.push(...names);
  } catch (e) {
    console.error(`Error parsing entries on page ${page}`, e);
    throw e;
  }

  for (++page; page <= totalPages; page++) {
    dom = await getPage(pathParam, page);

    try {
      const names = await findEntries(pathParam, dom);
      entries.push(...names);
    } catch (e) {
      console.error(`Error parsing entries on page ${page}`, e);
      throw e;
    }
  }
  console.log("pages", page - 1);
}
