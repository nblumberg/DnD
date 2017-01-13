/**
 * Created by nblumberg on 11/16/14.
 */

(function (DnD) {
    "use strict";
    DnD.define(
        "creatures.monsters.ellaloth",
        [ "jQuery", "Creature", "creature.helpers" ],
        function(jQuery, Creature, CH) {
            var o = {
                name: "Ellaloth", level: 1, image: "https://s-media-cache-ak0.pinimg.com/564x/c9/72/5d/c9725d1b4d0c9967dda1b5bb24fa8a54.jpg",
                hp: { total: 29 },
                defenses: { ac: 15, fort: 12, ref: 14, will: 13 },
                init: 3, speed: 6,
                abilities: { STR: 10, CON: 13, DEX: 12, INT: 14, WIS: 11, CHA: 18 },
                skills: { acrobatics: 6, arcana: 7, athletics: 6, perception: 0 },
                attacks: [
                    { name: "Quarterstaff", usage: { frequency: "At-Will" }, range: "melee", toHit: 6, defense: "AC", damage: "1d8+4", keywords: [ "melee", "basic" ] },
                    { name: "Blunder", usage: { frequency: "At-Will" }, range: 5, toHit: 4, defense: "Will", damage: "1d6+5", keywords: [ "ranged", "arcane", "charm", "implement" ] },
                    { name: "Vicious Mockery", usage: { frequency: "At-Will" }, range: 10, toHit: 4, defense: "Will", damage: { amount: "1d6+5", type: "psychic" }, keywords: [ "ranged", "arcane", "charm", "implement", "psychic" ] },
                    { name: "Surprising Shout", usage: { frequency: "Encounter" }, range: 10, toHit: 4, defense: "Will", damage: { amount: "2d8+4", type: "psychic" }, effects: [ { name: "dazed", duration: "endAttackerNext" } ], keywords: [ "ranged", "arcane", "healing", "implement", "psychic" ] }
                ]
            };
            return jQuery.extend(true, {}, Creature.base, o);
        },
        false
    );
})(window.DnD);