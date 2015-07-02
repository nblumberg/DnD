/**
 * Created by nblumberg on 7/1/15.
 */

(function (DnD) {
    "use strict";

    DnD.define(
        "creatures.monsters.cachlain",
        [ "jQuery", "Creature" ],
        function(jQuery, Creature) {
            var o = {
                name: "Cachlain", level: 20, image: "../images/portraits/cachlain.png",
                hp: { total: 388 },
                defenses: { ac: 36, fort: 34, ref: 30, will: 32 },
                savingThrows: 2,
                actionPoints: 1,
                init: 13, speed: { walk: 8, fly: 2 },
                abilities: { STR: 22, CON: 26, DEX: 12, INT: 19, WIS: 17, CHA: 23 },
                skills: { bluff: 21, endurance: 23, intimidate: 23, perception: 18 },
                attacks: [
                    { name: "Slam", usage: { frequency: "At-Will" }, target: { range: 3 }, toHit: 27, defense: "AC", damage: "2d10+7", keywords: [ "melee", "basic" ] },
                    { name: "Evil Eye", usage: { frequency: "At-Will", action: "Minor" }, target: { range: 10 }, toHit: 25, defense: "Will", damage: "0", keywords: [ "ranged", "charm" ] },
                    { name: "Stone Swat", usage: { frequency: "Recharge", recharge: 5 }, target: { area: "blast", size: 3 }, toHit: 27, defense: "AC", damage: "3d10+7", effects: [ "Prone" ], keywords: [ "blast" ] }
                ],
                buffs: [
                    { name: "Stone Defense", usage: { frequency: "Recharge", recharge: 4, action: "Immediate Reaction" }, effects: [ { name: "resistance", amount: 5, type: "all", duration: "endTargetNext" } ] }
                ]
            };
            return jQuery.extend(true, {}, Creature.base, o);
        },
        false
    );

})(window.DnD);