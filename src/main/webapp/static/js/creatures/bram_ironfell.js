/**
 * Created by nblumberg on 6/30/15.
 */

(function (DnD) {
    "use strict";

    DnD.define(
        "creatures.monsters.bram_ironfell",
        [ "jQuery", "Creature" ],
        function(jQuery, Creature) {
            var o = {
                name: "Bram Ironfell", level: 12, image: "../images/portraits/bram_ironfell2.png",
                hp: { total: 123 },
                defenses: { ac: 26, fort: 24, ref: 23, will: 26 },
                init: 9, speed: 5,
                abilities: { STR: 14, CON: 19, DEX: 12, INT: 16, WIS: 18, CHA: 22 },
                skills: { bluff: 17, diplomacy: 17, dungeoneering: 15, history: 14, perception: 10 },
                attacks: [
                    { name: "Dagger", usage: { frequency: "At-Will" }, range: "melee", toHit: 17, defense: "AC", damage: "2d4+5", keywords: [ "melee", "basic" ] },
                    { name: "Coward's Slice", usage: { frequency: "At-Will" }, range: "melee", toHit: 17, defense: "AC", damage: "2d4+5", effects: [ { name: "Marked", duration: "endAttackerNext" } ], keywords: [ "melee" ] }
                ]
            };
            return jQuery.extend(true, {}, Creature.base, o);
        },
        false
    );

})(window.DnD);