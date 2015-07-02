/**
 * Created by nblumberg on 4/13/15.
 */

(function () {
    "use strict";

    DnD.define(
        "creature.helpers",
        [ "descriptions" ],
        function(descriptions) {
            var helpers, proto;

            proto = {
                frequency: function frequency(f) {
                    if (f) {
                        if (!this.usage) {
                            this.usage = {};
                        }
                        this.usage.frequency = f;
                    }
                    return this;
                },
                addKeyword: function(keyword) {
                    if (!this.keywords) {
                        this.keywords = [];
                    }
                    if (this.keywords.indexOf(keyword) === -1) {
                        this.keywords.push(keyword);
                    }
                    return this;
                },
                action: function(a) {
                    if (!this.usage) {
                        this.usage = {};
                    }
                    this.usage.action = a;
                    return this;
                },

                atWill: function atWill() {
                    return this.frequency("At-Will");
                },
                encounter: function encounter() {
                    return this.frequency("Encounter");
                },
                daily: function daily() {
                    return this.frequency("Daily");
                },
                melee: function melee() {
                    this.isMelee = true;
                    this.range = "melee";
                    return this.addKeyword("melee");
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

                ranged: function ranged(shortRange, longRange) {
                    this.isMelee = false;
                    if (shortRange || longRange) {
                        if (!this.target) {
                            this.target = {};
                        }
                        this.target.range = shortRange;
                        this.target.longRange = longRange;
                    }
                    return this.addKeyword("ranged");
                },
                closeBurst: function closeBurst(size, enemiesOnly) {
                    this.isMelee = false;
                    if (!this.target) {
                        this.target = {};
                    }
                    this.target.area = "close burst";
                    if (size) {
                        this.target.size = size;
                    }
                    if (enemiesOnly) {
                        this.target.enemiesOnly = true;
                    }
                    return this.addKeyword("close burst");
                },
                blast: function blast(size, enemiesOnly) {
                    this.isMelee = false;
                    if (!this.target) {
                        this.target = {};
                    }
                    this.target.area = "blast";
                    if (size) {
                        this.target.size = size;
                    }
                    if (enemiesOnly) {
                        this.target.enemiesOnly = true;
                    }
                    return this.addKeyword("blast");
                },
                burst: function burst(size, range, enemiesOnly) {
                    this.isMelee = false;
                    if (!this.target) {
                        this.target = {};
                    }
                    this.target.area = "burst";
                    if (size) {
                        this.target.size = size;
                    }
                    if (range) {
                        this.target.range = range;
                    }
                    if (enemiesOnly) {
                        this.target.enemiesOnly = true;
                    }
                    return this.addKeyword("burst");
                }
            };

            function Power(params) {
                var p = null;
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
            Power.prototype = proto;


            helpers = {
                mod: function(ability) {
                    return window.Math.floor((ability - 10) / 2);
                },
                skill: function(name, level, abilities, extra) {
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
                skills: function(baseCreature, extra) {
                    var o, skills, i, name;
                    o = {};
                    skills = [ "acrobatics", "arcana", "athletics", "bluff", "diplomacy", "dungeoneering", "endurance", "heal", "history", "insight", "intimidate", "nature", "perception", "religion", "stealth", "streetwise", "thievery" ];
                    for (i = 0; i < skills.length; i++) {
                        name = skills[ i ];
                        o[ name ] = helpers.skill(name, baseCreature.level, baseCreature.abilities, extra[ name ] || 0);
                    }
                    return o;
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