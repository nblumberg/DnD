/**
 * @param params Object
 * @param params.$parent jQueryCollection The parent element under which to create the Editor HTML
 * @param params.tagName String The nodeName of the text display element
 * @param params._className {String} Optional classes to apply to the text display element
 * @param params.html {String} Optional initial value for the text display and text entry elements
 * @param onchange Function Callback invoked when the value of the text is changed (i.e. saved), passed the new value
 * 
 */
var Editor = function(params) {
	params = params || {};
	this.$grandparent = params.$parent;
	this._tagName = params.tagName;
    this._className = params._className || "";
	this._html = params.html;
    this._onchange = params.onchange;
	this.$parent = jQuery("<span/>").addClass("editor").appendTo(this.$grandparent);
	this.$html = jQuery("<" + this._tagName + "/>").addClass("display " + this._className).appendTo(this.$parent).html(this._html).data("this", this).on({ dblclick: this._edit.bind(this), click: this._edit.bind(this) });
	this.$input = jQuery("<input/>").attr("type", "text").val(this.$html.html()).appendTo(this.$parent);
	this.$save = jQuery("<button/>").attr("title", "Save").html("&#x2713;").appendTo(this.$parent).on({ click: this._save.bind(this) });
	this.$cancel = jQuery("<button/>").attr("title", "Cancel").html("X").appendTo(this.$parent).on({ click: this._cancel.bind(this) });
};

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
	var entry, $span, $input, $save, $delete, i, $ancestor;
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
