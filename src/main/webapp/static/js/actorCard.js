(function() {
    "use strict";

    DnD.define(
        "Display.ActorCard",
        [ "window", "jQuery", "Actor" ],
        function(w, jQuery, Actor) {
            /**
             * @param params Object
             * @param params.actor Actor
             * @param params.$parent {jQuery(element)} The parent element
             * @param params.isCurrent {Boolean} Indicates if it is this Creature's turn in the initiative order
             * @param params.className {String} Class(es) to apply to the top-level element
             * @param params.cardSize {Number} The height of the card
             * @param params.showPcHp {Boolean} Display PC HP
             */
            function ActorCard(params) {
                ActorCard.cards.push(this);

                this.params = params || {};

                this.actor = params.actor;

                this.portraitHeight = 0;
                this.portraitWidth = 0;
                this.isLandscape = false;
                this.img = new Image();
                this.img.onload = function() {
                    this.portraitHeight = this.img.naturalHeight;
                    this.portraitWidth = this.img.naturalWidth;
                    this.isLandscape = this.portraitWidth >= this.portraitHeight;
                }.bind(this);
                this.img.src = this.actor.image;

                this.subPanel = {};
                this.cardSize = params.cardSize || ActorCard.CARD_SIZE;
                this.conditions = [];
                this.$parent = params.$parent ? jQuery(params.$parent) : jQuery("body");

                this.$panel = jQuery("<div/>").attr("id", this.actor.name.replace(/\s/g, "_") + "_panel").data("actor", this.actor).addClass("creaturePanel centered verticallyCentered bordered " + params.className).css("background-image", "url(" + this.actor.image + ")").appendTo(this.$parent);
                this.$panel.load("/html/partials/actorCard.html", null, this._init.bind(this));
            }


            // STATIC MEMBERS

            ActorCard.cards = [];
            ActorCard.CARD_SIZE = 240;
            ActorCard.MAX_COLUMNS = 6;
            ActorCard.resizeAll = function() {
                var cards, rows, columns, height, width, i;
                cards = ActorCard.cards.length;
                rows = Math.ceil(cards / ActorCard.MAX_COLUMNS);
                height = ((window.innerHeight - 50) / rows);
                columns = Math.min(ActorCard.cards.length, ActorCard.MAX_COLUMNS);
                width = ((window.innerWidth - 100) / columns);
                for (i = 0; i < ActorCard.cards.length; i++) {
                    ActorCard.cards[ i ]._resize(height, width);
                }
            };
            jQuery(w).on({ resize: ActorCard.resizeAll });


            // PUBLIC METHODS

            /**
             * Display an ActorCard as being the current turn (or not)
             */
            ActorCard.prototype.makeCurrent = function(isCurrent) {
                if (this.event) {
                    this.event.hide();
                }
                if (!this.$panel) {
                    return;
                }
                if (isCurrent && !this.isCurrent() || !isCurrent && this.isCurrent()) {
                    this.$panel[ isCurrent ? "addClass" : "removeClass" ]("current");
                    this.timer[ isCurrent ? "start" : "stop" ]();
                }
            };

            ActorCard.prototype.isCurrent = function() {
                return this.$panel && this.$panel.hasClass("current");
            };

            /**
             * Display an ActorCard as being bloodied (or not)
             */
            ActorCard.prototype.makeBloodied = function(isBloodied) {
                if (!this.$panel) {
                    return;
                }
                this.$panel[ isBloodied ? "addClass" : "removeClass" ]("bloodied");
            };

            /**
             * Destroys this ActorCard
             */
            ActorCard.prototype.destroy = function() {
                this.$panel.remove();
                ActorCard.cards.splice(ActorCard.cards.indexOf(this), 1);
                ActorCard.resizeAll();
            };

            ActorCard.prototype.refresh = function() {
                this.makeBloodied(this.actor.isBloodied());
                this._renderName();
                this.updateConditions();
            };

            /**
             * Display all of an Actor's Effects on their ActorCard
             */
            ActorCard.prototype.updateConditions = function() {
                var i, effect, total;
                // Clear
                this.conditions = [];
                this.subPanel.$effects.children().remove();
                // Count conditions (including children of "multiple" effects) for sizing
                total = 0;
                for (i = 0; this.actor.effects && i < this.actor.effects.length; i++) {
                    effect = this.actor.effects[ i ];
                    if (typeof(effect) === "string") {
                        effect = { name: effect };
                    }
                    total += effect.children && effect.children.length ? effect.children.length : 1;
                }
                // Render each condition
                for (i = 0; this.actor.effects && i < this.actor.effects.length; i++) {
                    this._renderCondition(this.actor.effects[ i ], total);
                }
            };

            // TODO: why is this.event coming up null?
            ActorCard.prototype.clearEvent = function() {
                if (!this.event) {
                    this.event = new ActorCard.Event({ actor: this.actor, card: this, $parent: this.$panel });
                }
                this.event.hide();
            };

            ActorCard.prototype.attack = function(name) {
                if (!this.event) {
                    this.event = new ActorCard.Event({ actor: this.actor, card: this, $parent: this.$panel });
                }
                this.event.attack(name);
            };

            ActorCard.prototype.miss = function() {
                if (!this.event) {
                    this.event = new ActorCard.Event({ actor: this.actor, card: this, $parent: this.$panel });
                }
                this.event.miss();
            };

            ActorCard.prototype.damage = function(damage) {
                if (!this.event) {
                    this.event = new ActorCard.Event({ actor: this.actor, card: this, $parent: this.$panel });
                }
                this.event.damage(damage);
            };

            ActorCard.prototype.pause = function() {
                this.timer.pause();
            };

            ActorCard.prototype.restart = function() {
                this.timer.restart();
            };


            // NON-PUBLIC METHODS

            ActorCard.prototype._init = function() { // responseText, textStatus, jqXHR
                this.event = new ActorCard.Event({ actor: this.actor, card: this, $parent: this.$panel });

                this.subPanel.$timer = this.$panel.find(".timer .content");
                this.timer = new ActorCard.Timer(this.subPanel.$timer);

                this.makeCurrent(this.params.isCurrent);
                if (this.actor.isBloodied()) {
                    this.$panel.addClass("bloodied");
                }

                this.subPanel.$images = this.$panel.find(".images");

                ActorCard.resizeAll();

                this.showPcHp = this.params.showPcHp;
                this.subPanel.$name = this.$panel.find(".label .name");
                this.subPanel.$hp = this.$panel.find(".label .hp");
                this._renderName();

                this.subPanel.$effects = this.$panel.find(".effects");
                this.updateConditions();
            };

            ActorCard.prototype._resize = function(height, width) {
                var style;
                if (this.params.staticSize) {
                    return;
                }
                style = { height: height + "px", width: width + "px" };
                this.$panel.css(style);
                this._resizeConditions();
            };

            ActorCard.prototype._renderName = function() {
                this.subPanel.$name.html(this.actor.name);
                if (this.showPcHp && this.actor.isPC) {
                    this.$panel.addClass("pcHp");
                    this.subPanel.$hp.html(this.actor.hp.current + (this.actor.hp.temp ? " (" + (this.actor.hp.temp + this.actor.hp.current) + ")" : "") + " / " + this.actor.hp.total);
                }
                else {
                    this.subPanel.$hp.html("");
                }
                //        editor = new DnD.Display.Editor({ $parent: this.$panel, tagName: "div", _className: "f2", html: this.name, onchange: (function(v) {
                //            this.name = v;
                //            this.dispatchEvent("change");
                //        }).bind(this) });
            };

            /**
             * Displays an Effect on an ActorCard
             *
             * @param effect Effect The Effect to render
             * @param total Number The total number of conditions (including child effects), used for sizing
             */
            ActorCard.prototype._renderCondition = function(effect, total) {
                var i;
                if (effect.children && effect.children.length) {
                    for (i = 0; i < effect.children.length; i++) {
                        this._renderCondition(effect.children[ i ], total);
                    }
                    return;
                }
                this.conditions.push(new ActorCard.Condition({
                    card: this,
                    actor: this.actor,
                    effect: effect,
                    $parent: this.subPanel.$effects
                }));
                this._resizeConditions();
            };

            ActorCard.prototype._resizeConditions = function() {
                var count, rows, columns, height, width, i;
                count = this.conditions.length;
                rows = Math.max(3, Math.ceil(count / ActorCard.Condition.MAX_COLUMNS));
                height = ((this.$panel.height() - 5) / rows);
                columns = Math.max(3, Math.min(count, ActorCard.Condition.MAX_COLUMNS));
                width = ((this.$panel.width() - (4 * ActorCard.Condition.MAX_COLUMNS)) / columns);
                for (i = 0; i < count; i++) {
                    this.conditions[ i ]._resize(height, width, count);
                }
            };


            // EXTEND ACTOR PROTOTYPE

            /**
             * @param params Object
             * @param params.$parent {jQuery(element)} The parent element
             * @param params.isCurrent {Boolean} Indicates if it is this Creature's turn in the initiative order
             * @param params.className {String} Class(es) to apply to the top-level element
             * @param params.cardSize {Number} The height of the card
             * @param params.showPcHp {Boolean} Display PC HP
             */
            Actor.prototype.createCard = function(params) {
                this.__log("createCard", arguments);
                params = params || {};
                params.actor = this;
                this.card = new ActorCard(params);
                return this.card;
            };



            return ActorCard;
        },
        true
    );


    DnD.define(
        "Display.ActorCard.Condition",
        [ "Display.ActorCard", "jQuery" ],
        function(ActorCard, jQuery) {
            /**
             * Displays an Effect on an ActorCard
             *
             * @param params Object
             * @param params.card ActorCard The parent ActorCard
             * @param params.actor Actor The Actor that owns the ActorCard
             * @param params.effect Effect The Effect to render
             * @param params.$parent jQuery The parent element
             */
            ActorCard.Condition = function (params) {
                this.card = params.card;
                this.actor = params.actor;
                this.effect = params.effect;
                this.$parent = params.$parent;
                this._render();
            };

            ActorCard.Condition.MAX_COLUMNS = 4;

            ActorCard.Condition.prototype._render = function () {
                var condition, title, amount;
                this.$container = jQuery("<div/>").addClass("condition").on({ click: this._clickHandler.bind(this) });
                condition = DnD.Effect.CONDITIONS[ this.effect.name.toLowerCase() ];
                amount = this.effect.amount;
                if (this.effect.name.toLowerCase() === "ongoing damage") {
                    condition = condition[ this.effect.type ? this.effect.type.toLowerCase() : "untyped" ];
                    title = (condition && condition.type ? "Ongoing " + condition.type + " damage" : "Ongoing damage") + (this.effect.attacker ? " (" + this.effect.attacker + ")" : "");
                }
                else if (this.effect.name.toLowerCase() === "resistance") {
                    condition = condition[ this.effect.type ? this.effect.type.toLowerCase() : "untyped" ];
                    title = (condition && condition.type ? condition.type + " damage resistance" : "Damage resistance") + (this.effect.attacker ? " (" + this.effect.attacker + ")" : "");
                    amount *= -1;
                }
                else if (this.effect.name.toLowerCase() === "penalty") {
                    condition = condition[ this.effect.type ? this.effect.type.toLowerCase() : "untyped" ];
                    title = (condition && condition.type ? "Penalty to " + condition.type : "Unknown penalty") + (this.effect.attacker ? " (" + this.effect.attacker + ")" : "");
                }
                else if (this.effect.name.toLowerCase() === "bonus") {
                    condition = condition[ this.effect.type ? this.effect.type.toLowerCase() : "untyped" ];
                    title = (condition && condition.type ? "Bonus to " + condition.type : "Unknown bonus") + (this.effect.attacker ? " (" + this.effect.attacker + ")" : "");
                }
                else {
                    title = this.effect.name + (this.effect.attacker ? " (" + this.effect.attacker + ")" : "");
                }
                this.$container.attr("title", title).css({
                    "background-image": "url(\"" + (condition && condition.image ? condition.image : "../images/symbols/unknown.png") + "\")"
                });
                if (this.effect.amount) {
                    this.$amount = jQuery("<div/>").addClass("amount").css({ "color": condition && condition.color ? condition.color : "red" }).appendTo(this.$container);
                    jQuery("<span/>").html(amount).appendTo(this.$amount);
                }
                this.$parent.append(this.$container);
            };

            ActorCard.Condition.prototype._clickHandler = function (event) {
                if (event.metaKey) {
                    this.$container.off({ click: this._clickHandler });
                    this.$container.remove();
                    this.effect.remove();
                    this.actor.dispatchEvent({ type: "change", conditionRemoved: this.effect });
                }
            };

            ActorCard.Condition.prototype._resize = function (height, width, count) {
                this.$container.css({ height: height + "px", width: width + "px" });
                this.$container.attr("data-effects-count", count);
            };

            return ActorCard.Condition;
        },
        true
    );


    DnD.define(
        "Display.ActorCard.Event",
        [ "Display.ActorCard", "out", "jQuery" ],
        function(ActorCard, out, jQuery) {
            /**
             * @param params Object
             * @param params.actor Actor
             * @param params.card ActorCard
             * @param params.$parent jQuery(element) The parent element
             * @param params.damage {Damage | Array}
             * @param params.isMiss {Boolean}
             */
            ActorCard.Event = function(params) {
                if (!params) {
                    return;
                }
                this.actor = params.actor;
                this.card = params.card;
                this.$parent = params.$parent;
                // Create HTML
                this.$event = this.$parent.find(".event");
                if (!this.$event || !this.$event.length) {
                    out.console.error("No .event element found");
                }
                this.hide();
                this.$description = this.$parent.find(".description");
                this.$types = this.$parent.find(".types");
            };

            ActorCard.Event.prototype.attack = function(name) {
                this.$description.html(name);
                this._show("attack");
            };

            ActorCard.Event.TIMEOUT = 30000;

            /**
             * @param params.damage {Damage | Array}
             */
            ActorCard.Event.prototype.damage = function(damage) {
                var height, i, dmg, amount, j, condition = null;
                this.$description.html("");
                this._show("hit", ActorCard.Event.TIMEOUT);
                damage = Object.constructor !== Array ? [ damage ] : damage;
                height = Math.floor(this.$event.height() / 2) + "px"; // Math.floor(100 / damage.length);
                for (i = 0; i < damage.length; i++) {
                    dmg = damage[ i ];
                    if (dmg.type) {
                        if (DnD.Effect.CONDITIONS[ "ongoing damage" ][ dmg.type ] && DnD.Effect.CONDITIONS[ "ongoing damage" ][ dmg.type ].image) {
                            condition = DnD.Effect.CONDITIONS[ "ongoing damage" ][ dmg.type ];
                        }
                    }
                    if (!condition) {
                        condition = DnD.Effect.CONDITIONS[ "ongoing damage" ].untyped;
                    }
                    // TODO: display multiple damage types separately
                    amount = 0;
                    if (dmg.length) {
                        for (j = 0; j < dmg.length; j++) {
                            amount += dmg[ j ].amount;
                        }
                    }
                    else {
                        amount = dmg.amount;
                    }
                    this._renderDamage(height, condition.image, amount, condition.color);
                }
            };

            /**
             * TODO: replace with static HTML partial load
             */
            ActorCard.Event.prototype._renderDamage = function(height, imageSrc, amount, color) {
                var $type, $image;
                $type = jQuery("<span/>").addClass("type").appendTo(this.$types).css({ height: height });
                $image = jQuery(new Image()).css({ height: height }).addClass("damage").attr("src", imageSrc).appendTo($type);
                if (typeof(amount) !== "undefined" && amount !== null) {
                    jQuery("<span/>").addClass("amount").css({ "font-size": Math.floor($image.height() / 2) + "px", "line-height": $image.height() + "px", "color": color ? color : "red" }).html(amount).appendTo($type);
                }
            };

            ActorCard.Event.prototype.miss = function() {
                this.$description.html("Miss");
                this._show("miss", ActorCard.Event.TIMEOUT);
            };

            ActorCard.Event.prototype.hide = function() {
                this.$event.hide();
            };

            ActorCard.Event.prototype._show = function(className, duration) {
                // Clear any existing damage indicator content
                this.$types.find(".type").remove();
                this.$event.removeClass("attack hit miss").addClass(className);
                this.$event.show();
                if (duration) {
                    setTimeout(this.hide.bind(this), duration);
                }
            };

            return ActorCard.Event;
            return ActorCard.Condition;
        },
        true
    );


    DnD.define(
        "Display.ActorCard.Timer",
        [ "Display.ActorCard", "window" ],
        function(ActorCard, w) {
            ActorCard.Timer = function ($target) {
                this.$target = $target;
                this.time = 0;
                this.interval = 0;
            };

            ActorCard.Timer.INTERVAL = 1000;

            ActorCard.Timer.prototype.start = function () {
                this.time = 0;
                this.restart();
            };

            ActorCard.Timer.prototype.restart = function () {
                this.interval = w.setInterval(this._tick.bind(this), ActorCard.Timer.INTERVAL);
            };

            ActorCard.Timer.prototype.pause = function () {
                w.clearInterval(this.interval);
                this.interval = null;
            };

            ActorCard.Timer.prototype._tick = function () {
                var t, h, m, s, str;
                this.time += ActorCard.Timer.INTERVAL;
                t = this.time;
                h = Math.floor(t / 3600000);
                t -= h * 3600000;
                m = Math.floor(t / 60000);
                t -= m * 60000;
                m = (m > 0 || h) && m < 10 ? "0" + m : m;
                s = Math.floor(t / 1000);
                s = s < 10 ? "0" + s : s;
                str = (h ? h + ":" : "") + m + ":" + s;
                this.$target.html(str);
            };

            ActorCard.Timer.prototype.stop = function () {
                w.clearInterval(this.interval);
                this.$target.html("");
            };

            return ActorCard.Timer;
        },
        true
    );

})();
