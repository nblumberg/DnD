var DnD;
(function() {
	"use strict";
	
	var data, i, isNew;
	
    window.initiative = new DnD.Initiative();
	if (!window.initiative.initFromLocalStorage()) {
		window.initiative.loadInitFromJs();
	}
})();
