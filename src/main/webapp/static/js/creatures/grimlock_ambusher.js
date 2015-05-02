/**
 * Created by nblumberg on 11/16/14.
 */

(function (DnD) {
    "use strict";
    DnD.define(
        "creatures.monsters.grimlock_ambusher",
        [ "jQuery", "Creature" ],
        function(jQuery, Creature) {
            var o = {
                name: "Grimlock Ambusher", level: 11, image: "../images/portraits/grimlock.jpg",
                hp: { total: 110 },
                defenses: { ac: 26, fort: 25, ref: 23, will: 23 },
                init: 9, speed: { walk: 6 },
                abilities: { STR: 20, CON: 14, DEX: 14, INT: 9, WIS: 15, CHA: 9 },
                skills: { acrobatics: 0, arcana: 0, athletics: 15, bluff: 0, diplomacy: 0, dungeoneering: 0, endurance: 0, heal: 0, history: 0, insight: 0, intimidate: 0, nature: 0, perception: 7, religion: 0, stealth: 0, streetwise: 0, thievery: 0 },
                attacks: [
                    { name: "Greataxe", usage: { frequency: "At-Will" }, range: "melee", toHit: 16, defense: "AC", damage: "1d12+5", keywords: [ "melee", "basic" ] }
                ]
            };
            return jQuery.extend(true, {}, Creature.base, o);
        },
        false
    );
})(window.DnD);