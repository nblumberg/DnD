/**
 * Created by nblumberg on 11/16/14.
 */

(function (DnD) {
    "use strict";
    DnD.define(
        "creatures.monsters.beholder_eye_of_frost",
        [ "jQuery", "Creature" ],
        function(jQuery, Creature) {
            var o = {
                name: "Beholder Eye of Frost", level: 10, image: "../images/portraits/beholder_eye_of_frost.jpg", // http://www.striemer.org/scales-of-war/images/icy-beholder.jpg
                hp: { total: 222 },
                defenses: { ac: 28, fort: 28, ref: 28, will: 29 },
                resistances: { cold: 15 },
                savingThrows: 2,
                init: 12, speed: { fly: 4 },
                abilities: { STR: 13, CON: 21, DEX: 21, INT: 12, WIS: 18, CHA: 23 },
                skills: { perception: 16 },
                attacks: [
                    { name: "Bite", usage: { frequency: "At-Will" }, range: "melee", toHit: 21, defense: "AC", damage: "2d6", keywords: [ "melee", "basic" ] },
                    { name: "Central Eye", usage: { frequency: "At-Will" }, target: { range: 8 }, toHit: 20, defense: "Ref", damage: "0", effects: [
                        { name: "Weakened", saveEnds: true }
                    ], keywords: [ "ranged", "gaze" ] },
                    { name: "Central Eye (secondary)", usage: { frequency: "At-Will" }, toHit: "automatic", defense: "Ref", damage: "0", effects: [
                        { name: "Immobilized", saveEnds: true }
                    ], keywords: [ "ranged", "gaze" ] },
                    { name: "Freeze Ray", usage: { frequency: "At-Will" }, target: { range: 10 }, toHit: 19, defense: "Ref", damage: { amount: "2d8+7", type: "cold" }, keywords: [ "ranged", "ray", "cold" ] },
                    { name: "Telekinesis Ray", usage: { frequency: "At-Will" }, target: { range: 10 }, toHit: 19, defense: "Fort", damage: "0", keywords: [ "ranged", "ray" ] },
                    { name: "Ice Ray", usage: { frequency: "At-Will" }, target: { range: 10 }, toHit: 19, defense: "Ref", damage: { amount: "1d8+6", type: "cold" }, effects: [
                        { name: "multiple", saveEnds: true, children: [
                            { name: "ongoing damage", amount: 5, type: "cold" },
                            { name: "Immobilized" }
                        ] }
                    ], keywords: [ "ranged", "ray", "cold" ] }
                ]
            };
            return jQuery.extend(true, {}, Creature.base, o);
        },
        false
    );
})(window.DnD);