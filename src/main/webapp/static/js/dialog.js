var DnD;

(function(jQuery) {
	"use strict";
	
	if (!DnD) {
		DnD = {};
	}
	
	// CONSTRUCTOR
	
	/**
	 * @param id {String} The id of the modal element
	 * @param url {String} The URL of the dialog content
	 */
	function Dialog(id, url) {
		this.id = id;
		this.url = url;
	}
	
	Dialog.prototype = new EventDispatcher();
	
	// INITIALIZATION METHODS
	
	/**
	 * @param params {Object}
	 * @param params.$parent {jQuery selection} The element to append the dialog element(s) to
	 * 
	 */
	Dialog.prototype._init = function(params) {
		var $tmp;
		this.params = params;
		this.$parent = params.$parent;
		this.$dialog = null;
		this.$header = null;
		this.$body = null;
		this.$header = null;
		if (!this.buttons) {
			this.buttons = {};
		}

		$tmp = jQuery("<div/>");
		$tmp.load(this.url, null, this._onLoad.bind(this, $tmp));
	};

	Dialog.prototype._onLoad = function($tmp) {
		jQuery(document).ready((function() {
			if (!this.$parent) {
				this.$parent = jQuery("body");
			}
			$tmp.children().appendTo(this.$parent);
			
		    this.$dialog = jQuery("#" + this.id).on("show", (function() {
		    	this._center();
		    	jQuery(document).on({ keyUp: (function(event) {
		    		if (event.keyCode === 27) { // Esc
		    			this.$dialog.modal("hide");
		    		}
		    	}).bind(this) });
		    	this._onShow();
		    }).bind(this)).draggable({ handle: ".modal-header" }); // TODO: make draggable optional
		    if (!this.$dialog.length) {
		    	try { window.console.error("Failed to find dialog element for #" + this.id); } finally {}
		    }
		    this.$header = this.$dialog.find(".modal-header");
			this.$body = this.$dialog.find(".modal-body");
			this.$footer = this.$dialog.find(".modal-footer");
			this.$footer.find(".btn").each((function(index, element) {
				var $btn = jQuery(element);
				this.buttons[ $btn.id ] = $btn;
			}).bind(this));
			this._onReady();
			this.dispatchEvent("ready");
		}).bind(this));
	};
	
	Dialog.prototype._onReady = function() {
		// Overridden by subclass
	};
	
	// PUBLIC METHODS
	
	Dialog.prototype.show = function() {
        this.$dialog.modal("show");
    };
	
	// PRIVATE METHODS
	
	Dialog.prototype._center = function() {
    	this.$dialog.css({ left: Math.max(0, ((jQuery(window).width() - this.$dialog.outerWidth()) / 2) + jQuery(window).scrollLeft()) + "px" });
	};
	
	Dialog.prototype._onShow = function() {
		// Overridden by subclass
    };

    
	DnD.Dialog = Dialog;
})(window.jQuery);