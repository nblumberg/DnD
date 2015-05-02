/**
 * Created by nblumberg on 11/16/14.
 */

(function (DnD) {
    "use strict";
    DnD.define(
        "creatures.monsters.chaos_mauler",
        [ "jQuery", "Creature" ],
        function(jQuery, Creature) {
            var o = {
                name: "Chaos Mauler", level: 11, image: "../images/portraits/chaos_mauler.png",
                hp: { total: 1 },
                defenses: { ac: 23, fort: 25, ref: 23, will: 22 },
                init: 9, speed: { walk: 6 },
                abilities: { STR: 23, CON: 16, DEX: 18, INT: 11, WIS: 14, CHA: 16 },
                skills: { perception: 7 },
                attacks: [
                    { name: "Slam", usage: { frequency: "At-Will" }, range: 2, toHit: 14, defense: "AC", damage: { amount: "8", type: "fire" }, keywords: [ "melee", "basic" ] }
                ]
            };
            return jQuery.extend(true, {}, Creature.base, o);
        },
        false
    );
})(window.DnD);