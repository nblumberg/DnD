/**
 * Created by nblumberg on 11/16/14.
 */

(function (DnD) {
    "use strict";
    DnD.define(
        "creatures.monsters.githyanki_warrior",
        [ "jQuery", "Creature" ],
        function(jQuery, Creature) {
            var o = {
                name: "Githyanki Warrior", level: 12, image: "../images/portraits/githyanki.jpg",
                hp: { total: 118 },
                defenses: { ac: 28, fort: 25, ref: 23, will: 22 },
                init: 13, speed: { walk: 5, jump: 5 },
                abilities: { STR: 21, CON: 14, DEX: 17, INT: 12, WIS: 12, CHA: 13 },
                skills: { acrobatics: 0, arcana: 0, athletics: 0, bluff: 0, diplomacy: 0, dungeoneering: 0, endurance: 0, heal: 0, history: 9, insight: 12, intimidate: 0, nature: 0, perception: 12, religion: 0, stealth: 0, streetwise: 0, thievery: 0 },
                attacks: [
                    { name: "Silver Greatsword", usage: { frequency: "At-Will" }, range: "melee", toHit: 17, defense: "AC", damage: [ "1d10+5", { amount: "1d6", type: "psychic" } ], keywords: [ "melee", "psychic", "basic" ] },
                    { name: "Silver Greatsword (immobilized)", usage: { frequency: "At-Will" }, range: "melee", toHit: "automatic", defense: "AC", damage: { amount: "3d6", type: "psychic" }, keywords: [ "melee", "psychic" ] },
                    { name: "Telekinetic Grasp", usage: { frequency: "Encounter" }, target: { range: 5 }, toHit: 15, defense: "Fort", damage: "0", effects: [
                        { name: "Immobilized", saveEnds: true }
                    ], keywords: [ "ranged" ] }
                ]
            };
            return jQuery.extend(true, {}, Creature.base, o);
        },
        false
    );
})(window.DnD);