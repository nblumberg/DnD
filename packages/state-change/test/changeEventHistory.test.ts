import { describe, expect, jest, test } from "@jest/globals";
import { ActiveCondition, CastMember, Condition } from "creature";
import { HistoryEntry, getHistoryHandle } from "../src/js/atomic/stateChange";
import { AddCastMember } from "../src/js/molecular/addCastMember";
import { AddCondition } from "../src/js/molecular/addCondition";
import {
  DelayInitiative,
  ReadyAction,
} from "../src/js/molecular/delayInitiative";
import { getCastMember, getHistory } from "../src/js/molecular/event";
import { NameCastMember } from "../src/js/molecular/nameCastMember";
import { RemoveCastMember } from "../src/js/molecular/removeCastMember";
import { RemoveCondition } from "../src/js/molecular/removeCondition";
import {
  StartTurn,
  StopDelayedAction,
  TriggerReadiedAction,
} from "../src/js/molecular/startTurn";
import { getUniqueId } from "../src/js/util/unique";
import { beforeOnce } from "./beforeOnce";
import { testCastMember } from "./stateChangeCastMember.test";

jest.mock("../src/js/util/unique", () => {
  const { getUniqueId } = jest.requireActual<
    typeof import("../src/js/util/unique")
  >("../src/js/util/unique");
  return {
    __esModule: true,
    getUniqueId: jest.fn<() => string>(getUniqueId),
  };
});

const originalCastMembers: CastMember[] = [
  testCastMember,
  {
    ...testCastMember,
    id: "castMember-2",
    name: "Cast Member 2",
  },
];

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
  let currentCastMember: CastMember;

  let i = 0;
  const tests: Array<{
    changes: HistoryEntry<CastMember> | HistoryEntry<CastMember>[];
    makeChange: () => void;
  }> = [
    {
      changes: {
        id: `${i++}`,
        type: "+",
        object: originalCastMembers[0].id,
        newValue: originalCastMembers[0],
        action: "is added to the game",
      },
      makeChange: () => {
        new AddCastMember({
          castMemberId: originalCastMembers[0].id,
          castMember: originalCastMembers[0],
        });
      },
    },
    {
      changes: {
        id: `${i++}`,
        type: "+",
        object: originalCastMembers[1].id,
        newValue: originalCastMembers[1],
        action: "is added to the game",
      },
      makeChange: () => {
        new AddCastMember({
          castMemberId: originalCastMembers[1].id,
          castMember: originalCastMembers[1],
        });
      },
    },
    {
      changes: {
        id: `${i++}`,
        type: "c",
        object: originalCastMembers[0].id,
        action: "is renamed",
        property: "nickname",
        oldValue: undefined,
        newValue: "Test name",
      },
      makeChange: () => {
        new NameCastMember({
          castMemberId: originalCastMembers[0].id,
          name: "Test name",
        });
      },
    },

    {
      changes: {
        id: `${i++}`,
        type: "c",
        object: originalCastMembers[0].id,
        action: "delays initiative order",
        property: "delayInitiative",
        oldValue: false,
        newValue: true,
      },
      makeChange: () => {
        new DelayInitiative({
          castMemberId: originalCastMembers[0].id,
        });
      },
    },
    {
      changes: {
        id: `${i++}`,
        type: "c",
        object: originalCastMembers[1].id,
        action: "delays initiative order",
        property: "delayInitiative",
        oldValue: false,
        newValue: true,
      },
      makeChange: () => {
        new ReadyAction({
          castMemberId: originalCastMembers[1].id,
        });
      },
    },
    {
      changes: [
        {
          id: `${i++}`,
          type: "c",
          object: originalCastMembers[0].id,
          action: "rejoins initiative order (stops delaying)",
          property: "delayInitiative",
          oldValue: true,
          newValue: false,
        },
        {
          id: `${i++}`,
          type: "c",
          object: originalCastMembers[0].id,
          action: "rejoins initiative order",
          property: "initiativeOrder",
          oldValue: 1,
          newValue: 11,
        },
        {
          id: `${i++}`,
          type: "c",
          object: originalCastMembers[0].id,
          action: "starts their turn",
          property: "myTurn",
          oldValue: false,
          newValue: true,
        },
      ],
      makeChange: () => {
        new StopDelayedAction({
          castMemberId: originalCastMembers[0].id,
          initiativeOrder: 11,
        });
      },
    },
    {
      changes: [
        {
          id: `${i++}`,
          type: "c",
          object: originalCastMembers[1].id,
          action: "rejoins initiative order (stops delaying)",
          property: "delayInitiative",
          oldValue: true,
          newValue: false,
        },
        {
          id: `${i++}`,
          type: "c",
          object: originalCastMembers[1].id,
          action: "rejoins initiative order",
          property: "initiativeOrder",
          oldValue: 1,
          newValue: 10,
        },
        {
          id: `${i++}`,
          type: "c",
          object: originalCastMembers[0].id,
          action: "ends their turn",
          property: "myTurn",
          oldValue: true,
          newValue: false,
        },
        {
          id: `${i++}`,
          type: "c",
          object: originalCastMembers[1].id,
          action: "starts their turn",
          property: "myTurn",
          oldValue: false,
          newValue: true,
        },
      ],
      makeChange: () => {
        new TriggerReadiedAction({
          castMemberId: originalCastMembers[1].id,
          initiativeOrder: 10,
        });
      },
    },
    {
      changes: [
        {
          id: `${i++}`,
          type: "c",
          object: originalCastMembers[1].id,
          action: "ends their turn",
          property: "myTurn",
          oldValue: true,
          newValue: false,
        },
        {
          id: `${i++}`,
          type: "c",
          object: originalCastMembers[0].id,
          action: "starts their turn",
          property: "myTurn",
          oldValue: false,
          newValue: true,
        },
      ],
      makeChange: () => {
        new StartTurn({ castMemberId: originalCastMembers[0].id });
      },
    },

    {
      changes: {
        id: `${i++}`,
        type: "c+",
        object: originalCastMembers[0].id,
        action: "adds a condition (early exit)",
        property: "conditions",
        newValue: {
          [originalConditionTickExpire.id]: originalConditionTickExpire,
        },
      },
      makeChange: () => {
        (getUniqueId as jest.Mock<() => string>).mockImplementation(
          () => originalConditionTickExpire.id
        );
        new AddCondition({
          castMemberId: originalCastMembers[0].id,
          condition: originalConditionTickExpire,
        });
      },
    },
    {
      changes: {
        id: `${i++}`,
        type: "c+",
        object: originalCastMembers[0].id,
        action: "adds a condition (start turn)",
        property: "conditions",
        newValue: {
          [originalConditionStartTurn.id]: originalConditionStartTurn,
        },
      },
      makeChange: () => {
        (getUniqueId as jest.Mock<() => string>).mockImplementation(
          () => originalConditionStartTurn.id
        );
        new AddCondition({
          castMemberId: originalCastMembers[0].id,
          condition: originalConditionStartTurn,
        });
      },
    },
    {
      changes: {
        id: `${i++}`,
        type: "c+",
        object: originalCastMembers[0].id,
        action: "adds a condition (end turn)",
        property: "conditions",
        newValue: {
          [originalConditionEndTurn.id]: originalConditionEndTurn,
        },
      },
      makeChange: () => {
        (getUniqueId as jest.Mock<() => string>).mockImplementation(
          () => originalConditionEndTurn.id
        );
        new AddCondition({
          castMemberId: originalCastMembers[0].id,
          condition: originalConditionEndTurn,
        });
      },
    },
    {
      changes: {
        id: `${i++}`,
        type: "c+",
        object: originalCastMembers[1].id,
        action: "adds a condition (natural expire)",
        property: "conditions",
        newValue: {
          [originalConditionTickTick.id]: originalConditionTickTick,
        },
      },
      makeChange: () => {
        (getUniqueId as jest.Mock<() => string>).mockImplementation(
          () => originalConditionTickTick.id
        );
        new AddCondition({
          castMemberId: originalCastMembers[1].id,
          condition: originalConditionTickTick,
        });
      },
    },

    {
      changes: [
        {
          id: `${i++}`,
          type: "c",
          object: originalCastMembers[1].id,
          action: "ends their turn",
          property: "myTurn",
          oldValue: true,
          newValue: false,
        },
        {
          id: `${i++}`,
          type: "c",
          object: originalCastMembers[0].id,
          action: "starts their turn",
          property: "myTurn",
          oldValue: false,
          newValue: true,
        },
        {
          id: `${i++}`,
          type: "c",
          object: originalCastMembers[1].id,
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
        {
          id: `${i++}`,
          type: "c",
          object: originalCastMembers[0].id,
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
      ],
      makeChange: () => {
        new StartTurn({ castMemberId: originalCastMembers[0].id });
      },
    },

    {
      changes: [
        {
          id: `${i++}`,
          type: "c",
          object: originalCastMembers[0].id,
          action: "ends their turn",
          property: "myTurn",
          oldValue: true,
          newValue: false,
        },
        {
          id: `${i++}`,
          type: "c",
          object: originalCastMembers[0].id,
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
        {
          id: `${i++}`,
          type: "c",
          object: originalCastMembers[0].id,
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
        {
          id: `${i++}`,
          type: "c",
          object: originalCastMembers[1].id,
          action: "starts their turn",
          property: "myTurn",
          oldValue: false,
          newValue: true,
        },
      ],
      makeChange: () => {
        new StartTurn({ castMemberId: originalCastMembers[1].id });
      },
    },

    {
      changes: [
        {
          id: `${i++}`,
          type: "c",
          object: originalCastMembers[1].id,
          action: "ends their turn",
          property: "myTurn",
          oldValue: true,
          newValue: false,
        },
        {
          id: `${i++}`,
          type: "c-",
          object: originalCastMembers[1].id,
          action: "passes time on a condition (natural expire)",
          property: "conditions",
          oldValue: {
            [originalConditionTickExpire.id]: {
              ...originalConditionTickExpire,
              duration: originalConditionTickExpire.duration! - 1,
            },
          },
        },
        {
          id: `${i++}`,
          type: "c",
          object: originalCastMembers[0].id,
          action: "starts their turn",
          property: "myTurn",
          oldValue: false,
          newValue: true,
        },
        {
          id: `${i++}`,
          type: "c-",
          object: originalCastMembers[0].id,
          action: "expires a condition (start turn)",
          property: "conditions",
          oldValue: {
            [originalConditionStartTurn.id]: {
              ...originalConditionStartTurn,
              duration: originalConditionStartTurn.duration! - 1,
            },
          },
        },
      ],
      makeChange: () => {
        new StartTurn({ castMemberId: originalCastMembers[0].id });
      },
    },

    {
      changes: [
        {
          id: `${i++}`,
          type: "c-",
          object: originalCastMembers[0].id,
          action: "dismisses a condition (early expire)",
          property: "conditions",
          oldValue: {
            [originalConditionTickExpire.id]: {
              ...originalConditionTickExpire,
              duration: originalConditionTickExpire.duration! - 1,
            },
          },
        },
      ],
      makeChange: () => {
        new RemoveCondition({
          castMemberId: originalCastMembers[0].id,
          condition: originalConditionTickExpire.id,
        });
      },
    },

    {
      changes: [
        {
          id: `${i++}`,
          type: "c",
          object: originalCastMembers[0].id,
          action: "ends their turn",
          property: "myTurn",
          oldValue: true,
          newValue: false,
        },
        {
          id: `${i++}`,
          type: "c-",
          object: originalCastMembers[1].id,
          action: "expires a condition (end turn)",
          property: "conditions",
          oldValue: {
            [originalConditionEndTurn.id]: {
              ...originalConditionEndTurn,
              duration: originalConditionEndTurn.duration! - 1,
            },
          },
        },
        {
          id: `${i++}`,
          type: "c",
          object: originalCastMembers[1].id,
          action: "starts their turn",
          property: "myTurn",
          oldValue: false,
          newValue: true,
        },
      ],
      makeChange: () => {
        new StartTurn({ castMemberId: originalCastMembers[1].id });
      },
    },

    // {
    //   changes: {
    //     id: `${i++}`,
    //     type: "c",
    //     object: originalCastMember1.id,
    //     action: "gains temporary hit points",
    //     property: "hpTemp",
    //     oldValue: 0,
    //     newValue: 3,
    //   },
    //   makeChange: (castMember) =>
    //     giveCastMemberTemporaryHitPoints(castMember, 3),
    // },
    // {
    //   changes: [
    //     {
    //       id: `${i++}`,
    //       type: "c",
    //       object: originalCastMember1.id,
    //       action: "is damaged (temporary hit points)",
    //       property: "hpTemp",
    //       oldValue: 3,
    //       newValue: 0,
    //     },
    //     {
    //       id: `${i++}`,
    //       type: "c",
    //       object: originalCastMember1.id,
    //       action: "is damaged",
    //       property: "hpCurrent",
    //       oldValue: originalCastMember1.hpCurrent,
    //       newValue: originalCastMember1.hpCurrent - 1,
    //     },
    //   ],
    //   makeChange: (castMember) =>
    //     damageCastMember(castMember, 4, "bludgeoning"),
    // },
    // {
    //   changes: {
    //     id: `${i++}`,
    //     type: "c",
    //     object: originalCastMember1.id,
    //     action: "is damaged with something it resists",
    //     property: "hpCurrent",
    //     oldValue: originalCastMember1.hpCurrent - 1,
    //     newValue: originalCastMember1.hpCurrent - 2,
    //   },
    //   makeChange: (castMember) => damageCastMember(castMember, 2, "acid"),
    // },
    // {
    //   changes: {
    //     id: `${i++}`,
    //     type: "c",
    //     object: originalCastMember1.id,
    //     action: "is damaged with something it's vulerable to",
    //     property: "hpCurrent",
    //     oldValue: originalCastMember1.hpCurrent - 2,
    //     newValue: originalCastMember1.hpCurrent - 4,
    //   },
    //   makeChange: (castMember) => damageCastMember(castMember, 1, "radiant"),
    // },
    // {
    //   changes: {
    //     id: `${i++}`,
    //     type: "c",
    //     object: originalCastMember1.id,
    //     action: "is healed",
    //     property: "hpCurrent",
    //     oldValue: originalCastMember1.hpCurrent - 4,
    //     newValue: originalCastMember1.hp,
    //   },
    //   makeChange: (castMember) =>
    //     healCastMember(castMember, originalCastMember1.hp + 10),
    // },

    {
      changes: {
        id: `${i++}`,
        type: "-",
        object: originalCastMembers[0].id,
        action: "is removed from the game",
      },
      makeChange: () => {
        new RemoveCastMember({ castMemberId: originalCastMembers[0].id });
      },
    },
    {
      changes: {
        id: `${i++}`,
        type: "-",
        object: originalCastMembers[1].id,
        action: "is removed from the game",
      },
      makeChange: () => {
        new RemoveCastMember({ castMemberId: originalCastMembers[1].id });
      },
    },
  ];

  function testChangeEvent(testEntry: (typeof tests)[number]) {
    let target: ReturnType<typeof getHistoryHandle<CastMember>>;
    const { changes: tmp, makeChange } = testEntry;
    const changes = Array.isArray(tmp) ? tmp : [tmp];
    const isNotAChange = !!changes.find(
      ({ type }) => type === "+" || type === "-"
    );
    const action = changes.map(({ action }) => action).join(" and ");
    let priorStateChangeHistoryLength: number;
    let priorChangeEventHistoryLength: number;
    let beforeChangeCastMembers: Array<CastMember | undefined>;

    describe(`a cast member ${action}`, () => {
      beforeOnce(() => {
        target = getHistoryHandle<CastMember>("CastMember");
        target.setHistory([]);

        const index = tests.indexOf(testEntry);
        for (let i = 0; i < index; i++) {
          const { makeChange } = tests[i];
          makeChange();
        }
        priorStateChangeHistoryLength = target.getHistory().length;
        priorChangeEventHistoryLength = getHistory().length;
        beforeChangeCastMembers = originalCastMembers.map(({ id }) =>
          getCastMember(id, undefined, true)
        );
        makeChange();
      });
      test("it should return the new CastMember and it should be a different object", () => {
        originalCastMembers.forEach((originalCastMember, i) => {
          const currentCastMember = getCastMember(
            originalCastMember.id,
            undefined,
            true
          );
          if (target.getHistory().length > i) {
            expect(currentCastMember).toBeDefined();
            expect(currentCastMember).not.toBe(beforeChangeCastMembers[i]);
            expect(currentCastMember).not.toBe(originalCastMember);
          } else {
            expect(currentCastMember).toBeUndefined();
          }
        });
      });
      test("it should track the change in history", () => {
        expect(target.getHistory().length).toEqual(
          priorStateChangeHistoryLength + changes.length
        );
        expect(getHistory().length).toEqual(priorChangeEventHistoryLength + 1);
      });
      changes.forEach((change) => {
        if (!change.property) {
          return;
        }
        test(`it should have set ${change.property} on the new CastMember object and not on the old CastMember object`, () => {
          const index = originalCastMembers.findIndex(
            ({ id }) => id === change.object
          );
          const originalCastMember = originalCastMembers[index];
          const beforeChangeCastMember = beforeChangeCastMembers[index]!;
          const currentCastMember = getCastMember(originalCastMember.id)!;
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
          const history = getHistory();
          const event = history[history.length - 1];
          const currentCastMember = getCastMember(event.castMemberId);
          const index = originalCastMembers.findIndex(
            ({ id }) => id === event.castMemberId
          );
          const beforeChangeCastMember = beforeChangeCastMembers[index]!;
          const undoneCastMember = event.undo();
          expect(undoneCastMember).not.toBe(currentCastMember);
          expect(undoneCastMember).not.toBe(beforeChangeCastMember);
          expect(undoneCastMember).toEqual(beforeChangeCastMember);
        });
      }
      test("it should be able to reconstruct the updated item from history", () => {
        const removal = !!changes.find(({ type }) => type === "-");
        const history = getHistory();
        const event = history[history.length - 1];
        const currentCastMember = getCastMember(event.castMemberId);
        if (removal) {
          expect(currentCastMember).toBeUndefined();
        } else {
          expect(currentCastMember).toBeDefined();
        }
      });
    });
  }

  testChangeEvent(tests[0]);
  // tests.forEach((testEntry) => testChangeEvent(testEntry));

  // function testNoChange(
  //   makeChange: ChangeState<CastMember>,
  //   setup?: () => CastMember
  // ) {
  //   let priorHistoryLength: number;
  //   let beforeChangeCastMember: CastMember;
  //   beforeOnce(() => {
  //     target = getHistoryHandle("CastMember");
  //     target.setHistory([]);

  //     currentCastMember = originalCastMember1;
  //     if (setup) {
  //       currentCastMember = setup();
  //     }

  //     priorHistoryLength = target.getHistory().length;
  //     beforeChangeCastMember = currentCastMember;
  //     currentCastMember = makeChange(currentCastMember);
  //   });
  //   test("it should return the same CastMember and it should be the same object", () => {
  //     expect(currentCastMember).toBeDefined();
  //     expect(currentCastMember).toBe(beforeChangeCastMember);
  //     if (!setup) {
  //       expect(currentCastMember).toBe(originalCastMember1);
  //     }
  //   });
  //   test("it should not track the change in history", () => {
  //     expect(target.getHistory().length).toEqual(priorHistoryLength);
  //   });
  // }

  // describe(`a cast member adds a condition it's immune to`, () => {
  //   testNoChange((castMember) =>
  //     addCondition(castMember, { condition: Condition.CHARMED }, true)
  //   );
  // });
  // describe(`a cast member receives damage it's immune to`, () => {
  //   testNoChange((castMember) => damageCastMember(castMember, 10, "cold"));
  // });
  // describe(`a cast member gains less temporary hit points than it already has`, () => {
  //   testNoChange(
  //     (castMember) => giveCastMemberTemporaryHitPoints(castMember, 2),
  //     () => giveCastMemberTemporaryHitPoints(originalCastMember1, 3)
  //   );
  // });
});
