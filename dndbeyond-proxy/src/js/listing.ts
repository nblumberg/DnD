import { JSDOM } from "jsdom";

import { addAuthHeader } from "./auth";
import { getElementText } from "./dom";
import { findEntries as findMonsters } from "./monsters";

type PathParam = "items" | "monsters" | "magic-items" | "spells";

async function getPage(pathParam: PathParam, page: number): Promise<JSDOM> {
  const response = await fetch(
    `https://www.dndbeyond.com/${pathParam}${page > 1 ? `?page=${page}` : ""}`,
    addAuthHeader()
  );
  if (response.status !== 200) {
    console.error(
      `Page ${page} request received a ${response.status} ${response.statusText} response`
    );
    throw new Error(`Failed to get page ${page}`);
  } else {
    console.log(`${pathParam} page 1`);
  }
  const rawHtml = await response.text();
  // console.log("Doc", rawHtml);
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
    const totalPages = parseInt(getElementText(lastPage), 10);
    return totalPages;
  } catch (e) {
    console.error("Failed to find total pages", e);
    throw e;
  }
}

async function findEntries(
  pathParam: PathParam,
  dom: JSDOM
): Promise<string[]> {
  if (pathParam === "monsters") {
    const names = await findMonsters(dom);
    return names;
  }
  return [];
}

export async function listEntries(pathParam: PathParam) {
  const entries: string[] = [];
  let page = 1;

  let dom = await getPage(pathParam, page);
  const totalPages = findTotalPages(dom);

  try {
    const names = await findEntries(pathParam, dom);
    console.log(page, names);
    entries.push(...names);
  } catch (e) {
    console.error(`Error parsing entries on page ${page}`, e);
    throw e;
  }

  for (let page = 2; page <= totalPages; page++) {
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
