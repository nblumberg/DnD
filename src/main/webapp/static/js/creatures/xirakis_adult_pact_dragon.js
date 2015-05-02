/**
 * Created by nblumberg on 11/16/14.
 */

(function (DnD) {
    "use strict";
    DnD.define(
        "creatures.monsters.xirakis_adult_pact_dragon",
        [ "jQuery", "Creature" ],
        function(jQuery, Creature) {
            var o = {
                name: "Xirakis, Adult Pact Dragon", level: 13, image: "../images/portraits/xirakis.jpg",
                hp: { total: 268 },
                defenses: { ac: 29, fort: 28, ref: 27, will: 25 },
                resistances: { fire: 10, psychic: 10 },
                init: 13, speed: { walk: 7, fly: 10 },
                abilities: { STR: 24, CON: 22, DEX: 20, INT: 15, WIS: 18, CHA: 16 },
                skills: { acrobatics: 0, arcana: 0, athletics: 0, bluff: 0, diplomacy: 14, dungeoneering: 0, endurance: 17, heal: 0, history: 0, insight: 15, intimidate: 0, nature: 0, perception: 15, religion: 0, stealth: 0, streetwise: 0, thievery: 0 },
                attacks: [
                    { name: "Bite", usage: { frequency: "At-Will" }, range: "reach", toHit: 18, defense: "AC", damage: "2d6+7", keywords: [ "melee", "basic" ] },
                    { name: "Claw", usage: { frequency: "At-Will" }, range: "reach", toHit: 18, defense: "AC", damage: "1d8+7", keywords: [ "melee", "basic" ] },
                    { name: "Ripping Charger (Bite)", usage: { frequency: "At-Will" }, range: "reach", toHit: 18, defense: "AC", damage: "2d6+7", keywords: [ "melee" ] },
                    { name: "Ripping Charger (Claw)", usage: { frequency: "At-Will" }, range: "reach", toHit: 18, defense: "AC", damage: "1d8+7", keywords: [ "melee" ] },
                    { name: "Wing Buffet", usage: { frequency: "At-Will", action: "Immediate Reaction" }, range: "melee", toHit: 15, defense: "Fort", damage: "1d10+7", effects: [ "Prone" ], keywords: [ "melee" ] },
                    { name: "Skirmish", usage: { frequency: "At-Will" }, range: "melee", toHit: "automatic", defense: "AC", damage: "2d6", keywords: [ "melee", "striker", "skirmish" ] },
                    { name: "Breath Weapon", usage: { frequency: "Recharge", recharge: 5 }, target: { area: "close blast", size: 5 }, toHit: 15, defense: "Ref", damage: { amount: "3d12+12", type: "fire" }, effects: [
                        { name: "ongoing damage", amount: 5, type: "fire", saveEnds: true }
                    ], keywords: [ "close blast", "fire" ] }
                ]
            };
            return jQuery.extend(true, {}, Creature.base, o);
        },
        false
    );
})(window.DnD);