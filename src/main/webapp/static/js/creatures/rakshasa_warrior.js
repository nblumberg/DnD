/**
 * Created by nblumberg on 6/30/15.
 */

(function () {
    "use strict";
    DnD.define(
        "creatures.monsters.rakshasa_warrior",
        [ "jQuery", "Creature" ],
        function(jQuery, Creature) {
            var o = {
                name: "Rakshasa Warrior", level: 15, image: "../images/portraits/rakshasa.jpg",
                hp: { total: 142 },
                defenses: { ac: 31, fort: 29, ref: 28, will: 28 },
                init: 13, speed: 6,
                abilities: { STR: 20, CON: 14, DEX: 18, INT: 12, WIS: 18, CHA: 14 },
                skills: { athletics: 15, bluff: 14, intimidate: 14, perception: 16 },
                attacks: [
                    { name: "Claw", usage: { frequency: "At-Will" }, range: "melee", toHit: 21, defense: "AC", damage: "1d8+5", keywords: [ "melee", "basic" ] },
                    { name: "Longsword", usage: { frequency: "At-Will" }, range: "melee", toHit: 21, defense: "AC", damage: "1d8+5", effects: [ { name: "Marked", duration: "endAttackerNext" } ], keywords: [ "melee", "basic", "weapon" ] }
                ]
            };
            return jQuery.extend(true, {}, Creature.base, o);
        },
        false
    );
})(window.DnD);