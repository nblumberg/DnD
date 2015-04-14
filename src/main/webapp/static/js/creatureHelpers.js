/**
 * Created by nblumberg on 4/13/15.
 */

(function () {
    "use strict";

    DnD.define(
        "creature.helpers",
        [],
        function() {
            var helpers = {
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
                }
            };
            return helpers;
        },
        false
    );

})();