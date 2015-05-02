/**
 * Created by nblumberg on 11/16/14.
 */

(function (DnD) {
    "use strict";
    DnD.define(
        "creatures.monsters.laughing_shadow_groveler",
        [ "jQuery", "Creature" ],
        function(jQuery, Creature) {
            var o = {
                name: "Laughing Shadow Groveler", level: 13, image: "../images/portraits/laughing_shadow_groveler.jpg", // http://www.koboldquarterly.com/k/wp-content/uploads/2012/01/fakir.jpg
                hp: { total: 103 },
                defenses: { ac: 27, fort: 24, ref: 26, will: 25 },
                init: 14, speed: 7,
                abilities: { STR: 12, CON: 19, DEX: 22, INT: 12, WIS: 17, CHA: 20 },
                skills: { acrobatics: 0, arcana: 0, athletics: 0, bluff: 16, diplomacy: 0, dungeoneering: 0, endurance: 0, heal: 0, history: 0, insight: 0, intimidate: 0, nature: 0, perception: 9, religion: 0, stealth: 15, streetwise: 0, thievery: 0 },
                attacks: [
                    { name: "Katar", usage: { frequency: "At-Will" }, range: "melee", toHit: 18, defense: "AC", damage: "2d6+6", keywords: [ "melee", "basic", "weapon" ] },
                    { name: "Shuriken", usage: { frequency: "At-Will" }, toHit: 18, defense: "AC", damage: "2d6+6", keywords: [ "ranged", "weapon" ] },
                    { name: "Covert Attack (melee)", usage: { frequency: "At-Will", action: "Immediate Reaction" }, range: "melee", toHit: 18, defense: "AC", damage: "4d6+6", keywords: [ "melee", "weapon" ] },
                    { name: "Covert Attack (ranged)", usage: { frequency: "At-Will", action: "Immediate Reaction" }, toHit: 18, defense: "AC", damage: "4d6+6", keywords: [ "ranged", "weapon" ] },
                    { name: "Cringe", usage: { frequency: "At-Will" }, target: { area: "close burst", size: 10 }, toHit: "automatic", defense: "AC", damage: "0", effects: [
                        { name: "Marked", duration: "endAttackerNext" }
                    ], keywords: [ "close burst" ] }
                ]
            };
            return jQuery.extend(true, {}, Creature.base, o);
        },
        false
    );
})(window.DnD);