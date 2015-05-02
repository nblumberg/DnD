/**
 * Created by nblumberg on 11/16/14.
 */

(function (DnD) {
    "use strict";
    DnD.define(
        "creatures.monsters.githyanki_thug",
        [ "jQuery", "Creature" ],
        function(jQuery, Creature) {
            var o = {
                name: "Githyanki Thug", level: 12, image: "../images/portraits/githyanki_thug.jpg", // http://www.worldofazolin.com/wiki/images/1/1d/Githyanki_warrior.jpg
                hp: { total: 1 },
                defenses: { ac: 24, fort: 26, ref: 21, will: 21 },
                init: 6, speed: 5,
                abilities: { STR: 21, CON: 21, DEX: 11, INT: 11, WIS: 11, CHA: 13 },
                skills: { acrobatics: 0, arcana: 0, athletics: 0, bluff: 0, diplomacy: 0, dungeoneering: 0, endurance: 0, heal: 0, history: 0, insight: 0, intimidate: 0, nature: 0, perception: 6, religion: 0, stealth: 0, streetwise: 0, thievery: 0 },
                attacks: [
                    { name: "Silver Greatsword", usage: { frequency: "At-Will" }, range: "melee", toHit: 15, defense: "AC", damage: "5", effects: [
                        { name: "Immobilized", saveEnds: true }
                    ], keywords: [ "melee", "psychic", "basic" ] }
                ]
            };
            return jQuery.extend(true, {}, Creature.base, o);
        },
        false
    );
})(window.DnD);