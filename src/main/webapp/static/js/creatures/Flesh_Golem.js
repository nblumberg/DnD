/**
 * Created by nblumberg on 11/16/14.
 */

(function (DnD) {
    "use strict";
    DnD.define(
        "creatures.monsters.flesh_golem",
        [ "jQuery", "Creature" ],
        function(jQuery, Creature) {
            var o = {
                name: "Flesh Golem", level: 12, image: "../images/portraits/flesh_golem.jpg", // http://www.wizards.com/dnd/images/eo_fleshgolem_med.jpg
                hp: { total: 304 },
                defenses: { ac: 26, fort: 29, ref: 21, will: 22 },
                init: 4, speed: { walk: 6 },
                actionPoints: 1,
                abilities: { STR: 20, CON: 22, DEX: 7, INT: 3, WIS: 8, CHA: 3 },
                skills: { perception: 5 },
                attacks: [
                    { name: "Slam", usage: { frequency: "At-Will" }, range: "reach", toHit: 16, defense: "AC", damage: "2d8+5", effects: [
                        { name: "Dazed", saveEnds: true }
                    ], keywords: [ "melee", "basic" ] },
                    { name: "Berserker Attack", usage: { frequency: "At-Will", action: "Immediate Reaction" }, range: "reach", toHit: 16, defense: "AC", damage: "2d8+5", effects: [
                        { name: "Dazed", saveEnds: true }
                    ], keywords: [ "melee" ] },
                    { name: "Golem Rampage", usage: { frequency: "Recharge", recharge: 5 }, range: "reach", toHit: 16, defense: "AC", damage: "2d8+5", effects: [
                        { name: "Dazed", saveEnds: true }
                    ], keywords: [ "melee" ] }
                ]
            };
            return jQuery.extend(true, {}, Creature.base, o);
        },
        false
    );
})(window.DnD);