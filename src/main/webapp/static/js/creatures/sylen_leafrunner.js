/**
 * Created by nblumberg on 11/16/14.
 * Based on Drow Ranger
 */

(function (DnD) {
    "use strict";
    DnD.define(
        "creatures.monsters.sylen_leafrunner",
        [ "jQuery", "Creature", "creature.helpers" ],
        function(jQuery, Creature, CH) {
            var o = {
                name: "Sylen Leafrunner", level: 17, image: "../images/portraits/sylen_leafrunner.png",
                hp: { total: 122 },
                defenses: { ac: 29, fort: 29, ref: 31, will: 28 },
                actionPoints: 1,
                init: 13, speed: { walk: 7 },
                abilities: { STR: 16, CON: 14, DEX: 20, INT: 13, WIS: 15, CHA: 12 },
                skills: { dungeoneering: 15, perception: 15, stealth: 18 },
                attacks: [
                    CH.Power.attack("Longsword")
                        .atWill().melee().ac(24).addDamage("1d10+7").addKeywords("basic"),
                    CH.Power.attack("Longbow")
                        .atWill().ranged(20).ac(24).addDamage("1d10+7").addKeywords("basic"),
                    CH.Power.attack("Hunter's Quarry")
                        .atWill().ranged(20).automatic().addDamage("2d6")
                ]
            };
            return jQuery.extend(true, {}, Creature.base, o);
        },
        false
    );
})(window.DnD);