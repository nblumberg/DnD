/**
 * Created by nblumberg on 11/16/14.
 */

(function (DnD) {
    "use strict";
    DnD.define(
        "creatures.monsters.legion_devil_hellguard",
        [ "jQuery", "Creature" ],
        function(jQuery, Creature) {
            var o = {
                name: "Legion Devil Hellguard", level: 11, image: "../images/portraits/legion_devil.jpg",
                hp: { total: 1 },
                defenses: { ac: 27, fort: 24, ref: 23, will: 21 },
                init: 8, speed: { walk: 6, teleport: 3 },
                abilities: { STR: 14, CON: 14, DEX: 12, INT: 10, WIS: 12, CHA: 12 },
                skills: { acrobatics: 0, arcana: 0, athletics: 0, bluff: 0, diplomacy: 0, dungeoneering: 0, endurance: 0, heal: 0, history: 0, insight: 0, intimidate: 0, nature: 0, perception: 6, religion: 0, stealth: 0, streetwise: 0, thievery: 0 },
                attacks: [
                    { name: "Longsword", usage: { frequency: "At-Will" }, range: "melee", toHit: 16, defense: "AC", damage: "9", keywords: [ "melee", "basic" ] },
                    { name: "Longsword (aftereffect)", usage: { frequency: "At-Will", action: "Immediate Reaction" }, toHit: "automatic", defense: "AC", damage: { amount: "4", type: "fire" }, keywords: [ "fire" ] }
                ]
            };
            return jQuery.extend(true, {}, Creature.base, o);
        },
        false
    );
})(window.DnD);