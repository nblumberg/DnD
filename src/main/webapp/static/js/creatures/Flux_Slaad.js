/**
 * Created by nblumberg on 11/16/14.
 */

(function (DnD) {
    "use strict";
    DnD.define(
        "creatures.monsters.flux_slaad",
        [ "jQuery", "Creature" ],
        function(jQuery, Creature) {
            var o = {
                name: "Flux Slaad", level: 9, image: "../images/portraits/flux_slaad.jpg",
                hp: { total: 98 },
                defenses: { ac: 23, fort: 23, ref: 21, will: 21 },
                init: 8, speed: { walk: 7, teleport: 2 },
                abilities: { STR: 16, CON: 18, DEX: 15, INT: 7, WIS: 13, CHA: 14 },
                skills: { perception: 10 },
                attacks: [
                    { name: "Claw Slash", usage: { frequency: "At-Will" }, range: "melee", toHit: 14, defense: "AC", damage: "2d8+3", keywords: [ "melee", "basic" ] }
                ]
            };
            return jQuery.extend(true, {}, Creature.base, o);
        },
        false
    );
})(window.DnD);