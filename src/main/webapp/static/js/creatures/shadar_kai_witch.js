/**
 * Created by nblumberg on 11/16/14.
 */

(function (DnD) {
    "use strict";
    DnD.define(
        "creatures.monsters.shadar_kai_witch",
        [ "jQuery", "Creature" ],
        function(jQuery, Creature) {
            var o = {
                name: "Shadar-kai Witch", level: 13, image: "../images/portraits/shadar_kai_witch.jpg",
                hp: { total: 272 },
                defenses: { ac: 30, fort: 27, ref: 29, will: 25 },
                init: 11, speed: { walk: 6, teleport: 3 },
                abilities: { STR: 13, CON: 13, DEX: 16, INT: 19, WIS: 12, CHA: 17 },
                skills: { acrobatics: 8, arcana: 12, athletics: 0, bluff: 0, diplomacy: 0, dungeoneering: 0, endurance: 0, heal: 0, history: 0, insight: 0, intimidate: 0, nature: 0, perception: 4, religion: 12, stealth: 13, streetwise: 0, thievery: 0 },
                attacks: [
                    { name: "Blackfire Touch", usage: { frequency: "At-Will" }, range: "melee", toHit: 18, defense: "Ref", damage: { amount: "2d8+6", type: [ "fire", "necrotic" ] }, keywords: [ "melee", "fire", "necrotic", "fire and necrotic", "basic" ] },
                    { name: "Beshadowed Mind", usage: { frequency: "Recharge", recharge: 4 }, range: 10, toHit: 18, defense: "Will", damage: { amount: "3d6+6", type: "necrotic" }, effects: [
                        { name: "blinded", saveEnds: true }
                    ], keywords: [ "melee", "necrotic" ] },
                    { name: "Deep Shadow", usage: { frequency: "At-Will" }, range: 2, toHit: "automatic", defense: "AC", damage: { amount: "5", type: "necrotic" }, keywords: [ "aura", "necrotic" ] },
                    { name: "Ebon Burst", usage: { frequency: "Encounter" }, target: { area: "close burst", size: 2 }, toHit: 18, defense: "Ref", damage: "2d8+6", effects: [
                        { name: "Slowed", duration: "endAttackerNext" }
                    ], keywords: [ "ranged" ] }
                ]
            };
            return jQuery.extend(true, {}, Creature.base, o);
        },
        false
    );
})(window.DnD);