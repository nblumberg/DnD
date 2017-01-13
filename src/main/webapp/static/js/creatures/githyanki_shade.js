/**
 * Created by nblumberg on 11/16/14.
 */

(function (DnD) {
    "use strict";
    DnD.define(
        "creatures.monsters.githyanki_shade",
        [ "jQuery", "Creature" ],
        function(jQuery, Creature) {
            var o = {
                name: "Githyanki Shade", level: 16, image: "../images/portraits/githyanki_lancer.jpg", // http://scalesofwar4.webs.com/62githyanki.jpg
                hp: { total: 84 },
                defenses: { ac: 30, fort: 26, ref: 29, will: 28 },
                resistances: { insubstantial: 50 },
                init: 19, speed: { walk: 8, fly: 8 },
                abilities: { STR: 21, CON: 18, DEX: 24, INT: 19, WIS: 16, CHA: 21 },
                attacks: [
                    { name: "Ghost Sword", usage: { frequency: "At-Will" }, range: "melee", toHit: 21, defense: "AC", damage: "2d10+5", keywords: [ "melee", "basic" ] },
                    { name: "Spirit Rake", usage: { frequency: "At-Will" }, range: 5, toHit: 19, defense: "Will", damage: { amount: "2d8+7", type: "psychic" }, effects: [ { name: "multiple", saveEnds: true, children: [
                        { name: "penalty", amount: 2, type: "AC" },
                        { name: "penalty", amount: 2, type: "Fort" },
                        { name: "penalty", amount: 2, type: "Ref" },
                        { name: "penalty", amount: 2, type: "Will" }
                    ] } ], keywords: [ "ranged", "basic" ] },
                    { name: "Bladed Wrath", usage: { frequency: "At-Will" }, target: { area: "close burst", size: 1 }, toHit: 21, defense: "AC", damage: "1d10+5", effects: [
                        { name: "multiple", saveEnds: true, children: [
                            { name: "Slowed" },
                            { name: "penalty", amount: 2, type: "AC" },
                            { name: "penalty", amount: 2, type: "Fort" },
                            { name: "penalty", amount: 2, type: "Ref" },
                            { name: "penalty", amount: 2, type: "Will" }
                        ] }
                    ], keywords: [ "close", "psychic" ] },
                    { name: "Soul Strike", usage: { frequency: "Recharge", recharge: 4 }, range: "melee", toHit: 19, defense: "Will", damage: { amount: "4d10+5", type: "radiant" }, effects: [ { name: "vulnerable", amount: 10, type: "psychic", duration: "endTargetNext" } ], keywords: [ "melee", "radiant" ] }
                ]
            };
            return jQuery.extend(true, {}, Creature.base, o);
        },
        false
    );
})(window.DnD);