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

    describe("Roll", function() {
        var roll, params;

        describe("new", function() {
            describe("default", function() {
                beforeEach(function() {
                    roll = new Roll();
                });
                it("should exist", function() {
                    expect(roll).not.toEqual(undefined);
                    expect(roll).not.toEqual(null);
                });
                it("should initialize properly", function() {
                    expect(roll._history).toEqual([]);
                    expect(roll.dieCount).toEqual(0);
                    expect(roll.dieSides).toEqual(0);
                    expect(roll.extra).toEqual(0);
                    expect(roll.crits).toEqual(false);
                });
            });

            describe("from String", function() {
                var checkField, s, itExists, itInitializes;
                checkField = function(s, p) {
                    roll = new Roll(s);
                    expect(roll[ p ]).toEqual(diceNotations[ s ][ p ]);
                };
                itExists = function(s) {
                    roll = new Roll(s);
                    expect(roll).not.toEqual(undefined);
                    expect(roll).not.toEqual(null);
                };
                itInitializes = function(s) {
                    roll = new Roll(s);
                    expect(roll._history).toEqual([]);
                    expect(roll.crits).toEqual(false);
                };
                for (s in diceNotations) {
                    it("should exist [" + s + "]", itExists.bind(this, s));
                    it("should initialize properly [" + s + "]", itInitializes.bind(this, s));
                    it("should have the correct number of dice [" + s + "]", checkField.bind(this, s, "dieCount"));
                    it("should have the correct number of sides [" + s + "]", checkField.bind(this, s, "dieSides"));
                    it("should have the correct extra amount [" + s + "]", checkField.bind(this, s, "extra"));
                    it("should have the correct extra amount [" + s + "]", checkField.bind(this, s, "extra"));
                }
            });

            describe("from Object", function() {
                var checkField, s, itExists, itInitializes;
                checkField = function(s, p) {
                    roll = new Roll(diceNotations[ s ]);
                    expect(roll[ p ]).toEqual(diceNotations[ s ][ p ]);
                };
                itExists = function(s) {
                    roll = new Roll(diceNotations[ s ]);
                    expect(roll).not.toEqual(undefined);
                    expect(roll).not.toEqual(null);
                };
                itInitializes = function(s) {
                    roll = new Roll(diceNotations[ s ]);
                    expect(roll._history).toEqual([]);
                };
                for (s in diceNotations) {
                    it("should exist [" + s + "]", itExists.bind(this, s));
                    it("should initialize properly [" + s + "]", itInitializes.bind(this, s));
                    it("should have the correct number of dice [" + s + "]", checkField.bind(this, s, "dieCount"));
                    it("should have the correct number of sides [" + s + "]", checkField.bind(this, s, "dieSides"));
                    it("should have the correct extra amount [" + s + "]", checkField.bind(this, s, "extra"));
                    it("should properly crit [" + s + "]", checkField.bind(this, s, "crits"));
                }
            });
        });

        describe("clone()", function() {
            var checkField, clone, s, itExists, itInitializes;
            checkField = function(s, p) {
                roll = new Roll(diceNotations[ s ]);
                clone = roll.clone();
                expect(clone[ p ]).toEqual(roll[ p ]);
            };
            itExists = function(s) {
                roll = new Roll(diceNotations[ s ]);
                clone = roll.clone();
                expect(clone).not.toEqual(undefined);
                expect(clone).not.toEqual(null);
            };
            itInitializes = function(s) {
                roll = new Roll(diceNotations[ s ]);
                clone = roll.clone();
                expect(clone._history).toEqual([]);
            };
            for (s in diceNotations) {
                it("should exist [" + s + "]", itExists.bind(this, s));
                it("should initialize properly [" + s + "]", itInitializes.bind(this, s));
                it("should have the correct number of dice [" + s + "]", checkField.bind(this, s, "dieCount"));
                it("should have the correct number of sides [" + s + "]", checkField.bind(this, s, "dieSides"));
                it("should have the correct extra amount [" + s + "]", checkField.bind(this, s, "extra"));
                it("should properly crit [" + s + "]", checkField.bind(this, s, "crits"));
            }
        });

        describe("roll()", function() {
            var s, itNumber, itHistory, itDice;
            itNumber = function(s) {
                roll = new Roll(diceNotations[ s ]);
                result = roll.roll();
                expect(roll.dieCount + roll.extra <= result).toEqual(true);
                expect(result <= roll.dieCount * roll.dieSides + roll.extra).toEqual(true);
                result = roll.roll();
                expect(roll.dieCount + roll.extra <= result).toEqual(true);
                expect(result <= roll.dieCount * roll.dieSides + roll.extra).toEqual(true);
                result = roll.roll();
                expect(roll.dieCount + roll.extra <= result).toEqual(true);
                expect(result <= roll.dieCount * roll.dieSides + roll.extra).toEqual(true);
            };
            itHistory = function(s) {
                roll = new Roll(diceNotations[ s ]);
                expect(roll._history).toEqual([]);
                result = roll.roll();
                expect(roll._history.length).toEqual(1);
                result = roll.roll();
                expect(roll._history.length).toEqual(2);
                result = roll.roll();
                expect(roll._history.length).toEqual(3);
            };
            itDice = function(s) {
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
            for (s in diceNotations) {
                it("should return a Number within the range allowed by the dice [" + s + "]", itNumber.bind(this, s));
                it("should add the roll to its history [" + s + "]", itHistory.bind(this, s));
                it("each history entry should have an Array containing the rolled value of each die and the total [" + s + "]", itDice.bind(this, s));
            }
        });

        describe("max()", function() {
            var s, itNumber, itHistory, itDice;
            itNumber = function(s) {
                roll = new Roll(diceNotations[ s ]);
                result = roll.max();
                expect(result).toEqual(diceNotations[ s ].max);
            };
            itHistory = function(s) {
                roll = new Roll(diceNotations[ s ]);
                expect(roll._history).toEqual([]);
                result = roll.max();
                expect(roll._history.length).toEqual(1);
                result = roll.max();
                expect(roll._history.length).toEqual(2);
                result = roll.max();
                expect(roll._history.length).toEqual(3);
            };
            itDice = function(s) {
                var i;
                roll = new Roll(diceNotations[ s ]);
                result = roll.max();
                expect(roll._history[ 0 ]).not.toEqual(undefined);
                expect(roll._history[ 0 ]).not.toEqual(null);
                expect(typeof(roll._history[ 0 ])).toEqual("object");
                expect(typeof(roll._history[ 0 ].dice)).toEqual("object");
                expect(roll._history[ 0 ].dice.constructor).toEqual(Array);
                expect(roll._history[ 0 ].dice.length).toEqual(roll.dieCount);
                for (i = 0; i < roll._history[ 0 ].dice.length; i++) {
                    expect(typeof(roll._history[ 0 ].dice[ i ])).toEqual("number");
                    expect(roll._history[ 0 ].dice[ i ]).toEqual(roll.dieSides);
                }
                expect(roll._history[ 0 ].total).toEqual(result);
                expect(roll._history[ 0 ].isMax).toEqual(true);
            };
            for (s in diceNotations) {
                it("should return a Number that is the minimum possible value for the Roll [" + s + "]", itNumber.bind(this, s));
                it("should add the roll to its history [" + s + "]", itHistory.bind(this, s));
                it("each history entry should have an Array containing the rolled value of each die, the total, and isMax: true [" + s + "]", itDice.bind(this, s));
            }
        });

        describe("min()", function() {
            var s, itNumber, itHistory, itDice;
            itNumber = function(s) {
                roll = new Roll(diceNotations[ s ]);
                result = roll.min();
                expect(result).toEqual(diceNotations[ s ].min);
            };
            itHistory = function(s) {
                roll = new Roll(diceNotations[ s ]);
                expect(roll._history).toEqual([]);
                result = roll.min();
                expect(roll._history.length).toEqual(1);
                result = roll.min();
                expect(roll._history.length).toEqual(2);
                result = roll.min();
                expect(roll._history.length).toEqual(3);
            };
            itDice = function(s) {
                var i;
                roll = new Roll(diceNotations[ s ]);
                result = roll.min();
                expect(roll._history[ 0 ]).not.toEqual(undefined);
                expect(roll._history[ 0 ]).not.toEqual(null);
                expect(typeof(roll._history[ 0 ])).toEqual("object");
                expect(typeof(roll._history[ 0 ].dice)).toEqual("object");
                expect(roll._history[ 0 ].dice.constructor).toEqual(Array);
                expect(roll._history[ 0 ].dice.length).toEqual(roll.dieCount);
                for (i = 0; i < roll._history[ 0 ].dice.length; i++) {
                    expect(typeof(roll._history[ 0 ].dice[ i ])).toEqual("number");
                    expect(roll._history[ 0 ].dice[ i ]).toEqual(1);
                }
                expect(roll._history[ 0 ].total).toEqual(result);
                expect(roll._history[ 0 ].isMin).toEqual(true);
            };
            for (s in diceNotations) {
                it("should return a Number that is the maximum possible value for the Roll [" + s + "]", itNumber.bind(this, s));
                it("should add the roll to its history [" + s + "]", itHistory.bind(this, s));
                it("each history entry should have an Array containing the rolled value of each die, the total, and isMin: true [" + s + "]", itDice.bind(this, s));
            }
        });

        describe("add()", function() {
            var s, itHistory, itDice;
            itHistory = function(s, r) {
                roll = new Roll(diceNotations[ s ]);
                expect(roll._history).toEqual([]);
                roll.add(r);
                expect(roll._history.length).toEqual(1);
                roll.add(r);
                expect(roll._history.length).toEqual(2);
                roll.add(r);
                expect(roll._history.length).toEqual(3);
            };
            itDice = function(s, r) {
                var i, total;
                roll = new Roll(diceNotations[ s ]);
                roll.add(r);
                expect(roll._history[ 0 ]).not.toEqual(undefined);
                expect(roll._history[ 0 ]).not.toEqual(null);
                expect(typeof(roll._history[ 0 ])).toEqual("object");
                expect(typeof(roll._history[ 0 ].dice)).toEqual("object");
                expect(roll._history[ 0 ].dice.constructor).toEqual(Array);
                expect(roll._history[ 0 ].dice.length).toEqual(roll.dieCount);
                total = 0;
                for (i = 0; i < roll._history[ 0 ].dice.length; i++) {
                    expect(typeof(roll._history[ 0 ].dice[ i ])).toEqual("number");
                    total += roll._history[ 0 ].dice[ i ];
                }
                total += roll.extra;
                expect(roll._history[ 0 ].total).toEqual(total);
                expect(roll._history[ 0 ].manual).toEqual(true);
            };
            for (s in diceNotations) {
                result = diceNotations[ s ].min + Math.floor(Math.random() * (diceNotations[ s ].max - diceNotations[ s ].min));
                it("should add the roll to its history [" + s + "]", itHistory.bind(this, s, result));
                it("each history entry should have an Array containing the rolled value of each die, the total, and manual: true [" + s + "]", itDice.bind(this, s, result));
            }
        });

        describe("getLastRoll()", function() {
            var s, itReturn, itEmpty;
            itReturn = function(s) {
                roll = new Roll(diceNotations[ s ]);
                roll.roll();
                expect(roll.getLastRoll()).toEqual(roll._history[ roll._history.length - 1 ]);
            };
            itEmpty = function(s) {
                roll = new Roll(diceNotations[ s ]);
                expect(roll.getLastRoll()).toEqual({ total: 0, dice: [] });
            };
            for (s in diceNotations) {
                it("should return the last history entry [" + s + "]", itReturn.bind(this, s));
                it("if there is no history, it should return an empty history entry [" + s + "]", itEmpty.bind(this, s));
            }
        });

        describe("isCritical()", function() {
            var s, itNotCrit, itNoRolls, itNot20, itCrit;
            itNotCrit = function(s) {
                roll = new Roll(diceNotations[ s ]);
                roll.max();
                expect(roll.isCritical()).toEqual(false);
            };
            itNoRolls = function(s) {
                roll = new Roll(diceNotations[ s ]);
                expect(roll.isCritical()).toEqual(false);
            };
            itNot20 = function(s) {
                roll = new Roll(diceNotations[ s ]);
                roll.add(diceNotations[ s ].min + Math.floor(Math.random() * (diceNotations[ s ].max - 1 - diceNotations[ s ].min)));
                expect(roll.isCritical()).toEqual(false);
                roll.add(diceNotations[ s ].min + Math.floor(Math.random() * (diceNotations[ s ].max - 1 - diceNotations[ s ].min)));
                expect(roll.isCritical()).toEqual(false);
                roll.add(diceNotations[ s ].min + Math.floor(Math.random() * (diceNotations[ s ].max - 1 - diceNotations[ s ].min)));
                expect(roll.isCritical()).toEqual(false);
            };
            itCrit = function(s) {
                roll = new Roll(diceNotations[ s ]);
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
            var s, itNotFumble, itNoRolls, itNot1, itFumble;
            itNotFumble = function(s) {
                roll = new Roll(diceNotations[ s ]);
                roll.min();
                expect(roll.isFumble()).toEqual(false);
            };
            itNoRolls = function(s) {
                roll = new Roll(diceNotations[ s ]);
                expect(roll.isFumble()).toEqual(false);
            };
            itNot1 = function(s) {
                roll = new Roll(diceNotations[ s ]);
                roll.add(diceNotations[ s ].min + 1 + Math.floor(Math.random() * (diceNotations[ s ].max - 1 - diceNotations[ s ].min)));
                expect(roll.isFumble()).toEqual(false);
                roll.add(diceNotations[ s ].min + 1 + Math.floor(Math.random() * (diceNotations[ s ].max - 1 - diceNotations[ s ].min)));
                expect(roll.isFumble()).toEqual(false);
                roll.add(diceNotations[ s ].min + 1 + Math.floor(Math.random() * (diceNotations[ s ].max - 1 - diceNotations[ s ].min)));
                expect(roll.isFumble()).toEqual(false);
            };
            itFumble = function(s) {
                roll = new Roll(diceNotations[ s ]);
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
            var s, itReturn;
            itReturn = function(s) {
                roll = new Roll(diceNotations[ s ]);
                expect(roll.toString()).toEqual(s);
            };
            for (s in diceNotations) {
                it("should return " + s, itReturn.bind(this, s));
            }
        });

        describe("breakdown()", function() {
            var s, itReturn;
            itReturn = function(s) {
                roll = new Roll(diceNotations[ s ]);
                roll.max();
                expect(roll.breakdown()).toEqual(diceNotations[ s ].breakdown);
            };
            for (s in diceNotations) {
                it("should return " + diceNotations[ s ].breakdown, itReturn.bind(this, s));
                // TODO: conditionals
            }
        });

        describe("anchor()", function() {
            var s, itReturn;
            itReturn = function(s) {
                var result, anchor;
                roll = new Roll(diceNotations[ s ]);
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
            describe("should return an Object that when passed to new Roll(Object) creates an identical Roll instance", function() {
                var s, roll2, p, itFn;
                itFn = function(r1, r2, p) {
                    expect(r2[ p ]).toEqual(r1[ p ]);
                };
                for (s in diceNotations) {
                    roll = new Roll(diceNotations[ s ]);
                    result = roll.raw();
                    roll2 = new Roll(result);
                    for (p in roll) {
                        if (roll.hasOwnProperty(p) && p.substring(0,2) !== "__") {
                            it(p + " [" + s + "]", itFn.bind(this, roll, roll2, p));
                        }
                    }
                }
            });
        });

    });

    describe("Recharge", function() {
        var recharge;
        beforeEach(function() {
            recharge = new Recharge({ attack: { name: "testAttack", usage: { frequency: "Recharge", recharge: 3 } } });
        });
        describe("toString()", function() {
            it("should return Recharge", function() {
                expect(recharge.toString()).toEqual("Recharge");
            });
        });
        describe("anchor()", function() {
            it("should return Recharged ...", function() {
                recharge.min();
                expect(recharge.anchor()).toEqual("<a href=\"javascript:void(0);\" title=\"[Recharge] 1 &lt;= 3\">Recharged testAttack</a>");
            });
            it("should return Failed to recharge ...", function() {
                recharge.max();
                expect(recharge.anchor()).toEqual("<a href=\"javascript:void(0);\" title=\"[Recharge] 6 &lt;= 3\">Failed to recharge testAttack</a>");
            });
        });
    });

    describe("SavingThrow", function() {
        var st;
        beforeEach(function() {
            st = new SavingThrow({ effect: { toString: function() { return "testeffect"; } } });
        });
        describe("toString()", function() {
            it("should return Saving Throw", function() {
                expect(st.toString()).toEqual("Saving Throw");
            });
        });
        describe("anchor()", function() {
            it("should return Saves against ...", function() {
                st.max();
                expect(st.anchor()).toEqual("<a href=\"javascript:void(0);\" title=\"[Saving Throw] 20\">Saves against testeffect</a>");
            });
            it("should return Fails to save against ...", function() {
                st.min();
                expect(st.anchor()).toEqual("<a href=\"javascript:void(0);\" title=\"[Saving Throw] 1\">Fails to save against testeffect</a>");
            });
        });
    });

    describe("Damage", function() {
        var damage, damageNotations, creature;
        damageNotations = jQuery.extend({
            "1[W]+3": { dieCount: 0, dieSides: 0, extra: 3, crits: false, type: null, crit: null, needsWeapon: true, weaponMultiplier: 1, meleeExtra: 0, rangedExtra: 0,  /* testing properties */ max: 0, min: 0, breakdown: "[1[W]+3] " },
            "2[W]": { dieCount: 0, dieSides: 0, extra: 0, crits: false, type: null, crit: null, needsWeapon: true, weaponMultiplier: 2, meleeExtra: 0, rangedExtra: 0,  /* testing properties */ max: 0, min: 0, breakdown: "[2[W]] " },
            "3d8+STR": { dieCount: 3, dieSides: 8, extra: 6, crits: false, type: null, crit: null, needsWeapon: false, weaponMultiplier: 0, meleeExtra: 0, rangedExtra: 0,  /* testing properties */ max: 0, min: 0, breakdown: "[3d8+1] 8 + 8 + 8 + 1" },
            "3[W]+STR+CHA": { dieCount: 0, dieSides: 0, extra: 7, crits: false, type: null, crit: null, needsWeapon: true, weaponMultiplier: 3, meleeExtra: 0, rangedExtra: 0,  /* testing properties */ max: 0, min: 0, breakdown: "[3[W]+7] " },
            "4[W]+STR^CHA": { dieCount: 0, dieSides: 0, extra: 6, crits: false, type: null, crit: null, needsWeapon: true, weaponMultiplier: 4, meleeExtra: 0, rangedExtra: 0,  /* testing properties */ max: 0, min: 0, breakdown: "[3[W]+6] " },
            "5[W]+STR/DEX": { dieCount: 0, dieSides: 0, extra: 0, crits: false, type: null, crit: null, needsWeapon: true, weaponMultiplier: 5, meleeExtra: 1, rangedExtra: 3,  /* testing properties */ max: 0, min: 0, breakdown: "[3[W]+6] " }
        }, diceNotations);
        creature = { abilities: { STRmod: 1, CONmod: 2, DEXmod: 3, INTmod: 4, WISmod: 5, CHAmod: 6 } };

        describe("new", function() {
            describe("default", function() {
                beforeEach(function() {
                    damage = new Damage(null, creature);
                });
                it("should exist", function() {
                    expect(damage).not.toEqual(undefined);
                    expect(damage).not.toEqual(null);
                });
                it("should initialize properly", function() {
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

            describe("from String", function() {
                var s, w, checkField, itExists, itInitializes;
                checkField = function(s, w, p) {
                    damage = new Damage(s, creature);
                    expect(damage[ p ]).toEqual(damageNotations[ s ][ p ]);
                };
                itExists = function(s) {
                    damage = new Damage(s, creature);
                    expect(damage).not.toEqual(undefined);
                    expect(damage).not.toEqual(null);
                };
                itInitializes = function(s) {
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

            describe("from Object", function() {
                var checkField, s, itExists, itInitializes;
                checkField = function(s, p) {
                    damage = new Damage(damageNotations[ s ], creature);
                    expect(damage[ p ]).toEqual(damageNotations[ s ][ p ]);
                };
                itExists = function(s) {
                    damage = new Damage(damageNotations[ s ], creature);
                    expect(damage).not.toEqual(undefined);
                    expect(damage).not.toEqual(null);
                };
                itInitializes = function(s) {
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

        describe("clone()", function() {
            var s, checkField, clone, itExists, itInitializes;
            checkField = function(s, p) {
                damage = new Damage(diceNotations[ s ]);
                clone = damage.clone();
                expect(clone[ p ]).toEqual(damage[ p ]);
            };
            itExists = function(s) {
                damage = new Damage(damageNotations[ s ], creature);
                clone = damage.clone();
                expect(clone).not.toEqual(undefined);
                expect(clone).not.toEqual(null);
            };
            itInitializes = function(s) {
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

        xdescribe("rollItem()", function() {
            var s, w, itNumber, itHistory, itDice;
            itNumber = function(s, w) {
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
            itHistory = function(s) {
                roll = new Roll(diceNotations[ s ]);
                expect(roll._history).toEqual([]);
                result = roll.roll();
                expect(roll._history.length).toEqual(1);
                result = roll.roll();
                expect(roll._history.length).toEqual(2);
                result = roll.roll();
                expect(roll._history.length).toEqual(3);
            };
            itDice = function(s) {
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

    describe("Attack", function() {
        // TODO
    });
});