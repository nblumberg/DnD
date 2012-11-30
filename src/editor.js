var Editor = function(params) {
	params = params || {};
	this.$grandparent = params.$parent;
	this._tagName = params.tagName;
	this._html = params.html;
	this._onchange = params.onchange;
	this.$parent = jQuery("<span/>").appendTo(this.$grandparent);
	this.$html = jQuery("<" + this._tagName + "/>").appendTo(this.$parent).html(this._html).data("this", this).on({ click: this._edit.bind(this) });
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
