/**
 * Created by nblumberg on 06/29/15.
 */

(function (DnD) {
    "use strict";
    DnD.define(
        "creatures.monsters.rakshasa_archer",
        [ "jQuery", "Creature" ],
        function(jQuery, Creature) {
            var o = {
                name: "Rakshasa Archer", level: 15, image: "../images/portraits/rakshasa_archer.png",
                hp: { total: 110 },
                defenses: { ac: 28, fort: 24, ref: 26, will: 25 },
                init: 13, speed: 6,
                abilities: { STR: 17, CON: 14, DEX: 20, INT: 12, WIS: 18, CHA: 14 },
                skills: { bluff: 14, intimidate: 14, perception: 16 },
                attacks: [
                    { name: "Claw", usage: { frequency: "At-Will" }, range: "melee", toHit: 19, defense: "AC", damage: "1d8+3", keywords: [ "melee", "basic" ] },
                    { name: "Longbow", usage: { frequency: "At-Will" }, target: { range: 20 }, toHit: 20, defense: "AC", damage: "1d10+5", keywords: [ "ranged", "basic" ] },
                    { name: "XXX", usage: { frequency: "At-Will" }, range: "melee", toHit: 22, defense: "Will", damage: "0", keywords: [ "melee", "teleportation" ] },
                    { name: "XXX", usage: { frequency: "Enounter" }, target: { area: "close burst", size: 1 }, toHit: 21, defense: "Will", damage: "0", keywords: [ "close burst", "teleportation" ] }
                ]
            };
            return jQuery.extend(true, {}, Creature.base, o);
        },
        false
    );
})(window.DnD);