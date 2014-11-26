/**
 * Created by nblumberg on 11/16/14.
 */

(function (DnD) {
    "use strict";
    DnD.define(
        "creatures.monsters.brann_ot_githyanki_gish",
        [ "jQuery", "Creature" ],
        function(jQuery, Creature) {
            var o = {
                name: "Brann'ot Githyanki Gish", level: 15, image: "../images/portraits/githyanki_mindslicer.jpg", // http://cdn.obsidianportal.com/images/121677/githyanki_2_2.jpg
                hp: { total: 226 },
                defenses: { ac: 31, fort: 28, ref: 29, will: 29 },
                init: 13, speed: { walk: 5, teleport: 6 },
                abilities: { STR: 16, CON: 17, DEX: 14, INT: 19, WIS: 14, CHA: 17 },
                skills: { arcana: 16, history: 13, insight: 14, perception: 14 },
                attacks: [
                    { name: "Silver Longsword", usage: { frequency: "At-Will" }, range: "melee", toHit: 20, defense: "AC", damage: [ "1d8+3", { amount: "1d8", type: "psychic" } ], keywords: [ "melee", "psychic", "basic" ] },
                    { name: "Force Bolt", usage: { frequency: "Recharge", recharge: 6 }, target: { range: 10 }, toHit: 18, defense: "Ref", damage: { amount: "3d6+4", type: "force" }, keywords: [ "ranged", "force" ] },
                    { name: "Storm of Stars", usage: { frequency: "Encounter" }, target: { range: 5, targets: 4 }, toHit: 20, defense: "AC", damage: { amount: "2d8+4", type: "fire" }, keywords: [ "ranged", "fire" ] }
                ]
            };
            return jQuery.extend(true, {}, Creature.base, o);
        },
        false
    );
})(window.DnD);