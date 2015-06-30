/**
 * Created by nblumberg on 6/30/15.
 */

(function () {
    "use strict";

    DnD.define(
        "creatures.monsters.oni_spiritmaster",
        [ "jQuery", "Creature" ],
        function(jQuery, Creature) {
            var o = {
                name: "Oni Spiritmaster", level: 14, image: "../images/portraits/oni_spiritmaster.jpg",
                hp: { total: 142 },
                defenses: { ac: 26, fort: 27, ref: 26, will: 26 },
                savingThrows: 2,
                init: 12, speed: { walk: 7, fly: 8 },
                actionPoints: 1,
                abilities: { STR: 18, CON: 22, DEX: 20, INT: 19, WIS: 14, CHA: 21 },
                skills: { bluff: 17, insight: 14, religion: 14, perception: 14 },
                attacks: [
                    { name: "Claw", usage: { frequency: "At-Will" }, range: "melee", toHit: 21, defense: "AC", damage: "2d8+4", keywords: [ "melee", "basic" ] },
                    { name: "Dread Fear", usage: { frequency: "Encounter" }, target: { range: 20 }, toHit: 19, defense: "Will", damage: { amount: "3d6+5", type: "necrotic" }, effects: [ { name: "penalty", amount: 2, type: "attacks", saveEnds: true } ], keywords: [ "ranged", "fear", "necrotic" ] },
                    { name: "Harassing Spirits", usage: { frequency: "Encounter" }, target: { range: 20 }, toHit: 19, defense: "Ref", damage: { amount: "3d10+5", type: "necrotic" }, effects: [ { name: "multiple", children: [ { name: "Dazed" }, { name: "ongoing damage", amount: 10, type: "psychic" } ], saveEnds: true } ], keywords: [ "ranged", "psychic", "necrotic" ] },
                    { name: "Howling Blast", usage: { frequency: "Encounter" }, target: { area: "blast", size: 5, enemiesOnly: true }, toHit: 17, defense: "Will", damage: { amount: "2d8+6", type: "psychic" }, effects: [ "Prone" ], keywords: [ "blast", "psychic", "fear" ] }
                ],
                buffs: [
                    { name: "Spirit Form", usage: { frequency: "Encounter" }, effects: [ { name: "resistance", amount: 50, type: "insubstantial" } ] }
                ]
            };
            return jQuery.extend(true, {}, Creature.base, o);
        },
        false
    );

})();