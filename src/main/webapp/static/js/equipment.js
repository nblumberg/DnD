/**
 * Created by nblumberg on 10/12/14.
 */

(function () {
    "use strict";

    DnD.define(
        "Implement",
        [ "out", "Damage", "Effect", "Attack", "jQuery" ],
        function(out, Damage, Effect, Attack, jQuery) {
            function Implement(params) {
                this._init(params);
            }

            Implement.prototype._init = function(params) {
                var i;
                this.__log = out.logFn.bind(this, "Implement");
                this.__log("constructor", arguments);
                this.__log("_init", arguments);
                params = params || {};
                this.name = params.name;
                this.enhancement = params.enhancement;
                this.crit = new Attack(jQuery.extend({ toHit: "automatic", defense: "ac" }, params.crit));
                // TODO item miss damage
                this.isMelee = false;
                this.type = params.type;
                this.effects = [];
                for (i = 0; params.effects && i < params.effects.length; i++) {
                    this.effects.push(new Effect(params.effects[ i ]));
                }
                this.keywords = [];
                for (i = 0; params.keywords && i < params.keywords.length; i++) {
                    this.keywords.push(params.keywords[ i ]);
                }
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
                this.category = params.category;
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