/**
 * Created by nblumberg on 11/16/14.
 */

(function (DnD) {
    "use strict";
    DnD.define(
        "creatures.monsters.foulspawn_seer",
        [ "jQuery", "Creature" ],
        function(jQuery, Creature) {
            var o = {
                name: "Foulspawn Seer", level: 11, image: "../images/portraits/foulspawn.jpg",
                hp: { total: 86 },
                defenses: { ac: 24, fort: 19, ref: 23, will: 21 },
                init: 7, speed: { walk: 6, teleport: 3 },
                abilities: { STR: 10, CON: 14, DEX: 14, INT: 22, WIS: 8, CHA: 18 },
                skills: { perception: 9 },
                attacks: [
                    { name: "Twisted Staff", usage: { frequency: "At-Will" }, range: "melee", toHit: 14, defense: "AC", damage: "1d8+6", keywords: [ "melee", "basic" ] },
                    { name: "Warp Orb", usage: { frequency: "At-Will" }, range: "10", toHit: 16, defense: "Ref", damage: "1d8+6", effects: [
                        { name: "dazed", saveEnds: true }
                    ], keywords: [ "ranged", "basic" ] },
                    { name: "Distortion Blast", usage: { frequency: "Daily" }, range: "blast 5", toHit: 12, defense: "Fort", damage: "2d8+6", effects: [
                        { name: "dazed", saveEnds: true }
                    ], keywords: [ "ranged" ] }
                ]
            };
            return jQuery.extend(true, {}, Creature.base, o);
        },
        false
    );
})(window.DnD);