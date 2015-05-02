/**
 * Created by nblumberg on 11/16/14.
 */

(function (DnD) {
    "use strict";
    DnD.define(
        "creatures.monsters.storm_abishai_sniper",
        [ "jQuery", "Creature" ],
        function(jQuery, Creature) {
            var o = {
                name: "Storm Abishai Sniper", level: 12, image: "../images/portraits/storm_abishai.jpg",
                hp: { total: 98 },
                regeneration: 5,
                defenses: { ac: 24, fort: 24, ref: 24, will: 22 },
                init: 9, speed: { walk: 8, fly: 6 },
                abilities: { STR: 18, CON: 20, DEX: 16, INT: 11, WIS: 13, CHA: 21 },
                skills: { acrobatics: 0, arcana: 0, athletics: 0, bluff: 0, diplomacy: 0, dungeoneering: 0, endurance: 0, heal: 0, history: 0, insight: 0, intimidate: 0, nature: 0, perception: 23, religion: 0, stealth: 0, streetwise: 0, thievery: 0 },
                attacks: [
                    { name: "Lightning Sting", usage: { frequency: "At-Will" }, range: "melee", toHit: 19, defense: "AC", damage: { amount: "2d6+7", type: "lightning" }, keywords: [ "melee", "basic", "lightning" ] },
                    { name: "Lightning Discharge", usage: { frequency: "Encounter" }, target: { area: "close burst", size: 1, range: 1 }, toHit: 17, defense: "Ref", damage: { amount: "1d6+8", type: "lightning" }, effects: [
                        { name: "Stunned", duration: "endTargetNext" }
                    ], keywords: [ "close burst", "lightning" ] },
                    { name: "Shockbolt", usage: { frequency: "At-Will" }, target: { area: "burst", size: 2, range: 10 }, toHit: 15, defense: "Ref", damage: { amount: "2d6+8", type: "thunder" }, keywords: [ "ranged", "burst", "lightning" ] }
                ]
            };
            return jQuery.extend(true, {}, Creature.base, o);
        },
        false
    );
})(window.DnD);