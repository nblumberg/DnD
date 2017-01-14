/**
 * Created by nblumberg on 4/13/15.
 */

(function createHelpersIIFE() {
    "use strict";

    DnD.define(
        "creature.helpers",
        [ "html", "jQuery" ],
        function createHelpersFactory(descriptions, jQuery) {
            var helpers;

            function addToArrayProperty(property, args) { // takes an arbitrary number of arguments
                var i, item;
                if (!this.hasOwnProperty(property)) {
                    this[ property ] = [];
                }
                for (i = 0; i < args.length; i++) {
                    item = args[ i ];
                    if (this[ property ].indexOf(item) === -1) {
                        this[ property ].push(item);
                    }
                }
                return this;
            }

            function Property(params) {
                params = params || {};
                if (typeof params === "string") {
                    this.name = params;
                    return this;
                }
                jQuery.extend(true, this, params);
                return this;
            }

            function Power(params) {
                params = Property.call(this, params);
                if (!params.description && params.name) {
                    params.description = descriptions[ params.name ];
                }
            }

            Power.attack = function attack(nameOrDuplicate, overrideName) {
                var power = new Power(nameOrDuplicate);
                if (overrideName) {
                    power.name = overrideName;
                }
                return power;
            };
            Power.buff = function buff(nameOrDuplicate, overrideName) {
                var power = new Power(nameOrDuplicate);
                if (overrideName) {
                    power.name = overrideName;
                }
                return power;
            };

            Power.prototype = {
                frequency: function frequency(f) {
                    if (f) {
                        if (!this.usage) {
                            this.usage = {};
                        }
                        this.usage.frequency = f;
                    }
                    return this;
                },
                action: function action(a) {
                    if (!this.usage) {
                        this.usage = {};
                    }
                    this.usage.action = a;
                    return this;
                },
                addKeywords: function addKeywords() { // takes an arbitrary number of arguments
                    return addToArrayProperty.call(this, "keywords", arguments);
                },
                area: function area(area, size, range, enemiesOnly) {
                    this.isMelee = false;
                    if (!this.target) {
                        this.target = {};
                    }
                    this.target.area = area;
                    if (size) {
                        this.target.size = size;
                    }
                    if (range) {
                        this.target.range = range;
                    }
                    if (enemiesOnly) {
                        this.target.enemiesOnly = true;
                    }
                    return this.addKeywords(area);
                },

                atWill: function atWill() {
                    return this.frequency("At-Will");
                },
                encounter: function encounter(perEncounter) {
                    this.frequency("Encounter");
                    if (perEncounter) {
                        this.usage.perEncounter = perEncounter;
                    }
                    return this;
                },
                daily: function daily() {
                    return this.frequency("Daily");
                },
                recharge: function recharge(recharge) {
                    this.frequency("Recharge");
                    if (recharge) {
                        this.usage.recharge = recharge;
                    }
                    return this;
                },

                free: function free() {
                    return this.action("Free");
                },
                immediateInterrupt: function immediateInterrupt() {
                    return this.action("Immediate Interrupt");
                },
                immediateReaction: function immediateReaction() {
                    return this.action("Immediate Reaction");
                },
                minor: function minor() {
                    return this.action("Minor");
                },
                move: function move() {
                    return this.action("Move");
                },
                noAction: function noAction() {
                    return this.action("No Action");
                },

                melee: function melee() {
                    this.isMelee = true;
                    this.range = "melee";
                    return this.addKeywords("melee");
                },
                ranged: function ranged(shortRange, longRange) {
                    this.isMelee = false;
                    if (shortRange || longRange) {
                        if (!this.target) {
                            this.target = {};
                        }
                        this.target.range = shortRange;
                        this.target.longRange = longRange;
                    }
                    return this.addKeywords("ranged");
                },
                closeBurst: function closeBurst(size, enemiesOnly) {
                    return this.area("close burst", size, 0, enemiesOnly);
                },
                blast: function blast(size, enemiesOnly) {
                    return this.area("blast", size, 0, enemiesOnly);
                },
                burst: function burst(size, range, enemiesOnly) {
                    return this.area("burst", size, range, enemiesOnly);
                },
                wall: function wall(size, range, enemiesOnly) {
                    return this.area("wall", size, range, enemiesOnly);
                },

                defense: function defense(defense, dc) {
                    this.defense = defense;
                    this.toHit = dc;
                    return this;
                },
                automatic: function automatic() {
                    return this.defense("AC", "automatic");
                },
                ac: function ac(dc) {
                    return this.defense("AC", dc);
                },
                fort: function ac(dc) {
                    return this.defense("Fort", dc);
                },
                ref: function ref(dc) {
                    return this.defense("Ref", dc);
                },
                will: function will(dc) {
                    return this.defense("Will", dc);
                },

                addDamage: function addDamage() { // takes an arbitrary number of arguments
                    return addToArrayProperty.call(this, "damage", arguments);
                },
                addEffects: function addEffects() { // takes an arbitrary number of arguments
                    return addToArrayProperty.call(this, "effects", arguments);
                }
            };

            function Damage(params) {
                this.amount = "0";
                Property.call(this, params);
            }

            Damage.untyped = function untyped(amount) {
                return new Damage().setAmount(amount);
            };

            Damage.prototype = {
                addTypes: function addTypes() { // takes an arbitrary number of arguments
                    if (typeof this.type === "string") {
                        this.type = [ this.type ];
                    }
                    return addToArrayProperty.call(this, "type", arguments);
                },
                setAmount: function setAmount(amount) {
                    if (amount) {
                        this.amount = amount;
                    }
                    return this;
                }
            };

            (function damageTypesIIFE(types) {
                types.forEach(function forEachType(type) {
                    Damage.prototype[ type ] = function damageSetAmountByType(amount) {
                        this.addTypes(type);
                        return this.setAmount(amount);
                    };

                    Damage[ type ] = function DamageConstructorByType(amount) {
                        return new Damage()[ type ](amount);
                    };
                });
            })([ "acid", "cold", "fire", "lightning", "necrotic", "poison", "psychic", "radiant", "thunder" ]);


            function Effect(params) {
                Property.call(this, params);
            }

            Effect.multiple = function multiple(children) {
                var effect = new Effect("multiple");
                if (children) {
                    return addToArrayProperty.call(effect, "children", children);
                }
                return effect;
            };

            Effect.prototype = {
                addAfterEffects: function addAfterEffects() { // takes an arbitrary number of arguments
                    return addToArrayProperty.call(this, "afterEffects", arguments);
                },
                addChildren: function addChildren() { // takes an arbitrary number of arguments
                    this.name = "multiple";
                    return addToArrayProperty.call(this, "children", arguments);
                },
                addFailedEffects: function addFailedEffects() { // takes an arbitrary number of arguments
                    return addToArrayProperty.call(this, "failedEffects", arguments);
                },
                duration: function duration(duration) {
                    this.duration = duration;
                    return this;
                },
                endAttackerNext: function endAttackerNext() {
                    this.duration = "endAttackerNext";
                    return this;
                },
                endTargetNext: function endTargetNext() {
                    this.duration = "endTargetNext";
                    return this;
                },
                saveEnds: function saveEnds(b) {
                    this.saveEnds = b !== false;
                    return this;
                },
                startAttackerNext: function startAttackerNext() {
                    this.duration = "startAttackerNext";
                    return this;
                },
                startTargetNext: function startTargetNext() {
                    this.duration = "startTargetNext";
                    return this;
                }
            };

            (function effectConditionsIIFE(conditions) {
                conditions.forEach(function forEachCondition(condition) {
                    Effect.prototype[ condition ] = function effectSetCondition() {
                        this.name = condition;
                        return this;
                    };

                    Effect[ condition ] = function EffectConstructorByCondition() {
                        return new Effect(condition);
                    };
                });
            })([
                "blinded",
                "dazed",
                "deafened",
                "diseased",
                "dominated",
                "dying",
                "dead",
                "grabbed",
                "helpless",
                "immobilized",
                "marked",
                "petrified",
                "prone",
                "restrained",
                "slowed",
                "stunned",
                "unconscious",
                "weakened"
            ]);
            (function effectAmountsIIFE(amountType) {
                amountType.forEach(function forEachAmount(amountType) {
                    Effect.prototype[ amountType ] = function effectSetAmount(numeralAmount, type) {
                        this.name = amountType;
                        this.amount = numeralAmount;
                        this.type = type;
                        return this;
                    };

                    Effect[ amountType ] = function EffectConstructorByAmount(numeralAmount, type) {
                        var effect = new Effect();
                        effect[ amountType ](numeralAmount, type);
                        return effect;
                    };
                });
            })([
                "bonus",
                "ongoing",
                "penalty",
                "resistance",
                "vulnerable"
            ]);


            helpers = {
                mod: function mod(ability) {
                    return window.Math.floor((ability - 10) / 2);
                },
                skill: function skill(name, level, abilities, extra) {
                    switch(name) {
                        case "acrobatics":
                        case "stealth":
                        case "thievery": {
                            return helpers.mod(abilities.DEX) + window.Math.floor(level / 2) + extra;
                        } break;

                        case "arcana":
                        case "dungeoneering":
                        case "history":
                        case "religion": {
                            return helpers.mod(abilities.INT) + window.Math.floor(level / 2) + extra;
                        } break;

                        case "athletics": {
                            return helpers.mod(abilities.STR) + window.Math.floor(level / 2) + extra;
                        } break;

                        case "bluff":
                        case "intimidate":
                        case "streetwise": {
                            return helpers.mod(abilities.CHA) + window.Math.floor(level / 2) + extra;
                        } break;

                        case "diplomacy":
                        case "heal":
                        case "insight":
                        case "nature":
                        case "perception": {
                            return helpers.mod(abilities.WIS) + window.Math.floor(level / 2) + extra;
                        } break;

                        case "endurance": {
                            return helpers.mod(abilities.CON) + window.Math.floor(level / 2) + extra;
                        } break;
                    }
                },
                skills: function skills(baseCreature, extra) {
                    var o, skills, i, name;
                    o = {};
                    skills = [ "acrobatics", "arcana", "athletics", "bluff", "diplomacy", "dungeoneering", "endurance", "heal", "history", "insight", "intimidate", "nature", "perception", "religion", "stealth", "streetwise", "thievery" ];
                    for (i = 0; i < skills.length; i++) {
                        name = skills[ i ];
                        o[ name ] = helpers.skill(name, baseCreature.level, baseCreature.abilities, extra[ name ] || 0);
                    }
                    return o;
                },
                tier: function tier(partyLevel) {
                    return 1 + Math.floor((partyLevel - 1) / 10);
                },
                Damage: Damage,
                Effect: Effect,
                Power: Power,
                meleeBasic: new Power({
                    name: "Melee Basic",
                    toHit: "STR",
                    defense: "AC",
                    damage: "1[W]+STR",
                    keywords: [
                        "weapon", "basic"
                    ]
                }).atWill().melee(),
                rangedBasic: new Power({
                    name: "Ranged Basic",
                    toHit: "DEX",
                    defense: "AC",
                    damage: "1[W]+DEX",
                    keywords: [
                        "weapon", "basic"
                    ]
                }).atWill().ranged()
            };

            return helpers;
        },
        false
    );

})();