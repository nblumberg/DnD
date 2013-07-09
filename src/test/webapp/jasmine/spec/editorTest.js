describe("editor.js", function() {
	var $div, params, editor, event;
	beforeEach(function() {
		$div = jQuery("<div/>");
		params = {
			$parent: $div,
			tagName: "span",
			_className: "testClass",
			html: "testHtml",
			onchange: function() {}
		};
		spyOn(params, "onchange");
		spyOn(Editor.prototype, "_edit").andCallThrough();
		spyOn(Editor.prototype, "_save").andCallThrough();
		spyOn(Editor.prototype, "_cancel").andCallThrough();
		editor = new Editor(params);
	});
	
	describe("When creating a new Editor", function() {
		it("it should exist", function() {
			expect(editor).not.toEqual(undefined);
			expect(editor).not.toEqual(null);
		});
		it("it should create a text display element", function() {
			expect(editor.$html).not.toEqual(undefined);
			expect(editor.$html).not.toEqual(null);
			expect(editor.$html.length).not.toEqual(0);
		});
		it("it should create a text display element of the proper tagName", function() {
			expect(editor.$html[0].nodeName.toLowerCase()).toEqual(params.tagName);
		});
		it("it should create a text display element with the proper classes", function() {
			expect(editor.$html.hasClass(params._className)).toEqual(true);
		});
		it("it should create a text display element with the proper innerHTML", function() {
			expect(editor.$html.html()).toEqual(params.html);
		});
		it("it should create a text display element under the provided parent element", function() {
			var $find = $div.find(params.tagName + "." + params._className);
			expect($find.length).toEqual(1);
			expect($find[0]).toEqual(editor.$html[0]);
		});
		
        it("it should create the text input", function() {
            expect(editor.$input).not.toEqual(undefined);
            expect(editor.$input.length).not.toEqual(0);
            expect(editor.$input[0].nodeName.toLowerCase()).toEqual("input");
            expect(editor.$input.attr("type")).toEqual("text");
            expect(editor.$input.val()).toEqual(params.html);
            expect(editor.$input.parent()[0]).toEqual(editor.$parent[0]);
        });
        it("it should create the save button", function() {
            expect(editor.$save).not.toEqual(undefined);
            expect(editor.$save.length).not.toEqual(0);
            expect(editor.$save[0].nodeName.toLowerCase()).toEqual("button");
            expect(editor.$save.attr("title")).toEqual("Save");
            expect(editor.$save.html().charCodeAt(0)).toEqual(10003);
            expect(editor.$save.parent()[0]).toEqual(editor.$parent[0]);
        });
        it("it should create the cancel button", function() {
            expect(editor.$cancel).not.toEqual(undefined);
            expect(editor.$cancel.length).not.toEqual(0);
            expect(editor.$cancel[0].nodeName.toLowerCase()).toEqual("button");
            expect(editor.$cancel.attr("title")).toEqual("Cancel");
            expect(editor.$cancel.html()).toEqual("X");
            expect(editor.$cancel.parent()[0]).toEqual(editor.$parent[0]);
        });

		it("it should not start in edit mode", function() {
			expect(editor.$parent.hasClass("edit")).toEqual(false);
		});
	});
	
	describe("User interaction", function() {
		describe("text display", function() {
			it("on click it should switch to edit mode", function() {
				event = jQuery.Event("click");
				editor.$html.trigger(event);
				expect(Editor.prototype._edit).toHaveBeenCalled();
			});
			it("on click it should switch to edit mode and stop propagation of the event", function() {
				event = jQuery.Event("click");
				spyOn(event, "stopPropagation");
				editor.$html.trigger(event);
				expect(event.stopPropagation).toHaveBeenCalled();
			});
			it("on doubleclick it should switch to edit mode", function() {
				event = jQuery.Event("dblclick");
				editor.$html.trigger(event);
				expect(Editor.prototype._edit).toHaveBeenCalled();
			});
			it("on doubleclick it should switch to edit mode and stop propagation of the event", function() {
				event = jQuery.Event("click");
				spyOn(event, "stopPropagation");
				editor.$html.trigger(event);
				expect(event.stopPropagation).toHaveBeenCalled();
			});
		});
		
		describe("editor buttons", function() {
			beforeEach(function() {
				event = jQuery.Event("click");
				editor.$html.trigger(event);
			});
			
			it("on click the save button should switch to display mode", function() {
				event = jQuery.Event("click");
				editor.$save.trigger(event);
				expect(Editor.prototype._save).toHaveBeenCalled();
			});
			it("on click the save button should switch to display mode and stop propagation of the event", function() {
				event = jQuery.Event("click");
				spyOn(event, "stopPropagation");
				editor.$save.trigger(event);
				expect(event.stopPropagation).toHaveBeenCalled();
			});
			
			it("on click the cancel button should switch to display mode", function() {
				event = jQuery.Event("click");
				editor.$cancel.trigger(event);
				expect(Editor.prototype._cancel).toHaveBeenCalled();
			});
			it("on click the cancel button should switch to display mode and stop propagation of the event", function() {
				event = jQuery.Event("click");
				spyOn(event, "stopPropagation");
				editor.$cancel.trigger(event);
				expect(event.stopPropagation).toHaveBeenCalled();
			});
		});
	});

	describe("In edit mode", function() {
		beforeEach(function() {
			event = jQuery.Event("click");
			editor.$html.trigger(event);
		});
		it("it should apply the \"edit\" class to the text display parent element", function() {
			expect(editor.$parent.hasClass("edit")).toEqual(true);
		});
	});

	describe("Leaving edit mode", function() {
		beforeEach(function() {
			event = jQuery.Event("click");
			editor.$html.trigger(event);
		});
		
		describe("on save", function() {
			var newValue = "new value";
			beforeEach(function() {
				editor.$input.val(newValue);
				event = jQuery.Event("click");
				editor.$save.trigger(event);
			});
			
			it("it should remove the \"edit\" class from the text display parent element", function() {
				expect(editor.$parent.hasClass("edit")).toEqual(false);
			});
			it("it should set the text display innerHTML to the new value", function() {
				expect(editor.$html.html()).toEqual(newValue);
			});
			it("it should pass the new value to the callback", function() {
				expect(params.onchange).toHaveBeenCalledWith(newValue);
			});
		});
		describe("on cancel", function() {
			beforeEach(function() {
				event = jQuery.Event("click");
				editor.$cancel.trigger(event);
			});
			
			it("it should remove the \"edit\" class from the text display parent element", function() {
				expect(editor.$parent.hasClass("edit")).toEqual(false);
			});
			it("the text display innerHTML should not change", function() {
				expect(editor.$html.html()).toEqual(params.html);
			});
			it("it should not pass the input value to the callback", function() {
				expect(params.onchange).not.toHaveBeenCalled();
			});
		});
		
	});

	describe("when setValue() is invoked", function() {
		it("it should set the inner HTML of the $html member", function() {
			editor.setValue("testValue");
			expect(editor.$html.html()).toEqual("testValue");
		});
	});
});