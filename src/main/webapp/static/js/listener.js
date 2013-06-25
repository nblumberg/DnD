(function() {
	function Listener() {
		this.$body = {};
		this.actors = [];
		this.current;
		this.$img;
		this.$highlight;
	    
		this.info = function(msg) {
	        if (console && console.info) {
	            console.info(msg);
	        }
		};
		
		this.createCard = function(creature, i, total) {
	        creature.createCard({ 
	            $parent: this.$body,
	            isCurrent: i === this.current,
	            className: "gridItem",
	            cardSize: Math.floor(Math.sqrt((screen.availWidth * screen.availHeight) / total) - 100),
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
	        this.info(msg);
	        this.actors = [];
	        this.current = data.current;
	        if (this.$body.length) {
	        	this.$body.children().remove();
	        }
	        for (i = 0; i < data.order.length; i++) {
	            for (j = 0; j < data.actors.length; j++) {
	                if (data.actors[ j ].id === data.order[ i ]) {
	                    actor = new Actor(data.actors[ j ]);
	                    this.actors.push(actor);
	                    if (this.$body.length) {
	                        this.createCard(actor, i, data.order.length);
	                    }
	                    break;
	                }
	            }
	        }
	    };

	    this.findActor = function(actor) {
	    	var i;
	        for (i = 0; actor && i < this.actors.length; i++) {
	            if (this.actors[ i ].id === actor.id) {
	            	return this.actors[ i ];
	            }
	        }
	        return null;
	    };
	    
	    this.updateActors = function(updates) {
	    	var i, j, update, actor;
	        for (i = 0; i < updates.length; i++) {
	        	update = updates[ i ];
	        	actor = this.findActor(update);
	        	if (actor) {
	        		actor.hp.temp = update.hp.temp;
	        		actor.hp.current = update.hp.current;
	        		actor.effects = [];
	        	    for (j = 0; update.effects && j < update.effects.length; j++) {
	        	        actor.effects.push(new Effect(update.effects[ j ]));
	        	    }
	        	    actor.refreshCard();
	        	}
	        }
	    };
	    
	    this.changeTurn = function(data) {
	    	var i, actor;
	    	this.info("Received \"changeTurn\" message from " + this.current + " to " + data.current);
	    	this.actors[ this.current ].makeCurrent(false);
	    	this.current = data.current;
	    	this.actors[ this.current ].makeCurrent(true);
	    	this.updateActors(data.actors);
	    };
	    
	    this.takeDamage = function(data) {
	    	var i, actor, damage, msg;
	    	msg = "Received \"takeDamage\" message for ";
	        for (i = 0; i < data.hits.length; i++) {
	            actor = this.findActor(data.hits[ i ].target);
	            if (actor) {
	            	damage = data.hits[ i ].damage;
	            	actor.card.damageIndicator.damage(damage);
	                msg += "\n\t" + actor.name + " (" + damage.amount + " " + damage.type + ")";
	            }
	        }
	        for (i = 0; i < data.misses.length; i++) {
	            actor = this.findActor(data.misses[ i ].target);
	            if (actor) {
	            	actor.card.damageIndicator.miss();
	                msg += "\n\t" + actor.name + " missed";
	            }
	        }
	    	this.info(msg);
	    };
	    
	    this.displayImage = function(data) {
	    	var $div, img, ratio, multiplier, useWidth;
	    	this.hideImage();
	    	$div = jQuery("<div/>").appendTo(this.$body);
	    	img = new Image();
	    	img.src = data.src;
	    	this.$img = jQuery(img).appendTo($div);
	    	useWidth = true;
	    	ratio = img.width / img.height;
	    	if (ratio >= 1) {
	    		multiplier = (window.innerWidth - 100) / img.width;
	    		if (multiplier * img.height > window.innerHeight - 100) {
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
	    	$div.dialog({ 
	            autoOpen: false, 
	            position: [ "center", 50 ], 
	            modal: true, 
	            title: "Image",
	            width: "auto"
	        });
	        $div.dialog("open");
	    };
	    
	    this.hideImage = function() {
	    	if (this.$img && this.$img.length) {
	        	try {
	        		this.$img.dialog("destroy").parent().remove();
	        	}
	        	catch (e) {
	        	}
	        	finally {
	        		this.$img.parent().remove();
	        	}
	    	}
	    };
	    
	    this.highlightImage = function(data) {
	    	var offset;
	    	if (!this.$img || !this.$img.length || !data || !data.position) {
	    		return;
	    	}
	    	if (this.$highlight) {
	    		this.$highlight.remove();
	    	}
	        this.info("Received \"highlightImage\" message { x: " + (100 * data.position.x) + "%, y: " + (100 * data.position.y) + "% }");
	    	offset = { left: this.$img[0].offsetLeft, top: this.$img[0].offsetTop };
	    	this.$highlight = jQuery("<img/>").addClass("reticle").attr("height", "20").attr("width", "20").attr("src", "images/symbols/reticle.png").css({ left: offset.left - 10 + (data.position.x * this.$img[0].width), position: "absolute", top: offset.top - 10 + (data.position.y * this.$img[0].height) }).appendTo(this.$img.parent());
	    };
	    
	    this.receiveMessage = function(event) {
	        var data;
	        data = JSON.parse(event.data);
	        if (jQuery.isFunction(this[ data.type ])) {
	        	this[ data.type ]( data );
	        }
	        else {
	        	this.refresh(data);
	        }
	    };
	    
	    window.addEventListener("message", this.receiveMessage.bind(this), false);
	    
	    jQuery(document).ready((function() {
	        var i;
	        this.info("DOM ready");
	        window.opener.postMessage("ready", "*");

	        this.$body = jQuery("body");
	        for (i = 0; i < this.actors.length; i++) {
	            createCard(this.actors[ i ], i, this.actors.length);
	        }
	    }).bind(this));
	}
    
    new Listener();
})();
