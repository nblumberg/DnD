/**
 * Created by nathanielblumberg on 2/12/17.
 */
(function PropertyIIFE(window, DnD) {
    "use strict";

    /**
     * Gets a display description of the calculated value and how each Modifier contributed
     * @param {WeakMap} valuesForType The raw values for all instances of a given Property subclass
     * @param {WeakMap} modifiersForType The Modifier Arrays for all instances of a given Property subclass
     * @param {Property} property A Property instance
     * @returns {String} A display description of the calculated value and how each Modifier contributed
     */
    function getBreakdown(valuesForType, modifiersForType, property) {
        let value = valuesForType.get(property);
        let breakdown = `[${property.name}] ${property.value} = [${value} base]`;
        modifiersForType.get(property).forEach(function calculateBreakdown(modifier) {
            value = modifier.modify(value);
            breakdown += modifier.breakdown(value);
        });
        return breakdown;
    }

    /**
     * Gets the calculated value
     * @param {WeakMap} valuesForType The raw values for all instances of a given Property subclass
     * @param {WeakMap} modifiersForType The Modifier Arrays for all instances of a given Property subclass
     * @param {Property} property A Property instance
     * @returns {Base} The calculated value
     */
    function getCalculatedValue(valuesForType, modifiersForType, property) {
        let value = valuesForType.get(property);
        modifiersForType.get(property).forEach(function applyModifier(modifier) {
            value = modifier.modify(value);
        });
        return value;
    }

    /**
     * Add a Modifier to the Property
     * @param {WeakMap} modifiersForType The Modifier Arrays for all instances of a given Property subclass
     * @param {Property} property A Property instance
     * @param {Modifier} modifier A Modifier
     * @returns {Property} This Property, to allow chaining
     */
    function applyModifier(modifiersForType, property, modifier) {
        if (modifier && typeof modifier.addTo === "function") {
            modifiersForType.get(property).push(modifier);
        }
        return property;
    }

    /**
     * Removes a Modifier from the Property
     * @param {Modifier} modifier A Modifier
     * @returns {Property} This Property, to allow chaining
     */
    function extractModifier(modifiersForType, property, modifier) {
        let modifiers = modifiersForType.get(property);
        if (modifiers) {
            modifiers.splice(modifiers.indexOf(modifier), 1);
        }
        return property;
    }

    /**
     * Returns an Object with property value equal to the raw value, suitable for serialization
     * @param {WeakMap} valuesForType The raw values for all instances of a given Property subclass
     * @param {Property} property A Property instance
     * @returns {Object} An Object with property value equal to the raw value
     */
    function generateRaw(valuesForType, property) {
        let o = Object.assign({}, property);
        o.value = valuesForType.get(property);
        return o;
    }

    function makeProperty(Base, defaultValue) {
        // A WeakMap from instances of this Property subclass to their raw values
        let _values = new WeakMap();
        let _getValue = _values.get.bind(_values);
        let _setValue = _values.set.bind(_values);
        // A WeakMap from instance of this Property subclass to an Array of their Modifier instances
        let _modifiers = new WeakMap();
        let _getModifiers = _modifiers.get.bind(_modifiers);
        let _setModifiers = _modifiers.set.bind(_modifiers);

        return class Property extends Base {
            constructor(name, initialValue) {
                super(initialValue || defaultValue);
                _setModifiers(this, []);
                let typeName;
                switch (Base) {
                    case Boolean:
                    case Number:
                    case String:
                        typeName = `${Base.name.toLowerCase()}`;
                        this.type = typeName;
                        break;
                    default:
                        typeName = `${Base.name}`;
                        this.type = Base;
                        break;
                }
                this.name = name || `Unknown ${typeName} Property`;
                this.value = typeof initialValue === "undefined" ? defaultValue : initialValue;
            }

            /**
             * Gets a display description of the calculated value and how each Modifier contributed
             * @returns {String} A display description of the calculated value and how each Modifier contributed
             */
            get breakdown() {
                return getBreakdown(_values, _modifiers, this);
            }

            /**
             * Gets the calculated value
             * @returns {Base} The calculated value
             */
            get value() {
                return getCalculatedValue(_values, _modifiers, this);
            }

            /**
             * Sets the raw value
             * @param {Base} value The raw value
             */
            set value(value) {
                _values.set(this, value);
            }

            /**
             * Add a Modifier to the Property
             * @param {Modifier} modifier A Modifier
             * @returns {Property} This Property, to allow chaining
             */
            addModifier(modifier) {
                return applyModifier(_modifiers, this, modifier);
            }

            /**
             * Removes a Modifier from the Property
             * @param {Modifier} modifier A Modifier
             * @returns {Property} This Property, to allow chaining
             */
            removeModifier(modifier) {
                return extractModifier(_modifiers, this, modifier);
            }

            /**
             * Gets the calculated value
             * @returns {Base} The calculated value
             */
            valueOf() {
                return this.value;
            }

            /**
             * Returns an Object with property value equal to the raw value, suitable for serialization
             * @returns {Object} An Object with property value equal to the raw value
             */
            raw() {
                return generateRaw(_values, this);
            }
        };

    }

    DnD.define("Property.Object", [], () => {
        return makeProperty(Object, {});
    }, true);

    DnD.define("Property.Boolean", [], () => {
        return makeProperty(Boolean, false);
    }, true);

    DnD.define("Property.Date", [], () => {
        return makeProperty(Date, window.Date.now());
    }, true);

    DnD.define("Property.Number", [], () => {
        return makeProperty(Number, 0);
    }, true);

    DnD.define("Property.String", [], () => {
        return makeProperty(String, "");
    }, true);

    DnD.define("Property.Array", [], () => {
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

            constructor(name, ...initialValues) {
                super();
                let proxy;
                _setModifiers(this, []);
                this.name = name;
                this.type = Array.name;

                if (initialValues) {
                    if (initialValues.length === 1 && initialValues[ 0 ].constructor === Array) {
                        // If the just passed in an Array, assume it contains all the initial values and destructure it
                        this.push(...initialValues[ 0 ]);
                    }
                    else {
                        // Otherwise assume each argument is intended as a member of the Array
                        this.push(...initialValues);
                    }
                }

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

})(window, window.DnD);
