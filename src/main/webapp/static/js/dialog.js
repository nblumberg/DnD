(function(jQuery) {
	"use strict";
	
	/**
	 * @param id {String} The id of the modal element
	 * 
	 */
	function Dialog(id) {
		this.id = id;
	}
	
	/**
	 * @param params {Object}
	 * 
	 */
	Dialog.prototype._init = function(params) {
		this.params = params;
		this.$dialog = null;
		this.$header = null;
		this.$body = null;
		this.$header = null;
		this.buttons = {};
		
		jQuery(document).ready((function() {
			var _self = this;
		    this.$dialog = jQuery("#" + this.id).on("show", (function() {
		    	this._center();
		    	jQuery(document).on({ keyUp: (function(event) {
		    		if (event.keyCode === 27) { // Esc
		    			this.$dialog.modal("hide");
		    		}
		    	}).bind(this) });
		    	this._onShow();
		    }).bind(this)).draggable({ handle: ".modal-header" });
		    this.$header = this.$dialog.find(".modal-header");
			this.$body = this.$dialog.find(".modal-body");
			this.$footer = this.$dialog.find(".modal-footer");
			this.$footer.find(".btn").each(function() {
				var $btn = jQuery(this);
				_self.buttons[ $btn.id ] = $btn;
			});
			this._onReady();
		}).bind(this));
	};

	Dialog.prototype._onReady = function() {
		// Overridden by subclass
	};
	
	Dialog.prototype._center = function() {
    	this.$dialog.css({ left: Math.max(0, ((jQuery(window).width() - this.$dialog.outerWidth()) / 2) + jQuery(window).scrollLeft()) + "px" });
	};
	
	Dialog.prototype._onShow = function() {
		// Overridden by subclass
    };
	
	Dialog.prototype.show = function() {
        this.$dialog.modal("show");
    };
	
	if (!DnD) {
		DnD = {};
	}
	if (!DnD.Dialog) {
		DnD.Dialog = {};
	}
	DnD.Dialog = Dialog;
})(window.jQuery);