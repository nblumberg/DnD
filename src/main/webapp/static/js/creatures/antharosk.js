/**
 * Created by nblumberg on 11/16/14.
 */

(function (DnD) {
    "use strict";
    DnD.define(
        "creatures.monsters.antharosk",
        [ "jQuery", "Creature" ],
        function(jQuery, Creature) {
            var o = {
                name: "Antharosk", level: 10, image: "../images/portraits/antharosk.jpg",
                hp: { total: 428 },
                defenses: { ac: 26, fort: 23, ref: 24, will: 23 },
                resistances: { poison: 20 },
                savingThrows: 5,
                init: 10, speed: { walk: 8, fly: 12 },
                abilities: { STR: 16, CON: 19, DEX: 20, INT: 16, WIS: 17, CHA: 18 },
                skills: { bluff: 19, diplomacy: 14, insight: 18, intimidate: 14, perception: 13 },
                attacks: [
                    { name: "Bite", usage: { frequency: "At-Will" }, range: "reach", toHit: 15, defense: "AC", damage: "1d10+5", effects: [
                        { name: "ongoing damage", amount: 5, type: "poison", saveEnds: true }
                    ], keywords: [ "melee", "basic", "poison" ] },
                    { name: "Claw", usage: { frequency: "At-Will" }, range: "reach", toHit: 15, defense: "AC", damage: "1d8+5", keywords: [ "melee", "basic" ] },
                    { name: "Tail Sweep", usage: { frequency: "At-Will", action: "Immediate Reaction" }, toHit: 13, defense: "Ref", damage: "1d8+5", effects: [ "Prone" ], keywords: [ "melee", "prone" ] },
                    { name: "Breath Weapon", usage: { frequency: "Recharge", recharge: 5 }, target: { area: "close blast", size: 5 }, toHit: 13, defense: "Fort", damage: { amount: "1d10+4", type: "poison" }, effects: [
                        { name: "multiple", saveEnds: true, children: [
                            { name: "Ongoing damage", amount: 5 },
                            "Slowed"
                        ] }
                    ], keywords: [ "close blast", "poison" ] },
                    { name: "Frightful Presence", usage: { frequency: "Encounter" }, target: { area: "close burst", size: 5 }, toHit: 13, defense: "Will", damage: "0", effects: [
                        { name: "Stunned", duration: "endAttackerNext" }
                    ], keywords: [ "close", "burst" ] }
                ]
            };
            return jQuery.extend(true, {}, Creature.base, o);
        },
        false
    );
})(window.DnD);