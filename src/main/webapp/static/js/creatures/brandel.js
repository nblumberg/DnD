/**
 * Created by nblumberg on 11/16/14.
 */

(function (DnD) {
    "use strict";
    DnD.define(
        "creatures.monsters.brandel",
        [ "jQuery", "Creature", "creature.helpers" ],
        function(jQuery, Creature, CH) {
            var o = {
                name: "Brandel", level: 1, image: "https://s-media-cache-ak0.pinimg.com/originals/66/d2/a4/66d2a48aa241e6707644eba547e806a0.jpg",
                hp: { total: 29 },
                defenses: { ac: 18, fort: 14, ref: 13, will: 13 },
                init: 0, speed: 5,
                abilities: { STR: 16, CON: 14, DEX: 10, INT: 9, WIS: 9, CHA: 12 },
                skills: { perception: -1 },
                attacks: [
                    { name: "Flailing Defense", usage: { frequency: "At-Will" }, range: 1, toHit: "automatic", defense: "AC", damage: "4", keywords: [ "aura" ] },
                    { name: "Longsword", usage: { frequency: "At-Will" }, range: "melee", toHit: 6, defense: "AC", damage: "1d10+3", keywords: [ "melee", "basic" ] },
                    { name: "Furious Slash", usage: { frequency: "At-Will" }, range: "melee", toHit: 6, defense: "AC", damage: "1d8+3", keywords: [ "melee" ] }
                ]
            };
            return jQuery.extend(true, {}, Creature.base, o);
        },
        false
    );
})(window.DnD);