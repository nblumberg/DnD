/**
 * Created by nblumberg on 11/16/14.
 */

(function (DnD) {
    "use strict";
    DnD.define(
        "creatures.monsters.icetouched_umber_hulk",
        [ "jQuery", "Creature" ],
        function(jQuery, Creature) {
            var o = {
                name: "Icetouched Umber Hulk", level: 14, image: "../images/portraits/umberhulk.jpg",
                hp: { total: 248 },
                defenses: { ac: 30, fort: 33, ref: 28, will: 27 },
                resistances: { "cold": 10 },
                savingThrows: 2,
                init: 11, speed: { walk: 5, burrow: 2 },
                abilities: { STR: 26, CON: 20, DEX: 16, INT: 5, WIS: 14, CHA: 11 },
                skills: { acrobatics: 0, arcana: 0, athletics: 0, bluff: 0, diplomacy: 0, dungeoneering: 0, endurance: 0, heal: 0, history: 0, insight: 0, intimidate: 0, nature: 0, perception: 13, religion: 0, stealth: 0, streetwise: 0, thievery: 0 },
                attacks: [
                    { name: "Claw", usage: { frequency: "At-Will" }, target: { range: 2 }, range: "melee", toHit: 18, defense: "AC", damage: "2d6+8", keywords: [ "melee", "basic" ] },
                    { name: "Grabbing Double", usage: { frequency: "At-Will" }, target: { range: 2 }, range: "melee", toHit: "automatic", defense: "AC", damage: "0", effects: [ { name: "Grabbed" }, { name: "ongoing damage", amount: 10 } ], keywords: [ "melee" ] },
                    { name: "Confusing Gaze", usage: { frequency: "At-Will" }, target: { area: "close blast", size: 5, enemiesOnly: true }, toHit: 16, defense: "Will", damage: "0", effects: [ { name: "dazed", saveEnds: true } ], keywords: [ "gaze", "psychic" ] }
                ]
            };
            return jQuery.extend(true, {}, Creature.base, o);
        },
        false
    );
})(window.DnD);