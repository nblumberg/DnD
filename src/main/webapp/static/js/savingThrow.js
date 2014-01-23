/* global define, logFn */
/* exported DnD.Roll.SavingThrow */
(function() {
    "use strict";

    define({
        name: "Roll.SavingThrow",
        dependencyNames: [ "Roll" ],
        factory: function(Roll) {
            function SavingThrow(params) {
                this.init(params);
            }

            SavingThrow.prototype = new Roll();

            SavingThrow.prototype.init = function(params) {
                if (!params) {
                    return;
                }
                this.proxyObj = params.proxyObj || {};
                if (!params.proxyObj) {
                    this.proxy({ object: this.proxyObj });
                }
                Roll.prototype.init.call(this, { proxyObj: this.proxyObj, dieCount: 1, dieSides: 20, extra: 0, crits: false });

                this.__log = logFn.bind("SavingThrow");
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
        includeInNamespace: true,
        namespace: "DnD"
    });

})();