/**
 * Created by nblumberg on 11/16/14.
 */

(function (DnD) {
    "use strict";
    DnD.define(
        "creatures.monsters.calaunxin",
        [ "jQuery", "Creature" ],
        function(jQuery, Creature) {
            var o = {
                name: "Calaunxin", level: 9, image: "../images/portraits/calaunxin.jpg",
                hp: { total: 408 },
                defenses: { ac: 23, fort: 26, ref: 21, will: 22 },
                resistances: { poison: 20 },
                savingThrows: 5,
                init: 5, speed: { walk: 8, fly: 12 },
                abilities: { STR: 20, CON: 22, DEX: 12, INT: 12, WIS: 14, CHA: 10 },
                skills: { athletics: 19, perception: 11 },
                attacks: [
                    { name: "Bite", usage: { frequency: "At-Will" }, range: "reach", toHit: 12, defense: "AC", damage: "1d8+5", effects: [
                        { name: "ongoing damage", amount: 5, type: "poison", saveEnds: true }
                    ], keywords: [ "melee", "basic", "poison" ] },
                    { name: "Claw", usage: { frequency: "At-Will" }, range: "reach", toHit: 12, defense: "AC", damage: "1d8+5", keywords: [ "melee", "basic" ] },
                    { name: "Luring Glare", usage: { frequency: "At-Will" }, target: { range: 10 }, toHit: 10, defense: "Will", damage: "0", keywords: [ "melee", "forced movement" ] },
                    { name: "Breath Weapon", usage: { frequency: "Recharge", recharge: 5 }, target: { area: "close blast", size: 5 }, toHit: 10, defense: "Ref", damage: { amount: "2d6+6", type: "poison" }, effects: [
                        { name: "multiple", saveEnds: true, children: [ "Slowed" ] }
                    ], keywords: [ "close blast", "poison" ] },
                    { name: "Frightful Presence", usage: { frequency: "Encounter" }, target: { area: "close burst", size: 5 }, toHit: 10, defense: "Will", damage: "0", effects: [
                        { name: "Stunned", duration: "endAttackerNext" }
                    ], keywords: [ "close", "burst" ] }
                ]
            };
            return jQuery.extend(true, {}, Creature.base, o);
        },
        false
    );
})(window.DnD);