import {
  AbilitiesList,
  AbilityType,
  Action,
  CastMember,
  SpellLevels,
  idCastMember,
} from "creature";
import { Roll } from "roll";
import { findSpell, loadSpells } from "../data/spells";
import { Menu, MenuOption } from "./Menu";

export function ActionMenu({
  castMember,
  onClose,
}: {
  castMember: CastMember;
  onClose: () => void;
}) {
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
      onClick: takeAction.bind(null, action, castMember),
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

function takeAction(action: Action, castMember: CastMember) {
  alert(`${idCastMember(castMember)} takes action: ${action.name}`);
}

function castSpell(spell: string, castMember: CastMember) {
  const spellDescription = findSpell(spell);
  if (!spellDescription) {
    throw new Error(`Spell not found: ${spell}`);
  }
  alert(`${idCastMember(castMember)} takes action: ${spellDescription.name}`);
}
