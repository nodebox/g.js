// Generic JavaScript utility methods

'use strict';

// Define a property that serves as an alias for another property.
exports.defineAlias = function (cls, origProperty, newProperty) {
    Object.defineProperty(cls.prototype, newProperty, {
        get: function () {
            return this[origProperty];
        },

        set: function (v) {
            this[origProperty] = v;
        }
    });
};

// Define a property on the class prototype that has a single getter function.
exports.defineGetter = function (cls, property, getterFn) {
    Object.defineProperty(cls.prototype, property, {
        get: getterFn
    });
};
