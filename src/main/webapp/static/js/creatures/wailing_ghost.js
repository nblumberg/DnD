/**
 * Created by nblumberg on 11/16/14.
 */

(function (DnD) {
    "use strict";
    DnD.define(
        "creatures.monsters.wailing_ghost",
        [ "jQuery", "Creature" ],
        function(jQuery, Creature) {
            var o = {
                name: "Wailing Ghost", level: 12, image: "../images/portraits/wailing_ghost.png", // http://varlaventura.files.wordpress.com/2013/03/banshee-counterparts-e1364401380806.jpg
                hp: { total: 91 },
                defenses: { ac: 23, fort: 23, ref: 23, will: 24 },
                immunities: [ "disease", "poison" ],
                insubstantial: true, // TODO: respect insubstantial in combat
                init: 8, speed: { fly: 6 }, //, flyAgility: "hover", phasing: true },
                abilities: { STR: 14, CON: 13, DEX: 15, INT: 10, WIS: 14, CHA: 17 },
                skills: { acrobatics: 0, arcana: 0, athletics: 0, bluff: 0, diplomacy: 0, dungeoneering: 0, endurance: 17, heal: 0, history: 0, insight: 0, intimidate: 0, nature: 0, perception: 13, religion: 0, stealth: 13, streetwise: 0, thievery: 0 },
                attacks: [
                    { name: "Spirit Touch", usage: { frequency: "At-Will" }, toHit: 15, defense: "Ref", damage: { amount: "1d10+2", type: "necrotic" }, keywords: [ "melee", "basic" ] },
                    { name: "Death's Visage", usage: { frequency: "At-Will" }, range: 5, toHit: 15, defense: "Will", damage: { amount: "2d6+3", type: "psychic" }, effects: [
                        { name: "penalty to all defenses", amount: -2, saveEnds: true }
                    ], keywords: [ "ranged", "fear", "psychic" ] },
                    { name: "Terrifying Shriek", usage: { frequency: "Recharge", recharge: 5 }, target: { area: "close burst", size: 5 }, toHit: 15, defense: "Will", damage: { amount: "2d8+3", type: "psychic" }, effects: [
                        { name: "Immobilized", saveEnds: true }
                    ], keywords: [ "close burst", "fear", "psychic" ] }
                ]
            };
            return jQuery.extend(true, {}, Creature.base, o);
        },
        false
    );
})(window.DnD);