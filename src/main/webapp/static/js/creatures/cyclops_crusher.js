/**
 * Created by nblumberg on 11/16/14.
 */

(function (DnD) {
    "use strict";
    DnD.define(
        "creatures.monsters.cyclops_crusher",
        [ "jQuery", "Creature" ],
        function(jQuery, Creature) {
            var o = {
                name: "Cyclops Crusher", level: 14, image: "../images/portraits/cyclops.jpg",
                hp: { total: 171 },
                defenses: { ac: 26, fort: 27, ref: 26, will: 25 },
                init: 12, speed: 6,
                abilities: { STR: 22, CON: 20, DEX: 16, INT: 11, WIS: 17, CHA: 11 },
                skills: { perception: 15 },
                attacks: [
                    { name: "Spiked Greatclub", usage: { frequency: "At-Will" }, range: "2", toHit: 17, defense: "AC", damage: "2d10+8", keywords: [ "melee", "basic" ] },
                    { name: "Evil Eye", usage: { frequency: "At-Will" }, range: "2", toHit: "automatic", defense: "AC", damage: "0", effects: [ { name: "penalty", amount: -2, type: "attacks" } ], keywords: [ "ranged" ] },
                    { name: "Tremor Smash", usage: { frequency: "Recharge", recharge: 5 }, range: "2", toHit: 17, defense: "AC", damage: "2d12+8", effects: [ { name: "prone" } ], keywords: [ "melee" ] }
                ]
            };
            return jQuery.extend(true, {}, Creature.base, o);
        },
        false
    );
})(window.DnD);