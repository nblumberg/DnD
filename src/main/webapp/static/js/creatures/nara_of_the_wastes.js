/**
 * Created by nblumberg on 11/16/14.
 */

(function (DnD) {
    "use strict";
    DnD.define(
        "creatures.monsters.nara_of_the_wastes",
        [ "jQuery", "Creature" ],
        function(jQuery, Creature) {
            var o = {
                name: "Nara of the Wastes", level: 19, image: "../images/portraits/nara.jpg",
                hp: { total: 182 },
                defenses: { ac: 32, fort: 32, ref: 29, will: 33 },
                resistances: { cold: 15 },
                init: 12, speed: { walk: 8 },
                abilities: { STR: 21, CON: 22, DEX: 16, INT: 10, WIS: 25, CHA: 22 },
                skills: { acrobatics: 0, arcana: 14, athletics: 0, bluff: 0, diplomacy: 0, dungeoneering: 0, endurance: 0, heal: 21, history: 0, insight: 0, intimidate: 20, nature: 0, perception: 16, religion: 0, stealth: 0, streetwise: 0, thievery: 0 },
                attacks: [
                    { name: "Freezing Flail", usage: { frequency: "At-Will" }, target: { range: 2 }, range: "melee", toHit: 24, defense: "AC", damage: { amount: "2d12+4", type: "cold" }, keywords: [ "melee", "basic", "cold", "weapon" ] },
                    { name: "Freezing Bolt", usage: { frequency: "At-Will" }, target: { range: 20 }, toHit: 22, defense: "Ref", damage: { amount: "2d12+4", type: "cold" }, effects: [ { name: "immobilized", saveEnds: true } ], keywords: [ "ranged", "cold" ] },
                    { name: "Ice Slide", usage: { frequency: "At-Will" }, target: { range: 10 }, toHit: 22, defense: "Fort", damage: "0", keywords: [ "ranged" ] },
                    { name: "Wall of Frost", usage: { frequency: "Recharge", recharge: 6 }, target: { area: "wall", size: 12, range: 10 }, toHit: "automatic", defense: "AC", damage: "0", keywords: [ "ranged", "cold", "conjuration", "wall" ] },
                    { name: "Wall of Frost (adjacent)", usage: { frequency: "At-Will" }, target: { range: 1 }, toHit: "automatic", defense: "AC", damage: { amount: "5", type: "cold" }, keywords: [ "ranged", "cold", "conjuration", "wall" ] },
                    { name: "Wall of Frost (inside)", usage: { frequency: "At-Will" }, target: { range: 0 }, toHit: "automatic", defense: "AC", damage: { amount: "15", type: "cold" }, keywords: [ "ranged", "cold", "conjuration", "wall" ] }
                ]
            };
            return jQuery.extend(true, {}, Creature.base, o);
        },
        false
    );
})(window.DnD);