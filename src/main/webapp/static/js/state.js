/* global define, DnD */
/* exported */
(function() {
    "use strict";

    define({
        name: "state",
        factory: function() {
            var o = {};

            o.actors = {};

            o.findActor = function(id, returnIdIfNotFound) { // TODO: throw if not found?
                if (o.actors.hasOwnProperty(id)) {
                    return o.actors[ id ];
                }
                return returnIdIfNotFound ? id : null;
            };

            o.getCurrentRound = function() {
                var round = 1;
                if (typeof(DnD) !== "undefined" && DnD.History && DnD.History.central && DnD.History.central._round) { // TODO: figure out why this is coming back null
                    round = DnD.History.central._round;
                }
                return round;
            };

            return o;
        },
        includeInNamespace: false,
        namespace: "DnD"
    });

})();