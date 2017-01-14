/**
 * Created by nblumberg on 11/16/14.
 */

(function (DnD) {
    "use strict";
    DnD.define(
        "creatures.monsters.githyanki_warmonger",
        [ "jQuery", "Creature", "creature.helpers", "creatures.monsters.base.githyanki" ],
        function(jQuery, Creature, CH, base) {
            var o, silverGreatsword;
            silverGreatsword = new CH.Power({ name: "Silver Greatsword" })
                .atWill().melee().ac(24).addDamage("2d10", { amount: "1d10", type: "psychic" }).addKeywords("melee", "psychic", "basic");
            o = {
                name: "Githyanki Warmonger", level: 17, image: "../images/portraits/githyanki.jpg",
                hp: { total: 162 },
                defenses: { ac: 33, fort: 29, ref: 31, will: 29 },
                savingThrows: { charm: 2 },
                init: 15,
                abilities: { STR: 24, CON: 18, DEX: 21, INT: 16, WIS: 17, CHA: 21 },
                skills: { perception: 11 },
                attacks: [
                    silverGreatsword,
                    jQuery.extend(true, new CH.Power(), silverGreatsword, { name: "Silver Greatsword (immobilized, stunned)" }).addDamage({ amount: "3d8", type: "psychic" }),
                    { name: "Telekinetic Crush", usage: { frequency: "Recharge", recharge: 5 }, target: { range: 5 }, toHit: 22, defense: "Fort", damage: "1d10", effects: [
                        { name: "Immobilized", saveEnds: true }
                    ], keywords: [ "ranged" ] },
                    { name: "Soulsword Burst", usage: { frequency: "Encounter" }, target: { area: "close burst", size: 1 }, toHit: 22, defense: "Will", damage: "3d10", effects: [
                        { name: "multiple", saveEnds: true, children: [
                            { name: "ongoing damage", type: "psychic", amount: 5 },
                            { name: "Stunned" }
                        ] }
                    ], keywords: [ "close burst", "psychic" ] }
                ]
            };
            return jQuery.extend(true, {}, base, o);
        },
        false
    );
})(window.DnD);