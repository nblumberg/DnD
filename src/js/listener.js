(function() {
    var $body = {}, actors = [], current;
    
    jQuery(document).ready(function() {
        var i;
        if (console && console.info) {
            console.info("DOM ready");
        }
        window.opener.postMessage("ready", "*");

        $body = jQuery("body");
        for (i = 0; i < actors.length; i++) {
            createCard(actors[ i ], i);
        }
    });
    
    function createCard(creature, i) {
        creature.createCard({ 
            $parent: $body,
            isCurrent: i === current,
            className: "gridItem"
        });
    }
    
    function receiveMessage(event) {
        var i, data, creature;
        if (console && console.info) {
            console.info("receiveMessage():\n" + event.data);
        }
        data = JSON.parse(event.data);
        actors = [];
        current = data.current;
        if ($body.length) {
            $body.children().remove();
        }
        for (i = 0; i < data.order.length; i++) {
            creature = new Creature(data.actors[ data.order[ i ] ]);
            actors.push(creature);
            if ($body.length) {
                createCard(creature, i);
            }
        }
    }
    
    window.addEventListener("message", receiveMessage, false);
})();
