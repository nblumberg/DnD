type JournalItem = string | JournalFolder;

interface JournalFolder {
  n: string;
  id: string;
  i: JournalItem[];
}

function insertAfter(
  items: JournalItem[],
  targetId: string,
  newIds: string[]
): boolean {
  for (let i = 0; i < items.length; i++) {
    if (items[i] === targetId) {
      items.splice(i + 1, 0, ...newIds);
      return true;
    }
    const item = items[i];
    if (typeof item === "object" && insertAfter(item.i, targetId, newIds)) {
      return true;
    }
  }
  return false;
}

export function addDuplicatesToFolder(
  originalId: string,
  duplicateIds: string[],
  debug: (...args: unknown[]) => void
): void {
  const campaign = Campaign();
  let journal: JournalItem[];
  try {
    journal = JSON.parse(campaign.get("journalfolder")) as JournalItem[];
  } catch {
    debug("Could not parse journalfolder; skipping folder organization");
    return;
  }

  if (!insertAfter(journal, originalId, duplicateIds)) {
    debug(`Original character ${originalId} not found in journal folder; skipping folder organization`);
    return;
  }

  campaign.set("journalfolder", JSON.stringify(journal));
}
