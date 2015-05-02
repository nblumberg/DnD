/**
 * Created by nblumberg on 11/16/14.
 */

(function (DnD) {
    "use strict";
    DnD.define(
        "creatures.monsters.winter_wolf",
        [ "jQuery", "Creature" ],
        function(jQuery, Creature) {
            var o = {
                name: "Winter Wolf", level: 9, image: "../images/portraits/winter_wolf.jpg",
                hp: { total: 141 },
                defenses: { ac: 28, fort: 27, ref: 26, will: 24 },
                resistances: { cold: 20 },
                init: 14, speed: { walk: 8 },
                abilities: { STR: 23, CON: 21, DEX: 21, INT: 9, WIS: 17, CHA: 10 },
                skills: { acrobatics: 0, arcana: 0, athletics: 0, bluff: 0, diplomacy: 0, dungeoneering: 0, endurance: 0, heal: 0, history: 0, insight: 0, intimidate: 0, nature: 0, perception: 10, religion: 0, stealth: 0, streetwise: 0, thievery: 0 },
                attacks: [
                    { name: "Bite", usage: { frequency: "At-Will" }, target: { range: 1 }, range: "melee", toHit: 19, defense: "AC", damage: [ "1d10+6", { amount: "1d6", type: "cold" } ], keywords: [ "melee", "basic", "cold" ] },
                    { name: "Bite (prone)", usage: { frequency: "At-Will" }, target: { range: 1 }, range: "melee", toHit: 19, defense: "AC", damage: [ "2d10+6", { amount: "1d6", type: "cold" } ], keywords: [ "melee", "basic", "cold" ] },
                    { name: "Takedown", usage: { frequency: "At-Will" }, target: { range: 1 }, range: "melee", toHit: 19, defense: "AC", damage: [ "2d10+6", { amount: "1d6", type: "cold" } ], effects: [ { name: "prone" } ], keywords: [ "melee", "cold" ] },
                    { name: "Freezing Breath", usage: { frequency: "Recharge", recharge: 5 }, target: { area: "close blast", size: 5 }, toHit: 17, defense: "Ref", damage: { amount: "2d6+6", type: "cold" }, miss: { halfDamage: true }, keywords: [ "melee", "cold", "breath" ] }
                ]
            };
            return jQuery.extend(true, {}, Creature.base, o);
        },
        false
    );
})(window.DnD);