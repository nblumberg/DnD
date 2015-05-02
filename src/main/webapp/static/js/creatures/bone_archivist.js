/**
 * Created by nblumberg on 11/16/14.
 */

(function (DnD) {
    "use strict";
    DnD.define(
        "creatures.monsters.bone_archivist",
        [ "jQuery", "Creature" ],
        function(jQuery, Creature) {
            var o = {
                name: "Bone Archivist", level: 13, image: "../images/portraits/bone_archivist.jpg", // http://www.juhanartwork.com/images/project/lot/barrow_wight.jpg
                hp: { total: 109 },
                defenses: { ac: 26, fort: 25, ref: 27, will: 26 },
                init: 9, speed: 6,
                abilities: { STR: 12, CON: 19, DEX: 15, INT: 23, WIS: 10, CHA: 20 },
                skills: { perception: 19 },
                attacks: [
                    { name: "Mind Touch", usage: { frequency: "At-Will" }, range: "melee", toHit: 19, defense: "Will", damage: { amount: "1d10+6", type: "psychic" }, effects: [
                        { name: "Penalty", amount: -2, type: "Will", duration: "endAttackerNext" },
                        { name: "Slowed", duration: "endAttackerNext" }
                    ], keywords: [ "melee", "psychic", "basic" ] },
                    { name: "Siphon Memory", usage: { frequency: "At-Will" }, target: { range: 10 }, toHit: 19, defense: "Will", damage: { amount: "2d4+6", type: "psychic" }, effects: [
                        { name: "Only basic and at-will attacks", duration: "endAttackerNext" }
                    ], keywords: [ "ranged", "psychic", "basic" ] },
                    { name: "Knowledge Barrage", usage: { frequency: "Encounter" }, target: { area: "burst", size: 2, range: 10, targets: "enemies" }, toHit: 17, defense: "Will", damage: "3d6+6", effects: [
                        { name: "Dazed", saveEnds: true }
                    ], keywords: [ "burst", "psychic" ] }
                ]
            };
            return jQuery.extend(true, {}, Creature.base, o);
        },
        false
    );
})(window.DnD);