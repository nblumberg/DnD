/**
 * Created by nblumberg on 11/16/14.
 */

(function (DnD) {
    "use strict";
    DnD.define(
        "creatures.monsters.troglodyte_warrior",
        [ "jQuery", "Creature" ],
        function(jQuery, Creature) {
            var o = {
                name: "Troglodyte Warrior", level: 12, image: "../images/portraits/troglodyte.jpg",
                hp: { total: 1 },
                defenses: { ac: 25, fort: 25, ref: 22, will: 21 },
                init: 6, speed: 5,
                abilities: { STR: 18, CON: 16, DEX: 12, INT: 6, WIS: 11, CHA: 8 },
                skills: { acrobatics: 0, arcana: 0, athletics: 15, bluff: 0, diplomacy: 0, dungeoneering: 0, endurance: 14, heal: 0, history: 0, insight: 0, intimidate: 0, nature: 0, perception: 6, religion: 0, stealth: 0, streetwise: 0, thievery: 0 },
                attacks: [
                    { name: "Club", usage: { frequency: "At-Will" }, toHit: 15, defense: "AC", damage: "7", keywords: [ "melee", "basic" ] }
                ]
            };
            return jQuery.extend(true, {}, Creature.base, o);
        },
        false
    );
})(window.DnD);