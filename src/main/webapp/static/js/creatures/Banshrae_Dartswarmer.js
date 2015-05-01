/**
 * Created by nblumberg on 11/16/14.
 */

(function (DnD) {
    "use strict";
    DnD.define(
        "creatures.monsters.banshrae_dartswarmer",
        [ "jQuery", "Creature" ],
        function(jQuery, Creature) {
            var o = {
                name: "Banshrae Dartswarmer", level: 11, image: "../images/portraits/banshrae_dartswarmer.jpg",
                hp: { total: 89 },
                defenses: { ac: 23, fort: 20, ref: 23, will: 22 },
                init: 11, speed: 8,
                abilities: { STR: 16, CON: 17, DEX: 22, INT: 14, WIS: 15, CHA: 20 },
                skills: { perception: 7 },
                attacks: [
                    { name: "Slam", usage: { frequency: "At-Will" }, range: "melee", toHit: 13, defense: "AC", damage: "1d8+3", keywords: [ "melee", "basic" ] },
                    { name: "Blowgun Dart", usage: { frequency: "At-Will" }, range: 5, toHit: 16, defense: "AC", targeting: "blast 5", damage: "1d10+6", effects: [
                        { name: "Dazed", saveEnds: true }
                    ], keywords: [ "ranged" ] },
                    { name: "Dart Flurry", usage: { frequency: "Recharge", recharge: 4 }, range: "blast 5", toHit: 16, defense: "AC", targeting: "blast 5", damage: "1d10+6", effects: [
                        { name: "multiple effects", saveEnds: true, children: [
                            { name: "Dazed" },
                            { name: "Attack penalty", amount: -2 }
                        ] }
                    ], keywords: [ "ranged" ] }
                ]
            };
            return jQuery.extend(true, {}, Creature.base, o);
        },
        false
    );
})(window.DnD);