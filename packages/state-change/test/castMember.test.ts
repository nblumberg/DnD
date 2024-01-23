import { describe, expect, test } from "@jest/globals";
import { ActiveCondition, CastMember, Condition, Size } from "creature";
import { addCastMember } from "../src/js/addCastMember";
import { addCondition } from "../src/js/addCondition";
import { damageCastMember } from "../src/js/damageCastMember";
import { delayInitiative } from "../src/js/delayInitiative";
import { expireCondition } from "../src/js/expireCondition";
import { giveCastMemberTemporaryHitPoints } from "../src/js/giveCastMemberTemporaryHitPoints";
import { healCastMember } from "../src/js/healCastMember";
import { nameCastMember } from "../src/js/nameCastMember";
import { removeCastMember } from "../src/js/removeCastMember";
import { setInitiative } from "../src/js/setInitiative";
import {
  ChangeState,
  StateAdd,
  StateChange,
  StateRemove,
  getHistoryHandle,
  getObjectState,
  undoStateChange,
} from "../src/js/stateChange";
import { endTurn, startTurn, tickCondition } from "../src/js/tickCondition";
import { beforeOnce } from "./beforeOnce";

export const testCastMember: CastMember = {
  id: "castMember-1",
  name: "Cast Member 1",
  image: "",
  source: "",
  url: "",

  type: "Humanoid",
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

describe("When", () => {
  let target: ReturnType<typeof getHistoryHandle<CastMember>>;
  let currentCastMember: CastMember;

  let i = 0;
  type Changes =
    | StateAdd<CastMember>
    | StateRemove<CastMember>
    | StateChange<CastMember, keyof CastMember>;
  const tests: Array<{
    changes: Changes | Changes[];
    makeChange: ChangeState<CastMember>;
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
        type: "c+",
        object: originalCastMember.id,
        action: "adds a condition (early exit)",
        property: "conditions",
        newValue: {
          [originalConditionTickExpire.id]: originalConditionTickExpire,
        },
      },
      makeChange: (castMember) =>
        addCondition(castMember, originalConditionTickExpire, true),
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
        expireCondition(castMember, originalConditionTickExpire),
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
      makeChange: (castMember) =>
        addCondition(castMember, originalConditionTickTick, true),
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
      makeChange: (castMember) =>
        addCondition(castMember, originalConditionStartTurn, true),
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
        startTurn(castMember, originalConditionStartTurn),
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
        startTurn(castMember, originalConditionStartTurn),
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
      makeChange: (castMember) =>
        addCondition(castMember, originalConditionEndTurn, true),
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
      makeChange: (castMember) => endTurn(castMember, originalConditionEndTurn),
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
      makeChange: (castMember) => endTurn(castMember, originalConditionEndTurn),
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
    let beforeChangeCastMember: CastMember;

    describe(`a cast member ${action}`, () => {
      beforeOnce(() => {
        target = getHistoryHandle("CastMember");
        target.setHistory([]);

        currentCastMember = originalCastMember;
        const index = tests.indexOf(testEntry);
        for (let i = 0; i < index; i++) {
          const { makeChange } = tests[i];
          currentCastMember = makeChange(currentCastMember);
        }
        priorHistoryLength = target.getHistory().length;
        beforeChangeCastMember = currentCastMember;
        currentCastMember = makeChange(beforeChangeCastMember);
      });
      test("it should return the new CastMember and it should be a different object", () => {
        expect(currentCastMember).toBeDefined();
        expect(currentCastMember).not.toBe(beforeChangeCastMember);
        expect(currentCastMember).not.toBe(originalCastMember);
      });
      test("it should track the change in history", () => {
        expect(target.getHistory().length).toEqual(
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
              currentCastMember[change.property]
            );
            expect(beforeChangeCastMember[change.property]).not.toBe(
              currentCastMember[change.property]
            );
            if (change.type.includes("-")) {
              Object.entries(change.oldValue).forEach(([key]) => {
                expect(
                  currentCastMember[change.property].hasOwnProperty(key)
                ).toBe(false);
              });
            } else {
              Object.entries(change.newValue).forEach(([key, value]) => {
                expect(
                  currentCastMember[change.property].hasOwnProperty(key)
                ).toBe(true);
                expect(currentCastMember[change.property][key]).toEqual(value);
              });
            }
          } else {
            if (
              beforeChangeCastMember[change.property] ===
              originalCastMember[change.property]
            ) {
              // Conditional check is necessary in case we're setting it back to the original state
              expect(originalCastMember[change.property]).toEqual(
                change.oldValue
              );
            }
            expect(beforeChangeCastMember[change.property]).toEqual(
              change.oldValue
            );
            expect(currentCastMember[change.property]).toEqual(change.newValue);
          }
        });
      });
      if (!isNotAChange) {
        test("it should be reversible, but return a different CastMember object", () => {
          let undoneCastMember = currentCastMember;
          [...changes].reverse().forEach((change) => {
            undoneCastMember = undoStateChange(
              change as StateChange<CastMember, keyof CastMember>,
              undoneCastMember
            );
          });
          expect(undoneCastMember).not.toBe(currentCastMember);
          expect(undoneCastMember).not.toBe(beforeChangeCastMember);
          expect(undoneCastMember).toEqual(beforeChangeCastMember);
        });
      }
      test("it should be able to reconstruct the updated item from history", () => {
        const removal = !!changes.find(({ type }) => type === "-");
        expect(
          getObjectState(originalCastMember.id, target.getHistory())
        ).toEqual(removal ? undefined : currentCastMember);
      });
    });
  }

  tests.forEach((testEntry) => testChange(testEntry));

  function testNoChange(
    makeChange: ChangeState<CastMember>,
    setup?: () => CastMember
  ) {
    let priorHistoryLength: number;
    let beforeChangeCastMember: CastMember;
    beforeOnce(() => {
      target = getHistoryHandle("CastMember");
      target.setHistory([]);

      currentCastMember = originalCastMember;
      if (setup) {
        currentCastMember = setup();
      }

      priorHistoryLength = target.getHistory().length;
      beforeChangeCastMember = currentCastMember;
      currentCastMember = makeChange(currentCastMember);
    });
    test("it should return the same CastMember and it should be the same object", () => {
      expect(currentCastMember).toBeDefined();
      expect(currentCastMember).toBe(beforeChangeCastMember);
      if (!setup) {
        expect(currentCastMember).toBe(originalCastMember);
      }
    });
    test("it should not track the change in history", () => {
      expect(target.getHistory().length).toEqual(priorHistoryLength);
    });
  }

  describe(`a cast member adds a condition it's immune to`, () => {
    testNoChange((castMember) =>
      addCondition(castMember, { condition: Condition.CHARMED }, true)
    );
  });
  describe(`a cast member receives damage it's immune to`, () => {
    testNoChange((castMember) => damageCastMember(castMember, 10, "cold"));
  });
  describe(`a cast member gains less temporary hit points than it already has`, () => {
    testNoChange(
      (castMember) => giveCastMemberTemporaryHitPoints(castMember, 2),
      () => giveCastMemberTemporaryHitPoints(originalCastMember, 3)
    );
  });
});
