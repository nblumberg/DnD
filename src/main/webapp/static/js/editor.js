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
	this.$parent = jQuery("<span/>").appendTo(this.$grandparent);
	this.$html = jQuery("<" + this._tagName + "/>").addClass(this._className).appendTo(this.$parent).html(this._html).data("this", this).on({ dblclick: this._edit.bind(this), click: this._edit.bind(this) });
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
	this.$parent.addClass("edit");
	this.$input = jQuery("<input/>").attr("type", "text").val(this.$html.html()).appendTo(this.$parent);
	this.$html.remove();
	this.$save = jQuery("<button/>").attr("title", "Save").html("&#x2713;").appendTo(this.$parent).on({ click: this._save.bind(this) });
	this.$cancel = jQuery("<button/>").attr("title", "Cancel").html("X").appendTo(this.$parent).on({ click: this._cancel.bind(this) });
};

Editor.prototype._save = function(event) {
	event.stopPropagation();
	this.$html.html(this.$input.val());
	this._onchange(this.$input.val());
	this.$input.remove();
	this.$save.remove();
	this.$cancel.remove();
	this.$parent.removeClass("edit").append(this.$html);
};

Editor.prototype._cancel = function(event) {
	event.stopPropagation();
	this.$input.remove();
	this.$save.remove();
	this.$cancel.remove();
	this.$parent.removeClass("edit").append(this.$html);
};
