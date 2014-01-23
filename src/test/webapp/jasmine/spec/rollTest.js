/* global jasmine, define, beforeEach, afterEach, it, expect */
/* exported */
(function() {
    "use strict";


    describe("Roll", function() {
        var diceNotations, s, roll, result;
        diceNotations = s = roll = result = null;
        diceNotations = {
                "0": { dieCount: 0, dieSides: 0, extra: 0, crits: false, type: null, crit: null, needsWeapon: false, weaponMultiplier: 0, meleeExtra: 0, rangedExtra: 0, /* testing properties */ max: 0, min: 0, breakdown: "[0] 0" },
                "1": { dieCount: 0, dieSides: 0, extra: 1, crits: false, type: null, crit: null, needsWeapon: false, weaponMultiplier: 0, meleeExtra: 0, rangedExtra: 0,  /* testing properties */ max: 1, min: 1, breakdown: "[1] 1" },
                "2": { dieCount: 0, dieSides: 0, extra: 2, crits: false, type: null, crit: null, needsWeapon: false, weaponMultiplier: 0, meleeExtra: 0, rangedExtra: 0,  /* testing properties */ max: 2, min: 2, breakdown: "[2] 2" },
                "3": { dieCount: 0, dieSides: 0, extra: 3, crits: false, type: null, crit: null, needsWeapon: false, weaponMultiplier: 0, meleeExtra: 0, rangedExtra: 0,  /* testing properties */ max: 3, min: 3, breakdown: "[3] 3" },
                "1d6": { dieCount: 1, dieSides: 6, extra: 0, crits: false, type: null, crit: null, needsWeapon: false, weaponMultiplier: 0, meleeExtra: 0, rangedExtra: 0,  /* testing properties */ max: 6, min: 1, breakdown: "[1d6] 6" },
                "2d4": { dieCount: 2, dieSides: 4, extra: 0, crits: false, type: null, crit: null, needsWeapon: false, weaponMultiplier: 0, meleeExtra: 0, rangedExtra: 0,  /* testing properties */ max: 8, min: 2, breakdown: "[2d4] 4 + 4" },
                "3d8+5": { dieCount: 3, dieSides: 8, extra: 5, crits: false, type: null, crit: null, needsWeapon: false, weaponMultiplier: 0, meleeExtra: 0, rangedExtra: 0,  /* testing properties */ max: 29, min: 8, breakdown: "[3d8+5] 8 + 8 + 8 + 5" },
                "4d10-7": { dieCount: 4, dieSides: 10, extra: -7, crits: false, type: null, crit: null, needsWeapon: false, weaponMultiplier: 0, meleeExtra: 0, rangedExtra: 0,  /* testing properties */ max: 33, min: -3, breakdown: "[4d10-7] 10 + 10 + 10 + 10 -7" },
                "1d20+14": { dieCount: 1, dieSides: 20, extra: 14, crits: true, type: null, crit: null, needsWeapon: false, weaponMultiplier: 0, meleeExtra: 0, rangedExtra: 0, /* testing properties */ max: 34, min: 15, breakdown: "[1d20+14] CRIT" }
        };

        describe("is instantiated", function() {
            describe("with no arguments", function() {
                beforeEach(function() {
                    roll = new DnD.Roll({});
                });
                it("it should exist", function() {
                    expect(roll).not.toEqual(undefined);
                    expect(roll).not.toEqual(null);
                });
                it("it should initialize properly", function() {
                    var r = roll.getValues();
                    expect(r._history).toEqual([]);
                    expect(r.dieCount).toEqual(0);
                    expect(r.dieSides).toEqual(0);
                    expect(r.extra).toEqual(0);
                    expect(r.crits).toEqual(false);
                });
            });

            describe("from a String", function() {
                var checkField, itExists, itInitializes;
                checkField = itExists = itInitializes = null;
                checkField = function(s, p) {
                    roll = new DnD.Roll(s);
                    expect(roll.get(p)).toEqual(diceNotations[ s ][ p ]);
                };
                itExists = function(s) {
                    roll = new DnD.Roll(s);
                    expect(roll).not.toEqual(undefined);
                    expect(roll).not.toEqual(null);
                };
                itInitializes = function(s) {
                    var r;
                    roll = new DnD.Roll(s);
                    r = roll.getValues();
                    expect(r._history).toEqual([]);
                    expect(r.crits).toEqual(false);
                };
                for (s in diceNotations) {
                    it("it should exist [" + s + "]", itExists.bind(this, s));
                    it("it should initialize properly [" + s + "]", itInitializes.bind(this, s));
                    it("it should have the correct number of dice [" + s + "]", checkField.bind(this, s, "dieCount"));
                    it("it should have the correct number of sides [" + s + "]", checkField.bind(this, s, "dieSides"));
                    it("it should have the correct extra amount [" + s + "]", checkField.bind(this, s, "extra"));
                }
            });

            describe("from an Object", function() {
                var checkField, itExists, itInitializes;
                checkField = function(s, p) {
                    roll = new DnD.Roll(diceNotations[ s ]);
                    expect(roll.get(p)).toEqual(diceNotations[ s ][ p ]);
                };
                itExists = function(s) {
                    roll = new DnD.Roll(diceNotations[ s ]);
                    expect(roll).not.toEqual(undefined);
                    expect(roll).not.toEqual(null);
                };
                itInitializes = function(s) {
                    roll = new DnD.Roll(diceNotations[ s ]);
                    expect(roll.get("_history")).toEqual([]);
                };
                for (s in diceNotations) {
                    it("it should exist [" + s + "]", itExists.bind(this, s));
                    it("it should initialize properly [" + s + "]", itInitializes.bind(this, s));
                    it("it should have the correct number of dice [" + s + "]", checkField.bind(this, s, "dieCount"));
                    it("it should have the correct number of sides [" + s + "]", checkField.bind(this, s, "dieSides"));
                    it("it should have the correct extra amount [" + s + "]", checkField.bind(this, s, "extra"));
                    it("it should properly crit [" + s + "]", checkField.bind(this, s, "crits"));
                }
            });
        });

        describe("calls clone()", function() {
            var checkField, clone, itExists, itInitializes;
            checkField = function(s, p) {
                roll = new DnD.Roll(diceNotations[ s ]);
                clone = roll.clone();
                expect(clone.get(p)).toEqual(roll.get(p));
            };
            itExists = function(s) {
                roll = new DnD.Roll(diceNotations[ s ]);
                clone = roll.clone();
                expect(clone).not.toEqual(undefined);
                expect(clone).not.toEqual(null);
            };
            itInitializes = function(s) {
                roll = new DnD.Roll(diceNotations[ s ]);
                clone = roll.clone().getValues();
                expect(clone._history).toEqual([]);
            };
            for (s in diceNotations) {
                it("it should exist [" + s + "]", itExists.bind(this, s));
                it("it should initialize properly [" + s + "]", itInitializes.bind(this, s));
                it("it should have the correct number of dice [" + s + "]", checkField.bind(this, s, "dieCount"));
                it("it should have the correct number of sides [" + s + "]", checkField.bind(this, s, "dieSides"));
                it("it should have the correct extra amount [" + s + "]", checkField.bind(this, s, "extra"));
                it("it should properly crit [" + s + "]", checkField.bind(this, s, "crits"));
            }
        });

        describe("calls roll()", function() {
            var itNumber, itHistory, itDice;
            itNumber = function(s) {
                var values;
                roll = new DnD.Roll(diceNotations[ s ]);
                result = roll.roll();
                values = roll.getValues();
                expect(values.dieCount + values.extra <= result).toEqual(true);
                expect(result <= values.dieCount * values.dieSides + values.extra).toEqual(true);
                result = roll.roll();
                values = roll.getValues();
                expect(values.dieCount + values.extra <= result).toEqual(true);
                expect(result <= values.dieCount * values.dieSides + values.extra).toEqual(true);
                result = roll.roll();
                values = roll.getValues();
                expect(values.dieCount + values.extra <= result).toEqual(true);
                expect(result <= values.dieCount * values.dieSides + values.extra).toEqual(true);
            };
            itHistory = function(s) {
                var values;
                roll = new DnD.Roll(diceNotations[ s ]);
                values = roll.getValues();
                expect(values._history).toEqual([]);
                result = roll.roll();
                values = roll.getValues();
                expect(values._history.length).toEqual(1);
                result = roll.roll();
                values = roll.getValues();
                expect(values._history.length).toEqual(2);
                result = roll.roll();
                values = roll.getValues();
                expect(values._history.length).toEqual(3);
            };
            itDice = function(s) {
                var values, i;
                roll = new DnD.Roll(diceNotations[ s ]);
                result = roll.roll();
                values = roll.getValues();
                expect(values._history[ 0 ]).not.toEqual(undefined);
                expect(values._history[ 0 ]).not.toEqual(null);
                expect(typeof(values._history[ 0 ])).toEqual("object");
                expect(typeof(values._history[ 0 ].dice)).toEqual("object");
                expect(values._history[ 0 ].dice.constructor).toEqual(Array);
                expect(values._history[ 0 ].dice.length).toEqual(values.dieCount);
                for (i = 0; i < values._history[ 0 ].dice.length; i++) {
                    expect(typeof(values._history[ 0 ].dice[ i ])).toEqual("number");
                    expect(1 <= values._history[ 0 ].dice[ i ]).toEqual(true);
                    expect(values._history[ 0 ].dice[ i ] <= values.dieSides).toEqual(true);
                }
                expect(values._history[ 0 ].total).toEqual(result);
            };
            for (s in diceNotations) {
                it("it should return a Number within the range allowed by the dice [" + s + "]", itNumber.bind(this, s));
                it("it should add the roll to its history [" + s + "]", itHistory.bind(this, s));
                it("each history entry should have an Array containing the rolled value of each die and the total [" + s + "]", itDice.bind(this, s));
            }
        });

        describe("max()", function() {
            var itNumber, itHistory, itDice;
            itNumber = function(s) {
                roll = new DnD.Roll(diceNotations[ s ]);
                result = roll.max();
                expect(result).toEqual(diceNotations[ s ].max);
            };
            itHistory = function(s) {
                var values;
                roll = new DnD.Roll(diceNotations[ s ]);
                values = roll.getValues();
                expect(values._history).toEqual([]);
                result = roll.max();
                values = roll.getValues();
                expect(values._history.length).toEqual(1);
                result = roll.max();
                values = roll.getValues();
                expect(values._history.length).toEqual(2);
                result = roll.max();
                values = roll.getValues();
                expect(values._history.length).toEqual(3);
            };
            itDice = function(s) {
                var values, i;
                roll = new DnD.Roll(diceNotations[ s ]);
                result = roll.max();
                values = roll.getValues();
                expect(values._history[ 0 ]).not.toEqual(undefined);
                expect(values._history[ 0 ]).not.toEqual(null);
                expect(typeof(values._history[ 0 ])).toEqual("object");
                expect(typeof(values._history[ 0 ].dice)).toEqual("object");
                expect(values._history[ 0 ].dice.constructor).toEqual(Array);
                expect(values._history[ 0 ].dice.length).toEqual(values.dieCount);
                for (i = 0; i < values._history[ 0 ].dice.length; i++) {
                    expect(typeof(values._history[ 0 ].dice[ i ])).toEqual("number");
                    expect(values._history[ 0 ].dice[ i ]).toEqual(values.dieSides);
                }
                expect(values._history[ 0 ].total).toEqual(result);
                expect(values._history[ 0 ].isMax).toEqual(true);
            };
            for (s in diceNotations) {
                it("should return a Number that is the minimum possible value for the Roll [" + s + "]", itNumber.bind(this, s));
                it("should add the roll to its history [" + s + "]", itHistory.bind(this, s));
                it("each history entry should have an Array containing the rolled value of each die, the total, and isMax: true [" + s + "]", itDice.bind(this, s));
            }
        });

        describe("min()", function() {
            var itNumber, itHistory, itDice;
            itNumber = function(s) {
                roll = new DnD.Roll(diceNotations[ s ]);
                result = roll.min();
                expect(result).toEqual(diceNotations[ s ].min);
            };
            itHistory = function(s) {
                var values;
                roll = new DnD.Roll(diceNotations[ s ]);
                values = roll.getValues();
                expect(values._history).toEqual([]);
                result = roll.min();
                values = roll.getValues();
                expect(values._history.length).toEqual(1);
                result = roll.min();
                values = roll.getValues();
                expect(values._history.length).toEqual(2);
                result = roll.min();
                values = roll.getValues();
                expect(values._history.length).toEqual(3);
            };
            itDice = function(s) {
                var values, i;
                roll = new DnD.Roll(diceNotations[ s ]);
                result = roll.min();
                values = roll.getValues();
                expect(values._history[ 0 ]).not.toEqual(undefined);
                expect(values._history[ 0 ]).not.toEqual(null);
                expect(typeof(values._history[ 0 ])).toEqual("object");
                expect(typeof(values._history[ 0 ].dice)).toEqual("object");
                expect(values._history[ 0 ].dice.constructor).toEqual(Array);
                expect(values._history[ 0 ].dice.length).toEqual(values.dieCount);
                for (i = 0; i < values._history[ 0 ].dice.length; i++) {
                    expect(typeof(values._history[ 0 ].dice[ i ])).toEqual("number");
                    expect(values._history[ 0 ].dice[ i ]).toEqual(1);
                }
                expect(values._history[ 0 ].total).toEqual(result);
                expect(values._history[ 0 ].isMin).toEqual(true);
            };
            for (s in diceNotations) {
                it("should return a Number that is the maximum possible value for the Roll [" + s + "]", itNumber.bind(this, s));
                it("should add the roll to its history [" + s + "]", itHistory.bind(this, s));
                it("each history entry should have an Array containing the rolled value of each die, the total, and isMin: true [" + s + "]", itDice.bind(this, s));
            }
        });

        describe("add()", function() {
            var itHistory, itDice;
            itHistory = function(s, r) {
                var values;
                roll = new DnD.Roll(diceNotations[ s ]);
                values = roll.getValues();
                expect(values._history).toEqual([]);
                roll.add(r);
                values = roll.getValues();
                expect(values._history.length).toEqual(1);
                roll.add(r);
                values = roll.getValues();
                expect(values._history.length).toEqual(2);
                roll.add(r);
                values = roll.getValues();
                expect(values._history.length).toEqual(3);
            };
            itDice = function(s, r) {
                var values, i, total;
                roll = new DnD.Roll(diceNotations[ s ]);
                roll.add(r);
                values = roll.getValues();
                expect(values._history[ 0 ]).not.toEqual(undefined);
                expect(values._history[ 0 ]).not.toEqual(null);
                expect(typeof(values._history[ 0 ])).toEqual("object");
                expect(typeof(values._history[ 0 ].dice)).toEqual("object");
                expect(values._history[ 0 ].dice.constructor).toEqual(Array);
                expect(values._history[ 0 ].dice.length).toEqual(values.dieCount);
                total = 0;
                for (i = 0; i < values._history[ 0 ].dice.length; i++) {
                    expect(typeof(values._history[ 0 ].dice[ i ])).toEqual("number");
                    total += values._history[ 0 ].dice[ i ];
                }
                total += values.extra;
                expect(values._history[ 0 ].total).toEqual(total);
                expect(values._history[ 0 ].manual).toEqual(true);
            };
            for (s in diceNotations) {
                result = diceNotations[ s ].min + Math.floor(Math.random() * (diceNotations[ s ].max - diceNotations[ s ].min));
                it("should add the roll to its history [" + s + "]", itHistory.bind(this, s, result));
                it("each history entry should have an Array containing the rolled value of each die, the total, and manual: true [" + s + "]", itDice.bind(this, s, result));
            }
        });

        describe("getLastRoll()", function() {
            var itReturn, itEmpty;
            itReturn = function(s) {
                var values;
                roll = new DnD.Roll(diceNotations[ s ]);
                roll.roll();
                values = roll.getValues();
                expect(roll.getLastRoll()).toEqual(values._history[ values._history.length - 1 ]);
            };
            itEmpty = function(s) {
                roll = new DnD.Roll(diceNotations[ s ]);
                expect(roll.getLastRoll()).toEqual({ total: 0, dice: [] });
            };
            for (s in diceNotations) {
                it("should return the last history entry [" + s + "]", itReturn.bind(this, s));
                it("if there is no history, it should return an empty history entry [" + s + "]", itEmpty.bind(this, s));
            }
        });

        describe("isCritical()", function() {
            var itNotCrit, itNoRolls, itNot20, itCrit;
            itNotCrit = function(s) {
                roll = new DnD.Roll(diceNotations[ s ]);
                roll.max();
                expect(roll.isCritical()).toEqual(false);
            };
            itNoRolls = function(s) {
                roll = new DnD.Roll(diceNotations[ s ]);
                expect(roll.isCritical()).toEqual(false);
            };
            itNot20 = function(s) {
                roll = new DnD.Roll(diceNotations[ s ]);
                roll.add(diceNotations[ s ].min + Math.floor(Math.random() * (diceNotations[ s ].max - 1 - diceNotations[ s ].min)));
                expect(roll.isCritical()).toEqual(false);
                roll.add(diceNotations[ s ].min + Math.floor(Math.random() * (diceNotations[ s ].max - 1 - diceNotations[ s ].min)));
                expect(roll.isCritical()).toEqual(false);
                roll.add(diceNotations[ s ].min + Math.floor(Math.random() * (diceNotations[ s ].max - 1 - diceNotations[ s ].min)));
                expect(roll.isCritical()).toEqual(false);
            };
            itCrit = function(s) {
                roll = new DnD.Roll(diceNotations[ s ]);
                roll.max();
                expect(roll.isCritical()).toEqual(true);
            };
            for (s in diceNotations) {
                if (!diceNotations[ s ].crits || diceNotations[ s ].dieCount !== 1 || diceNotations[ s ].dieSides !== 20) {
                    it("should always return false if crits: false or isn't 1d20... [" + s + "]", itNotCrit.bind(this, s));
                }
                else {
                    it("should return false if there have been no rolls [" + s + "]", itNoRolls.bind(this, s));
                    it("should return false if not a die value of 20 [" + s + "]", itNot20.bind(this, s));
                    it("should return true if a die value of 20 [" + s + "]", itCrit.bind(this, s));
                }
            }
        });

        describe("isFumble()", function() {
            var itNotFumble, itNoRolls, itNot1, itFumble;
            itNotFumble = function(s) {
                roll = new DnD.Roll(diceNotations[ s ]);
                roll.min();
                expect(roll.isFumble()).toEqual(false);
            };
            itNoRolls = function(s) {
                roll = new DnD.Roll(diceNotations[ s ]);
                expect(roll.isFumble()).toEqual(false);
            };
            itNot1 = function(s) {
                roll = new DnD.Roll(diceNotations[ s ]);
                roll.add(diceNotations[ s ].min + 1 + Math.floor(Math.random() * (diceNotations[ s ].max - 1 - diceNotations[ s ].min)));
                expect(roll.isFumble()).toEqual(false);
                roll.add(diceNotations[ s ].min + 1 + Math.floor(Math.random() * (diceNotations[ s ].max - 1 - diceNotations[ s ].min)));
                expect(roll.isFumble()).toEqual(false);
                roll.add(diceNotations[ s ].min + 1 + Math.floor(Math.random() * (diceNotations[ s ].max - 1 - diceNotations[ s ].min)));
                expect(roll.isFumble()).toEqual(false);
            };
            itFumble = function(s) {
                roll = new DnD.Roll(diceNotations[ s ]);
                roll.min();
                expect(roll.isFumble()).toEqual(true);
            };
            for (s in diceNotations) {
                if (!diceNotations[ s ].crits || diceNotations[ s ].dieCount !== 1 || diceNotations[ s ].dieSides !== 20) {
                    it("should always return false if crits: false or isn't 1d20... [" + s + "]", itNotFumble.bind(this, s));
                }
                else {
                    it("should return false if there have been no rolls [" + s + "]", itNoRolls.bind(this, s));
                    it("should return false if not a die value of 1 [" + s + "]", itNot1.bind(this, s));
                    it("should return true if a die value of 1 [" + s + "]", itFumble.bind(this, s));
                }
            }
        });

        describe("toString()", function() {
            var itReturn;
            itReturn = function(s) {
                roll = new DnD.Roll(diceNotations[ s ]);
                expect(roll.toString()).toEqual(s);
            };
            for (s in diceNotations) {
                it("should return " + s, itReturn.bind(this, s));
            }
        });

        describe("breakdown()", function() {
            var itReturn;
            itReturn = function(s) {
                roll = new DnD.Roll(diceNotations[ s ]);
                roll.max();
                expect(roll.breakdown()).toEqual(diceNotations[ s ].breakdown);
            };
            for (s in diceNotations) {
                it("should return " + diceNotations[ s ].breakdown, itReturn.bind(this, s));
                // TODO: conditionals
            }
        });

        describe("anchor()", function() {
            var itReturn;
            itReturn = function(s) {
                var result, anchor;
                roll = new DnD.Roll(diceNotations[ s ]);
                result = roll.max();
                anchor = roll.anchor();
                expect(anchor).toEqual("<a href=\"javascript:void(0);\" title=\"" + diceNotations[ s ].breakdown + "\">" + result + "</a>");
            };
            for (s in diceNotations) {
                it("should return an anchor with breakdown() as the title and last roll total as innerHTML" + diceNotations[ s ].breakdown, itReturn.bind(this, s));
                // TODO: conditionals
            }
        });

        describe("raw()", function() {
            describe("should return an Object that when passed to new DnD.Roll(Object) creates an identical Roll instance", function() {
                var roll2, p, itFn;
                itFn = function(r1, r2, p) {
                    expect(r2.get(p)).toEqual(r1.get(p));
                };
                for (s in diceNotations) {
                    roll = new DnD.Roll(diceNotations[ s ]);
                    result = roll.raw();
                    roll2 = new DnD.Roll(result);
                    p = null;
                    for (p in roll) {
                        if (roll.hasOwnProperty(p) && p.substring(0,2) !== "__") {
                            it(p + " [" + s + "]", itFn.bind(this, roll, roll2, p));
                        }
                    }
                }
            });
        });

    });

})();