/**
 * Created by nblumberg on 11/16/14.
 */

(function (DnD) {
    "use strict";
    DnD.define(
        "creatures.monsters.scion_of_chaos",
        [ "jQuery", "Creature" ],
        function(jQuery, Creature) {
            var o = {
                name: "Scion of Chaos", level: 11, image: "../images/portraits/scion_of_chaos.jpg",
                hp: { total: 117 },
                defenses: { ac: 25, fort: 24, ref: 23, will: 24 },
                resistances: { acid: 10, fire: 10 },
                init: 9, speed: { walk: 6 },
                abilities: { STR: 17, CON: 21, DEX: 19, INT: 16, WIS: 19, CHA: 21 },
                skills: { acrobatics: 0, arcana: 0, athletics: 0, bluff: 0, diplomacy: 0, dungeoneering: 0, endurance: 0, heal: 0, history: 0, insight: 0, intimidate: 0, nature: 0, perception: 9, religion: 0, stealth: 0, streetwise: 0, thievery: 0 },
                attacks: [
                    { name: "Slam", usage: { frequency: "At-Will" }, range: "melee", toHit: 16, defense: "AC", damage: { amount: "2d8+4", type: "fire" }, keywords: [ "melee", "fire", "basic" ] },
                    { name: "Staggering Strike", usage: { frequency: "At-Will" }, range: 20, toHit: 14, defense: "Fort", damage: "2d6+6", keywords: [ "ranged" ] },
                    { name: "Coils of Immobility", usage: { frequency: "Recharge", recharge: 5 }, target: { area: "burst", size: 2, range: 10 }, toHit: 13, defense: "Ref", damage: "2d8+4", effects: [
                        { name: "Restrained", saveEnds: true }
                    ], keywords: [ "ranged" ] }
                ]
            };
            return jQuery.extend(true, {}, Creature.base, o);
        },
        false
    );
})(window.DnD);