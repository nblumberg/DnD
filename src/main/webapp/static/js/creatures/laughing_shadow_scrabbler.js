/**
 * Created by nblumberg on 11/16/14.
 */

(function (DnD) {
    "use strict";
    DnD.define(
        "creatures.monsters.laughing_shadow_scrabbler",
        [ "jQuery", "Creature" ],
        function(jQuery, Creature) {
            var o = {
                name: "Laughing Shadow Scrabbler", level: 13, image: "../images/portraits/laughing_shadow_scrabbler.jpg", // https://www.wizards.com/dnd/images/pgte_gallery/95052.jpg
                hp: { total: 1 },
                defenses: { ac: 27, fort: 25, ref: 27, will: 24 },
                init: 12, speed: 6,
                abilities: { STR: 19, CON: 14, DEX: 18, INT: 10, WIS: 16, CHA: 8 },
                skills: { acrobatics: 0, arcana: 0, athletics: 0, bluff: 10, diplomacy: 0, dungeoneering: 0, endurance: 0, heal: 0, history: 0, insight: 0, intimidate: 0, nature: 0, perception: 9, religion: 0, stealth: 15, streetwise: 0, thievery: 0 },
                attacks: [
                    { name: "Short Sword", usage: { frequency: "At-Will" }, range: "melee", toHit: 18, defense: "AC", damage: "8", keywords: [ "melee", "basic", "weapon" ] },
                    { name: "Short Sword (combat advantage)", usage: { frequency: "At-Will" }, range: "melee", toHit: 18, defense: "AC", damage: "13", keywords: [ "melee", "basic", "weapon" ] },
                    { name: "Shuriken", usage: { frequency: "At-Will" }, toHit: 18, defense: "AC", damage: "7", keywords: [ "ranged" ] }
                ]
            };
            return jQuery.extend(true, {}, Creature.base, o);
        },
        false
    );
})(window.DnD);