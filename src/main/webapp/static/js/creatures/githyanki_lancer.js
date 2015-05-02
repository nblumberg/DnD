/**
 * Created by nblumberg on 11/16/14.
 */

(function (DnD) {
    "use strict";
    DnD.define(
        "creatures.monsters.githyanki_lancer",
        [ "jQuery", "Creature" ],
        function(jQuery, Creature) {
            var o = {
                name: "Githyanki Lancer", level: 14, image: "../images/portraits/githyanki_lancer.jpg", // http://scalesofwar4.webs.com/62githyanki.jpg
                hp: { total: 134 },
                defenses: { ac: 28, fort: 26, ref: 26, will: 25 },
                init: 15, speed: { walk: 5 },
                abilities: { STR: 19, CON: 14, DEX: 18, INT: 15, WIS: 16, CHA: 11 },
                skills: { acrobatics: 16, arcana: 0, athletics: 0, bluff: 0, diplomacy: 0, dungeoneering: 0, endurance: 0, heal: 0, history: 0, insight: 0, intimidate: 0, nature: 0, perception: 10, religion: 0, stealth: 0, streetwise: 0, thievery: 0 },
                attacks: [
                    { name: "Psychic Lance", usage: { frequency: "At-Will" }, range: "reach", toHit: 19, defense: "AC", damage: { amount: "2d10+5", type: "psychic" }, keywords: [ "melee", "psychic", "basic" ] },
                    { name: "Silver Longsword", usage: { frequency: "At-Will" }, range: "melee", toHit: 19, defense: "AC", damage: [ "1d8+5", { amount: "1d8", type: "psychic" } ], keywords: [ "melee", "psychic", "basic" ] },
                    { name: "Mindslice", usage: { frequency: "At-Will" }, target: { range: 10 }, toHit: 17, defense: "Will", damage: { amount: "2d8+5", type: "psychic" }, keywords: [ "ranged", "psychic" ] }
                ]
            };
            return jQuery.extend(true, {}, Creature.base, o);
        },
        false
    );
})(window.DnD);