/**
 * Created by nblumberg on 11/16/14.
 */

(function (DnD) {
    "use strict";
    DnD.define(
        "creatures.monsters.night_hag",
        [ "jQuery", "Creature" ],
        function(jQuery, Creature) {
            var o = {
                name: "Night Hag", level: 14, image: "../images/portraits/night_hag.jpg",
                hp: { total: 109 },
                defenses: { ac: 27, fort: 28, ref: 26, will: 26 },
                init: 15, speed: 8,
                abilities: { STR: 22, CON: 19, DEX: 18, INT: 14, WIS: 17, CHA: 18 },
                skills: { arcana: 14, bluff: 16, intimidate: 16, perception: 10, stealth: 16 },
                attacks: [
                    { name: "Claw", usage: { frequency: "At-Will" }, range: "melee", toHit: 19, defense: "AC", damage: "1d6+6", keywords: [ "melee", "basic" ] },
                    { name: "Claw (combat advantage)", usage: { frequency: "At-Will" }, range: "melee", toHit: 19, defense: "AC", damage: "1d6+6", effects: [ { name: "stunned", saveEnds: true } ], keywords: [ "melee", "basic" ] },
                    { name: "Dream Haunting (initial)", usage: { frequency: "At-Will" }, range: "melee", toHit: 18, defense: "Will", damage: { amount: "3d6+4", type: "psychic" }, keywords: [ "melee", "psychic" ] },
                    { name: "Dream Haunting", usage: { frequency: "At-Will" }, range: "melee", toHit: "automatic", defense: "Will", damage: { amount: "3d6+4", type: "psychic" }, keywords: [ "melee", "psychic" ] },
                    { name: "Wave of Sleep", usage: { frequency: "Recharge", recharge: 6 }, target: { area: "blast", size: 5 }, toHit: 17, defense: "Will", damage: { amount: "1d8+3", type: "psychic" }, effects: [ { name: "dazed", saveEnds: true } ], keywords: [ "close", "blast", "psychic", "sleep" ] },
                    { name: "Wave of Sleep (failed save)", usage: { frequency: "At-Will" }, toHit: "automatic", defense: "Will", damage: "0", effects: [ "unconscious" ], keywords: [ "close", "blast", "psychic", "sleep" ] }
                ]
            };
            return jQuery.extend(true, {}, Creature.base, o);
        },
        false
    );
})(window.DnD);