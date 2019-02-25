((window, DnD) => {
    describe("When a boolean property", () => {
        describe("is created", () => {
            describe("without a name", () => {
                it("it's name should be \"Unknown boolean Property\"", () => {
                    let prop = new DnD.Property.Boolean();
                    expect(prop.name).toEqual("Unknown boolean Property");
                });
            });
            describe("with a name", () => {
                it("it's name should be the passed name", () => {
                    let prop = new DnD.Property.Boolean("test");
                    expect(prop.name).toEqual("test");
                });
            });
            describe("without an initial value", () => {
                it("it's value should be false", () => {
                    let prop = new DnD.Property.Boolean("test");
                    expect(prop.value).toEqual(false);
                    expect(prop.valueOf()).toEqual(false);
                });
            });
            describe("with an initial value", () => {
                it("it's value should be the passed value", () => {
                    let prop = new DnD.Property.Boolean("test", true);
                    expect(prop.value).toEqual(true);
                    expect(prop.valueOf()).toEqual(true);

                    prop = new DnD.Property.Boolean("test", false);
                    expect(prop.value).toEqual(false);
                    expect(prop.valueOf()).toEqual(false);
                });
            });
        });
        describe("set value is called", () => {
            it("it should change the raw value", () => {
                let prop = new DnD.Property.Boolean("test", true);
                prop.value = false;
                expect(prop.value).toEqual(false);
                expect(prop.valueOf()).toEqual(false);
                expect(prop.raw().value).toEqual(false);
            });
        });
        describe("is modified", () => {
            describe("with an = modifier", () => {
                it("it should substitute the value of the Property with the value of the Modifier", () => {
                    let prop = new DnD.Property.Boolean("test", true);
                    let mod = new DnD.Modifier.Substitute("testModifier", false, prop);
                    expect(prop.value).toEqual(false);

                    prop = new DnD.Property.Boolean("test", false);
                    mod = new DnD.Modifier.Substitute("testModifier", true, prop);
                    expect(prop.value).toEqual(true);
                });
                describe("set value is called", () => {
                    it("it should change the raw value and the change should not propagate down the modifier chain further than the = Modifier", () => {
                        let prop = new DnD.Property.Boolean("test", true);
                        let mod = new DnD.Modifier.Substitute("testModifier", false, prop);
                        expect(prop.value).toEqual(false);
                        prop.value = false;
                        expect(prop.value).toEqual(false);
                    });
                });
            });
            describe("with a ! modifier", () => {
                it("it should reverse the value of the Property", () => {
                    let prop = new DnD.Property.Boolean("test", true);
                    let mod = new DnD.Modifier.Boolean.Not("testModifier", false, prop);
                    expect(prop.value).toEqual(false);

                    prop = new DnD.Property.Boolean("test", false);
                    mod = new DnD.Modifier.Boolean.Not("testModifier", false, prop);
                    expect(prop.value).toEqual(true);
                });
                describe("set value is called", () => {
                    it("it should change the raw value and the change should propagate down the modifier chain", () => {
                        let prop = new DnD.Property.Boolean("test", true);
                        let mod = new DnD.Modifier.Boolean.Not("testModifier", false, prop);
                        expect(prop.value).toEqual(false);
                        prop.value = false;
                        expect(prop.value).toEqual(true);
                    });
                });
            });
            describe("with an && modifier", () => {
                it("it should AND the value of the Property", () => {
                    let prop = new DnD.Property.Boolean("test", true);
                    let mod = new DnD.Modifier.Boolean.And("testModifier", true, prop);
                    expect(prop.value).toEqual(true);

                    prop = new DnD.Property.Boolean("test", true);
                    mod = new DnD.Modifier.Boolean.And("testModifier", false, prop);
                    expect(prop.value).toEqual(false);

                    prop = new DnD.Property.Boolean("test", false);
                    mod = new DnD.Modifier.Boolean.And("testModifier", true, prop);
                    expect(prop.value).toEqual(false);

                    prop = new DnD.Property.Boolean("test", false);
                    mod = new DnD.Modifier.Boolean.And("testModifier", true, prop);
                    expect(prop.value).toEqual(false);
                });
            });
            describe("with an || modifier", () => {
                it("it should OR the value of the Property", () => {
                    let prop = new DnD.Property.Boolean("test", true);
                    let mod = new DnD.Modifier.Boolean.Or("testModifier", true, prop);
                    expect(prop.value).toEqual(true);

                    prop = new DnD.Property.Boolean("test", true);
                    mod = new DnD.Modifier.Boolean.Or("testModifier", false, prop);
                    expect(prop.value).toEqual(true);

                    prop = new DnD.Property.Boolean("test", false);
                    mod = new DnD.Modifier.Boolean.Or("testModifier", true, prop);
                    expect(prop.value).toEqual(true);

                    prop = new DnD.Property.Boolean("test", false);
                    mod = new DnD.Modifier.Boolean.Or("testModifier", false, prop);
                    expect(prop.value).toEqual(false);
                });
            });
            describe("with an XOR modifier", () => {
                it("it should XOR the value of the Property", () => {
                    let prop = new DnD.Property.Boolean("test", true);
                    let mod = new DnD.Modifier.Boolean.Xor("testModifier", true, prop);
                    expect(prop.value).toEqual(false);

                    prop = new DnD.Property.Boolean("test", true);
                    mod = new DnD.Modifier.Boolean.Xor("testModifier", false, prop);
                    expect(prop.value).toEqual(true);

                    prop = new DnD.Property.Boolean("test", false);
                    mod = new DnD.Modifier.Boolean.Xor("testModifier", true, prop);
                    expect(prop.value).toEqual(true);

                    prop = new DnD.Property.Boolean("test", false);
                    mod = new DnD.Modifier.Boolean.Xor("testModifier", false, prop);
                    expect(prop.value).toEqual(false);
                });
            });
            describe("with a several modifiers", () => {
                it("they should all modify the value of the Property in sequence", () => {
                    let prop = new DnD.Property.Boolean("test", false);
                    expect(prop.value).toEqual(false);
                    let mod = new DnD.Modifier.Boolean.Not("testModifier", false, prop);
                    expect(prop.value).toEqual(true);
                    mod = new DnD.Modifier.Boolean.And("testModifier", false, prop);
                    expect(prop.value).toEqual(false);
                    mod = new DnD.Modifier.Boolean.Or("testModifier", true, prop);
                    expect(prop.value).toEqual(true);
                    mod = new DnD.Modifier.Boolean.Xor("testModifier", true, prop);
                    expect(prop.value).toEqual(false);
                });
                describe("set value is called", () => {
                    it("it should change the raw value and the change should propagate down the modifier chain", () => {
                        let prop = new DnD.Property.Boolean("test", false);
                        expect(prop.value).toEqual(false);
                        let mod = new DnD.Modifier.Boolean.Not("testModifier", false, prop);
                        expect(prop.value).toEqual(true);
                        mod = new DnD.Modifier.Boolean.Xor("testModifier", true, prop);
                        expect(prop.value).toEqual(false);
                        prop.value = true;
                        expect(prop.value).toEqual(true);
                    });
                });
            });
        });
        describe(".raw() is called", () => {
            it("it should return an Object with all the same properties as the Property except value, which should be the raw value", () => {
                let prop = new DnD.Property.Boolean("test", true);
                let mod = new DnD.Modifier.Boolean.Not("testModifier", false, prop);
                let raw = prop.raw();
                expect(raw).toBeDefined();
                expect(raw).not.toEqual(null);
                expect(raw.constructor).toEqual(Object);
                for (let p in prop) {
                    if (prop.hasOwnProperty(p)) {
                        expect(raw.hasOwnProperty(p));
                        if (p !== "value") {
                            expect(raw[ p ]).toEqual(prop[ p ]);
                        }
                    }
                }
                expect(raw.value).not.toEqual(prop.value);
                expect(raw.value).toEqual(true);
                expect(prop.value).toEqual(false);
            });
        });
    });
})(window, window.DnD);