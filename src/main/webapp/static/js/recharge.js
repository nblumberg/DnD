/* global define, logFn */
/* exported DnD.Roll.Recharge */
(function() {
    "use strict";

    define({
        name: "Roll.Recharge",
        dependencyNames: [ "Roll" ],
        factory: function(Roll) {

            function Recharge(params) {
                this.init(params);
            }

            Recharge.prototype = new Roll();

            Recharge.prototype.init = function(params) {
                if (!params) {
                    return;
                }
                this.proxyObj = params.proxyObj || {};
                if (!params.proxyObj) {
                    this.proxy({ object: this.proxyObj });
                }
                Roll.prototype.init.call(this, { proxyObj: this.proxyObj, dieCount: 1, dieSides: 6, extra: 0, crits: false });

                this.__log = logFn.bind(this, "Recharge");
                this.__log("constructor", arguments);
                this.attack = params.attack;
            };

            Recharge.prototype.isRecharged = function() {
                var h;
                this.__log("isRecharged", arguments);
                h = this.getLastRoll();
                return h.total <= this.attack.usage.recharge;
            };

            Recharge.prototype._anchorHtml = function(conditional) {
                this.__log("_anchorHtml", arguments);
                return (this.isRecharged() ? "Recharged " : "Failed to recharge ") + this.attack.name + (conditional && conditional.text ? conditional.text : "");
            };

            Recharge.prototype.anchor = function(conditional) {
                var h;
                this.__log("anchor", arguments);
                h = this.getLastRoll();
                h.breakdown = " &lt;= " + this.attack.usage.recharge;
                return Roll.prototype.anchor.call(this, conditional);
            };

            Recharge.prototype.toString = function() {
                this.__log("toString", arguments);
                return "Recharge";
            };

            return Recharge;
        },
        includeInNamespace: true,
        namespace: "DnD"
    });

})();