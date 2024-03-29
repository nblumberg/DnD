/**
 * Created by nblumberg on 4/13/15.
 */

(function () {
    "use strict";

    DnD.define(
        "Purple",
        [ "creature.helpers", "jQuery", "Barases" ],
        function(CH, jQuery, Barases) {
            var Purple;
            Purple = jQuery.extend(true, {}, Barases, { // copied from "Visejaw Crocodile" as it's the only large, natural, non-minion crocodile and the only stats listed in the power match
                name: "Purple",
                image: "../images/portraits/crocodile.jpg", // http://usherp.org/wp-content/uploads/2013/04/crocodile-500x324.jpg
                hp: {
                    total: window.Math.floor(Barases.hp.total / 2)
                },
                speed: { walk: 6, swim: 8 },
                attacks: [
                    new CH.Power({
                        name: "Bite",
                        toHit: "WIS",
                        defense: "Ref",
                        damage: "1d8+WIS",
                        effects: [ { name: "Grabbed" } ],
                        keywords: [
                            "primal", "summoned", "basic"
                        ]
                    }).atWill().melee()
                ]
            });
            return Purple;
        },
        false
    );

})();