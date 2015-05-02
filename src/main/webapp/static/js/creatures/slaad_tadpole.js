/**
 * Created by nblumberg on 11/16/14.
 */

(function (DnD) {
    "use strict";
    DnD.define(
        "creatures.monsters.slaad_tadpole",
        [ "jQuery", "Creature" ],
        function(jQuery, Creature) {
            var o = {
                name: "Slaad Tadpole", level: 5, image: "../images/portraits/slaad_tadpole.jpg",
                hp: { total: 44 },
                defenses: { ac: 21, fort: 18, ref: 20, will: 18 },
                init: 7, speed: 4,
                abilities: { STR: 6, CON: 8, DEX: 12, INT: 3, WIS: 9, CHA: 7 },
                skills: { acrobatics: 0, arcana: 0, athletics: 0, bluff: 0, diplomacy: 0, dungeoneering: 0, endurance: 0, heal: 0, history: 0, insight: 0, intimidate: 0, nature: 0, perception: 6, religion: 0, stealth: 8, streetwise: 0, thievery: 0 },
                attacks: [
                    { name: "Bite", usage: { frequency: "At-Will" }, range: "melee", toHit: 10, defense: "AC", damage: "1d8", keywords: [ "melee", "basic" ] }
                ]
            };
            return jQuery.extend(true, {}, Creature.base, o);
        },
        false
    );
})(window.DnD);