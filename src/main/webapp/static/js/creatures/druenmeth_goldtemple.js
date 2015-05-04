/**
 * Created by nblumberg on 11/16/14.
 */

(function (DnD) {
    "use strict";
    DnD.define(
        "creatures.monsters.druenmeth_goldtemple",
        [ "jQuery", "Creature" ],
        function(jQuery, Creature) {
            var o = {
                name: "Druemeth Goldtemple", level: 15, image: "../images/portraits/druenmeth_goldtemple.jpg",
                hp: { total: 144 },
                defenses: { ac: 29, fort: 27, ref: 29, will: 25 },
                init: 16, speed: 6,
                abilities: { STR: 21, CON: 16, DEX: 24, INT: 20, WIS: 14, CHA: 17 },
                skills: { diplomacy: 15, history: 17, insight: 14, perception: 9 },
                attacks: [
                    { name: "Longsword", usage: { frequency: "At-Will" }, range: "melee", toHit: 20, defense: "AC", damage: "2d8+6", effects: [ { name: "Grants combat advantage", duration: "endTargetNext" } ], keywords: [ "melee", "basic" ] }
                ],
                buffs: [
                    {
                        name: "Nimbus of Battle",
                        usage: {
                            frequency: "At-Will"
                        },
                        target: { area: "close", size: 10 },
                        healing: {
                            isTempHP: false,
                            usesHealingSurge: false,
                            amount: "1d10"
                        },
                        keywords: [ "healing", "aura" ]
                    }
                ]
            };
            return jQuery.extend(true, {}, Creature.base, o);
        },
        false
    );
})(window.DnD);