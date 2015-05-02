/**
 * Created by nblumberg on 11/16/14.
 */

(function (DnD) {
    "use strict";
    DnD.define(
        "creatures.monsters.chillfire_destroyer",
        [ "jQuery", "Creature" ],
        function(jQuery, Creature) {
            var o = {
                name: "Chillfire Destroyer", level: 14, image: "../images/portraits/chillfire_destroyer.jpg",
                hp: { total: 173 },
                defenses: { ac: 26, fort: 26, ref: 25, will: 25 },
                immunities: [ "disease", "poison" ],
                resistances: { cold: 10, fire: 10 },
                init: 12, speed: { walk: 5 },
                abilities: { STR: 16, CON: 23, DEX: 20, INT: 5, WIS: 20, CHA: 12 },
                skills: { perception: 12 },
                attacks: [
                    { name: "Freezing Slam", usage: { frequency: "At-Will" }, range: "melee", toHit: 17, defense: "AC", damage: [
                        { amount: "1d12+6" },
                        { amount: "1d12", type: "cold" }
                    ], keywords: [ "melee", "basic", "cold" ] },
                    { name: "Trample", usage: { frequency: "At-Will" }, range: "melee", toHit: 15, defense: "Ref", damage: [
                        { amount: "1d10+6" },
                        { amount: "1d10", type: "cold" }
                    ], effects: [
                        { name: "Prone" }
                    ], keywords: [ "melee", "cold" ] },
                    { name: "Firecore Breach", usage: { frequency: "Daily" }, target: { area: "close burst", size: 3 }, toHit: 15, defense: "Ref", damage: { amount: "4d10+6", type: "fire" }, keywords: [ "close burst", "fire" ] }
                ]
            };
            return jQuery.extend(true, {}, Creature.base, o);
        },
        false
    );
})(window.DnD);