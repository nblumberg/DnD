/**
 * Created by nblumberg on 11/16/14.
 */

(function (DnD) {
    "use strict";
    DnD.define(
        "creatures.monsters.cyclops_slaver",
        [ "jQuery", "Creature" ],
        function(jQuery, Creature) {
            var o = {
                name: "Cyclops Slaver", level: 15, image: "../images/portraits/cyclops.jpg",
                hp: { total: 149 },
                defenses: { ac: 29, fort: 27, ref: 29, will: 25 },
                init: 12, speed: 6,
                abilities: { STR: 22, CON: 20, DEX: 16, INT: 11, WIS: 17, CHA: 11 },
                skills: { acrobatics: 0, arcana: 0, athletics: 0, bluff: 0, diplomacy: 0, dungeoneering: 0, endurance: 0, heal: 0, history: 0, insight: 0, intimidate: 0, nature: 0, perception: 15, religion: 0, stealth: 0, streetwise: 0, thievery: 0 },
                attacks: [
                    { name: "Spear", usage: { frequency: "At-Will" }, range: "2", toHit: 20, defense: "AC", damage: "2d10+4", keywords: [ "melee", "basic" ] },
                    { name: "Shuriken", usage: { frequency: "At-Will" }, range: "2", toHit: 20, defense: "AC", damage: "2d6+4", keywords: [ "ranged" ] },
                    { name: "Evil Eye", usage: { frequency: "At-Will" }, range: "2", toHit: "automatic", defense: "AC", damage: "0", effects: [ { name: "penalty", amount: -2, type: "attacks" } ], keywords: [ "ranged" ] },
                    { name: "Barbed Net", usage: { frequency: "Recharge", recharge: 4 }, range: "2", toHit: 19, defense: "Ref", damage: "1d10+6", effects: [ { name: "multiple", saveEnds: true, children: [ { name: "restrained" }, { name: "ongoing damage", amount: 10 } ] } ], keywords: [ "ranged" ] },
                    { name: "Sleep Powder Flask", usage: { frequency: "Encounter" }, range: "2", toHit: 19, defense: "Fort", damage: "0", effects: [ { name: "slowed", saveEnds: true } ], keywords: [ "ranged" ] }
                ]
            };
            return jQuery.extend(true, {}, Creature.base, o);
        },
        false
    );
})(window.DnD);