import { ActionParams } from "creature";
import { getElementText, getRemainingText } from "../dom";
import { parseRegExpGroups } from "../utils";
import { getAttack } from "./attack";

const costRegExp = /(?<name>.+)\s+\((?<cost>.+)\)/;
const rechargeRegExp = /\(?(?<recharge>.+)\)?/;

function appendContinuedDescription(
  priorAction: ActionParams,
  text: string
): void {
  if (priorAction.attack?.onHit?.effect) {
    priorAction.attack.onHit.effect = `${priorAction.attack.onHit.effect}\n${text}`;
  } else {
    priorAction.description = `${priorAction.description ?? ""}\n${text}`;
  }
}

class ContinuedDescription extends Error {
  continuedDescription: true;
  constructor() {
    super(
      "This element doesn't represent its own action, rather it is the continued description of the prior action"
    );
    this.continuedDescription = true;
  }
}

function getAction(entry: Element, defaultName?: string): ActionParams {
  let name: string;
  try {
    const header = entry.querySelector("em") || entry.querySelector("strong");

    let cost: string;
    if (!header) {
      if (defaultName) {
        name = defaultName;
      } else {
        // Combine paragraph with prior action
        throw new ContinuedDescription();
      }
    } else {
      const rechargeElement = header.querySelector(
        '[data-rolltype="recharge"]'
      );
      if (rechargeElement) {
        ({ recharge: cost } = parseRegExpGroups(
          "rechargeRegExp",
          rechargeRegExp,
          getElementText(rechargeElement)
        ));
      }
      if (
        (entry.firstChild as HTMLElement)?.classList?.contains("spell-tooltip")
      ) {
        // See Priest of Osybus (Deathly), https://www.dndbeyond.com/monsters/1680937-priest-of-osybus-deathly Circle of Death
        name = entry.firstChild.textContent.trim();
      } else {
        name = (header.querySelector("strong") || header).textContent.trim();
      }
    }

    if (name.charAt(name.length - 1) === ".") {
      // Trim trailing period
      name = name.substring(0, name.length - 1);
    }

    if (name.includes("(")) {
      ({ name, cost } = parseRegExpGroups("costRegExp", costRegExp, name));
    }

    const action: ActionParams = {
      name,
    };

    if (cost) {
      action.cost = cost;
    }

    const attack: ActionParams["attack"] | undefined = getAttack(entry);
    if (attack) {
      action.attack = attack;
    } else {
      const description = header
        ? getRemainingText(header)
        : getElementText(entry);
      if (description) {
        action.description = description;
      }
    }

    return action;
  } catch (e) {
    if (e.continuedDescription) {
      // (e instanceof ContinuedDescription) { // instanceof Error doesn't work in Babel?
      throw e;
    }
    console.error(`Failed to parse monster action ${name}`, e);
    throw e;
  }
}

export function getActions(
  statBlock: HTMLElement
): Record<string, ActionParams[]> {
  try {
    const actions: Record<string, ActionParams[]> = {};

    const categories = Array.from(
      statBlock.querySelectorAll(
        ".mon-stat-block__description-blocks .mon-stat-block__description-block"
      )
    );
    for (const category of categories) {
      const type =
        getElementText(
          category.querySelector(".mon-stat-block__description-block-heading")
        ).trim() || "features";
      const actionsArray = actions[type]
        ? actions[type]
        : (actions[type] = [] as ActionParams[]);
      const entries = Array.from(
        category.querySelectorAll(
          ".mon-stat-block__description-block-content p"
        )
      );
      for (const entry of entries) {
        try {
          actionsArray.push(
            getAction(entry, !actionsArray.length ? type : undefined)
          );
        } catch (e) {
          if (e.continuedDescription) {
            // instanceof Error doesn't seem to work with Babel?
            // Combine paragraph with prior action
            if (actionsArray.length) {
              appendContinuedDescription(
                actionsArray[actionsArray.length - 1],
                entry.textContent.trim()
              );
            } else {
              throw new Error("No action to append continued description to");
            }
          }
        }
      }
    }

    return actions;
  } catch (e) {
    throw new Error(`Failed to get actions: ${e.toString()}`);
  }
}
