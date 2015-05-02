/**
 * Created by nblumberg on 11/16/14.
 */

(function (DnD) {
    "use strict";
    DnD.define(
        "creatures.monsters.odos",
        [ "jQuery", "Creature" ],
        function(jQuery, Creature) {
            var o = {
                name: "Odos", level: 16, image: "../images/portraits/odos.jpg",
                hp: { total: 312 },
                defenses: { ac: 30, fort: 28, ref: 28, will: 30 },
                savingThrows: 2,
                actionPoints: 1,
                init: 15, speed: 8,
                abilities: { STR: 16, CON: 20, DEX: 21, INT: 15, WIS: 24, CHA: 15 },
                skills: { acrobatics: 20, arcana: 0, athletics: 18, bluff: 0, diplomacy: 0, dungeoneering: 0, endurance: 0, heal: 0, history: 0, insight: 20, intimidate: 0, nature: 0, perception: 20, religion: 0, stealth: 0, streetwise: 0, thievery: 0 },
                attacks: [
                    { name: "Hammer Strike", usage: { frequency: "At-Will" }, range: "melee", toHit: 21, defense: "AC", crit: 19, damage: "2d8+5", effects: [ "Prone" ], keywords: [ "melee", "basic" ] },
                    { name: "Knock Out of Sync", usage: { frequency: "At-Will" }, range: "melee", toHit: 21, defense: "AC", crit: 19, damage: "3d8+5", effects: [
                        { name: "penalty", type: "initiative", amount: 5 }
                    ], keywords: [ "melee" ] },
                    { name: "Jumping Sparks", usage: { frequency: "At-Will" }, target: { count: 3 }, range: 10, toHit: 19, defense: "Fort", damage: { amount: "2d8+7", type: "lightning" }, keywords: [ "ranged", "lightning", "teleportation" ] },
                    { name: "Psychic Blows", usage: { frequency: "Encounter" }, target: { area: "close burst", size: 5 }, toHit: 20, defense: "Will", damage: { amount: "2d8+5", type: "psychic" }, keywords: [ "ranged", "psychic" ] }
                ]
            };
            return jQuery.extend(true, {}, Creature.base, o);
        },
        false
    );
})(window.DnD);