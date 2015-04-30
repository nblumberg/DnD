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
                this.dieCount = this.dieCount || 0;
                this.dieSides = this.dieSides || 0;
                this.extra = this.extra || 0;
                this.crits = this.crits || false;
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
                this.dieCount = typeof obj.dieCount === "number" ? obj.dieCount : this.dieCount;
                this.dieSides = typeof obj.dieSides === "number" ? obj.dieSides : this.dieSides;
                this.extra = typeof obj.extra === "number" ? obj.extra : this.extra;
                this.crits = typeof obj.crits === "boolean" ? obj.crits : this.crits;
            };

            Roll.prototype.ROLL_REG_EXP = /\b(\d+)d(\d+)\b/;
            Roll.prototype.OPERANDS_REG_EXP = /\s*[+-]\s*/g;
            Roll.prototype.EXTRA_REG_EXP = /[+-]/;
            Roll.prototype.DICE_REG_EXP = /^\d+/;

            Roll.prototype._parseString = function(str) {
                var operands, i, index, args;
                this.__log("_parseString", arguments);
                if (!str) {
                    return;
                }
                if (!this.str) {
                    this.str = str;
                }
                operands = str.split(this.OPERANDS_REG_EXP);
                this.extra = 0;
                index = 0;
                for (i = 0; i < operands.length; i++) {
                    args = Array.prototype.slice.call(arguments);
                    args.shift(operands[ i ]); // remove str
                    args.unshift(operands[ i ]); // insert operand
                    if (index === 0 || str[ index ] === "+") {
                        this.extra += this._parseOperand.apply(this, args);
                    }
                    else {
                        this.extra -= this._parseOperand.apply(this, args);
                    }
                    index += (index ? 1 : 0) + operands[ i ].length;
                }
            };

            Roll.prototype._parseOperand = function(operand) {
                var value;
                if (operand.indexOf("d") !== -1) {
                    this.dieCount = window.parseInt(operand.split("d")[ 0 ], 10);
                    this.dieSides = window.parseInt(operand.split("d")[ 1 ], 10);
                    return 0;
                }
                else {
                    value = 0;
                    try {
                        value = window.parseInt(operand, 10);
                    }
                    catch (e) {}
                    return !window.isNaN(value) ? value : 0;
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