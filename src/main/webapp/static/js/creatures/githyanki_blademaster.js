/**
 * Created by nblumberg on 11/16/14.
 */

(function (DnD) {
    "use strict";
    DnD.define(
        "creatures.monsters.githyanki_blademaster",
        [ "jQuery", "Creature" ],
        function(jQuery, Creature) {
            var o = {
                name: "Githyanki Blademaster", level: 17, image: "../images/portraits/githyanki_lancer.jpg", // http://scalesofwar4.webs.com/62githyanki.jpg
                hp: { total: 1 },
                defenses: { ac: 28, fort: 25, ref: 23, will: 22 },
                init: 15, speed: { walk: 5 },
                abilities: { STR: 24, CON: 15, DEX: 21, INT: 13, WIS: 12, CHA: 21 },
                attacks: [
                    { name: "Silver Longsword", usage: { frequency: "At-Will" }, range: "melee", toHit: 22, defense: "AC", damage: { amount: "8", type: "psychic" }, keywords: [ "melee", "psychic", "basic" ] },
                    { name: "Twin Longsword Strike", usage: { frequency: "At-Will" }, range: "melee", toHit: 22, defense: "AC", damage: { amount: "12", type: "psychic" }, keywords: [ "melee", "psychic" ] }
                ]
            };
            return jQuery.extend(true, {}, Creature.base, o);
        },
        false
    );
})(window.DnD);