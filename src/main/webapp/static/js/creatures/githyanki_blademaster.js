/**
 * Created by nblumberg on 11/16/14.
 */

(function (DnD) {
    "use strict";
    DnD.define(
        "creatures.monsters.githyanki_blademaster",
        [ "jQuery", "Creature", "creature.helpers", "creatures.monsters.base.githyanki" ],
        function(jQuery, Creature, CH, base) {
            var o, silverLongsword;
            silverLongsword = new CH.Power("Silver Longsword")
                .atWill().melee().ac(22).addDamage({ amount: "8", type: "psychic" }).addKeywords("psychic");
            o = {
                name: "Githyanki Blademaster", level: 17, image: "../images/portraits/githyanki_blademaster.jpg", // http://vignette3.wikia.nocookie.net/forgottenrealms/images/3/3d/Monster_Manual_5e_-_Githyanki_-_p160.jpg/revision/latest?cb=20141112214919
                hp: { total: 1 },
                defenses: { ac: 28, fort: 25, ref: 23, will: 22 },
                init: 15, speed: { walk: 5 },
                abilities: { STR: 24, CON: 15, DEX: 21, INT: 13, WIS: 12, CHA: 21 },
                attacks: [
                    new CH.Power(silverLongsword).addKeywords("basic"),
                    jQuery.extend(true, {}, new CH.Power(silverLongsword), { name: "Twin Longsword Strike" }).addDamage({ amount: "4", type: "psychic" })
                ]
            };
            return jQuery.extend(true, {}, base, o);
        },
        false
    );
})(window.DnD);