var Test;
if (!Test) {
    Test = {};
}


Test.hasValidSpeed = function(object, extra) {
    if (typeof(object.speed) === "number") {
        Test.hasNumberProperty(object, "speed", extra);
    }
    else {
        Test.hasNonEmptyObjectProperty(object, "speed", extra);
        describe("speed: Object of the form", (function(object, extra) {
            var j;
            for (j in object.speed) {
                Test.hasPositiveNumberProperty(object.speed, j, extra);
            }
        }).bind(object, extra));
    }
};


Test.hasValidAttackBonuses = function(creature) {
    describe("attackBonuses: Array of Object of the form", (function(creature) {
        var i, attackBonus, extra, attackBonusToHitDamageEffectsFail, attackBonusStatusTest, attackBonusFoeConditionTest;
        
        attackBonusToHitDamageEffectsFail = function(creature) {
            expect(undefined).toEqual("something [" + extra + "]");
        };
        
        attackBonusStatusTest = function(attackBonus) {
            var i;
            for (i = 0; i < attackBonus.status.length; i++) {
                expect(attackBonus.status[ i ].length).not.toEqual(0);
            }
        };
        
        attackBonusFoeConditionTest = function(attackBonus) {
            var i;
            for (i = 0; i < attackBonus.foeCondition.length; i++) {
                expect(attackBonus.foeCondition[ i ].length).not.toEqual(0);
            }
        };
        
        for (i = 0; i < creature.attackBonuses.length; i++) {
            attackBonus = creature.attackBonuses[ i ];
            Test.hasNonEmptyStringProperty(attackBonus, "name", creature.name);
            extra = creature.name + " " + attackBonus.name;
            if (!attackBonus.hasOwnProperty("toHit") && !attackBonus.hasOwnProperty("damage") && !attackBonus.hasOwnProperty("effects")) {
                it("toHit or damage or effects", attackBonusToHitDamageEffectsFail.bind(this, creature));
            }
            if (attackBonus.hasOwnProperty("toHit")) {
                Test.hasNumberProperty(attackBonus, "toHit", extra);
            }
            if (attackBonus.hasOwnProperty("damage")) {
                if (typeof(attackBonus.damage) === "number") {
                    Test.hasNumberProperty(attackBonus, "damage", extra);
                }
                else {
                    Test.hasNonEmptyStringProperty(attackBonus, "damage", extra);
                }
            }
            Test.hasValidEffects(attackBonus, false, extra);
            Test.hasValidKeywords(attackBonus, false, extra);
            if (attackBonus.hasOwnProperty("status")) {
                Test.hasNonEmptyArrayProperty(attackBonus, "status", creature.name + " " + attackBonus.name);
                it("status: Array of String [" + creature.name + " " + attackBonus.name + "]", attackBonusStatusTest.bind(this, attackBonus));
            }
            if (attackBonus.hasOwnProperty("foeCondition")) {
                Test.hasNonEmptyArrayProperty(attackBonus, "status", creature.name + " " + attackBonus.name);
                it("foeCondition: Array of String [" + creature.name + " " + attackBonus.name + "]", attackBonusFoeConditionTest.bind(this, attackBonus));
            }
            if (attackBonus.hasOwnProperty("defense")) {
                Test.hasNonEmptyStringProperty(attackBonus, "defense", creature.name + " " + attackBonus.name);
            }
        }
    }).bind(this, creature));
};


Test.toHitRegEx = /^(automatic|(STR)?[/^]?(CON)?[/^]?(DEX)?[/^]?(INT)?[/^]?(WIS)?[/^]?(CHA)?[/^]?[+-]?\d*)$/;

Test.hasValidAttacks = function(creature) {
    Test.hasNonEmptyArrayProperty(creature, "attacks", creature.name);
    describe("attacks: Array of Object of the form", (function(creature) {
        var j, attack, extra, hasMeleeBasic, hasRangedBasic, toHitTest, describeMiss;
        hasMeleeBasic = false;
        hasRangedBasic = false;
        
        toHitTest = function(attack) {
            expect(attack.hasOwnProperty("toHit")).toEqual(true);
            expect(typeof(attack.toHit) === "number" || typeof(attack.toHit) === "string").toEqual(true);
            if (typeof(attack.toHit) === "string") {
                expect(Test.toHitRegEx.test(attack.toHit)).toEqual(true);
            }
        };
        
        describeMiss = function(miss, extra) {
            if (miss.hasOwnProperty("halfDamage")) {
                it("halfDamage: true [" + extra + "]", (function(miss) {
                    expect(miss.halfDamage).toEqual(true);
                }).bind(this, miss));
            }
            if (miss.hasOwnProperty("damage")) {
                Test.hasValidDamage(miss, extra);
            }
            Test.hasValidEffects(miss, false, extra);
        };
        
        for (j = 0; j < creature.attacks.length; j++) {
            attack = creature.attacks[ j ];
            Test.hasNonEmptyStringProperty(attack, "name", creature.name);
            extra = creature.name + " " + attack.name;
            Test.hasNonEmptyObjectProperty(attack, "usage", extra);
            Test.hasObjectProperty(attack, "usage", extra);
            Test.isOneOf(attack.usage, "frequency", [ "At-Will", "Encounter", "Daily", "Recharge" ], extra + " usage");
            if (attack.usage.frequency === DnD.Attack.prototype.USAGE_RECHARGE) {
                if (attack.usage.recharge !== DnD.Attack.prototype.USAGE_RECHARGE_BLOODIED) {
                    Test.hasPositiveNumberProperty(attack.usage, "recharge", "[" + extra + " usage]");
                }
            }
            
            it("toHit: Number | \"{valid expression}\" [" + extra + "]", toHitTest.bind(this, attack));
            
            Test.isOneOf(attack, "defense", [ "AC", "Fort", "Ref", "Will" ], extra);
            
            Test.hasValidDamage(attack, extra);
            
            if (attack.hasOwnProperty("miss")) {
                Test.hasNonEmptyObjectProperty(attack, "miss", extra);
                describe("miss: Object of the form", describeMiss.bind(this, attack.miss, extra));
            }
            
            Test.hasValidEffects(attack, false, extra);
            Test.hasValidKeywords(attack, false, extra);
            
            if (attack.hasOwnProperty("keywords") && attack.keywords.indexOf("basic") !== -1) {
                if (attack.keywords.indexOf("melee") !== -1) {
                    hasMeleeBasic = true;
                }
                else if (attack.keywords.indexOf("ranged") !== -1) {
                    hasRangedBasic = true;
                }
            }
        }
        it("has melee basic attack [" + creature.name + "]", (function(hasMeleeBasic) {
            expect(hasMeleeBasic).toEqual(true); 
        }).bind(this, hasMeleeBasic));
//      it("has ranged basic attack [" + creature.name + "]", (function(hasRangedBasic) {
//          expect(hasRangedBasic).toEqual(true); 
//      }).bind(this, hasRangedBasic);
    }).bind(this, creature));
};


Test.damageRegEx = /^(\d+(d\d+|\[W\]))?([+/^-]?(STR|CON|DEX|INT|WIS|CHA|\d+)?)*$/;

Test.hasValidDamage = function(object, extra) {
    var i;
    if (typeof(object.damage) === "object" && object.damage.constructor === Array) {
        for (i = 0; i < object.damage.length; i++) {
            Test.hasValidDamage({ damage: object.damage[ i ] });
        }
    }
    else if (typeof(object.damage) === "string") {
        Test.hasNonEmptyStringProperty(object, "damage", extra);
        it("damage: \"{valid expression}\" [" + extra + "]", (function(damage) {
            expect(Test.damageRegEx.test(damage)).toEqual(true);
        }).bind(this, object.damage));
    }
    else {
        Test.hasNonEmptyObjectProperty(object, "damage", extra);
        describe("damage: Object of the form", (function(damage, extra) {
            Test.hasNonEmptyStringProperty(damage, "amount", extra);
            it("amount: \"{valid expression}\" [" + extra + "]", (function(damage) {
                expect(Test.damageRegEx.test(damage.amount)).toEqual(true);
            }).bind(this, damage));
            if (damage.hasOwnProperty("type")) {
                Test.hasValidTypes(damage, extra);
            }
        }).bind(this, object.damage, extra));
    }
};

Test.hasValidTypes = function(object, extra) {
    describe("type: \"{valid expression}\" [" + extra + "]", (function(object) {
        var values, damageValues, effectValues, i, p, tmp;
        damageValues = [ "acid", "cold", "fire", "force", "lightning", "necrotic", "poison", "psychic", "radiant", "thunder" ];
        effectValues = damageValues.concat([ "attacks", "savingThrows", "initiative", "AC", "Fort", "Ref", "Will" ]);
        values = object.hasOwnProperty("name") ? effectValues : damageValues;
        if (typeof object.type === "string") {
            Test.isOneOf(object, "type", values, extra);
        }
        else if (object.type && object.type.constructor === Array) {
            Test.hasNonEmptyArrayProperty(object, "type", extra);
            for (i = 0; i < object.type.length; i++) {
                tmp = {};
                p = "type[ " + i + " ]";
                tmp[ p ] = object.type[ i ];
                Test.isOneOf(tmp, p, values, extra + "(actual: " + tmp[ p ] + ")");
            }
        }
    }).bind(this, object));
};


Test.hasValidEffects = function(object, required, extra) {
    if (required || object.hasOwnProperty("effects")) {
        Test.hasNonEmptyArrayProperty(object, "effects", extra);
        describe("effects: Array of String or Object of the form", function() {
            var i, effect, fn;
            fn = function(e) {
                expect(Test.damageRegEx.test(e.amount)).toEqual(true);
            };
            for (i = 0; i < object.effects.length; i++) {
                effect = object.effects[ i ];
                if (typeof(effect) === "string") {
                    Test.nonEmptyString(effect);
                }
                else {
                    Test.hasNonEmptyStringProperty(effect, "name", extra);
                    if (effect.hasOwnProperty("amount")) {
                        if (typeof(effect.amount) === "string") {
                            it("amount: \"{valid expression}\" [" + extra + "]", fn.bind(this, effect));
                        }
                        else {
                            Test.hasNumberProperty(effect, "amount", extra);
                        }
                    }
                    if (effect.hasOwnProperty("duration")) {
                        Test.isOneOf(effect, "duration", [ "startTargetNext", "endTargetNext", "startAttackerNext", "endAttackerNext" ], extra);
                    }
                    if (effect.hasOwnProperty("saveEnds")) {
                        Test.hasBooleanProperty(effect, "saveEnds", extra);
                    }
                    if (effect.hasOwnProperty("type")) {
                        Test.hasValidTypes(effect, extra);
                    }
                }
            }
        });
    }
};


Test.hasValidKeywords = function(object, required, extra) {
    if (required || object.hasOwnProperty("keywords")) {
        Test.hasNonEmptyArrayProperty(object, "keywords", extra);
        it("keywords: Array of String [" + extra + "]", (function(keywords) {
            var i;
            for (i = 0; i < keywords.length; i++) {
                expect(typeof(keywords[ i ])).toBe("string");
                expect(keywords[ i ].length).not.toEqual(0);
            }
        }).bind(this, object.keywords));
    }
};


Test.isValidCreature = function(creature, isPC) {
    it("value is a Creature definition [" + (typeof(creature) === "object" ? creature.name : typeof(creature)) + "]", (function(creature) {
        expect(typeof(creature)).toEqual("object");
    }).bind(this, creature));
    
    describe("value is a Creature definition that has", (function(creature, isPC) {
        var implmnts = "implements"; // NOTE: avoids JSHint warning to express as dot Object property access and using implements keyword

        if (isPC) {
            it("isPC: true | false [" + creature.name + "]", (function(creature) {
                expect(creature.hasOwnProperty("isPC")).toEqual(true);
                expect(creature.isPC).toEqual(true);
            }).bind(this, creature));
        }
        
        Test.hasMinMaxNumberProperty(creature, "level", 1, 30, creature.name);
        Test.hasNonEmptyStringProperty(creature, "image", creature.name);
        
        Test.hasObjectProperty(creature, "abilities", creature.name);
        describe("abilities: Object of the form", (function(creature) {
            var abilities, a;
            abilities = { STR: 10, DEX: 10, CON: 10, INT: 10, WIS: 10, CHA: 10 };
            for (a in abilities) {
                Test.hasPositiveNumberProperty(creature.abilities, a, creature.name);
            }
        }).bind(this, creature));
        
        Test.hasObjectProperty(creature, "skills", creature.name);
        describe("skills: Object of the form", (function(creature) {
            var skills, s;
            skills = { acrobatics: 0, arcana: 0, athletics: 0, bluff: 0, diplomacy: 0, dungeoneering: 0, endurance: 0, heal: 0, history: 0, insight: 0, intimidate: 0, nature: 0, perception: 0, religion: 0, stealth: 0, streetwise: 0, thievery: 0 };
            for (s in skills) {
                Test.hasNumberProperty(creature.skills, s, creature.name);
            }
        }).bind(this, creature));
        
        Test.hasObjectProperty(creature, "hp", creature.name);
        describe("hp: Object of the form", (function(creature) {
            Test.hasPositiveNumberProperty(creature.hp, "total", creature.name);
        }).bind(this, creature));
        
        if (isPC) {
            Test.hasObjectProperty(creature, "surges", creature.name);
            describe("surges: Object of the form", (function(creature) {
                Test.hasNumberProperty(creature.surges, "perDay", creature.name);
                Test.hasNumberProperty(creature.surges, "current", creature.name);
            }).bind(this, creature));
        }
        
        Test.hasObjectProperty(creature, "defenses", creature.name);
        describe("defenses: Object of the form", (function(creature) {
            Test.hasPositiveNumberProperty(creature.defenses, "ac", creature.name);
            Test.hasPositiveNumberProperty(creature.defenses, "fort", creature.name);
            Test.hasPositiveNumberProperty(creature.defenses, "ref", creature.name);
            Test.hasPositiveNumberProperty(creature.defenses, "will", creature.name);
        }).bind(this, creature));
        
        if (creature.hasOwnProperty("resistances")) {
            Test.hasObjectProperty(creature, "resistances", creature.name);
            describe("resistances: Object of the form", (function(creature) {
                var j;
                for (j in creature.resistances) {
                    Test.hasPositiveNumberProperty(creature.resistances, j, creature.name);
                }
            }).bind(this, creature));
        }
        
        Test.hasNumberProperty(creature, "init", creature.name);
        Test.hasValidSpeed(creature, creature.name);
        
        if (creature.hasOwnProperty("weapons")) {
            Test.hasArrayProperty(creature, "weapons", creature.name);
            if (creature.weapons && creature.weapons.length) {
                describe("weapons: Array of Object of the form", (function(creature) {
                    var j, weapon;
                    for (j = 0; j < creature.weapons.length; j++) {
                        weapon = creature.weapons[ j ];
                        Test.hasNonEmptyStringProperty(weapon, "name", creature.name);
                        Test.hasBooleanProperty(weapon, "isMelee", creature.name + " " + weapon.name);
                        Test.hasNumberProperty(weapon, "proficiency", creature.name + " " + weapon.name);
                        Test.hasNumberProperty(weapon, "enhancement", creature.name + " " + weapon.name);
                        Test.hasObjectProperty(weapon, "damage", creature.name + " " + weapon.name);
                        Test.hasNonEmptyStringProperty(weapon.damage, "amount", creature.name + " " + weapon.name);
                        Test.hasNonEmptyStringProperty(weapon.damage, "crit", creature.name + " " + weapon.name);
                    }
                }).bind(this, creature));
            }
        }
        
        if (creature.hasOwnProperty("implements")) {
            Test.hasArrayProperty(creature, "implements", creature.name);
            if (creature[ implmnts ] && creature[ implmnts ].length) {
                describe("implements: Array of Object of the form", (function(creature) {
                    var j, implement;
                    for (j = 0; j < creature[ implmnts ].length; j++) {
                        implement = creature[ implmnts ][ j ];
                        Test.hasNonEmptyStringProperty(implement, "name", creature.name);
                        Test.hasNumberProperty(implement, "enhancement", creature.name + " " + implement.name);
                        Test.hasNonEmptyStringProperty(implement, "crit", creature.name + " " + implement.name);
                    }
                }).bind(this, creature));
            }
        }
        
        if (creature.hasOwnProperty("attackBonuses")) {
            Test.hasArrayProperty(creature, "attackBonuses", creature.name);
            if (creature.attackBonuses && creature.attackBonuses.length) {
                Test.hasValidAttackBonuses(creature);
            }
        }
        
        Test.hasValidAttacks(creature);
        
        // TODO: attack target tests
    }).bind(this, creature, isPC));
};


Test.isValidCreatureMap = function(map, isPC) {
    it("a syntactically valid JSON Object", function() {
        expect(typeof(map)).toEqual("object");
    });
    
    Test.nonEmptyObject(map, "the JSON Object");
    
    describe("an Object where each property", (function(map, isPC) {
        var describeCreature, keys, i;
        
        describeCreature = function(map, key, isPC) {
            var member = map[ key ];
            
            Test.nonEmptyString(key, "key [" + key + "]");

            it("key is the corresponding Creature definition's name [" + key + "]", (function(member) {
                expect(member.hasOwnProperty("name")).toEqual(true);
                expect(member.name).toEqual(key);
            }).bind(this, member));
            
            if (isPC) {
                describe("value is a Creature definition that has", (function(member, isPC) {
                    it("isPC: " + isPC + " [" + member.name + "]", (function(member, isPC) {
                        expect(member.hasOwnProperty("isPC")).toEqual(true);
                        expect(member.isPC).toEqual(isPC);
                    }).bind(this, member, isPC));
                }).bind(this, member, isPC));
            }
            
            Test.isValidCreature(member, isPC);
        };
        
        keys = Object.keys(map);
        for (i = 0; i < keys.length; i++) {
            describe("[" + keys[ i ] + "]", describeCreature.bind(this, map, keys[ i ], isPC));
        }
    }).bind(this, map, isPC));
};