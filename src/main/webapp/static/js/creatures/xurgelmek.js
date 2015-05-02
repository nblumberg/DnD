/**
 * Created by nblumberg on 11/16/14.
 */

(function (DnD) {
    "use strict";
    DnD.define(
        "creatures.monsters.xurgelmek",
        [ "jQuery", "Creature" ],
        function(jQuery, Creature) {
            var o = {
                name: "Xurgelmek", level: 15, image: "../images/portraits/xurgelmek.jpg",
                hp: { total: 360 },
                defenses: { ac: 27, fort: 38, ref: 26, will: 27 },
                resistances: { cold: 10 },
                init: 11, speed: { walk: 5, swim: 7, charge: 7 },
                actionPoints: 1,
                savingThrows: 2,
                abilities: { STR: 22, CON: 18, DEX: 18, INT: 12, WIS: 12, CHA: 16 },
                skills: { acrobatics: 0, arcana: 0, athletics: 0, bluff: 0, diplomacy: 0, dungeoneering: 0, endurance: 0, heal: 0, history: 0, insight: 0, intimidate: 15, nature: 0, perception: 8, religion: 0, stealth: 0, streetwise: 0, thievery: 0 },
                attackBonuses: [
                    {
                        name: "Blood Hunger",
                        foeStatus: [ "bloodied" ],
                        toHit: 2,
                        damage: 5
                    }
                ],
                attacks: [
                    { name: "Trident", usage: { frequency: "At-Will" }, target: { range: 2 }, range: "melee", toHit: 18, defense: "AC", damage: [
                        { amount: "1d10+7" },
                        { amount: "1d10", type: "cold" }
                    ], keywords: [ "melee", "basic", "cold", "weapon" ] },
                    { name: "Bloodchill Claw", usage: { frequency: "At-Will" }, target: { range: 2 }, range: "melee", toHit: 18, defense: "AC", damage: { amount: "1d6+7" }, effects: [
                        { name: "multiple", saveEnds: true, children: [
                            { name: "ongoing damage", amount: 5, type: "cold" },
                            { name: "Slowed" }
                        ] }
                    ], keywords: [ "melee", "basic", "cold" ] },
                    { name: "Javelin", usage: { frequency: "At-Will" }, range: 10, toHit: 18, defense: "AC", damage: { amount: "2d8+7" }, keywords: [ "ranged", "weapon" ] }
                ],
                healing: [
                    { name: "Blood Healing", frequency: "At-Will", isTempHP: false, usesHealingSurge: false, amount: "5" }
                ]
            };
            return jQuery.extend(true, {}, Creature.base, o);
        },
        false
    );
})(window.DnD);