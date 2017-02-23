/**
 * Created by nathanielblumberg on 2/12/17.
 */
(function NumericModifierIIFE(window, DnD) {
    "use strict";

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

    DnD.define("Modifier.Numeric.Add", [ "Property.Number" ], function ModifierNumericAddFactory(NumberProperty) {
        return makeNumericModifier(NumberProperty, "+", function add(value) {
            return value + (this.canModify(value) ? this.value : 0);
        });
    }, true);

    DnD.define("Modifier.Numeric.Subtract", [ "Property.Number" ], function ModifierNumericSubtractFactory(NumberProperty) {
        return makeNumericModifier(NumberProperty, "-", function subtract(value) {
            return value + (this.canModify(value) ? this.value : 0);
        });
    }, true);

    DnD.define("Modifier.Numeric.Multiply", [ "Property.Number" ], function ModifierNumericMultiplyFactory(NumberProperty) {
        return makeNumericModifier(NumberProperty, "*", function multiply(value) {
            return value * (this.canModify(value) ? this.value : 0);
        });
    }, true);

    DnD.define("Modifier.Numeric.Divide", [ "Property.Number" ], function ModifierNumericDivideFactory(NumberProperty) {
        return makeNumericModifier(NumberProperty, "/", function divide(value) {
            if (this.value === 0) {
                throw "Can't divide by 0";
            }
            return value / (this.canModify(value) ? this.value : 0);
        });
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
