/**
 * Created by nblumberg on 7/3/15.
 */

(function (DnD) {
    "use strict";
    DnD.define(
        "creatures.monsters.firbolg_bloodbear_bear_form",
        [ "jQuery", "Creature" ],
        function(jQuery, Creature) {
            var o = {
                name: "Firbolg Bloodbear, bear form", level: 15, image: "../images/portraits/firbolg_bloodbear.png",
                hp: { total: 240, regeneration: 10 },
                defenses: { ac: 30, fort: 28, ref: 29, will: 28 },
                vulnerabilities: { necrotic: 5 },
                actionPoints: 1,
                init: 18, speed: 8,
                abilities: { STR: 20, CON: 17, DEX: 23, INT: 13, WIS: 21, CHA: 15 },
                skills: { athletics: 18, nature: 18, stealth: 19 },
                attacks: [
                    { name: "Slam", usage: { frequency: "At-Will" }, range: "melee", toHit: 18, defense: "AC", damage: "2d8+9", keywords: [ "melee", "basic" ] },
                    { name: "Claw", usage: { frequency: "At-Will" }, range: "melee", toHit: 18, defense: "AC", damage: "2d12+9", keywords: [ "melee", "basic" ] },
                    { name: "Double Attack (secondary)", usage: { frequency: "At-Will" }, range: "melee", toHit: 17, defense: "Fort", damage: "0", effects: [ { name: "grabbed" } ], keywords: [ "melee" ] },
                    { name: "Bloodbear Maul", usage: { frequency: "Encounter" }, range: "melee", toHit: "automatic", defense: "AC", damage: "4d10+9", keywords: [ "melee" ] },
                    { name: "Bite", usage: { frequency: "At-Will" }, range: "melee", toHit: 18, defense: "AC", damage: "3d12+9", keywords: [ "melee" ] },
                    { name: "Bite (combat advantage)", usage: { frequency: "At-Will" }, range: "melee", toHit: 18, defense: "AC", damage: "3d12+9", effects: [ { name: "ongoing damage", amount: 10, saveEnds: true } ], keywords: [ "melee" ] },
                    { name: "Moonfire", usage: { frequency: "Recharge", recharge: 4, action: "minor" }, target: { range: 10 }, toHit: 15, defense: "Will", damage: "0", effects: [ { name: "No invisibility or concealment", duration: "endAttackerNext" } ], keywords: [ "ranged" ] }
                ]
            };
            return jQuery.extend(true, {}, Creature.base, o);
        },
        false
    );
})(window.DnD);