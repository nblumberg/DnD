var EventListener = function(bus) {
    this._bus = bus;
    this._listeners = {};
};

EventListener.prototype = new Serializable();

EventListener.prototype.addEventListener = function(eventType, callback) {
    if (!this._listeners.hasOwnProperty(eventType)) {
        this._listeners[ eventType ] = [];
    }
    this._listeners[ eventType ].push(callback); 
};

EventListener.prototype.receiveEvent = function(event) {
    var i, callbacks, receivedEvent;
    event.receivedBy.push(this);
    receivedEvent = false;
    if (event && this._listeners.hasOwnProperty(event.type)) {
    	callbacks = this._listeners[ event.type ];
    	for (i = 0; !event.stopPropagation && i < callbacks.length; i++) {
    		callbacks[ i ](event);
    		receivedEvent = true;
    	}
    }
    return receivedEvent;
};

EventListener.prototype.removeEventListener = function(eventType, callback) {
    var i;
    if (this._listeners.hasOwnProperty(eventType)) {
        i = this._listeners[ eventType ].indexOf(callback);
        if (i !== -1) {
            this._listeners[ eventType ].splice(i, 1);
            return true;
        }
    }
    return false;
};

var EventDispatcher = function() {
    this._listeners = {};
};

EventDispatcher.id = 1;

EventDispatcher.prototype = new EventListener();

EventDispatcher.prototype.dispatchEvent = function(event) {
	if (typeof(event) === "string") {
		event = { type: event };
	}
	event.id = event.type + EventDispatcher.id++;
	event.target = this;
	event.receivedBy = [];
//	if (this._doDispatch) {
//		this._doDispatch(event);
//	}
	this.receiveEvent(event);
};

var EventBus = function() {
	this._routes = [];
};

EventBus.prototype = new EventDispatcher();

EventBus.prototype.addRoute = function(route) {
	this._routes.push(route);
	route._doDispatch = this.dispatch.bind(this);
};

EventBus.prototype.dispatch = function(event) {
	var i = 0;
	if (!event.hasOwnProperty("receivedBy")) {
		event.receivedBy = [];
	}
	for (i = 0; i < this._routes.length; i++) {
		if (event.stopPropagation) {
			break;
		}
		if (event.receivedBy.indexOf(this._routes[ i ]) !== -1) {
			continue;
		}
		this._routes[ i ].receiveEvent(event);
	}
};

