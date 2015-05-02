/**
 * Created by nblumberg on 11/16/14.
 */

(function (DnD) {
    "use strict";
    DnD.define(
        "creatures.monsters.ice_gargoyle",
        [ "jQuery", "Creature" ],
        function(jQuery, Creature) {
            var o = {
                name: "Ice Gargoyle", level: 12, image: "../images/portraits/ice_gargoyle.png",
                hp: { total: 96 },
                defenses: { ac: 26, fort: 25, ref: 23, will: 23 },
                vulnerabilities: { "fire": 0 }, // TODO: dazed until the end of the attacker's next turn
                resistances: { "cold": 15 },
                immunities: [ "slow" ],
                init: 14, speed: { walk: 6, fly: 8 },
                abilities: { STR: 24, CON: 20, DEX: 23, INT: 5, WIS: 10, CHA: 17 },
                skills: { acrobatics: 0, arcana: 0, athletics: 0, bluff: 0, diplomacy: 0, dungeoneering: 0, endurance: 0, heal: 0, history: 0, insight: 0, intimidate: 0, nature: 0, perception: 15, religion: 0, stealth: 18, streetwise: 0, thievery: 0 },
                attacks: [
                    { name: "Claw", usage: { frequency: "At-Will" }, range: "melee", toHit: 17, defense: "AC", damage: [ "1d6+5", { amount: "1d6+4", type: "cold" } ], keywords: [ "melee", "basic", "cold" ] },
                    { name: "Flying Grab", usage: { frequency: "Recharge", recharge: 1 /* recharges after using Ice Prison */ }, range: "melee", toHit: 17, defense: "AC", damage: [ "1d6+5", { amount: "1d6+4", type: "cold" } ], effects: [ { name: "grabbed" } ], keywords: [ "melee", "cold" ] },
                    // TODO: each round it resist 20 all, heals 5, can only take a minor action to end Ice Prison
                    {
                        name: "Ice Prison",
                        usage: { frequency: "At-Will" },
                        toHit: "automatic", defense: "AC",
                        damage: "0",
                        effects: [
                            {
                                name: "multiple", saveEnds: true, children: [
                                { name: "grabbed" },
                                { name: "stunned" },
                                { name: "restrained" },
                                { name: "ongoing damage", type: "cold", amount: 20 }
                            ],
                                afterEffects: [ { name: "slowed", duration: "endAttackerNext" } ]
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