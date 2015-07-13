/**
 * Created by nblumberg on 7/1/15.
 */

(function (DnD) {
    "use strict";
    DnD.define(
        "creatures.monsters.chimera",
        [ "jQuery", "Creature" ],
        function(jQuery, Creature) {
            var o = {
                name: "Chimera", level: 18, image: "../images/portraits/chimera.jpg",
                hp: { total: 366 },
                defenses: { ac: 27, fort: 29, ref: 23, will: 24 },
                resistances: { fire: 10 },
                savingThrows: 2,
                actionPoints: 1,
                init: 10, speed: { walk: 6, fly: 10 },
                abilities: { STR: 24, CON: 23, DEX: 17, INT: 5, WIS: 14, CHA: 17 },
                skills: { perception: 14 },
                attacks: [
                    { name: "Lion's Bite", usage: { frequency: "At-Will" }, range: "melee", toHit: 18, defense: "AC", damage: "2d8+7", keywords: [ "melee", "basic" ] },
                    { name: "Dragon's Bite", usage: { frequency: "At-Will" }, range: "melee", toHit: 18, defense: "AC", damage: "3d6+7", keywords: [ "melee" ] },
                    { name: "Ram's Gore", usage: { frequency: "At-Will" }, range: "melee", toHit: 18, defense: "AC", damage: "1d10+7", effects: [ "Prone" ], keywords: [ "melee" ] },
                    { name: "Ram's Charge", usage: { frequency: "At-Will" }, range: "melee", toHit: 19, defense: "AC", damage: "1d10+11", keywords: [ "melee", "charge" ] },
                    { name: "Ram's Charge (prone)", usage: { frequency: "At-Will" }, range: "melee", toHit: 19, defense: "AC", damage: "1d10+11", effects: [ "Prone" ], keywords: [ "melee", "charge" ] },
                    { name: "Dragon Breath", usage: { frequency: "Recharge", recharge: "bloodied" }, target: { area: "blast", size: 5 }, toHit: 16, defense: "Ref", damage: "2d6+3", effects: [ { name: "ongoing damage", amount: 10, type: "fire", saveEnds: true } ], keywords: [ "breath weapon", "fire" ] }
                ]
            };
            return jQuery.extend(true, {}, Creature.base, o);
        },
        false
    );
})(window.DnD);