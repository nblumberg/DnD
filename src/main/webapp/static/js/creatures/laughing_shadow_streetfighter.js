/**
 * Created by nblumberg on 11/16/14.
 */

(function (DnD) {
    "use strict";
    DnD.define(
        "creatures.monsters.laughing_shadow_streetfighter",
        [ "jQuery", "Creature" ],
        function(jQuery, Creature) {
            var o = {
                name: "Laughing Shadow Streetfighter", level: 13, image: "../images/portraits/laughing_shadow_streetfighter.jpg", // http://i76.photobucket.com/albums/j23/poyodiablo/Before%20and%20After/deva_katar.jpg
                hp: { total: 128 },
                defenses: { ac: 29, fort: 26, ref: 25, will: 24 },
                init: 12, speed: 6,
                abilities: { STR: 21, CON: 16, DEX: 19, INT: 11, WIS: 17, CHA: 10 },
                skills: { acrobatics: 0, arcana: 0, athletics: 0, bluff: 13, diplomacy: 0, dungeoneering: 0, endurance: 0, heal: 0, history: 0, insight: 0, intimidate: 13, nature: 0, perception: 9, religion: 0, stealth: 15, streetwise: 0, thievery: 0 },
                attacks: [
                    { name: "Katar", usage: { frequency: "At-Will" }, range: "melee", toHit: 20, defense: "AC", damage: "2d6+6", effects: [
                        { name: "Slowed", duration: "endAttackerNext" }
                    ], keywords: [ "melee", "basic", "weapon" ] },
                    { name: "Cheap Shot", usage: { frequency: "At-Will", action: "Immediate Interrupt" }, range: "melee", toHit: 20, defense: "AC", damage: "2d6+6", effects: [ "Movement Ends" ], keywords: [ "melee", "weapon" ] },
                    { name: "Streetfighter Flourish", usage: { frequency: "Recharge", recharge: 5 }, target: { area: "close burst", size: 1 }, toHit: 19, defense: "AC", damage: "2d6+6", effects: [
                        { name: "Slowed", saveEnds: true }
                    ], keywords: [ "melee", "weapon" ] },
                    { name: "Shuriken", usage: { frequency: "At-Will" }, toHit: 19, defense: "AC", damage: "2d4+4", keywords: [ "ranged" ] }
                ]
            };
            return jQuery.extend(true, {}, Creature.base, o);
        },
        false
    );
})(window.DnD);