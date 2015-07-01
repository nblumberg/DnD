/**
 * Created by nblumberg on 11/16/14.
 */

(function (DnD) {
    "use strict";
    DnD.define(
        "creatures.monsters.purplespawn_nightmare",
        [ "jQuery", "Creature" ],
        function(jQuery, Creature) {
            var o = {
                name: "Purplespawn Nightmare", level: 18, image: "../images/portraits/purplespawn_nightmare.jpg",
                hp: { total: 128, regeneration: 10 },
                defenses: { ac: 30, fort: 29, ref: 30, will: 28 },
                resistances: { psychic: 10 },
                init: 17, speed: { walk: 6, climb: 6 },
                abilities: { STR: 19, CON: 20, DEX: 20, INT: 13, WIS: 11, CHA: 20 },
                skills: { acrobatics: 18, bluff: 18, perception: 8, stealth: 18, thievery: 18 },
                attacks: [
                    { name: "Longsword", usage: { frequency: "At-Will" }, range: "melee", toHit: 22, defense: "AC", damage: "2d8+4", keywords: [ "melee", "weapon", "basic" ] },
                    { name: "Tail", usage: { frequency: "At-Will" }, range: "reach", toHit: 22, defense: "AC", damage: "3d6+8", effects: [
                        { name: "Dazed", saveEnds: true, afterEffects: [
                            { name: "multiple", children: [ "Dazed", "Slowed" ], saveEnds: true, afterEffects: [
                                { name: "Unconscious", saveEnds: true }
                            ] }
                        ] }
                    ], keywords: [ "melee", "sleep" ] },
                    { name: "Nightmarish Torment", usage: { frequency: "At-Will" }, toHit: "automatic", defense: "Will", damage: "0", effects: [ { name: "ongoing damage", amount: 10, type: "psychic", saveEnds: true } ], keywords: [ "psychic" ] }
                ]
            };
            return jQuery.extend(true, {}, Creature.base, o);
        },
        false
    );
})(window.DnD);