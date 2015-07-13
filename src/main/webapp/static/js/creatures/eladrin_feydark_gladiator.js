/**
 * Created by nblumberg on 7/1/15.
 */

(function (DnD) {
    "use strict";

    DnD.define(
        "creatures.monsters.eladrin_feydark_gladiator",
        [ "jQuery", "Creature" ],
        function(jQuery, Creature) {
            var o = {
                name: "Eladrin Feydark Gladiator", level: 16, image: "../images/portraits/eladrin_feydark_gladiator.jpg",
                hp: { total: 154 },
                defenses: { ac: 32, fort: 28, ref: 30, will: 26 },
                init: 17, speed: 6,
                abilities: { STR: 21, CON: 18, DEX: 24, INT: 15, WIS: 13, CHA: 16 },
                skills: { perception: 9 },
                attacks: [
                    { name: "Spear", usage: { frequency: "At-Will" }, range: "melee", toHit: 23, defense: "AC", damage: "2d8+7", effects: [ { name: "Marked", duration: "endAttackerNext" } ], keywords: [ "melee", "basic", "weapon" ] },
                    { name: "Bloodletting Stab", usage: { frequency: "Encounter" }, range: "melee", toHit: 23, defense: "AC", damage: "3d8+7", keywords: [ "melee", "weapon" ] },
                    { name: "Bloodletting Stab (combat advantage)", usage: { frequency: "Encounter" }, range: "melee", toHit: 23, defense: "AC", damage: "3d8+7", effects: [ { name: "ongoing damage", amount: 10, saveEnds: true } ], keywords: [ "melee", "weapon" ] }
                ]
            };
            return jQuery.extend(true, {}, Creature.base, o);
        },
        false
    );

})(window.DnD);