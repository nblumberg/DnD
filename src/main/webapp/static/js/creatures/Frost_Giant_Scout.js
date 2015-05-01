/**
 * Created by nblumberg on 11/16/14.
 */

(function (DnD) {
    "use strict";
    DnD.define(
        "creatures.monsters.frost_giant_scout",
        [ "jQuery", "Creature" ],
        function(jQuery, Creature) {
            var o = {
                name: "Frost Giant Scout", level: 15, image: "../images/portraits/frost_giant_scout.jpg", // http://crpp0001.uqtr.ca/w4/campagne/images/wotc_art_galleries/Frostburn/Frost%20Giant%20Tundra%20Scout%20by%20Mitch%20Cotie.jpg
                hp: { total: 115 },
                defenses: { ac: 28, fort: 26, ref: 28, will: 27 },
                resistances: { cold: 15 },
                init: 13, speed: { walk: 9 },
                abilities: { STR: 19, CON: 19, DEX: 23, INT: 10, WIS: 20, CHA: 10 },
                skills: { athletics: 16, perception: 17, stealth: 18 },
                attacks: [
                    { name: "Icy Spear", usage: { frequency: "At-Will" }, target: { range: 2 }, range: "melee", toHit: 20, defense: "AC", damage: { amount: "1d10+6", type: "cold" }, keywords: [ "melee", "basic", "cold", "weapon" ] },
                    { name: "Icy Arrow", usage: { frequency: "At-Will" }, target: { range: 20 }, toHit: 22, defense: "AC", damage: { amount: "1d12+8", type: "cold" }, effects: [
                        { name: "Slowed", duration: "endAttackerNext" }
                    ], keywords: [ "ranged", "basic", "cold", "weapon" ] },
                    { name: "Chillshards", usage: { frequency: "Recharge", recharge: 5 }, target: { area: "burst", size: 1, range: 20 }, toHit: 20, defense: "Fort", damage: { amount: "1d12+8", type: "cold" }, effects: [
                        { name: "Slowed", duration: "endAttackerNext", afterEffects: [
                            { name: "Slowed", duration: "endAttackerNext" }
                        ] },
                        { name: "No immediate or opportunity actions", duration: "endAttackerNext" }
                    ], keywords: [ "ranged", "cold", "weapon" ] },
                    { name: "Tundra Hunter", usage: { frequency: "Recharge", recharge: "bloodied" }, toHit: "automatic", defense: "AC", damage: "0", effects: [
                        { name: "Vulnerable", amount: 10, type: "cold", saveEnds: true, afterEffects: [
                            { name: "Vulnerable", amount: 5, type: "cold", saveEnds: true }
                        ] }
                    ], keywords: [ "cold" ] }
                ]
            };
            return jQuery.extend(true, {}, Creature.base, o);
        },
        false
    );
})(window.DnD);