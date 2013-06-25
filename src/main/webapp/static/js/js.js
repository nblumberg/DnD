/**
 * Extends Array to support the method "each"
 * @param fn Function A function of the form function(item, index) that will be called for each item/index in this Array
 */
Array.prototype.each = function(fn) {
	var i, item;
	for (i = 0; i < this.length; i++) {
		item = this[ i ];
		fn(item, i, this);
	}
};
