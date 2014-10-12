/**
 * Created by nblumberg on 10/12/14.
 */

(function () {
    "use strict";

    DnD.define(
        "Implement",
        [ "out", "Damage" ],
        function(out, Damage) {
            function Implement(params) {
                this._init(params);
            }

            Implement.prototype._init = function(params) {
                this.__log = out.logFn.bind(this, "Implement");
                this.__log("constructor", arguments);
                this.__log("_init", arguments);
                params = params || {};
                this.name = params.name;
                this.enhancement = params.enhancement;
                this.crit = new Damage(params.crit);
                this.isMelee = false;
                this.type = params.type;
            };

            Implement.prototype.toString = function() {
                this.__log("toString", arguments);
                return "[Implement \"" + this.name + "\"]";
            };

            return Implement;
        },
        true
    );


    DnD.define(
        "Weapon",
        [ "out", "Implement", "Damage" ],
        function(out, Implement, Damage) {
            function Weapon(params) {
                this.__log = out.logFn.bind(this, "Weapon");
                params = params || {};
                this._init(params);
                this.isMelee = params.isMelee || false;
                this.proficiency = params.proficiency || 0;
                this.damage = new Damage(params.damage);
            };

            Weapon.prototype = new Implement();

            Weapon.prototype.toString = function() {
                this.__log("toString", arguments);
                return "[Weapon \"" + this.name + "\"]";
            };

            return Weapon;
        },
        true
    );


})();