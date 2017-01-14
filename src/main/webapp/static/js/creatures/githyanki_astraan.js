/**
 * Created by nblumberg on 11/16/14.
 */

(function (DnD) {
    "use strict";
    DnD.define(
        "creatures.monsters.githyanki_astraan",
        [ "jQuery", "Creature", "creature.helpers", "creatures.monsters.base.githyanki" ],
        function(jQuery, Creature, CH, base) {
            var o, telekineticBlast;
            telekineticBlast = new CH.Power("Telekinetic Blast").recharge(4).ranged(Number.POSITIVE_INFINITY).fort(20).addDamage("2d10");
            o = {
                name: "Githyanki Astraan", level: 16, image: "../images/portraits/githyanki_astraan.jpg", // http://vignette1.wikia.nocookie.net/forgottenrealms/images/c/cc/Monster_Manual_5e_-_Githzerai_-_p161.jpg/revision/latest?cb=20141112215744
                hp: { total: 155 },
                defenses: { ac: 30, fort: 27, ref: 30, will: 28 },
                init: 13, speed: { walk: 8, jump: 5 },
                abilities: { STR: 18, CON: 19, DEX: 20, INT: 24, WIS: 19, CHA: 21 },
                attacks: [
                    new CH.Power("Silver Dagger")
                        .atWill().melee().ac(21).addDamage({ amount: "2d4+4", type: "psychic" }).addEffects(new CH.Effect("Stunned").saveEnds()).addKeywords("psychic", "basic"),
                    new CH.Power("Telekinetic Strike")
                        .atWill().ranged(20).ref(20).addDamage({ amount: "2d10+6", type: "force" }).addKeywords("force"),
                    new CH.Power("Astral Fire")
                        .atWill().burst(2, 20).ref(20).addDamage({ amount: "2d6+5", type: [ "cold", "fire" ] }).addKeywords("force"),
                    telekineticBlast,
                    jQuery.extend(true, {}, telekineticBlast, { name: "Telekinetic Blast (ceiling)" }).addDamage("1d10")
                ],
                buffs: [
                    new CH.Power("Astral Ward").encounter().addEffects(
                        new CH.Effect().bonus(2, "ac").endTargetNext(),
                        new CH.Effect().bonus(2, "fort").endTargetNext(),
                        new CH.Effect().bonus(2, "ref").endTargetNext(),
                        new CH.Effect().bonus(2, "will").endTargetNext()
                    )
                ]
            };
            return jQuery.extend(true, {}, base, o);
        },
        false
    );
})(window.DnD);