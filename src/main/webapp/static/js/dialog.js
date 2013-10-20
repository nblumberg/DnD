var DnD;

(function(jQuery) {
    "use strict";
    
    var $body;
    jQuery(document).ready(function() {
        $body = jQuery("body").on("keyup", function(event) {
            if (event.keyCode === 27) { // Esc
                $body.removeClass("dialog");
            }
            else if (event.keyCode === 13 && Dialog.current) { // Enter
                Dialog.current._onOkButtonClick();
            }
        });
    });
    
    if (!DnD) {
        DnD = {};
    }
    
    // CONSTRUCTOR
    
    /**
     * @param id {String} The id of the modal element
     * @param url {String} The URL of the dialog content
     */
    function Dialog(id, url, $trigger) {
        this.id = id;
        this.url = url;
    }
    
    Dialog.prototype = new EventDispatcher();
    Dialog.current = null;
    
    // INITIALIZATION METHODS
    
    /**
     * @param params {Object}
     * @param params.$parent {jQuery selection} The element to append the dialog element(s) to
     * @param [params.$trigger] {jQuery Selection} The element that, when clicked, raises the dialog
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
        
        this.$trigger = params.$trigger;
        if (this.$trigger) {
            this.$trigger.on("click", this.show.bind(this));
        }
    };

    Dialog.prototype._onLoad = function($tmp) {
        jQuery(document).ready((function() {
            var _self = this;
            $body.on("keyup", function(event) {
                if (event.keyCode === 27) { // Esc
                    _self.hide();
                }
            });
            if (!this.$parent) {
                this.$parent = jQuery("#dialogs");
            }
            $tmp.children().appendTo(this.$parent);
            
            this.$dialog = jQuery("#" + this.id);
            if (!this.$dialog.length) {
                try { window.console.error("Failed to find dialog element for #" + this.id); } finally {}
            }
            this.$header = this.$dialog.find(".header");
            this.$header.append(jQuery("<button type=\"button\" class=\"close\" aria-hidden=\"true\">&times;</button>").on("click", (function() {
                this.hide();
            }).bind(this)));
            this.$body = this.$dialog.find(".body");
            this.$footer = this.$dialog.find(".footer");
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
    
    Dialog.prototype._onOkButtonClick = function() {
        // Overridden by subclass
    };
    
    // PUBLIC METHODS
    
    Dialog.prototype.show = function() {
        Dialog.current = this;
        $body.addClass("dialog " + this.id);
        this._onShow();
    };
    
    Dialog.prototype.hide = function() {
        Dialog.current = null;
        $body.removeClass("dialog " + this.id);
    };
    
    // PRIVATE METHODS
    
    Dialog.prototype._onShow = function() {
        // Overridden by subclass
    };

    
    DnD.Dialog = Dialog;
})(window.jQuery);