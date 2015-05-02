/**
 * Created by nblumberg on 11/16/14.
 */

(function (DnD) {
    "use strict";
    DnD.define(
        "creatures.monsters.duergar_hellcaller",
        [ "jQuery", "Creature" ],
        function(jQuery, Creature) {
            var o = {
                name: "Duergar Hellcaller", level: 12, image: "../images/portraits/duergar_hellcaller.jpg",
                hp: { total: 96 },
                defenses: { ac: 24, fort: 23, ref: 23, will: 25 },
                init: 10, speed: 5,
                abilities: { STR: 14, CON: 18, DEX: 19, INT: 11, WIS: 14, CHA: 22 },
                skills: { arcana: 11, dungeoneering: 13, perception: 13, religion: 11 },
                attacks: [
                    { name: "Mace", usage: { frequency: "At-Will" }, range: "melee", toHit: 19, defense: "AC", damage: "1d8+5", keywords: [ "melee", "basic" ] },
                    { name: "Infernal Quills", usage: { frequency: "At-Will" }, target: { range: 10 }, toHit: 19, defense: "AC", damage: { amount: "1d8+3", type: [ "fire", "poison" ] }, effects: [
                        { name: "multiple", children: [
                            { name: "ongoing damage", amount: 5, type: [ "fire", "poison" ] },
                            { name: "attack penalty", amount: -2 }
                        ], saveEnds: true }
                    ], keywords: [ "ranged", "poison", "fire" ] },
                    { name: "Quick Quill Strike", usage: { frequency: "Encounter" }, target: { range: 10 }, toHit: 19, defense: "AC", damage: { amount: "1d8+3", type: [ "fire", "poison" ] }, effects: [
                        { name: "multiple", children: [
                            { name: "ongoing damage", amount: 5, type: [ "fire", "poison" ] },
                            { name: "attack penalty", amount: -2 }
                        ], saveEnds: true }
                    ], keywords: [ "ranged", "poison", "fire" ] },
                    { name: "Asmodeus' Ruby Curse", usage: { frequency: "Encounter" }, target: { area: "close blast", range: 5 }, toHit: 16, defense: "Will", damage: { amount: "3d8+5", type: "psychic" }, keywords: [ "ranged", "close burst", "fear", "psychic" ] },
                    { name: "Quill Storm", usage: { frequency: "Encounter" }, target: { area: "burst", size: 2, range: 10 }, toHit: 17, defense: "Ref", damage: { amount: "1d8", type: [ "fire", "poison" ] }, effects: [
                        { name: "multiple", children: [
                            { name: "ongoing damage", amount: 10, type: [ "fire", "poison" ] },
                            { name: "attack penalty", amount: -2 }
                        ], saveEnds: true }
                    ], keywords: [ "ranged", "poison", "fire" ] }
                ]
            };
            return jQuery.extend(true, {}, Creature.base, o);
        },
        false
    );
})(window.DnD);