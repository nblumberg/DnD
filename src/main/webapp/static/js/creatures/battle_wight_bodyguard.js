/**
 * Created by nblumberg on 11/16/14.
 */

(function (DnD) {
    "use strict";
    DnD.define(
        "creatures.monsters.battle_wight_bodyguard",
        [ "jQuery", "Creature" ],
        function(jQuery, Creature) {
            var o = {
                name: "Battle Wight Bodyguard", level: 11, image: "../images/portraits/battle_wight.png",
                hp: { total: 230 },
                defenses: { ac: 29, fort: 26, ref: 22, will: 23 },
                savingThrows: 2,
                immunities: [ "disease", "poison" ],
                vulnerabilities: { radiant: 5 },
                resistances: { necrotic: 10 },
                actionPoints: 1,
                init: 9, speed: { walk: 5 },
                abilities: { STR: 21, CON: 19, DEX: 14, INT: 12, WIS: 9, CHA: 21 },
                skills: { intimidate: 15, perception: 4 },
                attacks: [
                    { name: "Souldraining Longsword", usage: { frequency: "At-Will" }, range: "melee", toHit: 18, defense: "AC", damage: { amount: "1d8+5", type: "necrotic" }, effects: [
                        { name: "Immobilized", saveEnds: true },
                        { name: "Marked", duration: "endAttackerNext" }
                    ], keywords: [ "melee", "basic", "necrotic", "weapon" ] }, // TODO: target loses 1 healing surge
                    { name: "Soul Reaping", usage: { frequency: "At-Will" }, range: 5, toHit: 16, defense: "Fort", damage: { amount: "2d8+6", type: "necrotic" }, keywords: [ "ranged", "healing", "necrotic" ] }, // TODO: heals self 10
                    { name: "Chosen Target", usage: { frequency: "At-Will" }, range: "melee", toHit: 18, defense: "AC", damage: { amount: "1d8+5", type: "necrotic" }, effects: [
                        { name: "Immobilized", saveEnds: true },
                        { name: "Marked", duration: "endAttackerNext" }
                    ], keywords: [ "melee", "basic", "necrotic", "weapon" ] } // TODO: target loses 1 healing surge
                ]
            };
            return jQuery.extend(true, {}, Creature.base, o);
        },
        false
    );
})(window.DnD);