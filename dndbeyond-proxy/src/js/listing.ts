import { JSDOM } from "jsdom";

import { ajax } from "./ajax";
import { getElementText } from "./dom";
import { findEntries as findMonsters } from "./monsters";

type PathParam = "items" | "monsters" | "magic-items" | "spells";

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
  // console.log("findEntries");
  if (pathParam === "monsters") {
    const names = await findMonsters(dom);
    return names;
  }
  return [];
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
