/**
 * Created by nblumberg on 11/16/14.
 */

(function (DnD) {
    "use strict";
    DnD.define(
        "creatures.monsters.streetwise_thug",
        [ "jQuery", "Creature" ],
        function(jQuery, Creature) {
            var o = {
                name: "Streetwise Thug", level: 9, image: "../images/portraits/streetwise_thug.gif", // "http://images.community.wizards.com/community.wizards.com/user/grawln/party_pics/characters/0ff3a392aa7b3d1450c59c8f0cb9552c.gif?v=196240",
                hp: { total: 1 },
                defenses: { ac: 21, fort: 19, ref: 16, will: 16 },
                init: 3, speed: 6,
                abilities: { STR: 16, CON: 15, DEX: 12, INT: 9, WIS: 10, CHA: 11 },
                skills: { acrobatics: 0, arcana: 0, athletics: 11, bluff: 0, diplomacy: 0, dungeoneering: 0, endurance: 0, heal: 0, history: 0, insight: 0, intimidate: 0, nature: 0, perception: 3, religion: 0, stealth: 0, streetwise: 0, thievery: 8 },
                attacks: [
                    { name: "Longsword", usage: { frequency: "At-Will" }, range: "melee", toHit: 14, defense: "AC", damage: "6", keywords: [ "melee", "basic" ] },
                    { name: "Crossbow", usage: { frequency: "At-Will" }, range: "ranged", toHit: 13, defense: "AC", damage: "6", keywords: [ "ranged", "basic" ] }
                ]
            };
            return jQuery.extend(true, {}, Creature.base, o);
        },
        false
    );
})(window.DnD);