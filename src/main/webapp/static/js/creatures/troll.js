/**
 * Created by nblumberg on 11/16/14.
 */

(function (DnD) {
    "use strict";
    DnD.define(
        "creatures.monsters.troll",
        [ "jQuery", "Creature" ],
        function(jQuery, Creature) {
            var o = {
                name: "Troll", level: 9, image: "../images/portraits/troll.jpg", // "http://www.wizards.com/dnd/images/MM35_gallery/MM35_PG248a.jpg",
                hp: { total: 100, regeneration: 10 },
                defenses: { ac: 20, fort: 21, ref: 18, will: 17 },
                init: 7, speed: 8,
                abilities: { STR: 22, CON: 20, DEX: 18, INT: 5, WIS: 14, CHA: 9 },
                skills: { acrobatics: 0, arcana: 0, athletics: 0, bluff: 0, diplomacy: 0, dungeoneering: 0, endurance: 0, heal: 0, history: 0, insight: 0, intimidate: 0, nature: 0, perception: 6, religion: 0, stealth: 0, streetwise: 0, thievery: 0 },
                attacks: [
                    { name: "Claw", usage: { frequency: "At-Will" }, range: "reach", toHit: 13, defense: "AC", damage: "2d6+6", keywords: [ "melee", "basic" ] }
                ]
            };
            return jQuery.extend(true, {}, Creature.base, o);
        },
        false
    );
})(window.DnD);