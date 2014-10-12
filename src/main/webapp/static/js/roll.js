/**
 * Created by nblumberg on 10/11/14.
 */

(function () {
    "use strict";

    DnD.define(
        "Roll",
        [ "out", "Serializable" ],
        function(out, Serializable) {
            function Roll(params) {
                this._init(params);
            }

            Roll.prototype = new Serializable();

            Roll.prototype._init = function(params) {
                this.__log = out.logFn.bind(this, "Roll");
                this.__log("constructor", arguments);
                this._history = [];
                this.dieCount = 0;
                this.dieSides = 0;
                this.extra = 0;
                this.crits = false;
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
                    clone = new Roll();
                }
                clone.dieCount = this.dieCount;
                clone.dieSides = this.dieSides;
                clone.extra = this.extra;
                clone.crits = this.crits;
                return clone;
            };

            Roll.prototype._parseObject = function(obj) {
                this.__log("_parseObject", arguments);
                this.dieCount = obj.dieCount;
                this.dieSides = obj.dieSides;
                this.extra = obj.extra;
                this.crits = obj.crits;
            };

            Roll.prototype.EXTRA_REG_EXP = /[+-]/;
            Roll.prototype.DICE_REG_EXP = /^\d+/;

            Roll.prototype._parseString = function(str) {
                var hasDice, hasExtra;
                this.__log("_parseString", arguments);
                hasDice = str.indexOf("d") !== -1;
                hasExtra = !hasDice && str.length || this.EXTRA_REG_EXP.test(str);
                if (hasDice) {
                    this.dieCount = parseInt(str.split("d")[ 0 ], 10);
                    str = str.split("d")[ 1 ];
                    this.dieSides = parseInt(hasExtra ? this.DICE_REG_EXP.exec(str) : str, 10);
                    str = str.substr(("" + this.dieSides).length);
                }
                else {
                    this.dieCount = 0;
                    this.dieSides = 0;
                }
                if (hasExtra) {
                    this.extra = parseInt(str, 10);
                }
            };

            Roll.prototype.roll = function() {
                var value, h, i, die;
                this.__log("roll", arguments);
                value = 0;
                h = { dice: [] };
                this._history.push(h);
                for (i = 0; i < this.dieCount; i++) {
                    die = Math.ceil(Math.random() * this.dieSides);
                    h.dice.push(die);
                    value += die;
                }
                h.total = value + (this.extra || 0);
                return h.total;
            };

            Roll.prototype.max = function() {
                var value, h, i, die;
                this.__log("max", arguments);
                value = 0;
                h = { dice: [] };
                this._history.push(h);
                for (i = 0; i < this.dieCount; i++) {
                    die = this.dieSides;
                    h.dice.push(die);
                    value += die;
                }
                h.isMax = true;
                h.total = value + (this.extra || 0);
                return h.total;
            };

            Roll.prototype.min = function() {
                var value, h, i, die;
                this.__log("min", arguments);
                value = 0;
                h = { dice: [] };
                this._history.push(h);
                for (i = 0; i < this.dieCount; i++) {
                    die = 1;
                    h.dice.push(die);
                    value += die;
                }
                h.isMin = true;
                h.total = value + (this.extra || 0);
                return h.total;
            };

            Roll.prototype.add = function(total) {
                var value, remainder, h, dice, i, die;
                this.__log("add", arguments);
                value = Math.floor((total - this.extra) / this.dieCount);
                remainder = (total - this.extra) % this.dieCount;
                dice = [];
                for (i = 0; i < this.dieCount; i++) {
                    die = Math.floor(value) + (i === this.dieCount - 1 && remainder ? remainder : 0);
                    dice.push(die);
                }
                h = { total: total, dice: dice, manual: true };
                this._history.push(h);
            };

            Roll.prototype.getLastRoll = function() {
                this.__log("getLastRoll", arguments);
                return this._history && this._history.length ? this._history[ this._history.length - 1 ] : { dice: [], total: 0 };
            };

            Roll.prototype.isCritical = function() {
                var h;
                this.__log("isCritical", arguments);
                if (!this.crits || this.dieCount !== 1 || this.dieSides !== 20) {
                    return false;
                }
                h = this.getLastRoll();
                return h && h.dice && h.dice.length ? h.dice[0] === 20 : false;
            };

            Roll.prototype.isFumble = function() {
                var h;
                this.__log("isFumble", arguments);
                if (!this.crits || this.dieCount !== 1 || this.dieSides !== 20) {
                    return false;
                }
                h = this.getLastRoll();
                return h && h.dice && h.dice.length ? h.dice[0] === 1 : false;
            };

            Roll.prototype.breakdown = function(conditional) {
                var h, value, output, i;
                this.__log("breakdown", arguments);
                h = this.getLastRoll();
                output = "";
                if (this.crits && (this.isCritical() || this.isFumble())) {
                    output += this.isCritical() ? "CRIT" : "FUMBLE";
                }
                else {
                    for (i = 0; h && h.dice && i < h.dice.length; i++) {
                        output += (output ? " + " : "");
                        output += h.dice[ i ];
                    }
                }
                if ((this.extra || !output) && !(this.crits && (this.isCritical() || this.isFumble()))) {
                    if (output) {
                        output += this.extra >= 0 ? " + " : " ";
                    }
                    output += this.extra;
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
                var d, operand;
                this.__log("toString", arguments);
                d = this.dieCount * this.dieSides ? this.dieCount + "d" + this.dieSides : "";
                operand = this.extra >= 0 ? "+" : "";
                return d + (d && this.extra ? operand : "") + (this.extra || !d ? this.extra : "");
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
        true
    );

})();