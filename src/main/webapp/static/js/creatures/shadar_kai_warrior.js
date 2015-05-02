/**
 * Created by nblumberg on 11/16/14.
 */

(function (DnD) {
    "use strict";
    DnD.define(
        "creatures.monsters.shadar_kai_warrior",
        [ "jQuery", "Creature" ],
        function(jQuery, Creature) {
            var o = {
                name: "Shadar-kai Warrior", level: 8, image: "../images/portraits/shadar_kai_warrior.png",
                hp: { total: 86 },
                defenses: { ac: 24, fort: 19, ref: 20, will: 17 },
                init: 11, speed: { walk: 5, teleport: 3 },
                abilities: { STR: 17, CON: 14, DEX: 20, INT: 12, WIS: 14, CHA: 11 },
                skills: { acrobatics: 15, arcana: 0, athletics: 0, bluff: 0, diplomacy: 0, dungeoneering: 0, endurance: 0, heal: 0, history: 0, insight: 0, intimidate: 0, nature: 0, perception: 6, religion: 0, stealth: 15, streetwise: 0, thievery: 0 },
                attacks: [
                    { name: "Katar", usage: { frequency: "At-Will" }, range: "melee", toHit: 13, defense: "AC", damage: "1d6+3", keywords: [ "melee", "basic" ] },
                    { name: "Cage of Gloom", usage: { frequency: "Recharge", recharge: 5 }, range: "melee", toHit: 13, defense: "AC", damage: "1d6+3", keywords: [ "melee" ] },
                    { name: "Cage of Gloom (secondary)", usage: { frequency: "At-Will" }, range: "melee", toHit: 11, defense: "Ref", damage: "0", effects: [
                        { name: "Restrained", saveEnds: true }
                    ], keywords: [ "melee" ] }
                ]
            };
            return jQuery.extend(true, {}, Creature.base, o);
        },
        false
    );
})(window.DnD);