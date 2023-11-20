import {
  getElementText,
  getElementTextNodesOnly,
  getRemainingText,
} from "../dom";
import { parseRegExpGroups } from "../utils";
import { getAttack } from "./attack";
import { Action } from "./types";

const costRegExp = /(?<name>.+)\s+\((?<cost>.+)\)/;
const rechargeRegExp = /\((?<recharge>.+)\)/;

function appendContinuedDescription(priorAction: Action, text: string): void {
  if (priorAction.attack?.onHit?.effect) {
    priorAction.attack.onHit.effect = `${priorAction.attack.onHit.effect}\n${text}`;
  } else {
    priorAction.description = `${priorAction.description ?? ""}\n${text}`;
  }
}

export function getActions(statBlock: HTMLElement): Record<string, Action[]> {
  try {
    const actions: Record<string, Action[]> = {};

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
        : (actions[type] = [] as Action[]);
      const entries = Array.from(
        category.querySelectorAll(
          ".mon-stat-block__description-block-content p"
        )
      );
      for (const entry of entries) {
        const header =
          entry.querySelector("em") || entry.querySelector("strong");

        let name: string;
        let cost: string;
        if (!header) {
          if (!actionsArray.length) {
            name = type;
          } else {
            // Combine paragraph with prior action
            appendContinuedDescription(
              actionsArray[actionsArray.length - 1],
              entry.textContent.trim()
            );
            break;
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
          name = getElementTextNodesOnly(
            header.querySelector("strong") || header
          ).trim();
        }

        if (name.charAt(name.length - 1) === ".") {
          // Trim trailing period
          name = name.substring(0, name.length - 1);
        }

        if (name.includes("(")) {
          ({ name, cost } = parseRegExpGroups("costRegExp", costRegExp, name));
        }

        const action: Action = {
          name,
        };

        if (cost) {
          action.cost = cost;
        }

        const attack: Action["attack"] | undefined = getAttack(entry);
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

        actionsArray.push(action);
      }
    }

    return actions;
  } catch (e) {
    throw new Error(`Failed to get actions: ${e.toString()}`);
  }
}
