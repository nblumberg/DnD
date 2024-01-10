type SpellLevel = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
interface PreparedSpellsByLevel {
  slots: number | "∞";
  spells: string[];
}
type InnateSpells = Record<string, number | "∞">;
export type Spells = Record<SpellLevel, PreparedSpellsByLevel> & {
  innate: InnateSpells;
};
