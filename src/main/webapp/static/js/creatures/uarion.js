/**
 * Created by nblumberg on 11/16/14.
 */

(function (DnD) {
    "use strict";
    DnD.define(
        "creatures.monsters.uarion",
        [ "jQuery", "Creature" ],
        function(jQuery, Creature) {
            var o = {
                name: "Uarion", level: 14, image: "../images/portraits/uarion.jpg",
                hp: { total: 105 },
                defenses: { ac: 28, fort: 24, ref: 26, will: 26 },
                resistances: { cold: 10 },
                init: 13, speed: 7,
                abilities: { STR: 13, CON: 15, DEX: 19, INT: 13, WIS: 19, CHA: 10 },
                skills: { acrobatics: 18, arcana: 13, athletics: 10, bluff: 0, diplomacy: 0, dungeoneering: 0, endurance: 0, heal: 0, history: 0, insight: 16, intimidate: 0, nature: 0, perception: 16, religion: 0, stealth: 0, streetwise: 0, thievery: 0 },
                attacks: [
                    { name: "Unarmed Strike", usage: { frequency: "At-Will" }, range: "melee", toHit: 19, defense: "AC", damage: "2d8+4", keywords: [ "melee", "basic" ] },
                    { name: "Mindstrike", usage: { frequency: "At-Will" }, target: { range: 20 }, toHit: 17, defense: "Ref", damage: { amount: "2d8+4", type: "psychic" }, effect: [
                        { name: "Dazed", saveEnds: true }
                    ], keywords: [ "ranged", "psychic" ] },
                    { name: "Elemental Bolts (acid)", usage: { frequency: "Daily" }, target: { range: 10 }, toHit: 17, defense: "Ref", damage: { amount: "4d8", type: "acid" }, keywords: [ "ranged", "acid" ] },
                    { name: "Elemental Bolts (cold)", usage: { frequency: "Daily" }, target: { range: 10 }, toHit: 17, defense: "Ref", damage: { amount: "4d8", type: "cold" }, keywords: [ "ranged", "cold" ] },
                    { name: "Elemental Bolts (fire)", usage: { frequency: "Daily" }, target: { range: 10 }, toHit: 17, defense: "Ref", damage: { amount: "4d8", type: "fire" }, keywords: [ "ranged", "fire" ] },
                    { name: "Elemental Bolts (lightning)", usage: { frequency: "Daily" }, target: { range: 10 }, toHit: 17, defense: "Ref", damage: { amount: "4d8", type: "lightning" }, keywords: [ "ranged", "lightning" ] },
                    { name: "Concussion Orb", usage: { frequency: "Encounter" }, target: { area: "burst", size: 2, range: 10 }, toHit: 17, defense: "Fort", damage: "1d10+4", effects: [
                        { name: "Prone" }
                    ], keywords: [ "ranged", "burst" ] }
                ]
            };
            return jQuery.extend(true, {}, Creature.base, o);
        },
        false
    );
})(window.DnD);