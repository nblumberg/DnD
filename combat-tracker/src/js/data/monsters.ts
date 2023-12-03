import { useState } from "react";
import { Actor } from "./Actor";

export function useMonsters() {
  const [monsters] = useState(
    [
      "The Demogorgon",
      "Aarakocra",
      "Aarakocra Simulacrum",
      "Aarakocra Spelljammer",
      "Aartuk Elder",
      "Aartuk Starhorror",
      "Aartuk Weedling",
      "Aberrant Zealot",
      "Aberrant Zealot (Variant)",
      "Abhorrent Overlord",
      "Abjurer",
      "Abjurer Wizard",
      "Aboleth",
      "Abominable Yeti",
      "Abyssal Chicken",
      "Abyssal Wretch",
      "Acererak",
      "Acidic Mist Apparition",
      "Acolyte",
      "Adult Amethyst Dragon",
    ].map((name) => new Actor({ name }))
  );
  return monsters;
}
