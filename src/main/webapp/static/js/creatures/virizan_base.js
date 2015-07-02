/**
 * Created by nblumberg on 7/1/15.
 */

(function (DnD) {
    "use strict";

    DnD.define(
        "creatures.monsters.base.virizan",
        [ "jQuery", "Creature" ],
        function(jQuery, Creature) {
            var o = {
                level: 18, image: "../images/portraits/sovacles.png",
                hp: { total: 170 },
                defenses: { ac: 32, fort: 29, ref: 30, will: 31 },
                init: 14, speed: 6,
                savingThrows: 5,
                actionPoints: 2,
                abilities: { STR: 13, CON: 18, DEX: 20, INT: 22, WIS: 19, CHA: 25 },
                skills: { arcana: 20, bluff: 21, diplomacy: 21, history: 20, insight: 18, perception: 18, religion: 20 },
                attacks: [
                    { name: "Mindspike", usage: { frequency: "At-Will", action: "Minor" }, target: { area: "close burst", size: 10, targets: 1 }, toHit: 22, defense: "Will", damage: { amount: "3d6", type: "psychic" }, effects: [ { name: "ongoing damage", amount: 5, type: "psychic", saveEnds: true } ], keywords: [ "close burst", "psychic" ] },
                    { name: "Overwhelm Mind", usage: { frequency: "Recharge", recharge: 5 }, target: { range: 20 }, toHit: 22, defense: "Will", damage: "0", effects: [ { name: "Dominated", saveEnds: true } ], keywords: [ "ranged", "charm" ] }
                ]
            };
            return jQuery.extend(true, {}, Creature.base, o);
        },
        false
    );

})(window.DnD);