/**
 * Created by nblumberg on 6/30/15.
 */

(function () {
    "use strict";
    DnD.define(
        "creatures.monsters.inferno_bat",
        [ "jQuery", "Creature" ],
        function(jQuery, Creature) {
            var o = {
                name: "Inferno Bat", level: 15, image: "../images/portraits/firebat.jpg",
                hp: { total: 144 },
                defenses: { ac: 29, fort: 25, ref: 29, will: 23 },
                resistances: { fire: 20 },
                init: 17, speed: { walk: 2, fly: 8 },
                abilities: { STR: 8, CON: 16, DEX: 27, INT: 2, WIS: 12, CHA: 9 },
                skills: { perception: 13 },
                attacks: [
                    { name: "Inferno Touch", usage: { frequency: "At-Will" }, range: "melee", toHit: 20, defense: "Ref", damage: { amount: "2d6+5", type: "fire" }, effects: [ { name: "ongoing damage", amount: 10, type: "fire", saveEnds: true } ], keywords: [ "melee", "basic", "fire" ] },
                    { name: "Inferno Touch (failed save)", usage: { frequency: "At-Will" }, target: { area: "close burst", size: 2 }, toHit: "automatic", defense: "AC", damage: { amount: "10", type: "fire" }, keywords: [ "close burst", "fire" ] }
                ]
            };
            return jQuery.extend(true, {}, Creature.base, o);
        },
        false
    );
})(window.DnD);