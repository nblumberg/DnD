import { JSDOM } from "jsdom";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "path";
import { ajax } from "./ajax";
import { getElementText, stripScripts } from "./dom";
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

async function saveHtml(
  type: string,
  name: string,
  href: string
): Promise<void> {
  const path = type === "equipment" ? "equipment" : `${type.toLowerCase()}s`;
  const baseFilePath = fileRelativeToData(path);

  const url = href.startsWith(baseUrl) ? href : `${baseUrl}${href}`;
  const rawHTML = await ajax(
    url,
    {
      Referer: join(baseUrl, path),
    },
    `${type} ${name}`
  );
  console.log(`${type.charAt(0).toUpperCase()}${type.slice(1)} ${name}`);

  const trimmedHTML = stripScripts(new JSDOM(rawHTML));
  const filePath = join(baseFilePath, "html", `${name}.html`);
  const data = { name, url };
  if (!existsSync(dirname(filePath))) {
    mkdirSync(dirname(filePath), { recursive: true });
  }
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
  // Change from plural path name to singular and ignore anything before the dash
  // magic-items -> magic-item
  const type =
    path === "equipment"
      ? "equipment"
      : path.toLowerCase().substring(0, path.length - 1);
  const listingBody = document.querySelector(
    "#content .listing-body"
  ) as HTMLDivElement;
  if (!listingBody) {
    throw new Error("Could not find listing body");
  }
  // console.log("listing-body", listingBody.innerHTML);
  const rows: HTMLElement[] = Array.from(
    listingBody.querySelectorAll(
      // ".listing [data-slug]"
      ".list-row"
    )
  );
  if (!rows.length) {
    throw new Error("Found no entries in listing body");
  }
  // console.log("Entries", entries.length);
  const entries: Record<string, string> = {};
  const promises = rows.map((row) => {
    let nameCell: HTMLAnchorElement | null = row.querySelector(
      // Ignore anything before the dash
      // magic-item -> item
      ".list-row-name .link"
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
    // Get rid of the rarity element
    const textElement: HTMLElement = (
      nameCell.childElementCount ? nameCell.firstElementChild : nameCell
    ) as HTMLElement;
    const name = getElementText(textElement).trim();
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
