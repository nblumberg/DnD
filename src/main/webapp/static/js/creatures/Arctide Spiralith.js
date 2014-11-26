/**
 * Created by nblumberg on 11/16/14.
 */

(function (DnD) {
    "use strict";
    DnD.define(
        "creatures.monsters.arctide_spiralith",
        [ "jQuery", "Creature" ],
        function(jQuery, Creature) {
            var o = {
                name: "Arctide Spiralith", level: 12, image: "../images/portraits/arctide_spiralith.jpg",
                hp: { total: 97 },
                defenses: { ac: 24, fort: 23, ref: 25, will: 23 },
                init: 12, speed: 7,
                abilities: { STR: 15, CON: 19, DEX: 23, INT: 7, WIS: 19, CHA: 12 },
                skills: { perception: 10 },
                attacks: [
                    { name: "Bite", usage: { frequency: "At-Will" }, range: "melee", toHit: 17, defense: "AC", damage: "1d6+5", keywords: [ "melee", "basic" ] },
                    { name: "Arcane Arc", usage: { frequency: "At-Will" }, range: "melee", toHit: 17, defense: "Ref", damage: { amount: "1d8+5", type: "lightning" }, keywords: [ "melee", "lightning" ] },
                    { name: "Focused Strike", usage: { frequency: "At-Will" }, target: { range: 10 }, toHit: 19, defense: "Ref", damage: { amount: "2d8+5", type: "lightning" }, keywords: [ "ranged", "lightning" ] },
                    { name: "Bloodied Shock", usage: { frequency: "Encounter" }, target: { area: "close burst", size: 1, range: 1 }, toHit: 15, defense: "Ref", damage: { amount: "1d8+5", type: "lightning" }, effects: [
                        { name: "Dazed", saveEnds: true }
                    ], keywords: [ "ranged", "lightning" ] },
                    { name: "Charged Lightning Burst", usage: { frequency: "At-Will" }, target: { area: "burst", size: 2, range: 10 }, toHit: 15, defense: "Ref", damage: { amount: "1d8+5", type: "lightning" }, keywords: [ "ranged", "burst", "lightning" ] }
                ]
            };
            return jQuery.extend(true, {}, Creature.base, o);
        },
        false
    );
})(window.DnD);