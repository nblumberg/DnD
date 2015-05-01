/**
 * Created by nblumberg on 11/16/14.
 */

(function (DnD) {
    "use strict";
    DnD.define(
        "creatures.monsters.dragonborn_raider",
        [ "jQuery", "Creature", "creatures.monsters.dragonborn_base" ],
        function(jQuery, Creature, base) {
            var o = {
                name: "Dragonborn Raider", level: 13, image: "../images/portraits/dragonborn_raider.jpg", // "http://1-media-cdn.foolz.us/ffuuka/board/tg/image/1336/87/1336876770629.jpg
                hp: { total: 129 },
                defenses: { ac: 27, fort: 23, ref: 24, will: 21 },
                init: 13, speed: 7,
                abilities: { STR: 18, CON: 17, DEX: 21, INT: 10, WIS: 14, CHA: 12 },
                skills: { history: 8, intimidate: 9, perception: 13, stealth: 16 },
                attackBonuses: [
                    {
                        combatAdvantage: true,
                        damage: "1d6"
                    }].concat(base.attackBonuses),
                attacks: [
                    { name: "Katar", usage: { frequency: "At-Will" }, range: "melee", toHit: 19, defense: "AC", damage: "1d6+4", keywords: [ "melee", "basic" ] },
                    { name: "Dragon Breath", usage: { frequency: "At-Will" }, range: 3, toHit: 14, defense: "Ref", damage: { amount: "1d6+3", type: "fire" }, keywords: [ "close blast" ] }
                ]
            };
            return jQuery.extend(true, {}, base, o);
        },
        false
    );
})(window.DnD);