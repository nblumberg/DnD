/**
 * Created by nblumberg on 06/29/15.
 */

(function (DnD) {
    "use strict";
    DnD.define(
        "creatures.monsters.portal_hound",
        [ "jQuery", "Creature" ],
        function(jQuery, Creature) {
            var o = {
                name: "Portal Hound", level: 16, image: "../images/portraits/portal_hound.png",
                hp: { total: 150 },
                defenses: { ac: 30, fort: 26, ref: 30, will: 28 },
                init: 15, speed: { walk: 8, teleport: 7 },
                abilities: { STR: 16, CON: 14, DEX: 24, INT: 5, WIS: 21, CHA: 19 },
                skills: { perception: 21 },
                attacks: [
                    { name: "Bite", usage: { frequency: "At-Will" }, range: "melee", toHit: 21, defense: "AC", damage: "2d8+7", keywords: [ "melee", "basic" ] },
                    { name: "Dimensional Jaws", usage: { frequency: "At-Will" }, range: "melee", toHit: 22, defense: "Will", damage: "0", keywords: [ "melee", "teleportation" ] },
                    { name: "Portal Walk", usage: { frequency: "Encounter" }, target: { area: "close burst", size: 1 }, toHit: 21, defense: "Will", damage: "0", keywords: [ "close burst", "teleportation" ] }
                ]
            };
            return jQuery.extend(true, {}, Creature.base, o);
        },
        false
    );
})(window.DnD);