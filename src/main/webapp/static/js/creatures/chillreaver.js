/**
 * Created by nblumberg on 11/16/14.
 */

(function (DnD) {
    "use strict";
    DnD.define(
        "creatures.monsters.chillreaver",
        [ "jQuery", "Creature" ],
        function(jQuery, Creature) {
            var o = {
                name: "Chillreaver", level: 17, image: "../images/portraits/chillreaver.png",
                    hp: { total: 845 },
                defenses: { ac: 33, fort: 31, ref: 29, will: 29 },
                resistances: { cold: 25, poison: 10 },
                savingThrows: 5,
                    actionPoints: 2,
                    init: 13, speed: { walk: 8, fly: 8 },
                abilities: { STR: 16, CON: 23, DEX: 20, INT: 5, WIS: 20, CHA: 12 },
                skills: { acrobatics: 0, arcana: 15, athletics: 24, bluff: 0, diplomacy: 0, dungeoneering: 0, endurance: 0, heal: 0, history: 0, insight: 0, intimidate: 0, nature: 0, perception: 17, religion: 0, stealth: 0, streetwise: 0, thievery: 0 },
                attacks: [
                    { name: "Bite", usage: { frequency: "At-Will" }, target: { range: 3 }, toHit: 23, defense: "AC", damage: [ "2d6+7", { amount: "2d6", type: "cold" } ], keywords: [ "melee", "basic", "cold" ] },
                    { name: "Claw", usage: { frequency: "At-Will" }, target: { range: 3 }, toHit: 23, defense: "AC", damage: "2d4+7", keywords: [ "melee", "basic" ] },
                    {
                        name: "Deep Freeze",
                        usage: { frequency: "Recharge", recharge: 6 }, target: { range: 10 },
                        toHit: 22, defense: "Fort",
                        damage: { amount: "2d6+7", type: "cold" },
                        effects: [
                            { name: "multiple", saveEnds: true, children: [
                                { name: "ongoing damage", type: "cold", amount: 10 },
                                { name: "immobilized" },
                                { name: "dazed" }
                            ],
                                afterEffects: [ { name: "slowed", duration: "endAttackerNext" } ]
                            }
                        ],
                        keywords: [ "ranged", "cold" ]
                    },
                    {
                        name: "Breath Weapon",
                        usage: { frequency: "Recharge", recharge: 6 }, target: { area: "close blast", size: 5 },
                        toHit: 21, defense: "Ref",
                        damage: { amount: "6d6+7", type: "cold" },
                        effects: [
                            { name: "multiple", saveEnds: true, children: [
                                { name: "immobilized" },
                                { name: "dazed" }
                            ],
                                afterEffects: [ { name: "slowed", duration: "endAttackerNext" } ]
                            }
                        ],
                        keywords: [ "ranged", "cold", "breath", "close blast" ]
                    },
                    {
                        name: "Frightful Presence",
                        usage: { frequency: "Encounter" }, target: { area: "close burst", size: 10, enemiesOnly: true },
                        toHit: 21, defense: "Will",
                        damage: "0",
                        effects: [
                            {
                                name: "stunned",
                                duration: "endAttackerNext",
                                afterEffects: [ { name: "penalty", type: "attacks", amount: -2, saveEnds: true } ]
                            }
                        ],
                        keywords: [ "ranged", "fear", "close burst" ]
                    }
                ]
            };
            return jQuery.extend(true, {}, Creature.base, o);
        },
        false
    );
})(window.DnD);