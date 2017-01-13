/**
 * Created by nblumberg on 11/16/14.
 */

(function (DnD) {
    "use strict";
    DnD.define(
        "creatures.monsters.ingin_merrygranite",
        [ "jQuery", "Creature", "creature.helpers" ],
        function(jQuery, Creature, CH) {
            var o = {
                name: "Ingin Merrygranite", level: 1, image: "https://s-media-cache-ak0.pinimg.com/564x/58/d1/98/58d198adc00d6045d3c1288433460a34.jpg",
                hp: { total: 33 },
                defenses: { ac: 17, fort: 15, ref: 13, will: 15 },
                init: 3, speed: 5,
                abilities: { STR: 16, CON: 17, DEX: 12, INT: 10, WIS: 17, CHA: 10 },
                skills: { perception: 8 },
                attacks: [
                    { name: "Warhammer", usage: { frequency: "At-Will" }, range: "melee", toHit: 6, defense: "AC", damage: "1d10+3", effects: [ { name: "marked", duration: "startAttackerNext" } ], keywords: [ "melee", "basic" ] },
                    { name: "Throwing Hammer", usage: { frequency: "At-Will" }, range: 10, toHit: 6, defense: "AC", damage: "1d6+4", effects: [ { name: "marked", duration: "startAttackerNext" } ], keywords: [ "ranged", "basic" ] },
                    { name: "Double Hammer Strike", usage: { frequency: "Recharge", recharge: 4 }, range: "melee", toHit: 6, defense: "AC", damage: "1d10+3", effects: [ { name: "marked", duration: "startAttackerNext" } ], keywords: [ "melee" ] }
                ]
            };
            return jQuery.extend(true, {}, Creature.base, o);
        },
        false
    );
})(window.DnD);