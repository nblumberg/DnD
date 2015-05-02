/**
 * Created by nblumberg on 11/16/14.
 */

(function (DnD) {
    "use strict";
    DnD.define(
        "creatures.monsters.telicanthus",
        [ "jQuery", "Creature" ],
        function(jQuery, Creature) {
            var o = {
                name: "Telicanthus", level: 16, image: "../images/portraits/telicanthus.png",
                hp: { total: 308 },
                defenses: { ac: 30, fort: 27, ref: 28, will: 30 },
                init: 13, speed: { walk: 6, fly: 6 },
                actionPoints: 1,
                savingThrows: 2,
                abilities: { STR: 12, CON: 18, DEX: 17, INT: 21, WIS: 18, CHA: 24 },
                skills: { acrobatics: 0, arcana: 0, athletics: 0, bluff: 23, diplomacy: 23, dungeoneering: 0, endurance: 0, heal: 0, history: 0, insight: 17, intimidate: 0, nature: 0, perception: 11, religion: 0, stealth: 0, streetwise: 0, thievery: 0 },
                attacks: [
                    { name: "Mindhammer", usage: { frequency: "At-Will" }, range: 10, toHit: 20, defense: "Will", damage: { amount: "2d8+7", type: "psychic" }, effects: [
                        { name: "Slowed", duration: "endAttackerNext" }
                    ], keywords: [ "melee", "ranged", "psychic", "basic" ] },
                    { name: "Force Switch", usage: { frequency: "Recharge", recharge: 5 }, target: { range: 4 }, toHit: 20, defense: "Fort", damage: { amount: "2d10+5", type: "force" }, keywords: [ "ranged", "force" ] },
                    { name: "Suffering Ties", usage: { frequency: "Encounter" }, range: "melee", toHit: 20, defense: "Fort", damage: { amount: "1d10+7", type: "psychic" }, effects: [
                        { name: "Suffering Ties", duration: "startAttackerNext" }
                    ], keywords: [ "melee", "psychic" ] },
                    { name: "Binding Suggestions", usage: { frequency: "Recharge", recharge: 6 }, target: { area: "close", size: 2 }, toHit: 18, defense: "Will", damage: "0", effects: [
                        { name: "Dazed", saveEnds: true }
                    ], keywords: [ "close burst", "psychic" ] },
                    { name: "Binding Suggestions (secondary)", usage: { frequency: "At-Will" }, toHit: 20, defense: "Will", damage: { amount: "7", type: "psychic" }, effects: [
                        { name: "Dominated", saveEnds: true }
                    ], miss: { damage: { amount: "2d6+7", type: "psychic" } }, keywords: [ "psychic" ] }
                ]
            };
            return jQuery.extend(true, {}, Creature.base, o);
        },
        false
    );
})(window.DnD);