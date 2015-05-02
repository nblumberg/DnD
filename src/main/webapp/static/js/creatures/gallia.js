/**
 * Created by nblumberg on 11/16/14.
 */

(function (DnD) {
    "use strict";
    DnD.define(
        "creatures.monsters.gallia",
        [ "jQuery", "Creature" ],
        function(jQuery, Creature) {
            var o = {
                name: "Gallia", level: 11, image: "../images/portraits/gallia.jpg", // http://cdn.obsidianportal.com/images/243287/gith.JPG
                hp: { total: 108 },
                defenses: { ac: 27, fort: 22, ref: 23, will: 23 },
                init: 12, speed: { walk: 7, jump: 5 },
                abilities: { STR: 15, CON: 12, DEX: 17, INT: 10, WIS: 16, CHA: 11 },
                skills: { acrobatics: 15, athletics: 9, insight: 13, perception: 13 },
                attacks: [
                    { name: "Unarmed Strike", usage: { frequency: "At-Will" }, range: "melee", toHit: 17, defense: "AC", damage: "2d8+3", keywords: [ "melee", "basic" ] },
                    { name: "Stunning Strike", usage: { frequency: "At-Will" }, range: "melee", toHit: 14, defense: "Fort", damage: "1d8+3", effects: [
                        { name: "Stunned", duration: "endAttackerNext"}
                    ], keywords: [ "melee" ] },
                    { name: "Trace Chance", usage: { frequency: "Recharge", recharge: 6 }, range: 5, toHit: "automatic", defense: "AC", damage: "0", effects: [
                        { name: "NextMeleeHitIsACrit", duration: "endAttackerNext" }
                    ], keywords: [ "ranged" ] }
                ]
            };
            return jQuery.extend(true, {}, Creature.base, o);
        },
        false
    );
})(window.DnD);