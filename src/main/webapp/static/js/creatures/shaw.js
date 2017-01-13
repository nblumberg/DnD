/**
 * Created by nblumberg on 11/16/14.
 */

(function (DnD) {
    "use strict";
    DnD.define(
        "creatures.monsters.shaw",
        [ "jQuery", "Creature", "creature.helpers" ],
        function(jQuery, Creature, CH) {
            var o = {
                name: "Shaw", level: 1, image: "https://s-media-cache-ak0.pinimg.com/236x/6a/0a/65/6a0a65b4c6171bc2fba33aa734b7951d.jpg",
                hp: { total: 28 },
                defenses: { ac: 17, fort: 14, ref: 13, will: 12 },
                init: 3, speed: 5,
                abilities: { STR: 16, CON: 12, DEX: 12, INT: 9, WIS: 10, CHA: 9 },
                skills: { perception: 0 },
                attacks: [
                    { name: "Relentless Aura", usage: { frequency: "At-Will" }, range: 1, toHit: "automatic", defense: "AC", damage: "3", keywords: [ "aura" ] },
                    { name: "Mace", usage: { frequency: "At-Will" }, range: "melee", toHit: 6, defense: "AC", damage: "1d8+3", keywords: [ "melee", "basic" ] },
                    { name: "Drive Back", usage: { frequency: "At-Will" }, range: "melee", toHit: 6, defense: "AC", damage: "1d8+3", keywords: [ "melee" ] },
                    { name: "Crossbow", usage: { frequency: "At-Will" }, range: 15, toHit: 6, defense: "AC", damage: "1d6+1", keywords: [ "ranged", "basic" ] }
                ]
            };
            return jQuery.extend(true, {}, Creature.base, o);
        },
        false
    );
})(window.DnD);