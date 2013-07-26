var DnD;

(function() {
    "use strict";

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
        var editor, i;

        ActorCard.cards.push(this);
        
        this.params = params || {};
        
        this.actor = params.actor;
        
        this.portraitHeight = 0;
        this.portraitWidth = 0;
        this.isLandscape = false;
        this.img = new Image();
        this.img.onload = (function() {
            this.portraitHeight = this.img.naturalHeight;
            this.portraitWidth = this.img.naturalWidth;
            this.isLandscape = this.portraitWidth >= this.portraitHeight;
        }).bind(this);
        this.img.src = this.actor.image;
        
        this.subPanel = {};
        this.cardSize = params.cardSize || ActorCard.CARD_SIZE;
        this.$parent = params.$parent ? jQuery(params.$parent) : jQuery("body");
        
        this.$panel = jQuery("<div/>").attr("id", this.actor.name.replace(/\s/g, "_") + "_panel").data("actor", this.actor).addClass("creaturePanel centered verticallyCentered bordered " + params.className).css("background-image", "url(" + this.actor.image + ")").appendTo(this.$parent);
        this.$panel.load("/html/partials/actorCard.html", null, this._init.bind(this));
    }
    
    // Static members
    
    ActorCard.cards = [];
    ActorCard.CARD_SIZE = 240;
    ActorCard.MAX_COLUMNS = 6;
    ActorCard.resizeAll = function(event) {
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
    jQuery(window).on({ resize: ActorCard.resizeAll });
    
    // Public methods    
    
    /**
     * Display an ActorCard as being the current turn (or not)
     */
    ActorCard.prototype.makeCurrent = function(isCurrent) {
        if (!this.$panel) {
            return;
        }
        this.$panel[ isCurrent ? "addClass" : "removeClass" ]("current");
        if (this.event) {
            this.event.hide();
        }
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

    ActorCard.prototype.refresh = function(isCurrent) {
        this.makeBloodied(this.actor.isBloodied());
        this._renderName();
        this.updateConditions();
    };

    /**
     * Display all of an Actor's Effects on their ActorCard
     */
    ActorCard.prototype.updateConditions = function() {
        var i, effect, j, name, total;
        // Clear
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

    // Private methods
    
    ActorCard.prototype._init = function(responseText, textStatus, jqXHR) {
        this.event = new ActorCard.Event({ actor: this.actor, card: this, $parent: this.$panel });
        
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
        var style, size;
        if (this.params.staticSize) {
            return;
        }
        style = { height: height + "px", width: width + "px" };
        this.$panel.css(style);
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
//        editor = new Editor({ $parent: this.$panel, tagName: "div", _className: "f2", html: this.name, onchange: (function(v) {
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
        var i, $div, image, clickHandler, condition, $amount;
        if (effect.children && effect.children.length) {
            for (i = 0; i < effect.children.length; i++) {
                this._renderCondition(effect.children[ i ], total);
            }
            return;
        }
        $div = jQuery("<div/>").addClass("condition");
        clickHandler = (function($condition, effect, event) {
            if (event.metaKey) {
                $condition.off({ click: clickHandler });
                $condition.remove();
                effect.remove();
                this.actor.dispatchEvent({ type: "change", conditionRemoved: effect });
            }
        }).bind(this, $div, effect);
        $div.on({ click: clickHandler });
        image = new Image();
        if (total <= 4) {
            image.height = this.cardSize / 3;
        }
        else if (total <= 9) {
            image.height = this.cardSize / 4;
        }
        else {
            image.height = this.cardSize / 5.4;
        }
        image.className = "icon";
        condition = Effect.CONDITIONS[ effect.name.toLowerCase() ];
        if (effect.name.toLowerCase() === "ongoing damage") {
            condition = condition[ effect.type ? effect.type.toLowerCase() : "untyped" ];
            image.title = (condition.type ? "Ongoing " + condition.type + " damage" : "Ongoing damage") + (effect.attacker ? " (" + effect.attacker + ")" : "");
        }
        else {
            image.title = effect.name + (effect.attacker ? " (" + effect.attacker + ")" : "");
        }
        if (condition && condition.image) {
            image.src = condition.image;
        }
        else {
            image.src = "../images/symbols/unknown.png";
        }
        $div.append(image);
        if (effect.amount) {
            $amount = jQuery("<div/>").addClass("amount").css({ "color": condition && condition.color ? condition.color : "red" }).appendTo($div);
            jQuery("<span/>").html(effect.amount).appendTo($amount);
        }
        this.subPanel.$effects.append($div);
    };

    /**
     * @param params Object
     * @param params.actor Actor
     * @param params.card ActorCard
     * @param params.$parent jQuery(element) The parent element
     * @param params.damage {Damage | Array}
     * @param params.isMiss {Boolean}
     */
    ActorCard.Event = function(params) {
        var height, i, $type, dmg, $image, condition, $amount;
        if (!params) {
            return;
        }
        this.actor = params.actor;
        this.card = params.card;
        this.$parent = params.$parent;
        // Create HTML
        this.$event = this.$parent.find(".event");
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
        var height, i, dmg, condition;
        this.$description.html("");
        this._show("hit", ActorCard.Event.TIMEOUT);
        damage = Object.constructor !== Array ? [ damage ] : damage;
        height = Math.floor(this.$event.height() / 2) + "px"; // Math.floor(100 / damage.length);
        for (i = 0; i < damage.length; i++) {
            dmg = damage[ i ];
            if (dmg.type) {
                if (Effect.CONDITIONS[ "ongoing damage" ][ dmg.type ] && Effect.CONDITIONS[ "ongoing damage" ][ dmg.type ].image) {
                    condition = Effect.CONDITIONS[ "ongoing damage" ][ dmg.type ];
                }
            }
            if (!condition) {
                condition = Effect.CONDITIONS[ "ongoing damage" ].untyped;
            }
            this._renderDamage(height, condition.image, dmg.amount, condition.color);
        }
    };

    /**
     * TODO: replace with static HTML partial load
     */
    ActorCard.Event.prototype._renderDamage = function(height, imageSrc, amount, color) {
        var $type, dmg, $image, condition, $text;
        $type = jQuery("<span/>").addClass("type").appendTo(this.$types).css({ height: height });
        $image = jQuery(new Image()).css({ height: height }).addClass("damage").attr("src", imageSrc).appendTo($type);
        if (typeof(amount) !== "undefined" && amount !== null) {
            $text = jQuery("<span/>").addClass("amount").css({ "font-size": Math.floor($image.height() / 2) + "px", "line-height": $image.height() + "px", "color": color ? color : "red" }).html(amount).appendTo($type);
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

    
    if (!DnD) {
        DnD = {};
    }
    if (!DnD.Display) {
        DnD.Display = {};
    }
    DnD.Display.ActorCard = ActorCard;
    DnD.Display.ActorEvent = ActorCard.Event;
})();
