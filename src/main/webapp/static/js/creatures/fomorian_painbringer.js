/**
 * Created by nblumberg on 11/16/14.
 */

(function (DnD) {
    "use strict";
    DnD.define(
        "creatures.monsters.fomorian_painbringer",
        [ "jQuery", "Creature", "creature.helpers" ],
        function(jQuery, Creature, CH) {
            var o = {
                name: "Fomorian Painbringer", level: 17, image: "../images/portraits/fomorian_painbringer.png",
                hp: { total: 362 },
                defenses: { ac: 35, fort: 35, ref: 29, will: 33 },
                savingThrows: 2,
                init: 8, speed: { walk: 8 },
                abilities: { STR: 242, CON: 21, DEX: 9, INT: 12, WIS: 14, CHA: 21 },
                skills: { intimidate: 19, perception: 16 },
                trueSight: 6,
                actionPoints: 1,
                attacks: [
                    new CH.Power("Flail").atWill().melee().ac(24).addDamage("2d6+7").addKeywords("basic"),
                    new CH.Power("Evil Eye").minor().atWill().ranged(5).will(22).addDamage("3d6+5"),
                    new CH.Power("Funnel Pain").atWill().ranged(8).will(22).addDamage("4d6+5"),
                    new CH.Power("Painful Visions").minor().encounter().closeBurst(4).will(22).addDamage("0").addEffects(
                        new CH.Effect("Dazed").saveEnds()
                    )
                ]
            };
            return jQuery.extend(true, {}, Creature.base, o);
        },
        false
    );
})(window.DnD);