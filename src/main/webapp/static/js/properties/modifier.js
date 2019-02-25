/**
 * Created by nathanielblumberg on 2/12/17.
 */
(function ModifierIIFE(window, DnD) {
    "use strict";

    function makeModifier(Base, operator, modify, defaultValue) {
        return class Modifier extends Base {
            constructor(name, initialValue, target) {
                super(name, initialValue);
                this.operator = operator;
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
                if (typeof value === "object" && typeof this.type !== "string") {
                    return value instanceof this.type;
                }
                return typeof value === this.type.toLowerCase();
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
                return ` [${this.operator} ${this.value} ${this.name}]`;
            }
        };
    }

    DnD.define("Modifier.Substitute", [ "Property.Object" ], (ObjectProperty) => {
        let Clazz = makeModifier(ObjectProperty, "=", function substitute(value) {
            return this.value;
        });
        return class Substitute extends Clazz {
            constructor(name, value, target) {
                super(name, value, target);
            }

            addTo(property) {
                property.addModifier(this);
                this.target = property;
            }

            canModify(value) {
                return true;
            }
        };
    }, true);

    DnD.define("Modifier.Boolean.Not", [ "Property.Boolean" ], (BooleanProperty) => {
        return makeModifier(BooleanProperty, "!", function not(value) {
            if (this.canModify(value)) {
                return !value;
            }
            return value;
        });
    }, true);

    DnD.define("Modifier.Boolean.And", [ "Property.Boolean" ], (BooleanProperty) => {
        return makeModifier(BooleanProperty, "&&", function and(value) {
            if (this.canModify(value)) {
                return value && this.value;
            }
            return value;
        });
    }, true);

    DnD.define("Modifier.Boolean.Or", [ "Property.Boolean" ], (BooleanProperty) => {
        return makeModifier(BooleanProperty, "||", function or(value) {
            if (this.canModify(value)) {
                return value || this.value;
            }
            return value;
        });
    }, true);

    DnD.define("Modifier.Boolean.Xor", [ "Property.Boolean" ], (BooleanProperty) => {
        return makeModifier(BooleanProperty, "XOR", function xor(value) {
            if (this.canModify(value)) {
                return value ? !this.value : this.value;
            }
            return value;
        });
    }, true);


    DnD.define("Modifier.Numeric.Add", [ "Property.Number" ], (NumberProperty) => {
        return makeModifier(NumberProperty, "+", function add(value) {
            return value + (this.canModify(value) ? this.value : 0);
        });
    }, true);

    DnD.define("Modifier.Numeric.Subtract", [ "Property.Number" ], (NumberProperty) => {
        return makeModifier(NumberProperty, "-", function subtract(value) {
            return value - (this.canModify(value) ? this.value : 0);
        });
    }, true);

    DnD.define("Modifier.Numeric.Multiply", [ "Property.Number" ], (NumberProperty) => {
        return makeModifier(NumberProperty, "*", function multiply(value) {
            return value * (this.canModify(value) ? this.value : 1);
        });
    }, true);

    DnD.define("Modifier.Numeric.Divide", [ "Property.Number" ], (NumberProperty) => {
        return makeModifier(NumberProperty, "/", function divide(value) {
            if (this.value === 0) {
                throw new window.Error("Can't divide by 0");
            }
            return value / (this.canModify(value) ? this.value : 1);
        });
    }, true);

    DnD.define("Modifier.Numeric.Divide.Floor", [ "Modifier.Numeric.Divide" ], (Divide) => {
        return class DivideFloor extends Divide {
            constructor(name, amount, target) {
                super(name, amount, target);
                this.operator = "/_";
            }

            modify(value) {
                return window.Math.floor(super.modify(value));
            }
        };
    }, true);


    DnD.define("Modifier.String.Append", [ "Property.String" ], (StringProperty) => {
        return makeModifier(StringProperty, "+", function append(value) {
            return value + (this.canModify(value) ? this.value : "");
        });
    }, true);

    DnD.define("Modifier.String.Prepend", [ "Property.String" ], (StringProperty) => {
        return makeModifier(StringProperty, "_+", function prepend(value) {
            return (this.canModify(value) ? this.value : "") + value;
        });
    }, true);

    DnD.define("Modifier.String.Replace", [ "Property.String" ], (StringProperty) => {
        let Clazz = makeModifier(StringProperty, "{}", function replace(value) {
            if (this.canModify(value)) {
                return value.replace(this.expression, this.value);
            }
            return value;
        });
        return class StringReplace extends Clazz {
            constructor(name, expression, value, target) {
                super(name, value, target);
                this.expression = expression;
            }
        };
    }, true);
})(window, window.DnD);
