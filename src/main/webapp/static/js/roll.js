/* global define, logFn */
/* exported DnD.Roll */
(function() {
    "use strict";

    define({
        name: "Roll",
        dependencyNames: [ "Serializable" ],
        factory: function(Serializable) {

            function Roll(params) {
                this.init(params);
            }

            Roll.prototype = new Serializable();

            Roll.prototype.init = function(params) {
                if (!params) {
                    return;
                }
                this.__log = logFn.bind(this, "Roll");
                this.__log("init", arguments);
                this.proxyObj = params.proxyObj || {};
                this.proxyObj._history = [];
                this.proxyObj.dieCount = 0;
                this.proxyObj.dieSides = 0;
                this.proxyObj.extra = 0;
                this.proxyObj.crits = false;
                if (!params.proxyObj) {
                    this.proxy({ object: this.proxyObj });
                }
                if (typeof(params) === "string") {
                    this._parseString(params);
                }
                else if (params) {
                    this._parseObject(params);
                }
            };

            Roll.prototype.clone = function(clone) {
                this.__log("clone", arguments);
                if (!clone) {
                    clone = new Roll(this.getValues());
                }
                else {
                    clone._parseObject(this.getValues());
                }
                return clone;
            };

            Roll.prototype._parseObject = function(obj) {
                this.__log("_parseObject", arguments);
                this.set(function(o) {
                    o._history = obj._history || o._history || [];
                    o.dieCount = obj.dieCount || o.dieCount || 0;
                    o.dieSides = obj.dieSides || o.dieSides || 0;
                    o.extra = obj.extra || o.extra || 0;
                    o.crits = obj.crits || o.crits || false;
                });
            };

            Roll.prototype.EXTRA_REG_EXP = /[+-]/;
            Roll.prototype.DICE_REG_EXP = /^\d+/;

            Roll.prototype._parseString = function(str) {
                var hasDice, hasExtra;
                this.__log("_parseString", arguments);
                hasDice = str.indexOf("d") !== -1;
                hasExtra = !hasDice && str.length || this.EXTRA_REG_EXP.test(str);
                this.set(function(o) {
                    if (hasDice) {
                        o.dieCount = parseInt(str.split("d")[ 0 ], 10);
                        str = str.split("d")[ 1 ];
                        o.dieSides = parseInt(hasExtra ? this.DICE_REG_EXP.exec(str) : str, 10);
                        str = str.substr(("" + o.dieSides).length);
                    }
                    else {
                        o.dieCount = 0;
                        o.dieSides = 0;
                    }
                    if (hasExtra) {
                        o.extra = parseInt(str, 10);
                    }
                }.bind(this));
            };

            Roll.prototype.roll = function() {
                var h = { dice: [] };
                this.__log("roll", arguments);
                this.set(function(o) {
                    var value, i, die;
                    value = 0;
                    for (i = 0; i < o.dieCount; i++) {
                        die = Math.ceil(Math.random() * o.dieSides);
                        h.dice.push(die);
                        value += die;
                    }
                    h.total = value + (o.extra || 0);

                    o._history.push(h);
                    return [ "_history" ];
                });
                return h.total;
            };

            Roll.prototype.max = function() {
                var h = { dice: [] };
                this.__log("max", arguments);
                this.set(function(o) {
                    var value, i, die;
                    value = 0;
                    for (i = 0; i < o.dieCount; i++) {
                        die = o.dieSides;
                        h.dice.push(die);
                        value += die;
                    }
                    h.isMax = true;
                    h.total = value + (o.extra || 0);

                    o._history.push(h);
                    return [ "_history" ];
                });
                return h.total;
            };

            Roll.prototype.min = function() {
                var h = { dice: [] };
                this.__log("min", arguments);
                this.set(function(o) {
                    var value, i, die;
                    value = 0;
                    for (i = 0; i < o.dieCount; i++) {
                        die = 1;
                        h.dice.push(die);
                        value += die;
                    }
                    h.isMin = true;
                    h.total = value + (o.extra || 0);

                    o._history.push(h);
                    return [ "_history" ];
                });
                return h.total;
            };

            Roll.prototype.add = function(total) {
                this.__log("add", arguments);
                this.set(function(o) {
                    var value, remainder, h, dice, i, die;
                    value = Math.floor((total - o.extra) / o.dieCount);
                    remainder = (total - o.extra) % o.dieCount;
                    dice = [];
                    for (i = 0; i < o.dieCount; i++) {
                        die = Math.floor(value) + (i === o.dieCount - 1 && remainder ? remainder : 0);
                        dice.push(die);
                    }
                    h = { total: total, dice: dice, manual: true };

                    o._history.push(h);
                    return [ "_history" ];
                });
            };

            Roll.prototype.getLastRoll = function() {
                var values;
                this.__log("getLastRoll", arguments);
                values = this.getValues();
                return values._history && values._history.length ? values._history[ values._history.length - 1 ] : { dice: [], total: 0 };
            };

            Roll.prototype.isCritical = function() {
                var h, values;
                this.__log("isCritical", arguments);
                values = this.getValues();
                if (!values.crits || values.dieCount !== 1 || values.dieSides !== 20) {
                    return false;
                }
                h = this.getLastRoll();
                return h && h.dice && h.dice.length ? h.dice[0] === 20 : false;
            };

            Roll.prototype.isFumble = function() {
                var h, values;
                this.__log("isFumble", arguments);
                values = this.getValues();
                if (!values.crits || values.dieCount !== 1 || values.dieSides !== 20) {
                    return false;
                }
                h = this.getLastRoll();
                return h && h.dice && h.dice.length ? h.dice[0] === 1 : false;
            };

            Roll.prototype.breakdown = function(conditional) {
                var h, values, output, i;
                this.__log("breakdown", arguments);
                h = this.getLastRoll();
                values = this.getValues();
                output = "";
                if (values.crits && (this.isCritical() || this.isFumble())) {
                    output += this.isCritical() ? "CRIT" : "FUMBLE";
                }
                else {
                    for (i = 0; h && h.dice && i < h.dice.length; i++) {
                        output += (output ? " + " : "");
                        output += h.dice[ i ];
                    }
                }
                if ((values.extra || !output) && !(values.crits && (this.isCritical() || this.isFumble()))) {
                    if (output) {
                        output += values.extra >= 0 ? " + " : " ";
                    }
                    output += values.extra;
                }
                if (h.breakdown) {
                    output += h.breakdown;
                }
                if (conditional) {
                    output += conditional;
                }
                return "[" + this._breakdownToString() + "] " + output;
            };

            Roll.prototype._breakdownToString = function() {
                this.__log("_breakdownToString", arguments);
                return this.toString();
            };

            Roll.prototype.toString = function() {
                var values, d, operand;
                this.__log("toString", arguments);
                values = this.getValues();
                d = values.dieCount * values.dieSides ? values.dieCount + "d" + values.dieSides : "";
                operand = values.extra >= 0 ? "+" : "";
                return d + (d && values.extra ? operand : "") + (values.extra || !d ? values.extra : "");
            };

            Roll.prototype._anchorHtml = function(conditional) {
                var h;
                this.__log("_anchorHtml", arguments);
                h = this.getLastRoll();
                return "" + ((h && h.total ? h.total : 0) + (conditional && conditional.total ? conditional.total : 0)) + (conditional && conditional.text ? conditional.text : "");
            };

            Roll.prototype.anchor = function(conditional) {
                this.__log("anchor", arguments);
                return "<a href=\"javascript:void(0);\" title=\"" + this.breakdown(conditional && conditional.breakdown ? conditional.breakdown : null) + "\">" + this._anchorHtml(conditional) + "</a>";
            };

            return Roll;
        },
        includeInNamespace: true,
        namespace: "DnD"
    });

})();