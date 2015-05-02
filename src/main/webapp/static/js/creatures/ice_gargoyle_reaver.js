/**
 * Created by nblumberg on 11/16/14.
 */

(function (DnD) {
    "use strict";
    DnD.define(
        "creatures.monsters.ice_gargoyle_reaver",
        [ "jQuery", "Creature" ],
        function(jQuery, Creature) {
            var o = {
                name: "Ice Gargoyle Reaver", level: 15, image: "../images/portraits/ice_gargoyle_reaver.png",
                hp: { total: 116 },
                defenses: { ac: 29, fort: 28, ref: 27, will: 26 },
                vulnerabilities: { "fire": 0 }, // TODO: grants combat advantage endAttackerNext
                resistances: { "cold": 15 },
                immunities: [ "slow" ],
                init: 17, speed: { walk: 6, fly: 8 },
                abilities: { STR: 25, CON: 22, DEX: 24, INT: 5, WIS: 17, CHA: 20 },
                skills: { acrobatics: 0, arcana: 0, athletics: 0, bluff: 0, diplomacy: 0, dungeoneering: 0, endurance: 0, heal: 0, history: 0, insight: 0, intimidate: 0, nature: 0, perception: 17, religion: 0, stealth: 19, streetwise: 0, thievery: 0 },
                healing: [
                    { name: "Bloodchill Bite", frequency: "At-Will", isTempHP: false, usesHealingSurge: false, amount: "5" },
                    { name: "Ice Prison", frequency: "At-Will", isTempHP: true, usesHealingSurge: false, amount: "5" }
                ],
                attacks: [
                    { name: "Claw", usage: { frequency: "At-Will" }, target: { range: 2 }, range: "melee", toHit: 20, defense: "AC", damage: { amount: "1d8+6", type: "cold" }, effects: [ { name: "ongoing damage", type: "cold", amount: 5, saveEnds: true } ], keywords: [ "melee", "basic", "cold" ] },
                    { name: "Flying Grab", usage: { frequency: "Recharge", recharge: 1 /* recharges after using Ice Prison */ }, target: { range: 2 }, range: "melee", toHit: 20, defense: "AC", damage: { amount: "1d8+6", type: "cold" }, effects: [ { name: "ongoing damage", type: "cold", amount: 5, saveEnds: true }, { name: "grabbed" } ], keywords: [ "melee", "basic", "cold" ] },
                    // TODO: Bloodchill Bite heals it 5
                    { name: "Bloodchill Bite", usage: { frequency: "Recharge", recharge: 5 }, range: "melee", toHit: 20, defense: "AC", damage: [ { amount: "2d6+5", type: "cold" } ], effects: [ { name: "vulnerable", type: "cold", amount: 5 } ], keywords: [ "melee", "cold" ] },
                    { name: "Bloodchill Bite (weakened)", usage: { frequency: "Recharge", recharge: 5 }, range: "melee", toHit: 20, defense: "AC", damage: [ { amount: "3d6+5", type: "cold" } ], effects: [ { name: "vulnerable", type: "cold", amount: 5 } ], keywords: [ "melee", "cold" ] },
                    { name: "Freezing Gaze", usage: { frequency: "At-Will" }, target: { area: "aura", range: 2 }, toHit: "automatic", defense: "AC", damage: { amount: "5", type: "cold" }, keywords: [ "aura", "cold" ] },
                    // TODO: each round it resist 20 all, heals 5, can only take a minor action to end Ice Prison
                    {
                        name: "Ice Prison",
                        usage: { frequency: "At-Will" },
                        toHit: "automatic", defense: "AC",
                        damage: "0",
                        effects: [
                            { name: "multiple", saveEnds: true, children: [
                                { name: "grabbed" },
                                { name: "stunned" },
                                { name: "restrained" },
                                { name: "ongoing damage", type: "cold", amount: 20 }
                            ],
                                afterEffects: [
                                    { name: "multiple", duration: "endAttackerNext", children: [
                                        { name: "slowed" },
                                        { name: "weakened" }
                                    ]
                                    }
                                ]
                            }
                        ],
                        keywords: [ "cold" ]
                    }
                ]
            };
            return jQuery.extend(true, {}, Creature.base, o);
        },
        false
    );
})(window.DnD);