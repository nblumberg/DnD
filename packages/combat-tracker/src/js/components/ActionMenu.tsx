import {
  AbilitiesList,
  AbilityType,
  Action,
  CastMember,
  SpellLevels,
  idCastMember,
} from "creature";
import { createContext, useContext, useState } from "react";
import { Roll } from "roll";
import { useSocket } from "../app/api/sockets";
import { findSpell, loadSpells } from "../data/spells";
import { InteractiveRollAPI, InteractiveRollContext } from "./InteractiveRoll";
import { Menu, MenuOption } from "./Menu";
import { TargetSelectAPI, TargetSelectContext } from "./TargetSelect";

export interface ActionMenuAPI {
  open: (castMember: CastMember) => void;
  close: () => void;
}

export const ActionMenuContext = createContext<ActionMenuAPI>({
  open: () => {},
  close: () => {},
});

export function useActionMenu(): {
  jsx: React.ReactNode;
  context: ActionMenuAPI;
} {
  const [actionMenuOpen, setActionMenuOpen] = useState(false);
  const [actionMenuCastMember, setActionMenuCastMember] = useState<
    CastMember | undefined
  >();
  const context: ActionMenuAPI = {
    open: (castMember: CastMember) => {
      if (!castMember) {
        alert("Actions need a cast member");
        return;
      }
      setActionMenuCastMember(castMember);
      setActionMenuOpen(true);
    },
    close: () => {
      setActionMenuOpen(false);
    },
  };

  return {
    jsx: actionMenuOpen && !!actionMenuCastMember && (
      <ActionMenu castMember={actionMenuCastMember} onClose={context.close} />
    ),
    context,
  };
}

export function ActionMenu({
  castMember,
  onClose,
}: {
  castMember: CastMember;
  onClose: () => void;
}) {
  const io = useSocket();
  const targetSelect = useContext(TargetSelectContext);
  const interactiveRoll = useContext(InteractiveRollContext);

  const checks: MenuOption[] = AbilitiesList.map((ability) => ({
    icon: "🎲",
    text: `${ability.toUpperCase()} check`,
    onClick: abilityCheck.bind(null, ability, castMember),
  }));
  const saves: MenuOption[] = AbilitiesList.map((ability) => ({
    icon: "🎲",
    text: `${ability.toUpperCase()} saving throw`,
    onClick: savingThrow.bind(null, ability, castMember),
  }));
  const actionOptions: MenuOption[] = Object.values(castMember.actions)
    .flat()
    .map((action) => ({
      icon: action.attack ? "⚔️" : "🎬",
      text: action.name,
      onClick: () => {
        takeAction(action, castMember, targetSelect, interactiveRoll, io);
      },
    }));
  const spellOptions: MenuOption[] = [];
  if (castMember.spells) {
    const spellNames: string[] = [];
    const { spells: spellsObj } = castMember;
    SpellLevels.forEach((level) => {
      if (spellsObj[level]) {
        spellNames.push(...spellsObj[level].spells);
      }
    });
    if (spellsObj.innate) {
      spellNames.push(...Object.keys(spellsObj.innate));
    }
    loadSpells(...spellNames);
    spellOptions.push(
      ...spellNames.map((spellName: string) => ({
        icon: "🔮",
        text: toInitialCaps(spellName),
        onClick: castSpell.bind(null, spellName, castMember),
      }))
    );
  }
  const options: MenuOption[] = [
    { icon: "🎲", text: "Ability checks", children: checks },
    { icon: "🎲", text: "Saving throws", children: saves },
    { icon: "🎬", text: "Actions", children: actionOptions },
  ];
  if (spellOptions.length) {
    options.push({ icon: "🔮", text: "Spells", children: spellOptions });
  }

  return <Menu options={options} onClose={onClose} />;
}

const initialCharRegExp = /\b(\w)/g;

function toInitialCaps(str: string): string {
  return str.replaceAll(initialCharRegExp, (_match, p1) => p1.toUpperCase());
}

function abilityCheck(ability: AbilityType, castMember: CastMember) {
  const roll = new Roll({
    dieCount: 1,
    dieSides: 20,
    extra: castMember[ability],
  });
  const result = roll.roll();
  alert(`${ability.toUpperCase()} check: ${result}`);
}

function savingThrow(ability: AbilityType, castMember: CastMember) {
  const roll = new Roll({
    dieCount: 1,
    dieSides: 20,
    extra: castMember.saves[ability],
  });
  const result = roll.roll();
  alert(`${ability.toUpperCase()} saving throw: ${result}`);
}

function takeAction(
  action: Action,
  castMember: CastMember,
  targetSelect: TargetSelectAPI,
  interactiveRoll: InteractiveRollAPI,
  io: ReturnType<typeof useSocket>
) {
  if (!action.attack) {
    alert(`${idCastMember(castMember)} takes action: ${action.name}`);
    return;
  }
  const target = action.attack.toHit?.target?.toLowerCase() ?? "";
  const multiple = !target.includes("one ") || target.includes(" per ");
  targetSelect.open(multiple, (targets: CastMember[]) => {
    targetedToHit(action, castMember, interactiveRoll, targets, io);
  });
}

function targetedToHit(
  action: Action,
  castMember: CastMember,
  interactiveRoll: InteractiveRollAPI,
  targets: CastMember[],
  io: ReturnType<typeof useSocket>
) {
  const rolls: Array<{ roll: Roll; label?: string }> = [];
  if (typeof action.attack!.toHit.modifier === "number") {
    rolls.push({
      roll: new Roll({
        dieCount: 1,
        dieSides: 20,
        extra: action.attack!.toHit.modifier,
      }),
      label: "To hit",
    });
  }
  if (action.attack!.onHit?.damage.length) {
    action.attack!.onHit?.damage.forEach((damage) => {
      rolls.push({
        roll: new Roll(damage.amount),
        label: damage.type,
      });
    });
  }
  interactiveRoll.open("Make your attack", rolls, (rolls) => {
    const toHit = rolls[0];
    const damage = rolls.slice(1);

    if (!io) {
      throw new Error("No socket connection");
    }
    io.emit("attack", {
      id: castMember.id,
      attack: action.name,
      toHit,
      damage,
      targets: targets.map(({ id }) => id),
      targetSaves: [],
    });
  });
}

function castSpell(spell: string, castMember: CastMember) {
  const spellDescription = findSpell(spell);
  if (!spellDescription) {
    throw new Error(`Spell not found: ${spell}`);
  }
  alert(`${idCastMember(castMember)} takes action: ${spellDescription.name}`);
}
