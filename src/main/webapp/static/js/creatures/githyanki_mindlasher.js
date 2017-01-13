/**
 * Created by nblumberg on 11/16/14.
 */

(function (DnD) {
    "use strict";
    DnD.define(
        "creatures.monsters.githyanki_mindlasher",
        [ "jQuery", "Creature" ],
        function(jQuery, Creature) {
            var o = {
                name: "Githyanki Mindlasher", level: 18, image: "../images/portraits/githyanki_mindslicer.jpg", // http://cdn.obsidianportal.com/images/121677/githyanki_2_2.jpg
                hp: { total: 132 },
                defenses: { ac: 30, fort: 29, ref: 33, will: 29 },
                init: 16, speed: { walk: 8, jump: 5 },
                abilities: { STR: 22, CON: 18, DEX: 25, INT: 20, WIS: 22, CHA: 14 },
                skills: { acrobatics: 0, arcana: 0, athletics: 0, bluff: 0, diplomacy: 0, dungeoneering: 0, endurance: 0, heal: 0, history: 11, insight: 12, intimidate: 0, nature: 0, perception: 20, religion: 0, stealth: 0, streetwise: 0, thievery: 0 },
                attacks: [
                    { name: "Silver Longsword", usage: { frequency: "At-Will" }, range: "melee", toHit: 25, defense: "AC", damage: [ { amount: "2d8+4", type: "psychic" } ], keywords: [ "melee", "psychic", "basic" ] },
                    { name: "Mind Crush", usage: { frequency: "Recharge", recharge: 5 }, target: { range: 20, area: "burst", size: 2 },
                        toHit: 23,
                        defense: "Will",
                        damage: "1d10",
                        effects: [
                            {
                                name: "ongoing damage",
                                amount: 5,
                                type: "psychic",
                                saveEnds: true, afterEffects: [
                                    {
                                        name: "multiple",
                                        children: [
                                            { name: "vulnerable", amount: "10", type: "psychic" },
                                            { name: "only basic attacks" }
                                        ],
                                        saveEnds: true
                                    }
                                ]
                            }
                        ],
                        keywords: [ "ranged", "psychic" ]
                    },
                    { name: "Psychic Slam", usage: { frequency: "At-Will" }, target: { area: "burst", size: 2, range: 10 }, toHit: 23, defense: "Will", damage: { amount: "2d8", type: "psychic" }, effects: [
                        "Prone"
                    ], keywords: [ "ranged", "psychic" ] }
                ]
            };
            return jQuery.extend(true, {}, Creature.base, o);
        },
        false
    );
})(window.DnD);