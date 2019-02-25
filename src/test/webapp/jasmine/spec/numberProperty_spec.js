((window, DnD) => {
    describe("When a number property", () => {
        describe("is created", () => {
            describe("without a name", () => {
                it("it's name should be \"Unknown number Property\"", () => {
                    let prop = new DnD.Property.Number();
                    expect(prop.name).toEqual("Unknown number Property");
                });
            });
            describe("with a name", () => {
                it("it's name should be the passed name", () => {
                    let prop = new DnD.Property.Number("test");
                    expect(prop.name).toEqual("test");
                });
            });
            describe("without an initial value", () => {
                it("it's value should be 0", () => {
                    let prop = new DnD.Property.Number("test");
                    expect(prop.value).toEqual(0);
                    expect(prop.valueOf()).toEqual(0);
                });
            });
            describe("with an initial value", () => {
                it("it's value should be the passed value", () => {
                    let prop = new DnD.Property.Number("test", 666);
                    expect(prop.value).toEqual(666);
                    expect(prop.valueOf()).toEqual(666);

                    prop = new DnD.Property.Number("test", -999);
                    expect(prop.value).toEqual(-999);
                    expect(prop.valueOf()).toEqual(-999);
                });
            });
        });
        describe("set value is called", () => {
            it("it should change the raw value", () => {
                let prop = new DnD.Property.Number("test", 1);
                prop.value = 2;
                expect(prop.value).toEqual(2);
                expect(prop.valueOf()).toEqual(2);
                expect(prop.raw().value).toEqual(2);
            });
        });
        describe("is modified", () => {
            describe("with an = modifier", () => {
                it("it should substitute the value of the Property with the value of the Modifier", () => {
                    let prop = new DnD.Property.Number("test", 6);
                    let mod = new DnD.Modifier.Substitute("testModifier", 2, prop);
                    expect(prop.value).toEqual(2);

                    prop = new DnD.Property.Number("test", -6);
                    mod = new DnD.Modifier.Substitute("testModifier", 12, prop);
                    expect(prop.value).toEqual(12);
                });
                describe("set value is called", () => {
                    it("it should change the raw value and the change should not propagate down the modifier chain further than the = Modifier", () => {
                        let prop = new DnD.Property.Number("test", 6);
                        let mod = new DnD.Modifier.Substitute("testModifier", 15, prop);
                        expect(prop.value).toEqual(15);
                        prop.value = 8000;
                        expect(prop.value).toEqual(15);
                    });
                });
            });
            describe("with a + modifier", () => {
                it("it should add the value of the Modifier to the value of the Property", () => {
                    let prop = new DnD.Property.Number("test", 1);
                    let mod = new DnD.Modifier.Numeric.Add("testModifier", 1, prop);
                    expect(prop.value).toEqual(2);

                    prop = new DnD.Property.Number("test", 2);
                    mod = new DnD.Modifier.Numeric.Add("testModifier", 2, prop);
                    expect(prop.value).toEqual(4);
                });
                describe("set value is called", () => {
                    it("it should change the raw value and the change should propagate down the modifier chain", () => {
                        let prop = new DnD.Property.Number("test", 1);
                        let mod = new DnD.Modifier.Numeric.Add("testModifier", 1, prop);
                        expect(prop.value).toEqual(2);
                        prop.value = 2;
                        expect(prop.value).toEqual(3);
                    });
                });
            });
            describe("with a - modifier", () => {
                it("it should subtract the value of the Modifier from the value of the Property", () => {
                    let prop = new DnD.Property.Number("test", 2);
                    let mod = new DnD.Modifier.Numeric.Subtract("testModifier", 1, prop);
                    expect(prop.value).toEqual(1);

                    prop = new DnD.Property.Number("test", 6);
                    mod = new DnD.Modifier.Numeric.Subtract("testModifier", 2, prop);
                    expect(prop.value).toEqual(4);

                    prop = new DnD.Property.Number("test", -2);
                    mod = new DnD.Modifier.Numeric.Subtract("testModifier", -3, prop);
                    expect(prop.value).toEqual(1);

                    prop = new DnD.Property.Number("test", -1);
                    mod = new DnD.Modifier.Numeric.Subtract("testModifier", 2, prop);
                    expect(prop.value).toEqual(-3);
                });
            });
            describe("with a * modifier", () => {
                it("it should multiply the value of the Modifier by the value of the Property", () => {
                    let prop = new DnD.Property.Number("test", 2);
                    let mod = new DnD.Modifier.Numeric.Multiply("testModifier", 3, prop);
                    expect(prop.value).toEqual(6);

                    prop = new DnD.Property.Number("test", 8);
                    mod = new DnD.Modifier.Numeric.Multiply("testModifier", 9, prop);
                    expect(prop.value).toEqual(72);

                    prop = new DnD.Property.Number("test", -2);
                    mod = new DnD.Modifier.Numeric.Multiply("testModifier", 3, prop);
                    expect(prop.value).toEqual(-6);

                    prop = new DnD.Property.Number("test", -2);
                    mod = new DnD.Modifier.Numeric.Multiply("testModifier", -3, prop);
                    expect(prop.value).toEqual(6);
                });
            });
            describe("with a / modifier", () => {
                it("it should divide the value of the Property by the value of the Modifier", () => {
                    let prop = new DnD.Property.Number("test", 6);
                    let mod = new DnD.Modifier.Numeric.Divide("testModifier", 2, prop);
                    expect(prop.value).toEqual(3);

                    prop = new DnD.Property.Number("test", 15);
                    mod = new DnD.Modifier.Numeric.Divide("testModifier", 3, prop);
                    expect(prop.value).toEqual(5);

                    prop = new DnD.Property.Number("test", -6);
                    mod = new DnD.Modifier.Numeric.Divide("testModifier", 2, prop);
                    expect(prop.value).toEqual(-3);

                    prop = new DnD.Property.Number("test", -6);
                    mod = new DnD.Modifier.Numeric.Divide("testModifier", -2, prop);
                    expect(prop.value).toEqual(3);
                });
                describe("with a 0 value", () => {
                    it("it should throw an Exception", () => {
                        let prop = new DnD.Property.Number("test", 6);
                        let mod = new DnD.Modifier.Numeric.Divide("testModifier", 0, prop);
                        expect(() => { return prop.value; }).toThrow("Can't divide by 0");
                    });
                });
            });
            describe("with a /_ modifier", () => {
                it("it should divide the value of the Property by the value of the Modifier", () => {
                    let prop = new DnD.Property.Number("test", 7);
                    let mod = new DnD.Modifier.Numeric.Divide.Floor("testModifier", 2, prop);
                    expect(prop.value).toEqual(3);

                    prop = new DnD.Property.Number("test", 16);
                    mod = new DnD.Modifier.Numeric.Divide.Floor("testModifier", 3, prop);
                    expect(prop.value).toEqual(5);

                    prop = new DnD.Property.Number("test", -7);
                    mod = new DnD.Modifier.Numeric.Divide.Floor("testModifier", 2, prop);
                    expect(prop.value).toEqual(-4);

                    prop = new DnD.Property.Number("test", -7);
                    mod = new DnD.Modifier.Numeric.Divide.Floor("testModifier", -2, prop);
                    expect(prop.value).toEqual(3);
                });
                describe("with a 0 value", () => {
                    it("it should throw an Exception", () => {
                        let prop = new DnD.Property.Number("test", 7);
                        let mod = new DnD.Modifier.Numeric.Divide.Floor("testModifier", 0, prop);
                        expect(() => { return prop.value; }).toThrow("Can't divide by 0");
                    });
                });
            });
            describe("with a several modifiers", () => {
                it("they should all modify the value of the Property in sequence", () => {
                    let prop = new DnD.Property.Number("test", 1);
                    expect(prop.value).toEqual(1);
                    let mod = new DnD.Modifier.Numeric.Add("testModifier", 2, prop);
                    expect(prop.value).toEqual(3);
                    mod = new DnD.Modifier.Numeric.Subtract("testModifier", 1, prop);
                    expect(prop.value).toEqual(2);
                    mod = new DnD.Modifier.Numeric.Multiply("testModifier", 9, prop);
                    expect(prop.value).toEqual(18);
                    mod = new DnD.Modifier.Numeric.Divide("testModifier", 3, prop);
                    expect(prop.value).toEqual(6);
                });
                describe("set value is called", () => {
                    it("it should change the raw value and the change should propagate down the modifier chain", () => {
                        let prop = new DnD.Property.Number("test", 1);
                        expect(prop.value).toEqual(1);
                        let mod = new DnD.Modifier.Numeric.Add("testModifier", 2, prop);
                        expect(prop.value).toEqual(3);
                        mod = new DnD.Modifier.Numeric.Subtract("testModifier", 1, prop);
                        expect(prop.value).toEqual(2);
                        mod = new DnD.Modifier.Numeric.Multiply("testModifier", 9, prop);
                        expect(prop.value).toEqual(18);
                        mod = new DnD.Modifier.Numeric.Divide("testModifier", 3, prop);
                        expect(prop.value).toEqual(6);
                        prop.value = 2;
                        expect(prop.value).toEqual(9);
                    });
                });
            });
        });
        describe(".raw() is called", () => {
            it("it should return an Object with all the same properties as the Property except value, which should be the raw value", () => {
                let prop = new DnD.Property.Number("test", 1);
                let mod = new DnD.Modifier.Numeric.Add("testModifier", 2, prop);
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
                expect(raw.value).toEqual(1);
                expect(prop.value).toEqual(3);
            });
        });
    });
})(window, window.DnD);