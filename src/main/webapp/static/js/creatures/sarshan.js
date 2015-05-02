/**
 * Created by nblumberg on 11/16/14.
 */

(function (DnD) {
    "use strict";
    DnD.define(
        "creatures.monsters.sarshan",
        [ "jQuery", "Creature" ],
        function(jQuery, Creature) {
            var o = {
                name: "Sarshan", level: 12, image: "../images/portraits/sarshan.png", // http://www.striemer.org/scales-of-war/images/sarshan.png
                hp: { total: 650 },
                defenses: { ac: 28, fort: 25, ref: 26, will: 25 },
                resistances: { acid: 20 },
                savingThrows: 5,
                init: 10, speed: { walk: 5, teleport: 6 },
                abilities: { STR: 31, CON: 26, DEX: 19, INT: 17, WIS: 18, CHA: 17 },
                skills: { acrobatics: 0, arcana: 23, athletics: 0, bluff: 0, diplomacy: 23, dungeoneering: 0, endurance: 0, heal: 0, history: 0, insight: 0, intimidate: 0, nature: 0, perception: 15, religion: 0, stealth: 0, streetwise: 0, thievery: 0 },
                attacks: [
                    { name: "Blood Chaos aura", usage: { frequency: "At-Will" }, target: { area: "aura", size: 1 }, toHit: "automatic", defense: "AC", damage: "0", effects: [
                        { name: "ongoing damage", amount: 10, type: "acid", saveEnds: true }
                    ], keywords: [ "aura" ] },
                    { name: "Katar", usage: { frequency: "At-Will" }, range: "melee", toHit: 17, defense: "AC", damage: "1d10+6", effects: [
                        { name: "ongoing damage", amount: 5, type: "acid", saveEnds: true }
                    ], keywords: [ "melee", "basic" ] },
                    { name: "Shadow Attack", usage: { frequency: "Recharge", recharge: 5 }, range: "melee", toHit: 17, defense: "AC", damage: "1d10+6", effects: [
                        { name: "ongoing damage", amount: 5, type: "acid", saveEnds: true }
                    ], keywords: [ "melee" ] },
                    { name: "Blood Chaos Flare", usage: { frequency: "At-Will" }, target: { area: "close blast", size: 5 }, toHit: 16, defense: "Fort", damage: "0", effects: [
                        { name: "ongoing damage", amount: 10, type: "acid", saveEnds: true }
                    ], keywords: [ "acid" ] },
                    { name: "Chaos Nova", usage: { frequency: "Recharge", recharge: 6 }, target: { area: "close burst", size: 1 }, toHit: 15, defense: "Fort", damage: { amount: "4d10+5", type: "acid" }, miss: { halfDamage: true }, keywords: [ "melee" ] },
                    { name: "Chaos Scream", usage: { frequency: "Encounter" }, target: { area: "close blast", size: 5 }, toHit: 16, defense: "Fort", damage: "0", effects: [
                        { name: "ongoing damage", amount: 10, type: "acid", saveEnds: true }
                    ], keywords: [ "acid" ] }
                ]
            };
            return jQuery.extend(true, {}, Creature.base, o);
        },
        false
    );
})(window.DnD);