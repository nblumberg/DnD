/**
 * Created by nblumberg on 11/16/14.
 */

(function (DnD) {
    "use strict";
    DnD.define(
        "creatures.monsters.zithiruun_the_broken_general",
        [ "jQuery", "Creature" ],
        function(jQuery, Creature) {
            var o = {
                name: "Zithiruun, the Broken General", level: 14, image: "../images/portraits/zithiruun.jpg", // http://cdn.obsidianportal.com/images/145622/zith.jpg
                hp: { total: 280 },
                defenses: { ac: 30, fort: 26, ref: 29, will: 28 },
                savingThrows: { general: 2, charm: 4 },
                init: 15, speed: { walk: 6, fly: 5 },
                abilities: { STR: 6, CON: 6, DEX: 23, INT: 19, WIS: 15, CHA: 20 },
                skills: { acrobatics: 0, arcana: 0, athletics: 0, bluff: 0, diplomacy: 0, dungeoneering: 0, endurance: 0, heal: 0, history: 0, insight: 0, intimidate: 0, nature: 0, perception: 9, religion: 0, stealth: 0, streetwise: 0, thievery: 0 },
                attacks: [
                    { name: "Silver Saber", usage: { frequency: "At-Will" }, range: "melee", toHit: 19, defense: "AC", damage: { amount: "2d8+6", type: "psychic" }, keywords: [ "melee", "psychic", "weapon", "basic" ] },
                    { name: "Thrown Saber", usage: { frequency: "At-Will" }, range: 5, toHit: 19, defense: "AC", damage: { amount: "2d8+6", type: "psychic" }, keywords: [ "ranged", "thrown", "psychic", "weapon" ] },
                    { name: "Silver Flurry", usage: { frequency: "Recharge", recharge: 5 }, range: "melee", toHit: 19, defense: "AC", damage: { amount: "4d8+6", type: "psychic" }, keywords: [ "melee", "psychic", "weapon" ] }
                ]
            };
            return jQuery.extend(true, {}, Creature.base, o);
        },
        false
    );
})(window.DnD);