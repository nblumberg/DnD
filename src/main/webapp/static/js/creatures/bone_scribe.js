/**
 * Created by nblumberg on 11/16/14.
 */

(function (DnD) {
    "use strict";
    DnD.define(
        "creatures.monsters.bone_scribe",
        [ "jQuery", "Creature" ],
        function(jQuery, Creature) {
            var o = {
                name: "Bone Scribe", level: 13, image: "../images/portraits/bone_scribe.jpg", // http://www.wizards.com/dnd/images/MM35_gallery/MM35_PG255a.jpg
                hp: { total: 1 },
                defenses: { ac: 27, fort: 25, ref: 26, will: 24 },
                init: 9, speed: 7,
                abilities: { STR: 10, CON: 20, DEX: 14, INT: 23, WIS: 8, CHA: 19 },
                skills: { perception: 11 },
                attacks: [
                    { name: "Mind Touch", usage: { frequency: "At-Will" }, range: "melee", toHit: 16, defense: "Will", damage: { amount: "4", type: "psychic" }, effects: [
                        { name: "Penalty", amount: -2, type: "Will" },
                        { name: "Slowed", duration: "endAttackerNext" }
                    ], keywords: [ "melee", "psychic", "basic" ] }
                ]
            };
            return jQuery.extend(true, {}, Creature.base, o);
        },
        false
    );
})(window.DnD);