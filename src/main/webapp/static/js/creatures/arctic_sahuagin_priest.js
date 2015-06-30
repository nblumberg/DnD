/**
 * Created by nblumberg on 11/16/14.
 */

(function (DnD) {
    "use strict";
    DnD.define(
        "creatures.monsters.arctic_sahuagin_priest",
        [ "jQuery", "Creature", "creatures.monsters.base.arctic_sahuagin" ],
        function(jQuery, Creature, base) {
            var o = {
                name: "Arctic Sahuagin Priest", level: 13, image: "../images/portraits/arctic_sahuagin.png",
                hp: { total: 101 },
                defenses: { ac: 25, fort: 24, ref: 25, will: 26 },
                resistances: { cold: 10 },
                init: 11, speed: { walk: 5, swim: 5, doubleMove: 7 },
                abilities: { STR: 16, CON: 16, DEX: 18, INT: 12, WIS: 20, CHA: 16 },
                skills: { perception: 12 },
                attacks: [
                    { name: "Longspear", usage: { frequency: "At-Will" }, target: { range: 2 }, range: "melee", toHit: 17, defense: "AC", damage: [
                        { amount: "1d10+4" },
                        { amount: "1d8", type: "cold" }
                    ], keywords: [ "melee", "basic", "cold", "weapon" ] },
                    { name: "Freezing Bolt", usage: { frequency: "At-Will" }, range: 10, toHit: 18, defense: "Fort", damage: { amount: "2d6+6", type: "cold" }, effects: [
                        { name: "Slowed", duration: "endAttackerNext"}
                    ], keywords: [ "ranged", "cold" ] },
                    { name: "Arctic Jaws", usage: { frequency: "At-Will" }, target: { range: 20 }, toHit: 18, defense: "Will", damage: { amount: "2d6+6", type: "cold" }, effects: [
                        { name: "multiple", saveEnds: true, children: [
                            { name: "Vulnerable", amount: 5, type: "cold" },
                            { name: "Slowed" }
                        ] }
                    ], keywords: [ "ranged", "cold" ] }
                ]
            };
            return jQuery.extend(true, {}, base, o);
        },
        false
    );
})(window.DnD);