/**
 * Created by nblumberg on 10/12/14.
 */

(function () {
    "use strict";

    DnD.define(
        "HP",
        [ "out" ],
        function(out) {
            return function HP(params) {
                out.logFn("HP", "constructor", arguments);
                params = params || {};
                this.total = params.total || 1;
                this.current = params.current || this.total;
                this.temp = params.temp || 0;
                this.regeneration = params.regeneration || 0;
                this.toString = function() { return "[HP]"; };
            };
        },
        true
    );

    DnD.define(
        "Surges",
        [ "out" ],
        function(out) {
            return function Surges(params) {
                out.logFn("Surges", "constructor", arguments);
                params = params || {};
                this.perDay = params.perDay || 0;
                this.current = params.current || this.perDay;
                this.toString = function() { return "[Surges]"; };
            };
        },
        true
    );

})();