/**
 * Created by nathanielblumberg on 2/12/17.
 */
(function PropertyIIFE(window, DnD) {
    "use strict";

    function makeProperty(Base, type, defaultValue) {
        let _values = new WeakMap();
        let _getValue = _values.get.bind(_values);
        let _setValue = _values.set.bind(_values);
        let _modifiers = new WeakMap();
        let _getModifiers = _modifiers.get.bind(_modifiers);
        let _setModifiers = _modifiers.set.bind(_modifiers);

        return class Property extends Base {
            constructor(name, initialValue) {
                super(initialValue || defaultValue);
                let modifiers = [];
                _setModifiers(this, modifiers);
                this.name = name;
                this.type = type;
                this.value = initialValue || defaultValue;
            }

            get breakdown() {
                let value = _getValue(this);
                let breakdown = `[${this.name}] ${this.value} = [${value} base]`;
                _getModifiers(this).forEach(function calculateBreakdown(modifier) {
                    value = modifier.modify(value);
                    breakdown += modifier.breakdown(value);
                });
                return breakdown;
            }

            get value() {
                let value = _getValue(this);
                _getModifiers(this).forEach(function applyModifier(modifier) {
                    value = modifier.modify(value);
                });
                return value;
            }

            set value(value) {
                _setValue(this, value);
            }

            addModifier(modifier) {
                if (modifier && typeof modifier.addTo === "function") {
                    _getModifiers(this).push(modifier);
                }
                return this;
            }

            removeModifier(modifier) {
                _getModifiers(this).splice(modifiers.indexOf(modifier), 1);
                return this;
            }

            valueOf() {
                return this.value;
            }

            raw() {
                let o = {};
                for (let p in this) {
                    if (this.hasOwnProperty(p)) {
                        if (p === "value") {
                            o.value = _getValue(this);
                        }
                        else {
                            o[p] = this[p];
                        }
                    }
                }
                return o;
            }
        };

    }

    DnD.define("Property.Boolean", [], function PropertyBooleanFactory() {
        return makeProperty(Boolean, "boolean", false);
    }, true);

    DnD.define("Property.Date", [], function PropertyDateFactory() {
        return makeProperty(Date, "Date", window.Date.now());
    }, true);

    DnD.define("Property.Number", [], function PropertyNumberFactory() {
        return makeProperty(Number, "number", 0);
    }, true);

    DnD.define("Property.String", [], function PropertyStringFactory() {
        return makeProperty(String, "string", "");
    }, true);

    DnD.define("Property.Array", [], function PropertyArrayFactory() {
        let _values = new WeakMap();
        let _getValue = _values.get.bind(_values);
        let _setValue = _values.set.bind(_values);
        let _modifiers = new WeakMap();
        let _getModifiers = _modifiers.get.bind(_modifiers);
        let _setModifiers = _modifiers.set.bind(_modifiers);

        return class ArrayProperty extends Array {
            // Overwrite ArrayProperty species to the parent Array constructor
            // static get [Symbol.species]() {
            //     return Array;
            // }

            constructor(name, type, initialValues) {
                let proxy;
                _setModifiers(this, []);
                this.name = name;
                this.type = type;

                this.value = initialValue;

                let handler = {
                    get: function getter(target, property) {
                        let index = null;
                        try {
                            index = window.parseInt(property, 10);
                        } catch (e) {}
                        if (window.Number.isInteger(index)) {
                            return target.value[ index ];
                        }
                        return target[ property ];
                    }
                };
                proxy = new Proxy(this, handler);
            }

            get breakdown() {
                let value = _getValue(this);
                let breakdown = `[${this.name}] ${this.value} = [${value} base]`;
                _getModifiers(this).forEach(function calculateBreakdown(modifier) {
                    value = modifier.modify(value);
                    breakdown += modifier.breakdown(value);
                });
                return breakdown;
            }

            get value() {
                let value = _getValue(this);
                _getModifiers(this).forEach(function applyModifier(modifier) {
                    value = modifier.modify(value);
                });
                return value;
            }

            set value(value) {
                _setValue(this, value);
            }

            addModifier(modifier) {
                if (!(modifier instanceof Modifier)) {
                    throw "Can't add a non-Modifier";
                }
                _getModifiers(this).push(modifier);
                return this;
            }

            removeModifier(modifier) {
                _getModifiers(this).splice(modifiers.indexOf(modifier), 1);
                return this;
            }

            raw() {
                let o = {};
                for (let p in this) {
                    if (this.hasOwnProperty(p)) {
                        if (p === "value") {
                            o.value = _getValue(this);
                        }
                        else {
                            o[p] = this[p];
                        }
                    }
                }
                return o;
            }
        };
    }, true);

    function makeNumericModifier(Base, operator, modify, defaultValue) {
        return class NumericModifier extends Base {
            constructor(name, initialValue, target) {
                super(name, initialValue);
                if (target) {
                    this.addTo(target);
                }
            }

            addTo(property) {
                if (!(property instanceof Base)) {
                    throw "Can't add to a non-Property";
                }
                property.addModifier(this);
                this.target = property;
            }

            get breakdown() {
                return function breakdown(value) {
                    let valueType = typeof value;
                    return this.canModify(value) ? this.toString() : `[${this.name} skipped because can't modify ${valueType}]`;
                }.bind(this);
            }

            canModify(value) {
                return typeof value === this.type;
            }

            modify(value) {
                return modify.call(this, value);
                // window.console.error(`${this.name} skipping value ${value} (no non-abstract modify() defined)`);
            }

            remove() {
                if (this.target instanceof Base) {
                    this.target.removeModifier(this);
                }
            }

            toString() {
                return ` [${operator} ${this.value} ${this.name}]`;
            }
        };
    }

    // DnD.define("Modifier.TypeValidator", [ "Modifier" ], function ModifierTypeValidatorFactory(Modifier) {
    //     return makeModifier()
    //     return class TypeValidator extends Modifier {
    //         constructor(name, type, initialValue, target) {
    //             super(name, type, initialValue, target);
    //         }
    //
    //         canModify(value) {
    //             return typeof value === this.type;
    //         }
    //     };
    // }, true);

    // DnD.define("Modifier.Numeric", [ "Property.Number" ], function ModifierNumericFactory(NumberProperty) {
    //     return class Numeric extends TypeValidator {
    //         constructor(name, operator, amount, target) {
    //             super(name, "number", amount, target);
    //             this.operator = operator;
    //         }
    //
    //         get breakdown() {
    //             return function breakdown(value) {
    //                 let valueType = typeof value;
    //                 return this.canModify(value) ? this.toString() : `[${this.name} skipped because can't modify ${valueType}]`;
    //             }.bind(this);
    //         }
    //
    //         toString() {
    //             return ` [${this.operator} ${this.value} ${this.name}]`;
    //         }
    //     };
    // }, true);

    DnD.define("Modifier.Numeric.Add", [ "Property.Number" ], function ModifierNumericAddFactory(NumberProperty) {
        return makeNumericModifier(NumberProperty, "+", function add(value) {
            return value + (this.canModify(value) ? this.value : 0);
        });
        // return class Add extends NumberProperty {
        //     constructor(name, amount, target) {
        //         super(name, "+", amount, target);
        //     }
        //
        //     modify(value) {
        //         return value + (this.canModify(value) ? this.value : 0);
        //     }
        // };
    }, true);

    DnD.define("Modifier.Numeric.Subtract", [ "Property.Number" ], function ModifierNumericSubtractFactory(NumberProperty) {
        return makeNumericModifier(NumberProperty, "-", function subtract(value) {
            return value + (this.canModify(value) ? this.value : 0);
        });
        // return class Subtract extends Numeric {
        //     constructor(name, amount, target) {
        //         super(name, "-", amount, target);
        //     }
        //
        //     modify(value) {
        //         return value - (this.canModify(value) ? this.value : 0);
        //     }
        // };
    }, true);

    DnD.define("Modifier.Numeric.Multiply", [ "Property.Number" ], function ModifierNumericMultiplyFactory(NumberProperty) {
        return makeNumericModifier(NumberProperty, "*", function multiply(value) {
            return value * (this.canModify(value) ? this.value : 0);
        });
        // return class Multiply extends Numeric {
        //     constructor(name, amount, target) {
        //         super(name, "*", amount, target);
        //     }
        //
        //     modify(value) {
        //         return value * (this.canModify(value) ? this.value : 1);
        //     }
        // };
    }, true);

    DnD.define("Modifier.Numeric.Divide", [ "Property.Number" ], function ModifierNumericDivideFactory(NumberProperty) {
        return makeNumericModifier(NumberProperty, "/", function divide(value) {
            if (this.value === 0) {
                throw "Can't divide by 0";
            }
            return value / (this.canModify(value) ? this.value : 0);
        });
        // return class Divide extends Numeric {
        //     constructor(name, amount, target) {
        //         if (amount === 0) {
        //             throw "Can't divide by 0";
        //         }
        //         super(name, "/", amount, target);
        //     }
        //
        //     modify(value) {
        //         return value / (this.canModify(value) ? this.value : 1);
        //     }
        // };
    }, true);

    DnD.define("Modifier.Numeric.Divide.Floor", [ "Modifier.Numeric.Divide" ], function ModifierNumericDivideFactory(Divide) {
        return class DivideFloor extends Divide {
            constructor(name, amount, target) {
                super(name, amount, target);
            }

            modify(value) {
                return window.Math.floor(super.modify(value));
            }
        };
    }, true);

})(window, window.DnD);
