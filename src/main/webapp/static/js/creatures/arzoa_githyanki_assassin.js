/**
 * Created by nblumberg on 11/16/14.
 */

(function (DnD) {
    "use strict";
    DnD.define(
        "creatures.monsters.arzoa_githyanki_assassin",
        [ "jQuery", "Creature" ],
        function(jQuery, Creature) {
            var o = {
                name: "Arzoa, Githyanki Assassin", level: 18, image: "../images/portraits/thaggriel.png",
                hp: { total: 344 },
                defenses: { ac: 32, fort: 29, ref: 31, will: 30 },
                savingThrows: 2,
                init: 16, speed: 6,
                actionPoints: 1,
                abilities: { STR: 17, CON: 20, DEX: 25, INT: 23, WIS: 22, CHA: 18 },
                skills: { acrobatics: 21, arcana: 20, bluff: 18, perception: 15, stealth: 21 },
                attacks: [
                    { name: "Silver Longsword", usage: { frequency: "At-Will" }, range: "melee", toHit: 23, defense: "AC", damage: "2d8+7", effects: [ { name: "combat advantage", duration: "endTargetNext" } ], keywords: [ "melee", "weapon", "basic" ] },
                    { name: "Mind Grip", usage: { frequency: "At-Will" }, target: { range: 10 }, toHit: 22, defense: "Will", damage: { amount: "1d10+7", type: "psychic" }, keywords: [ "ranged", "psychic" ] },
                    { name: "Mind Assassination", usage: { frequency: "Recharge", recharge: 5, action: "Minor" }, target: { area: "close burst", size: 5, enemiesOnly: true }, toHit: 22, defense: "Will", damage: { amount: "1d10+7", type: "psychic" }, effects: [ { name: "ongoing damage", amount: 10, type: "psychic", saveEnds: true } ], keywords: [ "close burst", "psychic" ] },
                    { name: "Tide of Woe", usage: { frequency: "At-Will", action: "Immediate Interrupt" }, target: { area: "close burst", size: 10, targets: 1 }, toHit: "automatic", defense: "AC", damage: "0", effects: [ "Prone" ], keywords: [ "close burst", "fear" ] },
                    { name: "Mental Block", usage: { frequency: "At-Will", action: "Immediate Reaction" }, toHit: "automatic", defense: "AC", damage: { amount: "2d8", type: "psychic" }, keywords: [ "psychic" ] }
                ]
            };
            return jQuery.extend(true, {}, Creature.base, o);
        },
        false
    );
})(window.DnD);