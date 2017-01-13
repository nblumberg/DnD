/**
 * Created by nblumberg on 11/16/14.
 */

(function (DnD) {
    "use strict";
    DnD.define(
        "creatures.monsters.jargo",
        [ "jQuery", "Creature", "creature.helpers" ],
        function(jQuery, Creature, CH) {
            var o = {
                name: "Jargo", level: 1, image: "http://orig04.deviantart.net/33cc/f/2008/119/a/6/a67a788d40011b113dae78945b9657f8.jpg",
                hp: { total: 28 },
                defenses: { ac: 15, fort: 12, ref: 14, will: 12 },
                init: 5, speed: 6,
                abilities: { STR: 9, CON: 12, DEX: 16, INT: 12, WIS: 8, CHA: 13 },
                skills: { acrobatics: 9, bluff: 6, perception: 4, streetwise: 6, thievery: 8 },
                attacks: [
                    { name: "Dagger", usage: { frequency: "At-Will" }, range: "melee", toHit: 6, defense: "AC", damage: "2d4+4", keywords: [ "melee", "basic" ] },
                    { name: "River Rat's Gambit", usage: { frequency: "Encounter" }, range: "melee", toHit: 6, defense: "AC", damage: "2d4+2d6+4", keywords: [ "melee" ] }
                ],
                buffs: [
                    new CH.Power({
                        name: "Cloak of Filth"
                    }).atWill(),
                    new CH.Power({
                        name: "Second Chance"
                    }).encounter()
                ]
            };
            return jQuery.extend(true, {}, Creature.base, o);
        },
        false
    );
})(window.DnD);