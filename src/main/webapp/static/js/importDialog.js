var DnD;

(function() {
    "use strict";
    
    if (!DnD) {
        DnD = {};
    }
    if (!DnD.Dialog) {
        DnD.Dialog = {};
    }
    
    
    // CONSTRUCTOR & INITIALIZATION METHODS
    
    function ImportDialog(params) {
        this.import = params.import;
        this.$import = null;
        this.buttons = {
            $import: null
        };
        this._init(params);
    }

    ImportDialog.prototype = new DnD.Dialog("importDialog", "/html/partials/importDialog.html");
    
    // OVERRIDDEN METHODS
    
    ImportDialog.prototype.show = function(params) {
        DnD.Dialog.prototype.show.call(this);
    };
    
    ImportDialog.prototype._onReady = function() {
        this.$import = this.$dialog.find("#importText");
        this.buttons.$import = this.$dialog.find(".importBtn").on({ click: this._doImport.bind(this) });
    };
    
    ImportDialog.prototype._onShow = function() {
        this.$import.val();
    };
    
    
    // PRIVATE METHODS
    
    ImportDialog.prototype._doImport = function() {
        var data;
        try {
            data = JSON.parse(this.$import.val());
        }
        catch (e) {
            console.error(e.toString());
        }

        this.import(data);
        this.hide();
    };

    
    
    DnD.Dialog.Import = ImportDialog;
})();