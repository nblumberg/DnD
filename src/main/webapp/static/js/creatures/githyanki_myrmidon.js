/**
 * Created by nblumberg on 11/16/14.
 */

(function (DnD) {
    "use strict";
    DnD.define(
        "creatures.monsters.githyanki_myrmidon",
        [ "jQuery", "Creature" ],
        function(jQuery, Creature) {
            var o = {
                name: "Githyanki Myrmidon", level: 12, image: "../images/portraits/githyanki_thug.jpg",
                hp: { total: 1 },
                defenses: { ac: 28, fort: 24, ref: 23, will: 24 },
                init: 12, speed: 5,
                abilities: { STR: 16, CON: 12, DEX: 14, INT: 12, WIS: 16, CHA: 10 },
                skills: { acrobatics: 0, arcana: 0, athletics: 0, bluff: 0, diplomacy: 0, dungeoneering: 0, endurance: 0, heal: 0, history: 0, insight: 0, intimidate: 0, nature: 0, perception: 9, religion: 0, stealth: 0, streetwise: 0, thievery: 0 },
                attacks: [
                    { name: "Silver Short Sword", usage: { frequency: "At-Will" }, range: "melee", toHit: 19, defense: "AC", damage: "7", keywords: [ "melee", "psychic", "basic" ] },
                    { name: "Silver Short Sword (immobilized)", usage: { frequency: "At-Will" }, range: "melee", toHit: "automatic", defense: "AC", damage: { amount: "5", type: "psychic" }, keywords: [ "melee", "psychic" ] },
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