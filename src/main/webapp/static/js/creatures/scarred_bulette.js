/**
 * Created by nblumberg on 6/30/15.
 */

(function () {
    "use strict";
    DnD.define(
        "creatures.monsters.scarred_bulette",
        [ "jQuery", "Creature" ],
        function(jQuery, Creature) {
            var o = {
                name: "Scarred Bulette", level: 15, image: "../images/portraits/bulette.jpg",
                hp: { total: 304 },
                defenses: { ac: 29, fort: 28, ref: 25, will: 23 },
                init: 14, speed: { walk: 6, burrow: 6 },
                savingThrows: 2,
                actionPoints: 1,
                abilities: { STR: 27, CON: 24, DEX: 21, INT: 2, WIS: 16, CHA: 11 },
                skills: { athletics: 20, endurance: 19, perception: 10 },
                attacks: [
                    { name: "Bite", usage: { frequency: "At-Will" }, range: "melee", toHit: 20, defense: "AC", damage: "2d8+6", keywords: [ "melee", "basic" ] },
                    { name: "Bite (prone)", usage: { frequency: "At-Will" }, range: "melee", toHit: 20, defense: "AC", damage: "4d8+6", keywords: [ "melee", "basic" ] },
                    { name: "Earth Furrow", usage: { frequency: "At-Will", action: "Move" }, range: "melee", toHit: 14, defense: "Fort", damage: "0", effects: [ "Prone" ], keywords: [ "melee" ] },
                    { name: "Rising Burst", usage: { frequency: "At-Will" }, target: { area: "close burst", size: 2 }, toHit: 19, defense: "AC", damage: "1d10+6", keywords: [ "close burst" ] },
                    { name: "Spray of Tainted Blood", usage: { frequency: "At-Will", action: "Free" }, toHit: "automatic", defense: "Ref", damage: "0", effects: [ { name: "penalty", amount: 2, type: "Fort", duration: "endAttackerNext" } ], keywords: [ "free" ] }
                ],
                buffs: [
                    { name: "Habituated to Torture", effects: [
                        { name: "multiple", children: [
                            { name: "bonus", amount: 2, type: "AC" },
                            { name: "bonus", amount: 2, type: "Fort" },
                            { name: "bonus", amount: 2, type: "Ref" },
                            { name: "bonus", amount: 2, type: "Will" }
                        ] }
                    ] }
                ]
            };
            return jQuery.extend(true, {}, Creature.base, o);
        },
        false
    );
})(window.DnD);