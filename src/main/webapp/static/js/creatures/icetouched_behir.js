/**
 * Created by nblumberg on 11/16/14.
 */

(function (DnD) {
    "use strict";
    DnD.define(
        "creatures.monsters.icetouched_behir",
        [ "jQuery", "Creature" ],
        function(jQuery, Creature) {
            var o = {
                name: "Icetouched Behir", level: 14, image: "../images/portraits/behir.png",
                hp: { total: 705 },
                defenses: { ac: 32, fort: 29, ref: 28, will: 28 },
                resistances: { "cold": 10, "lightning": 10 },
                savingThrows: 5,
                init: 14, speed: { walk: 7, climb: 5 },
                abilities: { STR: 23, CON: 21, DEX: 20, INT: 7, WIS: 21, CHA: 13 },
                skills: { acrobatics: 0, arcana: 0, athletics: 0, bluff: 0, diplomacy: 0, dungeoneering: 0, endurance: 0, heal: 0, history: 0, insight: 0, intimidate: 0, nature: 0, perception: 12, religion: 0, stealth: 0, streetwise: 0, thievery: 0 },
                attacks: [
                    { name: "Claw", usage: { frequency: "At-Will" }, target: { range: 3 }, range: "melee", toHit: 21, defense: "AC", damage: "2d8+6", keywords: [ "melee", "basic" ] },
                    { name: "Bite", usage: { frequency: "At-Will" }, target: { range: 3 }, range: "melee", toHit: 21, defense: "AC", damage: [ "1d8+6", { amount: "1d8", type: "lightning" } ], keywords: [ "melee", "lightning" ] },
                    { name: "Bite (secondary)", usage: { frequency: "At-Will" }, target: { area: "burst", size: 3 }, toHit: "automatic", defense: "AC", damage: { amount: "1d8", type: "lightning" }, keywords: [ "lightning" ] },
                    { name: "Devour", usage: { frequency: "At-Will" }, target: { range: 3 }, range: "melee", toHit: 19, defense: "Ref", damage: "2d8+6", effects: [
                        { name: "grabbed" },
                        { name: "Restrained" }
                    ], keywords: [ "melee" ] },
                    { name: "Devour (secondary)", usage: { frequency: "At-Will" }, range: "melee", toHit: "automatic", defense: "Ref", damage: "15", keywords: [ "melee" ] },
                    { name: "Lightning Breath", usage: { frequency: "Recharge", recharge: 5 }, target: { area: "close burst", size: 1 }, toHit: 17, defense: "Ref", damage: { amount: "3d10+6", type: "lightning" }, miss: { halfDamage: true }, keywords: [ "close burst", "lightning" ] },
                    { name: "Lightning Breath (secondary)", usage: { frequency: "At-Will" }, target: { area: "burst", size: 1, range: 10 }, toHit: 17, defense: "Ref", damage: { amount: "3d10+6", type: "lightning" }, miss: { halfDamage: true }, keywords: [ "close burst", "lightning" ] }
                ]
            };
            return jQuery.extend(true, {}, Creature.base, o);
        },
        false
    );
})(window.DnD);