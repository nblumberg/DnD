/**
 * Created by nblumberg on 11/16/14.
 */

(function (DnD) {
    "use strict";
    DnD.define(
        "creatures.monsters.centaur_ravager",
        [ "jQuery", "Creature" ],
        function(jQuery, Creature) {
            var o = {
                name: "Centaur Ravager", level: 12, image: "../images/portraits/centaur_ravager.jpg",
                hp: { total: 150 },
                defenses: { ac: 24, fort: 26, ref: 24, will: 23 },
                init: 10, speed: { walk: 8 },
                abilities: { STR: 22, CON: 20, DEX: 18, INT: 9, WIS: 16, CHA: 10 },
                skills: { athletics: 17, nature: 14, perception: 9 },
                attacks: [
                    { name: "Greatsword", usage: { frequency: "At-Will" }, range: "melee", toHit: 15, defense: "AC", damage: "1d10+6", keywords: [ "melee", "basic" ] },
                    { name: "Greatsword (charge)", usage: { frequency: "At-Will" }, range: "melee", toHit: 15, defense: "AC", damage: "2d10+6", keywords: [ "melee", "basic", "charge" ] },
                    { name: "Quick Kick", usage: { frequency: "At-Will", action: "Immediate Reaction" }, range: "melee", toHit: 14, defense: "AC", damage: "1d6+6", keywords: [ "melee" ] },
                    { name: "Berserk Rush", usage: { frequency: "Encounter" }, range: "melee", toHit: 15, defense: "Fort", damage: "2d10+6", effects: [
                        { name: "Prone" }
                    ], keywords: [ "melee" ] },
                    { name: "Berserk Rush (charge)", usage: { frequency: "Encounter" }, range: "melee", toHit: 15, defense: "Fort", damage: "3d10+6", effects: [
                        { name: "Prone" }
                    ], keywords: [ "melee", "charge" ] },
                    { name: "Brash Retaliation", usage: { frequency: "Encounter" }, range: "melee", toHit: 15, defense: "AC", damage: "3d10+6", keywords: [ "melee", "bloodied" ] }
                ]
            };
            return jQuery.extend(true, {}, Creature.base, o);
        },
        false
    );
})(window.DnD);