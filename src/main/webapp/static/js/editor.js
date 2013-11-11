/* global DnD:true */

/* exported DnD.Display.Editor */

(function() {
    "use strict";

    if (!DnD) {
        DnD = {};
    }
    if (!DnD.Display) {
        DnD.Display = {};
    }

    /**
     * @param {Object} params
     * @param {jQueryCollection} params.$parent The parent element under which to create the Editor HTML
     * @param {String} params.tagName The nodeName of the text display element
     * @param {String} [params._className] Optional classes to apply to the text display element
     * @param {String} params.html Optional initial value for the text display and text entry elements
     * @param {Boolean} [params.delegated] Optional If true, prevents Editor from attaching click handlers
     * @param onchange Function Callback invoked when the value of the text is changed (i.e. saved), passed the new value
     */
    function Editor(params) {
        Editor.editors.push(this);
        this.id = Editor.editors.length - 1;

        params = params || {};
        this.$grandparent = params.$parent;
        this._tagName = params.tagName;
        this._className = params._className || "";
        this._html = params.html;
        this._onchange = params.onchange;
        this.$parent = jQuery("<span/>").addClass("editor").attr("data-editor-id", this.id).appendTo(this.$grandparent);
        this.$html = jQuery("<" + this._tagName + "/>").addClass("display " + this._className).appendTo(this.$parent).html(this._html);
        this.$input = jQuery("<input/>").attr("type", "text").val(this.$html.html()).appendTo(this.$parent);
        this.$save = jQuery("<button/>").addClass("save").attr("title", "Save").html("&#x2713;").appendTo(this.$parent);
        this.$cancel = jQuery("<button/>").addClass("cancel").attr("title", "Cancel").html("X").appendTo(this.$parent);
    }

    jQuery(document).on("click dblclick", ".editor .display, .editor button", function(event) {
        var $element, $editor, editor;
        $element = jQuery(this);
        $editor = $element.parents(".editor");
        editor = Editor.editors[ parseInt($editor.attr("data-editor-id"), 10) ];
        if (!editor) {
            return;
        }
        if ($element.hasClass("display")) {
            editor._edit(event);
        }
        else if ($element.hasClass("save")) {
            editor._save(event);
        }
        else if ($element.hasClass("cancel")) {
            editor._cancel(event);
        }
    });

    Editor.editors = [];

    Editor.prototype.reattach = function($grandparent) {
        if ($grandparent) {
            this.$grandparent = $grandparent;
            this.$parent.appendTo(this.$grandparent);
        }
        this.$html.on({ dblclick: this._edit.bind(this), click: this._edit.bind(this) });
        this.$save.on({ click: this._save.bind(this) });
        this.$cancel.on({ click: this._cancel.bind(this) });
    };

    Editor.prototype.setValue = function(value) {
        this.$html.html(value);
    };

    Editor.prototype._edit = function(event) {
        event.stopPropagation();
        if (this.$parent.hasClass("edit")) {
            return;
        }
        this.$input.val(this.$html.html());
        this.$parent.addClass("edit");
    };

    Editor.prototype._save = function(event) {
        var value = this.$input.val();
        event.stopPropagation();
        this.$html.html(value);
        this.$parent.removeClass("edit");
        this._onchange(value);
    };

    Editor.prototype._cancel = function(event) {
        var value = this.$html.html();
        event.stopPropagation();
        this.$parent.removeClass("edit");
        this.$input.val(value);
    };


    DnD.Display.Editor = Editor;
})();
