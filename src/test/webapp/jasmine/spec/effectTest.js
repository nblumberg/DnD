/* global jasmine, describe, beforeEach, it, expect, DnD, Test */
/* exported */
(function() {
    "use strict";

    describe("An Effect", function() {
        var effect = null;
        describe("is instantiated", function() {
            describe("with no parameters", function() {
                describe("it should initialize its members", function() {
                    var extra = "Default Effect";
                    effect = new DnD.Effect();

                    Test.nonEmptyObject(effect, extra);
                    Test.hasPositiveNumberProperty(effect, "id", extra);
                    Test.expectedProperties({
                        name: { value: "Unknown effect" },
                        amount: { value: 0 },
                        type: { value: "" },
                        duration: { value: null },
                        isNextTurn: { value: false },
                        saveEnds: { value: false },
                        target: { value: undefined },
                        attacker: { value: undefined },
                        startRound: { value: undefined },
                        children: { value: [] }
                    }, effect);
                });
            });
            describe("with a String parameter", function() {
                describe("it should initialize its members", function() {
                    var params = "String Effect";
                    effect = new DnD.Effect(params);

                    Test.nonEmptyObject(effect, params);
                    Test.hasPositiveNumberProperty(effect, "id", params);
                    Test.expectedProperties({
                        name: { value: "String Effect" },
                        amount: { value: 0 },
                        type: { value: "" },
                        duration: { value: null },
                        isNextTurn: { value: false },
                        saveEnds: { value: false },
                        target: { value: undefined },
                        attacker: { value: undefined },
                        startRound: { value: undefined },
                        children: { value: [] }
                    }, effect);
                });
            });
            describe("with template parameters", function() {
                var params, extra;
                extra = "Template Effect";
                params = {
                    noId: true,
                    name: extra,
                    amount: 2,
                    type: "acid",
                    duration: DnD.Effect.DURATION_END_ATTACKER_NEXT,
                    saveEnds: true,
                    target: 12345,
                    attacker: 67890,
                    round: 11,
                    children: [
                        "Template Effect Child 1",
                        "Template Effect Child 2",
                        { name: "Template Effect Child 3" }
                    ]
                };
                effect = new DnD.Effect(params);

                Test.nonEmptyObject(effect, params);
                it("id: undefined [" + extra + "]", (function(effect) {
                    expect(effect.hasOwnProperty("id")).toBe(false);
                }).bind(this, effect));
                Test.expectedProperties({
                    name: { value: "Template Effect" },
                    amount: { value: 2 },
                    type: { value: "acid" },
                    duration: { value: DnD.Effect.DURATION_END_ATTACKER_NEXT },
                    isNextTurn: { value: false },
                    saveEnds: { value: true },
                    target: { value: 12345 },
                    attacker: { value: 67890 },
                    startRound: { value: 11 }
                }, effect);

                Test.hasNonEmptyArrayProperty(effect, "children", extra);
                it("children: [ \"Template Effect Child 1\", \"Template Effect Child 2\", \"Template Effect Child 3\" ] [" + extra + "]", (function(effect) {
                    var i;
                    expect(effect.children.length).toEqual(3);
                    for (i = 0; i < effect.children.length; i++) {
                        expect(effect.children[ i ] instanceof DnD.Effect).toBe(true);
                        expect(effect.children[ i ].name).toEqual("Template Effect Child " + (i + 1));
                    }
                }).bind(this, effect));

                describe("without a startRound", function() {
                    beforeEach(function() {
                        delete params.round;
                        spyOn(define.modules.console.instance, "warn");
                        spyOn(define.modules.state.instance, "getCurrentRound").andReturn(666);
                        effect = new DnD.Effect(params);
                    });
                    it("it should should log a warning", function() {
                        expect(define.modules.console.instance.warn).toHaveBeenCalledWith("Effect Template Effect[undefined] created without startRound");
                    });
                    it("it should default to the current round", function() {
                        expect(define.modules.state.instance.getCurrentRound).toHaveBeenCalled();
                        expect(effect.startRound).toEqual(666);
                    });
                });
            });
        });

        describe("remove() is called", function() {
            var spies, target, attacker;
            spies = target = attacker = null;
            beforeEach(function() {
                var i;
                effect = new DnD.Effect({});
                spies = [];
                for (i = 0; i < 3; i++) {
                    spies.push(jasmine.createSpyObj("child" + i, [ "remove" ]));
                }
                effect.children = spies;

                target = { effects: [ "x", effect, "y", "z" ] };
                effect.target = target;

                attacker = { imposedEffects: [ "x", effect, "y", "z" ] };
                effect.attacker = attacker;
            });
            it("it should remove all its child Effects", function() {
                var i;
                effect.remove();
                for (i = 0; i < spies.length; i++) {
                    expect(spies[ i ].remove).toHaveBeenCalled();
                }
            });
            it("it should remove itself from its target's effects", function() {
                effect.remove();
                expect(target.effects).toEqual([ "x", "y", "z" ]);
            });
            it("it should remove itself from its attacker's imposed effects", function() {
                effect.remove();
                expect(attacker.imposedEffects).toEqual([ "x", "y", "z" ]);
            });
        });

        describe("countDown() is called", function() {
            beforeEach(function() {
                effect = new DnD.Effect({ round: 1 });
                spyOn(effect, "remove");
            });
            describe("for an Effect with no duration", function() {
                it("it should do nothing and return false", function() {
                    expect(effect.countDown(2, true, true)).toEqual(false);
                    expect(effect.countDown(2, true, false)).toEqual(false);
                    expect(effect.countDown(2, false, true)).toEqual(false);
                    expect(effect.countDown(2, false, false)).toEqual(false);
                    expect(effect.remove).not.toHaveBeenCalled();
                });
            });
            describe("for an Effect with a duration", function() {
                describe("in the same round as the Effect started", function() {
                    it("it should do nothing and return false", function() {
                        var i;
                        for (i = 0; i < DnD.Effect.DURATIONS.length; i++) {
                            effect.duration = DnD.Effect.DURATIONS[ i ];
                            expect(effect.countDown(1, true, true)).toEqual(false);
                            expect(effect.countDown(1, true, false)).toEqual(false);
                            expect(effect.countDown(1, false, true)).toEqual(false);
                            expect(effect.countDown(1, false, false)).toEqual(false);
                            expect(effect.remove).not.toHaveBeenCalled();
                        }
                    });
                });
            });
            describe("for a DURATION_START_TARGET_NEXT Effect", function() {
                beforeEach(function() {
                    effect.duration = DnD.Effect.DURATION_START_TARGET_NEXT;
                });
                it("it should only call remove() and return true when called by the target at the start of it's following turn (or later)", function() {
                    expect(effect.countDown(2, false, true)).toEqual(false);
                    expect(effect.countDown(2, false, false)).toEqual(false);
                    expect(effect.remove).not.toHaveBeenCalled();
                    expect(effect.countDown(2, true, true)).toEqual(true);
                    expect(effect.remove).toHaveBeenCalled();
                    effect.remove.reset();
                    expect(effect.countDown(2, true, false)).toEqual(true);
                    expect(effect.remove).toHaveBeenCalled();
                });
            });
            describe("for a DURATION_END_TARGET_NEXT Effect", function() {
                beforeEach(function() {
                    effect.duration = DnD.Effect.DURATION_END_TARGET_NEXT;
                });
                it("it should only call remove() and return true when called by the target at the end of it's following turn", function() {
                    expect(effect.countDown(2, true, true)).toEqual(false);
                    expect(effect.countDown(2, false, true)).toEqual(false);
                    expect(effect.countDown(2, false, false)).toEqual(false);
                    expect(effect.remove).not.toHaveBeenCalled();
                    expect(effect.countDown(2, true, false)).toEqual(true);
                    expect(effect.remove).toHaveBeenCalled();
                });
            });
            describe("for a DURATION_START_ATTACKER_NEXT Effect", function() {
                beforeEach(function() {
                    effect.duration = DnD.Effect.DURATION_START_ATTACKER_NEXT;
                });
                it("it should only call remove() and return true when called by the attacker at the start of it's following turn (or later)", function() {
                    expect(effect.countDown(2, true, true)).toEqual(false);
                    expect(effect.countDown(2, true, false)).toEqual(false);
                    expect(effect.remove).not.toHaveBeenCalled();
                    expect(effect.countDown(2, false, true)).toEqual(true);
                    expect(effect.remove).toHaveBeenCalled();
                    effect.remove.reset();
                    expect(effect.countDown(2, false, false)).toEqual(true);
                    expect(effect.remove).toHaveBeenCalled();
                });
            });
            describe("for a DURATION_END_ATTACKER_NEXT Effect", function() {
                beforeEach(function() {
                    effect.duration = DnD.Effect.DURATION_END_ATTACKER_NEXT;
                });
                it("it should only call remove() and return true when called by the attacker at the end of it's following turn", function() {
                    expect(effect.countDown(2, true, true)).toEqual(false);
                    expect(effect.countDown(2, true, false)).toEqual(false);
                    expect(effect.countDown(2, false, true)).toEqual(false);
                    expect(effect.remove).not.toHaveBeenCalled();
                    expect(effect.countDown(2, false, false)).toEqual(true);
                    expect(effect.remove).toHaveBeenCalled();
                });
            });
        });

        describe("grantsCombatAdvantage() is called", function() {
            describe("it should return true for the proper Effects", function() {
                var grantList, meleeList, itTest, p, grants, melee;
                grantList = [ "dominated", "stunned", "dazed", "blinded", "dying", "dead", "unconscious", "helpless", "surprised", "petrified", "restrained" ];
                meleeList = [ "prone" ];
                itTest = function(name, grants, melee) {
                    var effect = new DnD.Effect(name);
                    expect(effect.grantsCombatAdvantage(false)).toEqual(grants);
                    expect(effect.grantsCombatAdvantage(true)).toEqual(grants || melee);
                };
                p = null;
                for (p in DnD.Effect.CONDITIONS) {
                    grants = grantList.indexOf(p) !== -1;
                    melee = meleeList.indexOf(p) !== -1;
                    it("[" + p + "]" + (grants || melee ? " grants" : "") + (melee ? " for melee only" : ""), itTest.bind(this, p, grants, melee));
                }
            });
        });

        describe("toHitModifier() is called", function() {
            describe("it should return the proper amount for fixed attack penalty Effects", function() {
                it("blinded: -5", function() {
                    effect = new DnD.Effect("blinded");
                    expect(effect.toHitModifier()).toEqual(-5);
                });
                it("prone: -2", function() {
                    effect = new DnD.Effect("prone");
                    expect(effect.toHitModifier()).toEqual(-2);
                });
                it("restrained: -2", function() {
                    effect = new DnD.Effect("restrained");
                    expect(effect.toHitModifier()).toEqual(-2);
                });
            });
            describe("with an explict attack-modifying Effect", function() {
                it("it should return the amount of the effect", function() {
                    effect = new DnD.Effect({ name: "modifier", type: "attacks", amount: 666 });
                    expect(effect.toHitModifier()).toEqual(666);
                });
            });
        });

        describe("defenseModifier() is called", function() {
            function always(value) {
                expect(effect.defenseModifier("ac", true)).toEqual(value);
                expect(effect.defenseModifier("ac", false)).toEqual(value);
                expect(effect.defenseModifier("for", true)).toEqual(value);
                expect(effect.defenseModifier("fort", false)).toEqual(value);
                expect(effect.defenseModifier("ref", true)).toEqual(value);
                expect(effect.defenseModifier("ref", false)).toEqual(value);
                expect(effect.defenseModifier("will", true)).toEqual(value);
                expect(effect.defenseModifier("will", false)).toEqual(value);
            }
            describe("it should return the proper amount for fixed attack penalty Effects", function() {
                it("dying: -5", function() {
                    effect = new DnD.Effect("dying");
                    always(-5);
                });
                it("dead: -5", function() {
                    effect = new DnD.Effect("dead");
                    always(-5);
                });
                it("unconscious: -5", function() {
                    effect = new DnD.Effect("unconscious");
                    always(-5);
                });
                it("prone: +2 (ranged)", function() {
                    effect = new DnD.Effect("prone");
                    expect(effect.defenseModifier("ac", true)).toEqual(0);
                    expect(effect.defenseModifier("ac", false)).toEqual(2);
                    expect(effect.defenseModifier("for", true)).toEqual(0);
                    expect(effect.defenseModifier("fort", false)).toEqual(2);
                    expect(effect.defenseModifier("ref", true)).toEqual(0);
                    expect(effect.defenseModifier("ref", false)).toEqual(2);
                    expect(effect.defenseModifier("will", true)).toEqual(0);
                    expect(effect.defenseModifier("will", false)).toEqual(2);
                });
            });
            describe("with an explict defense-modifying Effect", function() {
                it("it should return the amount of the effect", function() {
                    effect = new DnD.Effect({ name: "modifier", type: "ac", amount: -666 });
                    expect(effect.defenseModifier("ac", true)).toEqual(-666);
                    expect(effect.defenseModifier("ac", false)).toEqual(-666);
                    expect(effect.defenseModifier("fort", true)).toEqual(0);

                    effect = new DnD.Effect({ name: "modifier", type: "fort", amount: -666 });
                    expect(effect.defenseModifier("fort", true)).toEqual(-666);
                    expect(effect.defenseModifier("fort", false)).toEqual(-666);
                    expect(effect.defenseModifier("ac", true)).toEqual(0);

                    effect = new DnD.Effect({ name: "modifier", type: "ref", amount: -666 });
                    expect(effect.defenseModifier("ref", true)).toEqual(-666);
                    expect(effect.defenseModifier("ref", false)).toEqual(-666);
                    expect(effect.defenseModifier("ac", true)).toEqual(0);

                    effect = new DnD.Effect({ name: "modifier", type: "will", amount: -666 });
                    expect(effect.defenseModifier("will", true)).toEqual(-666);
                    expect(effect.defenseModifier("will", false)).toEqual(-666);
                    expect(effect.defenseModifier("ac", true)).toEqual(0);
                });
            });
        });



    });

})();

