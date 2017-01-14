/**
 * Created by nblumberg on 11/16/14.
 */

(function (DnD) {
    "use strict";
    DnD.define(
        "creatures.monsters.astral_vent",
        [ "jQuery", "Creature" ],
        function(jQuery, Creature) {
            var o = {
                name: "Astral Vent", level: 19 , image: "../images/portraits/astral_vent.jpg", // https://s-media-cache-ak0.pinimg.com/236x/24/1e/36/241e36347bfbf9a62848340e172a5286.jpg
                hp: { total: 1 },
                defenses: { ac: 10, fort: 10, ref: 10, will: 10 },
                init: 0, speed: { walk: 0 },
                abilities: { STR: 0, CON: 0, DEX: 0, INT: 0, WIS: 0, CHA: 0 },
                attacks: [
                    { name: "Blast", usage: { frequency: "At-Will" }, range: "melee", toHit: 22, defense: "Ref", damage: [ "3d8+4", "1d10" ], effects: [ "Prone" ], keywords: [ "melee", "basic" ] }
                ]
            };
            return jQuery.extend(true, {}, Creature.base, o);
        },
        false
    );
})(window.DnD);