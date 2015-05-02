/**
 * Created by nblumberg on 11/16/14.
 */

(function (DnD) {
    "use strict";
    DnD.define(
        "creatures.monsters.berbalang",
        [ "jQuery", "Creature" ],
        function(jQuery, Creature) {
            var o = {
                name: "Berbalang", level: 10, image: "../images/portraits/berbalang.jpg", // http://www.rpgblog.net/wp-content/berbalang.jpg
                hp: { total: 408 },
                defenses: { ac: 25, fort: 22, ref: 25, will: 21 },
                savingThrows: 5,
                init: 13, speed: { walk: 6, fly: 8 },
                abilities: { STR: 16, CON: 14, DEX: 22, INT: 14, WIS: 13, CHA: 15 },
                skills: { perception: 6 },
                attacks: [
                    { name: "Claw", usage: { frequency: "At-Will" }, range: "melee", toHit: 14, defense: "AC", damage: "1d8+6", keywords: [ "melee", "basic" ] },
                    { name: "Claw (sneak attack)", usage: { frequency: "At-Will" }, range: "melee", toHit: 14, defense: "AC", damage: "2d8+6", keywords: [ "melee", "requires combat advantage" ] },
                    { name: "Sacrifice", usage: { frequency: "At-Will" }, range: 1, toHit: 11, defense: "Fort", damage: "2d6+6", effects: [
                        { name: "Dazed", saveEnds: true }
                    ], keywords: [ "close burst", "effects on miss" ] }
                ]
            };
            return jQuery.extend(true, {}, Creature.base, o);
        },
        false
    );
})(window.DnD);