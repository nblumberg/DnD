/**
 * Created by nblumberg on 06/29/15.
 */

(function (DnD) {
    "use strict";
    DnD.define(
        "creatures.monsters.pyradan",
        [ "jQuery", "Creature" ],
        function(jQuery, Creature) {
            var o = {
                name: "Pyradan, Firbolg Dusk Harrier", level: 17, image: "../images/portraits/pyradan.jpg",
                hp: { total: 322, regeneration: 5 },
                defenses: { ac: 31, fort: 29, ref: 30, will: 27 },
                vulnerabilities: { necrotic: 5 },
                savingThrows: 2,
                actionPoints: 1,
                init: 17, speed: 8,
                abilities: { STR: 22, CON: 17, DEX: 25, INT: 13, WIS: 18, CHA: 15 },
                skills: { acrobatics: 19, athletics: 20, intimidate: 15, nature: 17, perception: 17 },
                attacks: [
                    { name: "Spear", usage: { frequency: "At-Will" }, range: "reach", toHit: 22, defense: "AC", damage: "2d10+5", keywords: [ "melee", "basic", "weapon" ] },
                    { name: "Javelin", usage: { frequency: "At-Will" }, target: { range: 10 }, toHit: 22, defense: "AC", damage: "2d8+5", keywords: [ "ranged", "basic", "weapon" ] },
                    { name: "Forest of Spears (slowed)", usage: { frequency: "Recharge", recharge: "Bloodied" }, target: { area: "close burst", size: 2, enemiesOnly: true }, toHit: 22, defense: "AC", damage: "2d10+5", effects: [ { name: "Slowed", saveEnds: true } ], keywords: [ "melee", "weapon" ] },
                    { name: "Forest of Spears (ongoing damage)", usage: { frequency: "Recharge", recharge: "Bloodied" }, target: { area: "close burst", size: 2, enemiesOnly: true }, toHit: 22, defense: "AC", damage: "2d10+5", effects: [ { name: "ongoing damage", amount: 10, saveEnds: true } ], keywords: [ "melee", "weapon" ] },
                    { name: "Deadly Flanker", usage: { frequency: "At-Will" }, range: "melee", toHit: "automatic", defense: "AC", damage: "1d8", keywords: [ "melee" ] },
                    { name: "Moonfire", usage: { frequency: "Recharge", recharge: 4, action: "minor" }, target: { range: 10 }, toHit: 20, defense: "Will", damage: "0", effects: [ { name: "multiple", children: [ "No invisibility or concealment", "combat advantage" ], duration: "endAttackerNext" } ], keywords: [ "ranged" ] }
                ]
            };
            return jQuery.extend(true, {}, Creature.base, o);
        },
        false
    );
})(window.DnD);