/**
 * Created by nblumberg on 11/16/14.
 */

(function (DnD) {
    "use strict";
    DnD.define(
        "creatures.monsters.hejkin_sparker",
        [ "jQuery", "Creature", "creature.helpers" ],
        function(jQuery, Creature, CH) {
            var o = {
                name: "Hejkin Sparker", level: 1, image: "http://cdn.obsidianportal.com/assets/49655/31.jpg",
                hp: { total: 31 },
                defenses: { ac: 15, fort: 14, ref: 13, will: 11 },
                resistances: { lightning: 5 },
                init: 4, speed: { walk: 6, earthWalk: 6, burrow: 6 },
                abilities: { STR: 16, CON: 15, DEX: 14, INT: 9, WIS: 8, CHA: 12 },
                skills: { perception: -1 },
                attacks: [
                    { name: "Claw", usage: { frequency: "At-Will" }, range: "melee", toHit: 6, defense: "AC", damage: "1d8+5", effects: [ { name: "marked", duration: "endAttackerNext" } ], keywords: [ "melee", "basic" ] },
                    { name: "Grounded Current", usage: { frequency: "Recharge", recharge: 5 }, target: { area: "close burst", size: 2 }, toHit: 2, defense: "Fort", damage: { amount: "2d6+3", type: "lightning" }, keywords: [ "close burst", "lightning" ] },
                    { name: "Telluric Arc", usage: { frequency: "At-Will", action: "Immediate Interrupt" }, target: { area: "close burst", size: 5 }, toHit: 6, defense: "Ref", damage: { amount: "10", type: "lightning" }, keywords: [ "melee", "lightning" ] }
                ]
            };
            return jQuery.extend(true, {}, Creature.base, o);
        },
        false
    );
})(window.DnD);