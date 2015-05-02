/**
 * Created by nblumberg on 11/16/14.
 */

(function (DnD) {
    "use strict";
    DnD.define(
        "creatures.monsters.slaad_guard",
        [ "jQuery", "Creature" ],
        function(jQuery, Creature) {
            var o = {
                name: "Slaad Guard", level: 8, image: "../images/portraits/flux_slaad.jpg",
                hp: { total: 98 },
                defenses: { ac: 23, fort: 23, ref: 21, will: 21 },
                init: 8, speed: { walk: 7, teleport: 2 },
                abilities: { STR: 16, CON: 18, DEX: 15, INT: 7, WIS: 13, CHA: 14 },
                skills: { acrobatics: 0, arcana: 0, athletics: 0, bluff: 0, diplomacy: 0, dungeoneering: 0, endurance: 0, heal: 0, history: 0, insight: 0, intimidate: 0, nature: 0, perception: 10, religion: 0, stealth: 0, streetwise: 0, thievery: 0 },
                attacks: [
                    { name: "Claw Slash", usage: { frequency: "At-Will" }, range: "melee", toHit: 14, defense: "AC", damage: "2d8+3", keywords: [ "melee", "basic" ] }
                ]
            };
            return jQuery.extend(true, {}, Creature.base, o);
        },
        false
    );
})(window.DnD);