/**
 * Created by nblumberg on 7/1/15.
 */

(function (DnD) {
    "use strict";
    DnD.define(
        "creatures.monsters.quickling_zephyr",
        [ "jQuery", "Creature" ],
        function(jQuery, Creature) {
            var o = {
                name: "Quickling Zephyr", level: 14, image: "../images/portraits/quickling.png",
                hp: { total: 82 },
                defenses: { ac: 30, fort: 26, ref: 29, will: 23 },
                init: 20, speed: { walk: 12, climb: 6 },
                abilities: { STR: 19, CON: 20, DEX: 20, INT: 13, WIS: 11, CHA: 20 },
                skills: { acrobatics: 26, bluff: 13, perception: 10, stealth: 21 },
                attackBonuses: [
                    {
                        name: "Combat Advantage",
                        foeStatus: [
                            "combat advantage"
                        ],
                        damage: "2d6", effects: [ { name: "Dazed", saveEnds: true } ]
                    }
                ],
                attacks: [
                    { name: "Short Sword", usage: { frequency: "At-Will" }, range: "melee", toHit: 19, defense: "AC", damage: "1d6+9", keywords: [ "melee", "weapon", "basic" ] },
                    // Also implemented as an attack bonus
                    { name: "Combat Advantage", usage: { frequency: "At-Will" }, toHit: "automatic", defense: "AC", damage: "2d6", effects: [ { name: "Dazed", saveEnds: true } ], keywords: [ "melee", "striker" ] }
                ],
                buffs: [
                    { name: "Blinding Speed", usage: { frequency: "Recharge", recharge: 4 }, effects: [ { name: "Invisible", duration: "startTargetNext" } ] }
                ]
            };
            return jQuery.extend(true, {}, Creature.base, o);
        },
        false
    );
})(window.DnD);