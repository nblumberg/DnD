/**
 * Created by nblumberg on 10/12/14.
 */

(function () {
    "use strict";

    DnD.define(
        "Abilities",
        [ "out" ],
        function(out) {
            function Abilities(params) {
                var i, ability, abilities;
                out.logFn("Abilities", "constructor", arguments);
                abilities = [ "STR", "DEX", "CON", "INT", "WIS", "CHA" ];
                params = params || {};
                for (i = 0; i < abilities.length; i++) {
                    ability = abilities[ i ];
                    this[ ability ] = params[ ability ] || 10;
                    this[ ability + "mod" ] = Math.floor((this[ ability ] - 10) / 2);
                }
                this.toString = function() { return "[Abilities]"; };
            };

            return Abilities;
        },
        true
    );

})();