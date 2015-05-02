/**
 * Created by nblumberg on 11/16/14.
 */

(function (DnD) {
    "use strict";
    DnD.define(
        "creatures.monsters.laughing_shadow_sentry",
        [ "jQuery", "Creature" ],
        function(jQuery, Creature) {
            var o = {
                name: "Laughing Shadow Sentry", level: 11, image: "../images/portraits/laughing_shadow_sentry.jpg", // http://digital-art-gallery.com/oid/103/640x778_17841_The_Home_Guard_3d_fantasy_fashion_girl_woman_warrior_guard_picture_image_digital_art.jpg
                hp: { total: 47 },
                defenses: { ac: 27, fort: 24, ref: 22, will: 23 },
                init: 9, speed: 5,
                abilities: { STR: 18, CON: 16, DEX: 15, INT: 11, WIS: 16, CHA: 13 },
                skills: { acrobatics: 0, arcana: 0, athletics: 0, bluff: 0, diplomacy: 0, dungeoneering: 0, endurance: 0, heal: 0, history: 0, insight: 0, intimidate: 0, nature: 0, perception: 13, religion: 0, stealth: 0, streetwise: 11, thievery: 0 },
                attacks: [
                    { name: "Halberd", usage: { frequency: "At-Will" }, range: "reach", toHit: 18, defense: "AC", damage: "2d10+4", effects: [ "Marked" ], keywords: [ "melee", "basic" ] },
                    { name: "Halberd Sweep", usage: { frequency: "At-Will", action: "Immediate Interrupt" }, range: "reach", toHit: 16, defense: "Fort", damage: "1d10+4", effects: [ "Marked" ], keywords: [ "melee" ] },
                    { name: "Halberd Trip", usage: { frequency: "At-Will" }, range: "reach", toHit: 16, defense: "Fort", damage: "2d10+4", effects: [ "Prone" ], keywords: [ "melee" ] },
                    { name: "Crossbow", usage: { frequency: "At-Will" }, toHit: 16, defense: "AC", damage: "2d8+2", keywords: [ "ranged", "basic" ] }
                ]
            };
            return jQuery.extend(true, {}, Creature.base, o);
        },
        false
    );
})(window.DnD);