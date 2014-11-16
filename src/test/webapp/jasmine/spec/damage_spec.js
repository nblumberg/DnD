/**
 * Created by nblumberg on 10/12/14.
 */

(function (Damage) {
    "use strict";

    describe("actions.js", function() {
        var diceNotations, s, result;
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

        describe("Damage", function () {
            var damage, damageNotations, creature;
            damageNotations = jQuery.extend({
                "1[W]+3": { dieCount: 0, dieSides: 0, extra: 3, crits: false, type: null, crit: null, needsWeapon: true, weaponMultiplier: 1, meleeExtra: 0, rangedExtra: 0, /* testing properties */ max: 0, min: 0, breakdown: "[1[W]+3] " },
                "2[W]": { dieCount: 0, dieSides: 0, extra: 0, crits: false, type: null, crit: null, needsWeapon: true, weaponMultiplier: 2, meleeExtra: 0, rangedExtra: 0, /* testing properties */ max: 0, min: 0, breakdown: "[2[W]] " },
                "3d8+STR": { dieCount: 3, dieSides: 8, extra: 6, crits: false, type: null, crit: null, needsWeapon: false, weaponMultiplier: 0, meleeExtra: 0, rangedExtra: 0, /* testing properties */ max: 0, min: 0, breakdown: "[3d8+1] 8 + 8 + 8 + 1" },
                "3[W]+STR+CHA": { dieCount: 0, dieSides: 0, extra: 7, crits: false, type: null, crit: null, needsWeapon: true, weaponMultiplier: 3, meleeExtra: 0, rangedExtra: 0, /* testing properties */ max: 0, min: 0, breakdown: "[3[W]+7] " },
                "4[W]+STR^CHA": { dieCount: 0, dieSides: 0, extra: 6, crits: false, type: null, crit: null, needsWeapon: true, weaponMultiplier: 4, meleeExtra: 0, rangedExtra: 0, /* testing properties */ max: 0, min: 0, breakdown: "[3[W]+6] " },
                "5[W]+STR/DEX": { dieCount: 0, dieSides: 0, extra: 0, crits: false, type: null, crit: null, needsWeapon: true, weaponMultiplier: 5, meleeExtra: 1, rangedExtra: 3, /* testing properties */ max: 0, min: 0, breakdown: "[3[W]+6] " }
            }, diceNotations);
            creature = { abilities: { STRmod: 1, CONmod: 2, DEXmod: 3, INTmod: 4, WISmod: 5, CHAmod: 6 } };

            describe("new", function () {
                describe("default", function () {
                    beforeEach(function () {
                        damage = new Damage(null, creature);
                    });
                    it("should exist", function () {
                        expect(damage).not.toEqual(undefined);
                        expect(damage).not.toEqual(null);
                    });
                    it("should initialize properly", function () {
                        expect(damage._history).toEqual([]);
                        expect(damage.dieCount).toEqual(1);
                        expect(damage.dieSides).toEqual(0);
                        expect(damage.extra).toEqual(0);
                        expect(damage.crits).toEqual(false);

                        expect(damage.type).toEqual("");
                        expect(damage.crit).toEqual(null);
                        expect(damage.needsWeapon).toEqual(false);
                        expect(damage.weaponMultiplier).toEqual(0);
                        expect(damage.meleeExtra).toEqual(0);
                        expect(damage.rangedExtra).toEqual(0);
                    });
                });

                describe("from String", function () {
                    var s, w, checkField, itExists, itInitializes;
                    checkField = function (s, w, p) {
                        damage = new Damage(s, creature);
                        expect(damage[ p ]).toEqual(damageNotations[ s ][ p ]);
                    };
                    itExists = function (s) {
                        damage = new Damage(s, creature);
                        expect(damage).not.toEqual(undefined);
                        expect(damage).not.toEqual(null);
                    };
                    itInitializes = function (s) {
                        damage = new Damage(s, creature);
                        expect(damage._history).toEqual([]);
                        expect(damage.crits).toEqual(false);

                        expect(damage.type).toEqual("");
                        expect(damage.crit).toEqual(null);
                        expect(damage.needsWeapon).toEqual(damageNotations[ s ].needsWeapon || false);
                        expect(damage.weaponMultiplier).toEqual(damageNotations[ s ].weaponMultiplier || 0);
                        expect(damage.meleeExtra).toEqual(damageNotations[ s ].meleeExtra || 0);
                        expect(damage.rangedExtra).toEqual(damageNotations[ s ].rangedExtra || 0);
                    };
                    for (s in damageNotations) {
                        it("should exist [" + s + "]", itExists.bind(this, s));
                        it("should initialize properly [" + s + "]", itInitializes.bind(this, s));
                        it("should have the correct number of dice [" + s + "]", checkField.bind(this, s, "dieCount"));
                        it("should have the correct number of sides [" + s + "]", checkField.bind(this, s, "dieSides"));
                        it("should have the correct extra amount [" + s + "]", checkField.bind(this, s, "extra"));
                        it("should have the same type [" + s + "]", checkField.bind(this, s, "type"));
                        it("should also need/not need a weapon [" + s + "]", checkField.bind(this, s, "needsWeapon"));
                        it("should have the same weapon multiplier [" + s + "]", checkField.bind(this, s, "weaponMultiplier"));
                        it("should have the same melee extra [" + s + "]", checkField.bind(this, s, "meleeExtra"));
                        it("should have the same ranged extra [" + s + "]", checkField.bind(this, s, "rangedExtra"));
                    }
                });

                describe("from Object", function () {
                    var checkField, s, itExists, itInitializes;
                    checkField = function (s, p) {
                        damage = new Damage(damageNotations[ s ], creature);
                        expect(damage[ p ]).toEqual(damageNotations[ s ][ p ]);
                    };
                    itExists = function (s) {
                        damage = new Damage(damageNotations[ s ], creature);
                        expect(damage).not.toEqual(undefined);
                        expect(damage).not.toEqual(null);
                    };
                    itInitializes = function (s) {
                        damage = new Damage(damageNotations[ s ], creature);
                        expect(damage._history).toEqual([]);
                    };
                    for (s in diceNotations) {
                        it("should exist [" + s + "]", itExists.bind(this, s));
                        it("should initialize properly [" + s + "]", itInitializes.bind(this, s));
                        it("should have the correct number of dice [" + s + "]", checkField.bind(this, s, "dieCount"));
                        it("should have the correct number of sides [" + s + "]", checkField.bind(this, s, "dieSides"));
                        it("should have the correct extra amount [" + s + "]", checkField.bind(this, s, "extra"));
                        it("should properly crit [" + s + "]", checkField.bind(this, s, "crits"));
                        it("should have the same type [" + s + "]", checkField.bind(this, s, "type"));
                        it("should also need/not need a weapon [" + s + "]", checkField.bind(this, s, "needsWeapon"));
                        it("should have the same weapon multiplier [" + s + "]", checkField.bind(this, s, "weaponMultiplier"));
                        it("should have the same melee extra [" + s + "]", checkField.bind(this, s, "meleeExtra"));
                        it("should have the same ranged extra [" + s + "]", checkField.bind(this, s, "rangedExtra"));
                    }
                });
            });

            describe("clone()", function () {
                var s, checkField, clone, itExists, itInitializes;
                checkField = function (s, p) {
                    damage = new Damage(diceNotations[ s ]);
                    clone = damage.clone();
                    expect(clone[ p ]).toEqual(damage[ p ]);
                };
                itExists = function (s) {
                    damage = new Damage(damageNotations[ s ], creature);
                    clone = damage.clone();
                    expect(clone).not.toEqual(undefined);
                    expect(clone).not.toEqual(null);
                };
                itInitializes = function (s) {
                    damage = new Damage(damageNotations[ s ], creature);
                    clone = damage.clone();
                    expect(clone._history).toEqual([]);
                };
                for (s in diceNotations) {
                    it("should exist [" + s + "]", itExists.bind(this, s));
                    it("should initialize properly [" + s + "]", itInitializes.bind(this, s));
                    it("should have the correct number of dice [" + s + "]", checkField.bind(this, s, "dieCount"));
                    it("should have the correct number of sides [" + s + "]", checkField.bind(this, s, "dieSides"));
                    it("should have the correct extra amount [" + s + "]", checkField.bind(this, s, "extra"));
                    it("should properly crit [" + s + "]", checkField.bind(this, s, "crits"));
                    it("should have the same type [" + s + "]", checkField.bind(this, s, "type"));
                    it("should also need/not need a weapon [" + s + "]", checkField.bind(this, s, "needsWeapon"));
                    it("should have the same weapon multiplier [" + s + "]", checkField.bind(this, s, "weaponMultiplier"));
                    it("should have the same melee extra [" + s + "]", checkField.bind(this, s, "meleeExtra"));
                    it("should have the same ranged extra [" + s + "]", checkField.bind(this, s, "rangedExtra"));
                }
            });

            xdescribe("rollItem()", function () {
                var s, w, itNumber, itHistory, itDice;
                itNumber = function (s, w) {
                    var item = new Roll(w);
                    damage = new Damage(damageNotations[ s ], creature);
                    result = damage.rollItem();
                    expect(damage.dieCount + roll.extra <= result).toEqual(true);
                    expect(result <= roll.dieCount * roll.dieSides + roll.extra).toEqual(true);
                    result = damage.rollItem();
                    expect(roll.dieCount + roll.extra <= result).toEqual(true);
                    expect(result <= roll.dieCount * roll.dieSides + roll.extra).toEqual(true);
                    result = damage.rollItem();
                    expect(roll.dieCount + roll.extra <= result).toEqual(true);
                    expect(result <= roll.dieCount * roll.dieSides + roll.extra).toEqual(true);
                };
                itHistory = function (s) {
                    roll = new Roll(diceNotations[ s ]);
                    expect(roll._history).toEqual([]);
                    result = roll.roll();
                    expect(roll._history.length).toEqual(1);
                    result = roll.roll();
                    expect(roll._history.length).toEqual(2);
                    result = roll.roll();
                    expect(roll._history.length).toEqual(3);
                };
                itDice = function (s) {
                    var i;
                    roll = new Roll(diceNotations[ s ]);
                    result = roll.roll();
                    expect(roll._history[ 0 ]).not.toEqual(undefined);
                    expect(roll._history[ 0 ]).not.toEqual(null);
                    expect(typeof(roll._history[ 0 ])).toEqual("object");
                    expect(typeof(roll._history[ 0 ].dice)).toEqual("object");
                    expect(roll._history[ 0 ].dice.constructor).toEqual(Array);
                    expect(roll._history[ 0 ].dice.length).toEqual(roll.dieCount);
                    for (i = 0; i < roll._history[ 0 ].dice.length; i++) {
                        expect(typeof(roll._history[ 0 ].dice[ i ])).toEqual("number");
                        expect(1 <= roll._history[ 0 ].dice[ i ]).toEqual(true);
                        expect(roll._history[ 0 ].dice[ i ] <= roll.dieSides).toEqual(true);
                    }
                    expect(roll._history[ 0 ].total).toEqual(result);
                };
                for (s in damageNotations) {
                    for (w in diceNotations) {
                        it("should return a Number within the range allowed by the dice [" + s + ", " + w + "]", itNumber.bind(this, s, w));
                        it("should add the roll to its history [" + s + "]", itHistory.bind(this, s));
                        it("each history entry should have an Array containing the rolled value of each die and the total [" + s + "]", itDice.bind(this, s));
                    }
                }
            });

            // TODO: toString()

        });
    });


})(DnD.Damage);