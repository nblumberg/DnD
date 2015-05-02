/**
 * Created by nblumberg on 11/16/14.
 */

(function (DnD) {
    "use strict";
    DnD.define(
        "creatures.monsters.thaggriel_githyanki_dragonknight",
        [ "jQuery", "Creature" ],
        function(jQuery, Creature) {
            var o = {
                name: "Thaggriel, Githyanki Dragonknight", level: 14, image: "../images/portraits/thaggriel.png",
                hp: { total: 272 },
                defenses: { ac: 28, fort: 27, ref: 27, will: 26 },
                init: 16, speed: { walk: 5 },
                abilities: { STR: 21, CON: 16, DEX: 20, INT: 16, WIS: 18, CHA: 14 },
                skills: { acrobatics: 17, arcana: 0, athletics: 17, bluff: 0, diplomacy: 0, dungeoneering: 0, endurance: 0, heal: 0, history: 0, insight: 0, intimidate: 0, nature: 0, perception: 11, religion: 0, stealth: 0, streetwise: 0, thievery: 0 },
                attacks: [
                    { name: "Psychic Lance", usage: { frequency: "At-Will" }, range: "reach", toHit: 19, defense: "AC", damage: { amount: "2d10+5", type: "psychic" }, keywords: [ "melee", "psychic", "basic" ] },
                    { name: "Silver Bastard Sword", usage: { frequency: "At-Will" }, range: "melee", toHit: 19, defense: "AC", damage: [ "1d10+5", { amount: "1d10", type: "psychic" } ], keywords: [ "melee", "psychic", "basic" ] },
                    { name: "Mindslice", usage: { frequency: "At-Will" }, target: { range: 10 }, toHit: 17, defense: "Will", damage: { amount: "2d8+3", type: "psychic" }, keywords: [ "ranged", "psychic" ] },
                    { name: "Hatred's Juggernaught", usage: { frequency: "Recharge", recharge: 6 }, range: "reach", toHit: 19, defense: "AC", damage: { amount: "2d10+5", type: "psychic" }, keywords: [ "melee", "psychic" ] }
                ]
            };
            return jQuery.extend(true, {}, Creature.base, o);
        },
        false
    );
})(window.DnD);