/**
 * Created by nblumberg on 11/16/14.
 * Based on Amon Bassiri
 */

(function (DnD) {
    "use strict";
    DnD.define(
        "creatures.monsters.madrick",
        [ "jQuery", "Creature", "creature.helpers" ],
        function(jQuery, Creature, CH) {
            var o = {
                name: "Madrick", level: 17, image: "../images/portraits/madrick.png",
                hp: { total: 132 },
                defenses: { ac: 31, fort: 29, ref: 32, will: 29 },
                savingThrows: 2,
                actionPoints: 1,
                init: 19, speed: { walk: 6 },
                abilities: { STR: 12, CON: 12, DEX: 15, INT: 22, WIS: 18, CHA: 20 },
                skills: { arcana: 13, bluff: 15, history: 13, perception: 18, stealth: 20, thievery: 20 },
                attacks: [
                    CH.Power.attack("Dagger")
                        .atWill().melee().ac(22).addDamage("4d4+6").addKeywords("basic"),
                    CH.Power.attack("Sneak Attack")
                        .atWill().melee().automatic().addDamage("3d6"),
                    CH.Power.attack("Arcane Blade")
                        .encounter().melee().ref(20).addDamage("6d4+10"),
                    CH.Power.attack("Arcane Blade (cold)")
                        .encounter().melee().ref(20).addDamage(CH.Damage.cold("6d4+10")).addKeywords("cold"),
                    CH.Power.attack("Arcane Blade (fire)")
                        .encounter().melee().ref(20).addDamage(CH.Damage.fire("6d4+10")).addKeywords("fire"),
                    CH.Power.attack("Arcane Blade (lightning)")
                        .encounter().melee().ref(20).addDamage(CH.Damage.lightning("6d4+10")).addKeywords("lightning"),
                    CH.Power.attack("Arcane Blade (thunder)")
                        .encounter().melee().ref(20).addDamage(CH.Damage.thunder("6d4+10")).addKeywords("thunder"),
                    CH.Power.attack("Rush to Action")
                        .recharge(5).melee().ac(22).addDamage("4d4+17"),
                    CH.Power.attack("No More Secrets (cold)")
                        .encounter().minor().closeBurst(10).automatic().addDamage("0").addEffects(
                            CH.Effect.vulnerable(10, "cold").endAttackerNext()
                        ).addKeywords("cold"),
                    CH.Power.attack("No More Secrets (fire)")
                        .encounter().minor().closeBurst(10).automatic().addDamage("0").addEffects(
                            CH.Effect.vulnerable(10, "fire").endAttackerNext()
                        ).addKeywords("fire"),
                    CH.Power.attack("No More Secrets (lightning)")
                        .encounter().minor().closeBurst(10).automatic().addDamage("0").addEffects(
                            CH.Effect.vulnerable(10, "lightning").endAttackerNext()
                        ).addKeywords("cold"),
                    CH.Power.attack("No More Secrets (thunder)")
                        .encounter().minor().closeBurst(10).automatic().addDamage("0").addEffects(
                            CH.Effect.vulnerable(10, "thunder").endAttackerNext()
                        ).addKeywords("thunder")
                ],
                buffs: [
                    CH.Power.buff("Fey Step").encounter().move(),
                    CH.Power.buff("Watcher's Signet").encounter().minor().addEffects( CH.Effect.bonus(5, "stealth").endTargetNext() ),
                    CH.Power.buff("Night's Embrace").recharge(5).immediateReaction(),
                    CH.Power.buff("Swift Watcher").atWill().minor()
                ]
            };
            return jQuery.extend(true, {}, Creature.base, o);
        },
        false
    );
})(window.DnD);