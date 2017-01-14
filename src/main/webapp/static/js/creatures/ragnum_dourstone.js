/**
 * Created by nblumberg on 11/16/14.
 * Based on Duergar Infernal Consort
 */

(function (DnD) {
    "use strict";
    DnD.define(
        "creatures.monsters.ragnum_dourstone",
        [ "jQuery", "Creature", "creature.helpers" ],
        function(jQuery, Creature, CH) {
            var o = {
                name: "Ragnum Dourstone", level: 17, image: "../images/portraits/ragnum_dourstone.png",
                hp: { total: 164 },
                defenses: { ac: 31, fort: 30, ref: 28, will: 30 },
                actionPoints: 1,
                init: 8, speed: { walk: 5 },
                abilities: { STR: 11, CON: 20, DEX: 10, INT: 19, WIS: 21, CHA: 13 },
                skills: { dungeoneering: 14, perception: 9, religion: 17 },
                attacks: [
                    CH.Power.attack("Warhammer")
                        .atWill().melee().ac(22).addDamage("3d10+9").addEffects(
                            CH.Effect.slowed().endAttackerNext()
                        ).addKeywords("basic"),
                    CH.Power.attack("Moradin's Command")
                            .recharge(5).ranged(3).will(20).addDamage("0").addEffects(
                            CH.Effect.dominated().endAttackerNext()
                        ).addKeywords("charm", "fire"),
                    CH.Power.attack("Moradin's Command (target aura)")
                        .atWill().closeBurst(1, true).automatic().addDamage(CH.Damage.fire("10")).addKeywords("charm", "fire"),
                    CH.Power.attack("Anvil Strike")
                        .atWill().burst(1, 5).ref(20).addDamage(CH.Damage.fire("4d6+6")).addKeywords("fire", "zone"),
                    CH.Power.attack("Anvil Strike (zone)")
                        .atWill().burst(1, 5).automatic().addDamage(CH.Damage.fire("10")).addKeywords("fire", "zone"),
                    CH.Power.attack("Hammer Smite")
                        .minor().ranged(3).ac(22).addDamage("2d8+6").addEffects(
                            CH.Effect.multiple(
                                CH.Effect.ongoing(10, "fire"),
                                CH.Effect.penalty(2, "attacks")
                            ).saveEnds()
                        )
                ]
            };
            return jQuery.extend(true, {}, Creature.base, o);
        },
        false
    );
})(window.DnD);