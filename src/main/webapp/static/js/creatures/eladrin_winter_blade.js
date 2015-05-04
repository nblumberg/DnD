/**
 * Created by nblumberg on 11/16/14.
 */

(function (DnD) {
    "use strict";
    DnD.define(
        "creatures.monsters.eladrin_winter_blade",
        [ "jQuery", "Creature" ],
        function(jQuery, Creature) {
            var o = {
                name: "Eladrin Winter Blade", level: 14, image: "../images/portraits/eladrin_winter_blade.jpg",
                hp: { total: 1 },
                defenses: { ac: 30, fort: 26, ref: 27, will: 24 },
                init: 15, speed: 6,
                abilities: { STR: 20, CON: 14, DEX: 23, INT: 15, WIS: 12, CHA: 16 },
                skills: { perception: 8 },
                attacks: [
                    { name: "Winter Longsword", usage: { frequency: "At-Will" }, range: "melee", toHit: 21, defense: "AC", damage: { amount: "8", type: "cold" }, keywords: [ "melee", "basic", "cold" ] }
                ]
            };
            return jQuery.extend(true, {}, Creature.base, o);
        },
        false
    );
})(window.DnD);