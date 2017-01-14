/**
 * Created by nblumberg on 11/16/14.
 */

(function (DnD) {
    "use strict";
    DnD.define(
        "creatures.monsters.marauder_planestalker",
        [ "jQuery", "Creature", "creature.helpers" ],
        function(jQuery, Creature, CH) {
            var o = {
                name: "Marauder Planestalker", level: 17, image: "../images/portraits/marauder_planestalker.jpg", // astral_nexus.js
                hp: { total: 129 },
                defenses: { ac: 31, fort: 28, ref: 29, will: 28 },
                init: 19, speed: { walk: 7, teleport: 5 },
                abilities: { STR: 16, CON: 21, DEX: 24, INT: 7, WIS: 21, CHA: 13 },
                attacks: [
                    CH.Power.attack("Bite").atWill().melee().ac(22).addDamage("3d6+6").addKeywords("basic"),
                    CH.Power.attack("Body Snatch").encounter().melee().fort(21).addDamage("4d6+6").addKeywords("teleportation"),
                    CH.Power.attack("Dimensional Disjunction").encounter().blast(3).will(19).addDamage("2d6+3").addEffects(new CH.Effect.vulnerable(10, "all").saveEnds())
                ],
                buffs: [
                    CH.Power.buff("Planephase Form").atWill().minor().addEffects(CH.Effect.resistance(50, "insubstantial").endTargetNext()),
                    CH.Power.buff("Planar Evasion").recharge(4).immediateReaction().addKeywords("teleportation")
                ]
            };
            return jQuery.extend(true, {}, Creature.base, o);
        },
        false
    );
})(window.DnD);