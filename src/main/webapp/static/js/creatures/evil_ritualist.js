/**
 * Created by nblumberg on 11/16/14.
 */

(function (DnD) {
    "use strict";
    DnD.define(
        "creatures.monsters.evil_ritualist",
        [ "jQuery", "Creature", "creature.helpers" ],
        function(jQuery, Creature, CH) {
            var o = {
                name: "Evil Ritualist", level: 1, image: "http://wiki.guildwars.com/images/e/e6/Ritualist_render.jpg",
                hp: { total: 1 },
                defenses: { ac: 15, fort: 13, ref: 14, will: 13 },
                init: 5, speed: 6,
                abilities: { STR: 10, CON: 10, DEX: 16, INT: 10, WIS: 10, CHA: 10 },
                skills: { perception: 0 },
                attacks: [
                    { name: "Sacrificial Dagger", usage: { frequency: "At-Will" }, range: "melee", toHit: 6, defense: "AC", damage: "4", keywords: [ "melee", "basic" ] }
                ]
            };
            return jQuery.extend(true, {}, Creature.base, o);
        },
        false
    );
})(window.DnD);