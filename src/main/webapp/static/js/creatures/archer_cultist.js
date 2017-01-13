/**
 * Created by nblumberg on 11/16/14.
 */

(function (DnD) {
    "use strict";
    DnD.define(
        "creatures.monsters.archer_cultist",
        [ "jQuery", "Creature", "creature.helpers" ],
        function(jQuery, Creature, CH) {
            var o = {
                name: "Archer Cultist", level: 1, image: "https://s-media-cache-ak0.pinimg.com/564x/d9/f8/3c/d9f83c638c8cc8b603c5844cddc41cb6.jpg",
                hp: { total: 1 },
                defenses: { ac: 13, fort: 13, ref: 14, will: 13 },
                init: 3, speed: 6,
                abilities: { STR: 10, CON: 10, DEX: 16, INT: 10, WIS: 10, CHA: 10 },
                skills: { perception: 0 },
                attacks: [
                    { name: "Shortbow", usage: { frequency: "At-Will" }, range: "melee", toHit: 8, defense: "AC", damage: "3", keywords: [ "ranged", "basic" ] },
                    { name: "Shortbow (adjacent ally)", usage: { frequency: "At-Will" }, range: "melee", toHit: 8, defense: "AC", damage: "5", keywords: [ "ranged", "basic" ] },
                    { name: "Shortsword", usage: { frequency: "At-Will" }, range: "melee", toHit: 6, defense: "AC", damage: "3", keywords: [ "melee", "basic" ] }
                ]
            };
            return jQuery.extend(true, {}, Creature.base, o);
        },
        false
    );
})(window.DnD);