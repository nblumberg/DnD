/**
 * Created by nblumberg on 11/16/14.
 */

(function (DnD) {
    "use strict";
    DnD.define(
        "creatures.monsters.pennel",
        [ "jQuery", "Creature" ],
        function(jQuery, Creature) {
            var o = {
                name: "Pennel", level: 14, image: "../images/portraits/pennel.jpg",
                hp: { total: 276 },
                defenses: { ac: 30, fort: 25, ref: 27, will: 26 },
                savingThrows: 2,
                actionPoints: 1,
                init: 15, speed: 6,
                abilities: { STR: 15, CON: 18, DEX: 23, INT: 17, WIS: 20, CHA: 12 },
                skills: { acrobatics: 18, arcana: 0, athletics: 0, bluff: 0, diplomacy: 0, dungeoneering: 0, endurance: 0, heal: 0, history: 0, insight: 17, intimidate: 0, nature: 0, perception: 17, religion: 0, stealth: 18, streetwise: 0, thievery: 18 },
                attacks: [
                    { name: "Crystal Dagger", usage: { frequency: "At-Will" }, range: "melee", toHit: 21, defense: "AC", damage: { amount: "3d4+8", type: "psychic" }, effects: [
                        { name: "Marked", duration: "endAttackerNext" }
                    ], keywords: [ "melee", "basic", "weapon" ] },
                    { name: "Crystal Strands", usage: { frequency: "At-Will" }, target: { range: 10 }, toHit: 19, defense: "Ref", damage: { amount: "3d4+7", type: "psychic" }, keywords: [ "ranged", "psychic", "weapon" ] },
                    { name: "Crystal Shards", usage: { frequency: "Encounter" }, target: { area: "close burst", size: 3 }, toHit: 18, defense: "Ref", damage: { amount: "2d4+7", type: "psychic" }, effects: [
                        { name: "Immobilized", saveEnds: true }
                    ], miss: { halfDamage: true, effects: [
                        { name: "Slowed", duration: "endAttackerNext" }
                    ] }, keywords: [ "ranged", "psychic" ] }
                ]
            };
            return jQuery.extend(true, {}, Creature.base, o);
        },
        false
    );
})(window.DnD);