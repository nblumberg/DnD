import { describe, expect, jest, test } from "@jest/globals";
import { ActiveCondition, CastMember, Condition, Size } from "creature";
import { getUniqueId } from "../src/js";
import {
  ChangeHistory,
  ChangeHistoryEntry,
  StateAdd,
  StateChange,
  StateRemove,
  addCastMember,
  addCondition,
  damageCastMember,
  delayInitiative,
  endTurn,
  endTurnCondition,
  getObjectFromChanges,
  giveCastMemberTemporaryHitPoints,
  healCastMember,
  nameCastMember,
  removeCastMember,
  removeCondition,
  setInitiative,
  startTurn,
  startTurnCondition,
  tickCondition,
  trackChanges,
  undoHistoryEntry,
} from "../src/js/change";
import { beforeOnce } from "./beforeOnce";

jest.mock("../src/js/util/unique", () => {
  const { getUniqueId } = jest.requireActual<
    typeof import("../src/js/util/unique")
  >("../src/js/util/unique");
  return {
    __esModule: true,
    getUniqueId: jest.fn<() => string>(getUniqueId),
  };
});

export const testCastMember: CastMember = {
  id: "castMember-1",
  name: "Cast Member 1",
  image: "",
  source: "",
  url: "",

  type: "humanoid",
  size: Size.MEDIUM,
  character: false,
  unique: false,
  actor: {
    id: "actor-1",
    name: "Actor 1",
    unique: false,
  },

  alignment: {
    lawChaos: undefined,
    goodEvil: undefined,
    longName: "Neutral",
    shortName: "N",
  },

  str: 10,
  dex: 10,
  con: 10,
  int: 10,
  wis: 10,
  cha: 10,

  ac: 10,
  saves: { str: 0, dex: 0, con: 0, int: 0, wis: 0, cha: 0 },

  damageImmunities: ["cold"],
  damageResistances: ["acid"],
  damageVulnerabilities: ["radiant"],
  hd: { dieCount: 1, dieSides: 8, extra: 0, crits: Infinity },
  hp: 8,
  hpCurrent: 8,
  hpTemp: 0,

  initiativeOrder: 1,
  initiative: 0,
  myTurn: false,
  delayInitiative: false,

  senses: { "Passive Perception": 10 },
  skills: {},
  features: [],
  actions: {},
  proficiency: 2,
  cr: 1,
  speeds: { walk: 30 },

  conditionImmunities: [Condition.CHARMED],
  conditions: {},

  environment: [],
  languages: [],
};

const originalCastMember = testCastMember;

const originalConditionTickExpire: ActiveCondition = {
  id: `condition_${Condition.BLINDED}`,
  condition: Condition.BLINDED,
  duration: 2,
};
const originalConditionTickTick: ActiveCondition = {
  id: `condition_${Condition.DEAFENED}`,
  condition: Condition.DEAFENED,
  duration: 2,
};
const originalConditionStartTurn: ActiveCondition = {
  id: `condition_${Condition.INVISIBLE}`,
  condition: Condition.INVISIBLE,
  duration: 2,
  onTurnStart: testCastMember.id,
};
const originalConditionEndTurn: ActiveCondition = {
  id: `condition_${Condition.FRIGHTENED}`,
  condition: Condition.FRIGHTENED,
  duration: 2,
  onTurnEnd: testCastMember.id,
};

type MakeChange = (
  castMember: CastMember
) =>
  | ChangeHistoryEntry<CastMember>
  | ChangeHistoryEntry<CastMember>[]
  | undefined;

describe("When", () => {
  let history: ChangeHistory<CastMember> = { changes: [] };
  let currentCastMember: CastMember | undefined;
  let beforeChangeCastMember: CastMember | undefined;

  let i = 0;
  type Change =
    | StateAdd<CastMember>
    | StateRemove<CastMember>
    | StateChange<CastMember, keyof CastMember>;
  const tests: Array<{
    changes: Change | Change[];
    makeChange: MakeChange;
  }> = [
    {
      changes: {
        id: `${i++}`,
        type: "+",
        object: originalCastMember.id,
        newValue: originalCastMember,
        action: "is added to the game",
      },
      makeChange: () => addCastMember(originalCastMember),
    },
    {
      changes: {
        id: `${i++}`,
        type: "c",
        object: originalCastMember.id,
        action: "is renamed",
        property: "nickname",
        oldValue: undefined,
        newValue: "Test name",
      },
      makeChange: (castMember) => nameCastMember(castMember, "Test name"),
    },

    {
      changes: {
        id: `${i++}`,
        type: "c",
        object: originalCastMember.id,
        action: "delays initiative order",
        property: "delayInitiative",
        oldValue: false,
        newValue: true,
      },
      makeChange: (castMember) => delayInitiative(castMember, true),
    },
    {
      changes: [
        {
          id: `${i++}`,
          type: "c",
          object: originalCastMember.id,
          action: "rejoins initiative order (stops delaying)",
          property: "delayInitiative",
          oldValue: true,
          newValue: false,
        },
        {
          id: `${i++}`,
          type: "c",
          object: originalCastMember.id,
          action: "rejoins initiative order",
          property: "initiativeOrder",
          oldValue: 1,
          newValue: 10,
        },
      ],
      makeChange: (castMember) => setInitiative(castMember, 10),
    },
    {
      changes: {
        id: `${i++}`,
        type: "c",
        object: originalCastMember.id,
        action: "starts their turn",
        property: "myTurn",
        oldValue: false,
        newValue: true,
      },
      makeChange: (castMember) => startTurn(castMember),
    },
    {
      changes: {
        id: `${i++}`,
        type: "c",
        object: originalCastMember.id,
        action: "ends their turn",
        property: "myTurn",
        oldValue: true,
        newValue: false,
      },
      makeChange: (castMember) => endTurn(castMember),
    },

    {
      changes: {
        id: `${i++}`,
        type: "c+",
        object: originalCastMember.id,
        action: "adds a condition (early exit)",
        property: "conditions",
        newValue: {
          [originalConditionTickExpire.id]: originalConditionTickExpire,
        },
      },
      makeChange: (castMember) => {
        (getUniqueId as jest.Mock<() => string>).mockImplementation(
          () => originalConditionTickExpire.id
        );
        return addCondition(castMember, originalConditionTickExpire);
      },
    },
    {
      changes: {
        id: `${i++}`,
        type: "c",
        object: originalCastMember.id,
        action: "passes time on a condition (early exit)",
        property: "conditions",
        oldValue: {
          [originalConditionTickExpire.id]: {
            ...originalConditionTickExpire,
            duration: originalConditionTickExpire.duration,
          },
        },
        newValue: {
          [originalConditionTickExpire.id]: {
            ...originalConditionTickExpire,
            duration: originalConditionTickExpire.duration! - 1,
          },
        },
      },
      makeChange: (castMember) =>
        tickCondition(castMember, originalConditionTickExpire),
    },
    {
      changes: {
        id: `${i++}`,
        type: "c-",
        object: originalCastMember.id,
        action: "expires a condition (early exit)",
        property: "conditions",
        oldValue: {
          [originalConditionTickExpire.id]: {
            ...originalConditionTickExpire,
            duration: originalConditionTickExpire.duration! - 1,
          },
        },
      },
      makeChange: (castMember) =>
        removeCondition(castMember, originalConditionTickExpire),
    },

    {
      changes: {
        id: `${i++}`,
        type: "c+",
        object: originalCastMember.id,
        action: "adds a condition (natural expire)",
        property: "conditions",
        newValue: {
          [originalConditionTickTick.id]: originalConditionTickTick,
        },
      },
      makeChange: (castMember) => {
        (getUniqueId as jest.Mock<() => string>).mockImplementation(
          () => originalConditionTickTick.id
        );
        return addCondition(castMember, originalConditionTickTick);
      },
    },
    {
      changes: {
        id: `${i++}`,
        type: "c",
        object: originalCastMember.id,
        action: "passes time on a condition (natural expire)",
        property: "conditions",
        oldValue: {
          [originalConditionTickTick.id]: {
            ...originalConditionTickTick,
            duration: originalConditionTickTick.duration,
          },
        },
        newValue: {
          [originalConditionTickTick.id]: {
            ...originalConditionTickTick,
            duration: originalConditionTickTick.duration! - 1,
          },
        },
      },
      makeChange: (castMember) =>
        tickCondition(castMember, originalConditionTickTick),
    },
    {
      changes: {
        id: `${i++}`,
        type: "c-",
        object: originalCastMember.id,
        action: "passes all time on a condition (natural expire)",
        property: "conditions",
        oldValue: {
          [originalConditionTickTick.id]: {
            ...originalConditionTickTick,
            duration: originalConditionTickTick.duration! - 1,
          },
        },
      },
      makeChange: (castMember) =>
        tickCondition(castMember, originalConditionTickTick),
    },

    {
      changes: {
        id: `${i++}`,
        type: "c+",
        object: originalCastMember.id,
        action: "adds a condition (start turn)",
        property: "conditions",
        newValue: {
          [originalConditionStartTurn.id]: originalConditionStartTurn,
        },
      },
      makeChange: (castMember) => {
        (getUniqueId as jest.Mock<() => string>).mockImplementation(
          () => originalConditionStartTurn.id
        );
        return addCondition(castMember, originalConditionStartTurn);
      },
    },
    {
      changes: {
        id: `${i++}`,
        type: "c",
        object: originalCastMember.id,
        action: "passes time on a condition (start turn)",
        property: "conditions",
        oldValue: {
          [originalConditionStartTurn.id]: {
            ...originalConditionStartTurn,
            duration: originalConditionStartTurn.duration,
          },
        },
        newValue: {
          [originalConditionStartTurn.id]: {
            ...originalConditionStartTurn,
            duration: originalConditionStartTurn.duration! - 1,
          },
        },
      },
      makeChange: (castMember) =>
        startTurnCondition(castMember, originalConditionStartTurn),
    },
    {
      changes: {
        id: `${i++}`,
        type: "c-",
        object: originalCastMember.id,
        action: "passes all time on a condition (start turn)",
        property: "conditions",
        oldValue: {
          [originalConditionStartTurn.id]: {
            ...originalConditionStartTurn,
            duration: originalConditionStartTurn.duration! - 1,
          },
        },
      },
      makeChange: (castMember) =>
        startTurnCondition(castMember, originalConditionStartTurn),
    },

    {
      changes: {
        id: `${i++}`,
        type: "c+",
        object: originalCastMember.id,
        action: "adds a condition (end turn)",
        property: "conditions",
        newValue: {
          [originalConditionEndTurn.id]: originalConditionEndTurn,
        },
      },
      makeChange: (castMember) => {
        (getUniqueId as jest.Mock<() => string>).mockImplementation(
          () => originalConditionEndTurn.id
        );
        return addCondition(castMember, originalConditionEndTurn);
      },
    },
    {
      changes: {
        id: `${i++}`,
        type: "c",
        object: originalCastMember.id,
        action: "passes time on a condition (end turn)",
        property: "conditions",
        oldValue: {
          [originalConditionEndTurn.id]: {
            ...originalConditionEndTurn,
            duration: originalConditionEndTurn.duration,
          },
        },
        newValue: {
          [originalConditionEndTurn.id]: {
            ...originalConditionEndTurn,
            duration: originalConditionEndTurn.duration! - 1,
          },
        },
      },
      makeChange: (castMember) =>
        endTurnCondition(castMember, originalConditionEndTurn),
    },
    {
      changes: {
        id: `${i++}`,
        type: "c-",
        object: originalCastMember.id,
        action: "passes all time on a condition (end turn)",
        property: "conditions",
        oldValue: {
          [originalConditionEndTurn.id]: {
            ...originalConditionEndTurn,
            duration: originalConditionEndTurn.duration! - 1,
          },
        },
      },
      makeChange: (castMember) =>
        endTurnCondition(castMember, originalConditionEndTurn),
    },

    {
      changes: {
        id: `${i++}`,
        type: "c",
        object: originalCastMember.id,
        action: "gains temporary hit points",
        property: "hpTemp",
        oldValue: 0,
        newValue: 3,
      },
      makeChange: (castMember) =>
        giveCastMemberTemporaryHitPoints(castMember, 3),
    },
    {
      changes: [
        {
          id: `${i++}`,
          type: "c",
          object: originalCastMember.id,
          action: "is damaged (temporary hit points)",
          property: "hpTemp",
          oldValue: 3,
          newValue: 0,
        },
        {
          id: `${i++}`,
          type: "c",
          object: originalCastMember.id,
          action: "is damaged",
          property: "hpCurrent",
          oldValue: originalCastMember.hpCurrent,
          newValue: originalCastMember.hpCurrent - 1,
        },
      ],
      makeChange: (castMember) =>
        damageCastMember(castMember, 4, "bludgeoning"),
    },
    {
      changes: {
        id: `${i++}`,
        type: "c",
        object: originalCastMember.id,
        action: "is damaged with something it resists",
        property: "hpCurrent",
        oldValue: originalCastMember.hpCurrent - 1,
        newValue: originalCastMember.hpCurrent - 2,
      },
      makeChange: (castMember) => damageCastMember(castMember, 2, "acid"),
    },
    {
      changes: {
        id: `${i++}`,
        type: "c",
        object: originalCastMember.id,
        action: "is damaged with something it's vulerable to",
        property: "hpCurrent",
        oldValue: originalCastMember.hpCurrent - 2,
        newValue: originalCastMember.hpCurrent - 4,
      },
      makeChange: (castMember) => damageCastMember(castMember, 1, "radiant"),
    },
    {
      changes: {
        id: `${i++}`,
        type: "c",
        object: originalCastMember.id,
        action: "is healed",
        property: "hpCurrent",
        oldValue: originalCastMember.hpCurrent - 4,
        newValue: originalCastMember.hp,
      },
      makeChange: (castMember) =>
        healCastMember(castMember, originalCastMember.hp + 10),
    },

    {
      changes: {
        id: `${i++}`,
        type: "-",
        object: originalCastMember.id,
        action: "is removed from the game",
      },
      makeChange: (castMember) => removeCastMember(castMember),
    },
  ];

  function testChange(testEntry: (typeof tests)[number]) {
    const { changes: tmp, makeChange } = testEntry;
    const changes = Array.isArray(tmp) ? tmp : [tmp];
    const isNotAChange = !!changes.find(
      ({ type }) => type === "+" || type === "-"
    );
    const action = changes.map(({ action }) => action).join(" and ");
    let priorHistoryLength: number;

    describe(`a cast member ${action}`, () => {
      beforeOnce(() => {
        history.changes = [];

        currentCastMember = originalCastMember;
        const index = tests.indexOf(testEntry);
        for (let i = 0; i < index; i++) {
          if (!currentCastMember) {
            throw new Error("Cast member not found in history");
          }
          history = trackChanges(
            history,
            tests[i].makeChange(currentCastMember)
          );
          currentCastMember = getObjectFromChanges<CastMember>(
            originalCastMember.id,
            history
          );
        }
        priorHistoryLength = history.changes.length;
        if (history.changes.length) {
          beforeChangeCastMember = getObjectFromChanges<CastMember>(
            originalCastMember.id,
            history
          );
        } else {
          beforeChangeCastMember = undefined;
        }
        if (!currentCastMember) {
          throw new Error("Cast member not found in history");
        }
        history = trackChanges(history, makeChange(currentCastMember));
        currentCastMember = getObjectFromChanges<CastMember>(
          originalCastMember.id,
          history
        );
      });
      test("it should return the new CastMember and it should be a different object", () => {
        if (changes[0].type === "-") {
          expect(currentCastMember).not.toBeDefined();
        } else {
          expect(currentCastMember).toBeDefined();
        }
        expect(currentCastMember).not.toBe(beforeChangeCastMember);
        expect(currentCastMember).not.toBe(originalCastMember);
      });
      test("it should track the change in history", () => {
        expect(history.changes.length).toEqual(
          priorHistoryLength + changes.length
        );
      });
      changes.forEach((change) => {
        if (!change.property) {
          return;
        }
        test(`it should have set ${change.property} on the new CastMember object and not on the old CastMember object`, () => {
          if (typeof (change.newValue ?? change.oldValue) === "object") {
            expect(originalCastMember[change.property]).not.toBe(
              currentCastMember![change.property]
            );
            expect(beforeChangeCastMember![change.property]).not.toBe(
              currentCastMember![change.property]
            );
            if (change.type.includes("-")) {
              Object.entries(change.oldValue).forEach(([key]) => {
                expect(
                  currentCastMember![change.property].hasOwnProperty(key)
                ).toBe(false);
              });
            } else {
              Object.entries(change.newValue).forEach(([key, value]) => {
                expect(
                  currentCastMember![change.property].hasOwnProperty(key)
                ).toBe(true);
                expect(currentCastMember![change.property][key]).toEqual(value);
              });
            }
          } else {
            if (
              beforeChangeCastMember![change.property] ===
              originalCastMember[change.property]
            ) {
              // Conditional check is necessary in case we're setting it back to the original state
              expect(originalCastMember[change.property]).toEqual(
                change.oldValue
              );
            }
            expect(beforeChangeCastMember![change.property]).toEqual(
              change.oldValue
            );
            expect(currentCastMember![change.property]).toEqual(
              change.newValue
            );
          }
        });
      });
      if (!isNotAChange) {
        test("it should be reversible, but return a different CastMember object", () => {
          let undoneCastMember = currentCastMember;
          [...changes].reverse().forEach((change) => {
            undoneCastMember = undoHistoryEntry(change, undoneCastMember);
          });
          expect(undoneCastMember).not.toBe(currentCastMember);
          expect(undoneCastMember).not.toBe(beforeChangeCastMember);
          expect(undoneCastMember).toEqual(beforeChangeCastMember);
        });
      }
      test("it should be able to reconstruct the updated item from history", () => {
        const removal = !!changes.find(({ type }) => type === "-");
        expect(getObjectFromChanges(originalCastMember.id, history)).toEqual(
          removal ? undefined : currentCastMember
        );
      });
    });
  }

  tests.forEach(testChange);

  function testNoChange(makeChange: MakeChange, setup?: () => CastMember) {
    let priorHistoryLength: number;
    beforeOnce(() => {
      history.changes = [];

      history = trackChanges(history, addCastMember(originalCastMember));

      currentCastMember = getObjectFromChanges(originalCastMember.id, history);
      if (setup) {
        currentCastMember = setup();
      }

      priorHistoryLength = history.changes.length;
      beforeChangeCastMember = currentCastMember;
      if (!currentCastMember) {
        throw new Error("Cast member not found in history");
      }
      history = trackChanges(history, makeChange(currentCastMember));
      currentCastMember = getObjectFromChanges(currentCastMember.id, history);
    });
    test("it should return an equivalent CastMember", () => {
      expect(currentCastMember).toBeDefined();
      expect(currentCastMember).toEqual(beforeChangeCastMember);
      0;
    });
    test("it should not track the change in history", () => {
      expect(history.changes.length).toEqual(priorHistoryLength);
    });
  }

  describe(`a cast member adds a condition it's immune to`, () => {
    testNoChange((castMember) =>
      addCondition(castMember, { condition: Condition.CHARMED })
    );
  });
  describe(`a cast member receives damage it's immune to`, () => {
    testNoChange((castMember) => damageCastMember(castMember, 10, "cold"));
  });
  describe(`a cast member gains less temporary hit points than it already has`, () => {
    testNoChange(
      (castMember) => giveCastMemberTemporaryHitPoints(castMember, 2),
      () => {
        const changes = giveCastMemberTemporaryHitPoints(originalCastMember, 3);
        if (changes) {
          history = trackChanges(history, changes);
        }
        const castMember = getObjectFromChanges(originalCastMember.id, history);
        if (!castMember) {
          throw new Error("Cast member not found in history");
        }
        return castMember;
      }
    );
  });
});
