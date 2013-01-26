(function() {
    var $body = {}, actors = [], current;
    
    jQuery(document).ready(function() {
        var i;
        info("DOM ready");
        window.opener.postMessage("ready", "*");

        $body = jQuery("body");
        for (i = 0; i < actors.length; i++) {
            createCard(actors[ i ], i, actors.length);
        }
    });
    
    function info(msg) {
        if (console && console.info) {
            console.info(msg);
        }
    }
    
    function createCard(creature, i, total) {
        creature.createCard({ 
            $parent: $body,
            isCurrent: i === current,
            className: "gridItem",
            cardSize: Math.floor(Math.sqrt((screen.availWidth * screen.availHeight) / total) - 100),
            showPcHp: true
        });
    }
    
    function refresh(data) {
        var msg, i, creature;
        msg = "Received \"refresh\" message:\n\tactors: [ ";
        for (i = 0; i < data.actors.length; i++) {
        	msg += (i > 0 ? ", " : "") + data.actors[ i ].name;
        }
        msg += " ]\n\torder: [ " + data.order.join(", ") + " ]\n\tcurrent: " + data.current;
        info(msg);
        actors = [];
        current = data.current;
        if ($body.length) {
            $body.children().remove();
        }
        for (i = 0; i < data.order.length; i++) {
            creature = new Creature(data.actors[ data.order[ i ] ]);
            actors.push(creature);
            if ($body.length) {
                createCard(creature, i, data.order.length);
            }
        }
    }
    
    function findActor(actor) {
    	var i;
        for (i = 0; actor && i < actors.length; i++) {
            if (actors[ i ].id === actor.id) {
            	return actors[ i ];
            }
        }
        return null;
    }
    
    function updateActors(updates) {
    	var i, j, update, actor;
        for (i = 0; i < updates.length; i++) {
        	update = updates[ i ];
        	actor = findActor(update);
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
    }
    
    function changeTurn(data) {
    	var i, actor;
    	info("Received \"changeTurn\" message from " + current + " to " + data.current);
    	actors[ current ].makeCurrent(false);
    	current = data.current;
    	actors[ current ].makeCurrent(true);
    	updateActors(data.actors);
    }
    
    function takeDamage(data) {
    	var i, hit, actor, damage, msg;
    	msg = "Received \"takeDamage\" message for ";
        for (i = 0; i < data.hits.length; i++) {
        	hit = data.hits[ i ];
            actor = findActor(hit.target);
            if (actor) {
            	damage = hit.damage;
                actor.addDamageIndicator(damage);
                msg += "\n\t" + actor.name + " (" + damage.amount + " " + damage.type + ")";
            }
        }
    	info(msg);
    }
    
    function receiveMessage(event) {
        var data;
        data = JSON.parse(event.data);
        switch (data.type) {
	        case "changeTurn": {
	        	changeTurn(data);
	        	break;
	        }
	        case "takeDamage": {
	        	takeDamage(data);
	        	break;
	        }
	        case "refresh":
        	default: {
        		refresh(data);
        		break;
        	}
        }
    }
    
    window.addEventListener("message", receiveMessage, false);
})();
