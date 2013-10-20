var DnD, safeConsole;

(function(jQuery, console) {
    "use strict";
    
    function Listener() {
        this.$actorCards = {};
        this.creatures = jQuery.extend({}, loadParty(), loadMonsters());
        this.actors = [];
        this.current = null;
        this.messages = [];
        this.$imgDisplay = null;
        this.$img = null;
        this.$highlight = null;

        this.createCard = function(creature, i, total) {
            creature.createCard({ 
                $parent: this.$actorCards,
                isCurrent: creature.id === this.current,
                className: "gridItem",
                cardSize: jQuery(window).height() / total, // Math.floor(Math.sqrt((screen.availWidth * screen.availHeight) / total) - 100),
                showPcHp: true
            });
        };
        
        this.refresh = function(data) {
            var msg, i, j, actor;
            msg = "Received \"refresh\" message:\n\tactors: [ ";
            for (i = 0; i < data.actors.length; i++) {
                msg += (i > 0 ? ", " : "") + data.actors[ i ].name;
            }
            msg += " ]\n\torder: [ " + data.order.join(", ") + " ]\n\tcurrent: " + data.current;
            console.debug(msg);
            for (i = 0; i < this.actors.length; i++) {
                this.actors[ i ].card.destroy();
            }
            this.actors = [];
            this.current = data.current;
            for (i = 0; i < data.order.length; i++) {
                for (j = 0; j < data.actors.length; j++) {
                    if (data.actors[ j ].id === data.order[ i ]) {
                        actor = new Actor(this.creatures[ data.actors[ j ].type ], 0, data.actors[ j ]);
                        this.actors.push(actor);
                        if (this.$actorCards.length) {
                            this.createCard(actor, i, data.order.length);
                        }
                        break;
                    }
                }
            }
        };

        this.findActor = function(actor) {
            var i;
            if (typeof(actor) === "number") {
                actor = { id: actor };
            }
            for (i = 0; actor && i < this.actors.length; i++) {
                if (this.actors[ i ].id === actor.id) {
                    return this.actors[ i ];
                }
            }
            return null;
        };
        
        this.removeActor = function(data) {
            var actor = this.findActor(data.actor);
            if (actor) {
                this.actors.splice(this.actors.indexOf(actor), 1);
                actor.card.destroy();
            }
        };
        
        this.updateActor = function(data) {
            var actor, i;
            actor = this.findActor(data.id);
            actor.name = data.name;
            actor.hp.temp = data.hp.temp;
            actor.hp.current = data.hp.current;
            actor.effects = [];
            for (i = 0; data.effects && i < data.effects.length; i++) {
                actor.effects.push(new Effect(data.effects[ i ]));
            }
            actor.card.refresh();
        };
        
        this.updateActors = function(updates) {
            var i;
            for (i = 0; i < updates.length; i++) {
                this.updateActor(updates[ i ]);
            }
        };
        
        this.changeTurn = function(data) {
            var i, actor;
            console.debug("Received \"changeTurn\" message from " + this.current + " to " + data.current);
            actor = this.findActor(this.current);
            actor.card.makeCurrent(false);
            this.current = data.current;
            actor = this.findActor(this.current);
            actor.card.makeCurrent(true);
            //this.updateActors(data.actors);
        };
        
        this.attack = function(data) {
            var i, actor, damage, msg;
            msg = "Received \"attack\" message (\"" + data.attack + "\") for ";
            for (i = 0; i < this.actors.length; i++) {
                this.actors[ i ].card.event.hide();
            }
            for (i = 0; i < data.targets.length; i++) {
                actor = this.findActor(data.targets[ i ]);
                if (actor) {
                    actor.card.event.attack(data.attack);
                    msg += "\n\t" + actor.name;
                }
            }
            console.debug(msg);
        };
        
        this.takeDamage = function(data) {
            var i, actor, damage, msg;
            msg = "Received \"takeDamage\" message for ";
            for (i = 0; i < data.hits.length; i++) {
                actor = this.findActor(data.hits[ i ].target);
                if (actor) {
                    damage = data.hits[ i ].damage;
                    actor.card.event.damage(damage);
                    msg += "\n\t" + actor.name + " (" + damage.amount + " " + damage.type + ")";
                }
            }
            for (i = 0; i < data.misses.length; i++) {
                actor = this.findActor(data.misses[ i ].target);
                if (actor) {
                    actor.card.event.miss();
                    msg += "\n\t" + actor.name + " missed";
                }
            }
            console.debug(msg);
        };
        
        this.displayImage = function(data) {
            var $div, img, ratio, multiplier, useWidth;
            this.hideImage();
            if (!this.$imgDisplay || !this.$imgDisplay.length) {
                this.$imgDisplay = jQuery("#displayImage");
            }
//            this.$img.css("background-image", "url(\"" + data.src + "\")");
            
            img = new Image();
            img.onload = (function() {
                useWidth = true;
                ratio = img.width / img.height;
                if (ratio >= 1) {
                    multiplier = (window.innerWidth - 100) / img.width;
                    if (multiplier * img.height > window.innerHeight - 100) {
                        multiplier = (window.innerHeight - 100) / img.height;
                        useWidth = false;
                    }
                } 
                else {
                    multiplier = (window.innerHeight - 100) / img.height;
                    if (multiplier * img.width <= window.innerWidth - 100) {
                        useWidth = false;
                    }
                }
                if (useWidth) {
                    img.width = window.innerWidth - 100;
                } 
                else {
                    img.height = window.innerHeight - 100;
                }
                this.$imgDisplay.append(img);
                this.$imgDisplay.show();
            }).bind(this);
            img.src = data.src;
            this.$img = jQuery(img);
        };
        
        this.hideImage = function() {
            if (this.$img && this.$img.length) {
                this.$img.remove();
            }
            if (this.$imgDisplay && this.$imgDisplay.length) {
                this.$imgDisplay.hide();
            }
            if (this.$highlight && this.$highlight.length) {
                this.$highlight.hide();                
            }
        };
        
        this.highlightImage = function(data) {
            var offset;
            if (!this.$img || !this.$img.length || !data || !data.position) {
                return;
            }
            if (!this.$highlight) {
                this.$highlight = this.$imgDisplay.find(".reticle");
            }
            console.debug("Received \"highlightImage\" message { x: " + (100 * data.position.x) + "%, y: " + (100 * data.position.y) + "% }");
            offset = { left: this.$img[0].offsetLeft, top: this.$img[0].offsetTop };
            this.$highlight.css({ left: offset.left - 10 + (data.position.x * this.$img[0].width), top: offset.top - 10 + (data.position.y * this.$img[0].height) }).show();
        };
        
        this.receiveMessage = function(event) {
            this.messages.push(event);
        };
        
        this.handleMessage = function() {
            var message, data;
            message = this.messages.shift();
            if (!message) {
                return;
            }
            data = JSON.parse(message.data);
            if (typeof(this[ data.type ]) === "function") {
                this[ data.type ]( data );
            }
//            else {
//                this.refresh(data);
//            }
        };
        
        window.addEventListener("message", this.receiveMessage.bind(this), false);
        
        jQuery(document).ready((function() {
            var i;
            console.debug("DOM ready");
            window.opener.postMessage("ready", "*");

            this.$actorCards = jQuery("#actorCards");
            for (i = 0; i < this.actors.length; i++) {
                createCard(this.actors[ i ], i, this.actors.length);
            }
            
            setInterval(this.handleMessage.bind(this), 1000);
        }).bind(this));
    }
    
    new Listener();
})(window.jQuery, safeConsole());
