import { SavingThrow } from "./savingThrow";

export enum Condition {
  BLINDED = "blinded",
  CHARMED = "charmed",
  DEAD = "dead",
  DEAFENED = "deafened",
  EXHAUSTION_1 = "exhaustion level 1",
  EXHAUSTION_2 = "exhaustion level 2",
  EXHAUSTION_3 = "exhaustion level 3",
  EXHAUSTION_4 = "exhaustion level 4",
  EXHAUSTION_5 = "exhaustion level 5",
  FRIGHTENED = "frightened",
  GRAPPLED = "grappled",
  INCAPACITATED = "incapacitated",
  INVISIBLE = "invisible",
  PARALYZED = "paralyzed",
  PETRIFIED = "petrified",
  POISONED = "poisoned",
  PRONE = "prone",
  RESTRAINED = "restrained",
  STUNNED = "stunned",
  UNCONSCIOUS = "unconscious",
}

export interface ActiveCondition {
  id: string;
  condition: Condition;
  onSave?: SavingThrow;
  duration?: number;
  onDamage?: true;
  onTurnStart?: string; // CastMember.id
  onTurnEnd?: string; // CastMember.id
  source?: string; // CastMember.id
}
