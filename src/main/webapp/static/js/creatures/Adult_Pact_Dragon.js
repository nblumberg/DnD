/**
 * Created by nblumberg on 11/16/14.
 */

(function (DnD) {
    "use strict";
    DnD.define(
        "creatures.monsters.adult_pact_dragon",
        [ "jQuery", "Creature" ],
        function(jQuery, Creature) {
            var o = {
                name: "Adult Pact Dragon", level: 13, image: "../images/portraits/pact_dragon.jpg", // http://www.dandwiki.com/wiki/File:Dragonwarrior.jpg
                hp: { total: 134 },
                defenses: { ac: 27, fort: 26, ref: 25, will: 25 },
                resistances: { fire: 10, psychic: 10 },
                init: 13, speed: { walk: 7, fly: 10 },
                abilities: { STR: 24, CON: 22, DEX: 20, INT: 15, WIS: 18, CHA: 16 },
                skills: { diplomacy: 14, endurance: 17, insight: 15, perception: 15 },
                attacks: [
                    { name: "Bite", usage: { frequency: "At-Will" }, range: "reach", toHit: 18, defense: "AC", damage: "2d6+7", keywords: [ "melee", "basic" ] },
                    { name: "Aggressive Charger", usage: { frequency: "At-Will" }, range: "reach", toHit: 18, defense: "AC", damage: "2d6+7", keywords: [ "melee", "basic" ] },
                    { name: "Skirmish", usage: { frequency: "At-Will" }, range: "melee", toHit: "automatic", defense: "AC", damage: "2d6", keywords: [ "melee", "striker", "skirmish" ] },
                    { name: "Breath Weapon", usage: { frequency: "Recharge", recharge: 5 }, target: { area: "close blast", size: 5 }, toHit: 15, defense: "Ref", damage: { amount: "2d12+12", type: "fire" }, effects: [
                        { name: "ongoing damage", amount: 5, type: "fire", saveEnds: true }
                    ], keywords: [ "close blast", "fire" ] }
                ]
            };
            return jQuery.extend(true, {}, Creature.base, o);
        },
        false
    );
})(window.DnD);