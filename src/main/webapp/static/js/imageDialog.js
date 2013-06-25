var DnD;

(function() {
	function ImageDialog(params) {
		this._toDisplay = params.toDisplay || function() {};
	    this.$dialog = null;
		this.$images = null;
		this.$fullSize = null;
	    this.buttons = {
	    		$hide: null,
	    		$display: null
	    };
		
		jQuery(document).ready((function() {
		    this.$dialog = jQuery("#imageDialog").on("show", this.show.bind(this));
		    // Setup the drag-and-drop listeners
		    this.$dialog[0].addEventListener("dragover", this._dragOver.bind(this), false);
		    this.$dialog[0].addEventListener("drop", this._drop.bind(this), false);
		    this.$fullSize = this.$dialog.find("img.fullSize").on({ click: this._highlightImage.bind(this) });
		    this.$imageFileInput = this.$dialog.find("input#imageFileInput").on({ change: this._fileInputChange.bind(this) });
		    this.$images = this.$dialog.find("td.images");
		    this.buttons.$hide = this.$dialog.find(".hideBtn").on({ click: this._hideImage.bind(this) });
		    this.buttons.$display = this.$dialog.find(".displayBtn").on({ click: this._displayImage.bind(this) });
		}).bind(this));
	}

	ImageDialog.prototype._displayImage = function() {
		if (this.$fullSize && this.$fullSize.attr("src")) {
			this._toDisplay({ type: "displayImage", src: this.$fullSize.attr("src") }, false);
		}
	};

	ImageDialog.prototype._hideImage = function() {
		this._toDisplay({ type: "hideImage" }, false);
	};

	ImageDialog.prototype._highlightImage = function(event) {
		var offset, position;
	    event.stopPropagation();
	    offset = jQuery(event.target).offset();
	    position = { x: (event.clientX + window.pageXOffset - offset.left) / event.target.width, y: (event.clientY + window.pageYOffset - offset.top) / event.target.height };
	    try { window.console.info("highlightImage { x: " + (100 * position.x) + "%, y: " + (100 * position.y) + "% }") } catch(e) {};
		this._toDisplay({ type: "highlightImage", position: position }, false);
	};

	ImageDialog.prototype._dragOver = function(event) {
	    event.stopPropagation();
	    event.preventDefault();
	    event.dataTransfer.dropEffect = "copy"; // Explicitly show this is a copy.
	};

	ImageDialog.prototype._drop = function(event) {
	    event.stopPropagation();
	    event.preventDefault();
	    handleFileSelection(event.dataTransfer.files); // FileList object
	};

	ImageDialog.prototype._fileInputChange = function(event) {
	    event.stopPropagation();
	    event.preventDefault();
		handleFileSelection(event.target.files || [ event.target.file ]); 
	};

	ImageDialog.prototype._handleFileSelection = function(files) { // FileList object
		var i, f, reader;
	    // files is a FileList of File objects ({ name: String, type: String, size: Number, lastModifiedDate: Date }).
	    for (i = 0, f; f = files[i]; i++) {
	    	if (f) {
	    		reader = new FileReader();
	    		reader.onload = (function(theFile, e) {
	    				var $img, img = new Image();
	        			img.title = theFile.name;
	        			img.height = 40;
	        			img.src = e.target.result;
	        			$img = jQuery(img).css({ height: "40px" }).on({ click: (function(image) {
		        			this.$fullSize.attr("src", image.src).show();
		        			// TODO: recenter dialog
	        			}).bind(this, img) });
	        			this.$images.append($img);
	    			}).bind(this, f);
	    		reader.readAsDataURL(f);
	    	}
	    }
	};
	
	ImageDialog.prototype.show = function() {
	};

	
	if (!DnD) {
		DnD = {};
	}
	if (!DnD.Dialog) {
		DnD.Dialog = {};
	}
	DnD.Dialog.Image = ImageDialog;
})();
