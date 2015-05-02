/**
 * Created by nblumberg on 11/16/14.
 */

(function (DnD) {
    "use strict";
    DnD.define(
        "creatures.monsters.skull_lord_servitor",
        [ "jQuery", "Creature" ],
        function(jQuery, Creature) {
            var o = {
                name: "Skull Lord Servitor", level: 14, image: "../images/portraits/skull_lord_servitor.jpg",
                hp: { total: 55 },
                defenses: { ac: 28, fort: 25, ref: 26, will: 27 },
                immunities: [ "disease", "poison" ],
                vulnerabilities: { radiant: 5 },
                resistances: { necrotic: 10 },
                init: 12, speed: 6,
                abilities: { STR: 14, CON: 19, DEX: 18, INT: 17, WIS: 16, CHA: 23 },
                skills: { acrobatics: 0, arcana: 0, athletics: 0, bluff: 18, diplomacy: 0, dungeoneering: 0, endurance: 0, heal: 0, history: 0, insight: 15, intimidate: 18, nature: 0, perception: 10, religion: 0, stealth: 0, streetwise: 0, thievery: 0 },
                attacks: [
                    { name: "Bone Staff", usage: { frequency: "At-Will" }, range: "melee", toHit: 17, defense: "AC", damage: [ "1d8+4", { amount: "1d6", type: "necrotic" } ], keywords: [ "melee", "basic", "necrotic" ] },
                    { name: "Skull of Bonechilling Fear", usage: { frequency: "At-Will" }, range: 10, toHit: 19, defense: "Will", damage: { amount: "1d10+3", type: "cold" }, keywords: [ "ranged", "cold", "fear" ] },
                    { name: "Skull of Withering Flame", usage: { frequency: "At-Will" }, range: 10, toHit: 19, defense: "Fort", damage: { amount: "2d6+5", type: [ "fire", "necrotic" ] }, keywords: [ "ranged", "fire", "necrotic" ] }
                ]
            };
            return jQuery.extend(true, {}, Creature.base, o);
        },
        false
    );
})(window.DnD);