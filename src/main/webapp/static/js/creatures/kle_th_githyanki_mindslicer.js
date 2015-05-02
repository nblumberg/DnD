/**
 * Created by nblumberg on 11/16/14.
 */

(function (DnD) {
    "use strict";
    DnD.define(
        "creatures.monsters.kle_th_githyanki_mindslicer",
        [ "jQuery", "Creature" ],
        function(jQuery, Creature) {
            var o = {
                name: "Kle'th, Githyanki Mindslicer", level: 13, image: "../images/portraits/kle_th.jpg", // http://cdn.obsidianportal.com/images/121677/githyanki_2_2.jpg
                hp: { total: 98 },
                defenses: { ac: 27, fort: 24, ref: 25, will: 24 },
                init: 11, speed: { walk: 6, jump: 5 },
                abilities: { STR: 14, CON: 14, DEX: 16, INT: 17, WIS: 12, CHA: 11 },
                skills: { acrobatics: 0, arcana: 0, athletics: 0, bluff: 0, diplomacy: 0, dungeoneering: 0, endurance: 0, heal: 0, history: 11, insight: 12, intimidate: 0, nature: 0, perception: 12, religion: 0, stealth: 0, streetwise: 0, thievery: 0 },
                attacks: [
                    { name: "Silver Longsword", usage: { frequency: "At-Will" }, range: "melee", toHit: 18, defense: "AC", damage: [ "1d8+2", { amount: "1d8", type: "psychic" } ], keywords: [ "melee", "psychic", "basic" ] },
                    { name: "Mindslice", usage: { frequency: "At-Will" }, target: { range: 10 }, toHit: 16, defense: "Will", damage: { amount: "2d8+3", type: "psychic" }, keywords: [ "ranged", "psychic" ] },
                    { name: "Unstable Balance", usage: { frequency: "Encounter" }, target: { area: "burst", size: 3, range: 20 }, toHit: 16, defense: "Will", damage: { amount: "2d6+3", type: "psychic" }, effects: [
                        { name: "Prone" }
                    ], keywords: [ "ranged", "psychic" ] },
                    { name: "Psychic Barrage", usage: { frequency: "Recharge", recharge: 6 }, target: { area: "burst", size: 1, range: 20 }, toHit: 16, defense: "Will", damage: { amount: "1d6+3", type: "psychic" }, effects: [
                        { name: "ongoing damage", amount: 5, type: "psychic", saveEnds: true }
                    ], keywords: [ "ranged", "psychic" ] }
                ]
            };
            return jQuery.extend(true, {}, Creature.base, o);
        },
        false
    );
})(window.DnD);