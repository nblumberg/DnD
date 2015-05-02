/**
 * Created by nblumberg on 10/12/14.
 */

(function () {
    "use strict";

    DnD.define(
        "SavingThrow",
        [ "out", "Roll" ],
        function(out, Roll) {
            function SavingThrow(params) {
                this._init(params);
            }

            SavingThrow.prototype = new Roll({ dieCount: 1, dieSides: 20, extra: 0, crits: false });

            SavingThrow.prototype._init = function(params) {
                this.__log = out.logFn.bind("SavingThrow");
                this.__log("constructor", arguments);
                params = params || {};
                this.effect = params.effect;
            };

            SavingThrow.prototype._anchorHtml = function(conditional) {
                var success;
                this.__log("_anchorHtml", arguments);
                success = (this.getLastRoll().total + (conditional && conditional.total ? conditional.total : 0)) >= 10;
                return (success ? "Saves" : "Fails to save") + " against " + this.effect.toString();
            };

            SavingThrow.prototype.toString = function() {
                this.__log("toString", arguments);
                return "Saving Throw";
            };

            return SavingThrow;
        },
        true
    );
})();