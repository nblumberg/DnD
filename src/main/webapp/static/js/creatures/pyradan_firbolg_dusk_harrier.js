/**
 * Created by nblumberg on 11/16/14.
 */

(function (DnD) {
    "use strict";
    DnD.define(
        "creatures.monsters.pyradan_firbolg_dusk_harrier",
        [ "jQuery", "Creature" ],
        function(jQuery, Creature) {
            var o = {
                name: "Pyradan, Firbolg Dusk Harrier", level: 17, image: "../images/portraits/pyradan.png",
                hp: { total: 322, regeneration: 5 },
                defenses: { ac: 31, fort: 29, ref: 30, will: 27 },
                vulnerabilities: { necrotic: 5 },
                actionPoints: 1,
                init: 17, speed: 8,
                abilities: { STR: 22, CON: 17, DEX: 25, INT: 13, WIS: 18, CHA: 15 },
                skills: { acrobatics: 19, athletics: 20, intimidate: 15, nature: 17 },
                attacks: [
                    { name: "Spear", usage: { frequency: "At-Will" }, range: 2, toHit: 22, defense: "AC", damage: "2d10+5", keywords: [ "melee", "basic" ] },
                    { name: "Javelin", usage: { frequency: "At-Will" }, range: 10, toHit: 22, defense: "AC", damage: "2d8+5", keywords: [ "ranged", "basic" ] },
                    { name: "Moonfire", usage: { frequency: "Recharge", recharge: 4, action: "minor" }, target: { range: 10 }, toHit: 20, defense: "Will", damage: "0", effects: [ { name: "multiple", duration: "endAttackerNext", children: [ "No invisibility or concealment", "Combat Advantage" ] } ], keywords: [ "ranged" ] },
                    { name: "Forest of Spears (ongoing)", usage: { frequency: "Recharge", recharge: "bloodied" }, target: { area: "close", size: 2, enemiesOnly: true }, toHit: 22, defense: "AC", damage: "2d10+5", effects: [ { name: "ongoing damage", amount: 10, saveEnds: true } ], keywords: [ "close", "burst" ] },
                    { name: "Forest of Spears (slowed)", usage: { frequency: "Recharge", recharge: "bloodied" }, target: { area: "close", size: 2, enemiesOnly: true }, toHit: 22, defense: "AC", damage: "2d10+5", effects: [ { name: "slowed", saveEnds: true } ], keywords: [ "close", "burst" ] },
                    { name: "Deadly Flanker", usage: { frequency: "At-Will" }, range: 2, toHit: "automatic", defense: "AC", damage: "1d8", keywords: [ "melee" ] }
                ]
            };
            return jQuery.extend(true, {}, Creature.base, o);
        },
        false
    );
})(window.DnD);