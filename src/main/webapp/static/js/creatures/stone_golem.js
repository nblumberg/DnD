/**
 * Created by nblumberg on 11/16/14.
 */

(function (DnD) {
    "use strict";
    DnD.define(
        "creatures.monsters.stone_golem",
        [ "jQuery", "Creature" ],
        function(jQuery, Creature) {
            var o = {
                name: "Stone Golem", level: 17, image: "https://s-media-cache-ak0.pinimg.com/236x/15/6b/43/156b43d9ba83ed4b8c024eee0c4c04e1.jpg",
                hp: { total: 336 },
                defenses: { ac: 33, fort: 33, ref: 24, will: 24 },
                init: 12, speed: 6,
                abilities: { STR: 22, CON: 20, DEX: 16, INT: 11, WIS: 17, CHA: 11 },
                skills: { acrobatics: 0, arcana: 0, athletics: 0, bluff: 0, diplomacy: 0, dungeoneering: 0, endurance: 0, heal: 0, history: 0, insight: 0, intimidate: 0, nature: 0, perception: 15, religion: 0, stealth: 0, streetwise: 0, thievery: 0 },
                attacks: [
                    { name: "Slam", usage: { frequency: "At-Will" }, range: "2", toHit: 23, defense: "AC", damage: "3d6+7", effects: [ { name: "dazed", saveEnds: true } ], keywords: [ "melee", "basic" ] },
                    { name: "Golem Rampage", usage: { frequency: "Recharge", recharge: 5 }, range: "2", toHit: 23, defense: "AC", damage: "3d6+7", effects: [ { name: "dazed", saveEnds: true } ], keywords: [ "melee" ] },
                    { name: "Death Burst", usage: { frequency: "Encounter" }, range: "2", toHit: 23, defense: "AC", damage: "2d6+7", keywords: [ "ranged" ] }
                ]
            };
            return jQuery.extend(true, {}, Creature.base, o);
        },
        false
    );
})(window.DnD);