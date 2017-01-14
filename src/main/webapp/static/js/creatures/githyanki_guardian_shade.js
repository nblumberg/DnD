/**
 * Created by nblumberg on 11/16/14.
 */

(function (DnD) {
    "use strict";
    DnD.define(
        "creatures.monsters.githyanki_guardian_shade",
        [ "jQuery", "Creature", "creature.helpers" ],
        function(jQuery, Creature, CH) {
            var o, soulStrike;
            soulStrike = CH.Power.attack("Soul Strike").recharge(5).melee().will(23).addDamage(CH.Damage.radiant("4d10+10")).addEffects(
                CH.Effect.vulnerable(15, "psychic").endAttackerNext()
            ).addKeywords("radiant");
            o = {
                name: "Githyanki Guardian Shade", level: 20, image: "../images/portraits/githyanki_shade.png",
                hp: { total: 756 },
                defenses: { ac: 34, fort: 30, ref: 32, will: 28 },
                immunities: [ "disease", "poison" ],
                init: 20, speed: { walk: 8, fly: 8 },
                abilities: { STR: 25, CON: 21, DEX: 23, INT: 19, WIS: 21, CHA: 26 },
                attacks: [
                    CH.Power.attack("Guardian Presence").atWill().closeBurst(1).automatic().addDamage(CH.Damage.psychic("5")).addKeywords("aura"),
                    CH.Power.attack("Ghost Sword").atWill().melee().ac(25).addDamage("2d10+7").addEffects(
                        CH.Effect.multiple(
                            CH.Effect.penalty(2, "ac"),
                            CH.Effect.penalty(2, "fort"),
                            CH.Effect.penalty(2, "ref"),
                            CH.Effect.penalty(2, "will"),
                            CH.Effect.slowed()
                        ).saveEnds()
                    ).addKeywords("basic"),
                    CH.Power.attack("Spirit Rake").atWill().minor().ranged(5).will(23).addDamage(CH.Damage.psychic("1d8+5")).addEffects(
                        CH.Effect.multiple(
                            CH.Effect.penalty(2, "ac"),
                            CH.Effect.penalty(2, "fort"),
                            CH.Effect.penalty(2, "ref"),
                            CH.Effect.penalty(2, "will")
                        ).saveEnds()
                    ),
                    CH.Power.attack("Bladed Wrath").atWill().closeBurst(3, true).automatic().addKeywords("psychic"),
                    CH.Power.attack("Guardian Fury").atWill().closeBurst(3).fort(23).addDamage(CH.Damage.force("2d8+4")).addKeywords("force"),
                    soulStrike,
                    CH.Power.attack(soulStrike, "Soul Strike (bloodied)").recharge(4),
                    CH.Power.attack("Soul Bolt").encounter().ranged(10).will(23).addDamage(CH.Damage.psychic("2d8+5")).addEffects(
                        CH.Effect.stunned().endAttackerNext()
                    ).miss(0.5, [ CH.Effect.dazed().endAttackerNext() ])
                ],
                buffs: [
                    CH.Power.buff("Astral Soul").encounter().immediateReaction().addEffects(CH.Effect.resistance(50, "insubstantial").endTargetNext())
                ]
            };
            return jQuery.extend(true, {}, Creature.base, o);
        },
        false
    );
})(window.DnD);