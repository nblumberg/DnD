/* global define */
/* exported randEffect, randEffects, loadInitiative, */
var randEffect, randEffects, loadInitiative;
(function() {
    "use strict";

    define({
        name: "data",
        dependencyNames: [ "Effect" ],
        factory: function(Effect) {

            randEffect = function() {
                var effects, i;
                effects = Object.keys(Effect.CONDITIONS);
                i = Math.floor(Math.random() * effects.length);
                return { name: effects[ i ] };
            };

            randEffects = function() {
                var effects = [];
                if (Math.random() > 0.25) {
                    return effects;
                }
                while (Math.random() > 0.25) {
                    effects.push(randEffect());
                }
                return effects;
            };

            loadInitiative = function() {
                return {
                    actors: [
                        "Barases",
                        "Bin",
                        "Festivus",
                        "Kallista",
                        "Karrion",
                        "Kitara",
                        "Lechonero",
                        "Banshrae Dartswarmer",
                        "Slystone Dwarf Ruffian",
                        "Slystone Dwarf Ruffian",
                        "Slystone Dwarf Ruffian",
                        "Slystone Dwarf Ruffian",
                        "Hethralga",
                        "Cyclops Guard",
                        "Cyclops Guard",
                        "Cyclops Guard",
                        "Cyclops Guard",
                        "Dragonborn Gladiator",
                        "Dragonborn Gladiator"
                    ]
                };
            };

            return true;
        },
        includeInNamespace: false,
        namespace: "DnD"
    });

})();

