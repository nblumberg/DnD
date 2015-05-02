/**
 * Created by nblumberg on 11/16/14.
 */

(function (DnD) {
    "use strict";
    DnD.define(
        "creatures.monsters.two_headed_troll",
        [ "jQuery", "Creature" ],
        function(jQuery, Creature) {
            var o = {
                name: "Two-Headed Troll", level: 10, image: "../images/portraits/two_headed_troll.jpg",
                hp: { total: 264, regeneration: 10 },
                defenses: { ac: 25, fort: 27, ref: 19, will: 20 },
                savingThrows: 2,
                init: 5, speed: 6,
                abilities: { STR: 24, CON: 22, DEX: 10, INT: 6, WIS: 14, CHA: 10 },
                skills: { acrobatics: 0, arcana: 0, athletics: 0, bluff: 0, diplomacy: 0, dungeoneering: 0, endurance: 0, heal: 0, history: 0, insight: 0, intimidate: 0, nature: 0, perception: 7, religion: 0, stealth: 0, streetwise: 0, thievery: 0 },
                attacks: [
                    { name: "Claw", usage: { frequency: "At-Will" }, range: "reach", toHit: 13, defense: "AC", damage: "3d6+7", keywords: [ "melee", "basic" ] },
                    { name: "Smackdown", usage: { frequency: "At-Will" }, range: "reach", toHit: 11, defense: "Fort", damage: "0", effects: [ "Prone" ], keywords: [ "melee" ] }
                ]
            };
            return jQuery.extend(true, {}, Creature.base, o);
        },
        false
    );
})(window.DnD);