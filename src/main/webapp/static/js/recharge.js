/**
 * Created by nblumberg on 10/11/14.
 */

(function () {
    "use strict";

    DnD.define(
        "Recharge",
        [ "out", "Roll", "Attack" ],
        function(out, Roll, Attack) {
            function Recharge(params) {
                this._init(params);
            }

            Recharge.prototype = new Roll({ dieCount: 1, dieSides: 6, extra: 0, crits: false });

            Recharge.prototype._init = function(params) {
                this.__log = out.logFn.bind(this, "Recharge");
                this.__log("constructor", arguments);
                this.attack = params.attack;
                this.isBloodied = params.bloodied;
            };

            Recharge.prototype.isRecharged = function () {
                var h;
                this.__log("isRecharged", arguments);
                h = this.getLastRoll();
                if (this.attack.usage.recharge === Attack.prototype.USAGE_RECHARGE_BLOODIED) {
                    if (this.bloodied && !this.attack.alreadyRecharged) {
                        this.attack.alreadyRecharged = true;
                        return true;
                    }
                    else {
                        return false;
                    }
                }
                else {
                    return h.total <= this.attack.usage.recharge;
                }
            };

            Recharge.prototype._anchorHtml = function (conditional) {
                this.__log("_anchorHtml", arguments);
                return (this.isRecharged() ? "Recharged " : "Failed to recharge ") + this.attack.name + (conditional && conditional.text ? conditional.text : "");
            };

            Recharge.prototype.anchor = function (conditional) {
                var h;
                this.__log("anchor", arguments);
                h = this.getLastRoll();
                h.breakdown = " &lt;= " + this.attack.usage.recharge;
                return Roll.prototype.anchor.call(this, conditional);
            };

            Recharge.prototype.toString = function () {
                this.__log("toString", arguments);
                return "Recharge";
            };

            return Recharge;
        },
        true
    );
})();