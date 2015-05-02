/**
 * Created by nblumberg on 11/16/14.
 */

(function (DnD) {
    "use strict";
    DnD.define(
        "creatures.monsters.cyclops_guard",
        [ "jQuery", "Creature" ],
        function(jQuery, Creature) {
            var o = {
                name: "Cyclops Guard", level: 14, image: "../images/portraits/cyclops.jpg",
                hp: { total: 1 },
                defenses: { ac: 27, fort: 26, ref: 23, will: 23 },
                init: 8, speed: 6,
                abilities: { STR: 22, CON: 20, DEX: 16, INT: 11, WIS: 17, CHA: 11 },
                skills: { perception: 15 },
                attacks: [
                    { name: "Battleaxe", usage: { frequency: "At-Will" }, range: "2", toHit: 17, defense: "AC", damage: "7", keywords: [ "melee", "basic" ] }
                ]
            };
            return jQuery.extend(true, {}, Creature.base, o);
        },
        false
    );
})(window.DnD);