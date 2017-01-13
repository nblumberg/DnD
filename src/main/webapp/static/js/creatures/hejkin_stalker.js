/**
 * Created by nblumberg on 11/16/14.
 */

(function (DnD) {
    "use strict";
    DnD.define(
        "creatures.monsters.hejkin_stalker",
        [ "jQuery", "Creature", "creature.helpers" ],
        function(jQuery, Creature, CH) {
            var o = {
                name: "Hejkin Stalker", level: 1, image: "http://cdn.obsidianportal.com/assets/49655/31.jpg",
                hp: { total: 29 },
                defenses: { ac: 16, fort: 12, ref: 14, will: 11 },
                resistances: { lightning: 10 },
                init: 5, speed: { walk: 5, earthWalk: 5, burrow: 3 },
                abilities: { STR: 13, CON: 13, DEX: 17, INT: 8, WIS: 12, CHA: 8 },
                skills: { perception: 1 },
                attacks: [
                    { name: "Claws", usage: { frequency: "At-Will" }, range: "melee", toHit: 6, defense: "AC", damage: "1d6+4", keywords: [ "melee", "basic" ] },
                    { name: "Earth Grasp", usage: { frequency: "At-Will" }, target: { area: "touch", range: 10 }, toHit: 4, defense: "Will", damage: "0", keywords: [ "melee", "teleportation" ] },
                    { name: "Auspicious Bolt", usage: { frequency: "At-Will", action: "none" }, toHit: "automatic", defense: "AC", damage: { amount: "1d6", type: "lightning" }, keywords: [ "melee", "lightning" ] }
                ],
                buffs: [
                    new CH.Power({
                        name: "Burrow Beneath"
                    }).encounter()
                ]
            };
            return jQuery.extend(true, {}, Creature.base, o);
        },
        false
    );
})(window.DnD);