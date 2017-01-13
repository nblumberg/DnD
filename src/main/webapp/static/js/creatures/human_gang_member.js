/**
 * Created by nblumberg on 11/16/14.
 */

(function (DnD) {
    "use strict";
    DnD.define(
        "creatures.monsters.human_gang_member",
        [ "jQuery", "Creature", "creature.helpers" ],
        function(jQuery, Creature, CH) {
            var o = {
                name: "Human Gang Member", level: 1, image: "https://s-media-cache-ak0.pinimg.com/236x/91/9c/6b/919c6b367a5b4fe6730458fde3aaeead.jpg",
                hp: { total: 1 },
                defenses: { ac: 14, fort: 13, ref: 11, will: 11 },
                init: 0, speed: 6,
                abilities: { STR: 14, CON: 12, DEX: 10, INT: 9, WIS: 10, CHA: 11 },
                skills: { perception: 0 },
                attacks: [
                    { name: "Club", usage: { frequency: "At-Will" }, range: "melee", toHit: 6, defense: "AC", damage: "2", keywords: [ "melee", "basic" ] }
                ]
            };
            return jQuery.extend(true, {}, Creature.base, o);
        },
        false
    );
})(window.DnD);