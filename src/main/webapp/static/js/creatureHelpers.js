/**
 * Created by nblumberg on 4/13/15.
 */

(function createHelpersIIFE() {
    "use strict";

    DnD.define(
        "creature.helpers",
        [ "html" ],
        function createHelpersFactory(descriptions) {
            var helpers;

            function Power(params) {
                var p;
                params = params || {};
                if (!params.description && params.name) {
                    params.description = descriptions[ params.name ];
                }
                for (p in params) {
                    if (params.hasOwnProperty(p)) {
                        this[ p ] = params[ p ];
                    }
                }
            }

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
                    var i, keyword;
                    if (!this.keywords) {
                        this.keywords = [];
                    }
                    for (i = 0; i < arguments.length; i++) {
                        keyword = arguments[ i ];
                        if (this.keywords.indexOf(keyword) === -1) {
                            this.keywords.push(keyword);
                        }
                    }
                    return this;
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
                }
            };

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