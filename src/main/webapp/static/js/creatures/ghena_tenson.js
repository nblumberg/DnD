/**
 * Created by nblumberg on 11/16/14.
 * Based on Drow Arcanist
 */

(function (DnD) {
    "use strict";
    DnD.define(
        "creatures.monsters.ghena_tenson",
        [ "jQuery", "Creature", "creature.helpers" ],
        function(jQuery, Creature, CH) {
            var o = {
                name: "Ghena Tenson", level: 17, image: "../images/portraits/ghena_tenson.png",
                hp: { total: 126 },
                defenses: { ac: 31, fort: 26, ref: 29, will: 31 },
                actionPoints: 1,
                init: 10, speed: { walk: 7 },
                abilities: { STR: 12, CON: 12, DEX: 15, INT: 22, WIS: 18, CHA: 20 },
                skills: { arcana: 17, nature: 19, perception: 14, religion: 17 },
                attacks: [
                    CH.Power.attack("Dagger")
                        .atWill().melee().ac(22).addDamage("1d4+9").addKeywords("poison", "basic"),
                    CH.Power.attack("Poison")
                        .atWill().melee().fort(21).addDamage("0").addEffects(
                            CH.Effect.penalty(2, "attacks").saveEnds().addFailedEffects(
                                CH.Effect.weakened().saveEnds().addFailedEffects(
                                    CH.Effect.unconscious()
                                )
                            )
                        ).addKeywords("poison"),
                    CH.Power.attack("Time Missile")
                        .atWill().ranged(10).ref(21).addDamage(CH.Damage.necrotic("1d10+7")).addEffects(
                            CH.Effect.slowed().saveEnds()
                        ).addKeywords("shadow"),
                    CH.Power.attack("Fire Net")
                        .recharge(6).burst(2, 20).ref(21).addDamage(CH.Damage.fire("5d6+7")).addEffects(
                            CH.Effect.immobilized().saveEnds()
                        ).addKeywords("fire"),
                    CH.Power.attack("Darkfire")
                        .encounter().minor().ranged(10).ref(21).addDamage("0").addEffects(
                            new CH.Effect("combat advantage")
                        )
                ]
            };
            return jQuery.extend(true, {}, Creature.base, o);
        },
        false
    );
})(window.DnD);