/**
 * Created by nblumberg on 11/16/14.
 */

(function (DnD) {
    "use strict";
    DnD.define(
        "creatures.monsters.treasure_golem",
        [ "jQuery", "Creature" ],
        function(jQuery, Creature) {
            var o = {
                name: "Treasure Golem", level: 14, image: "../images/portraits/treasure_golem.png",
                hp: { total: 700 },
                defenses: { ac: 26, fort: 30, ref: 23, will: 23 },
                immunities: [ "disease", "poison" ],
                init: 5, speed: 6,
                actionPoints: 2,
                abilities: { STR: 23, CON: 25, DEX: 10, INT: 3, WIS: 8, CHA: 3 },
                skills: { acrobatics: 0, arcana: 0, athletics: 0, bluff: 0, diplomacy: 0, dungeoneering: 0, endurance: 0, heal: 0, history: 0, insight: 0, intimidate: 0, nature: 0, perception: 6, religion: 0, stealth: 0, streetwise: 0, thievery: 0 },
                attacks: [
                    { name: "Slam", usage: { frequency: "At-Will" }, range: "reach", toHit: 18, defense: "AC", damage: "2d10+6", keywords: [ "melee", "basic" ] },
                    { name: "Gleamshard", usage: { frequency: "At-Will" }, target: { range: 20 }, toHit: 26, defense: "AC", damage: { amount: "3d6+7", type: "force" }, keywords: [ "ranged", "basic" ] },
                    { name: "Hoard Blast", usage: { frequency: "Recharge", recharge: 5 }, target: { area: "close burst", size: 3 }, toHit: 22, defense: "Fort", damage: "2d10+7", keywords: [ "close burst" ] },
                    { name: "Weight of Greed", usage: { frequency: "Encounter" }, target: { area: "close burst", size: 3 }, toHit: 15, defense: "Ref", damage: { amount: "1d10+7", type: "psychic" }, miss: { halfDamage: true }, effects: [
                        { name: "Dominated", duration: "endAttackerNext" }
                    ], keywords: [ "close burst", "psychic" ] }
                ]
            };
            return jQuery.extend(true, {}, Creature.base, o);
        },
        false
    );
})(window.DnD);