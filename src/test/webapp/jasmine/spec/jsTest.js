describe("js.js", function() {
	var array, result, i;
	array = [ "test", 1, 2, 3, 4, "..." ];
	result = [];
	array.each(function(item, index) {
		result.push(item);
		it("index should be in the correct order", (function(a, b) {
			expect(a).toEqual(b);
		}).bind(this, result.length - 1, index));
	});
	it("arrays should be the same length", (function(a, b) {
		expect(a).toEqual(b);
	}).bind(this, result.length, array.length));
	for (i = 0; i < array.length; i++) {
		it("arrays items at index " + i + " should be equal", (function(a, b, index) {
			expect(a[ index ]).toEqual(b[ index ]);
		}).bind(this, result, array, i));
	}
});