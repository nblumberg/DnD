/**
 * Created by nblumberg on 11/16/14.
 */

(function (DnD) {
    "use strict";
    DnD.define(
        "creatures.monsters.githzerai_cenobite",
        [ "jQuery", "Creature" ],
        function(jQuery, Creature) {
            var o = {
                name: "Githzerai Cenobite", level: 11, image: "../images/portraits/githzerai.jpg", // http://i49.tinypic.com/29w1yes.jpg
                hp: { total: 108 },
                defenses: { ac: 27, fort: 22, ref: 23, will: 23 },
                init: 12, speed: 7,
                abilities: { STR: 15, CON: 12, DEX: 17, INT: 10, WIS: 16, CHA: 11 },
                skills: { acrobatics: 15, arcana: 0, athletics: 9, bluff: 0, diplomacy: 0, dungeoneering: 0, endurance: 0, heal: 0, history: 0, insight: 13, intimidate: 0, nature: 0, perception: 13, religion: 0, stealth: 0, streetwise: 0, thievery: 0 },
                attacks: [
                    { name: "Unarmed Strike", usage: { frequency: "At-Will" }, range: "melee", toHit: 17, defense: "AC", damage: "2d8+3", keywords: [ "melee", "basic" ] },
                    { name: "Stunning Strike", usage: { frequency: "At-Will" }, range: "melee", toHit: 14, defense: "Fort", damage: "1d8+3", effects: [
                        { name: "Stunned", duration: "endAttackerNext" }
                    ], keywords: [ "melee" ] },
                    { name: "Trace Chance", usage: { frequency: "Recharge", recharge: 5 }, target: { range: 5 }, toHit: "automatic", defense: "AC", damage: "0", effects: [
                        { name: "multiple", duration: "endAttackerNext", children: [
                            { name: "bonus", type: "nextMeleeAttack", amount: 5 },
                            { name: "automaticCritical" }
                        ] }
                    ], keywords: [ "ranged" ] }
                ]
            };
            return jQuery.extend(true, {}, Creature.base, o);
        },
        false
    );
})(window.DnD);