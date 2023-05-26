// Generic JavaScript utility methods

// Define a property that serves as an alias for another property.
export function defineAlias(cls, origProperty, newProperty) {
  Object.defineProperty(cls.prototype, newProperty, {
    get: function () {
      return this[origProperty];
    },

    set: function (v) {
      this[origProperty] = v;
    },
  });
}

// Define a property on the class prototype that has a single getter function.
export function defineGetter(cls, property, getterFn) {
  Object.defineProperty(cls.prototype, property, {
    get: getterFn,
  });
}
