/**
 * Created by nblumberg on 11/16/14.
 */

(function (DnD) {
    "use strict";

    describe("When DnD.Actor", function() {
        var ACTORS, targets, actor, attack, item, manualRolls;
        ACTORS = (function() {
            var a, data, name;
            a = [];
            data = DnD.modules[ "creatures.party" ].create();
            for (name in data) {
                if (data.hasOwnProperty(name)) {
                    a.push(new DnD.Actor(jQuery.extend(true, {}, data[ name ], { hp: { current: 1000 } })));
                }
            }
//            data = DnD.modules[ "creatures.monsters" ].create();
//            for (name in data) {
//                if (data.hasOwnProperty(name)) {
//                    a.push(new DnD.Actor(data[ name ]));
//                }
//            }
            return a;
        })();
        targets = actor = attack = item = manualRolls = null;

        beforeEach(function() {
            var History = DnD.modules.History.instance;
            History.central = jasmine.createSpyObj("History.central", [ "add" ]);
            targets = [];
            targets.push(new DnD.Actor(DnD.Creature.base));
//            targets.push(new DnD.Actor(DnD.Creature.base));
//            targets.push(new DnD.Actor(DnD.Creature.base));
            actor = new DnD.Actor(jQuery.extend(true, {}, DnD.Creature.base, { name: "Attacker" }));
            spyOn(actor, "__log");
            spyOn(actor.history, "add");
            attack = new DnD.Attack({ name: "attackName", toHit: 10, defense: "AC", damage: "1d6", keywords: [ "weapon", "melee", "basic" ] }, actor);
            item = { name: "itemName" };
            manualRolls = { attack: { roll: 18, isCritical: false, isFumble: false }, damage: 10 };
        });

        describe("attack() is called", function() {

            beforeEach(function() {
                var i, target;
                spyOn(actor, "_attackToHit").andReturn({ isCrit: false });
                spyOn(actor, "_attackDamage").andReturn({ damage: 6 });
                spyOn(actor, "_attackTarget").andReturn({ hit: false });
                targets = [];
                for (i = 0; i < 3; i++) {
                    target = jasmine.createSpyObj("target" + i, [ "raw" ]);
                    target.raw.andReturn({ name: "target" + i });
                    targets.push(target);
                }
            });

            it("it should log the call", function() {
                actor.attack(attack, null, [ targets[ 0 ] ], false, null);
                expect(actor.__log).toHaveBeenCalledWith("attack", [ attack.name, "undefined", 1, false, null ]);

                actor.attack(attack, null, targets, false, null);
                expect(actor.__log).toHaveBeenCalledWith("attack", [ attack.name, "undefined", targets.length, false, null ]);

                actor.attack(attack, item, targets, true, null);
                expect(actor.__log).toHaveBeenCalledWith("attack", [ attack.name, item.name, targets.length, true, null ]);

                actor.attack(attack, item, targets, false, manualRolls);
                expect(actor.__log).toHaveBeenCalledWith("attack", [ attack.name, item.name, targets.length, false, manualRolls ]);
            });

            it("it should determine the final to hit value (or lack thereof for automatic hits)", function() {
                actor.attack(attack, null, [ targets[ 0 ] ], false, null);
                expect(actor._attackToHit).toHaveBeenCalledWith(attack, null, false, null);

                actor.attack(attack, null, targets, false, null);
                expect(actor._attackToHit).toHaveBeenCalledWith(attack, null, false, null);

                actor.attack(attack, item, targets, false, null);
                expect(actor._attackToHit).toHaveBeenCalledWith(attack, item, false, null);

                actor.attack(attack, item, targets, true, null);
                expect(actor._attackToHit).toHaveBeenCalledWith(attack, item, true, null);

                actor.attack(attack, item, targets, false, manualRolls);
                expect(actor._attackToHit).toHaveBeenCalledWith(attack, item, false, manualRolls);
            });

            it("it should determine the final damage value", function() {
                actor._attackToHit.andReturn({ isCrit: false });
                actor.attack(attack, null, [ targets[ 0 ] ], false, null);
                expect(actor._attackDamage).toHaveBeenCalledWith(attack, null, false, null);

                actor.attack(attack, item, [ targets[ 0 ] ], false, null);
                expect(actor._attackDamage).toHaveBeenCalledWith(attack, item, false, null);

                actor.attack(attack, item, [ targets[ 0 ] ], false, manualRolls);
                expect(actor._attackDamage).toHaveBeenCalledWith(attack, item, false, manualRolls);

                actor.attack(attack, null, targets, false, null);
                expect(actor._attackDamage).toHaveBeenCalledWith(attack, null, false, null);

                actor.attack(attack, item, targets, false, null);
                expect(actor._attackDamage).toHaveBeenCalledWith(attack, item, false, null);

                actor.attack(attack, item, targets, false, manualRolls);
                expect(actor._attackDamage).toHaveBeenCalledWith(attack, item, false, manualRolls);

                actor._attackToHit.andReturn({ isCrit: true });
                actor.attack(attack, null, [ targets[ 0 ] ], false, null);
                expect(actor._attackDamage).toHaveBeenCalledWith(attack, null, true, null);

                actor.attack(attack, item, [ targets[ 0 ] ], false, null);
                expect(actor._attackDamage).toHaveBeenCalledWith(attack, item, true, null);

                actor.attack(attack, item, [ targets[ 0 ] ], false, manualRolls);
                expect(actor._attackDamage).toHaveBeenCalledWith(attack, item, true, manualRolls);

                actor.attack(attack, null, targets, false, null);
                expect(actor._attackDamage).toHaveBeenCalledWith(attack, null, true, null);

                actor.attack(attack, item, targets, false, null);
                expect(actor._attackDamage).toHaveBeenCalledWith(attack, item, true, null);

                actor.attack(attack, item, targets, false, manualRolls);
                expect(actor._attackDamage).toHaveBeenCalledWith(attack, item, true, manualRolls);
            });

            describe("targeting a single target", function() {
                it("it should attack the target", function() {
                    actor._attackToHit.andReturn({ isCrit: true });
                    actor._attackDamage.andReturn({ damage: 12 });

                    actor.attack(attack, null, [ targets[ 0 ] ], false, null);
                    expect(actor._attackTarget).toHaveBeenCalledWith(attack, null, false, targets[ 0 ], { isCrit: true }, { damage: 12 });

                    actor.attack(attack, item, [ targets[ 0 ] ], false, null);
                    expect(actor._attackTarget).toHaveBeenCalledWith(attack, item, false, targets[ 0 ], { isCrit: true }, { damage: 12 });

                    actor._attackToHit.andReturn({ isCrit: false });
                    actor._attackDamage.andReturn({ damage: 6 });

                    actor.attack(attack, item, [ targets[ 0 ] ], true, null);
                    expect(actor._attackTarget).toHaveBeenCalledWith(attack, item, true, targets[ 0 ], { isCrit: false }, { damage: 6 });

                    actor._attackTarget.reset();
                    actor.attack(attack, item, [ targets[ 0 ] ], true, { toHit: 18, damage: 10 });
                    expect(actor._attackTarget).toHaveBeenCalledWith(attack, item, true, targets[ 0 ], { isCrit: false }, { damage: 6 });
                });
                it("it should return the result", function() {
                    actor._attackToHit.andReturn({ isCrit: false });
                    actor._attackDamage.andReturn({ damage: 6 });
                    actor._attackTarget.andReturn({ hit: true });

                    expect(actor.attack(attack, null, [ targets[ 0 ] ], false, null)).toEqual({
                        hits: [ { hit: true, target: { name: "target0" } } ],
                        misses: []
                    });

                    actor._attackTarget.andReturn({ hit: false });

                    expect(actor.attack(attack, null, [ targets[ 0 ] ], false, null)).toEqual({
                        hits: [],
                        misses: [ { hit: false, target: { name: "target0" } } ]
                    });
                });
            });
            describe("targeting mulitple targets", function() {
                it("it should attack each target", function() {
                    actor._attackToHit.andReturn({ isCrit: false });
                    actor._attackDamage.andReturn({ damage: 6 });

                    actor.attack(attack, null, targets, false, null);
                    expect(actor._attackTarget).toHaveBeenCalledWith(attack, null, false, targets[ 0 ], { isCrit: false }, { damage: 6 });
                    expect(actor._attackTarget).toHaveBeenCalledWith(attack, null, false, targets[ 1 ], { isCrit: false }, { damage: 6 });
                    expect(actor._attackTarget).toHaveBeenCalledWith(attack, null, false, targets[ 2 ], { isCrit: false }, { damage: 6 });

                    actor.attack(attack, item, targets, false, null);
                    expect(actor._attackTarget).toHaveBeenCalledWith(attack, item, false, targets[ 0 ], { isCrit: false }, { damage: 6 });
                    expect(actor._attackTarget).toHaveBeenCalledWith(attack, item, false, targets[ 1 ], { isCrit: false }, { damage: 6 });
                    expect(actor._attackTarget).toHaveBeenCalledWith(attack, item, false, targets[ 2 ], { isCrit: false }, { damage: 6 });

                    actor._attackToHit.andReturn({ isCrit: true });
                    actor._attackDamage.andReturn({ damage: 12 });

                    actor.attack(attack, item, targets, true, null);
                    expect(actor._attackTarget).toHaveBeenCalledWith(attack, item, true, targets[ 0 ], { isCrit: true }, { damage: 12 });
                    expect(actor._attackTarget).toHaveBeenCalledWith(attack, item, true, targets[ 1 ], { isCrit: true }, { damage: 12 });
                    expect(actor._attackTarget).toHaveBeenCalledWith(attack, item, true, targets[ 2 ], { isCrit: true }, { damage: 12 });

                    actor._attackTarget.reset();
                    actor.attack(attack, item, targets, true, { toHit: 18, damage: 10 });
                    expect(actor._attackTarget).toHaveBeenCalledWith(attack, item, true, targets[ 0 ], { isCrit: true }, { damage: 12 });
                    expect(actor._attackTarget).toHaveBeenCalledWith(attack, item, true, targets[ 1 ], { isCrit: true }, { damage: 12 });
                    expect(actor._attackTarget).toHaveBeenCalledWith(attack, item, true, targets[ 2 ], { isCrit: true }, { damage: 12 });
                });
                it("it should return the result", function() {
                    var hit = false;
                    actor._attackToHit.andReturn({ isCrit: false });
                    actor._attackDamage.andReturn({ damage: 6 });
                    actor._attackTarget.andCallFake(function() {
                        hit = !hit;
                        return { hit: hit };
                    });

                    expect(actor.attack(attack, null, targets, false, null)).toEqual({
                        hits: [ { hit: true, target: { name: "target0" } }, { hit: true, target: { name: "target2" } } ],
                        misses: [ { hit: false, target: { name: "target1" } } ]
                    });
                });
            });
        });

        describe("_attackToHit() is called", function() {
            beforeEach(function() {
                spyOn(attack, "addItem").andCallThrough();
                spyOn(attack, "rollItem").andCallThrough();
                spyOn(attack, "roll").andCallThrough();
                spyOn(attack, "isCritical").andCallThrough();
                spyOn(attack, "isFumble").andCallThrough();
                spyOn(attack, "toHitModifiers").andCallThrough();
            });
            it("it should log the call", function() {
                actor._attackToHit(attack, null, false, null);
                expect(actor.__log).toHaveBeenCalledWith("attackToHit", [ attack.name, "undefined", false, null ]);

                actor._attackToHit(attack, item, false, null);
                expect(actor.__log).toHaveBeenCalledWith("attackToHit", [ attack.name, item.name, false, null ]);

                actor._attackToHit(attack, item, true, null);
                expect(actor.__log).toHaveBeenCalledWith("attackToHit", [ attack.name, item.name, true, null ]);

                actor._attackToHit(attack, item, true, manualRolls);
                expect(actor.__log).toHaveBeenCalledWith("attackToHit", [ attack.name, item.name, true, manualRolls ]);
            });
            it("it should return data about the hit roll", function() {
                function testResult(result) {
                    expect(result).toBeDefined();
                    expect(typeof result.isAutomaticHit).toEqual("boolean");
                    expect(typeof result.isCrit).toEqual("boolean");
                    expect(typeof result.isFumble).toEqual("boolean");
                    expect(result.conditional).toBeDefined();
                    expect(typeof result.conditional).toEqual("object");
                }
                testResult(actor._attackToHit(attack, null, false, null));
                testResult(actor._attackToHit(attack, item, false, null));
                testResult(actor._attackToHit(attack, item, true, null));
                testResult(actor._attackToHit(attack, item, true, manualRolls));
            });
            describe("if the attack hits automatically", function() {
                it("it should return toHit.isAutomaticHit === true", function() {
                    var result;
                    attack.toHit = "automatic";
                    result = actor._attackToHit(attack, null, false, null);
                    expect(result.isAutomaticHit).toEqual(true);

                    result = actor._attackToHit(attack, item, false, null);
                    expect(result.isAutomaticHit).toEqual(true);

                    result = actor._attackToHit(attack, item, true, null);
                    expect(result.isAutomaticHit).toEqual(true);

                    result = actor._attackToHit(attack, item, true, manualRolls);
                    expect(result.isAutomaticHit).toEqual(true);
                });
                it("it should not do anything else", function() {
                    attack.toHit = "automatic";
                    actor._attackToHit(attack, null, false, null);
                    actor._attackToHit(attack, item, false, null);
                    actor._attackToHit(attack, item, true, null);
                    actor._attackToHit(attack, item, true, manualRolls);
                    expect(attack.addItem).not.toHaveBeenCalled();
                    expect(attack.rollItem).not.toHaveBeenCalled();
                    expect(attack.roll).not.toHaveBeenCalled();
                    expect(attack.isCritical).not.toHaveBeenCalled();
                    expect(attack.isFumble).not.toHaveBeenCalled();
                    expect(attack.toHitModifiers).not.toHaveBeenCalled();
                });
            });
            describe("without a manual attack entry", function() {
                beforeEach(function() {
                    attack.rollItem.andReturn(6);
                    attack.roll.andReturn(5);
                });
                it("it should return the manual attack roll", function() {
                    var result;
                    result = actor._attackToHit(attack, null, false, null);
                    expect(result.roll).toEqual(5);
                    result = actor._attackToHit(attack, item, true, null);
                    expect(result.roll).toEqual(6);
                    result = actor._attackToHit(attack, item, true, null);
                    expect(result.roll).toEqual(6);
                });
                it("it should roll the attack", function() {
                    expect(attack.roll).not.toHaveBeenCalled();
                    expect(attack.rollItem).not.toHaveBeenCalled();

                    actor._attackToHit(attack, null, false, null);
                    expect(attack.roll).toHaveBeenCalled();

                    attack.roll.reset();

                    expect(attack.rollItem).not.toHaveBeenCalled();
                    actor._attackToHit(attack, item, true, null);
                    expect(attack.rollItem).toHaveBeenCalledWith(item);

                    attack.rollItem.reset();

                    actor._attackToHit(attack, item, true, null);
                    expect(attack.roll).not.toHaveBeenCalled();
                    expect(attack.rollItem).toHaveBeenCalledWith(item);
                });
                it("it should return whether it was a crit", function() {
                    var result;
                    attack.isCritical.andReturn(false);
                    result = actor._attackToHit(attack, null, false, null);
                    expect(result.isCrit).toEqual(false);
                    attack.isCritical.andReturn(true);
                    result = actor._attackToHit(attack, item, true, null);
                    expect(result.isCrit).toEqual(true);
                    attack.isCritical.andReturn(false);
                    result = actor._attackToHit(attack, item, true, null);
                    expect(result.isCrit).toEqual(false);
                    expect(attack.isCritical.calls.length).toEqual(3);
                });
                it("it should return whether it was a fumble", function() {
                    var result;
                    attack.isFumble.andReturn(false);
                    result = actor._attackToHit(attack, null, false, null);
                    expect(result.isFumble).toEqual(false);
                    attack.isFumble.andReturn(true);
                    result = actor._attackToHit(attack, item, true, null);
                    expect(result.isFumble).toEqual(true);
                    attack.isFumble.andReturn(false);
                    result = actor._attackToHit(attack, item, true, null);
                    expect(result.isFumble).toEqual(false);
                    expect(attack.isFumble.calls.length).toEqual(3);
                });
            });
            describe("with a manual attack roll", function() {
                it("it should return the manual attack roll", function() {
                    var result;
                    result = actor._attackToHit(attack, null, false, manualRolls);
                    expect(result.roll).toEqual(manualRolls.attack.roll);
                    result = actor._attackToHit(attack, item, true, manualRolls);
                    expect(result.roll).toEqual(manualRolls.attack.roll);
                    result = actor._attackToHit(attack, item, true, manualRolls);
                    expect(result.roll).toEqual(manualRolls.attack.roll);
                });
                it("it should add the manual attack roll to the attack history", function() {
                    actor._attackToHit(attack, null, false, manualRolls);
                    expect(attack.addItem).toHaveBeenCalledWith(null, manualRolls.attack.roll, manualRolls.attack.isCritical, manualRolls.attack.isFumble);
                    actor._attackToHit(attack, item, true, manualRolls);
                    expect(attack.addItem).toHaveBeenCalledWith(item, manualRolls.attack.roll, manualRolls.attack.isCritical, manualRolls.attack.isFumble);
                    actor._attackToHit(attack, item, true, manualRolls);
                    expect(attack.addItem).toHaveBeenCalledWith(item, manualRolls.attack.roll, manualRolls.attack.isCritical, manualRolls.attack.isFumble);
                });
            });
            describe("with a manual attack crit", function() {
                it("it should return whether it was a crit", function() {
                    var result;
                    manualRolls.attack.roll = undefined;
                    attack.isCritical.andReturn(false);
                    manualRolls.attack.isCritical = false;
                    result = actor._attackToHit(attack, null, false, manualRolls);
                    expect(result.isCrit).toEqual(false);
                    manualRolls.attack.isCritical = true;
                    result = actor._attackToHit(attack, item, true, manualRolls);
                    expect(result.isCrit).toEqual(true);
                    manualRolls.attack.isCritical = false;
                    result = actor._attackToHit(attack, item, true, manualRolls);
                    expect(result.isCrit).toEqual(false);
                });
            });
            describe("with a manual attack fumble", function() {
                it("it should return whether it was a fumble", function() {
                    var result;
                    manualRolls.attack.roll = undefined;
                    attack.isFumble.andReturn(false);
                    manualRolls.attack.isFumble = false;
                    result = actor._attackToHit(attack, null, false, manualRolls);
                    expect(result.isFumble).toEqual(false);
                    manualRolls.attack.isFumble = true;
                    result = actor._attackToHit(attack, item, true, manualRolls);
                    expect(result.isFumble).toEqual(true);
                    manualRolls.attack.isFumble = false;
                    result = actor._attackToHit(attack, item, true, manualRolls);
                    expect(result.isFumble).toEqual(false);
                });
            });
            describe("if the result is not a foregone conclusion (not automatic, not crit, not fumble)", function() {
                it("it should determine the to hit modifier for the conditional.breakdown", function() {
                    attack.isCritical.andReturn(false);
                    attack.isFumble.andReturn(false);
                    attack.toHitModifiers.andCallFake(function() {
                        return { breakdown: "breakdown" };
                    });
                    actor.effects = [];
                    actor._attackToHit(attack, null, false, null);
                    actor.effects = [ "test" ];
                    actor._attackToHit(attack, item, true, null);
                    actor.effects = [ "test", "test" ];
                    actor._attackToHit(attack, item, true, manualRolls);
                    expect(attack.toHitModifiers).toHaveBeenCalledWith([]);
                    expect(attack.toHitModifiers).toHaveBeenCalledWith([ "test" ]);
                    expect(attack.toHitModifiers).toHaveBeenCalledWith([ "test", "test" ]);
                    expect(attack.toHitModifiers.calls.length).toEqual(3);
                });
                it("it should return the attack conditional/breakdown", function() {
                    var result;
                    attack.isCritical.andReturn(false);
                    attack.isFumble.andReturn(false);
                    attack.toHitModifiers.andCallFake(function() {
                        return { breakdown: "breakdown" };
                    });
                    result = actor._attackToHit(attack, null, false, null);
                    expect(result.conditional).toEqual({ breakdown: "breakdown" });
                    result = actor._attackToHit(attack, item, true, null);
                    expect(result.conditional).toEqual({ breakdown: "breakdown + combat advantage" });
                    result = actor._attackToHit(attack, item, true, manualRolls);
                    expect(result.conditional).toEqual({ breakdown: "breakdown + combat advantage" });
                });
            });
        });

        describe("_attackDamage() is called", function() {
            beforeEach(function() {
                spyOn(attack.damage, "addItem").andCallThrough();
            });
            it("it should log the call", function() {
                actor._attackDamage(attack, null, false, null);
                expect(actor.__log).toHaveBeenCalledWith("_attackDamage", [ attack.name, "undefined", false, null ]);

                actor._attackDamage(attack, item, false, null);
                expect(actor.__log).toHaveBeenCalledWith("_attackDamage", [ attack.name, item.name, false, null ]);

                actor._attackDamage(attack, item, true, null);
                expect(actor.__log).toHaveBeenCalledWith("_attackDamage", [ attack.name, item.name, true, null ]);

                actor._attackDamage(attack, item, true, manualRolls);
                expect(actor.__log).toHaveBeenCalledWith("_attackDamage", [ attack.name, item.name, true, manualRolls ]);
            });
            describe("with a manual damage roll", function() {
                it("it should return the manual damage roll", function() {
                    var result;
                    result = actor._attackDamage(attack, null, false, manualRolls);
                    expect(result.amount).toEqual(manualRolls.damage);
                    expect(result.isManual).toEqual(true);
                    result = actor._attackDamage(attack, item, true, manualRolls);
                    expect(result.amount).toEqual(manualRolls.damage);
                    expect(result.isManual).toEqual(true);
                    result = actor._attackDamage(attack, item, true, manualRolls);
                    expect(result.amount).toEqual(manualRolls.damage);
                    expect(result.isManual).toEqual(true);
                });
                it("it should add the manual damage roll to the damage history", function() {
                    actor._attackDamage(attack, null, false, manualRolls);
                    expect(attack.damage.addItem).toHaveBeenCalledWith(manualRolls.damage, null, false);
                    attack.damage.addItem.reset();
                    actor._attackDamage(attack, item, true, manualRolls);
                    expect(attack.damage.addItem).toHaveBeenCalledWith(manualRolls.damage, item, true);
                    attack.damage.addItem.reset();
                    actor._attackDamage(attack, item, true, manualRolls);
                    expect(attack.damage.addItem).toHaveBeenCalledWith(manualRolls.damage, item, true);
                });
                describe("for an attack with multiple damages", function() {
                    beforeEach(function() {
                        attack = new DnD.Attack({ name: "attackName", toHit: 10, defense: "AC", damage: [ "1d8", "1d6" ], keywords: [ "weapon", "melee", "basic" ] }, actor);
                        spyOn(attack.damage[ 0 ], "addItem");
                        spyOn(attack.damage[ 1 ], "addItem");
                    });
                    it("it should return the manual damage roll", function() {
                        var result;
                        result = actor._attackDamage(attack, null, false, manualRolls);
                        expect(result.amount).toEqual(manualRolls.damage);
                        expect(result.isManual).toEqual(true);
                        result = actor._attackDamage(attack, item, true, manualRolls);
                        expect(result.amount).toEqual(manualRolls.damage);
                        expect(result.isManual).toEqual(true);
                        result = actor._attackDamage(attack, item, true, manualRolls);
                        expect(result.amount).toEqual(manualRolls.damage);
                        expect(result.isManual).toEqual(true);
                    });
                    it("it should add the manual damage roll to each damage's history", function() {
                        actor._attackDamage(attack, null, false, manualRolls);
                        expect(attack.damage[ 0 ].addItem).toHaveBeenCalledWith(manualRolls.damage / 2, null, false);
                        expect(attack.damage[ 1 ].addItem).toHaveBeenCalledWith(manualRolls.damage / 2, null, false);
                        attack.damage[ 0 ].addItem.reset();
                        attack.damage[ 1 ].addItem.reset();
                        actor._attackDamage(attack, item, true, manualRolls);
                        expect(attack.damage[ 0 ].addItem).toHaveBeenCalledWith(manualRolls.damage / 2, item, true);
                        expect(attack.damage[ 1 ].addItem).toHaveBeenCalledWith(manualRolls.damage / 2, item, true);
                        attack.damage[ 0 ].addItem.reset();
                        attack.damage[ 1 ].addItem.reset();
                        actor._attackDamage(attack, item, true, manualRolls);
                        expect(attack.damage[ 0 ].addItem).toHaveBeenCalledWith(manualRolls.damage / 2, item, true);
                        expect(attack.damage[ 1 ].addItem).toHaveBeenCalledWith(manualRolls.damage / 2, item, true);
                    });
                });
                describe("for an attack roll", function() {
                    describe("with miss damage", function() {
                        beforeEach(function() {
                            attack = new DnD.Attack({ name: "attackName", toHit: 10, defense: "AC", damage: "1d8", miss: { amount: "1d6" }, keywords: [ "weapon", "melee", "basic" ] }, actor);
                            spyOn(attack.miss.damage, "addItem");
                        });
                        it("it should return the manual damage roll as miss damage", function() {
                            var result;
                            result = actor._attackDamage(attack, null, false, manualRolls);
                            expect(result.missAmount).toEqual(manualRolls.damage);
                            expect(result.isManual).toEqual(true);
                            result = actor._attackDamage(attack, item, true, manualRolls);
                            expect(result.missAmount).toEqual(manualRolls.damage);
                            expect(result.isManual).toEqual(true);
                            result = actor._attackDamage(attack, item, true, manualRolls);
                            expect(result.missAmount).toEqual(manualRolls.damage);
                            expect(result.isManual).toEqual(true);
                        });
                        it("it should add the manual damage roll to the miss damage history", function() {
                            actor._attackDamage(attack, null, false, manualRolls);
                            expect(attack.miss.damage.addItem).toHaveBeenCalledWith(manualRolls.damage, null, false);
                            attack.miss.damage.addItem.reset();
                            actor._attackDamage(attack, item, true, manualRolls);
                            expect(attack.miss.damage.addItem).toHaveBeenCalledWith(manualRolls.damage, item, false);
                            attack.miss.damage.addItem.reset();
                            actor._attackDamage(attack, item, true, manualRolls);
                            expect(attack.miss.damage.addItem).toHaveBeenCalledWith(manualRolls.damage, item, false);
                        });
                    });
                    describe("with miss half damage", function() {
                        beforeEach(function() {
                            attack = new DnD.Attack({ name: "attackName", toHit: 10, defense: "AC", damage: "1d8", miss: { amount: "1d6", halfDamage: true }, keywords: [ "weapon", "melee", "basic" ] }, actor);
                            spyOn(attack.miss.damage, "addItem");
                        });
                        it("it should return the manual damage roll as miss damage", function() {
                            var result;
                            result = actor._attackDamage(attack, null, false, manualRolls);
                            expect(result.missAmount).toEqual(manualRolls.damage / 2);
                            expect(result.isManual).toEqual(true);
                            result = actor._attackDamage(attack, item, true, manualRolls);
                            expect(result.missAmount).toEqual(manualRolls.damage / 2);
                            expect(result.isManual).toEqual(true);
                            result = actor._attackDamage(attack, item, true, manualRolls);
                            expect(result.missAmount).toEqual(manualRolls.damage / 2);
                            expect(result.isManual).toEqual(true);
                        });
                    });
                    describe("with multiple miss damages", function() {
                        beforeEach(function() {
                            attack = new DnD.Attack({ name: "attackName", toHit: 10, defense: "AC", damage: "1d12", miss: { damage: [ "1d8", "1d6" ] }, keywords: [ "weapon", "melee", "basic" ] }, actor);
                            spyOn(attack.miss.damage[ 0 ], "addItem");
                            spyOn(attack.miss.damage[ 1 ], "addItem");
                        });
                        it("it should return the manual damage roll", function() {
                            var result;
                            result = actor._attackDamage(attack, null, false, manualRolls);
                            expect(result.missAmount).toEqual(manualRolls.damage);
                            expect(result.isManual).toEqual(true);
                            result = actor._attackDamage(attack, item, true, manualRolls);
                            expect(result.missAmount).toEqual(manualRolls.damage);
                            expect(result.isManual).toEqual(true);
                            result = actor._attackDamage(attack, item, true, manualRolls);
                            expect(result.missAmount).toEqual(manualRolls.damage);
                            expect(result.isManual).toEqual(true);
                        });
                        it("it should add the manual damage roll to each damage's history", function() {
                            actor._attackDamage(attack, null, false, manualRolls);
                            expect(attack.miss.damage[ 0 ].addItem).toHaveBeenCalledWith(manualRolls.damage / 2, null, false);
                            expect(attack.miss.damage[ 1 ].addItem).toHaveBeenCalledWith(manualRolls.damage / 2, null, false);
                            attack.miss.damage[ 0 ].addItem.reset();
                            attack.miss.damage[ 1 ].addItem.reset();
                            actor._attackDamage(attack, item, true, manualRolls);
                            expect(attack.miss.damage[ 0 ].addItem).toHaveBeenCalledWith(manualRolls.damage / 2, item, false);
                            expect(attack.miss.damage[ 1 ].addItem).toHaveBeenCalledWith(manualRolls.damage / 2, item, false);
                            attack.miss.damage[ 0 ].addItem.reset();
                            attack.miss.damage[ 1 ].addItem.reset();
                            actor._attackDamage(attack, item, true, manualRolls);
                            expect(attack.miss.damage[ 0 ].addItem).toHaveBeenCalledWith(manualRolls.damage / 2, item, false);
                            expect(attack.miss.damage[ 1 ].addItem).toHaveBeenCalledWith(manualRolls.damage / 2, item, false);
                        });
                    });
                });
            });
            describe("without a manual damage roll", function() {
                it("it should roll the attack damage and return the damage result", function() {
                    var result;
                    spyOn(attack.damage, "rollItem").andReturn(6);
                    result = actor._attackDamage(attack, null, false, null);
                    expect(attack.damage.rollItem).toHaveBeenCalledWith(null, false);
                    expect(result.amount).toEqual(6);
                    expect(result.isManual).toEqual(false);
                    result = actor._attackDamage(attack, item, false, null);
                    expect(attack.damage.rollItem).toHaveBeenCalledWith(item, false);
                    expect(result.amount).toEqual(6);
                    expect(result.isManual).toEqual(false);
                    result = actor._attackDamage(attack, item, true, null);
                    expect(attack.damage.rollItem).toHaveBeenCalledWith(item, true);
                    expect(result.amount).toEqual(6);
                    expect(result.isManual).toEqual(false);
                });
                describe("for an attack with multiple damages", function() {
                    beforeEach(function() {
                        attack = new DnD.Attack({ name: "attackName", toHit: 10, defense: "AC", damage: [ "1d8", "1d6" ], keywords: [ "weapon", "melee", "basic" ] }, actor);
                        spyOn(attack.damage[ 0 ], "rollItem").andReturn(3);
                        spyOn(attack.damage[ 1 ], "rollItem").andReturn(3);
                    });
                    it("it should roll the attack damage for each damage and return the sum", function() {
                        var result;
                        result = actor._attackDamage(attack, null, false, null);
                        expect(attack.damage[ 0 ].rollItem).toHaveBeenCalledWith(null, false);
                        expect(attack.damage[ 1 ].rollItem).toHaveBeenCalledWith(null, false);
                        expect(result.amount).toEqual(6);
                        expect(result.isManual).toEqual(false);
                        result = actor._attackDamage(attack, item, false, null);
                        expect(attack.damage[ 0 ].rollItem).toHaveBeenCalledWith(item, false);
                        expect(attack.damage[ 1 ].rollItem).toHaveBeenCalledWith(item, false);
                        expect(result.amount).toEqual(6);
                        expect(result.isManual).toEqual(false);
                        result = actor._attackDamage(attack, item, true, null);
                        expect(attack.damage[ 0 ].rollItem).toHaveBeenCalledWith(item, true);
                        expect(attack.damage[ 1 ].rollItem).toHaveBeenCalledWith(item, true);
                        expect(result.amount).toEqual(6);
                        expect(result.isManual).toEqual(false);
                    });
                });
                describe("for an attack", function() {
                    describe("with miss damage", function() {
                        beforeEach(function() {
                            attack = new DnD.Attack({ name: "attackName", toHit: 10, defense: "AC", damage: "1d8", miss: { amount: "1d6" }, keywords: [ "weapon", "melee", "basic" ] }, actor);
                            spyOn(attack.miss.damage, "rollItem").andReturn(6);
                        });
                        it("it should return roll the miss damage and return the result", function() {
                            var result;
                            result = actor._attackDamage(attack, null, false, null);
                            expect(attack.miss.damage.rollItem).toHaveBeenCalledWith(null, false);
                            expect(result.missAmount).toEqual(6);
                            expect(result.isManual).toEqual(false);
                            result = actor._attackDamage(attack, item, false, null);
                            expect(attack.miss.damage.rollItem).toHaveBeenCalledWith(item, false);
                            expect(result.missAmount).toEqual(6);
                            expect(result.isManual).toEqual(false);
                            attack.miss.damage.rollItem.reset();
                            result = actor._attackDamage(attack, item, true, null);
                            expect(attack.miss.damage.rollItem).toHaveBeenCalledWith(item, false);
                            expect(result.missAmount).toEqual(6);
                            expect(result.isManual).toEqual(false);
                        });
                    });
                    describe("with miss half damage", function() {
                        beforeEach(function() {
                            attack = new DnD.Attack({ name: "attackName", toHit: 10, defense: "AC", damage: "1d8", miss: { amount: "1d6", halfDamage: true }, keywords: [ "weapon", "melee", "basic" ] }, actor);
                            spyOn(attack.damage, "rollItem").andReturn(6);
                        });
                        it("it should return the manual damage roll as miss damage", function() {
                            var result;
                            result = actor._attackDamage(attack, null, false, null);
                            expect(attack.damage.rollItem).toHaveBeenCalledWith(null, false);
                            expect(result.missAmount).toEqual(3);
                            expect(result.isManual).toEqual(false);
                            result = actor._attackDamage(attack, item, false, null);
                            expect(attack.damage.rollItem).toHaveBeenCalledWith(item, false);
                            expect(result.missAmount).toEqual(3);
                            expect(result.isManual).toEqual(false);
                            result = actor._attackDamage(attack, item, true, null);
                            expect(attack.damage.rollItem).toHaveBeenCalledWith(item, true);
                            expect(result.missAmount).toEqual(3);
                            expect(result.isManual).toEqual(false);
                        });
                    });
                    describe("with multiple miss damages", function() {
                        beforeEach(function() {
                            attack = new DnD.Attack({ name: "attackName", toHit: 10, defense: "AC", damage: "1d12", miss: { damage: [ "1d8", "1d6" ] }, keywords: [ "weapon", "melee", "basic" ] }, actor);
                            spyOn(attack.miss.damage[ 0 ], "rollItem").andReturn(3);
                            spyOn(attack.miss.damage[ 1 ], "rollItem").andReturn(3);
                        });
                        it("it should return the manual damage roll", function() {
                            var result;
                            result = actor._attackDamage(attack, null, false, null);
                            expect(attack.miss.damage[ 0 ].rollItem).toHaveBeenCalledWith(null, false);
                            expect(attack.miss.damage[ 1 ].rollItem).toHaveBeenCalledWith(null, false);
                            expect(result.missAmount).toEqual(6);
                            expect(result.isManual).toEqual(false);
                            result = actor._attackDamage(attack, item, false, null);
                            expect(attack.miss.damage[ 0 ].rollItem).toHaveBeenCalledWith(item, false);
                            expect(attack.miss.damage[ 1 ].rollItem).toHaveBeenCalledWith(item, false);
                            expect(result.missAmount).toEqual(6);
                            expect(result.isManual).toEqual(false);
                            result = actor._attackDamage(attack, item, true, null);
                            expect(attack.miss.damage[ 0 ].rollItem).toHaveBeenCalledWith(item, false);
                            expect(attack.miss.damage[ 1 ].rollItem).toHaveBeenCalledWith(item, false);
                            expect(result.missAmount).toEqual(6);
                            expect(result.isManual).toEqual(false);
                        });
                    });
                });
            });
            describe("when the attacker is weakened", function() {
                function testResult(result, amount) {
                    expect(result.conditional.mod).toEqual(-3);
                    expect(result.conditional.breakdown).toEqual(" [1/2 for weakened]");
                    expect(result.conditional.effects).toEqual([ "weakened" ]);
                    expect(result.amount).toEqual(amount);
                    expect(result.missAmount).toEqual(amount);
                }
                beforeEach(function() {
                    var weakened = new DnD.Effect({ name: "weakened" });
                    actor.effects.push(weakened);
                    attack = new DnD.Attack({ name: "attackName", toHit: 10, defense: "AC", damage: "1d8", miss: { amount: "1d6" }, keywords: [ "weapon", "melee", "basic" ] }, actor);
                    spyOn(attack.damage, "rollItem").andReturn(6);
                    spyOn(attack.miss.damage, "rollItem").andReturn(6);
                });
                it("it should return half the damage amount", function() {
                    testResult(actor._attackDamage(attack, null, false, null), 3);
                    testResult(actor._attackDamage(attack, item, false, null), 3);
                    testResult(actor._attackDamage(attack, item, true, null), 3);
                });
                describe("for an attack with multiple damages", function() {
                    beforeEach(function() {
                        attack = new DnD.Attack({ name: "attackName", toHit: 10, defense: "AC", damage: [ "1d8", "1d6" ], miss: { damage: [ "1d8", "1d6" ] }, keywords: [ "weapon", "melee", "basic" ] }, actor);
                        spyOn(attack.damage[ 0 ], "rollItem").andReturn(3);
                        spyOn(attack.damage[ 1 ], "rollItem").andReturn(3);
                        spyOn(attack.miss.damage[ 0 ], "rollItem").andReturn(3);
                        spyOn(attack.miss.damage[ 1 ], "rollItem").andReturn(3);
                    });
                    it("it should return half the damage amount for each damage", function() {
                        testResult(actor._attackDamage(attack, null, false, null), 3);
                        testResult(actor._attackDamage(attack, item, false, null), 3);
                        testResult(actor._attackDamage(attack, item, true, null), 3);
                    });
                });
            });
        });

        describe("_attackTarget() is called", function() {
            var target, toHit, damage;
            target = toHit = damage = null;
            beforeEach(function() {
                spyOn(actor, "_applyAttackBonuses");
                spyOn(actor, "_applyDamageAndEffects").andReturn("DAMAGE ANCHOR");
                target = new DnD.Actor(DnD.Creature.base);
                spyOn(target, "grantsCombatAdvantage").andReturn(false);
                spyOn(target, "defenseModifier").andReturn(0);
                spyOn(target.history, "add");
                attack = new DnD.Attack({ name: "attackName", toHit: 10, defense: "AC", damage: "1d8", miss: { amount: "1d6" }, keywords: [ "weapon", "melee", "basic" ] }, actor);
                spyOn(attack, "anchor").andReturn("ATTACK ANCHOR");
                toHit = { roll: 0, isAutomaticHit: false, isCrit: false, isFumble: false, conditional: { mod: 0 } };
                damage = {
                    amount: 0,
                    missAmount: 0,
                    conditional: { mod: 0, effects: [], breakdown: "" },
                    isManual: false
                };
            });
            it("it should log the call", function() {
                actor._attackTarget(attack, null, false, target, toHit, damage);
                expect(actor.__log).toHaveBeenCalledWith("_attackTarget", [ attack.name, "undefined", false, target.name, toHit, damage ]);

                actor._attackTarget(attack, item, false, target, toHit, damage);
                expect(actor.__log).toHaveBeenCalledWith("_attackTarget", [ attack.name, item.name, false, target.name, toHit, damage ]);

                actor._attackTarget(attack, item, true, target, toHit, damage);
                expect(actor.__log).toHaveBeenCalledWith("_attackTarget", [ attack.name, item.name, true, target.name, toHit, damage ]);
            });
            it("it should determine the attack bonuses for the attack", function() {
                var toHitTarget, targetDamage;
                toHitTarget = {
                    roll: 0,
                    conditional: { mod: 0, breakdown: "" }
                };
                targetDamage = {
                    amount: 0,
                    effects: [],
                    missAmount: 0,
                    missEffects: [],
                    conditional: { mod: 0, total: 0, breakdown: "" }
                };
                toHitTarget.roll = toHit.roll = 11;
                toHitTarget.conditional = toHit.conditional = { mod: 1, breakdown: "test" };
                toHitTarget.roll += 1;
                targetDamage.amount = damage.amount = 3;
                targetDamage.effects = attack.effects = [ "prone", "helpless" ];
                targetDamage.missAmount = damage.missAmount = 1;
                targetDamage.missEffects = attack.miss.effects = [ "prone" ];
                targetDamage.conditional = damage.conditional = { mod: 2, total: 3, breakdown: "test" };

                actor._attackTarget(attack, null, false, target, toHit, damage);
                expect(actor._applyAttackBonuses).toHaveBeenCalled();
                expect(actor._applyAttackBonuses.calls[ 0 ].args[ 0 ]).toBe(attack);
                expect(actor._applyAttackBonuses.calls[ 0 ].args[ 1 ]).toBe(damage);
                expect(actor._applyAttackBonuses.calls[ 0 ].args[ 2 ]).toBe(null);
                expect(actor._applyAttackBonuses.calls[ 0 ].args[ 3 ]).toBe(target);
                expect(actor._applyAttackBonuses.calls[ 0 ].args[ 4 ]).toBe(false);
                expect(actor._applyAttackBonuses.calls[ 0 ].args[ 5 ]).toEqual(toHitTarget);
                expect(actor._applyAttackBonuses.calls[ 0 ].args[ 6 ]).toEqual(targetDamage);
                actor._applyAttackBonuses.reset();

                actor._attackTarget(attack, item, false, target, toHit, damage);
                expect(actor._applyAttackBonuses).toHaveBeenCalled();
                expect(actor._applyAttackBonuses.calls[ 0 ].args[ 0 ]).toBe(attack);
                expect(actor._applyAttackBonuses.calls[ 0 ].args[ 1 ]).toBe(damage);
                expect(actor._applyAttackBonuses.calls[ 0 ].args[ 2 ]).toBe(item);
                expect(actor._applyAttackBonuses.calls[ 0 ].args[ 3 ]).toBe(target);
                expect(actor._applyAttackBonuses.calls[ 0 ].args[ 4 ]).toBe(false);
                expect(actor._applyAttackBonuses.calls[ 0 ].args[ 5 ]).toEqual(toHitTarget);
                expect(actor._applyAttackBonuses.calls[ 0 ].args[ 6 ]).toEqual(targetDamage);
                actor._applyAttackBonuses.reset();

                actor._attackTarget(attack, item, true, target, toHit, damage);
                expect(actor._applyAttackBonuses).toHaveBeenCalled();
                expect(actor._applyAttackBonuses.calls[ 0 ].args[ 0 ]).toBe(attack);
                expect(actor._applyAttackBonuses.calls[ 0 ].args[ 1 ]).toBe(damage);
                expect(actor._applyAttackBonuses.calls[ 0 ].args[ 2 ]).toBe(item);
                expect(actor._applyAttackBonuses.calls[ 0 ].args[ 3 ]).toBe(target);
                expect(actor._applyAttackBonuses.calls[ 0 ].args[ 4 ]).toBe(true);
                // vvv HACK: jasmine tests against the value as it is now, not as it was at the time of the call, and combatAdvantage increases this after the call
                toHitTarget.roll += 2;
                // ^^^ HACK: jasmine tests against the value as it is now, not as it was at the time of the call, and combatAdvantage increases this after the call
                expect(actor._applyAttackBonuses.calls[ 0 ].args[ 5 ]).toEqual(toHitTarget);
                expect(actor._applyAttackBonuses.calls[ 0 ].args[ 6 ]).toEqual(targetDamage);
                actor._applyAttackBonuses.reset();
            });

            describe("and the attack hits", function() {
                function hit() {
                    it("it should return a hit", function() {
                        var result;
                        result = actor._attackTarget(attack, null, false, target, toHit, damage);
                        expect(result.hit).toEqual(true);

                        result = actor._attackTarget(attack, item, false, target, toHit, damage);
                        expect(result.hit).toEqual(true);

                        result = actor._attackTarget(attack, item, true, target, toHit, damage);
                        expect(result.hit).toEqual(true);
                    });
                    it("it should apply the damage and effects to the target", function() {
                        actor._attackTarget(attack, null, false, target, toHit, damage);
                        //expect(actor._applyDamageAndEffects).toHaveBeenCalledWith(target, item, attack.damage, jasmine.any(Array), jasmine.any(Object), true, "Hit by " + actor.name + "'s ATTACK ANCHOR for ", { hit: true, damage: [] });
                        expect(actor._applyDamageAndEffects.calls[ 0 ].args[ 0 ]).toEqual(target);
                        expect(actor._applyDamageAndEffects.calls[ 0 ].args[ 1 ]).toEqual(null);
                        expect(actor._applyDamageAndEffects.calls[ 0 ].args[ 2 ]).toEqual(attack.damage);
                        expect(actor._applyDamageAndEffects.calls[ 0 ].args[ 3 ]).toEqual(jasmine.any(Array));
                        expect(actor._applyDamageAndEffects.calls[ 0 ].args[ 4 ]).toEqual(jasmine.any(Object));
                        expect(actor._applyDamageAndEffects.calls[ 0 ].args[ 5 ]).toEqual(true);
                        expect(actor._applyDamageAndEffects.calls[ 0 ].args[ 6 ]).toEqual({ hit: true, damage: [] });
                        actor._applyDamageAndEffects.reset();

                        actor._attackTarget(attack, item, false, target, toHit, damage);
                        expect(actor._applyDamageAndEffects).toHaveBeenCalledWith(target, item, attack.damage, jasmine.any(Array), jasmine.any(Object), true, { hit: true, damage: [] });
                        actor._applyDamageAndEffects.reset();

                        actor._attackTarget(attack, item, true, target, toHit, damage);
                        expect(actor._applyDamageAndEffects).toHaveBeenCalledWith(target, item, attack.damage, jasmine.any(Array), jasmine.any(Object), true, { hit: true, damage: [] });
                    });
                    describe("and the attack has multiple damages", function() {
                        beforeEach(function() {
                            attack = new DnD.Attack({ name: "attackName", toHit: 10, defense: "AC", damage: [ "1d8", "1d6" ], miss: { amount: "1d6" }, keywords: [ "weapon", "melee", "basic" ] }, actor);
                            spyOn(attack, "anchor").andReturn("ATTACK ANCHOR");
                        });
                        it("it should apply the damage and effects to the target", function() {
                            actor._attackTarget(attack, null, false, target, toHit, damage);
                            expect(actor._applyDamageAndEffects.calls[ 0 ].args[ 0 ]).toEqual(target);
                            expect(actor._applyDamageAndEffects.calls[ 0 ].args[ 1 ]).toEqual(null);
                            expect(actor._applyDamageAndEffects.calls[ 0 ].args[ 2 ]).toEqual(attack.damage[ 0 ]);
                            expect(actor._applyDamageAndEffects.calls[ 0 ].args[ 3 ]).toEqual(null);
                            expect(actor._applyDamageAndEffects.calls[ 0 ].args[ 4 ]).toEqual(jasmine.any(Object));
                            expect(actor._applyDamageAndEffects.calls[ 0 ].args[ 5 ]).toEqual(true);
                            expect(actor._applyDamageAndEffects.calls[ 0 ].args[ 6 ]).toEqual({ hit: true, damage: [] });
                            expect(actor._applyDamageAndEffects).toHaveBeenCalledWith(target, null, attack.damage[ 1 ], jasmine.any(Array), jasmine.any(Object), false, { hit: true, damage: [] });
                            actor._applyDamageAndEffects.reset();

                            actor._attackTarget(attack, item, false, target, toHit, damage);
                            expect(actor._applyDamageAndEffects).toHaveBeenCalledWith(target, item, attack.damage[ 0 ], null, jasmine.any(Object), true, { hit: true, damage: [] });
                            expect(actor._applyDamageAndEffects).toHaveBeenCalledWith(target, item, attack.damage[ 1 ], jasmine.any(Array), jasmine.any(Object), false, { hit: true, damage: [] });
                            actor._applyDamageAndEffects.reset();

                            actor._attackTarget(attack, item, true, target, toHit, damage);
                            expect(actor._applyDamageAndEffects).toHaveBeenCalledWith(target, item, attack.damage[ 0 ], null, jasmine.any(Object), true, { hit: true, damage: [] });
                            expect(actor._applyDamageAndEffects).toHaveBeenCalledWith(target, item, attack.damage[ 1 ], jasmine.any(Array), jasmine.any(Object), false, { hit: true, damage: [] });
                        });
                    });
                    it("it should add the hit to the target's history", function() {
                        actor._attackTarget(attack, null, false, target, toHit, damage);
                        expect(target.history.add).toHaveBeenCalledWith(jasmine.any(DnD.History.Entry));
                        expect(target.history.add.calls[ 0 ].args[ 0 ].subject).toEqual(target);
                        expect(target.history.add.calls[ 0 ].args[ 0 ].message).toEqual("Hit by " + actor.name + "'s ATTACK ANCHOR for DAMAGE ANCHOR (HP " + target.hp.current + ")");
                        target.history.add.reset();

                        actor._attackTarget(attack, item, false, target, toHit, damage);
                        expect(target.history.add).toHaveBeenCalledWith(jasmine.any(DnD.History.Entry));
                        expect(target.history.add.calls[ 0 ].args[ 0 ].subject).toEqual(target);
                        expect(target.history.add.calls[ 0 ].args[ 0 ].message).toEqual("Hit by " + actor.name + "'s ATTACK ANCHOR for DAMAGE ANCHOR (HP " + target.hp.current + ")");
                        target.history.add.reset();

                        actor._attackTarget(attack, item, true, target, toHit, damage);
                        expect(target.history.add).toHaveBeenCalledWith(jasmine.any(DnD.History.Entry));
                        expect(target.history.add.calls[ 0 ].args[ 0 ].subject).toEqual(target);
                        expect(target.history.add.calls[ 0 ].args[ 0 ].message).toEqual("Hit by " + actor.name + "'s ATTACK ANCHOR for DAMAGE ANCHOR (HP " + target.hp.current + ")");
                    });
                    it("it should add the miss to the central history", function() {
                        actor._attackTarget(attack, null, false, target, toHit, damage);
                        expect(DnD.History.central.add).toHaveBeenCalledWith(jasmine.any(DnD.History.Entry));
                        expect(DnD.History.central.add.calls[ 0 ].args[ 0 ].subject).toEqual(target);
                        expect(DnD.History.central.add.calls[ 0 ].args[ 0 ].message).toEqual("Hit by " + actor.name + "'s ATTACK ANCHOR for DAMAGE ANCHOR (HP " + target.hp.current + ")");
                        DnD.History.central.add.reset();

                        actor._attackTarget(attack, item, false, target, toHit, damage);
                        expect(DnD.History.central.add).toHaveBeenCalledWith(jasmine.any(DnD.History.Entry));
                        expect(DnD.History.central.add.calls[ 0 ].args[ 0 ].subject).toEqual(target);
                        expect(DnD.History.central.add.calls[ 0 ].args[ 0 ].message).toEqual("Hit by " + actor.name + "'s ATTACK ANCHOR for DAMAGE ANCHOR (HP " + target.hp.current + ")");
                        DnD.History.central.add.reset();

                        actor._attackTarget(attack, item, true, target, toHit, damage);
                        expect(DnD.History.central.add).toHaveBeenCalledWith(jasmine.any(DnD.History.Entry));
                        expect(DnD.History.central.add.calls[ 0 ].args[ 0 ].subject).toEqual(target);
                        expect(DnD.History.central.add.calls[ 0 ].args[ 0 ].message).toEqual("Hit by " + actor.name + "'s ATTACK ANCHOR for DAMAGE ANCHOR (HP " + target.hp.current + ")");
                    });
                }
                describe("because it's an automatic hit", function() {
                    beforeEach(function() {
                        toHit.isAutomaticHit = true;
                    });
                    hit();
                });
                describe("because it's a critical hit", function() {
                    beforeEach(function() {
                        toHit.isCrit = true;
                    });
                    hit();
                });
                describe("because the roll is higher than the defense", function() {
                    beforeEach(function() {
                        toHit.roll = 10;
                    });
                    hit();
                });
                describe("because the roll is higher than the defense with combat advantage", function() {
                    beforeEach(function() {
                        toHit.roll = 8;
                    });
                    it("it should return a hit", function() {
                        var result;
                        result = actor._attackTarget(attack, null, false, target, toHit, damage);
                        expect(result.hit).toEqual(false);

                        result = actor._attackTarget(attack, item, false, target, toHit, damage);
                        expect(result.hit).toEqual(false);

                        result = actor._attackTarget(attack, item, true, target, toHit, damage);
                        expect(result.hit).toEqual(true);
                    });
                    describe("and the attack deals damage and/or effects on a miss", function() {
                        it("it should apply the damage and effects to the target", function() {
                            actor._attackTarget(attack, null, false, target, toHit, damage);
                            //expect(actor._applyDamageAndEffects).toHaveBeenCalledWith(target, item, attack.damage, jasmine.any(Array), jasmine.any(Object), true, "Hit by " + actor.name + "'s ATTACK ANCHOR for ", { hit: true, damage: [] });
                            expect(actor._applyDamageAndEffects.calls[ 0 ].args[ 0 ]).toEqual(target);
                            expect(actor._applyDamageAndEffects.calls[ 0 ].args[ 1 ]).toEqual(null);
                            expect(actor._applyDamageAndEffects.calls[ 0 ].args[ 2 ]).toEqual(attack.miss.damage);
                            expect(actor._applyDamageAndEffects.calls[ 0 ].args[ 3 ]).toEqual(jasmine.any(Array));
                            expect(actor._applyDamageAndEffects.calls[ 0 ].args[ 4 ]).toEqual(jasmine.any(Object));
                            expect(actor._applyDamageAndEffects.calls[ 0 ].args[ 5 ]).toEqual(true);
                            expect(actor._applyDamageAndEffects.calls[ 0 ].args[ 6 ]).toEqual({ hit: false, damage: [] });
                            actor._applyDamageAndEffects.reset();

                            actor._attackTarget(attack, item, false, target, toHit, damage);
                            expect(actor._applyDamageAndEffects).toHaveBeenCalledWith(target, item, attack.miss.damage, jasmine.any(Array), jasmine.any(Object), true, { hit: false, damage: [] });
                            actor._applyDamageAndEffects.reset();

                            actor._attackTarget(attack, item, true, target, toHit, damage);
                            expect(actor._applyDamageAndEffects).toHaveBeenCalledWith(target, item, attack.damage, jasmine.any(Array), jasmine.any(Object), true, { hit: true, damage: [] });
                        });
                        describe("and the attack has multiple miss damages", function() {
                            beforeEach(function() {
                                attack = new DnD.Attack({ name: "attackName", toHit: 10, defense: "AC", damage: [ "1d8", "1d6" ], miss: { damage: [ "1d6", "1d4" ] }, keywords: [ "weapon", "melee", "basic" ] }, actor);
                                spyOn(attack, "anchor").andReturn("ATTACK ANCHOR");
                            });
                            it("it should apply the damage and effects to the target", function() {
                                actor._attackTarget(attack, null, false, target, toHit, damage);
                                expect(actor._applyDamageAndEffects.calls[ 0 ].args[ 0 ]).toEqual(target);
                                expect(actor._applyDamageAndEffects.calls[ 0 ].args[ 1 ]).toEqual(null);
                                expect(actor._applyDamageAndEffects.calls[ 0 ].args[ 2 ]).toEqual(attack.miss.damage[ 0 ]);
                                expect(actor._applyDamageAndEffects.calls[ 0 ].args[ 3 ]).toEqual(null);
                                expect(actor._applyDamageAndEffects.calls[ 0 ].args[ 4 ]).toEqual(jasmine.any(Object));
                                expect(actor._applyDamageAndEffects.calls[ 0 ].args[ 5 ]).toEqual(true);
                                expect(actor._applyDamageAndEffects.calls[ 0 ].args[ 6 ]).toEqual({ hit: false, damage: [] });
                                expect(actor._applyDamageAndEffects).toHaveBeenCalledWith(target, null, attack.miss.damage[ 1 ], jasmine.any(Array), jasmine.any(Object), false, { hit: false, damage: [] });
                                actor._applyDamageAndEffects.reset();

                                actor._attackTarget(attack, item, false, target, toHit, damage);
                                expect(actor._applyDamageAndEffects.calls[ 0 ].args[ 0 ]).toEqual(target);
                                expect(actor._applyDamageAndEffects.calls[ 0 ].args[ 1 ]).toEqual(item);
                                expect(actor._applyDamageAndEffects.calls[ 0 ].args[ 2 ]).toEqual(attack.miss.damage[ 0 ]);
                                expect(actor._applyDamageAndEffects.calls[ 0 ].args[ 3 ]).toEqual(null);
                                expect(actor._applyDamageAndEffects.calls[ 0 ].args[ 4 ]).toEqual(jasmine.any(Object));
                                expect(actor._applyDamageAndEffects.calls[ 0 ].args[ 5 ]).toEqual(true);
                                expect(actor._applyDamageAndEffects.calls[ 0 ].args[ 6 ]).toEqual({ hit: false, damage: [] });
                                expect(actor._applyDamageAndEffects).toHaveBeenCalledWith(target, item, attack.miss.damage[ 1 ], jasmine.any(Array), jasmine.any(Object), false, { hit: false, damage: [] });
                                actor._applyDamageAndEffects.reset();

                                actor._attackTarget(attack, item, true, target, toHit, damage);
                                expect(actor._applyDamageAndEffects).toHaveBeenCalledWith(target, item, attack.damage[ 0 ], null, jasmine.any(Object), true, { hit: true, damage: [] });
                                expect(actor._applyDamageAndEffects).toHaveBeenCalledWith(target, item, attack.damage[ 1 ], jasmine.any(Array), jasmine.any(Object), false, { hit: true, damage: [] });
                            });
                        });
                    });
                    it("it should add the hit to the target's history", function() {
                        actor._attackTarget(attack, null, false, target, toHit, damage);
                        expect(target.history.add).toHaveBeenCalledWith(jasmine.any(DnD.History.Entry));
                        expect(target.history.add.calls[ 0 ].args[ 0 ].subject).toEqual(target);
                        expect(target.history.add.calls[ 0 ].args[ 0 ].message).toEqual("Missed by " + actor.name + "'s ATTACK ANCHOR but takes DAMAGE ANCHOR on a miss (HP " + target.hp.current + ")");
                        target.history.add.reset();

                        actor._attackTarget(attack, item, false, target, toHit, damage);
                        expect(target.history.add).toHaveBeenCalledWith(jasmine.any(DnD.History.Entry));
                        expect(target.history.add.calls[ 0 ].args[ 0 ].subject).toEqual(target);
                        expect(target.history.add.calls[ 0 ].args[ 0 ].message).toEqual("Missed by " + actor.name + "'s ATTACK ANCHOR but takes DAMAGE ANCHOR on a miss (HP " + target.hp.current + ")");
                        target.history.add.reset();

                        target.grantsCombatAdvantage.andReturn(true);
                        actor._attackTarget(attack, item, false, target, toHit, damage);
                        expect(target.history.add).toHaveBeenCalledWith(jasmine.any(DnD.History.Entry));
                        expect(target.history.add.calls[ 0 ].args[ 0 ].subject).toEqual(target);
                        expect(target.history.add.calls[ 0 ].args[ 0 ].message).toEqual("Hit by " + actor.name + "'s ATTACK ANCHOR for DAMAGE ANCHOR (HP " + target.hp.current + ")");
                        target.history.add.reset();
                        target.grantsCombatAdvantage.andReturn(false);

                        actor._attackTarget(attack, item, true, target, toHit, damage);
                        expect(target.history.add).toHaveBeenCalledWith(jasmine.any(DnD.History.Entry));
                        expect(target.history.add.calls[ 0 ].args[ 0 ].subject).toEqual(target);
                        expect(target.history.add.calls[ 0 ].args[ 0 ].message).toEqual("Hit by " + actor.name + "'s ATTACK ANCHOR for DAMAGE ANCHOR (HP " + target.hp.current + ")");
                    });
                    it("it should add the miss to the central history", function() {
                        actor._attackTarget(attack, null, false, target, toHit, damage);
                        expect(DnD.History.central.add).toHaveBeenCalledWith(jasmine.any(DnD.History.Entry));
                        expect(DnD.History.central.add.calls[ 0 ].args[ 0 ].subject).toEqual(target);
                        expect(DnD.History.central.add.calls[ 0 ].args[ 0 ].message).toEqual("Missed by " + actor.name + "'s ATTACK ANCHOR but takes DAMAGE ANCHOR on a miss (HP " + target.hp.current + ")");
                        DnD.History.central.add.reset();

                        actor._attackTarget(attack, item, false, target, toHit, damage);
                        expect(DnD.History.central.add).toHaveBeenCalledWith(jasmine.any(DnD.History.Entry));
                        expect(DnD.History.central.add.calls[ 0 ].args[ 0 ].subject).toEqual(target);
                        expect(DnD.History.central.add.calls[ 0 ].args[ 0 ].message).toEqual("Missed by " + actor.name + "'s ATTACK ANCHOR but takes DAMAGE ANCHOR on a miss (HP " + target.hp.current + ")");
                        DnD.History.central.add.reset();

                        target.grantsCombatAdvantage.andReturn(true);
                        actor._attackTarget(attack, item, false, target, toHit, damage);
                        expect(DnD.History.central.add).toHaveBeenCalledWith(jasmine.any(DnD.History.Entry));
                        expect(DnD.History.central.add.calls[ 0 ].args[ 0 ].subject).toEqual(target);
                        expect(DnD.History.central.add.calls[ 0 ].args[ 0 ].message).toEqual("Hit by " + actor.name + "'s ATTACK ANCHOR for DAMAGE ANCHOR (HP " + target.hp.current + ")");
                        DnD.History.central.add.reset();
                        target.grantsCombatAdvantage.andReturn(false);

                        actor._attackTarget(attack, item, true, target, toHit, damage);
                        expect(DnD.History.central.add).toHaveBeenCalledWith(jasmine.any(DnD.History.Entry));
                        expect(DnD.History.central.add.calls[ 0 ].args[ 0 ].subject).toEqual(target);
                        expect(DnD.History.central.add.calls[ 0 ].args[ 0 ].message).toEqual("Hit by " + actor.name + "'s ATTACK ANCHOR for DAMAGE ANCHOR (HP " + target.hp.current + ")");
                    });
                });
            });
            describe("and the attack misses", function() {
                function miss() {
                    it("it should return a miss", function() {
                        var result;
                        result = actor._attackTarget(attack, null, false, target, toHit, damage);
                        expect(result.hit).toEqual(false);

                        result = actor._attackTarget(attack, item, false, target, toHit, damage);
                        expect(result.hit).toEqual(false);

                        result = actor._attackTarget(attack, item, true, target, toHit, damage);
                        expect(result.hit).toEqual(false);
                    });
                    describe("and the attack deals damage and/or effects on a miss", function() {
                        it("it should apply the damage and effects to the target", function() {
                            actor._attackTarget(attack, null, false, target, toHit, damage);
                            //expect(actor._applyDamageAndEffects).toHaveBeenCalledWith(target, item, attack.damage, jasmine.any(Array), jasmine.any(Object), true, "Hit by " + actor.name + "'s ATTACK ANCHOR for ", { hit: true, damage: [] });
                            expect(actor._applyDamageAndEffects.calls[ 0 ].args[ 0 ]).toEqual(target);
                            expect(actor._applyDamageAndEffects.calls[ 0 ].args[ 1 ]).toEqual(null);
                            expect(actor._applyDamageAndEffects.calls[ 0 ].args[ 2 ]).toEqual(attack.miss.damage);
                            expect(actor._applyDamageAndEffects.calls[ 0 ].args[ 3 ]).toEqual(jasmine.any(Array));
                            expect(actor._applyDamageAndEffects.calls[ 0 ].args[ 4 ]).toEqual(jasmine.any(Object));
                            expect(actor._applyDamageAndEffects.calls[ 0 ].args[ 5 ]).toEqual(true);
                            expect(actor._applyDamageAndEffects.calls[ 0 ].args[ 6 ]).toEqual({ hit: false, damage: [] });
                            actor._applyDamageAndEffects.reset();

                            actor._attackTarget(attack, item, false, target, toHit, damage);
                            expect(actor._applyDamageAndEffects).toHaveBeenCalledWith(target, item, attack.miss.damage, jasmine.any(Array), jasmine.any(Object), true, { hit: false, damage: [] });
                            actor._applyDamageAndEffects.reset();

                            actor._attackTarget(attack, item, true, target, toHit, damage);
                            expect(actor._applyDamageAndEffects).toHaveBeenCalledWith(target, item, attack.miss.damage, jasmine.any(Array), jasmine.any(Object), true, { hit: false, damage: [] });
                        });
                        describe("and the attack has multiple miss damages", function() {
                            beforeEach(function() {
                                attack = new DnD.Attack({ name: "attackName", toHit: 10, defense: "AC", damage: "1d8", miss: { damage: [ "1d6", "1d4" ] }, keywords: [ "weapon", "melee", "basic" ] }, actor);
                                spyOn(attack, "anchor").andReturn("ATTACK ANCHOR");
                            });
                            it("it should apply the damage and effects to the target", function() {
                                actor._attackTarget(attack, null, false, target, toHit, damage);
                                expect(actor._applyDamageAndEffects.calls[ 0 ].args[ 0 ]).toEqual(target);
                                expect(actor._applyDamageAndEffects.calls[ 0 ].args[ 1 ]).toEqual(null);
                                expect(actor._applyDamageAndEffects.calls[ 0 ].args[ 2 ]).toEqual(attack.miss.damage[ 0 ]);
                                expect(actor._applyDamageAndEffects.calls[ 0 ].args[ 3 ]).toEqual(null);
                                expect(actor._applyDamageAndEffects.calls[ 0 ].args[ 4 ]).toEqual(jasmine.any(Object));
                                expect(actor._applyDamageAndEffects.calls[ 0 ].args[ 5 ]).toEqual(true);
                                expect(actor._applyDamageAndEffects.calls[ 0 ].args[ 6 ]).toEqual({ hit: false, damage: [] });
                                expect(actor._applyDamageAndEffects).toHaveBeenCalledWith(target, null, attack.miss.damage[ 1 ], jasmine.any(Array), jasmine.any(Object), false, { hit: false, damage: [] });
                                actor._applyDamageAndEffects.reset();

                                actor._attackTarget(attack, item, false, target, toHit, damage);
                                expect(actor._applyDamageAndEffects).toHaveBeenCalledWith(target, item, attack.miss.damage[ 0 ], null, jasmine.any(Object), true, { hit: false, damage: [] });
                                expect(actor._applyDamageAndEffects).toHaveBeenCalledWith(target, item, attack.miss.damage[ 1 ], jasmine.any(Array), jasmine.any(Object), false, { hit: false, damage: [] });
                                actor._applyDamageAndEffects.reset();

                                actor._attackTarget(attack, item, true, target, toHit, damage);
                                expect(actor._applyDamageAndEffects).toHaveBeenCalledWith(target, item, attack.miss.damage[ 0 ], null, jasmine.any(Object), true, { hit: false, damage: [] });
                                expect(actor._applyDamageAndEffects).toHaveBeenCalledWith(target, item, attack.miss.damage[ 1 ], jasmine.any(Array), jasmine.any(Object), false, { hit: false, damage: [] });
                            });
                        });

                    });
                    it("it should add the miss to the target's history", function() {
                        actor._attackTarget(attack, null, false, target, toHit, damage);
                        expect(target.history.add).toHaveBeenCalledWith(jasmine.any(DnD.History.Entry));
                        expect(target.history.add.calls[ 0 ].args[ 0 ].subject).toEqual(target);
                        expect(target.history.add.calls[ 0 ].args[ 0 ].message).toEqual("Missed by " + actor.name + "'s ATTACK ANCHOR but takes DAMAGE ANCHOR on a miss (HP " + target.hp.current + ")");
                        target.history.add.reset();

                        actor._attackTarget(attack, item, false, target, toHit, damage);
                        expect(target.history.add).toHaveBeenCalledWith(jasmine.any(DnD.History.Entry));
                        expect(target.history.add.calls[ 0 ].args[ 0 ].subject).toEqual(target);
                        expect(target.history.add.calls[ 0 ].args[ 0 ].message).toEqual("Missed by " + actor.name + "'s ATTACK ANCHOR but takes DAMAGE ANCHOR on a miss (HP " + target.hp.current + ")");
                        target.history.add.reset();

                        actor._attackTarget(attack, item, true, target, toHit, damage);
                        expect(target.history.add).toHaveBeenCalledWith(jasmine.any(DnD.History.Entry));
                        expect(target.history.add.calls[ 0 ].args[ 0 ].subject).toEqual(target);
                        expect(target.history.add.calls[ 0 ].args[ 0 ].message).toEqual("Missed by " + actor.name + "'s ATTACK ANCHOR but takes DAMAGE ANCHOR on a miss (HP " + target.hp.current + ")");
                    });
                    it("it should add the miss to the central history", function() {
                        actor._attackTarget(attack, null, false, target, toHit, damage);
                        expect(DnD.History.central.add).toHaveBeenCalledWith(jasmine.any(DnD.History.Entry));
                        expect(DnD.History.central.add.calls[ 0 ].args[ 0 ].subject).toEqual(target);
                        expect(DnD.History.central.add.calls[ 0 ].args[ 0 ].message).toEqual("Missed by " + actor.name + "'s ATTACK ANCHOR but takes DAMAGE ANCHOR on a miss (HP " + target.hp.current + ")");
                        DnD.History.central.add.reset();

                        actor._attackTarget(attack, item, false, target, toHit, damage);
                        expect(DnD.History.central.add).toHaveBeenCalledWith(jasmine.any(DnD.History.Entry));
                        expect(DnD.History.central.add.calls[ 0 ].args[ 0 ].subject).toEqual(target);
                        expect(DnD.History.central.add.calls[ 0 ].args[ 0 ].message).toEqual("Missed by " + actor.name + "'s ATTACK ANCHOR but takes DAMAGE ANCHOR on a miss (HP " + target.hp.current + ")");
                        DnD.History.central.add.reset();

                        actor._attackTarget(attack, item, true, target, toHit, damage);
                        expect(DnD.History.central.add).toHaveBeenCalledWith(jasmine.any(DnD.History.Entry));
                        expect(DnD.History.central.add.calls[ 0 ].args[ 0 ].subject).toEqual(target);
                        expect(DnD.History.central.add.calls[ 0 ].args[ 0 ].message).toEqual("Missed by " + actor.name + "'s ATTACK ANCHOR but takes DAMAGE ANCHOR on a miss (HP " + target.hp.current + ")");
                    });
                }
                describe("because it's a fumble", function() {
                    beforeEach(function() {
                        toHit.isFumble = true;
                    });
                    miss();
                });
                describe("because the roll is lower than the defense", function() {
                    beforeEach(function() {
                        toHit.roll = 7;
                    });
                    miss();
                });
            });
        });

        describe("_applyAttackBonuses() is called and an attack bonus that matches the attack", function() {
            var damage, target, toHitTarget, targetDamage;
            damage = target = toHitTarget = targetDamage = null;
            beforeEach(function() {
                spyOn(actor, "_attackBonuses").andReturn([]);
                attack = new DnD.Attack({ name: "attackName", toHit: 10, defense: "AC", damage: "1d8", miss: { damage: "1d6" }, keywords: [ "weapon", "melee", "basic" ] }, actor);
                damage = { isManual: false };
                target = new DnD.Actor(DnD.Creature.base);
                toHitTarget = { roll: 10, conditional: { mod: 0, breakdown: "" }};
                targetDamage = { amount: 5, effects: [], missAmount: 2, missEffects: [], conditional: { mod: 0, total: 0, breakdown: "" } };
            });
            describe("that includes a bonus to hit", function() {
                beforeEach(function() {
                    actor._attackBonuses.andReturn([ { name: "test", toHit: 1 } ]);
                });
                it("it should add the attack bonus", function() {
                    actor._applyAttackBonuses(attack, { isManual: true }, item, target, false, toHitTarget, targetDamage);
                    expect(toHitTarget.conditional.breakdown).toEqual(" +1 (test)");
                    expect(toHitTarget.roll).toEqual(10);
                    expect(toHitTarget.conditional.mod).toEqual(0);
                    toHitTarget.conditional.breakdown = "";

                    actor._applyAttackBonuses(attack, { isManual: false }, item, target, false, toHitTarget, targetDamage);
                    expect(toHitTarget.conditional.breakdown).toEqual(" +1 (test)");
                    expect(toHitTarget.roll).toEqual(11);
                    expect(toHitTarget.conditional.mod).toEqual(1);
                });
            });
            describe("that includes a bonus to damage", function() {
                describe("that is a static number", function() {
                    beforeEach(function() {
                        actor._attackBonuses.andReturn([ { name: "test", damage: 1 } ]);
                    });
                    it("it should add the damage bonus", function() {
                        actor._applyAttackBonuses(attack, { isManual: true }, item, target, false, toHitTarget, targetDamage);
                        expect(targetDamage.conditional.breakdown).toEqual(" +1 (test)");
                        expect(targetDamage.amount).toEqual(5);
                        expect(targetDamage.missAmount).toEqual(2);
                        expect(targetDamage.conditional.mod).toEqual(0);
                        expect(targetDamage.conditional.total).toEqual(0);
                        targetDamage.conditional.breakdown = "";

                        actor._applyAttackBonuses(attack, { isManual: false }, item, target, false, toHitTarget, targetDamage);
                        expect(targetDamage.conditional.breakdown).toEqual(" +1 (test)");
                        expect(targetDamage.amount).toEqual(6);
                        expect(targetDamage.missAmount).toEqual(3);
                        expect(targetDamage.conditional.mod).toEqual(1);
                        expect(targetDamage.conditional.total).toEqual(1);
                    });
                });
                describe("that is a damage roll expression", function() {
                    beforeEach(function() {
                        actor._attackBonuses.andReturn([ { name: "test", damage: "1d6" } ]);
                        spyOn(DnD.Damage.prototype, "roll").andReturn(3);
                    });
                    it("it should add the damage bonus", function() {
                        actor._applyAttackBonuses(attack, { isManual: true }, item, target, false, toHitTarget, targetDamage);
                        expect(DnD.Damage.prototype.roll).toHaveBeenCalled();
                        expect(targetDamage.conditional.breakdown).toEqual(" +3 (test)");
                        expect(targetDamage.amount).toEqual(5);
                        expect(targetDamage.missAmount).toEqual(2);
                        expect(targetDamage.conditional.mod).toEqual(0);
                        expect(targetDamage.conditional.total).toEqual(0);
                        targetDamage.conditional.breakdown = "";
                        DnD.Damage.prototype.roll.reset();

                        actor._applyAttackBonuses(attack, { isManual: false }, item, target, false, toHitTarget, targetDamage);
                        expect(DnD.Damage.prototype.roll).toHaveBeenCalled();
                        expect(targetDamage.conditional.breakdown).toEqual(" +3 (test)");
                        expect(targetDamage.amount).toEqual(8);
                        expect(targetDamage.missAmount).toEqual(5);
                        expect(targetDamage.conditional.mod).toEqual(3);
                        expect(targetDamage.conditional.total).toEqual(3);
                    });
                });
                describe("on an attack with miss half damage", function() {
                    beforeEach(function() {
                        attack = new DnD.Attack({ name: "attackName", toHit: 10, defense: "AC", damage: "1d8", miss: { halfDamage: true }, keywords: [ "weapon", "melee", "basic" ] }, actor);
                    });
                    describe("and the damage bonus is a static number", function() {
                        beforeEach(function() {
                            actor._attackBonuses.andReturn([ { name: "test", damage: 2 } ]);
                        });
                        it("it should add the damage bonus", function() {
                            actor._applyAttackBonuses(attack, { isManual: true }, item, target, false, toHitTarget, targetDamage);
                            expect(targetDamage.conditional.breakdown).toEqual(" +2 (test)");
                            expect(targetDamage.amount).toEqual(5);
                            expect(targetDamage.missAmount).toEqual(2);
                            expect(targetDamage.conditional.mod).toEqual(0);
                            expect(targetDamage.conditional.total).toEqual(0);
                            targetDamage.conditional.breakdown = "";

                            actor._applyAttackBonuses(attack, { isManual: false }, item, target, false, toHitTarget, targetDamage);
                            expect(targetDamage.conditional.breakdown).toEqual(" +2 (test)");
                            expect(targetDamage.amount).toEqual(7);
                            expect(targetDamage.missAmount).toEqual(3);
                            expect(targetDamage.conditional.mod).toEqual(2);
                            expect(targetDamage.conditional.total).toEqual(2);
                        });
                    });
                    describe("and the damage bonus is a damage roll expression", function() {
                        beforeEach(function() {
                            actor._attackBonuses.andReturn([ { name: "test", damage: "1d6" } ]);
                            spyOn(DnD.Damage.prototype, "roll").andReturn(3);
                        });
                        it("it should add the damage bonus", function() {
                            actor._applyAttackBonuses(attack, { isManual: true }, item, target, false, toHitTarget, targetDamage);
                            expect(DnD.Damage.prototype.roll).toHaveBeenCalled();
                            expect(targetDamage.conditional.breakdown).toEqual(" +3 (test)");
                            expect(targetDamage.amount).toEqual(5);
                            expect(targetDamage.missAmount).toEqual(2);
                            expect(targetDamage.conditional.mod).toEqual(0);
                            expect(targetDamage.conditional.total).toEqual(0);
                            targetDamage.conditional.breakdown = "";
                            DnD.Damage.prototype.roll.reset();

                            actor._applyAttackBonuses(attack, { isManual: false }, item, target, false, toHitTarget, targetDamage);
                            expect(DnD.Damage.prototype.roll).toHaveBeenCalled();
                            expect(targetDamage.conditional.breakdown).toEqual(" +3 (test)");
                            expect(targetDamage.amount).toEqual(8);
                            expect(targetDamage.missAmount).toEqual(3);
                            expect(targetDamage.conditional.mod).toEqual(3);
                            expect(targetDamage.conditional.total).toEqual(3);
                        });
                    });
                });
            });
            describe("that includes effects", function() {
                beforeEach(function() {
                    targetDamage.effects = [ "prone" ];
                    actor._attackBonuses.andReturn([ { name: "test", effects: [ "dazed", "restrained" ] } ]);
                });
                it("it should add the effects", function() {
                    actor._applyAttackBonuses(attack, { isManual: true }, item, target, false, toHitTarget, targetDamage);
                    expect(targetDamage.effects).toEqual([ "prone", "dazed", "restrained" ]);
                    targetDamage.effects = [ "stunned" ];

                    actor._applyAttackBonuses(attack, { isManual: false }, item, target, false, toHitTarget, targetDamage);
                    expect(targetDamage.effects).toEqual([ "stunned", "dazed", "restrained" ]);
                });
            });
            describe("that includes miss effects", function() {
                beforeEach(function() {
                    targetDamage.missEffects = [ "prone" ];
                    actor._attackBonuses.andReturn([ { name: "test", miss: { effects: [ "dazed", "restrained" ] } } ]);
                });
                it("it should add the effects", function() {
                    actor._applyAttackBonuses(attack, { isManual: true }, item, target, false, toHitTarget, targetDamage);
                    expect(targetDamage.missEffects).toEqual([ "prone", "dazed", "restrained" ]);
                    targetDamage.missEffects = [ "stunned" ];

                    actor._applyAttackBonuses(attack, { isManual: false }, item, target, false, toHitTarget, targetDamage);
                    expect(targetDamage.missEffects).toEqual([ "stunned", "dazed", "restrained" ]);
                });
            });
        });


        describe("_applyDamageAndEffects() is called", function() {
            var target, damage, effects, conditional, passOnConditional, result;
            target = damage = effects = conditional = passOnConditional = result = null;
            beforeEach(function() {
                target = new DnD.Actor(DnD.Creature.base);
                spyOn(target, "takeDamage").andReturn({ damage: 3, msg: " TAKE DAMAGE" });
                damage = attack.damage;
                spyOn(damage, "getLastRoll").andReturn({ total: 3 });
                spyOn(damage, "anchor").andReturn("DAMAGE ANCHOR");
                effects = [ "test", "effects" ];
                conditional = { mod: 0, text: "" };
                passOnConditional = false;
                result = { damage: [] };
            });
            it("it should return a message containing the damage anchor and any supplementary text from target.takeDamage()", function() {
                passOnConditional = true;
                expect(actor._applyDamageAndEffects(target, null, damage, effects, conditional, passOnConditional, result)).toEqual("DAMAGE ANCHOR TAKE DAMAGE");
                expect(damage.anchor).toHaveBeenCalledWith({ mod: 0, text: "" });
                expect(target.takeDamage).toHaveBeenCalledWith(actor, 3, undefined, effects);

                passOnConditional = false;
                expect(actor._applyDamageAndEffects(target, item, damage, effects, conditional, passOnConditional, result)).toEqual("DAMAGE ANCHOR TAKE DAMAGE");
                expect(damage.anchor).toHaveBeenCalledWith(undefined);
                expect(target.takeDamage).toHaveBeenCalledWith(actor, 3, undefined, effects);
            });
            describe("and the damage has a type", function() {
                beforeEach(function() {
                    damage.type = "acid";
                    item.type = "cold";
                });
                it("it should use the damage type over the item type", function() {
                    passOnConditional = true;
                    actor._applyDamageAndEffects(target, item, damage, effects, conditional, passOnConditional, result);
                    expect(conditional.text).toEqual("");
                    expect(damage.anchor).toHaveBeenCalledWith({ mod: 0, text: "" });
                    expect(result).toEqual({ damage: [ { amount: 3, type: "acid" } ]});
                });
                it("it should return a message containing the damage anchor and any supplementary text from target.takeDamage()", function() {
                    passOnConditional = true;
                    expect(actor._applyDamageAndEffects(target, item, damage, effects, conditional, passOnConditional, result)).toEqual("DAMAGE ANCHOR TAKE DAMAGE");
                    expect(damage.anchor).toHaveBeenCalledWith({ mod: 0, text: "" });
                    expect(target.takeDamage).toHaveBeenCalledWith(actor, 3, "acid", effects);

                    passOnConditional = false;
                    expect(actor._applyDamageAndEffects(target, item, damage, effects, conditional, passOnConditional, result)).toEqual("DAMAGE ANCHOR TAKE DAMAGE");
                    expect(damage.anchor).toHaveBeenCalledWith(undefined);
                    expect(target.takeDamage).toHaveBeenCalledWith(actor, 3, "acid", effects);
                });
            });
            describe("and the damage has no type", function() {
                beforeEach(function() {
                    damage.type = undefined;
                    item.type = "cold";
                });
                it("it should use the item type", function() {
                    passOnConditional = true;
                    actor._applyDamageAndEffects(target, item, damage, effects, conditional, passOnConditional, result);
                    expect(conditional.text).toEqual(" cold");
                    expect(damage.anchor).toHaveBeenCalledWith({ mod: 0, text: " cold" });
                    expect(result).toEqual({ damage: [ { amount: 3, type: "cold" } ]});
                });
                it("it should return a message containing the damage anchor and any supplementary text from target.takeDamage()", function() {
                    passOnConditional = true;
                    expect(actor._applyDamageAndEffects(target, item, damage, effects, conditional, passOnConditional, result)).toEqual("DAMAGE ANCHOR TAKE DAMAGE");
                    expect(damage.anchor).toHaveBeenCalledWith({ mod: 0, text: " cold" });
                    expect(target.takeDamage).toHaveBeenCalledWith(actor, 3, "cold", effects);

                    passOnConditional = false;
                    expect(actor._applyDamageAndEffects(target, item, damage, effects, conditional, passOnConditional, result)).toEqual("DAMAGE ANCHOR TAKE DAMAGE");
                    expect(damage.anchor).toHaveBeenCalledWith(undefined);
                    expect(target.takeDamage).toHaveBeenCalledWith(actor, 3, "cold", effects);
                });
                describe("and the item has no type", function() {
                    beforeEach(function() {
                        damage.type = undefined;
                        item.type = undefined;
                    });
                    it("it should use no type", function() {
                        passOnConditional = true;
                        actor._applyDamageAndEffects(target, item, damage, effects, conditional, passOnConditional, result);
                        expect(conditional.text).toEqual("");
                        expect(damage.anchor).toHaveBeenCalledWith({ mod: 0, text: "" });
                        expect(result).toEqual({ damage: [ { amount: 3, type: undefined } ]});
                    });
                });
            });
        });

        describe("takeDamage() is called", function() {
            var target, damage, type, effects;
            target = damage = type = effects = null;
            beforeEach(function() {
                target = new DnD.Actor(DnD.Creature.base);
                target.hp.current = 100;
                spyOn(target, "__log");
                damage = 6;
                effects = [ { name: "prone" }, new DnD.Effect({ name: "dazed", duration: "endAttackerNext" }) ];
            });
            it("it should log the call", function() {
                target.takeDamage(actor, damage, null, effects);
                expect(target.__log).toHaveBeenCalledWith("takeDamage", [ actor.name, damage, null, effects ]);
                target.takeDamage(actor, damage, "acid", effects);
                expect(target.__log).toHaveBeenCalledWith("takeDamage", [ actor.name, damage, "acid", effects ]);
            });
            describe("if the damage isn't a Number", function() {
                it("it should do nothing and return an error", function() {
                    expect(target.takeDamage(actor, undefined, type, effects)).toEqual({
                        msg: "Creature.takeDamage() received NaN damage value",
                        damage: 0,
                        type: undefined
                    });
                    expect(target.takeDamage(actor, null, type, effects)).toEqual({
                        msg: "Creature.takeDamage() received NaN damage value",
                        damage: 0,
                        type: undefined
                    });
                    expect(target.takeDamage(actor, {}, type, effects)).toEqual({
                        msg: "Creature.takeDamage() received NaN damage value",
                        damage: 0,
                        type: undefined
                    });
                    expect(target.takeDamage(actor, "1d6", type, effects)).toEqual({
                        msg: "Creature.takeDamage() received NaN damage value",
                        damage: 0,
                        type: undefined
                    });
                    expect(target.takeDamage(actor, true, type, effects)).toEqual({
                        msg: "Creature.takeDamage() received NaN damage value",
                        damage: 0,
                        type: undefined
                    });
                    expect(target.takeDamage(actor, [], type, effects)).toEqual({
                        msg: "Creature.takeDamage() received NaN damage value",
                        damage: 0,
                        type: undefined
                    });
                    // TODO: measure doing nothing
                });
            });
            describe("if the damage has a type", function() {
                beforeEach(function() {
                    type = "acid";
                });
                it("it should return the type", function() {
                    var result = target.takeDamage(actor, damage, type, []);
                    expect(result.type).toEqual("acid");
                });
                describe("and the target has vulnerability to the type", function() {
                    beforeEach(function() {
                        target.vulnerabilities = { "acid": 4 };
                    });
                    it("it should increase the damage by the vulnerability amount", function() {
                        var result = target.takeDamage(actor, damage, type, effects);
                        expect(target.hp.current).toEqual(90);
                        expect(result.damage).toEqual(10);
                    });
                    it("it should list the vulnerability in the message", function() {
                        var result = target.takeDamage(actor, damage, type, []);
                        expect(result.msg).toEqual(" and 4 acid vulnerability");
                    });
                    describe("and the target has vulnerability to the type due to Effects", function() {
                        beforeEach(function() {
                            target.effects.push(new DnD.Effect({ name: "vulnerable", type: "acid", amount: 5 }));
                        });
                        it("it should increase the damage by the higher vulnerability amount", function() {
                            var result = target.takeDamage(actor, damage, type, []);
                            expect(target.hp.current).toEqual(89);
                            expect(result.damage).toEqual(11);

                            target.hp.current = 100;
                            target.vulnerabilities.acid = 5;
                            target.effects[ 0 ].amount = 4;
                            result = target.takeDamage(actor, damage, type, []);
                            expect(target.hp.current).toEqual(89);
                            expect(result.damage).toEqual(11);
                        });
                        it("it should list the vulnerability in the message", function() {
                            var result = target.takeDamage(actor, damage, type, []);
                            expect(result.msg).toEqual(" and 5 acid vulnerability");
                        });
                    });
                });
                describe("and the target has resistance to the type", function() {
                    beforeEach(function() {
                        target.resistances = { "acid": 4 };
                    });
                    it("it should decrease the damage by the resistance amount", function() {
                        var result = target.takeDamage(actor, damage, type, effects);
                        expect(target.hp.current).toEqual(98);
                        expect(result.damage).toEqual(2);
                    });
                    it("it should list the resistance in the message", function() {
                        var result = target.takeDamage(actor, damage, type, []);
                        expect(result.msg).toEqual(" (resisted 4)");
                    });
                });
            });
            describe("if the damage has multiple types", function() {
                beforeEach(function() {
                    type = [ "acid", "fire" ];
                });
                it("it should return the types", function() {
                    var result = target.takeDamage(actor, damage, type, []);
                    expect(result.type).toEqual([ "acid", "fire" ]);
                });
                describe("and the target has vulnerability to the types", function() {
                    beforeEach(function() {
                        target.vulnerabilities = { "acid": 2, "fire": 2 };
                    });
                    it("it should increase the damage by the vulnerability amounts", function() {
                        var result = target.takeDamage(actor, damage, type, effects);
                        expect(target.hp.current).toEqual(90);
                        expect(result.damage).toEqual(10);
                    });
                    it("it should list the vulnerability in the message", function() {
                        var result = target.takeDamage(actor, damage, type, []);
                        expect(result.msg).toEqual(" and 2 acid vulnerability and 2 fire vulnerability");
                    });
                });
                describe("and the target has resistance to one of the types", function() {
                    beforeEach(function() {
                        target.resistances = { "acid": 4 };
                    });
                    it("it should not decrease the damage by the resistance amount", function() {
                        var result = target.takeDamage(actor, damage, type, effects);
                        expect(target.hp.current).toEqual(94);
                        expect(result.damage).toEqual(6);
                    });
                    it("it should not list the resistance in the message", function() {
                        var result = target.takeDamage(actor, damage, type, []);
                        expect(result.msg).toEqual("");
                    });
                });
                describe("and the target has resistance to all the types", function() {
                    beforeEach(function() {
                        target.resistances = { "acid": 4, "fire": 2 };
                    });
                    it("it should decrease the damage by the lowest resistance amount", function() {
                        var result = target.takeDamage(actor, damage, type, effects);
                        expect(target.hp.current).toEqual(96);
                        expect(result.damage).toEqual(4);
                    });
                    it("it should list the resistance in the message", function() {
                        var result = target.takeDamage(actor, damage, type, []);
                        expect(result.msg).toEqual(" (resisted 2)");
                    });
                });
            });
            describe("and the target has resist \"all\"", function() {
                beforeEach(function() {
                    target.resistances = { "all": 4 };
                });
                it("it should decrease the damage by the resistance amount", function() {
                    var result = target.takeDamage(actor, damage, null, effects);
                    expect(target.hp.current).toEqual(98);
                    expect(result.damage).toEqual(2);
                });
                it("it should list the resistance in the message", function() {
                    var result = target.takeDamage(actor, damage, type, []);
                    expect(result.msg).toEqual(" (resisted 4)");
                });
                describe("and the damage has a type", function() {
                    beforeEach(function() {
                        type = "acid";
                    });
                    describe("and the target has resistance to the type", function() {
                        beforeEach(function() {
                            target.resistances = { "acid": 5 };
                        });
                        it("it should use the higher resistance", function() {
                            var result = target.takeDamage(actor, damage, type, effects);
                            expect(target.hp.current).toEqual(99);
                            expect(result.damage).toEqual(1);

                            target.hp.current = 100;
                            target.resistances.all = 5;
                            target.resistances.acid = 4;
                            result = target.takeDamage(actor, damage, type, effects);
                            expect(target.hp.current).toEqual(99);
                            expect(result.damage).toEqual(1);
                        });
                        it("it should list the resistance in the message", function() {
                            var result = target.takeDamage(actor, damage, type, []);
                            expect(result.msg).toEqual(" (resisted 5)");
                        });
                    });
                });
            });
            describe("and the target has resist \"insubstantial\"", function() {
                beforeEach(function() {
                    target.resistances = { "insubstantial": 50 };
                });
                it("it should decrease the damage by half", function() {
                    var result = target.takeDamage(actor, damage, null, effects);
                    expect(target.hp.current).toEqual(97);
                    expect(result.damage).toEqual(3);
                });
                it("it should list the resistance in the message", function() {
                    var result = target.takeDamage(actor, damage, type, []);
                    expect(result.msg).toEqual(" (resisted 3)");
                });
                describe("and the damage has a type", function() {
                    beforeEach(function() {
                        type = "acid";
                    });
                    describe("and the target has resistance to the type", function() {
                        beforeEach(function() {
                            target.resistances.acid = 2;
                        });
                        it("it should subtract the type resistance and then resist half the remaining damage", function() {
                            var result = target.takeDamage(actor, damage, type, effects);
                            expect(target.hp.current).toEqual(98);
                            expect(result.damage).toEqual(2);
                        });
                        it("it should list the resistance in the message", function() {
                            var result = target.takeDamage(actor, damage, type, []);
                            expect(result.msg).toEqual(" (resisted 4)");
                        });
                    });
                });
            });
            describe("and the target has temporary HP", function() {
                beforeEach(function() {
                    target.hp.temp = 7;
                });
                it("it should remove temporary HP before real HP", function() {
                    var result = target.takeDamage(actor, damage, type, effects);
                    expect(target.hp.current).toEqual(100);
                    expect(target.hp.temp).toEqual(1);
                    expect(result.damage).toEqual(0);

                    result = target.takeDamage(actor, damage, type, effects);
                    expect(target.hp.current).toEqual(95);
                    expect(target.hp.temp).toEqual(0);
                    expect(result.damage).toEqual(5);
                });
                it("it should list temporary HP interaction in the message", function() {
                    var result = target.takeDamage(actor, damage, type, []);
                    expect(result.msg).toEqual(" (6 absorbed by temporary HP)");
                    result = target.takeDamage(actor, damage, type, []);
                    expect(result.msg).toEqual(" (1 absorbed by temporary HP)");
                });
            });
            describe("with effects", function() {
                it("it should add each Effect to the attacker's imposedEffects", function() {
                    expect(actor.imposedEffects.length).toEqual(0);
                    target.takeDamage(actor, damage, type, effects);
                    expect(actor.imposedEffects.length).toEqual(2);
                    expect(actor.imposedEffects[ 0 ].name).toEqual(effects[ 0 ].name);
                    expect(actor.imposedEffects[ 1 ].name).toEqual(effects[ 1 ].name);
                });
                it("it should add each Effect to the target's effects", function() {
                    expect(target.effects.length).toEqual(0);
                    target.takeDamage(actor, damage, type, effects);
                    expect(target.effects.length).toEqual(2);
                    expect(target.effects[ 0 ].name).toEqual(effects[ 0 ].name);
                    expect(target.effects[ 1 ].name).toEqual(effects[ 1 ].name);
                });
                it("it should list the effects in the message", function() {
                    var result = target.takeDamage(actor, damage, type, effects);
                    expect(result.msg).toEqual(", prone, dazed");
                });
                describe("if an effect has a duration relative to the attacker's next turn", function() {
                    it("it should flag the Effect as not being in the next turn yet", function() {
                        var effect;
                        target.takeDamage(actor, damage, type, effects);
                        effect = actor.imposedEffects[ 1 ];
                        expect(effect).toEqual(target.effects[ 1 ]);
                        expect(effect.isNextTurn).toEqual(false);
                    });
                });
                describe("if an effect is \"Marked\" and the target already has a \"Marked\" Effect", function() {
                    var marked = null;
                    beforeEach(function() {
                        marked = jasmine.createSpyObj("Marked Effect", [ "remove" ]);
                        marked.name = "Marked";
                        marked.remove.andCallFake(function() {
                            target.effects.splice(target.effects.indexOf(marked), 1);
                        });
                        target.effects.push(marked);
                        effects = [ new DnD.Effect({ name: "Marked" }) ];
                    });
                    it("it should the existing \"Marked\" Effect", function() {
                        expect(target.effects.length).toEqual(1);
                        target.takeDamage(actor, damage, type, effects);
                        expect(marked.remove).toHaveBeenCalled();
                        expect(target.effects.length).toEqual(1);
                        expect(target.effects[ 0 ]).not.toEqual(marked);
                    });
                });
            });
            describe("and the final damage exceeds the target's current HP", function() {
                it("it should add the \"Dying\" Effect to the target", function() {
                    target.takeDamage(actor, 101, type, []);
                    expect(target.effects.length).toEqual(1);
                    expect(target.effects[ 0 ].name).toEqual("Dying");
                });
                it("it should mention it in the message", function() {
                    var result = target.takeDamage(actor, 101, type, []);
                    expect(result.msg).toEqual("; " + target.name + " falls unconscious and is dying");
                });
                describe("but the target is already dying", function() {
                    beforeEach(function() {
                        target.effects.push(new DnD.Effect({ name: "Dying" }));
                    });
                    it("it shouldn't add the \"Dying\" Effect to the target", function() {
                        expect(target.effects.length).toEqual(1);
                        target.takeDamage(actor, 101, type, []);
                        expect(target.effects.length).toEqual(1);
                        expect(target.effects[ 0 ].name).toEqual("Dying");
                    });
                    it("it shouldn't mention it in the message", function() {
                        var result = target.takeDamage(actor, 101, type, []);
                        expect(result.msg).toEqual("");
                    });
                });
            });
        });

        function attack_actor(actor) {
            beforeEach(function() {
                spyOn(actor, "__log");
                spyOn(actor, "_attackToHit").andReturn({ isCrit: false });
                spyOn(actor, "_attackDamage");
                spyOn(actor, "_attackTarget").andReturn({});
            });

            describe(actor.name + "'s attack() is called", function() {
                var i, attack, j, item;
                for (i = 0; i < actor.attacks.length; i++) {
                    attack = actor.attacks[ i ];
                    item = null;
                    if (attack.hasKeyword("implement")) {
                        if (actor.implements && actor.implements.length) {
                            item = actor.implements[ 0 ];
                        }
                    }
                    else if (attack.hasKeyword("weapon")) {
                        for (j = 0; actor.weapons && j < actor.weapons.length; j++) {
                            if (attack.hasKeyword("melee") && actor.weapons[ j ].isMelee) {
                                item = actor.weapons[ j ];
                                break;
                            }
                            else if (attack.hasKeyword("ranged") && !actor.weapons[ j ].isMelee) {
                                item = actor.weapons[ j ];
                                break;
                            }
                        }
                    }
                    attack_actor_attack(actor, attack, item);
                }
            });
        }

        function attack_actor_attack(actor, attack) {
            describe("with its " + attack.name + " attack", function() {
                var i;
                if (attack.hasKeyword("implement")) {
                    for (i = 0; actor.implements && i < actor.implements.length; i++) {
                        attack_actor_attack_item(actor, attack, actor.implements[ i ]);
                    }
                }
                else if (attack.hasKeyword("weapon")) {
                    for (i = 0; actor.weapons && i < actor.weapons.length; i++) {
                        if (attack.hasKeyword("melee") && actor.weapons[ i ].isMelee || attack.hasKeyword("ranged") && !actor.weapons[ i ].isMelee) {
                            attack_actor_attack_item(actor, attack, actor.weapons[ i ]);
                        }
                    }
                }
                else {
                    attack_actor_attack_item(actor, attack, null);
                }
            });
        }

        function attack_actor_attack_item(actor, attack, item) {
            describe(item ? " and " + item.name : "", function() {
                describe("targeting a single target", function() {
                    it("it should log the call", function() {
                        actor.attack(attack, item, [ targets[ 0 ] ], true, null);
                        expect(actor.__log).toHaveBeenCalledWith("attack", [ attack.name, item ? item.name : "undefined", 1, true, null ]);
                    });
                    it("it should determine the final to hit value (or lack thereof for automatic hits)", function() {
                        actor.attack(attack, item, [ targets[ 0 ] ], false, null);
                        expect(actor._attackToHit).toHaveBeenCalledWith(attack, item, false, null);
                    });
                    it("it should determine the final damage value", function() {
                        actor._attackToHit.andReturn({ isCrit: false });
                        actor.attack(attack, item, [ targets[ 0 ] ], false, null);
                        expect(actor._attackDamage).toHaveBeenCalledWith(attack, item, false, null);

                        actor._attackToHit.andReturn({ isCrit: true });
                        actor.attack(attack, item, [ targets[ 0 ] ], true, null);
                        expect(actor._attackDamage).toHaveBeenCalledWith(attack, item, true, null);

                        actor.attack(attack, item, [ targets[ 0 ] ], true, { toHit: 18, damage: 10 });
                        expect(actor._attackDamage).toHaveBeenCalledWith(attack, item, true, { toHit: 18, damage: 10 });
                    });
                    it("it should attack the target", function() {
                        actor._attackToHit.andReturn({ isCrit: false });
                        actor._attackDamage.andReturn({ damage: 6 });
                        actor.attack(attack, item, [ targets[ 0 ] ], false, null);
                        expect(actor._attackTarget).toHaveBeenCalledWith(attack, item, false, targets[ 0 ], { isCrit: false }, { damage: 6 });

                        actor.attack(attack, item, [ targets[ 0 ] ], true, null);
                        expect(actor._attackTarget).toHaveBeenCalledWith(attack, item, true, targets[ 0 ], { isCrit: false }, { damage: 6 });

                        actor._attackTarget.reset();
                        actor.attack(attack, item, [ targets[ 0 ] ], true, { toHit: 18, damage: 10 });
                        expect(actor._attackTarget).toHaveBeenCalledWith(attack, item, true, targets[ 0 ], { isCrit: false }, { damage: 6 });
                    });
                });
                describe("targeting mulitple targets", function() {
                    it("it should log the call", function() {
                        actor.attack(attack, item, targets, false, null);
                        expect(actor.__log).toHaveBeenCalledWith("attack", [ attack.name, item ? item.name : "undefined", 3, false, null ]);
                    });
                    it("it should determine the final to hit value (or lack thereof for automatic hits)", function() {
                        actor.attack(attack, item, targets, false, null);
                        expect(actor._attackToHit).toHaveBeenCalledWith(attack, item, false, null);
                    });
                    it("it should determine the final damage value", function() {
                        actor._attackToHit.andReturn({ isCrit: false });
                        actor.attack(attack, item, targets, false, null);
                        expect(actor._attackDamage).toHaveBeenCalledWith(attack, item, false, null);

                        actor._attackToHit.andReturn({ isCrit: true });
                        actor.attack(attack, item, targets, true, null);
                        expect(actor._attackDamage).toHaveBeenCalledWith(attack, item, true, null);

                        actor.attack(attack, item, targets, true, { toHit: 18, damage: 10 });
                        expect(actor._attackDamage).toHaveBeenCalledWith(attack, item, true, { toHit: 18, damage: 10 });
                    });
                    it("it should attack each target", function() {
                        actor._attackToHit.andReturn({ isCrit: false });
                        actor._attackDamage.andReturn({ damage: 6 });
                        actor.attack(attack, item, targets, false, null);
                        expect(actor._attackTarget).toHaveBeenCalledWith(attack, item, false, targets[ 0 ], { isCrit: false }, { damage: 6 });
                        expect(actor._attackTarget).toHaveBeenCalledWith(attack, item, false, targets[ 1 ], { isCrit: false }, { damage: 6 });
                        expect(actor._attackTarget).toHaveBeenCalledWith(attack, item, false, targets[ 2 ], { isCrit: false }, { damage: 6 });

                        actor.attack(attack, item, targets, true, null);
                        expect(actor._attackTarget).toHaveBeenCalledWith(attack, item, true, targets[ 0 ], { isCrit: false }, { damage: 6 });
                        expect(actor._attackTarget).toHaveBeenCalledWith(attack, item, true, targets[ 1 ], { isCrit: false }, { damage: 6 });
                        expect(actor._attackTarget).toHaveBeenCalledWith(attack, item, true, targets[ 2 ], { isCrit: false }, { damage: 6 });

                        actor._attackTarget.reset();
                        actor.attack(attack, item, targets, true, { toHit: 18, damage: 10 });
                        expect(actor._attackTarget).toHaveBeenCalledWith(attack, item, true, targets[ 0 ], { isCrit: false }, { damage: 6 });
                        expect(actor._attackTarget).toHaveBeenCalledWith(attack, item, true, targets[ 1 ], { isCrit: false }, { damage: 6 });
                        expect(actor._attackTarget).toHaveBeenCalledWith(attack, item, true, targets[ 2 ], { isCrit: false }, { damage: 6 });
                    });
                });
            });
        }

        function attack_actor_attack_target(actor, attack, item, targets) {
        }

        return;
        (function attack_iter() {
            var i, j;
            for (i = 0; i < ACTORS.length; i++) {
                attack_actor(ACTORS[ i ]);
            }
        })();
    });

})(window.DnD);