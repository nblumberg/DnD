/**
 * Created by nblumberg on 11/16/14.
 */

(function (DnD) {
    "use strict";
    DnD.define(
        "creatures.monsters.slystone_dwarf_ruffian",
        [ "jQuery", "Creature" ],
        function(jQuery, Creature) {
            var o = {
                name: "Slystone Dwarf Ruffian", level: 10, image: "../images/portraits/slystone_dwarf.jpg",
                hp: { total: 104 },
                defenses: { ac: 26, fort: 23, ref: 22, will: 21 },
                init: 12, speed: 6,
                abilities: { STR: 18, CON: 16, DEX: 21, INT: 11, WIS: 11, CHA: 18 },
                skills: { acrobatics: 0, arcana: 0, athletics: 14, bluff: 0, diplomacy: 0, dungeoneering: 0, endurance: 0, heal: 0, history: 0, insight: 0, intimidate: 0, nature: 0, perception: 5, religion: 0, stealth: 0, streetwise: 0, thievery: 0 },
                attacks: [
                    { name: "Hammer", usage: { frequency: "At-Will" }, range: "melee", toHit: 17, defense: "AC", damage: "2d6+5", effects: [ "Marked" ], keywords: [ "melee", "basic" ] },
                    { name: "Hammer (charge)", usage: { frequency: "At-Will" }, range: "melee", toHit: 17, defense: "AC", damage: "2d6+5", effects: [ "Marked", "Prone" ], keywords: [ "melee" ] },
                    { name: "Mighty Strike", usage: { frequency: "Recharge", recharge: 5 }, range: "melee", toHit: 17, defense: "AC", damage: "3d8+5", keywords: [ "melee" ] },
                    { name: "Mighty Strike (charge)", usage: { frequency: "Recharge", recharge: 5 }, range: "melee", toHit: 17, defense: "AC", damage: "3d8+5", effects: [ "Prone" ], keywords: [ "melee" ] }
                ]
            };
            return jQuery.extend(true, {}, Creature.base, o);
        },
        false
    );
})(window.DnD);