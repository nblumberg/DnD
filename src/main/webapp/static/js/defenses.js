/**
 * Created by nblumberg on 10/12/14.
 */

(function () {
    "use strict";

    DnD.define(
        "Defenses",
        [ "out" ],
        function(out) {
            return function Defenses(params) {
                out.logFn("Defenses", "constructor", arguments);
                params = params || {};
                this.ac = params.ac || 10;
                this.fort = params.fort || 10;
                this.ref = params.ref || 10;
                this.will = params.will || 10;
                this.resistances = params.resistances || {};
                this.toString = function() { return "[Defenses]"; };
            };
        },
        true
    );

})();