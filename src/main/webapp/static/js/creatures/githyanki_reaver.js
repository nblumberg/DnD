/**
 * Created by nblumberg on 11/16/14.
 */

(function (DnD) {
    "use strict";
    DnD.define(
        "creatures.monsters.githyanki_reaver",
        [ "jQuery", "Creature" ],
        function(jQuery, Creature) {
            var o = {
                name: "Githyanki Reaver", level: 17, image: "../images/portraits/githyanki_lancer.jpg", // http://scalesofwar4.webs.com/62githyanki.jpg
                hp: { total: 197 },
                defenses: { ac: 29, fort: 30, ref: 28, will: 28 },
                init: 13, speed: { walk: 5 },
                abilities: { STR: 24, CON: 17, DEX: 21, INT: 15, WIS: 14, CHA: 21 },
                attacks: [
                    { name: "Silver Fullblade", usage: { frequency: "At-Will" }, range: "melee", toHit: 20, defense: "AC", damage: [ "2d12+4", { amount: "1d6", type: "psychic" } ], keywords: [ "melee", "psychic", "basic" ] },
                    { name: "Silver Fullblade (crit)", usage: { frequency: "At-Will" }, range: "melee", toHit: "automatic", defense: "AC", damage: "24", keywords: [ "melee", "psychic" ] },
                    { name: "(Immobilized target)", usage: { frequency: "At-Will" }, range: "melee", toHit: "automatic", defense: "AC", damage: { amount: "3d6", type: "psychic" }, keywords: [ "melee", "psychic" ] },
                    { name: "Reaving Strike", usage: { frequency: "Encounter" }, range: "melee", toHit: 18, defense: "AC", damage: [ "3d12+4", { amount: "1d6", type: "psychic" } ], effects: [ { name: "Immobilized", saveEnds: true } ], keywords: [ "melee", "psychic", "reliable" ] }
                ]
            };
            return jQuery.extend(true, {}, Creature.base, o);
        },
        false
    );
})(window.DnD);