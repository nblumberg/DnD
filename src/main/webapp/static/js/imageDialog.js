(function() {
    "use strict";

    DnD.define(
        "Display.Dialog.Image",
        [ "window", "Display.Dialog", "jQuery", "out" ],
        function(w, Dialog, jQuery, out) {
            // CONSTRUCTOR & INITIALIZATION METHODS

            function ImageDialog(params) {
                this._toDisplay = params.toDisplay || function() {};
                this.$images = null;
                this.$fullSize = null;
                this.$imageFileInput = null;
                this.$imageUrlInput = null;
                this.$imageUrlButton = null;
                this.buttons = {};
                this.buttons.$hide = null;
                this.buttons.$display = null;

                if (w.localStorage) {
                    this.urls = w.localStorage.getItem("images") ? w.localStorage.getItem("images").split(",") : [];
                }

                this._init(params);
            }

            ImageDialog.prototype = new Dialog("imageDialog", "/html/partials/imageDialog.html");


            // OVERRIDDEN METHODS

            ImageDialog.prototype._onReady = function() {
                var i;
                // Setup the drag-and-drop listeners
                this.$dialog[0].addEventListener("dragover", this._dragOver.bind(this), false);
                this.$dialog[0].addEventListener("drop", this._drop.bind(this), false);
                this.$fullSize = this.$dialog.find("img.fullSize").on({ click: this._highlightImage.bind(this) });
                this.$imageFileInput = this.$dialog.find("input#imageFileInput").on({ change: this._fileInputChange.bind(this) });
                this.$imageUrlInput = this.$dialog.find("input#imageUrlInput");
                this.$imageUrlButton = this.$dialog.find("button#imageUrlButton").on({ click: this._fetchUrl.bind(this) });
                this.$images = this.$dialog.find(".images");
                this.buttons.$hide = this.$dialog.find(".hideBtn").on({ click: this._hideImage.bind(this) });
                this.buttons.$display = this.$dialog.find(".displayBtn").on({ click: this._displayImage.bind(this) });

                for (i = 0; i < this.urls.length; i++) {
                    if (!this.urls[ i ] || this.urls[ i ] === "null") {
                        continue;
                    }
                    this._addImage(this.urls[ i ].split("/").pop(), this.urls[ i ]);
                }
            };

            ImageDialog.prototype._center = function() {
                // Don't re-center, uses custom CSS
            };


            // NON-PUBLIC METHODS

            ImageDialog.prototype._addImage = function(name, src) {
                var $img, img = new Image();
                img.title = name;
                img.height = 40;
                img.src = src;
                $img = jQuery(img).addClass("thmbnl").on({ click: (function(image) {
                    this.$fullSize.attr("src", image.src).show();
                    w.setTimeout(this._center.bind(this), 100);
                }).bind(this, img) });
                this.$images.append($img);
            };


            ImageDialog.prototype._displayImage = function() {
                if (this.$fullSize && this.$fullSize.attr("src")) {
                    this._toDisplay({ type: "displayImage", src: this.$fullSize.attr("src") }, false);
                }
            };

            ImageDialog.prototype._hideImage = function() {
                this._toDisplay({ type: "hideImage" }, false);
            };


            // Event handlers

            ImageDialog.prototype._highlightImage = function(event) {
                var offset, position;
                event.stopPropagation();
                offset = jQuery(event.target).offset();
                position = { x: (event.clientX + w.pageXOffset - offset.left) / event.target.width, y: (event.clientY + w.pageYOffset - offset.top) / event.target.height };
                console.info("highlightImage { x: " + (100 * position.x) + "%, y: " + (100 * position.y) + "% }");
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
                this._handleFileSelection(event.dataTransfer.files); // FileList object
            };

            ImageDialog.prototype._fileInputChange = function(event) {
                event.stopPropagation();
                event.preventDefault();
                this._handleFileSelection(event.target.files || [ event.target.file ]);
            };

            ImageDialog.prototype._handleFileSelection = function(files) { // FileList object
                var i, f, reader, fn;
                fn = function(theFile, e) {
                    this._addImage(theFile.name, e.target.result);
                };
                // files is a FileList of File objects ({ name: String, type: String, size: Number, lastModifiedDate: Date }).
                for (i = 0; i < files.length; i++) {
                    f = files[i];
                    if (f) {
                        reader = new FileReader();
                        reader.onload = fn.bind(this, f);
                        reader.readAsDataURL(f);
                    }
                }
            };

            ImageDialog.prototype._fetchUrl = function(event) {
                var url, value;
                url = this.$imageUrlInput.val();
                this._addImage(url.split("/").pop(), url);
                if (w.localStorage) {
                    value = w.localStorage.getItem("images");
                    w.localStorage.setItem("images", value + "," + url);
                }
            };

            return ImageDialog;
        },
        true
    );

})();
