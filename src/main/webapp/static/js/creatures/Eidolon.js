/**
 * Created by nblumberg on 11/16/14.
 */

(function (DnD) {
    "use strict";
    DnD.define(
        "creatures.monsters.eidolon",
        [ "jQuery", "Creature" ],
        function(jQuery, Creature) {
            var o = {
                name: "Eidolon", level: 13, image: "../images/portraits/eidolon.png", // "http://gallery.rptools.net/d/12751-1/Rogue+Eidolon+_L_.png",
                hp: { total: 132 },
                defenses: { ac: 28, fort: 26, ref: 22, will: 23 },
                init: 8, speed: 5,
                abilities: { STR: 22, CON: 20, DEX: 14, INT: 7, WIS: 16, CHA: 11 },
                skills: { perception: 9 },
                attacks: [
                    { name: "Slam", usage: { frequency: "At-Will" }, range: "reach", toHit: 19, defense: "AC", damage: "2d8+6", keywords: [ "melee", "basic" ] },
                    { name: "Divine Retribution", usage: { frequency: "At-Will" }, range: "20", toHit: 17, defense: "Ref", damage: { amount: "2d8+5", type: "radiant" }, keywords: [ "ranged", "miss half" ] },
                    { name: "Vengeful Flames", usage: { frequency: "At-Will" }, range: "20", toHit: 17, defense: "Ref", damage: { amount: "1d8+5", type: "fire" }, effects: [
                        { name: "ongoing damage", amount: 5, saveEnds: true }
                    ], keywords: [ "ranged", "miss half" ] },
                    { name: "Hallowed Stance", usage: { frequency: "At-Will" }, range: "ranged", toHit: 99, defense: "AC", damage: { amount: "1d8", type: "radiant" } }
                ]
            };
            return jQuery.extend(true, {}, Creature.base, o);
        },
        false
    );
})(window.DnD);