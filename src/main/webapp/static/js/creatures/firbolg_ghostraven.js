/**
 * Created by nblumberg on 11/16/14.
 */

(function (DnD) {
    "use strict";
    DnD.define(
        "creatures.monsters.firbolg_ghostraven",
        [ "jQuery", "Creature" ],
        function(jQuery, Creature) {
            var o = {
                name: "Firbolg Ghostraven", level: 16, image: "../images/portraits/firbolg_ghostraven.png",
                hp: { total: 236, regeneration: 5 },
                defenses: { ac: 30, fort: 28, ref: 29, will: 28 },
                vulnerabilities: { necrotic: 5 },
                actionPoints: 1,
                init: 18, speed: 8,
                abilities: { STR: 20, CON: 17, DEX: 23, INT: 13, WIS: 21, CHA: 15 },
                skills: { athletics: 18, nature: 18, stealth: 19 },
                attacks: [
                    { name: "Heavy War Pick", usage: { frequency: "At-Will" }, range: "melee", toHit: 21, defense: "AC", damage: "1d12+7", keywords: [ "melee", "basic" ] },
                    { name: "Double Attack (blinded)", usage: { frequency: "At-Will" }, range: "melee", toHit: "automatic", defense: "AC", damage: "0", effects: [ { name: "blinded", saveEnds: true } ], keywords: [ "melee" ] },
                    { name: "Moonfire", usage: { frequency: "Recharge", recharge: 4, action: "minor" }, target: { range: 10 }, toHit: 19, defense: "Will", damage: "0", effects: [ { name: "No invisibility or concealment", duration: "endAttackerNext" } ], keywords: [ "ranged" ] },
                    { name: "Ghostraven Strike", usage: { frequency: "At-Will" }, range: "melee", toHit: "automatic", defense: "AC", damage: "2d8", keywords: [ "melee" ] }
                ],
                buffs: [
                    { name: "Ghostraven Form", effects: [ { name: "resistance", amount: 50, type: "insubstantial" }, { name: "phasing" }, { name: "concealment" } ] }
                ]
            };
            return jQuery.extend(true, {}, Creature.base, o);
        },
        false
    );
})(window.DnD);