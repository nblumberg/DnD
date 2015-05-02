/**
 * Created by nblumberg on 11/16/14.
 */

(function (DnD) {
    "use strict";
    DnD.define(
        "creatures.monsters.filth_king",
        [ "jQuery", "Creature" ],
        function(jQuery, Creature) {
            var o = {
                name: "Filth King", level: 14, image: "../images/portraits/filth_king.jpg", // http://i972.photobucket.com/albums/ae209/Mistertom_01/rogue20m-165.jpg
                hp: { total: 278 },
                defenses: { ac: 28, fort: 25, ref: 26, will: 27 },
                init: 9, speed: 6,
                actionPoints: 1,
                abilities: { STR: 10, CON: 19, DEX: 15, INT: 20, WIS: 17, CHA: 23 },
                skills: { bluff: 18, intimidate: 18, perception: 15, stealth: 14, thievery: 14 },
                attacks: [
                    { name: "Festering Scratch", usage: { frequency: "At-Will" }, range: "melee", toHit: 19, defense: "AC", damage: "1d4+2", effects: [
                        { name: "Ongoing damage", amount: 10, type: "poison", saveEnds: true }
                    ], keywords: [ "melee", "basic", "poison" ] },
                    { name: "Awaken Greed", usage: { frequency: "At-Will" }, target: { range: 10 }, toHit: 18, defense: "Will", damage: { amount: "2d8+6", type: "psychic" }, effects: [
                        { name: "Slowed", duration: "endAttackerNext" }
                    ], keywords: [ "ranged", "implement", "psychic" ] },
                    { name: "Driving Sickness", usage: { frequency: "At-Will" }, range: "melee", toHit: "automatic", defense: "AC", damage: "0", effects: [
                        { name: "Ongoing damage", amount: 15, type: "poison", saveEnds: true }
                    ], keywords: [ "melee", "poison" ] },
                    { name: "Vitriolic Spray", usage: { frequency: "Encounter" }, target: { size: 3, area: "close blast" }, toHit: 16, defense: "Fort", damage: { amount: "1d10+4", type: "acid" }, effects: [
                        { name: "Blinded", duration: "endAttackerNext" }
                    ], keywords: [ "close burst", "acid" ] }
                ]
            };
            return jQuery.extend(true, {}, Creature.base, o);
        },
        false
    );
})(window.DnD);