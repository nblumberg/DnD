/**
 * Created by nblumberg on 11/16/14.
 */

(function (DnD) {
    "use strict";
    DnD.define(
        "creatures.monsters.slaad_midwife",
        [ "jQuery", "Creature" ],
        function(jQuery, Creature) {
            var o = {
                name: "Slaad Midwife", level: 7, image: "../images/portraits/slaad_midwife.jpg",
                hp: { total: 70 },
                defenses: { ac: 20, fort: 19, ref: 17, will: 17 },
                init: 7, speed: 5,
                abilities: { STR: 16, CON: 18, DEX: 15, INT: 7, WIS: 13, CHA: 14 },
                skills: { acrobatics: 0, arcana: 0, athletics: 0, bluff: 0, diplomacy: 0, dungeoneering: 0, endurance: 0, heal: 0, history: 0, insight: 0, intimidate: 0, nature: 0, perception: 10, religion: 0, stealth: 0, streetwise: 0, thievery: 0 },
                attacks: [
                    { name: "Claw", usage: { frequency: "At-Will" }, range: "melee", toHit: 11, defense: "AC", damage: "1d6+10", keywords: [ "melee", "basic" ] },
                    { name: "Fiery Spines", usage: { frequency: "Recharge", recharge: 5 }, range: "close blast 5", toHit: 9, defense: "Ref", damage: { amount: "2d8+8", type: "fire" }, effects: [
                        { name: "Ongoing poison", amount: 5, type: "poison", saveEnds: true }
                    ], keywords: [ "close blast" ] }
                ]
            };
            return jQuery.extend(true, {}, Creature.base, o);
        },
        false
    );
})(window.DnD);