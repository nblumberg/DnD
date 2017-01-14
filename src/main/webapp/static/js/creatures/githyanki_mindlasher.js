/**
 * Created by nblumberg on 11/16/14.
 */

(function (DnD) {
    "use strict";
    DnD.define(
        "creatures.monsters.githyanki_mindlasher",
        [ "jQuery", "Creature", "creature.helpers", "creatures.monsters.base.githyanki" ],
        function(jQuery, Creature, CH, base) {
            var o = {
                name: "Githyanki Mindlasher", level: 18, image: "../images/portraits/githyanki_mindslicer.jpg", // http://cdn.obsidianportal.com/images/121677/githyanki_2_2.jpg
                hp: { total: 132 },
                defenses: { ac: 30, fort: 29, ref: 33, will: 29 },
                init: 16, speed: { walk: 8, jump: 5 },
                abilities: { STR: 22, CON: 18, DEX: 25, INT: 20, WIS: 22, CHA: 14 },
                skills: { acrobatics: 0, arcana: 0, athletics: 0, bluff: 0, diplomacy: 0, dungeoneering: 0, endurance: 0, heal: 0, history: 11, insight: 12, intimidate: 0, nature: 0, perception: 20, religion: 0, stealth: 0, streetwise: 0, thievery: 0 },
                attacks: [
                    new CH.Power("Silver Longsword")
                        .atWill().melee().ac(25).addDamage({ amount: "2d8+4", type: "psychic" }).addKeywords("psychic", "basic"),
                    new CH.Power("Mind Crush")
                        .recharge(5).burst(2, 20).will(23).addDamage("1d10")
                        .addEffects(
                            new CH.Effect().ongoing(5, "psychic").saveEnds().addAfterEffects(
                               new CH.Effect().saveEnds().addChildren(
                                   { name: "vulnerable", amount: "10", type: "psychic" },
                                   { name: "only basic attacks" }
                               )
                            )
                        ).addKeywords("psychic"),
                    new CH.Power("Psychic Slam")
                        .atWill().burst(2, 10).will(23).addDamage({ amount: "2d8", type: "psychic" }).addEffects("Prone").addKeywords("psychic")
                ]
            };
            return jQuery.extend(true, {}, base, o);
        },
        false
    );
})(window.DnD);