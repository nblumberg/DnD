/**
 * Created by nblumberg on 11/16/14.
 */

(function (DnD) {
    "use strict";
    DnD.define(
        "creatures.monsters.iquel_githyanki_captain",
        [ "jQuery", "Creature" ],
        function(jQuery, Creature) {
            var o = {
                name: "Iquel, Githyanki Captain", level: 13, image: "../images/portraits/iquel.jpg",
                hp: { total: 256 },
                defenses: { ac: 29, fort: 26, ref: 25, will: 25 },
                savingThrows: 2,
                init: 11, speed: { walk: 6, jump: 8, teleport: 6 },
                abilities: { STR: 21, CON: 16, DEX: 12, INT: 18, WIS: 19, CHA: 16 },
                skills: { acrobatics: 0, arcana: 15, athletics: 0, bluff: 0, diplomacy: 0, dungeoneering: 0, endurance: 0, heal: 0, history: 17, insight: 0, intimidate: 0, nature: 0, perception: 10, religion: 0, stealth: 0, streetwise: 0, thievery: 0 },
                attacks: [
                    { name: "Silver Greatsword", usage: { frequency: "At-Will" }, range: "melee", toHit: 18, defense: "AC", damage: [ "1d10+6", { amount: "1d10", type: "psychic" } ], keywords: [ "melee", "psychic", "basic" ] },
                    { name: "Silver Greatsword (immobilized)", usage: { frequency: "At-Will" }, range: "melee", toHit: "automatic", defense: "AC", damage: { amount: "2d10", type: "psychic" }, keywords: [ "melee", "psychic" ] },
                    { name: "Mindhook", usage: { frequency: "At-Will" }, target: { range: 10 }, toHit: 17, defense: "Will", damage: { amount: "2d8+3", type: "psychic" }, effects: [ "Marked" ], keywords: [ "ranged", "psychic", "basic" ] },
                    { name: "Psychic Upheaval", usage: { frequency: "Encounter" }, target: { area: "close burst", size: 3 }, toHit: 16, defense: "Fort", damage: { amount: "2d10+4", type: "psychic" }, effects: [
                        { name: "Immobilized", saveEnds: true }
                    ], keywords: [ "ranged", "psychic" ] }
                ]
            };
            return jQuery.extend(true, {}, Creature.base, o);
        },
        false
    );
})(window.DnD);