(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.g = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (process,global){
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (factory((global.async = global.async || {})));
}(this, (function (exports) { 'use strict';

/**
 * A faster alternative to `Function#apply`, this function invokes `func`
 * with the `this` binding of `thisArg` and the arguments of `args`.
 *
 * @private
 * @param {Function} func The function to invoke.
 * @param {*} thisArg The `this` binding of `func`.
 * @param {Array} args The arguments to invoke `func` with.
 * @returns {*} Returns the result of `func`.
 */
function apply(func, thisArg, args) {
  switch (args.length) {
    case 0: return func.call(thisArg);
    case 1: return func.call(thisArg, args[0]);
    case 2: return func.call(thisArg, args[0], args[1]);
    case 3: return func.call(thisArg, args[0], args[1], args[2]);
  }
  return func.apply(thisArg, args);
}

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max;

/**
 * A specialized version of `baseRest` which transforms the rest array.
 *
 * @private
 * @param {Function} func The function to apply a rest parameter to.
 * @param {number} [start=func.length-1] The start position of the rest parameter.
 * @param {Function} transform The rest array transform.
 * @returns {Function} Returns the new function.
 */
function overRest$1(func, start, transform) {
  start = nativeMax(start === undefined ? (func.length - 1) : start, 0);
  return function() {
    var args = arguments,
        index = -1,
        length = nativeMax(args.length - start, 0),
        array = Array(length);

    while (++index < length) {
      array[index] = args[start + index];
    }
    index = -1;
    var otherArgs = Array(start + 1);
    while (++index < start) {
      otherArgs[index] = args[index];
    }
    otherArgs[start] = transform(array);
    return apply(func, this, otherArgs);
  };
}

/**
 * This method returns the first argument it receives.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Util
 * @param {*} value Any value.
 * @returns {*} Returns `value`.
 * @example
 *
 * var object = { 'a': 1 };
 *
 * console.log(_.identity(object) === object);
 * // => true
 */
function identity(value) {
  return value;
}

// Lodash rest function without function.toString()
// remappings
function rest(func, start) {
    return overRest$1(func, start, identity);
}

var initialParams = function (fn) {
    return rest(function (args /*..., callback*/) {
        var callback = args.pop();
        fn.call(this, args, callback);
    });
};

function applyEach$1(eachfn) {
    return rest(function (fns, args) {
        var go = initialParams(function (args, callback) {
            var that = this;
            return eachfn(fns, function (fn, cb) {
                fn.apply(that, args.concat([cb]));
            }, callback);
        });
        if (args.length) {
            return go.apply(this, args);
        } else {
            return go;
        }
    });
}

/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

/** Built-in value references. */
var Symbol$1 = root.Symbol;

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/** Built-in value references. */
var symToStringTag$1 = Symbol$1 ? Symbol$1.toStringTag : undefined;

/**
 * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the raw `toStringTag`.
 */
function getRawTag(value) {
  var isOwn = hasOwnProperty.call(value, symToStringTag$1),
      tag = value[symToStringTag$1];

  try {
    value[symToStringTag$1] = undefined;
    var unmasked = true;
  } catch (e) {}

  var result = nativeObjectToString.call(value);
  if (unmasked) {
    if (isOwn) {
      value[symToStringTag$1] = tag;
    } else {
      delete value[symToStringTag$1];
    }
  }
  return result;
}

/** Used for built-in method references. */
var objectProto$1 = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString$1 = objectProto$1.toString;

/**
 * Converts `value` to a string using `Object.prototype.toString`.
 *
 * @private
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 */
function objectToString(value) {
  return nativeObjectToString$1.call(value);
}

/** `Object#toString` result references. */
var nullTag = '[object Null]';
var undefinedTag = '[object Undefined]';

/** Built-in value references. */
var symToStringTag = Symbol$1 ? Symbol$1.toStringTag : undefined;

/**
 * The base implementation of `getTag` without fallbacks for buggy environments.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
function baseGetTag(value) {
  if (value == null) {
    return value === undefined ? undefinedTag : nullTag;
  }
  value = Object(value);
  return (symToStringTag && symToStringTag in value)
    ? getRawTag(value)
    : objectToString(value);
}

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return value != null && (type == 'object' || type == 'function');
}

/** `Object#toString` result references. */
var asyncTag = '[object AsyncFunction]';
var funcTag = '[object Function]';
var genTag = '[object GeneratorFunction]';
var proxyTag = '[object Proxy]';

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  if (!isObject(value)) {
    return false;
  }
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 9 which returns 'object' for typed arrays and other constructors.
  var tag = baseGetTag(value);
  return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
}

/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER = 9007199254740991;

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This method is loosely based on
 * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 * @example
 *
 * _.isLength(3);
 * // => true
 *
 * _.isLength(Number.MIN_VALUE);
 * // => false
 *
 * _.isLength(Infinity);
 * // => false
 *
 * _.isLength('3');
 * // => false
 */
function isLength(value) {
  return typeof value == 'number' &&
    value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}

/**
 * Checks if `value` is array-like. A value is considered array-like if it's
 * not a function and has a `value.length` that's an integer greater than or
 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
 * @example
 *
 * _.isArrayLike([1, 2, 3]);
 * // => true
 *
 * _.isArrayLike(document.body.children);
 * // => true
 *
 * _.isArrayLike('abc');
 * // => true
 *
 * _.isArrayLike(_.noop);
 * // => false
 */
function isArrayLike(value) {
  return value != null && isLength(value.length) && !isFunction(value);
}

/**
 * This method returns `undefined`.
 *
 * @static
 * @memberOf _
 * @since 2.3.0
 * @category Util
 * @example
 *
 * _.times(2, _.noop);
 * // => [undefined, undefined]
 */
function noop() {
  // No operation performed.
}

function once(fn) {
    return function () {
        if (fn === null) return;
        var callFn = fn;
        fn = null;
        callFn.apply(this, arguments);
    };
}

var iteratorSymbol = typeof Symbol === 'function' && Symbol.iterator;

var getIterator = function (coll) {
    return iteratorSymbol && coll[iteratorSymbol] && coll[iteratorSymbol]();
};

/**
 * The base implementation of `_.times` without support for iteratee shorthands
 * or max array length checks.
 *
 * @private
 * @param {number} n The number of times to invoke `iteratee`.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the array of results.
 */
function baseTimes(n, iteratee) {
  var index = -1,
      result = Array(n);

  while (++index < n) {
    result[index] = iteratee(index);
  }
  return result;
}

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return value != null && typeof value == 'object';
}

/** `Object#toString` result references. */
var argsTag = '[object Arguments]';

/**
 * The base implementation of `_.isArguments`.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 */
function baseIsArguments(value) {
  return isObjectLike(value) && baseGetTag(value) == argsTag;
}

/** Used for built-in method references. */
var objectProto$3 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$2 = objectProto$3.hasOwnProperty;

/** Built-in value references. */
var propertyIsEnumerable = objectProto$3.propertyIsEnumerable;

/**
 * Checks if `value` is likely an `arguments` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 *  else `false`.
 * @example
 *
 * _.isArguments(function() { return arguments; }());
 * // => true
 *
 * _.isArguments([1, 2, 3]);
 * // => false
 */
var isArguments = baseIsArguments(function() { return arguments; }()) ? baseIsArguments : function(value) {
  return isObjectLike(value) && hasOwnProperty$2.call(value, 'callee') &&
    !propertyIsEnumerable.call(value, 'callee');
};

/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */
var isArray = Array.isArray;

/**
 * This method returns `false`.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {boolean} Returns `false`.
 * @example
 *
 * _.times(2, _.stubFalse);
 * // => [false, false]
 */
function stubFalse() {
  return false;
}

/** Detect free variable `exports`. */
var freeExports = typeof exports == 'object' && exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && typeof module == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/** Built-in value references. */
var Buffer = moduleExports ? root.Buffer : undefined;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined;

/**
 * Checks if `value` is a buffer.
 *
 * @static
 * @memberOf _
 * @since 4.3.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a buffer, else `false`.
 * @example
 *
 * _.isBuffer(new Buffer(2));
 * // => true
 *
 * _.isBuffer(new Uint8Array(2));
 * // => false
 */
var isBuffer = nativeIsBuffer || stubFalse;

/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER$1 = 9007199254740991;

/** Used to detect unsigned integer values. */
var reIsUint = /^(?:0|[1-9]\d*)$/;

/**
 * Checks if `value` is a valid array-like index.
 *
 * @private
 * @param {*} value The value to check.
 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
 */
function isIndex(value, length) {
  length = length == null ? MAX_SAFE_INTEGER$1 : length;
  return !!length &&
    (typeof value == 'number' || reIsUint.test(value)) &&
    (value > -1 && value % 1 == 0 && value < length);
}

/** `Object#toString` result references. */
var argsTag$1 = '[object Arguments]';
var arrayTag = '[object Array]';
var boolTag = '[object Boolean]';
var dateTag = '[object Date]';
var errorTag = '[object Error]';
var funcTag$1 = '[object Function]';
var mapTag = '[object Map]';
var numberTag = '[object Number]';
var objectTag = '[object Object]';
var regexpTag = '[object RegExp]';
var setTag = '[object Set]';
var stringTag = '[object String]';
var weakMapTag = '[object WeakMap]';

var arrayBufferTag = '[object ArrayBuffer]';
var dataViewTag = '[object DataView]';
var float32Tag = '[object Float32Array]';
var float64Tag = '[object Float64Array]';
var int8Tag = '[object Int8Array]';
var int16Tag = '[object Int16Array]';
var int32Tag = '[object Int32Array]';
var uint8Tag = '[object Uint8Array]';
var uint8ClampedTag = '[object Uint8ClampedArray]';
var uint16Tag = '[object Uint16Array]';
var uint32Tag = '[object Uint32Array]';

/** Used to identify `toStringTag` values of typed arrays. */
var typedArrayTags = {};
typedArrayTags[float32Tag] = typedArrayTags[float64Tag] =
typedArrayTags[int8Tag] = typedArrayTags[int16Tag] =
typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] =
typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] =
typedArrayTags[uint32Tag] = true;
typedArrayTags[argsTag$1] = typedArrayTags[arrayTag] =
typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] =
typedArrayTags[dataViewTag] = typedArrayTags[dateTag] =
typedArrayTags[errorTag] = typedArrayTags[funcTag$1] =
typedArrayTags[mapTag] = typedArrayTags[numberTag] =
typedArrayTags[objectTag] = typedArrayTags[regexpTag] =
typedArrayTags[setTag] = typedArrayTags[stringTag] =
typedArrayTags[weakMapTag] = false;

/**
 * The base implementation of `_.isTypedArray` without Node.js optimizations.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 */
function baseIsTypedArray(value) {
  return isObjectLike(value) &&
    isLength(value.length) && !!typedArrayTags[baseGetTag(value)];
}

/**
 * The base implementation of `_.unary` without support for storing metadata.
 *
 * @private
 * @param {Function} func The function to cap arguments for.
 * @returns {Function} Returns the new capped function.
 */
function baseUnary(func) {
  return function(value) {
    return func(value);
  };
}

/** Detect free variable `exports`. */
var freeExports$1 = typeof exports == 'object' && exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule$1 = freeExports$1 && typeof module == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports$1 = freeModule$1 && freeModule$1.exports === freeExports$1;

/** Detect free variable `process` from Node.js. */
var freeProcess = moduleExports$1 && freeGlobal.process;

/** Used to access faster Node.js helpers. */
var nodeUtil = (function() {
  try {
    return freeProcess && freeProcess.binding('util');
  } catch (e) {}
}());

/* Node.js helper references. */
var nodeIsTypedArray = nodeUtil && nodeUtil.isTypedArray;

/**
 * Checks if `value` is classified as a typed array.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 * @example
 *
 * _.isTypedArray(new Uint8Array);
 * // => true
 *
 * _.isTypedArray([]);
 * // => false
 */
var isTypedArray = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray;

/** Used for built-in method references. */
var objectProto$2 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$1 = objectProto$2.hasOwnProperty;

/**
 * Creates an array of the enumerable property names of the array-like `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @param {boolean} inherited Specify returning inherited property names.
 * @returns {Array} Returns the array of property names.
 */
function arrayLikeKeys(value, inherited) {
  var isArr = isArray(value),
      isArg = !isArr && isArguments(value),
      isBuff = !isArr && !isArg && isBuffer(value),
      isType = !isArr && !isArg && !isBuff && isTypedArray(value),
      skipIndexes = isArr || isArg || isBuff || isType,
      result = skipIndexes ? baseTimes(value.length, String) : [],
      length = result.length;

  for (var key in value) {
    if ((inherited || hasOwnProperty$1.call(value, key)) &&
        !(skipIndexes && (
           // Safari 9 has enumerable `arguments.length` in strict mode.
           key == 'length' ||
           // Node.js 0.10 has enumerable non-index properties on buffers.
           (isBuff && (key == 'offset' || key == 'parent')) ||
           // PhantomJS 2 has enumerable non-index properties on typed arrays.
           (isType && (key == 'buffer' || key == 'byteLength' || key == 'byteOffset')) ||
           // Skip index properties.
           isIndex(key, length)
        ))) {
      result.push(key);
    }
  }
  return result;
}

/** Used for built-in method references. */
var objectProto$5 = Object.prototype;

/**
 * Checks if `value` is likely a prototype object.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
 */
function isPrototype(value) {
  var Ctor = value && value.constructor,
      proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto$5;

  return value === proto;
}

/**
 * Creates a unary function that invokes `func` with its argument transformed.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {Function} transform The argument transform.
 * @returns {Function} Returns the new function.
 */
function overArg(func, transform) {
  return function(arg) {
    return func(transform(arg));
  };
}

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeKeys = overArg(Object.keys, Object);

/** Used for built-in method references. */
var objectProto$4 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$3 = objectProto$4.hasOwnProperty;

/**
 * The base implementation of `_.keys` which doesn't treat sparse arrays as dense.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function baseKeys(object) {
  if (!isPrototype(object)) {
    return nativeKeys(object);
  }
  var result = [];
  for (var key in Object(object)) {
    if (hasOwnProperty$3.call(object, key) && key != 'constructor') {
      result.push(key);
    }
  }
  return result;
}

/**
 * Creates an array of the own enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects. See the
 * [ES spec](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
 * for more details.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keys(new Foo);
 * // => ['a', 'b'] (iteration order is not guaranteed)
 *
 * _.keys('hi');
 * // => ['0', '1']
 */
function keys(object) {
  return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
}

function createArrayIterator(coll) {
    var i = -1;
    var len = coll.length;
    return function next() {
        return ++i < len ? { value: coll[i], key: i } : null;
    };
}

function createES2015Iterator(iterator) {
    var i = -1;
    return function next() {
        var item = iterator.next();
        if (item.done) return null;
        i++;
        return { value: item.value, key: i };
    };
}

function createObjectIterator(obj) {
    var okeys = keys(obj);
    var i = -1;
    var len = okeys.length;
    return function next() {
        var key = okeys[++i];
        return i < len ? { value: obj[key], key: key } : null;
    };
}

function iterator(coll) {
    if (isArrayLike(coll)) {
        return createArrayIterator(coll);
    }

    var iterator = getIterator(coll);
    return iterator ? createES2015Iterator(iterator) : createObjectIterator(coll);
}

function onlyOnce(fn) {
    return function () {
        if (fn === null) throw new Error("Callback was already called.");
        var callFn = fn;
        fn = null;
        callFn.apply(this, arguments);
    };
}

// A temporary value used to identify if the loop should be broken.
// See #1064, #1293
var breakLoop = {};

function _eachOfLimit(limit) {
    return function (obj, iteratee, callback) {
        callback = once(callback || noop);
        if (limit <= 0 || !obj) {
            return callback(null);
        }
        var nextElem = iterator(obj);
        var done = false;
        var running = 0;

        function iterateeCallback(err, value) {
            running -= 1;
            if (err) {
                done = true;
                callback(err);
            } else if (value === breakLoop || done && running <= 0) {
                done = true;
                return callback(null);
            } else {
                replenish();
            }
        }

        function replenish() {
            while (running < limit && !done) {
                var elem = nextElem();
                if (elem === null) {
                    done = true;
                    if (running <= 0) {
                        callback(null);
                    }
                    return;
                }
                running += 1;
                iteratee(elem.value, elem.key, onlyOnce(iterateeCallback));
            }
        }

        replenish();
    };
}

/**
 * The same as [`eachOf`]{@link module:Collections.eachOf} but runs a maximum of `limit` async operations at a
 * time.
 *
 * @name eachOfLimit
 * @static
 * @memberOf module:Collections
 * @method
 * @see [async.eachOf]{@link module:Collections.eachOf}
 * @alias forEachOfLimit
 * @category Collection
 * @param {Array|Iterable|Object} coll - A collection to iterate over.
 * @param {number} limit - The maximum number of async operations at a time.
 * @param {Function} iteratee - A function to apply to each
 * item in `coll`. The `key` is the item's key, or index in the case of an
 * array. The iteratee is passed a `callback(err)` which must be called once it
 * has completed. If no error has occurred, the callback should be run without
 * arguments or with an explicit `null` argument. Invoked with
 * (item, key, callback).
 * @param {Function} [callback] - A callback which is called when all
 * `iteratee` functions have finished, or an error occurs. Invoked with (err).
 */
function eachOfLimit(coll, limit, iteratee, callback) {
  _eachOfLimit(limit)(coll, iteratee, callback);
}

function doLimit(fn, limit) {
    return function (iterable, iteratee, callback) {
        return fn(iterable, limit, iteratee, callback);
    };
}

// eachOf implementation optimized for array-likes
function eachOfArrayLike(coll, iteratee, callback) {
    callback = once(callback || noop);
    var index = 0,
        completed = 0,
        length = coll.length;
    if (length === 0) {
        callback(null);
    }

    function iteratorCallback(err) {
        if (err) {
            callback(err);
        } else if (++completed === length) {
            callback(null);
        }
    }

    for (; index < length; index++) {
        iteratee(coll[index], index, onlyOnce(iteratorCallback));
    }
}

// a generic version of eachOf which can handle array, object, and iterator cases.
var eachOfGeneric = doLimit(eachOfLimit, Infinity);

/**
 * Like [`each`]{@link module:Collections.each}, except that it passes the key (or index) as the second argument
 * to the iteratee.
 *
 * @name eachOf
 * @static
 * @memberOf module:Collections
 * @method
 * @alias forEachOf
 * @category Collection
 * @see [async.each]{@link module:Collections.each}
 * @param {Array|Iterable|Object} coll - A collection to iterate over.
 * @param {Function} iteratee - A function to apply to each
 * item in `coll`. The `key` is the item's key, or index in the case of an
 * array. The iteratee is passed a `callback(err)` which must be called once it
 * has completed. If no error has occurred, the callback should be run without
 * arguments or with an explicit `null` argument. Invoked with
 * (item, key, callback).
 * @param {Function} [callback] - A callback which is called when all
 * `iteratee` functions have finished, or an error occurs. Invoked with (err).
 * @example
 *
 * var obj = {dev: "/dev.json", test: "/test.json", prod: "/prod.json"};
 * var configs = {};
 *
 * async.forEachOf(obj, function (value, key, callback) {
 *     fs.readFile(__dirname + value, "utf8", function (err, data) {
 *         if (err) return callback(err);
 *         try {
 *             configs[key] = JSON.parse(data);
 *         } catch (e) {
 *             return callback(e);
 *         }
 *         callback();
 *     });
 * }, function (err) {
 *     if (err) console.error(err.message);
 *     // configs is now a map of JSON data
 *     doSomethingWith(configs);
 * });
 */
var eachOf = function (coll, iteratee, callback) {
    var eachOfImplementation = isArrayLike(coll) ? eachOfArrayLike : eachOfGeneric;
    eachOfImplementation(coll, iteratee, callback);
};

function doParallel(fn) {
    return function (obj, iteratee, callback) {
        return fn(eachOf, obj, iteratee, callback);
    };
}

function _asyncMap(eachfn, arr, iteratee, callback) {
    callback = callback || noop;
    arr = arr || [];
    var results = [];
    var counter = 0;

    eachfn(arr, function (value, _, callback) {
        var index = counter++;
        iteratee(value, function (err, v) {
            results[index] = v;
            callback(err);
        });
    }, function (err) {
        callback(err, results);
    });
}

/**
 * Produces a new collection of values by mapping each value in `coll` through
 * the `iteratee` function. The `iteratee` is called with an item from `coll`
 * and a callback for when it has finished processing. Each of these callback
 * takes 2 arguments: an `error`, and the transformed item from `coll`. If
 * `iteratee` passes an error to its callback, the main `callback` (for the
 * `map` function) is immediately called with the error.
 *
 * Note, that since this function applies the `iteratee` to each item in
 * parallel, there is no guarantee that the `iteratee` functions will complete
 * in order. However, the results array will be in the same order as the
 * original `coll`.
 *
 * If `map` is passed an Object, the results will be an Array.  The results
 * will roughly be in the order of the original Objects' keys (but this can
 * vary across JavaScript engines)
 *
 * @name map
 * @static
 * @memberOf module:Collections
 * @method
 * @category Collection
 * @param {Array|Iterable|Object} coll - A collection to iterate over.
 * @param {Function} iteratee - A function to apply to each item in `coll`.
 * The iteratee is passed a `callback(err, transformed)` which must be called
 * once it has completed with an error (which can be `null`) and a
 * transformed item. Invoked with (item, callback).
 * @param {Function} [callback] - A callback which is called when all `iteratee`
 * functions have finished, or an error occurs. Results is an Array of the
 * transformed items from the `coll`. Invoked with (err, results).
 * @example
 *
 * async.map(['file1','file2','file3'], fs.stat, function(err, results) {
 *     // results is now an array of stats for each file
 * });
 */
var map = doParallel(_asyncMap);

/**
 * Applies the provided arguments to each function in the array, calling
 * `callback` after all functions have completed. If you only provide the first
 * argument, `fns`, then it will return a function which lets you pass in the
 * arguments as if it were a single function call. If more arguments are
 * provided, `callback` is required while `args` is still optional.
 *
 * @name applyEach
 * @static
 * @memberOf module:ControlFlow
 * @method
 * @category Control Flow
 * @param {Array|Iterable|Object} fns - A collection of asynchronous functions
 * to all call with the same arguments
 * @param {...*} [args] - any number of separate arguments to pass to the
 * function.
 * @param {Function} [callback] - the final argument should be the callback,
 * called when all functions have completed processing.
 * @returns {Function} - If only the first argument, `fns`, is provided, it will
 * return a function which lets you pass in the arguments as if it were a single
 * function call. The signature is `(..args, callback)`. If invoked with any
 * arguments, `callback` is required.
 * @example
 *
 * async.applyEach([enableSearch, updateSchema], 'bucket', callback);
 *
 * // partial application example:
 * async.each(
 *     buckets,
 *     async.applyEach([enableSearch, updateSchema]),
 *     callback
 * );
 */
var applyEach = applyEach$1(map);

function doParallelLimit(fn) {
    return function (obj, limit, iteratee, callback) {
        return fn(_eachOfLimit(limit), obj, iteratee, callback);
    };
}

/**
 * The same as [`map`]{@link module:Collections.map} but runs a maximum of `limit` async operations at a time.
 *
 * @name mapLimit
 * @static
 * @memberOf module:Collections
 * @method
 * @see [async.map]{@link module:Collections.map}
 * @category Collection
 * @param {Array|Iterable|Object} coll - A collection to iterate over.
 * @param {number} limit - The maximum number of async operations at a time.
 * @param {Function} iteratee - A function to apply to each item in `coll`.
 * The iteratee is passed a `callback(err, transformed)` which must be called
 * once it has completed with an error (which can be `null`) and a transformed
 * item. Invoked with (item, callback).
 * @param {Function} [callback] - A callback which is called when all `iteratee`
 * functions have finished, or an error occurs. Results is an array of the
 * transformed items from the `coll`. Invoked with (err, results).
 */
var mapLimit = doParallelLimit(_asyncMap);

/**
 * The same as [`map`]{@link module:Collections.map} but runs only a single async operation at a time.
 *
 * @name mapSeries
 * @static
 * @memberOf module:Collections
 * @method
 * @see [async.map]{@link module:Collections.map}
 * @category Collection
 * @param {Array|Iterable|Object} coll - A collection to iterate over.
 * @param {Function} iteratee - A function to apply to each item in `coll`.
 * The iteratee is passed a `callback(err, transformed)` which must be called
 * once it has completed with an error (which can be `null`) and a
 * transformed item. Invoked with (item, callback).
 * @param {Function} [callback] - A callback which is called when all `iteratee`
 * functions have finished, or an error occurs. Results is an array of the
 * transformed items from the `coll`. Invoked with (err, results).
 */
var mapSeries = doLimit(mapLimit, 1);

/**
 * The same as [`applyEach`]{@link module:ControlFlow.applyEach} but runs only a single async operation at a time.
 *
 * @name applyEachSeries
 * @static
 * @memberOf module:ControlFlow
 * @method
 * @see [async.applyEach]{@link module:ControlFlow.applyEach}
 * @category Control Flow
 * @param {Array|Iterable|Object} fns - A collection of asynchronous functions to all
 * call with the same arguments
 * @param {...*} [args] - any number of separate arguments to pass to the
 * function.
 * @param {Function} [callback] - the final argument should be the callback,
 * called when all functions have completed processing.
 * @returns {Function} - If only the first argument is provided, it will return
 * a function which lets you pass in the arguments as if it were a single
 * function call.
 */
var applyEachSeries = applyEach$1(mapSeries);

/**
 * Creates a continuation function with some arguments already applied.
 *
 * Useful as a shorthand when combined with other control flow functions. Any
 * arguments passed to the returned function are added to the arguments
 * originally passed to apply.
 *
 * @name apply
 * @static
 * @memberOf module:Utils
 * @method
 * @category Util
 * @param {Function} function - The function you want to eventually apply all
 * arguments to. Invokes with (arguments...).
 * @param {...*} arguments... - Any number of arguments to automatically apply
 * when the continuation is called.
 * @example
 *
 * // using apply
 * async.parallel([
 *     async.apply(fs.writeFile, 'testfile1', 'test1'),
 *     async.apply(fs.writeFile, 'testfile2', 'test2')
 * ]);
 *
 *
 * // the same process without using apply
 * async.parallel([
 *     function(callback) {
 *         fs.writeFile('testfile1', 'test1', callback);
 *     },
 *     function(callback) {
 *         fs.writeFile('testfile2', 'test2', callback);
 *     }
 * ]);
 *
 * // It's possible to pass any number of additional arguments when calling the
 * // continuation:
 *
 * node> var fn = async.apply(sys.puts, 'one');
 * node> fn('two', 'three');
 * one
 * two
 * three
 */
var apply$2 = rest(function (fn, args) {
    return rest(function (callArgs) {
        return fn.apply(null, args.concat(callArgs));
    });
});

/**
 * Take a sync function and make it async, passing its return value to a
 * callback. This is useful for plugging sync functions into a waterfall,
 * series, or other async functions. Any arguments passed to the generated
 * function will be passed to the wrapped function (except for the final
 * callback argument). Errors thrown will be passed to the callback.
 *
 * If the function passed to `asyncify` returns a Promise, that promises's
 * resolved/rejected state will be used to call the callback, rather than simply
 * the synchronous return value.
 *
 * This also means you can asyncify ES2016 `async` functions.
 *
 * @name asyncify
 * @static
 * @memberOf module:Utils
 * @method
 * @alias wrapSync
 * @category Util
 * @param {Function} func - The synchronous function to convert to an
 * asynchronous function.
 * @returns {Function} An asynchronous wrapper of the `func`. To be invoked with
 * (callback).
 * @example
 *
 * // passing a regular synchronous function
 * async.waterfall([
 *     async.apply(fs.readFile, filename, "utf8"),
 *     async.asyncify(JSON.parse),
 *     function (data, next) {
 *         // data is the result of parsing the text.
 *         // If there was a parsing error, it would have been caught.
 *     }
 * ], callback);
 *
 * // passing a function returning a promise
 * async.waterfall([
 *     async.apply(fs.readFile, filename, "utf8"),
 *     async.asyncify(function (contents) {
 *         return db.model.create(contents);
 *     }),
 *     function (model, next) {
 *         // `model` is the instantiated model object.
 *         // If there was an error, this function would be skipped.
 *     }
 * ], callback);
 *
 * // es6 example
 * var q = async.queue(async.asyncify(async function(file) {
 *     var intermediateStep = await processFile(file);
 *     return await somePromise(intermediateStep)
 * }));
 *
 * q.push(files);
 */
function asyncify(func) {
    return initialParams(function (args, callback) {
        var result;
        try {
            result = func.apply(this, args);
        } catch (e) {
            return callback(e);
        }
        // if result is Promise object
        if (isObject(result) && typeof result.then === 'function') {
            result.then(function (value) {
                callback(null, value);
            }, function (err) {
                callback(err.message ? err : new Error(err));
            });
        } else {
            callback(null, result);
        }
    });
}

/**
 * A specialized version of `_.forEach` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns `array`.
 */
function arrayEach(array, iteratee) {
  var index = -1,
      length = array == null ? 0 : array.length;

  while (++index < length) {
    if (iteratee(array[index], index, array) === false) {
      break;
    }
  }
  return array;
}

/**
 * Creates a base function for methods like `_.forIn` and `_.forOwn`.
 *
 * @private
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {Function} Returns the new base function.
 */
function createBaseFor(fromRight) {
  return function(object, iteratee, keysFunc) {
    var index = -1,
        iterable = Object(object),
        props = keysFunc(object),
        length = props.length;

    while (length--) {
      var key = props[fromRight ? length : ++index];
      if (iteratee(iterable[key], key, iterable) === false) {
        break;
      }
    }
    return object;
  };
}

/**
 * The base implementation of `baseForOwn` which iterates over `object`
 * properties returned by `keysFunc` and invokes `iteratee` for each property.
 * Iteratee functions may exit iteration early by explicitly returning `false`.
 *
 * @private
 * @param {Object} object The object to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @param {Function} keysFunc The function to get the keys of `object`.
 * @returns {Object} Returns `object`.
 */
var baseFor = createBaseFor();

/**
 * The base implementation of `_.forOwn` without support for iteratee shorthands.
 *
 * @private
 * @param {Object} object The object to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Object} Returns `object`.
 */
function baseForOwn(object, iteratee) {
  return object && baseFor(object, iteratee, keys);
}

/**
 * The base implementation of `_.findIndex` and `_.findLastIndex` without
 * support for iteratee shorthands.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {Function} predicate The function invoked per iteration.
 * @param {number} fromIndex The index to search from.
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function baseFindIndex(array, predicate, fromIndex, fromRight) {
  var length = array.length,
      index = fromIndex + (fromRight ? 1 : -1);

  while ((fromRight ? index-- : ++index < length)) {
    if (predicate(array[index], index, array)) {
      return index;
    }
  }
  return -1;
}

/**
 * The base implementation of `_.isNaN` without support for number objects.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is `NaN`, else `false`.
 */
function baseIsNaN(value) {
  return value !== value;
}

/**
 * A specialized version of `_.indexOf` which performs strict equality
 * comparisons of values, i.e. `===`.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} value The value to search for.
 * @param {number} fromIndex The index to search from.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function strictIndexOf(array, value, fromIndex) {
  var index = fromIndex - 1,
      length = array.length;

  while (++index < length) {
    if (array[index] === value) {
      return index;
    }
  }
  return -1;
}

/**
 * The base implementation of `_.indexOf` without `fromIndex` bounds checks.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} value The value to search for.
 * @param {number} fromIndex The index to search from.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function baseIndexOf(array, value, fromIndex) {
  return value === value
    ? strictIndexOf(array, value, fromIndex)
    : baseFindIndex(array, baseIsNaN, fromIndex);
}

/**
 * Determines the best order for running the functions in `tasks`, based on
 * their requirements. Each function can optionally depend on other functions
 * being completed first, and each function is run as soon as its requirements
 * are satisfied.
 *
 * If any of the functions pass an error to their callback, the `auto` sequence
 * will stop. Further tasks will not execute (so any other functions depending
 * on it will not run), and the main `callback` is immediately called with the
 * error.
 *
 * Functions also receive an object containing the results of functions which
 * have completed so far as the first argument, if they have dependencies. If a
 * task function has no dependencies, it will only be passed a callback.
 *
 * @name auto
 * @static
 * @memberOf module:ControlFlow
 * @method
 * @category Control Flow
 * @param {Object} tasks - An object. Each of its properties is either a
 * function or an array of requirements, with the function itself the last item
 * in the array. The object's key of a property serves as the name of the task
 * defined by that property, i.e. can be used when specifying requirements for
 * other tasks. The function receives one or two arguments:
 * * a `results` object, containing the results of the previously executed
 *   functions, only passed if the task has any dependencies,
 * * a `callback(err, result)` function, which must be called when finished,
 *   passing an `error` (which can be `null`) and the result of the function's
 *   execution.
 * @param {number} [concurrency=Infinity] - An optional `integer` for
 * determining the maximum number of tasks that can be run in parallel. By
 * default, as many as possible.
 * @param {Function} [callback] - An optional callback which is called when all
 * the tasks have been completed. It receives the `err` argument if any `tasks`
 * pass an error to their callback. Results are always returned; however, if an
 * error occurs, no further `tasks` will be performed, and the results object
 * will only contain partial results. Invoked with (err, results).
 * @returns undefined
 * @example
 *
 * async.auto({
 *     // this function will just be passed a callback
 *     readData: async.apply(fs.readFile, 'data.txt', 'utf-8'),
 *     showData: ['readData', function(results, cb) {
 *         // results.readData is the file's contents
 *         // ...
 *     }]
 * }, callback);
 *
 * async.auto({
 *     get_data: function(callback) {
 *         console.log('in get_data');
 *         // async code to get some data
 *         callback(null, 'data', 'converted to array');
 *     },
 *     make_folder: function(callback) {
 *         console.log('in make_folder');
 *         // async code to create a directory to store a file in
 *         // this is run at the same time as getting the data
 *         callback(null, 'folder');
 *     },
 *     write_file: ['get_data', 'make_folder', function(results, callback) {
 *         console.log('in write_file', JSON.stringify(results));
 *         // once there is some data and the directory exists,
 *         // write the data to a file in the directory
 *         callback(null, 'filename');
 *     }],
 *     email_link: ['write_file', function(results, callback) {
 *         console.log('in email_link', JSON.stringify(results));
 *         // once the file is written let's email a link to it...
 *         // results.write_file contains the filename returned by write_file.
 *         callback(null, {'file':results.write_file, 'email':'user@example.com'});
 *     }]
 * }, function(err, results) {
 *     console.log('err = ', err);
 *     console.log('results = ', results);
 * });
 */
var auto = function (tasks, concurrency, callback) {
    if (typeof concurrency === 'function') {
        // concurrency is optional, shift the args.
        callback = concurrency;
        concurrency = null;
    }
    callback = once(callback || noop);
    var keys$$1 = keys(tasks);
    var numTasks = keys$$1.length;
    if (!numTasks) {
        return callback(null);
    }
    if (!concurrency) {
        concurrency = numTasks;
    }

    var results = {};
    var runningTasks = 0;
    var hasError = false;

    var listeners = {};

    var readyTasks = [];

    // for cycle detection:
    var readyToCheck = []; // tasks that have been identified as reachable
    // without the possibility of returning to an ancestor task
    var uncheckedDependencies = {};

    baseForOwn(tasks, function (task, key) {
        if (!isArray(task)) {
            // no dependencies
            enqueueTask(key, [task]);
            readyToCheck.push(key);
            return;
        }

        var dependencies = task.slice(0, task.length - 1);
        var remainingDependencies = dependencies.length;
        if (remainingDependencies === 0) {
            enqueueTask(key, task);
            readyToCheck.push(key);
            return;
        }
        uncheckedDependencies[key] = remainingDependencies;

        arrayEach(dependencies, function (dependencyName) {
            if (!tasks[dependencyName]) {
                throw new Error('async.auto task `' + key + '` has a non-existent dependency in ' + dependencies.join(', '));
            }
            addListener(dependencyName, function () {
                remainingDependencies--;
                if (remainingDependencies === 0) {
                    enqueueTask(key, task);
                }
            });
        });
    });

    checkForDeadlocks();
    processQueue();

    function enqueueTask(key, task) {
        readyTasks.push(function () {
            runTask(key, task);
        });
    }

    function processQueue() {
        if (readyTasks.length === 0 && runningTasks === 0) {
            return callback(null, results);
        }
        while (readyTasks.length && runningTasks < concurrency) {
            var run = readyTasks.shift();
            run();
        }
    }

    function addListener(taskName, fn) {
        var taskListeners = listeners[taskName];
        if (!taskListeners) {
            taskListeners = listeners[taskName] = [];
        }

        taskListeners.push(fn);
    }

    function taskComplete(taskName) {
        var taskListeners = listeners[taskName] || [];
        arrayEach(taskListeners, function (fn) {
            fn();
        });
        processQueue();
    }

    function runTask(key, task) {
        if (hasError) return;

        var taskCallback = onlyOnce(rest(function (err, args) {
            runningTasks--;
            if (args.length <= 1) {
                args = args[0];
            }
            if (err) {
                var safeResults = {};
                baseForOwn(results, function (val, rkey) {
                    safeResults[rkey] = val;
                });
                safeResults[key] = args;
                hasError = true;
                listeners = [];

                callback(err, safeResults);
            } else {
                results[key] = args;
                taskComplete(key);
            }
        }));

        runningTasks++;
        var taskFn = task[task.length - 1];
        if (task.length > 1) {
            taskFn(results, taskCallback);
        } else {
            taskFn(taskCallback);
        }
    }

    function checkForDeadlocks() {
        // Kahn's algorithm
        // https://en.wikipedia.org/wiki/Topological_sorting#Kahn.27s_algorithm
        // http://connalle.blogspot.com/2013/10/topological-sortingkahn-algorithm.html
        var currentTask;
        var counter = 0;
        while (readyToCheck.length) {
            currentTask = readyToCheck.pop();
            counter++;
            arrayEach(getDependents(currentTask), function (dependent) {
                if (--uncheckedDependencies[dependent] === 0) {
                    readyToCheck.push(dependent);
                }
            });
        }

        if (counter !== numTasks) {
            throw new Error('async.auto cannot execute tasks due to a recursive dependency');
        }
    }

    function getDependents(taskName) {
        var result = [];
        baseForOwn(tasks, function (task, key) {
            if (isArray(task) && baseIndexOf(task, taskName, 0) >= 0) {
                result.push(key);
            }
        });
        return result;
    }
};

/**
 * A specialized version of `_.map` for arrays without support for iteratee
 * shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the new mapped array.
 */
function arrayMap(array, iteratee) {
  var index = -1,
      length = array == null ? 0 : array.length,
      result = Array(length);

  while (++index < length) {
    result[index] = iteratee(array[index], index, array);
  }
  return result;
}

/** `Object#toString` result references. */
var symbolTag = '[object Symbol]';

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol(value) {
  return typeof value == 'symbol' ||
    (isObjectLike(value) && baseGetTag(value) == symbolTag);
}

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0;

/** Used to convert symbols to primitives and strings. */
var symbolProto = Symbol$1 ? Symbol$1.prototype : undefined;
var symbolToString = symbolProto ? symbolProto.toString : undefined;

/**
 * The base implementation of `_.toString` which doesn't convert nullish
 * values to empty strings.
 *
 * @private
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 */
function baseToString(value) {
  // Exit early for strings to avoid a performance hit in some environments.
  if (typeof value == 'string') {
    return value;
  }
  if (isArray(value)) {
    // Recursively convert values (susceptible to call stack limits).
    return arrayMap(value, baseToString) + '';
  }
  if (isSymbol(value)) {
    return symbolToString ? symbolToString.call(value) : '';
  }
  var result = (value + '');
  return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
}

/**
 * The base implementation of `_.slice` without an iteratee call guard.
 *
 * @private
 * @param {Array} array The array to slice.
 * @param {number} [start=0] The start position.
 * @param {number} [end=array.length] The end position.
 * @returns {Array} Returns the slice of `array`.
 */
function baseSlice(array, start, end) {
  var index = -1,
      length = array.length;

  if (start < 0) {
    start = -start > length ? 0 : (length + start);
  }
  end = end > length ? length : end;
  if (end < 0) {
    end += length;
  }
  length = start > end ? 0 : ((end - start) >>> 0);
  start >>>= 0;

  var result = Array(length);
  while (++index < length) {
    result[index] = array[index + start];
  }
  return result;
}

/**
 * Casts `array` to a slice if it's needed.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {number} start The start position.
 * @param {number} [end=array.length] The end position.
 * @returns {Array} Returns the cast slice.
 */
function castSlice(array, start, end) {
  var length = array.length;
  end = end === undefined ? length : end;
  return (!start && end >= length) ? array : baseSlice(array, start, end);
}

/**
 * Used by `_.trim` and `_.trimEnd` to get the index of the last string symbol
 * that is not found in the character symbols.
 *
 * @private
 * @param {Array} strSymbols The string symbols to inspect.
 * @param {Array} chrSymbols The character symbols to find.
 * @returns {number} Returns the index of the last unmatched string symbol.
 */
function charsEndIndex(strSymbols, chrSymbols) {
  var index = strSymbols.length;

  while (index-- && baseIndexOf(chrSymbols, strSymbols[index], 0) > -1) {}
  return index;
}

/**
 * Used by `_.trim` and `_.trimStart` to get the index of the first string symbol
 * that is not found in the character symbols.
 *
 * @private
 * @param {Array} strSymbols The string symbols to inspect.
 * @param {Array} chrSymbols The character symbols to find.
 * @returns {number} Returns the index of the first unmatched string symbol.
 */
function charsStartIndex(strSymbols, chrSymbols) {
  var index = -1,
      length = strSymbols.length;

  while (++index < length && baseIndexOf(chrSymbols, strSymbols[index], 0) > -1) {}
  return index;
}

/**
 * Converts an ASCII `string` to an array.
 *
 * @private
 * @param {string} string The string to convert.
 * @returns {Array} Returns the converted array.
 */
function asciiToArray(string) {
  return string.split('');
}

/** Used to compose unicode character classes. */
var rsAstralRange = '\\ud800-\\udfff';
var rsComboMarksRange = '\\u0300-\\u036f\\ufe20-\\ufe23';
var rsComboSymbolsRange = '\\u20d0-\\u20f0';
var rsVarRange = '\\ufe0e\\ufe0f';

/** Used to compose unicode capture groups. */
var rsZWJ = '\\u200d';

/** Used to detect strings with [zero-width joiners or code points from the astral planes](http://eev.ee/blog/2015/09/12/dark-corners-of-unicode/). */
var reHasUnicode = RegExp('[' + rsZWJ + rsAstralRange  + rsComboMarksRange + rsComboSymbolsRange + rsVarRange + ']');

/**
 * Checks if `string` contains Unicode symbols.
 *
 * @private
 * @param {string} string The string to inspect.
 * @returns {boolean} Returns `true` if a symbol is found, else `false`.
 */
function hasUnicode(string) {
  return reHasUnicode.test(string);
}

/** Used to compose unicode character classes. */
var rsAstralRange$1 = '\\ud800-\\udfff';
var rsComboMarksRange$1 = '\\u0300-\\u036f\\ufe20-\\ufe23';
var rsComboSymbolsRange$1 = '\\u20d0-\\u20f0';
var rsVarRange$1 = '\\ufe0e\\ufe0f';

/** Used to compose unicode capture groups. */
var rsAstral = '[' + rsAstralRange$1 + ']';
var rsCombo = '[' + rsComboMarksRange$1 + rsComboSymbolsRange$1 + ']';
var rsFitz = '\\ud83c[\\udffb-\\udfff]';
var rsModifier = '(?:' + rsCombo + '|' + rsFitz + ')';
var rsNonAstral = '[^' + rsAstralRange$1 + ']';
var rsRegional = '(?:\\ud83c[\\udde6-\\uddff]){2}';
var rsSurrPair = '[\\ud800-\\udbff][\\udc00-\\udfff]';
var rsZWJ$1 = '\\u200d';

/** Used to compose unicode regexes. */
var reOptMod = rsModifier + '?';
var rsOptVar = '[' + rsVarRange$1 + ']?';
var rsOptJoin = '(?:' + rsZWJ$1 + '(?:' + [rsNonAstral, rsRegional, rsSurrPair].join('|') + ')' + rsOptVar + reOptMod + ')*';
var rsSeq = rsOptVar + reOptMod + rsOptJoin;
var rsSymbol = '(?:' + [rsNonAstral + rsCombo + '?', rsCombo, rsRegional, rsSurrPair, rsAstral].join('|') + ')';

/** Used to match [string symbols](https://mathiasbynens.be/notes/javascript-unicode). */
var reUnicode = RegExp(rsFitz + '(?=' + rsFitz + ')|' + rsSymbol + rsSeq, 'g');

/**
 * Converts a Unicode `string` to an array.
 *
 * @private
 * @param {string} string The string to convert.
 * @returns {Array} Returns the converted array.
 */
function unicodeToArray(string) {
  return string.match(reUnicode) || [];
}

/**
 * Converts `string` to an array.
 *
 * @private
 * @param {string} string The string to convert.
 * @returns {Array} Returns the converted array.
 */
function stringToArray(string) {
  return hasUnicode(string)
    ? unicodeToArray(string)
    : asciiToArray(string);
}

/**
 * Converts `value` to a string. An empty string is returned for `null`
 * and `undefined` values. The sign of `-0` is preserved.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 * @example
 *
 * _.toString(null);
 * // => ''
 *
 * _.toString(-0);
 * // => '-0'
 *
 * _.toString([1, 2, 3]);
 * // => '1,2,3'
 */
function toString(value) {
  return value == null ? '' : baseToString(value);
}

/** Used to match leading and trailing whitespace. */
var reTrim = /^\s+|\s+$/g;

/**
 * Removes leading and trailing whitespace or specified characters from `string`.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category String
 * @param {string} [string=''] The string to trim.
 * @param {string} [chars=whitespace] The characters to trim.
 * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
 * @returns {string} Returns the trimmed string.
 * @example
 *
 * _.trim('  abc  ');
 * // => 'abc'
 *
 * _.trim('-_-abc-_-', '_-');
 * // => 'abc'
 *
 * _.map(['  foo  ', '  bar  '], _.trim);
 * // => ['foo', 'bar']
 */
function trim(string, chars, guard) {
  string = toString(string);
  if (string && (guard || chars === undefined)) {
    return string.replace(reTrim, '');
  }
  if (!string || !(chars = baseToString(chars))) {
    return string;
  }
  var strSymbols = stringToArray(string),
      chrSymbols = stringToArray(chars),
      start = charsStartIndex(strSymbols, chrSymbols),
      end = charsEndIndex(strSymbols, chrSymbols) + 1;

  return castSlice(strSymbols, start, end).join('');
}

var FN_ARGS = /^(function)?\s*[^\(]*\(\s*([^\)]*)\)/m;
var FN_ARG_SPLIT = /,/;
var FN_ARG = /(=.+)?(\s*)$/;
var STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;

function parseParams(func) {
    func = func.toString().replace(STRIP_COMMENTS, '');
    func = func.match(FN_ARGS)[2].replace(' ', '');
    func = func ? func.split(FN_ARG_SPLIT) : [];
    func = func.map(function (arg) {
        return trim(arg.replace(FN_ARG, ''));
    });
    return func;
}

/**
 * A dependency-injected version of the [async.auto]{@link module:ControlFlow.auto} function. Dependent
 * tasks are specified as parameters to the function, after the usual callback
 * parameter, with the parameter names matching the names of the tasks it
 * depends on. This can provide even more readable task graphs which can be
 * easier to maintain.
 *
 * If a final callback is specified, the task results are similarly injected,
 * specified as named parameters after the initial error parameter.
 *
 * The autoInject function is purely syntactic sugar and its semantics are
 * otherwise equivalent to [async.auto]{@link module:ControlFlow.auto}.
 *
 * @name autoInject
 * @static
 * @memberOf module:ControlFlow
 * @method
 * @see [async.auto]{@link module:ControlFlow.auto}
 * @category Control Flow
 * @param {Object} tasks - An object, each of whose properties is a function of
 * the form 'func([dependencies...], callback). The object's key of a property
 * serves as the name of the task defined by that property, i.e. can be used
 * when specifying requirements for other tasks.
 * * The `callback` parameter is a `callback(err, result)` which must be called
 *   when finished, passing an `error` (which can be `null`) and the result of
 *   the function's execution. The remaining parameters name other tasks on
 *   which the task is dependent, and the results from those tasks are the
 *   arguments of those parameters.
 * @param {Function} [callback] - An optional callback which is called when all
 * the tasks have been completed. It receives the `err` argument if any `tasks`
 * pass an error to their callback, and a `results` object with any completed
 * task results, similar to `auto`.
 * @example
 *
 * //  The example from `auto` can be rewritten as follows:
 * async.autoInject({
 *     get_data: function(callback) {
 *         // async code to get some data
 *         callback(null, 'data', 'converted to array');
 *     },
 *     make_folder: function(callback) {
 *         // async code to create a directory to store a file in
 *         // this is run at the same time as getting the data
 *         callback(null, 'folder');
 *     },
 *     write_file: function(get_data, make_folder, callback) {
 *         // once there is some data and the directory exists,
 *         // write the data to a file in the directory
 *         callback(null, 'filename');
 *     },
 *     email_link: function(write_file, callback) {
 *         // once the file is written let's email a link to it...
 *         // write_file contains the filename returned by write_file.
 *         callback(null, {'file':write_file, 'email':'user@example.com'});
 *     }
 * }, function(err, results) {
 *     console.log('err = ', err);
 *     console.log('email_link = ', results.email_link);
 * });
 *
 * // If you are using a JS minifier that mangles parameter names, `autoInject`
 * // will not work with plain functions, since the parameter names will be
 * // collapsed to a single letter identifier.  To work around this, you can
 * // explicitly specify the names of the parameters your task function needs
 * // in an array, similar to Angular.js dependency injection.
 *
 * // This still has an advantage over plain `auto`, since the results a task
 * // depends on are still spread into arguments.
 * async.autoInject({
 *     //...
 *     write_file: ['get_data', 'make_folder', function(get_data, make_folder, callback) {
 *         callback(null, 'filename');
 *     }],
 *     email_link: ['write_file', function(write_file, callback) {
 *         callback(null, {'file':write_file, 'email':'user@example.com'});
 *     }]
 *     //...
 * }, function(err, results) {
 *     console.log('err = ', err);
 *     console.log('email_link = ', results.email_link);
 * });
 */
function autoInject(tasks, callback) {
    var newTasks = {};

    baseForOwn(tasks, function (taskFn, key) {
        var params;

        if (isArray(taskFn)) {
            params = taskFn.slice(0, -1);
            taskFn = taskFn[taskFn.length - 1];

            newTasks[key] = params.concat(params.length > 0 ? newTask : taskFn);
        } else if (taskFn.length === 1) {
            // no dependencies, use the function as-is
            newTasks[key] = taskFn;
        } else {
            params = parseParams(taskFn);
            if (taskFn.length === 0 && params.length === 0) {
                throw new Error("autoInject task functions require explicit parameters.");
            }

            params.pop();

            newTasks[key] = params.concat(newTask);
        }

        function newTask(results, taskCb) {
            var newArgs = arrayMap(params, function (name) {
                return results[name];
            });
            newArgs.push(taskCb);
            taskFn.apply(null, newArgs);
        }
    });

    auto(newTasks, callback);
}

var hasSetImmediate = typeof setImmediate === 'function' && setImmediate;
var hasNextTick = typeof process === 'object' && typeof process.nextTick === 'function';

function fallback(fn) {
    setTimeout(fn, 0);
}

function wrap(defer) {
    return rest(function (fn, args) {
        defer(function () {
            fn.apply(null, args);
        });
    });
}

var _defer;

if (hasSetImmediate) {
    _defer = setImmediate;
} else if (hasNextTick) {
    _defer = process.nextTick;
} else {
    _defer = fallback;
}

var setImmediate$1 = wrap(_defer);

// Simple doubly linked list (https://en.wikipedia.org/wiki/Doubly_linked_list) implementation
// used for queues. This implementation assumes that the node provided by the user can be modified
// to adjust the next and last properties. We implement only the minimal functionality
// for queue support.
function DLL() {
    this.head = this.tail = null;
    this.length = 0;
}

function setInitial(dll, node) {
    dll.length = 1;
    dll.head = dll.tail = node;
}

DLL.prototype.removeLink = function (node) {
    if (node.prev) node.prev.next = node.next;else this.head = node.next;
    if (node.next) node.next.prev = node.prev;else this.tail = node.prev;

    node.prev = node.next = null;
    this.length -= 1;
    return node;
};

DLL.prototype.empty = DLL;

DLL.prototype.insertAfter = function (node, newNode) {
    newNode.prev = node;
    newNode.next = node.next;
    if (node.next) node.next.prev = newNode;else this.tail = newNode;
    node.next = newNode;
    this.length += 1;
};

DLL.prototype.insertBefore = function (node, newNode) {
    newNode.prev = node.prev;
    newNode.next = node;
    if (node.prev) node.prev.next = newNode;else this.head = newNode;
    node.prev = newNode;
    this.length += 1;
};

DLL.prototype.unshift = function (node) {
    if (this.head) this.insertBefore(this.head, node);else setInitial(this, node);
};

DLL.prototype.push = function (node) {
    if (this.tail) this.insertAfter(this.tail, node);else setInitial(this, node);
};

DLL.prototype.shift = function () {
    return this.head && this.removeLink(this.head);
};

DLL.prototype.pop = function () {
    return this.tail && this.removeLink(this.tail);
};

function queue(worker, concurrency, payload) {
    if (concurrency == null) {
        concurrency = 1;
    } else if (concurrency === 0) {
        throw new Error('Concurrency must not be zero');
    }

    function _insert(data, insertAtFront, callback) {
        if (callback != null && typeof callback !== 'function') {
            throw new Error('task callback must be a function');
        }
        q.started = true;
        if (!isArray(data)) {
            data = [data];
        }
        if (data.length === 0 && q.idle()) {
            // call drain immediately if there are no tasks
            return setImmediate$1(function () {
                q.drain();
            });
        }

        for (var i = 0, l = data.length; i < l; i++) {
            var item = {
                data: data[i],
                callback: callback || noop
            };

            if (insertAtFront) {
                q._tasks.unshift(item);
            } else {
                q._tasks.push(item);
            }
        }
        setImmediate$1(q.process);
    }

    function _next(tasks) {
        return rest(function (args) {
            workers -= 1;

            for (var i = 0, l = tasks.length; i < l; i++) {
                var task = tasks[i];
                var index = baseIndexOf(workersList, task, 0);
                if (index >= 0) {
                    workersList.splice(index);
                }

                task.callback.apply(task, args);

                if (args[0] != null) {
                    q.error(args[0], task.data);
                }
            }

            if (workers <= q.concurrency - q.buffer) {
                q.unsaturated();
            }

            if (q.idle()) {
                q.drain();
            }
            q.process();
        });
    }

    var workers = 0;
    var workersList = [];
    var q = {
        _tasks: new DLL(),
        concurrency: concurrency,
        payload: payload,
        saturated: noop,
        unsaturated: noop,
        buffer: concurrency / 4,
        empty: noop,
        drain: noop,
        error: noop,
        started: false,
        paused: false,
        push: function (data, callback) {
            _insert(data, false, callback);
        },
        kill: function () {
            q.drain = noop;
            q._tasks.empty();
        },
        unshift: function (data, callback) {
            _insert(data, true, callback);
        },
        process: function () {
            while (!q.paused && workers < q.concurrency && q._tasks.length) {
                var tasks = [],
                    data = [];
                var l = q._tasks.length;
                if (q.payload) l = Math.min(l, q.payload);
                for (var i = 0; i < l; i++) {
                    var node = q._tasks.shift();
                    tasks.push(node);
                    data.push(node.data);
                }

                if (q._tasks.length === 0) {
                    q.empty();
                }
                workers += 1;
                workersList.push(tasks[0]);

                if (workers === q.concurrency) {
                    q.saturated();
                }

                var cb = onlyOnce(_next(tasks));
                worker(data, cb);
            }
        },
        length: function () {
            return q._tasks.length;
        },
        running: function () {
            return workers;
        },
        workersList: function () {
            return workersList;
        },
        idle: function () {
            return q._tasks.length + workers === 0;
        },
        pause: function () {
            q.paused = true;
        },
        resume: function () {
            if (q.paused === false) {
                return;
            }
            q.paused = false;
            var resumeCount = Math.min(q.concurrency, q._tasks.length);
            // Need to call q.process once per concurrent
            // worker to preserve full concurrency after pause
            for (var w = 1; w <= resumeCount; w++) {
                setImmediate$1(q.process);
            }
        }
    };
    return q;
}

/**
 * A cargo of tasks for the worker function to complete. Cargo inherits all of
 * the same methods and event callbacks as [`queue`]{@link module:ControlFlow.queue}.
 * @typedef {Object} CargoObject
 * @memberOf module:ControlFlow
 * @property {Function} length - A function returning the number of items
 * waiting to be processed. Invoke like `cargo.length()`.
 * @property {number} payload - An `integer` for determining how many tasks
 * should be process per round. This property can be changed after a `cargo` is
 * created to alter the payload on-the-fly.
 * @property {Function} push - Adds `task` to the `queue`. The callback is
 * called once the `worker` has finished processing the task. Instead of a
 * single task, an array of `tasks` can be submitted. The respective callback is
 * used for every task in the list. Invoke like `cargo.push(task, [callback])`.
 * @property {Function} saturated - A callback that is called when the
 * `queue.length()` hits the concurrency and further tasks will be queued.
 * @property {Function} empty - A callback that is called when the last item
 * from the `queue` is given to a `worker`.
 * @property {Function} drain - A callback that is called when the last item
 * from the `queue` has returned from the `worker`.
 * @property {Function} idle - a function returning false if there are items
 * waiting or being processed, or true if not. Invoke like `cargo.idle()`.
 * @property {Function} pause - a function that pauses the processing of tasks
 * until `resume()` is called. Invoke like `cargo.pause()`.
 * @property {Function} resume - a function that resumes the processing of
 * queued tasks when the queue is paused. Invoke like `cargo.resume()`.
 * @property {Function} kill - a function that removes the `drain` callback and
 * empties remaining tasks from the queue forcing it to go idle. Invoke like `cargo.kill()`.
 */

/**
 * Creates a `cargo` object with the specified payload. Tasks added to the
 * cargo will be processed altogether (up to the `payload` limit). If the
 * `worker` is in progress, the task is queued until it becomes available. Once
 * the `worker` has completed some tasks, each callback of those tasks is
 * called. Check out [these](https://camo.githubusercontent.com/6bbd36f4cf5b35a0f11a96dcd2e97711ffc2fb37/68747470733a2f2f662e636c6f75642e6769746875622e636f6d2f6173736574732f313637363837312f36383130382f62626330636662302d356632392d313165322d393734662d3333393763363464633835382e676966) [animations](https://camo.githubusercontent.com/f4810e00e1c5f5f8addbe3e9f49064fd5d102699/68747470733a2f2f662e636c6f75642e6769746875622e636f6d2f6173736574732f313637363837312f36383130312f38346339323036362d356632392d313165322d383134662d3964336430323431336266642e676966)
 * for how `cargo` and `queue` work.
 *
 * While [`queue`]{@link module:ControlFlow.queue} passes only one task to one of a group of workers
 * at a time, cargo passes an array of tasks to a single worker, repeating
 * when the worker is finished.
 *
 * @name cargo
 * @static
 * @memberOf module:ControlFlow
 * @method
 * @see [async.queue]{@link module:ControlFlow.queue}
 * @category Control Flow
 * @param {Function} worker - An asynchronous function for processing an array
 * of queued tasks, which must call its `callback(err)` argument when finished,
 * with an optional `err` argument. Invoked with `(tasks, callback)`.
 * @param {number} [payload=Infinity] - An optional `integer` for determining
 * how many tasks should be processed per round; if omitted, the default is
 * unlimited.
 * @returns {module:ControlFlow.CargoObject} A cargo object to manage the tasks. Callbacks can
 * attached as certain properties to listen for specific events during the
 * lifecycle of the cargo and inner queue.
 * @example
 *
 * // create a cargo object with payload 2
 * var cargo = async.cargo(function(tasks, callback) {
 *     for (var i=0; i<tasks.length; i++) {
 *         console.log('hello ' + tasks[i].name);
 *     }
 *     callback();
 * }, 2);
 *
 * // add some items
 * cargo.push({name: 'foo'}, function(err) {
 *     console.log('finished processing foo');
 * });
 * cargo.push({name: 'bar'}, function(err) {
 *     console.log('finished processing bar');
 * });
 * cargo.push({name: 'baz'}, function(err) {
 *     console.log('finished processing baz');
 * });
 */
function cargo(worker, payload) {
  return queue(worker, 1, payload);
}

/**
 * The same as [`eachOf`]{@link module:Collections.eachOf} but runs only a single async operation at a time.
 *
 * @name eachOfSeries
 * @static
 * @memberOf module:Collections
 * @method
 * @see [async.eachOf]{@link module:Collections.eachOf}
 * @alias forEachOfSeries
 * @category Collection
 * @param {Array|Iterable|Object} coll - A collection to iterate over.
 * @param {Function} iteratee - A function to apply to each item in `coll`. The
 * `key` is the item's key, or index in the case of an array. The iteratee is
 * passed a `callback(err)` which must be called once it has completed. If no
 * error has occurred, the callback should be run without arguments or with an
 * explicit `null` argument. Invoked with (item, key, callback).
 * @param {Function} [callback] - A callback which is called when all `iteratee`
 * functions have finished, or an error occurs. Invoked with (err).
 */
var eachOfSeries = doLimit(eachOfLimit, 1);

/**
 * Reduces `coll` into a single value using an async `iteratee` to return each
 * successive step. `memo` is the initial state of the reduction. This function
 * only operates in series.
 *
 * For performance reasons, it may make sense to split a call to this function
 * into a parallel map, and then use the normal `Array.prototype.reduce` on the
 * results. This function is for situations where each step in the reduction
 * needs to be async; if you can get the data before reducing it, then it's
 * probably a good idea to do so.
 *
 * @name reduce
 * @static
 * @memberOf module:Collections
 * @method
 * @alias inject
 * @alias foldl
 * @category Collection
 * @param {Array|Iterable|Object} coll - A collection to iterate over.
 * @param {*} memo - The initial state of the reduction.
 * @param {Function} iteratee - A function applied to each item in the
 * array to produce the next step in the reduction. The `iteratee` is passed a
 * `callback(err, reduction)` which accepts an optional error as its first
 * argument, and the state of the reduction as the second. If an error is
 * passed to the callback, the reduction is stopped and the main `callback` is
 * immediately called with the error. Invoked with (memo, item, callback).
 * @param {Function} [callback] - A callback which is called after all the
 * `iteratee` functions have finished. Result is the reduced value. Invoked with
 * (err, result).
 * @example
 *
 * async.reduce([1,2,3], 0, function(memo, item, callback) {
 *     // pointless async:
 *     process.nextTick(function() {
 *         callback(null, memo + item)
 *     });
 * }, function(err, result) {
 *     // result is now equal to the last value of memo, which is 6
 * });
 */
function reduce(coll, memo, iteratee, callback) {
    callback = once(callback || noop);
    eachOfSeries(coll, function (x, i, callback) {
        iteratee(memo, x, function (err, v) {
            memo = v;
            callback(err);
        });
    }, function (err) {
        callback(err, memo);
    });
}

/**
 * Version of the compose function that is more natural to read. Each function
 * consumes the return value of the previous function. It is the equivalent of
 * [compose]{@link module:ControlFlow.compose} with the arguments reversed.
 *
 * Each function is executed with the `this` binding of the composed function.
 *
 * @name seq
 * @static
 * @memberOf module:ControlFlow
 * @method
 * @see [async.compose]{@link module:ControlFlow.compose}
 * @category Control Flow
 * @param {...Function} functions - the asynchronous functions to compose
 * @returns {Function} a function that composes the `functions` in order
 * @example
 *
 * // Requires lodash (or underscore), express3 and dresende's orm2.
 * // Part of an app, that fetches cats of the logged user.
 * // This example uses `seq` function to avoid overnesting and error
 * // handling clutter.
 * app.get('/cats', function(request, response) {
 *     var User = request.models.User;
 *     async.seq(
 *         _.bind(User.get, User),  // 'User.get' has signature (id, callback(err, data))
 *         function(user, fn) {
 *             user.getCats(fn);      // 'getCats' has signature (callback(err, data))
 *         }
 *     )(req.session.user_id, function (err, cats) {
 *         if (err) {
 *             console.error(err);
 *             response.json({ status: 'error', message: err.message });
 *         } else {
 *             response.json({ status: 'ok', message: 'Cats found', data: cats });
 *         }
 *     });
 * });
 */
var seq$1 = rest(function seq(functions) {
    return rest(function (args) {
        var that = this;

        var cb = args[args.length - 1];
        if (typeof cb == 'function') {
            args.pop();
        } else {
            cb = noop;
        }

        reduce(functions, args, function (newargs, fn, cb) {
            fn.apply(that, newargs.concat([rest(function (err, nextargs) {
                cb(err, nextargs);
            })]));
        }, function (err, results) {
            cb.apply(that, [err].concat(results));
        });
    });
});

/**
 * Creates a function which is a composition of the passed asynchronous
 * functions. Each function consumes the return value of the function that
 * follows. Composing functions `f()`, `g()`, and `h()` would produce the result
 * of `f(g(h()))`, only this version uses callbacks to obtain the return values.
 *
 * Each function is executed with the `this` binding of the composed function.
 *
 * @name compose
 * @static
 * @memberOf module:ControlFlow
 * @method
 * @category Control Flow
 * @param {...Function} functions - the asynchronous functions to compose
 * @returns {Function} an asynchronous function that is the composed
 * asynchronous `functions`
 * @example
 *
 * function add1(n, callback) {
 *     setTimeout(function () {
 *         callback(null, n + 1);
 *     }, 10);
 * }
 *
 * function mul3(n, callback) {
 *     setTimeout(function () {
 *         callback(null, n * 3);
 *     }, 10);
 * }
 *
 * var add1mul3 = async.compose(mul3, add1);
 * add1mul3(4, function (err, result) {
 *     // result now equals 15
 * });
 */
var compose = rest(function (args) {
  return seq$1.apply(null, args.reverse());
});

function concat$1(eachfn, arr, fn, callback) {
    var result = [];
    eachfn(arr, function (x, index, cb) {
        fn(x, function (err, y) {
            result = result.concat(y || []);
            cb(err);
        });
    }, function (err) {
        callback(err, result);
    });
}

/**
 * Applies `iteratee` to each item in `coll`, concatenating the results. Returns
 * the concatenated list. The `iteratee`s are called in parallel, and the
 * results are concatenated as they return. There is no guarantee that the
 * results array will be returned in the original order of `coll` passed to the
 * `iteratee` function.
 *
 * @name concat
 * @static
 * @memberOf module:Collections
 * @method
 * @category Collection
 * @param {Array|Iterable|Object} coll - A collection to iterate over.
 * @param {Function} iteratee - A function to apply to each item in `coll`.
 * The iteratee is passed a `callback(err, results)` which must be called once
 * it has completed with an error (which can be `null`) and an array of results.
 * Invoked with (item, callback).
 * @param {Function} [callback(err)] - A callback which is called after all the
 * `iteratee` functions have finished, or an error occurs. Results is an array
 * containing the concatenated results of the `iteratee` function. Invoked with
 * (err, results).
 * @example
 *
 * async.concat(['dir1','dir2','dir3'], fs.readdir, function(err, files) {
 *     // files is now a list of filenames that exist in the 3 directories
 * });
 */
var concat = doParallel(concat$1);

function doSeries(fn) {
    return function (obj, iteratee, callback) {
        return fn(eachOfSeries, obj, iteratee, callback);
    };
}

/**
 * The same as [`concat`]{@link module:Collections.concat} but runs only a single async operation at a time.
 *
 * @name concatSeries
 * @static
 * @memberOf module:Collections
 * @method
 * @see [async.concat]{@link module:Collections.concat}
 * @category Collection
 * @param {Array|Iterable|Object} coll - A collection to iterate over.
 * @param {Function} iteratee - A function to apply to each item in `coll`.
 * The iteratee is passed a `callback(err, results)` which must be called once
 * it has completed with an error (which can be `null`) and an array of results.
 * Invoked with (item, callback).
 * @param {Function} [callback(err)] - A callback which is called after all the
 * `iteratee` functions have finished, or an error occurs. Results is an array
 * containing the concatenated results of the `iteratee` function. Invoked with
 * (err, results).
 */
var concatSeries = doSeries(concat$1);

/**
 * Returns a function that when called, calls-back with the values provided.
 * Useful as the first function in a [`waterfall`]{@link module:ControlFlow.waterfall}, or for plugging values in to
 * [`auto`]{@link module:ControlFlow.auto}.
 *
 * @name constant
 * @static
 * @memberOf module:Utils
 * @method
 * @category Util
 * @param {...*} arguments... - Any number of arguments to automatically invoke
 * callback with.
 * @returns {Function} Returns a function that when invoked, automatically
 * invokes the callback with the previous given arguments.
 * @example
 *
 * async.waterfall([
 *     async.constant(42),
 *     function (value, next) {
 *         // value === 42
 *     },
 *     //...
 * ], callback);
 *
 * async.waterfall([
 *     async.constant(filename, "utf8"),
 *     fs.readFile,
 *     function (fileData, next) {
 *         //...
 *     }
 *     //...
 * ], callback);
 *
 * async.auto({
 *     hostname: async.constant("https://server.net/"),
 *     port: findFreePort,
 *     launchServer: ["hostname", "port", function (options, cb) {
 *         startServer(options, cb);
 *     }],
 *     //...
 * }, callback);
 */
var constant = rest(function (values) {
    var args = [null].concat(values);
    return initialParams(function (ignoredArgs, callback) {
        return callback.apply(this, args);
    });
});

function _createTester(eachfn, check, getResult) {
    return function (arr, limit, iteratee, cb) {
        function done() {
            if (cb) {
                cb(null, getResult(false));
            }
        }
        function wrappedIteratee(x, _, callback) {
            if (!cb) return callback();
            iteratee(x, function (err, v) {
                // Check cb as another iteratee may have resolved with a
                // value or error since we started this iteratee
                if (cb && (err || check(v))) {
                    if (err) cb(err);else cb(err, getResult(true, x));
                    cb = iteratee = false;
                    callback(err, breakLoop);
                } else {
                    callback();
                }
            });
        }
        if (arguments.length > 3) {
            cb = cb || noop;
            eachfn(arr, limit, wrappedIteratee, done);
        } else {
            cb = iteratee;
            cb = cb || noop;
            iteratee = limit;
            eachfn(arr, wrappedIteratee, done);
        }
    };
}

function _findGetResult(v, x) {
    return x;
}

/**
 * Returns the first value in `coll` that passes an async truth test. The
 * `iteratee` is applied in parallel, meaning the first iteratee to return
 * `true` will fire the detect `callback` with that result. That means the
 * result might not be the first item in the original `coll` (in terms of order)
 * that passes the test.

 * If order within the original `coll` is important, then look at
 * [`detectSeries`]{@link module:Collections.detectSeries}.
 *
 * @name detect
 * @static
 * @memberOf module:Collections
 * @method
 * @alias find
 * @category Collections
 * @param {Array|Iterable|Object} coll - A collection to iterate over.
 * @param {Function} iteratee - A truth test to apply to each item in `coll`.
 * The iteratee is passed a `callback(err, truthValue)` which must be called
 * with a boolean argument once it has completed. Invoked with (item, callback).
 * @param {Function} [callback] - A callback which is called as soon as any
 * iteratee returns `true`, or after all the `iteratee` functions have finished.
 * Result will be the first item in the array that passes the truth test
 * (iteratee) or the value `undefined` if none passed. Invoked with
 * (err, result).
 * @example
 *
 * async.detect(['file1','file2','file3'], function(filePath, callback) {
 *     fs.access(filePath, function(err) {
 *         callback(null, !err)
 *     });
 * }, function(err, result) {
 *     // result now equals the first file in the list that exists
 * });
 */
var detect = _createTester(eachOf, identity, _findGetResult);

/**
 * The same as [`detect`]{@link module:Collections.detect} but runs a maximum of `limit` async operations at a
 * time.
 *
 * @name detectLimit
 * @static
 * @memberOf module:Collections
 * @method
 * @see [async.detect]{@link module:Collections.detect}
 * @alias findLimit
 * @category Collections
 * @param {Array|Iterable|Object} coll - A collection to iterate over.
 * @param {number} limit - The maximum number of async operations at a time.
 * @param {Function} iteratee - A truth test to apply to each item in `coll`.
 * The iteratee is passed a `callback(err, truthValue)` which must be called
 * with a boolean argument once it has completed. Invoked with (item, callback).
 * @param {Function} [callback] - A callback which is called as soon as any
 * iteratee returns `true`, or after all the `iteratee` functions have finished.
 * Result will be the first item in the array that passes the truth test
 * (iteratee) or the value `undefined` if none passed. Invoked with
 * (err, result).
 */
var detectLimit = _createTester(eachOfLimit, identity, _findGetResult);

/**
 * The same as [`detect`]{@link module:Collections.detect} but runs only a single async operation at a time.
 *
 * @name detectSeries
 * @static
 * @memberOf module:Collections
 * @method
 * @see [async.detect]{@link module:Collections.detect}
 * @alias findSeries
 * @category Collections
 * @param {Array|Iterable|Object} coll - A collection to iterate over.
 * @param {Function} iteratee - A truth test to apply to each item in `coll`.
 * The iteratee is passed a `callback(err, truthValue)` which must be called
 * with a boolean argument once it has completed. Invoked with (item, callback).
 * @param {Function} [callback] - A callback which is called as soon as any
 * iteratee returns `true`, or after all the `iteratee` functions have finished.
 * Result will be the first item in the array that passes the truth test
 * (iteratee) or the value `undefined` if none passed. Invoked with
 * (err, result).
 */
var detectSeries = _createTester(eachOfSeries, identity, _findGetResult);

function consoleFunc(name) {
    return rest(function (fn, args) {
        fn.apply(null, args.concat([rest(function (err, args) {
            if (typeof console === 'object') {
                if (err) {
                    if (console.error) {
                        console.error(err);
                    }
                } else if (console[name]) {
                    arrayEach(args, function (x) {
                        console[name](x);
                    });
                }
            }
        })]));
    });
}

/**
 * Logs the result of an `async` function to the `console` using `console.dir`
 * to display the properties of the resulting object. Only works in Node.js or
 * in browsers that support `console.dir` and `console.error` (such as FF and
 * Chrome). If multiple arguments are returned from the async function,
 * `console.dir` is called on each argument in order.
 *
 * @name dir
 * @static
 * @memberOf module:Utils
 * @method
 * @category Util
 * @param {Function} function - The function you want to eventually apply all
 * arguments to.
 * @param {...*} arguments... - Any number of arguments to apply to the function.
 * @example
 *
 * // in a module
 * var hello = function(name, callback) {
 *     setTimeout(function() {
 *         callback(null, {hello: name});
 *     }, 1000);
 * };
 *
 * // in the node repl
 * node> async.dir(hello, 'world');
 * {hello: 'world'}
 */
var dir = consoleFunc('dir');

/**
 * The post-check version of [`during`]{@link module:ControlFlow.during}. To reflect the difference in
 * the order of operations, the arguments `test` and `fn` are switched.
 *
 * Also a version of [`doWhilst`]{@link module:ControlFlow.doWhilst} with asynchronous `test` function.
 * @name doDuring
 * @static
 * @memberOf module:ControlFlow
 * @method
 * @see [async.during]{@link module:ControlFlow.during}
 * @category Control Flow
 * @param {Function} fn - A function which is called each time `test` passes.
 * The function is passed a `callback(err)`, which must be called once it has
 * completed with an optional `err` argument. Invoked with (callback).
 * @param {Function} test - asynchronous truth test to perform before each
 * execution of `fn`. Invoked with (...args, callback), where `...args` are the
 * non-error args from the previous callback of `fn`.
 * @param {Function} [callback] - A callback which is called after the test
 * function has failed and repeated execution of `fn` has stopped. `callback`
 * will be passed an error if one occured, otherwise `null`.
 */
function doDuring(fn, test, callback) {
    callback = onlyOnce(callback || noop);

    var next = rest(function (err, args) {
        if (err) return callback(err);
        args.push(check);
        test.apply(this, args);
    });

    function check(err, truth) {
        if (err) return callback(err);
        if (!truth) return callback(null);
        fn(next);
    }

    check(null, true);
}

/**
 * The post-check version of [`whilst`]{@link module:ControlFlow.whilst}. To reflect the difference in
 * the order of operations, the arguments `test` and `iteratee` are switched.
 *
 * `doWhilst` is to `whilst` as `do while` is to `while` in plain JavaScript.
 *
 * @name doWhilst
 * @static
 * @memberOf module:ControlFlow
 * @method
 * @see [async.whilst]{@link module:ControlFlow.whilst}
 * @category Control Flow
 * @param {Function} iteratee - A function which is called each time `test`
 * passes. The function is passed a `callback(err)`, which must be called once
 * it has completed with an optional `err` argument. Invoked with (callback).
 * @param {Function} test - synchronous truth test to perform after each
 * execution of `iteratee`. Invoked with the non-error callback results of 
 * `iteratee`.
 * @param {Function} [callback] - A callback which is called after the test
 * function has failed and repeated execution of `iteratee` has stopped.
 * `callback` will be passed an error and any arguments passed to the final
 * `iteratee`'s callback. Invoked with (err, [results]);
 */
function doWhilst(iteratee, test, callback) {
    callback = onlyOnce(callback || noop);
    var next = rest(function (err, args) {
        if (err) return callback(err);
        if (test.apply(this, args)) return iteratee(next);
        callback.apply(null, [null].concat(args));
    });
    iteratee(next);
}

/**
 * Like ['doWhilst']{@link module:ControlFlow.doWhilst}, except the `test` is inverted. Note the
 * argument ordering differs from `until`.
 *
 * @name doUntil
 * @static
 * @memberOf module:ControlFlow
 * @method
 * @see [async.doWhilst]{@link module:ControlFlow.doWhilst}
 * @category Control Flow
 * @param {Function} fn - A function which is called each time `test` fails.
 * The function is passed a `callback(err)`, which must be called once it has
 * completed with an optional `err` argument. Invoked with (callback).
 * @param {Function} test - synchronous truth test to perform after each
 * execution of `fn`. Invoked with the non-error callback results of `fn`.
 * @param {Function} [callback] - A callback which is called after the test
 * function has passed and repeated execution of `fn` has stopped. `callback`
 * will be passed an error and any arguments passed to the final `fn`'s
 * callback. Invoked with (err, [results]);
 */
function doUntil(fn, test, callback) {
    doWhilst(fn, function () {
        return !test.apply(this, arguments);
    }, callback);
}

/**
 * Like [`whilst`]{@link module:ControlFlow.whilst}, except the `test` is an asynchronous function that
 * is passed a callback in the form of `function (err, truth)`. If error is
 * passed to `test` or `fn`, the main callback is immediately called with the
 * value of the error.
 *
 * @name during
 * @static
 * @memberOf module:ControlFlow
 * @method
 * @see [async.whilst]{@link module:ControlFlow.whilst}
 * @category Control Flow
 * @param {Function} test - asynchronous truth test to perform before each
 * execution of `fn`. Invoked with (callback).
 * @param {Function} fn - A function which is called each time `test` passes.
 * The function is passed a `callback(err)`, which must be called once it has
 * completed with an optional `err` argument. Invoked with (callback).
 * @param {Function} [callback] - A callback which is called after the test
 * function has failed and repeated execution of `fn` has stopped. `callback`
 * will be passed an error, if one occured, otherwise `null`.
 * @example
 *
 * var count = 0;
 *
 * async.during(
 *     function (callback) {
 *         return callback(null, count < 5);
 *     },
 *     function (callback) {
 *         count++;
 *         setTimeout(callback, 1000);
 *     },
 *     function (err) {
 *         // 5 seconds have passed
 *     }
 * );
 */
function during(test, fn, callback) {
    callback = onlyOnce(callback || noop);

    function next(err) {
        if (err) return callback(err);
        test(check);
    }

    function check(err, truth) {
        if (err) return callback(err);
        if (!truth) return callback(null);
        fn(next);
    }

    test(check);
}

function _withoutIndex(iteratee) {
    return function (value, index, callback) {
        return iteratee(value, callback);
    };
}

/**
 * Applies the function `iteratee` to each item in `coll`, in parallel.
 * The `iteratee` is called with an item from the list, and a callback for when
 * it has finished. If the `iteratee` passes an error to its `callback`, the
 * main `callback` (for the `each` function) is immediately called with the
 * error.
 *
 * Note, that since this function applies `iteratee` to each item in parallel,
 * there is no guarantee that the iteratee functions will complete in order.
 *
 * @name each
 * @static
 * @memberOf module:Collections
 * @method
 * @alias forEach
 * @category Collection
 * @param {Array|Iterable|Object} coll - A collection to iterate over.
 * @param {Function} iteratee - A function to apply to each item
 * in `coll`. The iteratee is passed a `callback(err)` which must be called once
 * it has completed. If no error has occurred, the `callback` should be run
 * without arguments or with an explicit `null` argument. The array index is not
 * passed to the iteratee. Invoked with (item, callback). If you need the index,
 * use `eachOf`.
 * @param {Function} [callback] - A callback which is called when all
 * `iteratee` functions have finished, or an error occurs. Invoked with (err).
 * @example
 *
 * // assuming openFiles is an array of file names and saveFile is a function
 * // to save the modified contents of that file:
 *
 * async.each(openFiles, saveFile, function(err){
 *   // if any of the saves produced an error, err would equal that error
 * });
 *
 * // assuming openFiles is an array of file names
 * async.each(openFiles, function(file, callback) {
 *
 *     // Perform operation on file here.
 *     console.log('Processing file ' + file);
 *
 *     if( file.length > 32 ) {
 *       console.log('This file name is too long');
 *       callback('File name too long');
 *     } else {
 *       // Do work to process file here
 *       console.log('File processed');
 *       callback();
 *     }
 * }, function(err) {
 *     // if any of the file processing produced an error, err would equal that error
 *     if( err ) {
 *       // One of the iterations produced an error.
 *       // All processing will now stop.
 *       console.log('A file failed to process');
 *     } else {
 *       console.log('All files have been processed successfully');
 *     }
 * });
 */
function eachLimit(coll, iteratee, callback) {
  eachOf(coll, _withoutIndex(iteratee), callback);
}

/**
 * The same as [`each`]{@link module:Collections.each} but runs a maximum of `limit` async operations at a time.
 *
 * @name eachLimit
 * @static
 * @memberOf module:Collections
 * @method
 * @see [async.each]{@link module:Collections.each}
 * @alias forEachLimit
 * @category Collection
 * @param {Array|Iterable|Object} coll - A collection to iterate over.
 * @param {number} limit - The maximum number of async operations at a time.
 * @param {Function} iteratee - A function to apply to each item in `coll`. The
 * iteratee is passed a `callback(err)` which must be called once it has
 * completed. If no error has occurred, the `callback` should be run without
 * arguments or with an explicit `null` argument. The array index is not passed
 * to the iteratee. Invoked with (item, callback). If you need the index, use
 * `eachOfLimit`.
 * @param {Function} [callback] - A callback which is called when all
 * `iteratee` functions have finished, or an error occurs. Invoked with (err).
 */
function eachLimit$1(coll, limit, iteratee, callback) {
  _eachOfLimit(limit)(coll, _withoutIndex(iteratee), callback);
}

/**
 * The same as [`each`]{@link module:Collections.each} but runs only a single async operation at a time.
 *
 * @name eachSeries
 * @static
 * @memberOf module:Collections
 * @method
 * @see [async.each]{@link module:Collections.each}
 * @alias forEachSeries
 * @category Collection
 * @param {Array|Iterable|Object} coll - A collection to iterate over.
 * @param {Function} iteratee - A function to apply to each
 * item in `coll`. The iteratee is passed a `callback(err)` which must be called
 * once it has completed. If no error has occurred, the `callback` should be run
 * without arguments or with an explicit `null` argument. The array index is
 * not passed to the iteratee. Invoked with (item, callback). If you need the
 * index, use `eachOfSeries`.
 * @param {Function} [callback] - A callback which is called when all
 * `iteratee` functions have finished, or an error occurs. Invoked with (err).
 */
var eachSeries = doLimit(eachLimit$1, 1);

/**
 * Wrap an async function and ensure it calls its callback on a later tick of
 * the event loop.  If the function already calls its callback on a next tick,
 * no extra deferral is added. This is useful for preventing stack overflows
 * (`RangeError: Maximum call stack size exceeded`) and generally keeping
 * [Zalgo](http://blog.izs.me/post/59142742143/designing-apis-for-asynchrony)
 * contained.
 *
 * @name ensureAsync
 * @static
 * @memberOf module:Utils
 * @method
 * @category Util
 * @param {Function} fn - an async function, one that expects a node-style
 * callback as its last argument.
 * @returns {Function} Returns a wrapped function with the exact same call
 * signature as the function passed in.
 * @example
 *
 * function sometimesAsync(arg, callback) {
 *     if (cache[arg]) {
 *         return callback(null, cache[arg]); // this would be synchronous!!
 *     } else {
 *         doSomeIO(arg, callback); // this IO would be asynchronous
 *     }
 * }
 *
 * // this has a risk of stack overflows if many results are cached in a row
 * async.mapSeries(args, sometimesAsync, done);
 *
 * // this will defer sometimesAsync's callback if necessary,
 * // preventing stack overflows
 * async.mapSeries(args, async.ensureAsync(sometimesAsync), done);
 */
function ensureAsync(fn) {
    return initialParams(function (args, callback) {
        var sync = true;
        args.push(function () {
            var innerArgs = arguments;
            if (sync) {
                setImmediate$1(function () {
                    callback.apply(null, innerArgs);
                });
            } else {
                callback.apply(null, innerArgs);
            }
        });
        fn.apply(this, args);
        sync = false;
    });
}

function notId(v) {
    return !v;
}

/**
 * Returns `true` if every element in `coll` satisfies an async test. If any
 * iteratee call returns `false`, the main `callback` is immediately called.
 *
 * @name every
 * @static
 * @memberOf module:Collections
 * @method
 * @alias all
 * @category Collection
 * @param {Array|Iterable|Object} coll - A collection to iterate over.
 * @param {Function} iteratee - A truth test to apply to each item in the
 * collection in parallel. The iteratee is passed a `callback(err, truthValue)`
 * which must be called with a  boolean argument once it has completed. Invoked
 * with (item, callback).
 * @param {Function} [callback] - A callback which is called after all the
 * `iteratee` functions have finished. Result will be either `true` or `false`
 * depending on the values of the async tests. Invoked with (err, result).
 * @example
 *
 * async.every(['file1','file2','file3'], function(filePath, callback) {
 *     fs.access(filePath, function(err) {
 *         callback(null, !err)
 *     });
 * }, function(err, result) {
 *     // if result is true then every file exists
 * });
 */
var every = _createTester(eachOf, notId, notId);

/**
 * The same as [`every`]{@link module:Collections.every} but runs a maximum of `limit` async operations at a time.
 *
 * @name everyLimit
 * @static
 * @memberOf module:Collections
 * @method
 * @see [async.every]{@link module:Collections.every}
 * @alias allLimit
 * @category Collection
 * @param {Array|Iterable|Object} coll - A collection to iterate over.
 * @param {number} limit - The maximum number of async operations at a time.
 * @param {Function} iteratee - A truth test to apply to each item in the
 * collection in parallel. The iteratee is passed a `callback(err, truthValue)`
 * which must be called with a  boolean argument once it has completed. Invoked
 * with (item, callback).
 * @param {Function} [callback] - A callback which is called after all the
 * `iteratee` functions have finished. Result will be either `true` or `false`
 * depending on the values of the async tests. Invoked with (err, result).
 */
var everyLimit = _createTester(eachOfLimit, notId, notId);

/**
 * The same as [`every`]{@link module:Collections.every} but runs only a single async operation at a time.
 *
 * @name everySeries
 * @static
 * @memberOf module:Collections
 * @method
 * @see [async.every]{@link module:Collections.every}
 * @alias allSeries
 * @category Collection
 * @param {Array|Iterable|Object} coll - A collection to iterate over.
 * @param {Function} iteratee - A truth test to apply to each item in the
 * collection in parallel. The iteratee is passed a `callback(err, truthValue)`
 * which must be called with a  boolean argument once it has completed. Invoked
 * with (item, callback).
 * @param {Function} [callback] - A callback which is called after all the
 * `iteratee` functions have finished. Result will be either `true` or `false`
 * depending on the values of the async tests. Invoked with (err, result).
 */
var everySeries = doLimit(everyLimit, 1);

/**
 * The base implementation of `_.property` without support for deep paths.
 *
 * @private
 * @param {string} key The key of the property to get.
 * @returns {Function} Returns the new accessor function.
 */
function baseProperty(key) {
  return function(object) {
    return object == null ? undefined : object[key];
  };
}

function filterArray(eachfn, arr, iteratee, callback) {
    var truthValues = new Array(arr.length);
    eachfn(arr, function (x, index, callback) {
        iteratee(x, function (err, v) {
            truthValues[index] = !!v;
            callback(err);
        });
    }, function (err) {
        if (err) return callback(err);
        var results = [];
        for (var i = 0; i < arr.length; i++) {
            if (truthValues[i]) results.push(arr[i]);
        }
        callback(null, results);
    });
}

function filterGeneric(eachfn, coll, iteratee, callback) {
    var results = [];
    eachfn(coll, function (x, index, callback) {
        iteratee(x, function (err, v) {
            if (err) {
                callback(err);
            } else {
                if (v) {
                    results.push({ index: index, value: x });
                }
                callback();
            }
        });
    }, function (err) {
        if (err) {
            callback(err);
        } else {
            callback(null, arrayMap(results.sort(function (a, b) {
                return a.index - b.index;
            }), baseProperty('value')));
        }
    });
}

function _filter(eachfn, coll, iteratee, callback) {
    var filter = isArrayLike(coll) ? filterArray : filterGeneric;
    filter(eachfn, coll, iteratee, callback || noop);
}

/**
 * Returns a new array of all the values in `coll` which pass an async truth
 * test. This operation is performed in parallel, but the results array will be
 * in the same order as the original.
 *
 * @name filter
 * @static
 * @memberOf module:Collections
 * @method
 * @alias select
 * @category Collection
 * @param {Array|Iterable|Object} coll - A collection to iterate over.
 * @param {Function} iteratee - A truth test to apply to each item in `coll`.
 * The `iteratee` is passed a `callback(err, truthValue)`, which must be called
 * with a boolean argument once it has completed. Invoked with (item, callback).
 * @param {Function} [callback] - A callback which is called after all the
 * `iteratee` functions have finished. Invoked with (err, results).
 * @example
 *
 * async.filter(['file1','file2','file3'], function(filePath, callback) {
 *     fs.access(filePath, function(err) {
 *         callback(null, !err)
 *     });
 * }, function(err, results) {
 *     // results now equals an array of the existing files
 * });
 */
var filter = doParallel(_filter);

/**
 * The same as [`filter`]{@link module:Collections.filter} but runs a maximum of `limit` async operations at a
 * time.
 *
 * @name filterLimit
 * @static
 * @memberOf module:Collections
 * @method
 * @see [async.filter]{@link module:Collections.filter}
 * @alias selectLimit
 * @category Collection
 * @param {Array|Iterable|Object} coll - A collection to iterate over.
 * @param {number} limit - The maximum number of async operations at a time.
 * @param {Function} iteratee - A truth test to apply to each item in `coll`.
 * The `iteratee` is passed a `callback(err, truthValue)`, which must be called
 * with a boolean argument once it has completed. Invoked with (item, callback).
 * @param {Function} [callback] - A callback which is called after all the
 * `iteratee` functions have finished. Invoked with (err, results).
 */
var filterLimit = doParallelLimit(_filter);

/**
 * The same as [`filter`]{@link module:Collections.filter} but runs only a single async operation at a time.
 *
 * @name filterSeries
 * @static
 * @memberOf module:Collections
 * @method
 * @see [async.filter]{@link module:Collections.filter}
 * @alias selectSeries
 * @category Collection
 * @param {Array|Iterable|Object} coll - A collection to iterate over.
 * @param {Function} iteratee - A truth test to apply to each item in `coll`.
 * The `iteratee` is passed a `callback(err, truthValue)`, which must be called
 * with a boolean argument once it has completed. Invoked with (item, callback).
 * @param {Function} [callback] - A callback which is called after all the
 * `iteratee` functions have finished. Invoked with (err, results)
 */
var filterSeries = doLimit(filterLimit, 1);

/**
 * Calls the asynchronous function `fn` with a callback parameter that allows it
 * to call itself again, in series, indefinitely.

 * If an error is passed to the
 * callback then `errback` is called with the error, and execution stops,
 * otherwise it will never be called.
 *
 * @name forever
 * @static
 * @memberOf module:ControlFlow
 * @method
 * @category Control Flow
 * @param {Function} fn - a function to call repeatedly. Invoked with (next).
 * @param {Function} [errback] - when `fn` passes an error to it's callback,
 * this function will be called, and execution stops. Invoked with (err).
 * @example
 *
 * async.forever(
 *     function(next) {
 *         // next is suitable for passing to things that need a callback(err [, whatever]);
 *         // it will result in this function being called again.
 *     },
 *     function(err) {
 *         // if next is called with a value in its first parameter, it will appear
 *         // in here as 'err', and execution will stop.
 *     }
 * );
 */
function forever(fn, errback) {
    var done = onlyOnce(errback || noop);
    var task = ensureAsync(fn);

    function next(err) {
        if (err) return done(err);
        task(next);
    }
    next();
}

/**
 * Logs the result of an `async` function to the `console`. Only works in
 * Node.js or in browsers that support `console.log` and `console.error` (such
 * as FF and Chrome). If multiple arguments are returned from the async
 * function, `console.log` is called on each argument in order.
 *
 * @name log
 * @static
 * @memberOf module:Utils
 * @method
 * @category Util
 * @param {Function} function - The function you want to eventually apply all
 * arguments to.
 * @param {...*} arguments... - Any number of arguments to apply to the function.
 * @example
 *
 * // in a module
 * var hello = function(name, callback) {
 *     setTimeout(function() {
 *         callback(null, 'hello ' + name);
 *     }, 1000);
 * };
 *
 * // in the node repl
 * node> async.log(hello, 'world');
 * 'hello world'
 */
var log = consoleFunc('log');

/**
 * The same as [`mapValues`]{@link module:Collections.mapValues} but runs a maximum of `limit` async operations at a
 * time.
 *
 * @name mapValuesLimit
 * @static
 * @memberOf module:Collections
 * @method
 * @see [async.mapValues]{@link module:Collections.mapValues}
 * @category Collection
 * @param {Object} obj - A collection to iterate over.
 * @param {number} limit - The maximum number of async operations at a time.
 * @param {Function} iteratee - A function to apply to each value in `obj`.
 * The iteratee is passed a `callback(err, transformed)` which must be called
 * once it has completed with an error (which can be `null`) and a
 * transformed value. Invoked with (value, key, callback).
 * @param {Function} [callback] - A callback which is called when all `iteratee`
 * functions have finished, or an error occurs. `result` is a new object consisting
 * of each key from `obj`, with each transformed value on the right-hand side.
 * Invoked with (err, result).
 */
function mapValuesLimit(obj, limit, iteratee, callback) {
    callback = once(callback || noop);
    var newObj = {};
    eachOfLimit(obj, limit, function (val, key, next) {
        iteratee(val, key, function (err, result) {
            if (err) return next(err);
            newObj[key] = result;
            next();
        });
    }, function (err) {
        callback(err, newObj);
    });
}

/**
 * A relative of [`map`]{@link module:Collections.map}, designed for use with objects.
 *
 * Produces a new Object by mapping each value of `obj` through the `iteratee`
 * function. The `iteratee` is called each `value` and `key` from `obj` and a
 * callback for when it has finished processing. Each of these callbacks takes
 * two arguments: an `error`, and the transformed item from `obj`. If `iteratee`
 * passes an error to its callback, the main `callback` (for the `mapValues`
 * function) is immediately called with the error.
 *
 * Note, the order of the keys in the result is not guaranteed.  The keys will
 * be roughly in the order they complete, (but this is very engine-specific)
 *
 * @name mapValues
 * @static
 * @memberOf module:Collections
 * @method
 * @category Collection
 * @param {Object} obj - A collection to iterate over.
 * @param {Function} iteratee - A function to apply to each value and key in
 * `coll`. The iteratee is passed a `callback(err, transformed)` which must be
 * called once it has completed with an error (which can be `null`) and a
 * transformed value. Invoked with (value, key, callback).
 * @param {Function} [callback] - A callback which is called when all `iteratee`
 * functions have finished, or an error occurs. `result` is a new object consisting
 * of each key from `obj`, with each transformed value on the right-hand side.
 * Invoked with (err, result).
 * @example
 *
 * async.mapValues({
 *     f1: 'file1',
 *     f2: 'file2',
 *     f3: 'file3'
 * }, function (file, key, callback) {
 *   fs.stat(file, callback);
 * }, function(err, result) {
 *     // result is now a map of stats for each file, e.g.
 *     // {
 *     //     f1: [stats for file1],
 *     //     f2: [stats for file2],
 *     //     f3: [stats for file3]
 *     // }
 * });
 */

var mapValues = doLimit(mapValuesLimit, Infinity);

/**
 * The same as [`mapValues`]{@link module:Collections.mapValues} but runs only a single async operation at a time.
 *
 * @name mapValuesSeries
 * @static
 * @memberOf module:Collections
 * @method
 * @see [async.mapValues]{@link module:Collections.mapValues}
 * @category Collection
 * @param {Object} obj - A collection to iterate over.
 * @param {Function} iteratee - A function to apply to each value in `obj`.
 * The iteratee is passed a `callback(err, transformed)` which must be called
 * once it has completed with an error (which can be `null`) and a
 * transformed value. Invoked with (value, key, callback).
 * @param {Function} [callback] - A callback which is called when all `iteratee`
 * functions have finished, or an error occurs. `result` is a new object consisting
 * of each key from `obj`, with each transformed value on the right-hand side.
 * Invoked with (err, result).
 */
var mapValuesSeries = doLimit(mapValuesLimit, 1);

function has(obj, key) {
    return key in obj;
}

/**
 * Caches the results of an `async` function. When creating a hash to store
 * function results against, the callback is omitted from the hash and an
 * optional hash function can be used.
 *
 * If no hash function is specified, the first argument is used as a hash key,
 * which may work reasonably if it is a string or a data type that converts to a
 * distinct string. Note that objects and arrays will not behave reasonably.
 * Neither will cases where the other arguments are significant. In such cases,
 * specify your own hash function.
 *
 * The cache of results is exposed as the `memo` property of the function
 * returned by `memoize`.
 *
 * @name memoize
 * @static
 * @memberOf module:Utils
 * @method
 * @category Util
 * @param {Function} fn - The function to proxy and cache results from.
 * @param {Function} hasher - An optional function for generating a custom hash
 * for storing results. It has all the arguments applied to it apart from the
 * callback, and must be synchronous.
 * @returns {Function} a memoized version of `fn`
 * @example
 *
 * var slow_fn = function(name, callback) {
 *     // do something
 *     callback(null, result);
 * };
 * var fn = async.memoize(slow_fn);
 *
 * // fn can now be used as if it were slow_fn
 * fn('some name', function() {
 *     // callback
 * });
 */
function memoize(fn, hasher) {
    var memo = Object.create(null);
    var queues = Object.create(null);
    hasher = hasher || identity;
    var memoized = initialParams(function memoized(args, callback) {
        var key = hasher.apply(null, args);
        if (has(memo, key)) {
            setImmediate$1(function () {
                callback.apply(null, memo[key]);
            });
        } else if (has(queues, key)) {
            queues[key].push(callback);
        } else {
            queues[key] = [callback];
            fn.apply(null, args.concat([rest(function (args) {
                memo[key] = args;
                var q = queues[key];
                delete queues[key];
                for (var i = 0, l = q.length; i < l; i++) {
                    q[i].apply(null, args);
                }
            })]));
        }
    });
    memoized.memo = memo;
    memoized.unmemoized = fn;
    return memoized;
}

/**
 * Calls `callback` on a later loop around the event loop. In Node.js this just
 * calls `setImmediate`.  In the browser it will use `setImmediate` if
 * available, otherwise `setTimeout(callback, 0)`, which means other higher
 * priority events may precede the execution of `callback`.
 *
 * This is used internally for browser-compatibility purposes.
 *
 * @name nextTick
 * @static
 * @memberOf module:Utils
 * @method
 * @alias setImmediate
 * @category Util
 * @param {Function} callback - The function to call on a later loop around
 * the event loop. Invoked with (args...).
 * @param {...*} args... - any number of additional arguments to pass to the
 * callback on the next tick.
 * @example
 *
 * var call_order = [];
 * async.nextTick(function() {
 *     call_order.push('two');
 *     // call_order now equals ['one','two']
 * });
 * call_order.push('one');
 *
 * async.setImmediate(function (a, b, c) {
 *     // a, b, and c equal 1, 2, and 3
 * }, 1, 2, 3);
 */
var _defer$1;

if (hasNextTick) {
    _defer$1 = process.nextTick;
} else if (hasSetImmediate) {
    _defer$1 = setImmediate;
} else {
    _defer$1 = fallback;
}

var nextTick = wrap(_defer$1);

function _parallel(eachfn, tasks, callback) {
    callback = callback || noop;
    var results = isArrayLike(tasks) ? [] : {};

    eachfn(tasks, function (task, key, callback) {
        task(rest(function (err, args) {
            if (args.length <= 1) {
                args = args[0];
            }
            results[key] = args;
            callback(err);
        }));
    }, function (err) {
        callback(err, results);
    });
}

/**
 * Run the `tasks` collection of functions in parallel, without waiting until
 * the previous function has completed. If any of the functions pass an error to
 * its callback, the main `callback` is immediately called with the value of the
 * error. Once the `tasks` have completed, the results are passed to the final
 * `callback` as an array.
 *
 * **Note:** `parallel` is about kicking-off I/O tasks in parallel, not about
 * parallel execution of code.  If your tasks do not use any timers or perform
 * any I/O, they will actually be executed in series.  Any synchronous setup
 * sections for each task will happen one after the other.  JavaScript remains
 * single-threaded.
 *
 * It is also possible to use an object instead of an array. Each property will
 * be run as a function and the results will be passed to the final `callback`
 * as an object instead of an array. This can be a more readable way of handling
 * results from {@link async.parallel}.
 *
 * @name parallel
 * @static
 * @memberOf module:ControlFlow
 * @method
 * @category Control Flow
 * @param {Array|Iterable|Object} tasks - A collection containing functions to run.
 * Each function is passed a `callback(err, result)` which it must call on
 * completion with an error `err` (which can be `null`) and an optional `result`
 * value.
 * @param {Function} [callback] - An optional callback to run once all the
 * functions have completed successfully. This function gets a results array
 * (or object) containing all the result arguments passed to the task callbacks.
 * Invoked with (err, results).
 * @example
 * async.parallel([
 *     function(callback) {
 *         setTimeout(function() {
 *             callback(null, 'one');
 *         }, 200);
 *     },
 *     function(callback) {
 *         setTimeout(function() {
 *             callback(null, 'two');
 *         }, 100);
 *     }
 * ],
 * // optional callback
 * function(err, results) {
 *     // the results array will equal ['one','two'] even though
 *     // the second function had a shorter timeout.
 * });
 *
 * // an example using an object instead of an array
 * async.parallel({
 *     one: function(callback) {
 *         setTimeout(function() {
 *             callback(null, 1);
 *         }, 200);
 *     },
 *     two: function(callback) {
 *         setTimeout(function() {
 *             callback(null, 2);
 *         }, 100);
 *     }
 * }, function(err, results) {
 *     // results is now equals to: {one: 1, two: 2}
 * });
 */
function parallelLimit(tasks, callback) {
  _parallel(eachOf, tasks, callback);
}

/**
 * The same as [`parallel`]{@link module:ControlFlow.parallel} but runs a maximum of `limit` async operations at a
 * time.
 *
 * @name parallelLimit
 * @static
 * @memberOf module:ControlFlow
 * @method
 * @see [async.parallel]{@link module:ControlFlow.parallel}
 * @category Control Flow
 * @param {Array|Collection} tasks - A collection containing functions to run.
 * Each function is passed a `callback(err, result)` which it must call on
 * completion with an error `err` (which can be `null`) and an optional `result`
 * value.
 * @param {number} limit - The maximum number of async operations at a time.
 * @param {Function} [callback] - An optional callback to run once all the
 * functions have completed successfully. This function gets a results array
 * (or object) containing all the result arguments passed to the task callbacks.
 * Invoked with (err, results).
 */
function parallelLimit$1(tasks, limit, callback) {
  _parallel(_eachOfLimit(limit), tasks, callback);
}

/**
 * A queue of tasks for the worker function to complete.
 * @typedef {Object} QueueObject
 * @memberOf module:ControlFlow
 * @property {Function} length - a function returning the number of items
 * waiting to be processed. Invoke with `queue.length()`.
 * @property {boolean} started - a boolean indicating whether or not any
 * items have been pushed and processed by the queue.
 * @property {Function} running - a function returning the number of items
 * currently being processed. Invoke with `queue.running()`.
 * @property {Function} workersList - a function returning the array of items
 * currently being processed. Invoke with `queue.workersList()`.
 * @property {Function} idle - a function returning false if there are items
 * waiting or being processed, or true if not. Invoke with `queue.idle()`.
 * @property {number} concurrency - an integer for determining how many `worker`
 * functions should be run in parallel. This property can be changed after a
 * `queue` is created to alter the concurrency on-the-fly.
 * @property {Function} push - add a new task to the `queue`. Calls `callback`
 * once the `worker` has finished processing the task. Instead of a single task,
 * a `tasks` array can be submitted. The respective callback is used for every
 * task in the list. Invoke with `queue.push(task, [callback])`,
 * @property {Function} unshift - add a new task to the front of the `queue`.
 * Invoke with `queue.unshift(task, [callback])`.
 * @property {Function} saturated - a callback that is called when the number of
 * running workers hits the `concurrency` limit, and further tasks will be
 * queued.
 * @property {Function} unsaturated - a callback that is called when the number
 * of running workers is less than the `concurrency` & `buffer` limits, and
 * further tasks will not be queued.
 * @property {number} buffer - A minimum threshold buffer in order to say that
 * the `queue` is `unsaturated`.
 * @property {Function} empty - a callback that is called when the last item
 * from the `queue` is given to a `worker`.
 * @property {Function} drain - a callback that is called when the last item
 * from the `queue` has returned from the `worker`.
 * @property {Function} error - a callback that is called when a task errors.
 * Has the signature `function(error, task)`.
 * @property {boolean} paused - a boolean for determining whether the queue is
 * in a paused state.
 * @property {Function} pause - a function that pauses the processing of tasks
 * until `resume()` is called. Invoke with `queue.pause()`.
 * @property {Function} resume - a function that resumes the processing of
 * queued tasks when the queue is paused. Invoke with `queue.resume()`.
 * @property {Function} kill - a function that removes the `drain` callback and
 * empties remaining tasks from the queue forcing it to go idle. Invoke with `queue.kill()`.
 */

/**
 * Creates a `queue` object with the specified `concurrency`. Tasks added to the
 * `queue` are processed in parallel (up to the `concurrency` limit). If all
 * `worker`s are in progress, the task is queued until one becomes available.
 * Once a `worker` completes a `task`, that `task`'s callback is called.
 *
 * @name queue
 * @static
 * @memberOf module:ControlFlow
 * @method
 * @category Control Flow
 * @param {Function} worker - An asynchronous function for processing a queued
 * task, which must call its `callback(err)` argument when finished, with an
 * optional `error` as an argument.  If you want to handle errors from an
 * individual task, pass a callback to `q.push()`. Invoked with
 * (task, callback).
 * @param {number} [concurrency=1] - An `integer` for determining how many
 * `worker` functions should be run in parallel.  If omitted, the concurrency
 * defaults to `1`.  If the concurrency is `0`, an error is thrown.
 * @returns {module:ControlFlow.QueueObject} A queue object to manage the tasks. Callbacks can
 * attached as certain properties to listen for specific events during the
 * lifecycle of the queue.
 * @example
 *
 * // create a queue object with concurrency 2
 * var q = async.queue(function(task, callback) {
 *     console.log('hello ' + task.name);
 *     callback();
 * }, 2);
 *
 * // assign a callback
 * q.drain = function() {
 *     console.log('all items have been processed');
 * };
 *
 * // add some items to the queue
 * q.push({name: 'foo'}, function(err) {
 *     console.log('finished processing foo');
 * });
 * q.push({name: 'bar'}, function (err) {
 *     console.log('finished processing bar');
 * });
 *
 * // add some items to the queue (batch-wise)
 * q.push([{name: 'baz'},{name: 'bay'},{name: 'bax'}], function(err) {
 *     console.log('finished processing item');
 * });
 *
 * // add some items to the front of the queue
 * q.unshift({name: 'bar'}, function (err) {
 *     console.log('finished processing bar');
 * });
 */
var queue$1 = function (worker, concurrency) {
  return queue(function (items, cb) {
    worker(items[0], cb);
  }, concurrency, 1);
};

/**
 * The same as [async.queue]{@link module:ControlFlow.queue} only tasks are assigned a priority and
 * completed in ascending priority order.
 *
 * @name priorityQueue
 * @static
 * @memberOf module:ControlFlow
 * @method
 * @see [async.queue]{@link module:ControlFlow.queue}
 * @category Control Flow
 * @param {Function} worker - An asynchronous function for processing a queued
 * task, which must call its `callback(err)` argument when finished, with an
 * optional `error` as an argument.  If you want to handle errors from an
 * individual task, pass a callback to `q.push()`. Invoked with
 * (task, callback).
 * @param {number} concurrency - An `integer` for determining how many `worker`
 * functions should be run in parallel.  If omitted, the concurrency defaults to
 * `1`.  If the concurrency is `0`, an error is thrown.
 * @returns {module:ControlFlow.QueueObject} A priorityQueue object to manage the tasks. There are two
 * differences between `queue` and `priorityQueue` objects:
 * * `push(task, priority, [callback])` - `priority` should be a number. If an
 *   array of `tasks` is given, all tasks will be assigned the same priority.
 * * The `unshift` method was removed.
 */
var priorityQueue = function (worker, concurrency) {
    // Start with a normal queue
    var q = queue$1(worker, concurrency);

    // Override push to accept second parameter representing priority
    q.push = function (data, priority, callback) {
        if (callback == null) callback = noop;
        if (typeof callback !== 'function') {
            throw new Error('task callback must be a function');
        }
        q.started = true;
        if (!isArray(data)) {
            data = [data];
        }
        if (data.length === 0) {
            // call drain immediately if there are no tasks
            return setImmediate$1(function () {
                q.drain();
            });
        }

        priority = priority || 0;
        var nextNode = q._tasks.head;
        while (nextNode && priority >= nextNode.priority) {
            nextNode = nextNode.next;
        }

        for (var i = 0, l = data.length; i < l; i++) {
            var item = {
                data: data[i],
                priority: priority,
                callback: callback
            };

            if (nextNode) {
                q._tasks.insertBefore(nextNode, item);
            } else {
                q._tasks.push(item);
            }
        }
        setImmediate$1(q.process);
    };

    // Remove unshift function
    delete q.unshift;

    return q;
};

/**
 * Runs the `tasks` array of functions in parallel, without waiting until the
 * previous function has completed. Once any of the `tasks` complete or pass an
 * error to its callback, the main `callback` is immediately called. It's
 * equivalent to `Promise.race()`.
 *
 * @name race
 * @static
 * @memberOf module:ControlFlow
 * @method
 * @category Control Flow
 * @param {Array} tasks - An array containing functions to run. Each function
 * is passed a `callback(err, result)` which it must call on completion with an
 * error `err` (which can be `null`) and an optional `result` value.
 * @param {Function} callback - A callback to run once any of the functions have
 * completed. This function gets an error or result from the first function that
 * completed. Invoked with (err, result).
 * @returns undefined
 * @example
 *
 * async.race([
 *     function(callback) {
 *         setTimeout(function() {
 *             callback(null, 'one');
 *         }, 200);
 *     },
 *     function(callback) {
 *         setTimeout(function() {
 *             callback(null, 'two');
 *         }, 100);
 *     }
 * ],
 * // main callback
 * function(err, result) {
 *     // the result will be equal to 'two' as it finishes earlier
 * });
 */
function race(tasks, callback) {
    callback = once(callback || noop);
    if (!isArray(tasks)) return callback(new TypeError('First argument to race must be an array of functions'));
    if (!tasks.length) return callback();
    for (var i = 0, l = tasks.length; i < l; i++) {
        tasks[i](callback);
    }
}

var slice = Array.prototype.slice;

/**
 * Same as [`reduce`]{@link module:Collections.reduce}, only operates on `array` in reverse order.
 *
 * @name reduceRight
 * @static
 * @memberOf module:Collections
 * @method
 * @see [async.reduce]{@link module:Collections.reduce}
 * @alias foldr
 * @category Collection
 * @param {Array} array - A collection to iterate over.
 * @param {*} memo - The initial state of the reduction.
 * @param {Function} iteratee - A function applied to each item in the
 * array to produce the next step in the reduction. The `iteratee` is passed a
 * `callback(err, reduction)` which accepts an optional error as its first
 * argument, and the state of the reduction as the second. If an error is
 * passed to the callback, the reduction is stopped and the main `callback` is
 * immediately called with the error. Invoked with (memo, item, callback).
 * @param {Function} [callback] - A callback which is called after all the
 * `iteratee` functions have finished. Result is the reduced value. Invoked with
 * (err, result).
 */
function reduceRight(array, memo, iteratee, callback) {
  var reversed = slice.call(array).reverse();
  reduce(reversed, memo, iteratee, callback);
}

/**
 * Wraps the function in another function that always returns data even when it
 * errors.
 *
 * The object returned has either the property `error` or `value`.
 *
 * @name reflect
 * @static
 * @memberOf module:Utils
 * @method
 * @category Util
 * @param {Function} fn - The function you want to wrap
 * @returns {Function} - A function that always passes null to it's callback as
 * the error. The second argument to the callback will be an `object` with
 * either an `error` or a `value` property.
 * @example
 *
 * async.parallel([
 *     async.reflect(function(callback) {
 *         // do some stuff ...
 *         callback(null, 'one');
 *     }),
 *     async.reflect(function(callback) {
 *         // do some more stuff but error ...
 *         callback('bad stuff happened');
 *     }),
 *     async.reflect(function(callback) {
 *         // do some more stuff ...
 *         callback(null, 'two');
 *     })
 * ],
 * // optional callback
 * function(err, results) {
 *     // values
 *     // results[0].value = 'one'
 *     // results[1].error = 'bad stuff happened'
 *     // results[2].value = 'two'
 * });
 */
function reflect(fn) {
    return initialParams(function reflectOn(args, reflectCallback) {
        args.push(rest(function callback(err, cbArgs) {
            if (err) {
                reflectCallback(null, {
                    error: err
                });
            } else {
                var value = null;
                if (cbArgs.length === 1) {
                    value = cbArgs[0];
                } else if (cbArgs.length > 1) {
                    value = cbArgs;
                }
                reflectCallback(null, {
                    value: value
                });
            }
        }));

        return fn.apply(this, args);
    });
}

function reject$1(eachfn, arr, iteratee, callback) {
    _filter(eachfn, arr, function (value, cb) {
        iteratee(value, function (err, v) {
            cb(err, !v);
        });
    }, callback);
}

/**
 * The opposite of [`filter`]{@link module:Collections.filter}. Removes values that pass an `async` truth test.
 *
 * @name reject
 * @static
 * @memberOf module:Collections
 * @method
 * @see [async.filter]{@link module:Collections.filter}
 * @category Collection
 * @param {Array|Iterable|Object} coll - A collection to iterate over.
 * @param {Function} iteratee - A truth test to apply to each item in `coll`.
 * The `iteratee` is passed a `callback(err, truthValue)`, which must be called
 * with a boolean argument once it has completed. Invoked with (item, callback).
 * @param {Function} [callback] - A callback which is called after all the
 * `iteratee` functions have finished. Invoked with (err, results).
 * @example
 *
 * async.reject(['file1','file2','file3'], function(filePath, callback) {
 *     fs.access(filePath, function(err) {
 *         callback(null, !err)
 *     });
 * }, function(err, results) {
 *     // results now equals an array of missing files
 *     createFiles(results);
 * });
 */
var reject = doParallel(reject$1);

/**
 * A helper function that wraps an array or an object of functions with reflect.
 *
 * @name reflectAll
 * @static
 * @memberOf module:Utils
 * @method
 * @see [async.reflect]{@link module:Utils.reflect}
 * @category Util
 * @param {Array} tasks - The array of functions to wrap in `async.reflect`.
 * @returns {Array} Returns an array of functions, each function wrapped in
 * `async.reflect`
 * @example
 *
 * let tasks = [
 *     function(callback) {
 *         setTimeout(function() {
 *             callback(null, 'one');
 *         }, 200);
 *     },
 *     function(callback) {
 *         // do some more stuff but error ...
 *         callback(new Error('bad stuff happened'));
 *     },
 *     function(callback) {
 *         setTimeout(function() {
 *             callback(null, 'two');
 *         }, 100);
 *     }
 * ];
 *
 * async.parallel(async.reflectAll(tasks),
 * // optional callback
 * function(err, results) {
 *     // values
 *     // results[0].value = 'one'
 *     // results[1].error = Error('bad stuff happened')
 *     // results[2].value = 'two'
 * });
 *
 * // an example using an object instead of an array
 * let tasks = {
 *     one: function(callback) {
 *         setTimeout(function() {
 *             callback(null, 'one');
 *         }, 200);
 *     },
 *     two: function(callback) {
 *         callback('two');
 *     },
 *     three: function(callback) {
 *         setTimeout(function() {
 *             callback(null, 'three');
 *         }, 100);
 *     }
 * };
 *
 * async.parallel(async.reflectAll(tasks),
 * // optional callback
 * function(err, results) {
 *     // values
 *     // results.one.value = 'one'
 *     // results.two.error = 'two'
 *     // results.three.value = 'three'
 * });
 */
function reflectAll(tasks) {
    var results;
    if (isArray(tasks)) {
        results = arrayMap(tasks, reflect);
    } else {
        results = {};
        baseForOwn(tasks, function (task, key) {
            results[key] = reflect.call(this, task);
        });
    }
    return results;
}

/**
 * The same as [`reject`]{@link module:Collections.reject} but runs a maximum of `limit` async operations at a
 * time.
 *
 * @name rejectLimit
 * @static
 * @memberOf module:Collections
 * @method
 * @see [async.reject]{@link module:Collections.reject}
 * @category Collection
 * @param {Array|Iterable|Object} coll - A collection to iterate over.
 * @param {number} limit - The maximum number of async operations at a time.
 * @param {Function} iteratee - A truth test to apply to each item in `coll`.
 * The `iteratee` is passed a `callback(err, truthValue)`, which must be called
 * with a boolean argument once it has completed. Invoked with (item, callback).
 * @param {Function} [callback] - A callback which is called after all the
 * `iteratee` functions have finished. Invoked with (err, results).
 */
var rejectLimit = doParallelLimit(reject$1);

/**
 * The same as [`reject`]{@link module:Collections.reject} but runs only a single async operation at a time.
 *
 * @name rejectSeries
 * @static
 * @memberOf module:Collections
 * @method
 * @see [async.reject]{@link module:Collections.reject}
 * @category Collection
 * @param {Array|Iterable|Object} coll - A collection to iterate over.
 * @param {Function} iteratee - A truth test to apply to each item in `coll`.
 * The `iteratee` is passed a `callback(err, truthValue)`, which must be called
 * with a boolean argument once it has completed. Invoked with (item, callback).
 * @param {Function} [callback] - A callback which is called after all the
 * `iteratee` functions have finished. Invoked with (err, results).
 */
var rejectSeries = doLimit(rejectLimit, 1);

/**
 * Creates a function that returns `value`.
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Util
 * @param {*} value The value to return from the new function.
 * @returns {Function} Returns the new constant function.
 * @example
 *
 * var objects = _.times(2, _.constant({ 'a': 1 }));
 *
 * console.log(objects);
 * // => [{ 'a': 1 }, { 'a': 1 }]
 *
 * console.log(objects[0] === objects[1]);
 * // => true
 */
function constant$1(value) {
  return function() {
    return value;
  };
}

/**
 * Attempts to get a successful response from `task` no more than `times` times
 * before returning an error. If the task is successful, the `callback` will be
 * passed the result of the successful task. If all attempts fail, the callback
 * will be passed the error and result (if any) of the final attempt.
 *
 * @name retry
 * @static
 * @memberOf module:ControlFlow
 * @method
 * @category Control Flow
 * @param {Object|number} [opts = {times: 5, interval: 0}| 5] - Can be either an
 * object with `times` and `interval` or a number.
 * * `times` - The number of attempts to make before giving up.  The default
 *   is `5`.
 * * `interval` - The time to wait between retries, in milliseconds.  The
 *   default is `0`. The interval may also be specified as a function of the
 *   retry count (see example).
 * * `errorFilter` - An optional synchronous function that is invoked on
 *   erroneous result. If it returns `true` the retry attempts will continue;
 *   if the function returns `false` the retry flow is aborted with the current
 *   attempt's error and result being returned to the final callback.
 *   Invoked with (err).
 * * If `opts` is a number, the number specifies the number of times to retry,
 *   with the default interval of `0`.
 * @param {Function} task - A function which receives two arguments: (1) a
 * `callback(err, result)` which must be called when finished, passing `err`
 * (which can be `null`) and the `result` of the function's execution, and (2)
 * a `results` object, containing the results of the previously executed
 * functions (if nested inside another control flow). Invoked with
 * (callback, results).
 * @param {Function} [callback] - An optional callback which is called when the
 * task has succeeded, or after the final failed attempt. It receives the `err`
 * and `result` arguments of the last attempt at completing the `task`. Invoked
 * with (err, results).
 * @example
 *
 * // The `retry` function can be used as a stand-alone control flow by passing
 * // a callback, as shown below:
 *
 * // try calling apiMethod 3 times
 * async.retry(3, apiMethod, function(err, result) {
 *     // do something with the result
 * });
 *
 * // try calling apiMethod 3 times, waiting 200 ms between each retry
 * async.retry({times: 3, interval: 200}, apiMethod, function(err, result) {
 *     // do something with the result
 * });
 *
 * // try calling apiMethod 10 times with exponential backoff
 * // (i.e. intervals of 100, 200, 400, 800, 1600, ... milliseconds)
 * async.retry({
 *   times: 10,
 *   interval: function(retryCount) {
 *     return 50 * Math.pow(2, retryCount);
 *   }
 * }, apiMethod, function(err, result) {
 *     // do something with the result
 * });
 *
 * // try calling apiMethod the default 5 times no delay between each retry
 * async.retry(apiMethod, function(err, result) {
 *     // do something with the result
 * });
 *
 * // try calling apiMethod only when error condition satisfies, all other
 * // errors will abort the retry control flow and return to final callback
 * async.retry({
 *   errorFilter: function(err) {
 *     return err.message === 'Temporary error'; // only retry on a specific error
 *   }
 * }, apiMethod, function(err, result) {
 *     // do something with the result
 * });
 *
 * // It can also be embedded within other control flow functions to retry
 * // individual methods that are not as reliable, like this:
 * async.auto({
 *     users: api.getUsers.bind(api),
 *     payments: async.retry(3, api.getPayments.bind(api))
 * }, function(err, results) {
 *     // do something with the results
 * });
 *
 */
function retry(opts, task, callback) {
    var DEFAULT_TIMES = 5;
    var DEFAULT_INTERVAL = 0;

    var options = {
        times: DEFAULT_TIMES,
        intervalFunc: constant$1(DEFAULT_INTERVAL)
    };

    function parseTimes(acc, t) {
        if (typeof t === 'object') {
            acc.times = +t.times || DEFAULT_TIMES;

            acc.intervalFunc = typeof t.interval === 'function' ? t.interval : constant$1(+t.interval || DEFAULT_INTERVAL);

            acc.errorFilter = t.errorFilter;
        } else if (typeof t === 'number' || typeof t === 'string') {
            acc.times = +t || DEFAULT_TIMES;
        } else {
            throw new Error("Invalid arguments for async.retry");
        }
    }

    if (arguments.length < 3 && typeof opts === 'function') {
        callback = task || noop;
        task = opts;
    } else {
        parseTimes(options, opts);
        callback = callback || noop;
    }

    if (typeof task !== 'function') {
        throw new Error("Invalid arguments for async.retry");
    }

    var attempt = 1;
    function retryAttempt() {
        task(function (err) {
            if (err && attempt++ < options.times && (typeof options.errorFilter != 'function' || options.errorFilter(err))) {
                setTimeout(retryAttempt, options.intervalFunc(attempt));
            } else {
                callback.apply(null, arguments);
            }
        });
    }

    retryAttempt();
}

/**
 * A close relative of [`retry`]{@link module:ControlFlow.retry}.  This method wraps a task and makes it
 * retryable, rather than immediately calling it with retries.
 *
 * @name retryable
 * @static
 * @memberOf module:ControlFlow
 * @method
 * @see [async.retry]{@link module:ControlFlow.retry}
 * @category Control Flow
 * @param {Object|number} [opts = {times: 5, interval: 0}| 5] - optional
 * options, exactly the same as from `retry`
 * @param {Function} task - the asynchronous function to wrap
 * @returns {Functions} The wrapped function, which when invoked, will retry on
 * an error, based on the parameters specified in `opts`.
 * @example
 *
 * async.auto({
 *     dep1: async.retryable(3, getFromFlakyService),
 *     process: ["dep1", async.retryable(3, function (results, cb) {
 *         maybeProcessData(results.dep1, cb);
 *     })]
 * }, callback);
 */
var retryable = function (opts, task) {
    if (!task) {
        task = opts;
        opts = null;
    }
    return initialParams(function (args, callback) {
        function taskFn(cb) {
            task.apply(null, args.concat([cb]));
        }

        if (opts) retry(opts, taskFn, callback);else retry(taskFn, callback);
    });
};

/**
 * Run the functions in the `tasks` collection in series, each one running once
 * the previous function has completed. If any functions in the series pass an
 * error to its callback, no more functions are run, and `callback` is
 * immediately called with the value of the error. Otherwise, `callback`
 * receives an array of results when `tasks` have completed.
 *
 * It is also possible to use an object instead of an array. Each property will
 * be run as a function, and the results will be passed to the final `callback`
 * as an object instead of an array. This can be a more readable way of handling
 *  results from {@link async.series}.
 *
 * **Note** that while many implementations preserve the order of object
 * properties, the [ECMAScript Language Specification](http://www.ecma-international.org/ecma-262/5.1/#sec-8.6)
 * explicitly states that
 *
 * > The mechanics and order of enumerating the properties is not specified.
 *
 * So if you rely on the order in which your series of functions are executed,
 * and want this to work on all platforms, consider using an array.
 *
 * @name series
 * @static
 * @memberOf module:ControlFlow
 * @method
 * @category Control Flow
 * @param {Array|Iterable|Object} tasks - A collection containing functions to run, each
 * function is passed a `callback(err, result)` it must call on completion with
 * an error `err` (which can be `null`) and an optional `result` value.
 * @param {Function} [callback] - An optional callback to run once all the
 * functions have completed. This function gets a results array (or object)
 * containing all the result arguments passed to the `task` callbacks. Invoked
 * with (err, result).
 * @example
 * async.series([
 *     function(callback) {
 *         // do some stuff ...
 *         callback(null, 'one');
 *     },
 *     function(callback) {
 *         // do some more stuff ...
 *         callback(null, 'two');
 *     }
 * ],
 * // optional callback
 * function(err, results) {
 *     // results is now equal to ['one', 'two']
 * });
 *
 * async.series({
 *     one: function(callback) {
 *         setTimeout(function() {
 *             callback(null, 1);
 *         }, 200);
 *     },
 *     two: function(callback){
 *         setTimeout(function() {
 *             callback(null, 2);
 *         }, 100);
 *     }
 * }, function(err, results) {
 *     // results is now equal to: {one: 1, two: 2}
 * });
 */
function series(tasks, callback) {
  _parallel(eachOfSeries, tasks, callback);
}

/**
 * Returns `true` if at least one element in the `coll` satisfies an async test.
 * If any iteratee call returns `true`, the main `callback` is immediately
 * called.
 *
 * @name some
 * @static
 * @memberOf module:Collections
 * @method
 * @alias any
 * @category Collection
 * @param {Array|Iterable|Object} coll - A collection to iterate over.
 * @param {Function} iteratee - A truth test to apply to each item in the array
 * in parallel. The iteratee is passed a `callback(err, truthValue)` which must
 * be called with a boolean argument once it has completed. Invoked with
 * (item, callback).
 * @param {Function} [callback] - A callback which is called as soon as any
 * iteratee returns `true`, or after all the iteratee functions have finished.
 * Result will be either `true` or `false` depending on the values of the async
 * tests. Invoked with (err, result).
 * @example
 *
 * async.some(['file1','file2','file3'], function(filePath, callback) {
 *     fs.access(filePath, function(err) {
 *         callback(null, !err)
 *     });
 * }, function(err, result) {
 *     // if result is true then at least one of the files exists
 * });
 */
var some = _createTester(eachOf, Boolean, identity);

/**
 * The same as [`some`]{@link module:Collections.some} but runs a maximum of `limit` async operations at a time.
 *
 * @name someLimit
 * @static
 * @memberOf module:Collections
 * @method
 * @see [async.some]{@link module:Collections.some}
 * @alias anyLimit
 * @category Collection
 * @param {Array|Iterable|Object} coll - A collection to iterate over.
 * @param {number} limit - The maximum number of async operations at a time.
 * @param {Function} iteratee - A truth test to apply to each item in the array
 * in parallel. The iteratee is passed a `callback(err, truthValue)` which must
 * be called with a boolean argument once it has completed. Invoked with
 * (item, callback).
 * @param {Function} [callback] - A callback which is called as soon as any
 * iteratee returns `true`, or after all the iteratee functions have finished.
 * Result will be either `true` or `false` depending on the values of the async
 * tests. Invoked with (err, result).
 */
var someLimit = _createTester(eachOfLimit, Boolean, identity);

/**
 * The same as [`some`]{@link module:Collections.some} but runs only a single async operation at a time.
 *
 * @name someSeries
 * @static
 * @memberOf module:Collections
 * @method
 * @see [async.some]{@link module:Collections.some}
 * @alias anySeries
 * @category Collection
 * @param {Array|Iterable|Object} coll - A collection to iterate over.
 * @param {Function} iteratee - A truth test to apply to each item in the array
 * in parallel. The iteratee is passed a `callback(err, truthValue)` which must
 * be called with a boolean argument once it has completed. Invoked with
 * (item, callback).
 * @param {Function} [callback] - A callback which is called as soon as any
 * iteratee returns `true`, or after all the iteratee functions have finished.
 * Result will be either `true` or `false` depending on the values of the async
 * tests. Invoked with (err, result).
 */
var someSeries = doLimit(someLimit, 1);

/**
 * Sorts a list by the results of running each `coll` value through an async
 * `iteratee`.
 *
 * @name sortBy
 * @static
 * @memberOf module:Collections
 * @method
 * @category Collection
 * @param {Array|Iterable|Object} coll - A collection to iterate over.
 * @param {Function} iteratee - A function to apply to each item in `coll`.
 * The iteratee is passed a `callback(err, sortValue)` which must be called once
 * it has completed with an error (which can be `null`) and a value to use as
 * the sort criteria. Invoked with (item, callback).
 * @param {Function} callback - A callback which is called after all the
 * `iteratee` functions have finished, or an error occurs. Results is the items
 * from the original `coll` sorted by the values returned by the `iteratee`
 * calls. Invoked with (err, results).
 * @example
 *
 * async.sortBy(['file1','file2','file3'], function(file, callback) {
 *     fs.stat(file, function(err, stats) {
 *         callback(err, stats.mtime);
 *     });
 * }, function(err, results) {
 *     // results is now the original array of files sorted by
 *     // modified date
 * });
 *
 * // By modifying the callback parameter the
 * // sorting order can be influenced:
 *
 * // ascending order
 * async.sortBy([1,9,3,5], function(x, callback) {
 *     callback(null, x);
 * }, function(err,result) {
 *     // result callback
 * });
 *
 * // descending order
 * async.sortBy([1,9,3,5], function(x, callback) {
 *     callback(null, x*-1);    //<- x*-1 instead of x, turns the order around
 * }, function(err,result) {
 *     // result callback
 * });
 */
function sortBy(coll, iteratee, callback) {
    map(coll, function (x, callback) {
        iteratee(x, function (err, criteria) {
            if (err) return callback(err);
            callback(null, { value: x, criteria: criteria });
        });
    }, function (err, results) {
        if (err) return callback(err);
        callback(null, arrayMap(results.sort(comparator), baseProperty('value')));
    });

    function comparator(left, right) {
        var a = left.criteria,
            b = right.criteria;
        return a < b ? -1 : a > b ? 1 : 0;
    }
}

/**
 * Sets a time limit on an asynchronous function. If the function does not call
 * its callback within the specified milliseconds, it will be called with a
 * timeout error. The code property for the error object will be `'ETIMEDOUT'`.
 *
 * @name timeout
 * @static
 * @memberOf module:Utils
 * @method
 * @category Util
 * @param {Function} asyncFn - The asynchronous function you want to set the
 * time limit.
 * @param {number} milliseconds - The specified time limit.
 * @param {*} [info] - Any variable you want attached (`string`, `object`, etc)
 * to timeout Error for more information..
 * @returns {Function} Returns a wrapped function that can be used with any of
 * the control flow functions. Invoke this function with the same
 * parameters as you would `asyncFunc`.
 * @example
 *
 * function myFunction(foo, callback) {
 *     doAsyncTask(foo, function(err, data) {
 *         // handle errors
 *         if (err) return callback(err);
 *
 *         // do some stuff ...
 *
 *         // return processed data
 *         return callback(null, data);
 *     });
 * }
 *
 * var wrapped = async.timeout(myFunction, 1000);
 *
 * // call `wrapped` as you would `myFunction`
 * wrapped({ bar: 'bar' }, function(err, data) {
 *     // if `myFunction` takes < 1000 ms to execute, `err`
 *     // and `data` will have their expected values
 *
 *     // else `err` will be an Error with the code 'ETIMEDOUT'
 * });
 */
function timeout(asyncFn, milliseconds, info) {
    var originalCallback, timer;
    var timedOut = false;

    function injectedCallback() {
        if (!timedOut) {
            originalCallback.apply(null, arguments);
            clearTimeout(timer);
        }
    }

    function timeoutCallback() {
        var name = asyncFn.name || 'anonymous';
        var error = new Error('Callback function "' + name + '" timed out.');
        error.code = 'ETIMEDOUT';
        if (info) {
            error.info = info;
        }
        timedOut = true;
        originalCallback(error);
    }

    return initialParams(function (args, origCallback) {
        originalCallback = origCallback;
        // setup timer and call original function
        timer = setTimeout(timeoutCallback, milliseconds);
        asyncFn.apply(null, args.concat(injectedCallback));
    });
}

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeCeil = Math.ceil;
var nativeMax$1 = Math.max;

/**
 * The base implementation of `_.range` and `_.rangeRight` which doesn't
 * coerce arguments.
 *
 * @private
 * @param {number} start The start of the range.
 * @param {number} end The end of the range.
 * @param {number} step The value to increment or decrement by.
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {Array} Returns the range of numbers.
 */
function baseRange(start, end, step, fromRight) {
  var index = -1,
      length = nativeMax$1(nativeCeil((end - start) / (step || 1)), 0),
      result = Array(length);

  while (length--) {
    result[fromRight ? length : ++index] = start;
    start += step;
  }
  return result;
}

/**
 * The same as [times]{@link module:ControlFlow.times} but runs a maximum of `limit` async operations at a
 * time.
 *
 * @name timesLimit
 * @static
 * @memberOf module:ControlFlow
 * @method
 * @see [async.times]{@link module:ControlFlow.times}
 * @category Control Flow
 * @param {number} count - The number of times to run the function.
 * @param {number} limit - The maximum number of async operations at a time.
 * @param {Function} iteratee - The function to call `n` times. Invoked with the
 * iteration index and a callback (n, next).
 * @param {Function} callback - see [async.map]{@link module:Collections.map}.
 */
function timeLimit(count, limit, iteratee, callback) {
  mapLimit(baseRange(0, count, 1), limit, iteratee, callback);
}

/**
 * Calls the `iteratee` function `n` times, and accumulates results in the same
 * manner you would use with [map]{@link module:Collections.map}.
 *
 * @name times
 * @static
 * @memberOf module:ControlFlow
 * @method
 * @see [async.map]{@link module:Collections.map}
 * @category Control Flow
 * @param {number} n - The number of times to run the function.
 * @param {Function} iteratee - The function to call `n` times. Invoked with the
 * iteration index and a callback (n, next).
 * @param {Function} callback - see {@link module:Collections.map}.
 * @example
 *
 * // Pretend this is some complicated async factory
 * var createUser = function(id, callback) {
 *     callback(null, {
 *         id: 'user' + id
 *     });
 * };
 *
 * // generate 5 users
 * async.times(5, function(n, next) {
 *     createUser(n, function(err, user) {
 *         next(err, user);
 *     });
 * }, function(err, users) {
 *     // we should now have 5 users
 * });
 */
var times = doLimit(timeLimit, Infinity);

/**
 * The same as [times]{@link module:ControlFlow.times} but runs only a single async operation at a time.
 *
 * @name timesSeries
 * @static
 * @memberOf module:ControlFlow
 * @method
 * @see [async.times]{@link module:ControlFlow.times}
 * @category Control Flow
 * @param {number} n - The number of times to run the function.
 * @param {Function} iteratee - The function to call `n` times. Invoked with the
 * iteration index and a callback (n, next).
 * @param {Function} callback - see {@link module:Collections.map}.
 */
var timesSeries = doLimit(timeLimit, 1);

/**
 * A relative of `reduce`.  Takes an Object or Array, and iterates over each
 * element in series, each step potentially mutating an `accumulator` value.
 * The type of the accumulator defaults to the type of collection passed in.
 *
 * @name transform
 * @static
 * @memberOf module:Collections
 * @method
 * @category Collection
 * @param {Array|Iterable|Object} coll - A collection to iterate over.
 * @param {*} [accumulator] - The initial state of the transform.  If omitted,
 * it will default to an empty Object or Array, depending on the type of `coll`
 * @param {Function} iteratee - A function applied to each item in the
 * collection that potentially modifies the accumulator. The `iteratee` is
 * passed a `callback(err)` which accepts an optional error as its first
 * argument. If an error is passed to the callback, the transform is stopped
 * and the main `callback` is immediately called with the error.
 * Invoked with (accumulator, item, key, callback).
 * @param {Function} [callback] - A callback which is called after all the
 * `iteratee` functions have finished. Result is the transformed accumulator.
 * Invoked with (err, result).
 * @example
 *
 * async.transform([1,2,3], function(acc, item, index, callback) {
 *     // pointless async:
 *     process.nextTick(function() {
 *         acc.push(item * 2)
 *         callback(null)
 *     });
 * }, function(err, result) {
 *     // result is now equal to [2, 4, 6]
 * });
 *
 * @example
 *
 * async.transform({a: 1, b: 2, c: 3}, function (obj, val, key, callback) {
 *     setImmediate(function () {
 *         obj[key] = val * 2;
 *         callback();
 *     })
 * }, function (err, result) {
 *     // result is equal to {a: 2, b: 4, c: 6}
 * })
 */
function transform(coll, accumulator, iteratee, callback) {
    if (arguments.length === 3) {
        callback = iteratee;
        iteratee = accumulator;
        accumulator = isArray(coll) ? [] : {};
    }
    callback = once(callback || noop);

    eachOf(coll, function (v, k, cb) {
        iteratee(accumulator, v, k, cb);
    }, function (err) {
        callback(err, accumulator);
    });
}

/**
 * Undoes a [memoize]{@link module:Utils.memoize}d function, reverting it to the original,
 * unmemoized form. Handy for testing.
 *
 * @name unmemoize
 * @static
 * @memberOf module:Utils
 * @method
 * @see [async.memoize]{@link module:Utils.memoize}
 * @category Util
 * @param {Function} fn - the memoized function
 * @returns {Function} a function that calls the original unmemoized function
 */
function unmemoize(fn) {
    return function () {
        return (fn.unmemoized || fn).apply(null, arguments);
    };
}

/**
 * Repeatedly call `iteratee`, while `test` returns `true`. Calls `callback` when
 * stopped, or an error occurs.
 *
 * @name whilst
 * @static
 * @memberOf module:ControlFlow
 * @method
 * @category Control Flow
 * @param {Function} test - synchronous truth test to perform before each
 * execution of `iteratee`. Invoked with ().
 * @param {Function} iteratee - A function which is called each time `test` passes.
 * The function is passed a `callback(err)`, which must be called once it has
 * completed with an optional `err` argument. Invoked with (callback).
 * @param {Function} [callback] - A callback which is called after the test
 * function has failed and repeated execution of `iteratee` has stopped. `callback`
 * will be passed an error and any arguments passed to the final `iteratee`'s
 * callback. Invoked with (err, [results]);
 * @returns undefined
 * @example
 *
 * var count = 0;
 * async.whilst(
 *     function() { return count < 5; },
 *     function(callback) {
 *         count++;
 *         setTimeout(function() {
 *             callback(null, count);
 *         }, 1000);
 *     },
 *     function (err, n) {
 *         // 5 seconds have passed, n = 5
 *     }
 * );
 */
function whilst(test, iteratee, callback) {
    callback = onlyOnce(callback || noop);
    if (!test()) return callback(null);
    var next = rest(function (err, args) {
        if (err) return callback(err);
        if (test()) return iteratee(next);
        callback.apply(null, [null].concat(args));
    });
    iteratee(next);
}

/**
 * Repeatedly call `fn` until `test` returns `true`. Calls `callback` when
 * stopped, or an error occurs. `callback` will be passed an error and any
 * arguments passed to the final `fn`'s callback.
 *
 * The inverse of [whilst]{@link module:ControlFlow.whilst}.
 *
 * @name until
 * @static
 * @memberOf module:ControlFlow
 * @method
 * @see [async.whilst]{@link module:ControlFlow.whilst}
 * @category Control Flow
 * @param {Function} test - synchronous truth test to perform before each
 * execution of `fn`. Invoked with ().
 * @param {Function} fn - A function which is called each time `test` fails.
 * The function is passed a `callback(err)`, which must be called once it has
 * completed with an optional `err` argument. Invoked with (callback).
 * @param {Function} [callback] - A callback which is called after the test
 * function has passed and repeated execution of `fn` has stopped. `callback`
 * will be passed an error and any arguments passed to the final `fn`'s
 * callback. Invoked with (err, [results]);
 */
function until(test, fn, callback) {
    whilst(function () {
        return !test.apply(this, arguments);
    }, fn, callback);
}

/**
 * Runs the `tasks` array of functions in series, each passing their results to
 * the next in the array. However, if any of the `tasks` pass an error to their
 * own callback, the next function is not executed, and the main `callback` is
 * immediately called with the error.
 *
 * @name waterfall
 * @static
 * @memberOf module:ControlFlow
 * @method
 * @category Control Flow
 * @param {Array} tasks - An array of functions to run, each function is passed
 * a `callback(err, result1, result2, ...)` it must call on completion. The
 * first argument is an error (which can be `null`) and any further arguments
 * will be passed as arguments in order to the next task.
 * @param {Function} [callback] - An optional callback to run once all the
 * functions have completed. This will be passed the results of the last task's
 * callback. Invoked with (err, [results]).
 * @returns undefined
 * @example
 *
 * async.waterfall([
 *     function(callback) {
 *         callback(null, 'one', 'two');
 *     },
 *     function(arg1, arg2, callback) {
 *         // arg1 now equals 'one' and arg2 now equals 'two'
 *         callback(null, 'three');
 *     },
 *     function(arg1, callback) {
 *         // arg1 now equals 'three'
 *         callback(null, 'done');
 *     }
 * ], function (err, result) {
 *     // result now equals 'done'
 * });
 *
 * // Or, with named functions:
 * async.waterfall([
 *     myFirstFunction,
 *     mySecondFunction,
 *     myLastFunction,
 * ], function (err, result) {
 *     // result now equals 'done'
 * });
 * function myFirstFunction(callback) {
 *     callback(null, 'one', 'two');
 * }
 * function mySecondFunction(arg1, arg2, callback) {
 *     // arg1 now equals 'one' and arg2 now equals 'two'
 *     callback(null, 'three');
 * }
 * function myLastFunction(arg1, callback) {
 *     // arg1 now equals 'three'
 *     callback(null, 'done');
 * }
 */
var waterfall = function (tasks, callback) {
    callback = once(callback || noop);
    if (!isArray(tasks)) return callback(new Error('First argument to waterfall must be an array of functions'));
    if (!tasks.length) return callback();
    var taskIndex = 0;

    function nextTask(args) {
        if (taskIndex === tasks.length) {
            return callback.apply(null, [null].concat(args));
        }

        var taskCallback = onlyOnce(rest(function (err, args) {
            if (err) {
                return callback.apply(null, [err].concat(args));
            }
            nextTask(args);
        }));

        args.push(taskCallback);

        var task = tasks[taskIndex++];
        task.apply(null, args);
    }

    nextTask([]);
};

/**
 * Async is a utility module which provides straight-forward, powerful functions
 * for working with asynchronous JavaScript. Although originally designed for
 * use with [Node.js](http://nodejs.org) and installable via
 * `npm install --save async`, it can also be used directly in the browser.
 * @module async
 */

/**
 * A collection of `async` functions for manipulating collections, such as
 * arrays and objects.
 * @module Collections
 */

/**
 * A collection of `async` functions for controlling the flow through a script.
 * @module ControlFlow
 */

/**
 * A collection of `async` utility functions.
 * @module Utils
 */
var index = {
  applyEach: applyEach,
  applyEachSeries: applyEachSeries,
  apply: apply$2,
  asyncify: asyncify,
  auto: auto,
  autoInject: autoInject,
  cargo: cargo,
  compose: compose,
  concat: concat,
  concatSeries: concatSeries,
  constant: constant,
  detect: detect,
  detectLimit: detectLimit,
  detectSeries: detectSeries,
  dir: dir,
  doDuring: doDuring,
  doUntil: doUntil,
  doWhilst: doWhilst,
  during: during,
  each: eachLimit,
  eachLimit: eachLimit$1,
  eachOf: eachOf,
  eachOfLimit: eachOfLimit,
  eachOfSeries: eachOfSeries,
  eachSeries: eachSeries,
  ensureAsync: ensureAsync,
  every: every,
  everyLimit: everyLimit,
  everySeries: everySeries,
  filter: filter,
  filterLimit: filterLimit,
  filterSeries: filterSeries,
  forever: forever,
  log: log,
  map: map,
  mapLimit: mapLimit,
  mapSeries: mapSeries,
  mapValues: mapValues,
  mapValuesLimit: mapValuesLimit,
  mapValuesSeries: mapValuesSeries,
  memoize: memoize,
  nextTick: nextTick,
  parallel: parallelLimit,
  parallelLimit: parallelLimit$1,
  priorityQueue: priorityQueue,
  queue: queue$1,
  race: race,
  reduce: reduce,
  reduceRight: reduceRight,
  reflect: reflect,
  reflectAll: reflectAll,
  reject: reject,
  rejectLimit: rejectLimit,
  rejectSeries: rejectSeries,
  retry: retry,
  retryable: retryable,
  seq: seq$1,
  series: series,
  setImmediate: setImmediate$1,
  some: some,
  someLimit: someLimit,
  someSeries: someSeries,
  sortBy: sortBy,
  timeout: timeout,
  times: times,
  timesLimit: timeLimit,
  timesSeries: timesSeries,
  transform: transform,
  unmemoize: unmemoize,
  until: until,
  waterfall: waterfall,
  whilst: whilst,

  // aliases
  all: every,
  any: some,
  forEach: eachLimit,
  forEachSeries: eachSeries,
  forEachLimit: eachLimit$1,
  forEachOf: eachOf,
  forEachOfSeries: eachOfSeries,
  forEachOfLimit: eachOfLimit,
  inject: reduce,
  foldl: reduce,
  foldr: reduceRight,
  select: filter,
  selectLimit: filterLimit,
  selectSeries: filterSeries,
  wrapSync: asyncify
};

exports['default'] = index;
exports.applyEach = applyEach;
exports.applyEachSeries = applyEachSeries;
exports.apply = apply$2;
exports.asyncify = asyncify;
exports.auto = auto;
exports.autoInject = autoInject;
exports.cargo = cargo;
exports.compose = compose;
exports.concat = concat;
exports.concatSeries = concatSeries;
exports.constant = constant;
exports.detect = detect;
exports.detectLimit = detectLimit;
exports.detectSeries = detectSeries;
exports.dir = dir;
exports.doDuring = doDuring;
exports.doUntil = doUntil;
exports.doWhilst = doWhilst;
exports.during = during;
exports.each = eachLimit;
exports.eachLimit = eachLimit$1;
exports.eachOf = eachOf;
exports.eachOfLimit = eachOfLimit;
exports.eachOfSeries = eachOfSeries;
exports.eachSeries = eachSeries;
exports.ensureAsync = ensureAsync;
exports.every = every;
exports.everyLimit = everyLimit;
exports.everySeries = everySeries;
exports.filter = filter;
exports.filterLimit = filterLimit;
exports.filterSeries = filterSeries;
exports.forever = forever;
exports.log = log;
exports.map = map;
exports.mapLimit = mapLimit;
exports.mapSeries = mapSeries;
exports.mapValues = mapValues;
exports.mapValuesLimit = mapValuesLimit;
exports.mapValuesSeries = mapValuesSeries;
exports.memoize = memoize;
exports.nextTick = nextTick;
exports.parallel = parallelLimit;
exports.parallelLimit = parallelLimit$1;
exports.priorityQueue = priorityQueue;
exports.queue = queue$1;
exports.race = race;
exports.reduce = reduce;
exports.reduceRight = reduceRight;
exports.reflect = reflect;
exports.reflectAll = reflectAll;
exports.reject = reject;
exports.rejectLimit = rejectLimit;
exports.rejectSeries = rejectSeries;
exports.retry = retry;
exports.retryable = retryable;
exports.seq = seq$1;
exports.series = series;
exports.setImmediate = setImmediate$1;
exports.some = some;
exports.someLimit = someLimit;
exports.someSeries = someSeries;
exports.sortBy = sortBy;
exports.timeout = timeout;
exports.times = times;
exports.timesLimit = timeLimit;
exports.timesSeries = timesSeries;
exports.transform = transform;
exports.unmemoize = unmemoize;
exports.until = until;
exports.waterfall = waterfall;
exports.whilst = whilst;
exports.all = every;
exports.allLimit = everyLimit;
exports.allSeries = everySeries;
exports.any = some;
exports.anyLimit = someLimit;
exports.anySeries = someSeries;
exports.find = detect;
exports.findLimit = detectLimit;
exports.findSeries = detectSeries;
exports.forEach = eachLimit;
exports.forEachSeries = eachSeries;
exports.forEachLimit = eachLimit$1;
exports.forEachOf = eachOf;
exports.forEachOfSeries = eachOfSeries;
exports.forEachOfLimit = eachOfLimit;
exports.inject = reduce;
exports.foldl = reduce;
exports.foldr = reduceRight;
exports.select = filter;
exports.selectLimit = filterLimit;
exports.selectSeries = filterSeries;
exports.wrapSync = asyncify;

Object.defineProperty(exports, '__esModule', { value: true });

})));

}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"_process":8}],2:[function(require,module,exports){
/**
 * lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */

/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER = 9007199254740991;

/** `Object#toString` result references. */
var argsTag = '[object Arguments]',
    funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]';

/** Used to detect unsigned integer values. */
var reIsUint = /^(?:0|[1-9]\d*)$/;

/**
 * A faster alternative to `Function#apply`, this function invokes `func`
 * with the `this` binding of `thisArg` and the arguments of `args`.
 *
 * @private
 * @param {Function} func The function to invoke.
 * @param {*} thisArg The `this` binding of `func`.
 * @param {Array} args The arguments to invoke `func` with.
 * @returns {*} Returns the result of `func`.
 */
function apply(func, thisArg, args) {
  switch (args.length) {
    case 0: return func.call(thisArg);
    case 1: return func.call(thisArg, args[0]);
    case 2: return func.call(thisArg, args[0], args[1]);
    case 3: return func.call(thisArg, args[0], args[1], args[2]);
  }
  return func.apply(thisArg, args);
}

/**
 * The base implementation of `_.times` without support for iteratee shorthands
 * or max array length checks.
 *
 * @private
 * @param {number} n The number of times to invoke `iteratee`.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the array of results.
 */
function baseTimes(n, iteratee) {
  var index = -1,
      result = Array(n);

  while (++index < n) {
    result[index] = iteratee(index);
  }
  return result;
}

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/** Built-in value references. */
var propertyIsEnumerable = objectProto.propertyIsEnumerable;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max;

/**
 * Creates an array of the enumerable property names of the array-like `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @param {boolean} inherited Specify returning inherited property names.
 * @returns {Array} Returns the array of property names.
 */
function arrayLikeKeys(value, inherited) {
  // Safari 8.1 makes `arguments.callee` enumerable in strict mode.
  // Safari 9 makes `arguments.length` enumerable in strict mode.
  var result = (isArray(value) || isArguments(value))
    ? baseTimes(value.length, String)
    : [];

  var length = result.length,
      skipIndexes = !!length;

  for (var key in value) {
    if ((inherited || hasOwnProperty.call(value, key)) &&
        !(skipIndexes && (key == 'length' || isIndex(key, length)))) {
      result.push(key);
    }
  }
  return result;
}

/**
 * Assigns `value` to `key` of `object` if the existing value is not equivalent
 * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * for equality comparisons.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {string} key The key of the property to assign.
 * @param {*} value The value to assign.
 */
function assignValue(object, key, value) {
  var objValue = object[key];
  if (!(hasOwnProperty.call(object, key) && eq(objValue, value)) ||
      (value === undefined && !(key in object))) {
    object[key] = value;
  }
}

/**
 * The base implementation of `_.keysIn` which doesn't treat sparse arrays as dense.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function baseKeysIn(object) {
  if (!isObject(object)) {
    return nativeKeysIn(object);
  }
  var isProto = isPrototype(object),
      result = [];

  for (var key in object) {
    if (!(key == 'constructor' && (isProto || !hasOwnProperty.call(object, key)))) {
      result.push(key);
    }
  }
  return result;
}

/**
 * The base implementation of `_.rest` which doesn't validate or coerce arguments.
 *
 * @private
 * @param {Function} func The function to apply a rest parameter to.
 * @param {number} [start=func.length-1] The start position of the rest parameter.
 * @returns {Function} Returns the new function.
 */
function baseRest(func, start) {
  start = nativeMax(start === undefined ? (func.length - 1) : start, 0);
  return function() {
    var args = arguments,
        index = -1,
        length = nativeMax(args.length - start, 0),
        array = Array(length);

    while (++index < length) {
      array[index] = args[start + index];
    }
    index = -1;
    var otherArgs = Array(start + 1);
    while (++index < start) {
      otherArgs[index] = args[index];
    }
    otherArgs[start] = array;
    return apply(func, this, otherArgs);
  };
}

/**
 * Copies properties of `source` to `object`.
 *
 * @private
 * @param {Object} source The object to copy properties from.
 * @param {Array} props The property identifiers to copy.
 * @param {Object} [object={}] The object to copy properties to.
 * @param {Function} [customizer] The function to customize copied values.
 * @returns {Object} Returns `object`.
 */
function copyObject(source, props, object, customizer) {
  object || (object = {});

  var index = -1,
      length = props.length;

  while (++index < length) {
    var key = props[index];

    var newValue = customizer
      ? customizer(object[key], source[key], key, object, source)
      : undefined;

    assignValue(object, key, newValue === undefined ? source[key] : newValue);
  }
  return object;
}

/**
 * Creates a function like `_.assign`.
 *
 * @private
 * @param {Function} assigner The function to assign values.
 * @returns {Function} Returns the new assigner function.
 */
function createAssigner(assigner) {
  return baseRest(function(object, sources) {
    var index = -1,
        length = sources.length,
        customizer = length > 1 ? sources[length - 1] : undefined,
        guard = length > 2 ? sources[2] : undefined;

    customizer = (assigner.length > 3 && typeof customizer == 'function')
      ? (length--, customizer)
      : undefined;

    if (guard && isIterateeCall(sources[0], sources[1], guard)) {
      customizer = length < 3 ? undefined : customizer;
      length = 1;
    }
    object = Object(object);
    while (++index < length) {
      var source = sources[index];
      if (source) {
        assigner(object, source, index, customizer);
      }
    }
    return object;
  });
}

/**
 * Checks if `value` is a valid array-like index.
 *
 * @private
 * @param {*} value The value to check.
 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
 */
function isIndex(value, length) {
  length = length == null ? MAX_SAFE_INTEGER : length;
  return !!length &&
    (typeof value == 'number' || reIsUint.test(value)) &&
    (value > -1 && value % 1 == 0 && value < length);
}

/**
 * Checks if the given arguments are from an iteratee call.
 *
 * @private
 * @param {*} value The potential iteratee value argument.
 * @param {*} index The potential iteratee index or key argument.
 * @param {*} object The potential iteratee object argument.
 * @returns {boolean} Returns `true` if the arguments are from an iteratee call,
 *  else `false`.
 */
function isIterateeCall(value, index, object) {
  if (!isObject(object)) {
    return false;
  }
  var type = typeof index;
  if (type == 'number'
        ? (isArrayLike(object) && isIndex(index, object.length))
        : (type == 'string' && index in object)
      ) {
    return eq(object[index], value);
  }
  return false;
}

/**
 * Checks if `value` is likely a prototype object.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
 */
function isPrototype(value) {
  var Ctor = value && value.constructor,
      proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto;

  return value === proto;
}

/**
 * This function is like
 * [`Object.keys`](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
 * except that it includes inherited enumerable properties.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function nativeKeysIn(object) {
  var result = [];
  if (object != null) {
    for (var key in Object(object)) {
      result.push(key);
    }
  }
  return result;
}

/**
 * Performs a
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * comparison between two values to determine if they are equivalent.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * _.eq(object, object);
 * // => true
 *
 * _.eq(object, other);
 * // => false
 *
 * _.eq('a', 'a');
 * // => true
 *
 * _.eq('a', Object('a'));
 * // => false
 *
 * _.eq(NaN, NaN);
 * // => true
 */
function eq(value, other) {
  return value === other || (value !== value && other !== other);
}

/**
 * Checks if `value` is likely an `arguments` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 *  else `false`.
 * @example
 *
 * _.isArguments(function() { return arguments; }());
 * // => true
 *
 * _.isArguments([1, 2, 3]);
 * // => false
 */
function isArguments(value) {
  // Safari 8.1 makes `arguments.callee` enumerable in strict mode.
  return isArrayLikeObject(value) && hasOwnProperty.call(value, 'callee') &&
    (!propertyIsEnumerable.call(value, 'callee') || objectToString.call(value) == argsTag);
}

/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */
var isArray = Array.isArray;

/**
 * Checks if `value` is array-like. A value is considered array-like if it's
 * not a function and has a `value.length` that's an integer greater than or
 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
 * @example
 *
 * _.isArrayLike([1, 2, 3]);
 * // => true
 *
 * _.isArrayLike(document.body.children);
 * // => true
 *
 * _.isArrayLike('abc');
 * // => true
 *
 * _.isArrayLike(_.noop);
 * // => false
 */
function isArrayLike(value) {
  return value != null && isLength(value.length) && !isFunction(value);
}

/**
 * This method is like `_.isArrayLike` except that it also checks if `value`
 * is an object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array-like object,
 *  else `false`.
 * @example
 *
 * _.isArrayLikeObject([1, 2, 3]);
 * // => true
 *
 * _.isArrayLikeObject(document.body.children);
 * // => true
 *
 * _.isArrayLikeObject('abc');
 * // => false
 *
 * _.isArrayLikeObject(_.noop);
 * // => false
 */
function isArrayLikeObject(value) {
  return isObjectLike(value) && isArrayLike(value);
}

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 8-9 which returns 'object' for typed array and other constructors.
  var tag = isObject(value) ? objectToString.call(value) : '';
  return tag == funcTag || tag == genTag;
}

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This method is loosely based on
 * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 * @example
 *
 * _.isLength(3);
 * // => true
 *
 * _.isLength(Number.MIN_VALUE);
 * // => false
 *
 * _.isLength(Infinity);
 * // => false
 *
 * _.isLength('3');
 * // => false
 */
function isLength(value) {
  return typeof value == 'number' &&
    value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return !!value && typeof value == 'object';
}

/**
 * This method is like `_.assign` except that it iterates over own and
 * inherited source properties.
 *
 * **Note:** This method mutates `object`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @alias extend
 * @category Object
 * @param {Object} object The destination object.
 * @param {...Object} [sources] The source objects.
 * @returns {Object} Returns `object`.
 * @see _.assign
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 * }
 *
 * function Bar() {
 *   this.c = 3;
 * }
 *
 * Foo.prototype.b = 2;
 * Bar.prototype.d = 4;
 *
 * _.assignIn({ 'a': 0 }, new Foo, new Bar);
 * // => { 'a': 1, 'b': 2, 'c': 3, 'd': 4 }
 */
var assignIn = createAssigner(function(object, source) {
  copyObject(source, keysIn(source), object);
});

/**
 * Creates an array of the own and inherited enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keysIn(new Foo);
 * // => ['a', 'b', 'c'] (iteration order is not guaranteed)
 */
function keysIn(object) {
  return isArrayLike(object) ? arrayLikeKeys(object, true) : baseKeysIn(object);
}

module.exports = assignIn;

},{}],3:[function(require,module,exports){
(function (global){
/**
 * lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */

/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER = 9007199254740991;

/** `Object#toString` result references. */
var argsTag = '[object Arguments]',
    funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]';

/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

/**
 * Appends the elements of `values` to `array`.
 *
 * @private
 * @param {Array} array The array to modify.
 * @param {Array} values The values to append.
 * @returns {Array} Returns `array`.
 */
function arrayPush(array, values) {
  var index = -1,
      length = values.length,
      offset = array.length;

  while (++index < length) {
    array[offset + index] = values[index];
  }
  return array;
}

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/** Built-in value references. */
var Symbol = root.Symbol,
    propertyIsEnumerable = objectProto.propertyIsEnumerable,
    spreadableSymbol = Symbol ? Symbol.isConcatSpreadable : undefined;

/**
 * The base implementation of `_.flatten` with support for restricting flattening.
 *
 * @private
 * @param {Array} array The array to flatten.
 * @param {number} depth The maximum recursion depth.
 * @param {boolean} [predicate=isFlattenable] The function invoked per iteration.
 * @param {boolean} [isStrict] Restrict to values that pass `predicate` checks.
 * @param {Array} [result=[]] The initial result value.
 * @returns {Array} Returns the new flattened array.
 */
function baseFlatten(array, depth, predicate, isStrict, result) {
  var index = -1,
      length = array.length;

  predicate || (predicate = isFlattenable);
  result || (result = []);

  while (++index < length) {
    var value = array[index];
    if (depth > 0 && predicate(value)) {
      if (depth > 1) {
        // Recursively flatten arrays (susceptible to call stack limits).
        baseFlatten(value, depth - 1, predicate, isStrict, result);
      } else {
        arrayPush(result, value);
      }
    } else if (!isStrict) {
      result[result.length] = value;
    }
  }
  return result;
}

/**
 * Checks if `value` is a flattenable `arguments` object or array.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is flattenable, else `false`.
 */
function isFlattenable(value) {
  return isArray(value) || isArguments(value) ||
    !!(spreadableSymbol && value && value[spreadableSymbol]);
}

/**
 * Flattens `array` a single level deep.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Array
 * @param {Array} array The array to flatten.
 * @returns {Array} Returns the new flattened array.
 * @example
 *
 * _.flatten([1, [2, [3, [4]], 5]]);
 * // => [1, 2, [3, [4]], 5]
 */
function flatten(array) {
  var length = array ? array.length : 0;
  return length ? baseFlatten(array, 1) : [];
}

/**
 * Checks if `value` is likely an `arguments` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 *  else `false`.
 * @example
 *
 * _.isArguments(function() { return arguments; }());
 * // => true
 *
 * _.isArguments([1, 2, 3]);
 * // => false
 */
function isArguments(value) {
  // Safari 8.1 makes `arguments.callee` enumerable in strict mode.
  return isArrayLikeObject(value) && hasOwnProperty.call(value, 'callee') &&
    (!propertyIsEnumerable.call(value, 'callee') || objectToString.call(value) == argsTag);
}

/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */
var isArray = Array.isArray;

/**
 * Checks if `value` is array-like. A value is considered array-like if it's
 * not a function and has a `value.length` that's an integer greater than or
 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
 * @example
 *
 * _.isArrayLike([1, 2, 3]);
 * // => true
 *
 * _.isArrayLike(document.body.children);
 * // => true
 *
 * _.isArrayLike('abc');
 * // => true
 *
 * _.isArrayLike(_.noop);
 * // => false
 */
function isArrayLike(value) {
  return value != null && isLength(value.length) && !isFunction(value);
}

/**
 * This method is like `_.isArrayLike` except that it also checks if `value`
 * is an object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array-like object,
 *  else `false`.
 * @example
 *
 * _.isArrayLikeObject([1, 2, 3]);
 * // => true
 *
 * _.isArrayLikeObject(document.body.children);
 * // => true
 *
 * _.isArrayLikeObject('abc');
 * // => false
 *
 * _.isArrayLikeObject(_.noop);
 * // => false
 */
function isArrayLikeObject(value) {
  return isObjectLike(value) && isArrayLike(value);
}

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 8-9 which returns 'object' for typed array and other constructors.
  var tag = isObject(value) ? objectToString.call(value) : '';
  return tag == funcTag || tag == genTag;
}

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This method is loosely based on
 * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 * @example
 *
 * _.isLength(3);
 * // => true
 *
 * _.isLength(Number.MIN_VALUE);
 * // => false
 *
 * _.isLength(Infinity);
 * // => false
 *
 * _.isLength('3');
 * // => false
 */
function isLength(value) {
  return typeof value == 'number' &&
    value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return !!value && typeof value == 'object';
}

module.exports = flatten;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],4:[function(require,module,exports){
(function (global){
/**
 * lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */

/** Used as the size to enable large array optimizations. */
var LARGE_ARRAY_SIZE = 200;

/** Used as the `TypeError` message for "Functions" methods. */
var FUNC_ERROR_TEXT = 'Expected a function';

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/** Used to compose bitmasks for comparison styles. */
var UNORDERED_COMPARE_FLAG = 1,
    PARTIAL_COMPARE_FLAG = 2;

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0,
    MAX_SAFE_INTEGER = 9007199254740991;

/** `Object#toString` result references. */
var argsTag = '[object Arguments]',
    arrayTag = '[object Array]',
    boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    errorTag = '[object Error]',
    funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]',
    mapTag = '[object Map]',
    numberTag = '[object Number]',
    objectTag = '[object Object]',
    promiseTag = '[object Promise]',
    regexpTag = '[object RegExp]',
    setTag = '[object Set]',
    stringTag = '[object String]',
    symbolTag = '[object Symbol]',
    weakMapTag = '[object WeakMap]';

var arrayBufferTag = '[object ArrayBuffer]',
    dataViewTag = '[object DataView]',
    float32Tag = '[object Float32Array]',
    float64Tag = '[object Float64Array]',
    int8Tag = '[object Int8Array]',
    int16Tag = '[object Int16Array]',
    int32Tag = '[object Int32Array]',
    uint8Tag = '[object Uint8Array]',
    uint8ClampedTag = '[object Uint8ClampedArray]',
    uint16Tag = '[object Uint16Array]',
    uint32Tag = '[object Uint32Array]';

/** Used to match property names within property paths. */
var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
    reIsPlainProp = /^\w*$/,
    reLeadingDot = /^\./,
    rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;

/**
 * Used to match `RegExp`
 * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
 */
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

/** Used to match backslashes in property paths. */
var reEscapeChar = /\\(\\)?/g;

/** Used to detect host constructors (Safari). */
var reIsHostCtor = /^\[object .+?Constructor\]$/;

/** Used to detect unsigned integer values. */
var reIsUint = /^(?:0|[1-9]\d*)$/;

/** Used to identify `toStringTag` values of typed arrays. */
var typedArrayTags = {};
typedArrayTags[float32Tag] = typedArrayTags[float64Tag] =
typedArrayTags[int8Tag] = typedArrayTags[int16Tag] =
typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] =
typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] =
typedArrayTags[uint32Tag] = true;
typedArrayTags[argsTag] = typedArrayTags[arrayTag] =
typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] =
typedArrayTags[dataViewTag] = typedArrayTags[dateTag] =
typedArrayTags[errorTag] = typedArrayTags[funcTag] =
typedArrayTags[mapTag] = typedArrayTags[numberTag] =
typedArrayTags[objectTag] = typedArrayTags[regexpTag] =
typedArrayTags[setTag] = typedArrayTags[stringTag] =
typedArrayTags[weakMapTag] = false;

/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

/** Detect free variable `exports`. */
var freeExports = typeof exports == 'object' && exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && typeof module == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/** Detect free variable `process` from Node.js. */
var freeProcess = moduleExports && freeGlobal.process;

/** Used to access faster Node.js helpers. */
var nodeUtil = (function() {
  try {
    return freeProcess && freeProcess.binding('util');
  } catch (e) {}
}());

/* Node.js helper references. */
var nodeIsTypedArray = nodeUtil && nodeUtil.isTypedArray;

/**
 * A specialized version of `baseAggregator` for arrays.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} setter The function to set `accumulator` values.
 * @param {Function} iteratee The iteratee to transform keys.
 * @param {Object} accumulator The initial aggregated object.
 * @returns {Function} Returns `accumulator`.
 */
function arrayAggregator(array, setter, iteratee, accumulator) {
  var index = -1,
      length = array ? array.length : 0;

  while (++index < length) {
    var value = array[index];
    setter(accumulator, value, iteratee(value), array);
  }
  return accumulator;
}

/**
 * A specialized version of `_.some` for arrays without support for iteratee
 * shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} predicate The function invoked per iteration.
 * @returns {boolean} Returns `true` if any element passes the predicate check,
 *  else `false`.
 */
function arraySome(array, predicate) {
  var index = -1,
      length = array ? array.length : 0;

  while (++index < length) {
    if (predicate(array[index], index, array)) {
      return true;
    }
  }
  return false;
}

/**
 * The base implementation of `_.property` without support for deep paths.
 *
 * @private
 * @param {string} key The key of the property to get.
 * @returns {Function} Returns the new accessor function.
 */
function baseProperty(key) {
  return function(object) {
    return object == null ? undefined : object[key];
  };
}

/**
 * The base implementation of `_.times` without support for iteratee shorthands
 * or max array length checks.
 *
 * @private
 * @param {number} n The number of times to invoke `iteratee`.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the array of results.
 */
function baseTimes(n, iteratee) {
  var index = -1,
      result = Array(n);

  while (++index < n) {
    result[index] = iteratee(index);
  }
  return result;
}

/**
 * The base implementation of `_.unary` without support for storing metadata.
 *
 * @private
 * @param {Function} func The function to cap arguments for.
 * @returns {Function} Returns the new capped function.
 */
function baseUnary(func) {
  return function(value) {
    return func(value);
  };
}

/**
 * Gets the value at `key` of `object`.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {string} key The key of the property to get.
 * @returns {*} Returns the property value.
 */
function getValue(object, key) {
  return object == null ? undefined : object[key];
}

/**
 * Checks if `value` is a host object in IE < 9.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a host object, else `false`.
 */
function isHostObject(value) {
  // Many host objects are `Object` objects that can coerce to strings
  // despite having improperly defined `toString` methods.
  var result = false;
  if (value != null && typeof value.toString != 'function') {
    try {
      result = !!(value + '');
    } catch (e) {}
  }
  return result;
}

/**
 * Converts `map` to its key-value pairs.
 *
 * @private
 * @param {Object} map The map to convert.
 * @returns {Array} Returns the key-value pairs.
 */
function mapToArray(map) {
  var index = -1,
      result = Array(map.size);

  map.forEach(function(value, key) {
    result[++index] = [key, value];
  });
  return result;
}

/**
 * Creates a unary function that invokes `func` with its argument transformed.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {Function} transform The argument transform.
 * @returns {Function} Returns the new function.
 */
function overArg(func, transform) {
  return function(arg) {
    return func(transform(arg));
  };
}

/**
 * Converts `set` to an array of its values.
 *
 * @private
 * @param {Object} set The set to convert.
 * @returns {Array} Returns the values.
 */
function setToArray(set) {
  var index = -1,
      result = Array(set.size);

  set.forEach(function(value) {
    result[++index] = value;
  });
  return result;
}

/** Used for built-in method references. */
var arrayProto = Array.prototype,
    funcProto = Function.prototype,
    objectProto = Object.prototype;

/** Used to detect overreaching core-js shims. */
var coreJsData = root['__core-js_shared__'];

/** Used to detect methods masquerading as native. */
var maskSrcKey = (function() {
  var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
  return uid ? ('Symbol(src)_1.' + uid) : '';
}());

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/** Used to detect if a method is native. */
var reIsNative = RegExp('^' +
  funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\$&')
  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
);

/** Built-in value references. */
var Symbol = root.Symbol,
    Uint8Array = root.Uint8Array,
    propertyIsEnumerable = objectProto.propertyIsEnumerable,
    splice = arrayProto.splice;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeKeys = overArg(Object.keys, Object);

/* Built-in method references that are verified to be native. */
var DataView = getNative(root, 'DataView'),
    Map = getNative(root, 'Map'),
    Promise = getNative(root, 'Promise'),
    Set = getNative(root, 'Set'),
    WeakMap = getNative(root, 'WeakMap'),
    nativeCreate = getNative(Object, 'create');

/** Used to detect maps, sets, and weakmaps. */
var dataViewCtorString = toSource(DataView),
    mapCtorString = toSource(Map),
    promiseCtorString = toSource(Promise),
    setCtorString = toSource(Set),
    weakMapCtorString = toSource(WeakMap);

/** Used to convert symbols to primitives and strings. */
var symbolProto = Symbol ? Symbol.prototype : undefined,
    symbolValueOf = symbolProto ? symbolProto.valueOf : undefined,
    symbolToString = symbolProto ? symbolProto.toString : undefined;

/**
 * Creates a hash object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Hash(entries) {
  var index = -1,
      length = entries ? entries.length : 0;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the hash.
 *
 * @private
 * @name clear
 * @memberOf Hash
 */
function hashClear() {
  this.__data__ = nativeCreate ? nativeCreate(null) : {};
}

/**
 * Removes `key` and its value from the hash.
 *
 * @private
 * @name delete
 * @memberOf Hash
 * @param {Object} hash The hash to modify.
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function hashDelete(key) {
  return this.has(key) && delete this.__data__[key];
}

/**
 * Gets the hash value for `key`.
 *
 * @private
 * @name get
 * @memberOf Hash
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function hashGet(key) {
  var data = this.__data__;
  if (nativeCreate) {
    var result = data[key];
    return result === HASH_UNDEFINED ? undefined : result;
  }
  return hasOwnProperty.call(data, key) ? data[key] : undefined;
}

/**
 * Checks if a hash value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Hash
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function hashHas(key) {
  var data = this.__data__;
  return nativeCreate ? data[key] !== undefined : hasOwnProperty.call(data, key);
}

/**
 * Sets the hash `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Hash
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the hash instance.
 */
function hashSet(key, value) {
  var data = this.__data__;
  data[key] = (nativeCreate && value === undefined) ? HASH_UNDEFINED : value;
  return this;
}

// Add methods to `Hash`.
Hash.prototype.clear = hashClear;
Hash.prototype['delete'] = hashDelete;
Hash.prototype.get = hashGet;
Hash.prototype.has = hashHas;
Hash.prototype.set = hashSet;

/**
 * Creates an list cache object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function ListCache(entries) {
  var index = -1,
      length = entries ? entries.length : 0;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the list cache.
 *
 * @private
 * @name clear
 * @memberOf ListCache
 */
function listCacheClear() {
  this.__data__ = [];
}

/**
 * Removes `key` and its value from the list cache.
 *
 * @private
 * @name delete
 * @memberOf ListCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function listCacheDelete(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    return false;
  }
  var lastIndex = data.length - 1;
  if (index == lastIndex) {
    data.pop();
  } else {
    splice.call(data, index, 1);
  }
  return true;
}

/**
 * Gets the list cache value for `key`.
 *
 * @private
 * @name get
 * @memberOf ListCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function listCacheGet(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  return index < 0 ? undefined : data[index][1];
}

/**
 * Checks if a list cache value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf ListCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function listCacheHas(key) {
  return assocIndexOf(this.__data__, key) > -1;
}

/**
 * Sets the list cache `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf ListCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the list cache instance.
 */
function listCacheSet(key, value) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    data.push([key, value]);
  } else {
    data[index][1] = value;
  }
  return this;
}

// Add methods to `ListCache`.
ListCache.prototype.clear = listCacheClear;
ListCache.prototype['delete'] = listCacheDelete;
ListCache.prototype.get = listCacheGet;
ListCache.prototype.has = listCacheHas;
ListCache.prototype.set = listCacheSet;

/**
 * Creates a map cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function MapCache(entries) {
  var index = -1,
      length = entries ? entries.length : 0;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the map.
 *
 * @private
 * @name clear
 * @memberOf MapCache
 */
function mapCacheClear() {
  this.__data__ = {
    'hash': new Hash,
    'map': new (Map || ListCache),
    'string': new Hash
  };
}

/**
 * Removes `key` and its value from the map.
 *
 * @private
 * @name delete
 * @memberOf MapCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function mapCacheDelete(key) {
  return getMapData(this, key)['delete'](key);
}

/**
 * Gets the map value for `key`.
 *
 * @private
 * @name get
 * @memberOf MapCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function mapCacheGet(key) {
  return getMapData(this, key).get(key);
}

/**
 * Checks if a map value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf MapCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function mapCacheHas(key) {
  return getMapData(this, key).has(key);
}

/**
 * Sets the map `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf MapCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the map cache instance.
 */
function mapCacheSet(key, value) {
  getMapData(this, key).set(key, value);
  return this;
}

// Add methods to `MapCache`.
MapCache.prototype.clear = mapCacheClear;
MapCache.prototype['delete'] = mapCacheDelete;
MapCache.prototype.get = mapCacheGet;
MapCache.prototype.has = mapCacheHas;
MapCache.prototype.set = mapCacheSet;

/**
 *
 * Creates an array cache object to store unique values.
 *
 * @private
 * @constructor
 * @param {Array} [values] The values to cache.
 */
function SetCache(values) {
  var index = -1,
      length = values ? values.length : 0;

  this.__data__ = new MapCache;
  while (++index < length) {
    this.add(values[index]);
  }
}

/**
 * Adds `value` to the array cache.
 *
 * @private
 * @name add
 * @memberOf SetCache
 * @alias push
 * @param {*} value The value to cache.
 * @returns {Object} Returns the cache instance.
 */
function setCacheAdd(value) {
  this.__data__.set(value, HASH_UNDEFINED);
  return this;
}

/**
 * Checks if `value` is in the array cache.
 *
 * @private
 * @name has
 * @memberOf SetCache
 * @param {*} value The value to search for.
 * @returns {number} Returns `true` if `value` is found, else `false`.
 */
function setCacheHas(value) {
  return this.__data__.has(value);
}

// Add methods to `SetCache`.
SetCache.prototype.add = SetCache.prototype.push = setCacheAdd;
SetCache.prototype.has = setCacheHas;

/**
 * Creates a stack cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Stack(entries) {
  this.__data__ = new ListCache(entries);
}

/**
 * Removes all key-value entries from the stack.
 *
 * @private
 * @name clear
 * @memberOf Stack
 */
function stackClear() {
  this.__data__ = new ListCache;
}

/**
 * Removes `key` and its value from the stack.
 *
 * @private
 * @name delete
 * @memberOf Stack
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function stackDelete(key) {
  return this.__data__['delete'](key);
}

/**
 * Gets the stack value for `key`.
 *
 * @private
 * @name get
 * @memberOf Stack
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function stackGet(key) {
  return this.__data__.get(key);
}

/**
 * Checks if a stack value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Stack
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function stackHas(key) {
  return this.__data__.has(key);
}

/**
 * Sets the stack `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Stack
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the stack cache instance.
 */
function stackSet(key, value) {
  var cache = this.__data__;
  if (cache instanceof ListCache) {
    var pairs = cache.__data__;
    if (!Map || (pairs.length < LARGE_ARRAY_SIZE - 1)) {
      pairs.push([key, value]);
      return this;
    }
    cache = this.__data__ = new MapCache(pairs);
  }
  cache.set(key, value);
  return this;
}

// Add methods to `Stack`.
Stack.prototype.clear = stackClear;
Stack.prototype['delete'] = stackDelete;
Stack.prototype.get = stackGet;
Stack.prototype.has = stackHas;
Stack.prototype.set = stackSet;

/**
 * Creates an array of the enumerable property names of the array-like `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @param {boolean} inherited Specify returning inherited property names.
 * @returns {Array} Returns the array of property names.
 */
function arrayLikeKeys(value, inherited) {
  // Safari 8.1 makes `arguments.callee` enumerable in strict mode.
  // Safari 9 makes `arguments.length` enumerable in strict mode.
  var result = (isArray(value) || isArguments(value))
    ? baseTimes(value.length, String)
    : [];

  var length = result.length,
      skipIndexes = !!length;

  for (var key in value) {
    if ((inherited || hasOwnProperty.call(value, key)) &&
        !(skipIndexes && (key == 'length' || isIndex(key, length)))) {
      result.push(key);
    }
  }
  return result;
}

/**
 * Gets the index at which the `key` is found in `array` of key-value pairs.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} key The key to search for.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function assocIndexOf(array, key) {
  var length = array.length;
  while (length--) {
    if (eq(array[length][0], key)) {
      return length;
    }
  }
  return -1;
}

/**
 * Aggregates elements of `collection` on `accumulator` with keys transformed
 * by `iteratee` and values set by `setter`.
 *
 * @private
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} setter The function to set `accumulator` values.
 * @param {Function} iteratee The iteratee to transform keys.
 * @param {Object} accumulator The initial aggregated object.
 * @returns {Function} Returns `accumulator`.
 */
function baseAggregator(collection, setter, iteratee, accumulator) {
  baseEach(collection, function(value, key, collection) {
    setter(accumulator, value, iteratee(value), collection);
  });
  return accumulator;
}

/**
 * The base implementation of `_.forEach` without support for iteratee shorthands.
 *
 * @private
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array|Object} Returns `collection`.
 */
var baseEach = createBaseEach(baseForOwn);

/**
 * The base implementation of `baseForOwn` which iterates over `object`
 * properties returned by `keysFunc` and invokes `iteratee` for each property.
 * Iteratee functions may exit iteration early by explicitly returning `false`.
 *
 * @private
 * @param {Object} object The object to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @param {Function} keysFunc The function to get the keys of `object`.
 * @returns {Object} Returns `object`.
 */
var baseFor = createBaseFor();

/**
 * The base implementation of `_.forOwn` without support for iteratee shorthands.
 *
 * @private
 * @param {Object} object The object to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Object} Returns `object`.
 */
function baseForOwn(object, iteratee) {
  return object && baseFor(object, iteratee, keys);
}

/**
 * The base implementation of `_.get` without support for default values.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array|string} path The path of the property to get.
 * @returns {*} Returns the resolved value.
 */
function baseGet(object, path) {
  path = isKey(path, object) ? [path] : castPath(path);

  var index = 0,
      length = path.length;

  while (object != null && index < length) {
    object = object[toKey(path[index++])];
  }
  return (index && index == length) ? object : undefined;
}

/**
 * The base implementation of `getTag`.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
function baseGetTag(value) {
  return objectToString.call(value);
}

/**
 * The base implementation of `_.hasIn` without support for deep paths.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {Array|string} key The key to check.
 * @returns {boolean} Returns `true` if `key` exists, else `false`.
 */
function baseHasIn(object, key) {
  return object != null && key in Object(object);
}

/**
 * The base implementation of `_.isEqual` which supports partial comparisons
 * and tracks traversed objects.
 *
 * @private
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @param {Function} [customizer] The function to customize comparisons.
 * @param {boolean} [bitmask] The bitmask of comparison flags.
 *  The bitmask may be composed of the following flags:
 *     1 - Unordered comparison
 *     2 - Partial comparison
 * @param {Object} [stack] Tracks traversed `value` and `other` objects.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 */
function baseIsEqual(value, other, customizer, bitmask, stack) {
  if (value === other) {
    return true;
  }
  if (value == null || other == null || (!isObject(value) && !isObjectLike(other))) {
    return value !== value && other !== other;
  }
  return baseIsEqualDeep(value, other, baseIsEqual, customizer, bitmask, stack);
}

/**
 * A specialized version of `baseIsEqual` for arrays and objects which performs
 * deep comparisons and tracks traversed objects enabling objects with circular
 * references to be compared.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Function} [customizer] The function to customize comparisons.
 * @param {number} [bitmask] The bitmask of comparison flags. See `baseIsEqual`
 *  for more details.
 * @param {Object} [stack] Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function baseIsEqualDeep(object, other, equalFunc, customizer, bitmask, stack) {
  var objIsArr = isArray(object),
      othIsArr = isArray(other),
      objTag = arrayTag,
      othTag = arrayTag;

  if (!objIsArr) {
    objTag = getTag(object);
    objTag = objTag == argsTag ? objectTag : objTag;
  }
  if (!othIsArr) {
    othTag = getTag(other);
    othTag = othTag == argsTag ? objectTag : othTag;
  }
  var objIsObj = objTag == objectTag && !isHostObject(object),
      othIsObj = othTag == objectTag && !isHostObject(other),
      isSameTag = objTag == othTag;

  if (isSameTag && !objIsObj) {
    stack || (stack = new Stack);
    return (objIsArr || isTypedArray(object))
      ? equalArrays(object, other, equalFunc, customizer, bitmask, stack)
      : equalByTag(object, other, objTag, equalFunc, customizer, bitmask, stack);
  }
  if (!(bitmask & PARTIAL_COMPARE_FLAG)) {
    var objIsWrapped = objIsObj && hasOwnProperty.call(object, '__wrapped__'),
        othIsWrapped = othIsObj && hasOwnProperty.call(other, '__wrapped__');

    if (objIsWrapped || othIsWrapped) {
      var objUnwrapped = objIsWrapped ? object.value() : object,
          othUnwrapped = othIsWrapped ? other.value() : other;

      stack || (stack = new Stack);
      return equalFunc(objUnwrapped, othUnwrapped, customizer, bitmask, stack);
    }
  }
  if (!isSameTag) {
    return false;
  }
  stack || (stack = new Stack);
  return equalObjects(object, other, equalFunc, customizer, bitmask, stack);
}

/**
 * The base implementation of `_.isMatch` without support for iteratee shorthands.
 *
 * @private
 * @param {Object} object The object to inspect.
 * @param {Object} source The object of property values to match.
 * @param {Array} matchData The property names, values, and compare flags to match.
 * @param {Function} [customizer] The function to customize comparisons.
 * @returns {boolean} Returns `true` if `object` is a match, else `false`.
 */
function baseIsMatch(object, source, matchData, customizer) {
  var index = matchData.length,
      length = index,
      noCustomizer = !customizer;

  if (object == null) {
    return !length;
  }
  object = Object(object);
  while (index--) {
    var data = matchData[index];
    if ((noCustomizer && data[2])
          ? data[1] !== object[data[0]]
          : !(data[0] in object)
        ) {
      return false;
    }
  }
  while (++index < length) {
    data = matchData[index];
    var key = data[0],
        objValue = object[key],
        srcValue = data[1];

    if (noCustomizer && data[2]) {
      if (objValue === undefined && !(key in object)) {
        return false;
      }
    } else {
      var stack = new Stack;
      if (customizer) {
        var result = customizer(objValue, srcValue, key, object, source, stack);
      }
      if (!(result === undefined
            ? baseIsEqual(srcValue, objValue, customizer, UNORDERED_COMPARE_FLAG | PARTIAL_COMPARE_FLAG, stack)
            : result
          )) {
        return false;
      }
    }
  }
  return true;
}

/**
 * The base implementation of `_.isNative` without bad shim checks.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function,
 *  else `false`.
 */
function baseIsNative(value) {
  if (!isObject(value) || isMasked(value)) {
    return false;
  }
  var pattern = (isFunction(value) || isHostObject(value)) ? reIsNative : reIsHostCtor;
  return pattern.test(toSource(value));
}

/**
 * The base implementation of `_.isTypedArray` without Node.js optimizations.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 */
function baseIsTypedArray(value) {
  return isObjectLike(value) &&
    isLength(value.length) && !!typedArrayTags[objectToString.call(value)];
}

/**
 * The base implementation of `_.iteratee`.
 *
 * @private
 * @param {*} [value=_.identity] The value to convert to an iteratee.
 * @returns {Function} Returns the iteratee.
 */
function baseIteratee(value) {
  // Don't store the `typeof` result in a variable to avoid a JIT bug in Safari 9.
  // See https://bugs.webkit.org/show_bug.cgi?id=156034 for more details.
  if (typeof value == 'function') {
    return value;
  }
  if (value == null) {
    return identity;
  }
  if (typeof value == 'object') {
    return isArray(value)
      ? baseMatchesProperty(value[0], value[1])
      : baseMatches(value);
  }
  return property(value);
}

/**
 * The base implementation of `_.keys` which doesn't treat sparse arrays as dense.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function baseKeys(object) {
  if (!isPrototype(object)) {
    return nativeKeys(object);
  }
  var result = [];
  for (var key in Object(object)) {
    if (hasOwnProperty.call(object, key) && key != 'constructor') {
      result.push(key);
    }
  }
  return result;
}

/**
 * The base implementation of `_.matches` which doesn't clone `source`.
 *
 * @private
 * @param {Object} source The object of property values to match.
 * @returns {Function} Returns the new spec function.
 */
function baseMatches(source) {
  var matchData = getMatchData(source);
  if (matchData.length == 1 && matchData[0][2]) {
    return matchesStrictComparable(matchData[0][0], matchData[0][1]);
  }
  return function(object) {
    return object === source || baseIsMatch(object, source, matchData);
  };
}

/**
 * The base implementation of `_.matchesProperty` which doesn't clone `srcValue`.
 *
 * @private
 * @param {string} path The path of the property to get.
 * @param {*} srcValue The value to match.
 * @returns {Function} Returns the new spec function.
 */
function baseMatchesProperty(path, srcValue) {
  if (isKey(path) && isStrictComparable(srcValue)) {
    return matchesStrictComparable(toKey(path), srcValue);
  }
  return function(object) {
    var objValue = get(object, path);
    return (objValue === undefined && objValue === srcValue)
      ? hasIn(object, path)
      : baseIsEqual(srcValue, objValue, undefined, UNORDERED_COMPARE_FLAG | PARTIAL_COMPARE_FLAG);
  };
}

/**
 * A specialized version of `baseProperty` which supports deep paths.
 *
 * @private
 * @param {Array|string} path The path of the property to get.
 * @returns {Function} Returns the new accessor function.
 */
function basePropertyDeep(path) {
  return function(object) {
    return baseGet(object, path);
  };
}

/**
 * The base implementation of `_.toString` which doesn't convert nullish
 * values to empty strings.
 *
 * @private
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 */
function baseToString(value) {
  // Exit early for strings to avoid a performance hit in some environments.
  if (typeof value == 'string') {
    return value;
  }
  if (isSymbol(value)) {
    return symbolToString ? symbolToString.call(value) : '';
  }
  var result = (value + '');
  return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
}

/**
 * Casts `value` to a path array if it's not one.
 *
 * @private
 * @param {*} value The value to inspect.
 * @returns {Array} Returns the cast property path array.
 */
function castPath(value) {
  return isArray(value) ? value : stringToPath(value);
}

/**
 * Creates a function like `_.groupBy`.
 *
 * @private
 * @param {Function} setter The function to set accumulator values.
 * @param {Function} [initializer] The accumulator object initializer.
 * @returns {Function} Returns the new aggregator function.
 */
function createAggregator(setter, initializer) {
  return function(collection, iteratee) {
    var func = isArray(collection) ? arrayAggregator : baseAggregator,
        accumulator = initializer ? initializer() : {};

    return func(collection, setter, baseIteratee(iteratee, 2), accumulator);
  };
}

/**
 * Creates a `baseEach` or `baseEachRight` function.
 *
 * @private
 * @param {Function} eachFunc The function to iterate over a collection.
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {Function} Returns the new base function.
 */
function createBaseEach(eachFunc, fromRight) {
  return function(collection, iteratee) {
    if (collection == null) {
      return collection;
    }
    if (!isArrayLike(collection)) {
      return eachFunc(collection, iteratee);
    }
    var length = collection.length,
        index = fromRight ? length : -1,
        iterable = Object(collection);

    while ((fromRight ? index-- : ++index < length)) {
      if (iteratee(iterable[index], index, iterable) === false) {
        break;
      }
    }
    return collection;
  };
}

/**
 * Creates a base function for methods like `_.forIn` and `_.forOwn`.
 *
 * @private
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {Function} Returns the new base function.
 */
function createBaseFor(fromRight) {
  return function(object, iteratee, keysFunc) {
    var index = -1,
        iterable = Object(object),
        props = keysFunc(object),
        length = props.length;

    while (length--) {
      var key = props[fromRight ? length : ++index];
      if (iteratee(iterable[key], key, iterable) === false) {
        break;
      }
    }
    return object;
  };
}

/**
 * A specialized version of `baseIsEqualDeep` for arrays with support for
 * partial deep comparisons.
 *
 * @private
 * @param {Array} array The array to compare.
 * @param {Array} other The other array to compare.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Function} customizer The function to customize comparisons.
 * @param {number} bitmask The bitmask of comparison flags. See `baseIsEqual`
 *  for more details.
 * @param {Object} stack Tracks traversed `array` and `other` objects.
 * @returns {boolean} Returns `true` if the arrays are equivalent, else `false`.
 */
function equalArrays(array, other, equalFunc, customizer, bitmask, stack) {
  var isPartial = bitmask & PARTIAL_COMPARE_FLAG,
      arrLength = array.length,
      othLength = other.length;

  if (arrLength != othLength && !(isPartial && othLength > arrLength)) {
    return false;
  }
  // Assume cyclic values are equal.
  var stacked = stack.get(array);
  if (stacked && stack.get(other)) {
    return stacked == other;
  }
  var index = -1,
      result = true,
      seen = (bitmask & UNORDERED_COMPARE_FLAG) ? new SetCache : undefined;

  stack.set(array, other);
  stack.set(other, array);

  // Ignore non-index properties.
  while (++index < arrLength) {
    var arrValue = array[index],
        othValue = other[index];

    if (customizer) {
      var compared = isPartial
        ? customizer(othValue, arrValue, index, other, array, stack)
        : customizer(arrValue, othValue, index, array, other, stack);
    }
    if (compared !== undefined) {
      if (compared) {
        continue;
      }
      result = false;
      break;
    }
    // Recursively compare arrays (susceptible to call stack limits).
    if (seen) {
      if (!arraySome(other, function(othValue, othIndex) {
            if (!seen.has(othIndex) &&
                (arrValue === othValue || equalFunc(arrValue, othValue, customizer, bitmask, stack))) {
              return seen.add(othIndex);
            }
          })) {
        result = false;
        break;
      }
    } else if (!(
          arrValue === othValue ||
            equalFunc(arrValue, othValue, customizer, bitmask, stack)
        )) {
      result = false;
      break;
    }
  }
  stack['delete'](array);
  stack['delete'](other);
  return result;
}

/**
 * A specialized version of `baseIsEqualDeep` for comparing objects of
 * the same `toStringTag`.
 *
 * **Note:** This function only supports comparing values with tags of
 * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {string} tag The `toStringTag` of the objects to compare.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Function} customizer The function to customize comparisons.
 * @param {number} bitmask The bitmask of comparison flags. See `baseIsEqual`
 *  for more details.
 * @param {Object} stack Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function equalByTag(object, other, tag, equalFunc, customizer, bitmask, stack) {
  switch (tag) {
    case dataViewTag:
      if ((object.byteLength != other.byteLength) ||
          (object.byteOffset != other.byteOffset)) {
        return false;
      }
      object = object.buffer;
      other = other.buffer;

    case arrayBufferTag:
      if ((object.byteLength != other.byteLength) ||
          !equalFunc(new Uint8Array(object), new Uint8Array(other))) {
        return false;
      }
      return true;

    case boolTag:
    case dateTag:
    case numberTag:
      // Coerce booleans to `1` or `0` and dates to milliseconds.
      // Invalid dates are coerced to `NaN`.
      return eq(+object, +other);

    case errorTag:
      return object.name == other.name && object.message == other.message;

    case regexpTag:
    case stringTag:
      // Coerce regexes to strings and treat strings, primitives and objects,
      // as equal. See http://www.ecma-international.org/ecma-262/7.0/#sec-regexp.prototype.tostring
      // for more details.
      return object == (other + '');

    case mapTag:
      var convert = mapToArray;

    case setTag:
      var isPartial = bitmask & PARTIAL_COMPARE_FLAG;
      convert || (convert = setToArray);

      if (object.size != other.size && !isPartial) {
        return false;
      }
      // Assume cyclic values are equal.
      var stacked = stack.get(object);
      if (stacked) {
        return stacked == other;
      }
      bitmask |= UNORDERED_COMPARE_FLAG;

      // Recursively compare objects (susceptible to call stack limits).
      stack.set(object, other);
      var result = equalArrays(convert(object), convert(other), equalFunc, customizer, bitmask, stack);
      stack['delete'](object);
      return result;

    case symbolTag:
      if (symbolValueOf) {
        return symbolValueOf.call(object) == symbolValueOf.call(other);
      }
  }
  return false;
}

/**
 * A specialized version of `baseIsEqualDeep` for objects with support for
 * partial deep comparisons.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Function} customizer The function to customize comparisons.
 * @param {number} bitmask The bitmask of comparison flags. See `baseIsEqual`
 *  for more details.
 * @param {Object} stack Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function equalObjects(object, other, equalFunc, customizer, bitmask, stack) {
  var isPartial = bitmask & PARTIAL_COMPARE_FLAG,
      objProps = keys(object),
      objLength = objProps.length,
      othProps = keys(other),
      othLength = othProps.length;

  if (objLength != othLength && !isPartial) {
    return false;
  }
  var index = objLength;
  while (index--) {
    var key = objProps[index];
    if (!(isPartial ? key in other : hasOwnProperty.call(other, key))) {
      return false;
    }
  }
  // Assume cyclic values are equal.
  var stacked = stack.get(object);
  if (stacked && stack.get(other)) {
    return stacked == other;
  }
  var result = true;
  stack.set(object, other);
  stack.set(other, object);

  var skipCtor = isPartial;
  while (++index < objLength) {
    key = objProps[index];
    var objValue = object[key],
        othValue = other[key];

    if (customizer) {
      var compared = isPartial
        ? customizer(othValue, objValue, key, other, object, stack)
        : customizer(objValue, othValue, key, object, other, stack);
    }
    // Recursively compare objects (susceptible to call stack limits).
    if (!(compared === undefined
          ? (objValue === othValue || equalFunc(objValue, othValue, customizer, bitmask, stack))
          : compared
        )) {
      result = false;
      break;
    }
    skipCtor || (skipCtor = key == 'constructor');
  }
  if (result && !skipCtor) {
    var objCtor = object.constructor,
        othCtor = other.constructor;

    // Non `Object` object instances with different constructors are not equal.
    if (objCtor != othCtor &&
        ('constructor' in object && 'constructor' in other) &&
        !(typeof objCtor == 'function' && objCtor instanceof objCtor &&
          typeof othCtor == 'function' && othCtor instanceof othCtor)) {
      result = false;
    }
  }
  stack['delete'](object);
  stack['delete'](other);
  return result;
}

/**
 * Gets the data for `map`.
 *
 * @private
 * @param {Object} map The map to query.
 * @param {string} key The reference key.
 * @returns {*} Returns the map data.
 */
function getMapData(map, key) {
  var data = map.__data__;
  return isKeyable(key)
    ? data[typeof key == 'string' ? 'string' : 'hash']
    : data.map;
}

/**
 * Gets the property names, values, and compare flags of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the match data of `object`.
 */
function getMatchData(object) {
  var result = keys(object),
      length = result.length;

  while (length--) {
    var key = result[length],
        value = object[key];

    result[length] = [key, value, isStrictComparable(value)];
  }
  return result;
}

/**
 * Gets the native function at `key` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the method to get.
 * @returns {*} Returns the function if it's native, else `undefined`.
 */
function getNative(object, key) {
  var value = getValue(object, key);
  return baseIsNative(value) ? value : undefined;
}

/**
 * Gets the `toStringTag` of `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
var getTag = baseGetTag;

// Fallback for data views, maps, sets, and weak maps in IE 11,
// for data views in Edge < 14, and promises in Node.js.
if ((DataView && getTag(new DataView(new ArrayBuffer(1))) != dataViewTag) ||
    (Map && getTag(new Map) != mapTag) ||
    (Promise && getTag(Promise.resolve()) != promiseTag) ||
    (Set && getTag(new Set) != setTag) ||
    (WeakMap && getTag(new WeakMap) != weakMapTag)) {
  getTag = function(value) {
    var result = objectToString.call(value),
        Ctor = result == objectTag ? value.constructor : undefined,
        ctorString = Ctor ? toSource(Ctor) : undefined;

    if (ctorString) {
      switch (ctorString) {
        case dataViewCtorString: return dataViewTag;
        case mapCtorString: return mapTag;
        case promiseCtorString: return promiseTag;
        case setCtorString: return setTag;
        case weakMapCtorString: return weakMapTag;
      }
    }
    return result;
  };
}

/**
 * Checks if `path` exists on `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array|string} path The path to check.
 * @param {Function} hasFunc The function to check properties.
 * @returns {boolean} Returns `true` if `path` exists, else `false`.
 */
function hasPath(object, path, hasFunc) {
  path = isKey(path, object) ? [path] : castPath(path);

  var result,
      index = -1,
      length = path.length;

  while (++index < length) {
    var key = toKey(path[index]);
    if (!(result = object != null && hasFunc(object, key))) {
      break;
    }
    object = object[key];
  }
  if (result) {
    return result;
  }
  var length = object ? object.length : 0;
  return !!length && isLength(length) && isIndex(key, length) &&
    (isArray(object) || isArguments(object));
}

/**
 * Checks if `value` is a valid array-like index.
 *
 * @private
 * @param {*} value The value to check.
 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
 */
function isIndex(value, length) {
  length = length == null ? MAX_SAFE_INTEGER : length;
  return !!length &&
    (typeof value == 'number' || reIsUint.test(value)) &&
    (value > -1 && value % 1 == 0 && value < length);
}

/**
 * Checks if `value` is a property name and not a property path.
 *
 * @private
 * @param {*} value The value to check.
 * @param {Object} [object] The object to query keys on.
 * @returns {boolean} Returns `true` if `value` is a property name, else `false`.
 */
function isKey(value, object) {
  if (isArray(value)) {
    return false;
  }
  var type = typeof value;
  if (type == 'number' || type == 'symbol' || type == 'boolean' ||
      value == null || isSymbol(value)) {
    return true;
  }
  return reIsPlainProp.test(value) || !reIsDeepProp.test(value) ||
    (object != null && value in Object(object));
}

/**
 * Checks if `value` is suitable for use as unique object key.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
 */
function isKeyable(value) {
  var type = typeof value;
  return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
    ? (value !== '__proto__')
    : (value === null);
}

/**
 * Checks if `func` has its source masked.
 *
 * @private
 * @param {Function} func The function to check.
 * @returns {boolean} Returns `true` if `func` is masked, else `false`.
 */
function isMasked(func) {
  return !!maskSrcKey && (maskSrcKey in func);
}

/**
 * Checks if `value` is likely a prototype object.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
 */
function isPrototype(value) {
  var Ctor = value && value.constructor,
      proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto;

  return value === proto;
}

/**
 * Checks if `value` is suitable for strict equality comparisons, i.e. `===`.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` if suitable for strict
 *  equality comparisons, else `false`.
 */
function isStrictComparable(value) {
  return value === value && !isObject(value);
}

/**
 * A specialized version of `matchesProperty` for source values suitable
 * for strict equality comparisons, i.e. `===`.
 *
 * @private
 * @param {string} key The key of the property to get.
 * @param {*} srcValue The value to match.
 * @returns {Function} Returns the new spec function.
 */
function matchesStrictComparable(key, srcValue) {
  return function(object) {
    if (object == null) {
      return false;
    }
    return object[key] === srcValue &&
      (srcValue !== undefined || (key in Object(object)));
  };
}

/**
 * Converts `string` to a property path array.
 *
 * @private
 * @param {string} string The string to convert.
 * @returns {Array} Returns the property path array.
 */
var stringToPath = memoize(function(string) {
  string = toString(string);

  var result = [];
  if (reLeadingDot.test(string)) {
    result.push('');
  }
  string.replace(rePropName, function(match, number, quote, string) {
    result.push(quote ? string.replace(reEscapeChar, '$1') : (number || match));
  });
  return result;
});

/**
 * Converts `value` to a string key if it's not a string or symbol.
 *
 * @private
 * @param {*} value The value to inspect.
 * @returns {string|symbol} Returns the key.
 */
function toKey(value) {
  if (typeof value == 'string' || isSymbol(value)) {
    return value;
  }
  var result = (value + '');
  return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
}

/**
 * Converts `func` to its source code.
 *
 * @private
 * @param {Function} func The function to process.
 * @returns {string} Returns the source code.
 */
function toSource(func) {
  if (func != null) {
    try {
      return funcToString.call(func);
    } catch (e) {}
    try {
      return (func + '');
    } catch (e) {}
  }
  return '';
}

/**
 * Creates an object composed of keys generated from the results of running
 * each element of `collection` thru `iteratee`. The order of grouped values
 * is determined by the order they occur in `collection`. The corresponding
 * value of each key is an array of elements responsible for generating the
 * key. The iteratee is invoked with one argument: (value).
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Collection
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} [iteratee=_.identity]
 *  The iteratee to transform keys.
 * @returns {Object} Returns the composed aggregate object.
 * @example
 *
 * _.groupBy([6.1, 4.2, 6.3], Math.floor);
 * // => { '4': [4.2], '6': [6.1, 6.3] }
 *
 * // The `_.property` iteratee shorthand.
 * _.groupBy(['one', 'two', 'three'], 'length');
 * // => { '3': ['one', 'two'], '5': ['three'] }
 */
var groupBy = createAggregator(function(result, value, key) {
  if (hasOwnProperty.call(result, key)) {
    result[key].push(value);
  } else {
    result[key] = [value];
  }
});

/**
 * Creates a function that memoizes the result of `func`. If `resolver` is
 * provided, it determines the cache key for storing the result based on the
 * arguments provided to the memoized function. By default, the first argument
 * provided to the memoized function is used as the map cache key. The `func`
 * is invoked with the `this` binding of the memoized function.
 *
 * **Note:** The cache is exposed as the `cache` property on the memoized
 * function. Its creation may be customized by replacing the `_.memoize.Cache`
 * constructor with one whose instances implement the
 * [`Map`](http://ecma-international.org/ecma-262/7.0/#sec-properties-of-the-map-prototype-object)
 * method interface of `delete`, `get`, `has`, and `set`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to have its output memoized.
 * @param {Function} [resolver] The function to resolve the cache key.
 * @returns {Function} Returns the new memoized function.
 * @example
 *
 * var object = { 'a': 1, 'b': 2 };
 * var other = { 'c': 3, 'd': 4 };
 *
 * var values = _.memoize(_.values);
 * values(object);
 * // => [1, 2]
 *
 * values(other);
 * // => [3, 4]
 *
 * object.a = 2;
 * values(object);
 * // => [1, 2]
 *
 * // Modify the result cache.
 * values.cache.set(object, ['a', 'b']);
 * values(object);
 * // => ['a', 'b']
 *
 * // Replace `_.memoize.Cache`.
 * _.memoize.Cache = WeakMap;
 */
function memoize(func, resolver) {
  if (typeof func != 'function' || (resolver && typeof resolver != 'function')) {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  var memoized = function() {
    var args = arguments,
        key = resolver ? resolver.apply(this, args) : args[0],
        cache = memoized.cache;

    if (cache.has(key)) {
      return cache.get(key);
    }
    var result = func.apply(this, args);
    memoized.cache = cache.set(key, result);
    return result;
  };
  memoized.cache = new (memoize.Cache || MapCache);
  return memoized;
}

// Assign cache to `_.memoize`.
memoize.Cache = MapCache;

/**
 * Performs a
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * comparison between two values to determine if they are equivalent.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * _.eq(object, object);
 * // => true
 *
 * _.eq(object, other);
 * // => false
 *
 * _.eq('a', 'a');
 * // => true
 *
 * _.eq('a', Object('a'));
 * // => false
 *
 * _.eq(NaN, NaN);
 * // => true
 */
function eq(value, other) {
  return value === other || (value !== value && other !== other);
}

/**
 * Checks if `value` is likely an `arguments` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 *  else `false`.
 * @example
 *
 * _.isArguments(function() { return arguments; }());
 * // => true
 *
 * _.isArguments([1, 2, 3]);
 * // => false
 */
function isArguments(value) {
  // Safari 8.1 makes `arguments.callee` enumerable in strict mode.
  return isArrayLikeObject(value) && hasOwnProperty.call(value, 'callee') &&
    (!propertyIsEnumerable.call(value, 'callee') || objectToString.call(value) == argsTag);
}

/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */
var isArray = Array.isArray;

/**
 * Checks if `value` is array-like. A value is considered array-like if it's
 * not a function and has a `value.length` that's an integer greater than or
 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
 * @example
 *
 * _.isArrayLike([1, 2, 3]);
 * // => true
 *
 * _.isArrayLike(document.body.children);
 * // => true
 *
 * _.isArrayLike('abc');
 * // => true
 *
 * _.isArrayLike(_.noop);
 * // => false
 */
function isArrayLike(value) {
  return value != null && isLength(value.length) && !isFunction(value);
}

/**
 * This method is like `_.isArrayLike` except that it also checks if `value`
 * is an object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array-like object,
 *  else `false`.
 * @example
 *
 * _.isArrayLikeObject([1, 2, 3]);
 * // => true
 *
 * _.isArrayLikeObject(document.body.children);
 * // => true
 *
 * _.isArrayLikeObject('abc');
 * // => false
 *
 * _.isArrayLikeObject(_.noop);
 * // => false
 */
function isArrayLikeObject(value) {
  return isObjectLike(value) && isArrayLike(value);
}

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 8-9 which returns 'object' for typed array and other constructors.
  var tag = isObject(value) ? objectToString.call(value) : '';
  return tag == funcTag || tag == genTag;
}

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This method is loosely based on
 * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 * @example
 *
 * _.isLength(3);
 * // => true
 *
 * _.isLength(Number.MIN_VALUE);
 * // => false
 *
 * _.isLength(Infinity);
 * // => false
 *
 * _.isLength('3');
 * // => false
 */
function isLength(value) {
  return typeof value == 'number' &&
    value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return !!value && typeof value == 'object';
}

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol(value) {
  return typeof value == 'symbol' ||
    (isObjectLike(value) && objectToString.call(value) == symbolTag);
}

/**
 * Checks if `value` is classified as a typed array.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 * @example
 *
 * _.isTypedArray(new Uint8Array);
 * // => true
 *
 * _.isTypedArray([]);
 * // => false
 */
var isTypedArray = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray;

/**
 * Converts `value` to a string. An empty string is returned for `null`
 * and `undefined` values. The sign of `-0` is preserved.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 * @example
 *
 * _.toString(null);
 * // => ''
 *
 * _.toString(-0);
 * // => '-0'
 *
 * _.toString([1, 2, 3]);
 * // => '1,2,3'
 */
function toString(value) {
  return value == null ? '' : baseToString(value);
}

/**
 * Gets the value at `path` of `object`. If the resolved value is
 * `undefined`, the `defaultValue` is returned in its place.
 *
 * @static
 * @memberOf _
 * @since 3.7.0
 * @category Object
 * @param {Object} object The object to query.
 * @param {Array|string} path The path of the property to get.
 * @param {*} [defaultValue] The value returned for `undefined` resolved values.
 * @returns {*} Returns the resolved value.
 * @example
 *
 * var object = { 'a': [{ 'b': { 'c': 3 } }] };
 *
 * _.get(object, 'a[0].b.c');
 * // => 3
 *
 * _.get(object, ['a', '0', 'b', 'c']);
 * // => 3
 *
 * _.get(object, 'a.b.c', 'default');
 * // => 'default'
 */
function get(object, path, defaultValue) {
  var result = object == null ? undefined : baseGet(object, path);
  return result === undefined ? defaultValue : result;
}

/**
 * Checks if `path` is a direct or inherited property of `object`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Object
 * @param {Object} object The object to query.
 * @param {Array|string} path The path to check.
 * @returns {boolean} Returns `true` if `path` exists, else `false`.
 * @example
 *
 * var object = _.create({ 'a': _.create({ 'b': 2 }) });
 *
 * _.hasIn(object, 'a');
 * // => true
 *
 * _.hasIn(object, 'a.b');
 * // => true
 *
 * _.hasIn(object, ['a', 'b']);
 * // => true
 *
 * _.hasIn(object, 'b');
 * // => false
 */
function hasIn(object, path) {
  return object != null && hasPath(object, path, baseHasIn);
}

/**
 * Creates an array of the own enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects. See the
 * [ES spec](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
 * for more details.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keys(new Foo);
 * // => ['a', 'b'] (iteration order is not guaranteed)
 *
 * _.keys('hi');
 * // => ['0', '1']
 */
function keys(object) {
  return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
}

/**
 * This method returns the first argument it receives.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Util
 * @param {*} value Any value.
 * @returns {*} Returns `value`.
 * @example
 *
 * var object = { 'a': 1 };
 *
 * console.log(_.identity(object) === object);
 * // => true
 */
function identity(value) {
  return value;
}

/**
 * Creates a function that returns the value at `path` of a given object.
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Util
 * @param {Array|string} path The path of the property to get.
 * @returns {Function} Returns the new accessor function.
 * @example
 *
 * var objects = [
 *   { 'a': { 'b': 2 } },
 *   { 'a': { 'b': 1 } }
 * ];
 *
 * _.map(objects, _.property('a.b'));
 * // => [2, 1]
 *
 * _.map(_.sortBy(objects, _.property(['a', 'b'])), 'a.b');
 * // => [1, 2]
 */
function property(path) {
  return isKey(path) ? baseProperty(toKey(path)) : basePropertyDeep(path);
}

module.exports = groupBy;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],5:[function(require,module,exports){
(function (global){
/**
 * lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */

/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER = 9007199254740991;

/** `Object#toString` result references. */
var argsTag = '[object Arguments]',
    funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]',
    mapTag = '[object Map]',
    objectTag = '[object Object]',
    promiseTag = '[object Promise]',
    setTag = '[object Set]',
    weakMapTag = '[object WeakMap]';

var dataViewTag = '[object DataView]';

/**
 * Used to match `RegExp`
 * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
 */
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

/** Used to detect host constructors (Safari). */
var reIsHostCtor = /^\[object .+?Constructor\]$/;

/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

/** Detect free variable `exports`. */
var freeExports = typeof exports == 'object' && exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && typeof module == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/**
 * Gets the value at `key` of `object`.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {string} key The key of the property to get.
 * @returns {*} Returns the property value.
 */
function getValue(object, key) {
  return object == null ? undefined : object[key];
}

/**
 * Checks if `value` is a host object in IE < 9.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a host object, else `false`.
 */
function isHostObject(value) {
  // Many host objects are `Object` objects that can coerce to strings
  // despite having improperly defined `toString` methods.
  var result = false;
  if (value != null && typeof value.toString != 'function') {
    try {
      result = !!(value + '');
    } catch (e) {}
  }
  return result;
}

/**
 * Creates a unary function that invokes `func` with its argument transformed.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {Function} transform The argument transform.
 * @returns {Function} Returns the new function.
 */
function overArg(func, transform) {
  return function(arg) {
    return func(transform(arg));
  };
}

/** Used for built-in method references. */
var funcProto = Function.prototype,
    objectProto = Object.prototype;

/** Used to detect overreaching core-js shims. */
var coreJsData = root['__core-js_shared__'];

/** Used to detect methods masquerading as native. */
var maskSrcKey = (function() {
  var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
  return uid ? ('Symbol(src)_1.' + uid) : '';
}());

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/** Used to detect if a method is native. */
var reIsNative = RegExp('^' +
  funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\$&')
  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
);

/** Built-in value references. */
var Buffer = moduleExports ? root.Buffer : undefined,
    propertyIsEnumerable = objectProto.propertyIsEnumerable;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined,
    nativeKeys = overArg(Object.keys, Object);

/* Built-in method references that are verified to be native. */
var DataView = getNative(root, 'DataView'),
    Map = getNative(root, 'Map'),
    Promise = getNative(root, 'Promise'),
    Set = getNative(root, 'Set'),
    WeakMap = getNative(root, 'WeakMap');

/** Detect if properties shadowing those on `Object.prototype` are non-enumerable. */
var nonEnumShadows = !propertyIsEnumerable.call({ 'valueOf': 1 }, 'valueOf');

/** Used to detect maps, sets, and weakmaps. */
var dataViewCtorString = toSource(DataView),
    mapCtorString = toSource(Map),
    promiseCtorString = toSource(Promise),
    setCtorString = toSource(Set),
    weakMapCtorString = toSource(WeakMap);

/**
 * The base implementation of `getTag`.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
function baseGetTag(value) {
  return objectToString.call(value);
}

/**
 * The base implementation of `_.isNative` without bad shim checks.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function,
 *  else `false`.
 */
function baseIsNative(value) {
  if (!isObject(value) || isMasked(value)) {
    return false;
  }
  var pattern = (isFunction(value) || isHostObject(value)) ? reIsNative : reIsHostCtor;
  return pattern.test(toSource(value));
}

/**
 * Gets the native function at `key` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the method to get.
 * @returns {*} Returns the function if it's native, else `undefined`.
 */
function getNative(object, key) {
  var value = getValue(object, key);
  return baseIsNative(value) ? value : undefined;
}

/**
 * Gets the `toStringTag` of `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
var getTag = baseGetTag;

// Fallback for data views, maps, sets, and weak maps in IE 11,
// for data views in Edge < 14, and promises in Node.js.
if ((DataView && getTag(new DataView(new ArrayBuffer(1))) != dataViewTag) ||
    (Map && getTag(new Map) != mapTag) ||
    (Promise && getTag(Promise.resolve()) != promiseTag) ||
    (Set && getTag(new Set) != setTag) ||
    (WeakMap && getTag(new WeakMap) != weakMapTag)) {
  getTag = function(value) {
    var result = objectToString.call(value),
        Ctor = result == objectTag ? value.constructor : undefined,
        ctorString = Ctor ? toSource(Ctor) : undefined;

    if (ctorString) {
      switch (ctorString) {
        case dataViewCtorString: return dataViewTag;
        case mapCtorString: return mapTag;
        case promiseCtorString: return promiseTag;
        case setCtorString: return setTag;
        case weakMapCtorString: return weakMapTag;
      }
    }
    return result;
  };
}

/**
 * Checks if `func` has its source masked.
 *
 * @private
 * @param {Function} func The function to check.
 * @returns {boolean} Returns `true` if `func` is masked, else `false`.
 */
function isMasked(func) {
  return !!maskSrcKey && (maskSrcKey in func);
}

/**
 * Checks if `value` is likely a prototype object.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
 */
function isPrototype(value) {
  var Ctor = value && value.constructor,
      proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto;

  return value === proto;
}

/**
 * Converts `func` to its source code.
 *
 * @private
 * @param {Function} func The function to process.
 * @returns {string} Returns the source code.
 */
function toSource(func) {
  if (func != null) {
    try {
      return funcToString.call(func);
    } catch (e) {}
    try {
      return (func + '');
    } catch (e) {}
  }
  return '';
}

/**
 * Checks if `value` is likely an `arguments` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 *  else `false`.
 * @example
 *
 * _.isArguments(function() { return arguments; }());
 * // => true
 *
 * _.isArguments([1, 2, 3]);
 * // => false
 */
function isArguments(value) {
  // Safari 8.1 makes `arguments.callee` enumerable in strict mode.
  return isArrayLikeObject(value) && hasOwnProperty.call(value, 'callee') &&
    (!propertyIsEnumerable.call(value, 'callee') || objectToString.call(value) == argsTag);
}

/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */
var isArray = Array.isArray;

/**
 * Checks if `value` is array-like. A value is considered array-like if it's
 * not a function and has a `value.length` that's an integer greater than or
 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
 * @example
 *
 * _.isArrayLike([1, 2, 3]);
 * // => true
 *
 * _.isArrayLike(document.body.children);
 * // => true
 *
 * _.isArrayLike('abc');
 * // => true
 *
 * _.isArrayLike(_.noop);
 * // => false
 */
function isArrayLike(value) {
  return value != null && isLength(value.length) && !isFunction(value);
}

/**
 * This method is like `_.isArrayLike` except that it also checks if `value`
 * is an object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array-like object,
 *  else `false`.
 * @example
 *
 * _.isArrayLikeObject([1, 2, 3]);
 * // => true
 *
 * _.isArrayLikeObject(document.body.children);
 * // => true
 *
 * _.isArrayLikeObject('abc');
 * // => false
 *
 * _.isArrayLikeObject(_.noop);
 * // => false
 */
function isArrayLikeObject(value) {
  return isObjectLike(value) && isArrayLike(value);
}

/**
 * Checks if `value` is a buffer.
 *
 * @static
 * @memberOf _
 * @since 4.3.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a buffer, else `false`.
 * @example
 *
 * _.isBuffer(new Buffer(2));
 * // => true
 *
 * _.isBuffer(new Uint8Array(2));
 * // => false
 */
var isBuffer = nativeIsBuffer || stubFalse;

/**
 * Checks if `value` is an empty object, collection, map, or set.
 *
 * Objects are considered empty if they have no own enumerable string keyed
 * properties.
 *
 * Array-like values such as `arguments` objects, arrays, buffers, strings, or
 * jQuery-like collections are considered empty if they have a `length` of `0`.
 * Similarly, maps and sets are considered empty if they have a `size` of `0`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is empty, else `false`.
 * @example
 *
 * _.isEmpty(null);
 * // => true
 *
 * _.isEmpty(true);
 * // => true
 *
 * _.isEmpty(1);
 * // => true
 *
 * _.isEmpty([1, 2, 3]);
 * // => false
 *
 * _.isEmpty({ 'a': 1 });
 * // => false
 */
function isEmpty(value) {
  if (isArrayLike(value) &&
      (isArray(value) || typeof value == 'string' ||
        typeof value.splice == 'function' || isBuffer(value) || isArguments(value))) {
    return !value.length;
  }
  var tag = getTag(value);
  if (tag == mapTag || tag == setTag) {
    return !value.size;
  }
  if (nonEnumShadows || isPrototype(value)) {
    return !nativeKeys(value).length;
  }
  for (var key in value) {
    if (hasOwnProperty.call(value, key)) {
      return false;
    }
  }
  return true;
}

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 8-9 which returns 'object' for typed array and other constructors.
  var tag = isObject(value) ? objectToString.call(value) : '';
  return tag == funcTag || tag == genTag;
}

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This method is loosely based on
 * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 * @example
 *
 * _.isLength(3);
 * // => true
 *
 * _.isLength(Number.MIN_VALUE);
 * // => false
 *
 * _.isLength(Infinity);
 * // => false
 *
 * _.isLength('3');
 * // => false
 */
function isLength(value) {
  return typeof value == 'number' &&
    value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return !!value && typeof value == 'object';
}

/**
 * This method returns `false`.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {boolean} Returns `false`.
 * @example
 *
 * _.times(2, _.stubFalse);
 * // => [false, false]
 */
function stubFalse() {
  return false;
}

module.exports = isEmpty;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],6:[function(require,module,exports){
(function (global){
/**
 * lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */

/** Used as the size to enable large array optimizations. */
var LARGE_ARRAY_SIZE = 200;

/** Used as the `TypeError` message for "Functions" methods. */
var FUNC_ERROR_TEXT = 'Expected a function';

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/** Used to compose bitmasks for comparison styles. */
var UNORDERED_COMPARE_FLAG = 1,
    PARTIAL_COMPARE_FLAG = 2;

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0,
    MAX_SAFE_INTEGER = 9007199254740991;

/** `Object#toString` result references. */
var argsTag = '[object Arguments]',
    arrayTag = '[object Array]',
    boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    errorTag = '[object Error]',
    funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]',
    mapTag = '[object Map]',
    numberTag = '[object Number]',
    objectTag = '[object Object]',
    promiseTag = '[object Promise]',
    regexpTag = '[object RegExp]',
    setTag = '[object Set]',
    stringTag = '[object String]',
    symbolTag = '[object Symbol]',
    weakMapTag = '[object WeakMap]';

var arrayBufferTag = '[object ArrayBuffer]',
    dataViewTag = '[object DataView]',
    float32Tag = '[object Float32Array]',
    float64Tag = '[object Float64Array]',
    int8Tag = '[object Int8Array]',
    int16Tag = '[object Int16Array]',
    int32Tag = '[object Int32Array]',
    uint8Tag = '[object Uint8Array]',
    uint8ClampedTag = '[object Uint8ClampedArray]',
    uint16Tag = '[object Uint16Array]',
    uint32Tag = '[object Uint32Array]';

/** Used to match property names within property paths. */
var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
    reIsPlainProp = /^\w*$/,
    reLeadingDot = /^\./,
    rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;

/**
 * Used to match `RegExp`
 * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
 */
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

/** Used to match backslashes in property paths. */
var reEscapeChar = /\\(\\)?/g;

/** Used to detect host constructors (Safari). */
var reIsHostCtor = /^\[object .+?Constructor\]$/;

/** Used to detect unsigned integer values. */
var reIsUint = /^(?:0|[1-9]\d*)$/;

/** Used to identify `toStringTag` values of typed arrays. */
var typedArrayTags = {};
typedArrayTags[float32Tag] = typedArrayTags[float64Tag] =
typedArrayTags[int8Tag] = typedArrayTags[int16Tag] =
typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] =
typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] =
typedArrayTags[uint32Tag] = true;
typedArrayTags[argsTag] = typedArrayTags[arrayTag] =
typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] =
typedArrayTags[dataViewTag] = typedArrayTags[dateTag] =
typedArrayTags[errorTag] = typedArrayTags[funcTag] =
typedArrayTags[mapTag] = typedArrayTags[numberTag] =
typedArrayTags[objectTag] = typedArrayTags[regexpTag] =
typedArrayTags[setTag] = typedArrayTags[stringTag] =
typedArrayTags[weakMapTag] = false;

/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

/** Detect free variable `exports`. */
var freeExports = typeof exports == 'object' && exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && typeof module == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/** Detect free variable `process` from Node.js. */
var freeProcess = moduleExports && freeGlobal.process;

/** Used to access faster Node.js helpers. */
var nodeUtil = (function() {
  try {
    return freeProcess && freeProcess.binding('util');
  } catch (e) {}
}());

/* Node.js helper references. */
var nodeIsTypedArray = nodeUtil && nodeUtil.isTypedArray;

/**
 * A specialized version of `_.reduce` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @param {*} [accumulator] The initial value.
 * @param {boolean} [initAccum] Specify using the first element of `array` as
 *  the initial value.
 * @returns {*} Returns the accumulated value.
 */
function arrayReduce(array, iteratee, accumulator, initAccum) {
  var index = -1,
      length = array ? array.length : 0;

  if (initAccum && length) {
    accumulator = array[++index];
  }
  while (++index < length) {
    accumulator = iteratee(accumulator, array[index], index, array);
  }
  return accumulator;
}

/**
 * A specialized version of `_.some` for arrays without support for iteratee
 * shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} predicate The function invoked per iteration.
 * @returns {boolean} Returns `true` if any element passes the predicate check,
 *  else `false`.
 */
function arraySome(array, predicate) {
  var index = -1,
      length = array ? array.length : 0;

  while (++index < length) {
    if (predicate(array[index], index, array)) {
      return true;
    }
  }
  return false;
}

/**
 * The base implementation of `_.property` without support for deep paths.
 *
 * @private
 * @param {string} key The key of the property to get.
 * @returns {Function} Returns the new accessor function.
 */
function baseProperty(key) {
  return function(object) {
    return object == null ? undefined : object[key];
  };
}

/**
 * The base implementation of `_.reduce` and `_.reduceRight`, without support
 * for iteratee shorthands, which iterates over `collection` using `eachFunc`.
 *
 * @private
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @param {*} accumulator The initial value.
 * @param {boolean} initAccum Specify using the first or last element of
 *  `collection` as the initial value.
 * @param {Function} eachFunc The function to iterate over `collection`.
 * @returns {*} Returns the accumulated value.
 */
function baseReduce(collection, iteratee, accumulator, initAccum, eachFunc) {
  eachFunc(collection, function(value, index, collection) {
    accumulator = initAccum
      ? (initAccum = false, value)
      : iteratee(accumulator, value, index, collection);
  });
  return accumulator;
}

/**
 * The base implementation of `_.times` without support for iteratee shorthands
 * or max array length checks.
 *
 * @private
 * @param {number} n The number of times to invoke `iteratee`.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the array of results.
 */
function baseTimes(n, iteratee) {
  var index = -1,
      result = Array(n);

  while (++index < n) {
    result[index] = iteratee(index);
  }
  return result;
}

/**
 * The base implementation of `_.unary` without support for storing metadata.
 *
 * @private
 * @param {Function} func The function to cap arguments for.
 * @returns {Function} Returns the new capped function.
 */
function baseUnary(func) {
  return function(value) {
    return func(value);
  };
}

/**
 * Gets the value at `key` of `object`.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {string} key The key of the property to get.
 * @returns {*} Returns the property value.
 */
function getValue(object, key) {
  return object == null ? undefined : object[key];
}

/**
 * Checks if `value` is a host object in IE < 9.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a host object, else `false`.
 */
function isHostObject(value) {
  // Many host objects are `Object` objects that can coerce to strings
  // despite having improperly defined `toString` methods.
  var result = false;
  if (value != null && typeof value.toString != 'function') {
    try {
      result = !!(value + '');
    } catch (e) {}
  }
  return result;
}

/**
 * Converts `map` to its key-value pairs.
 *
 * @private
 * @param {Object} map The map to convert.
 * @returns {Array} Returns the key-value pairs.
 */
function mapToArray(map) {
  var index = -1,
      result = Array(map.size);

  map.forEach(function(value, key) {
    result[++index] = [key, value];
  });
  return result;
}

/**
 * Creates a unary function that invokes `func` with its argument transformed.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {Function} transform The argument transform.
 * @returns {Function} Returns the new function.
 */
function overArg(func, transform) {
  return function(arg) {
    return func(transform(arg));
  };
}

/**
 * Converts `set` to an array of its values.
 *
 * @private
 * @param {Object} set The set to convert.
 * @returns {Array} Returns the values.
 */
function setToArray(set) {
  var index = -1,
      result = Array(set.size);

  set.forEach(function(value) {
    result[++index] = value;
  });
  return result;
}

/** Used for built-in method references. */
var arrayProto = Array.prototype,
    funcProto = Function.prototype,
    objectProto = Object.prototype;

/** Used to detect overreaching core-js shims. */
var coreJsData = root['__core-js_shared__'];

/** Used to detect methods masquerading as native. */
var maskSrcKey = (function() {
  var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
  return uid ? ('Symbol(src)_1.' + uid) : '';
}());

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/** Used to detect if a method is native. */
var reIsNative = RegExp('^' +
  funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\$&')
  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
);

/** Built-in value references. */
var Symbol = root.Symbol,
    Uint8Array = root.Uint8Array,
    propertyIsEnumerable = objectProto.propertyIsEnumerable,
    splice = arrayProto.splice;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeKeys = overArg(Object.keys, Object);

/* Built-in method references that are verified to be native. */
var DataView = getNative(root, 'DataView'),
    Map = getNative(root, 'Map'),
    Promise = getNative(root, 'Promise'),
    Set = getNative(root, 'Set'),
    WeakMap = getNative(root, 'WeakMap'),
    nativeCreate = getNative(Object, 'create');

/** Used to detect maps, sets, and weakmaps. */
var dataViewCtorString = toSource(DataView),
    mapCtorString = toSource(Map),
    promiseCtorString = toSource(Promise),
    setCtorString = toSource(Set),
    weakMapCtorString = toSource(WeakMap);

/** Used to convert symbols to primitives and strings. */
var symbolProto = Symbol ? Symbol.prototype : undefined,
    symbolValueOf = symbolProto ? symbolProto.valueOf : undefined,
    symbolToString = symbolProto ? symbolProto.toString : undefined;

/**
 * Creates a hash object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Hash(entries) {
  var index = -1,
      length = entries ? entries.length : 0;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the hash.
 *
 * @private
 * @name clear
 * @memberOf Hash
 */
function hashClear() {
  this.__data__ = nativeCreate ? nativeCreate(null) : {};
}

/**
 * Removes `key` and its value from the hash.
 *
 * @private
 * @name delete
 * @memberOf Hash
 * @param {Object} hash The hash to modify.
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function hashDelete(key) {
  return this.has(key) && delete this.__data__[key];
}

/**
 * Gets the hash value for `key`.
 *
 * @private
 * @name get
 * @memberOf Hash
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function hashGet(key) {
  var data = this.__data__;
  if (nativeCreate) {
    var result = data[key];
    return result === HASH_UNDEFINED ? undefined : result;
  }
  return hasOwnProperty.call(data, key) ? data[key] : undefined;
}

/**
 * Checks if a hash value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Hash
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function hashHas(key) {
  var data = this.__data__;
  return nativeCreate ? data[key] !== undefined : hasOwnProperty.call(data, key);
}

/**
 * Sets the hash `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Hash
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the hash instance.
 */
function hashSet(key, value) {
  var data = this.__data__;
  data[key] = (nativeCreate && value === undefined) ? HASH_UNDEFINED : value;
  return this;
}

// Add methods to `Hash`.
Hash.prototype.clear = hashClear;
Hash.prototype['delete'] = hashDelete;
Hash.prototype.get = hashGet;
Hash.prototype.has = hashHas;
Hash.prototype.set = hashSet;

/**
 * Creates an list cache object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function ListCache(entries) {
  var index = -1,
      length = entries ? entries.length : 0;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the list cache.
 *
 * @private
 * @name clear
 * @memberOf ListCache
 */
function listCacheClear() {
  this.__data__ = [];
}

/**
 * Removes `key` and its value from the list cache.
 *
 * @private
 * @name delete
 * @memberOf ListCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function listCacheDelete(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    return false;
  }
  var lastIndex = data.length - 1;
  if (index == lastIndex) {
    data.pop();
  } else {
    splice.call(data, index, 1);
  }
  return true;
}

/**
 * Gets the list cache value for `key`.
 *
 * @private
 * @name get
 * @memberOf ListCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function listCacheGet(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  return index < 0 ? undefined : data[index][1];
}

/**
 * Checks if a list cache value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf ListCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function listCacheHas(key) {
  return assocIndexOf(this.__data__, key) > -1;
}

/**
 * Sets the list cache `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf ListCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the list cache instance.
 */
function listCacheSet(key, value) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    data.push([key, value]);
  } else {
    data[index][1] = value;
  }
  return this;
}

// Add methods to `ListCache`.
ListCache.prototype.clear = listCacheClear;
ListCache.prototype['delete'] = listCacheDelete;
ListCache.prototype.get = listCacheGet;
ListCache.prototype.has = listCacheHas;
ListCache.prototype.set = listCacheSet;

/**
 * Creates a map cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function MapCache(entries) {
  var index = -1,
      length = entries ? entries.length : 0;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the map.
 *
 * @private
 * @name clear
 * @memberOf MapCache
 */
function mapCacheClear() {
  this.__data__ = {
    'hash': new Hash,
    'map': new (Map || ListCache),
    'string': new Hash
  };
}

/**
 * Removes `key` and its value from the map.
 *
 * @private
 * @name delete
 * @memberOf MapCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function mapCacheDelete(key) {
  return getMapData(this, key)['delete'](key);
}

/**
 * Gets the map value for `key`.
 *
 * @private
 * @name get
 * @memberOf MapCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function mapCacheGet(key) {
  return getMapData(this, key).get(key);
}

/**
 * Checks if a map value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf MapCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function mapCacheHas(key) {
  return getMapData(this, key).has(key);
}

/**
 * Sets the map `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf MapCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the map cache instance.
 */
function mapCacheSet(key, value) {
  getMapData(this, key).set(key, value);
  return this;
}

// Add methods to `MapCache`.
MapCache.prototype.clear = mapCacheClear;
MapCache.prototype['delete'] = mapCacheDelete;
MapCache.prototype.get = mapCacheGet;
MapCache.prototype.has = mapCacheHas;
MapCache.prototype.set = mapCacheSet;

/**
 *
 * Creates an array cache object to store unique values.
 *
 * @private
 * @constructor
 * @param {Array} [values] The values to cache.
 */
function SetCache(values) {
  var index = -1,
      length = values ? values.length : 0;

  this.__data__ = new MapCache;
  while (++index < length) {
    this.add(values[index]);
  }
}

/**
 * Adds `value` to the array cache.
 *
 * @private
 * @name add
 * @memberOf SetCache
 * @alias push
 * @param {*} value The value to cache.
 * @returns {Object} Returns the cache instance.
 */
function setCacheAdd(value) {
  this.__data__.set(value, HASH_UNDEFINED);
  return this;
}

/**
 * Checks if `value` is in the array cache.
 *
 * @private
 * @name has
 * @memberOf SetCache
 * @param {*} value The value to search for.
 * @returns {number} Returns `true` if `value` is found, else `false`.
 */
function setCacheHas(value) {
  return this.__data__.has(value);
}

// Add methods to `SetCache`.
SetCache.prototype.add = SetCache.prototype.push = setCacheAdd;
SetCache.prototype.has = setCacheHas;

/**
 * Creates a stack cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Stack(entries) {
  this.__data__ = new ListCache(entries);
}

/**
 * Removes all key-value entries from the stack.
 *
 * @private
 * @name clear
 * @memberOf Stack
 */
function stackClear() {
  this.__data__ = new ListCache;
}

/**
 * Removes `key` and its value from the stack.
 *
 * @private
 * @name delete
 * @memberOf Stack
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function stackDelete(key) {
  return this.__data__['delete'](key);
}

/**
 * Gets the stack value for `key`.
 *
 * @private
 * @name get
 * @memberOf Stack
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function stackGet(key) {
  return this.__data__.get(key);
}

/**
 * Checks if a stack value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Stack
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function stackHas(key) {
  return this.__data__.has(key);
}

/**
 * Sets the stack `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Stack
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the stack cache instance.
 */
function stackSet(key, value) {
  var cache = this.__data__;
  if (cache instanceof ListCache) {
    var pairs = cache.__data__;
    if (!Map || (pairs.length < LARGE_ARRAY_SIZE - 1)) {
      pairs.push([key, value]);
      return this;
    }
    cache = this.__data__ = new MapCache(pairs);
  }
  cache.set(key, value);
  return this;
}

// Add methods to `Stack`.
Stack.prototype.clear = stackClear;
Stack.prototype['delete'] = stackDelete;
Stack.prototype.get = stackGet;
Stack.prototype.has = stackHas;
Stack.prototype.set = stackSet;

/**
 * Creates an array of the enumerable property names of the array-like `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @param {boolean} inherited Specify returning inherited property names.
 * @returns {Array} Returns the array of property names.
 */
function arrayLikeKeys(value, inherited) {
  // Safari 8.1 makes `arguments.callee` enumerable in strict mode.
  // Safari 9 makes `arguments.length` enumerable in strict mode.
  var result = (isArray(value) || isArguments(value))
    ? baseTimes(value.length, String)
    : [];

  var length = result.length,
      skipIndexes = !!length;

  for (var key in value) {
    if ((inherited || hasOwnProperty.call(value, key)) &&
        !(skipIndexes && (key == 'length' || isIndex(key, length)))) {
      result.push(key);
    }
  }
  return result;
}

/**
 * Gets the index at which the `key` is found in `array` of key-value pairs.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} key The key to search for.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function assocIndexOf(array, key) {
  var length = array.length;
  while (length--) {
    if (eq(array[length][0], key)) {
      return length;
    }
  }
  return -1;
}

/**
 * The base implementation of `_.forEach` without support for iteratee shorthands.
 *
 * @private
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array|Object} Returns `collection`.
 */
var baseEach = createBaseEach(baseForOwn);

/**
 * The base implementation of `baseForOwn` which iterates over `object`
 * properties returned by `keysFunc` and invokes `iteratee` for each property.
 * Iteratee functions may exit iteration early by explicitly returning `false`.
 *
 * @private
 * @param {Object} object The object to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @param {Function} keysFunc The function to get the keys of `object`.
 * @returns {Object} Returns `object`.
 */
var baseFor = createBaseFor();

/**
 * The base implementation of `_.forOwn` without support for iteratee shorthands.
 *
 * @private
 * @param {Object} object The object to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Object} Returns `object`.
 */
function baseForOwn(object, iteratee) {
  return object && baseFor(object, iteratee, keys);
}

/**
 * The base implementation of `_.get` without support for default values.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array|string} path The path of the property to get.
 * @returns {*} Returns the resolved value.
 */
function baseGet(object, path) {
  path = isKey(path, object) ? [path] : castPath(path);

  var index = 0,
      length = path.length;

  while (object != null && index < length) {
    object = object[toKey(path[index++])];
  }
  return (index && index == length) ? object : undefined;
}

/**
 * The base implementation of `getTag`.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
function baseGetTag(value) {
  return objectToString.call(value);
}

/**
 * The base implementation of `_.hasIn` without support for deep paths.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {Array|string} key The key to check.
 * @returns {boolean} Returns `true` if `key` exists, else `false`.
 */
function baseHasIn(object, key) {
  return object != null && key in Object(object);
}

/**
 * The base implementation of `_.isEqual` which supports partial comparisons
 * and tracks traversed objects.
 *
 * @private
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @param {Function} [customizer] The function to customize comparisons.
 * @param {boolean} [bitmask] The bitmask of comparison flags.
 *  The bitmask may be composed of the following flags:
 *     1 - Unordered comparison
 *     2 - Partial comparison
 * @param {Object} [stack] Tracks traversed `value` and `other` objects.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 */
function baseIsEqual(value, other, customizer, bitmask, stack) {
  if (value === other) {
    return true;
  }
  if (value == null || other == null || (!isObject(value) && !isObjectLike(other))) {
    return value !== value && other !== other;
  }
  return baseIsEqualDeep(value, other, baseIsEqual, customizer, bitmask, stack);
}

/**
 * A specialized version of `baseIsEqual` for arrays and objects which performs
 * deep comparisons and tracks traversed objects enabling objects with circular
 * references to be compared.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Function} [customizer] The function to customize comparisons.
 * @param {number} [bitmask] The bitmask of comparison flags. See `baseIsEqual`
 *  for more details.
 * @param {Object} [stack] Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function baseIsEqualDeep(object, other, equalFunc, customizer, bitmask, stack) {
  var objIsArr = isArray(object),
      othIsArr = isArray(other),
      objTag = arrayTag,
      othTag = arrayTag;

  if (!objIsArr) {
    objTag = getTag(object);
    objTag = objTag == argsTag ? objectTag : objTag;
  }
  if (!othIsArr) {
    othTag = getTag(other);
    othTag = othTag == argsTag ? objectTag : othTag;
  }
  var objIsObj = objTag == objectTag && !isHostObject(object),
      othIsObj = othTag == objectTag && !isHostObject(other),
      isSameTag = objTag == othTag;

  if (isSameTag && !objIsObj) {
    stack || (stack = new Stack);
    return (objIsArr || isTypedArray(object))
      ? equalArrays(object, other, equalFunc, customizer, bitmask, stack)
      : equalByTag(object, other, objTag, equalFunc, customizer, bitmask, stack);
  }
  if (!(bitmask & PARTIAL_COMPARE_FLAG)) {
    var objIsWrapped = objIsObj && hasOwnProperty.call(object, '__wrapped__'),
        othIsWrapped = othIsObj && hasOwnProperty.call(other, '__wrapped__');

    if (objIsWrapped || othIsWrapped) {
      var objUnwrapped = objIsWrapped ? object.value() : object,
          othUnwrapped = othIsWrapped ? other.value() : other;

      stack || (stack = new Stack);
      return equalFunc(objUnwrapped, othUnwrapped, customizer, bitmask, stack);
    }
  }
  if (!isSameTag) {
    return false;
  }
  stack || (stack = new Stack);
  return equalObjects(object, other, equalFunc, customizer, bitmask, stack);
}

/**
 * The base implementation of `_.isMatch` without support for iteratee shorthands.
 *
 * @private
 * @param {Object} object The object to inspect.
 * @param {Object} source The object of property values to match.
 * @param {Array} matchData The property names, values, and compare flags to match.
 * @param {Function} [customizer] The function to customize comparisons.
 * @returns {boolean} Returns `true` if `object` is a match, else `false`.
 */
function baseIsMatch(object, source, matchData, customizer) {
  var index = matchData.length,
      length = index,
      noCustomizer = !customizer;

  if (object == null) {
    return !length;
  }
  object = Object(object);
  while (index--) {
    var data = matchData[index];
    if ((noCustomizer && data[2])
          ? data[1] !== object[data[0]]
          : !(data[0] in object)
        ) {
      return false;
    }
  }
  while (++index < length) {
    data = matchData[index];
    var key = data[0],
        objValue = object[key],
        srcValue = data[1];

    if (noCustomizer && data[2]) {
      if (objValue === undefined && !(key in object)) {
        return false;
      }
    } else {
      var stack = new Stack;
      if (customizer) {
        var result = customizer(objValue, srcValue, key, object, source, stack);
      }
      if (!(result === undefined
            ? baseIsEqual(srcValue, objValue, customizer, UNORDERED_COMPARE_FLAG | PARTIAL_COMPARE_FLAG, stack)
            : result
          )) {
        return false;
      }
    }
  }
  return true;
}

/**
 * The base implementation of `_.isNative` without bad shim checks.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function,
 *  else `false`.
 */
function baseIsNative(value) {
  if (!isObject(value) || isMasked(value)) {
    return false;
  }
  var pattern = (isFunction(value) || isHostObject(value)) ? reIsNative : reIsHostCtor;
  return pattern.test(toSource(value));
}

/**
 * The base implementation of `_.isTypedArray` without Node.js optimizations.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 */
function baseIsTypedArray(value) {
  return isObjectLike(value) &&
    isLength(value.length) && !!typedArrayTags[objectToString.call(value)];
}

/**
 * The base implementation of `_.iteratee`.
 *
 * @private
 * @param {*} [value=_.identity] The value to convert to an iteratee.
 * @returns {Function} Returns the iteratee.
 */
function baseIteratee(value) {
  // Don't store the `typeof` result in a variable to avoid a JIT bug in Safari 9.
  // See https://bugs.webkit.org/show_bug.cgi?id=156034 for more details.
  if (typeof value == 'function') {
    return value;
  }
  if (value == null) {
    return identity;
  }
  if (typeof value == 'object') {
    return isArray(value)
      ? baseMatchesProperty(value[0], value[1])
      : baseMatches(value);
  }
  return property(value);
}

/**
 * The base implementation of `_.keys` which doesn't treat sparse arrays as dense.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function baseKeys(object) {
  if (!isPrototype(object)) {
    return nativeKeys(object);
  }
  var result = [];
  for (var key in Object(object)) {
    if (hasOwnProperty.call(object, key) && key != 'constructor') {
      result.push(key);
    }
  }
  return result;
}

/**
 * The base implementation of `_.matches` which doesn't clone `source`.
 *
 * @private
 * @param {Object} source The object of property values to match.
 * @returns {Function} Returns the new spec function.
 */
function baseMatches(source) {
  var matchData = getMatchData(source);
  if (matchData.length == 1 && matchData[0][2]) {
    return matchesStrictComparable(matchData[0][0], matchData[0][1]);
  }
  return function(object) {
    return object === source || baseIsMatch(object, source, matchData);
  };
}

/**
 * The base implementation of `_.matchesProperty` which doesn't clone `srcValue`.
 *
 * @private
 * @param {string} path The path of the property to get.
 * @param {*} srcValue The value to match.
 * @returns {Function} Returns the new spec function.
 */
function baseMatchesProperty(path, srcValue) {
  if (isKey(path) && isStrictComparable(srcValue)) {
    return matchesStrictComparable(toKey(path), srcValue);
  }
  return function(object) {
    var objValue = get(object, path);
    return (objValue === undefined && objValue === srcValue)
      ? hasIn(object, path)
      : baseIsEqual(srcValue, objValue, undefined, UNORDERED_COMPARE_FLAG | PARTIAL_COMPARE_FLAG);
  };
}

/**
 * A specialized version of `baseProperty` which supports deep paths.
 *
 * @private
 * @param {Array|string} path The path of the property to get.
 * @returns {Function} Returns the new accessor function.
 */
function basePropertyDeep(path) {
  return function(object) {
    return baseGet(object, path);
  };
}

/**
 * The base implementation of `_.toString` which doesn't convert nullish
 * values to empty strings.
 *
 * @private
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 */
function baseToString(value) {
  // Exit early for strings to avoid a performance hit in some environments.
  if (typeof value == 'string') {
    return value;
  }
  if (isSymbol(value)) {
    return symbolToString ? symbolToString.call(value) : '';
  }
  var result = (value + '');
  return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
}

/**
 * Casts `value` to a path array if it's not one.
 *
 * @private
 * @param {*} value The value to inspect.
 * @returns {Array} Returns the cast property path array.
 */
function castPath(value) {
  return isArray(value) ? value : stringToPath(value);
}

/**
 * Creates a `baseEach` or `baseEachRight` function.
 *
 * @private
 * @param {Function} eachFunc The function to iterate over a collection.
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {Function} Returns the new base function.
 */
function createBaseEach(eachFunc, fromRight) {
  return function(collection, iteratee) {
    if (collection == null) {
      return collection;
    }
    if (!isArrayLike(collection)) {
      return eachFunc(collection, iteratee);
    }
    var length = collection.length,
        index = fromRight ? length : -1,
        iterable = Object(collection);

    while ((fromRight ? index-- : ++index < length)) {
      if (iteratee(iterable[index], index, iterable) === false) {
        break;
      }
    }
    return collection;
  };
}

/**
 * Creates a base function for methods like `_.forIn` and `_.forOwn`.
 *
 * @private
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {Function} Returns the new base function.
 */
function createBaseFor(fromRight) {
  return function(object, iteratee, keysFunc) {
    var index = -1,
        iterable = Object(object),
        props = keysFunc(object),
        length = props.length;

    while (length--) {
      var key = props[fromRight ? length : ++index];
      if (iteratee(iterable[key], key, iterable) === false) {
        break;
      }
    }
    return object;
  };
}

/**
 * A specialized version of `baseIsEqualDeep` for arrays with support for
 * partial deep comparisons.
 *
 * @private
 * @param {Array} array The array to compare.
 * @param {Array} other The other array to compare.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Function} customizer The function to customize comparisons.
 * @param {number} bitmask The bitmask of comparison flags. See `baseIsEqual`
 *  for more details.
 * @param {Object} stack Tracks traversed `array` and `other` objects.
 * @returns {boolean} Returns `true` if the arrays are equivalent, else `false`.
 */
function equalArrays(array, other, equalFunc, customizer, bitmask, stack) {
  var isPartial = bitmask & PARTIAL_COMPARE_FLAG,
      arrLength = array.length,
      othLength = other.length;

  if (arrLength != othLength && !(isPartial && othLength > arrLength)) {
    return false;
  }
  // Assume cyclic values are equal.
  var stacked = stack.get(array);
  if (stacked && stack.get(other)) {
    return stacked == other;
  }
  var index = -1,
      result = true,
      seen = (bitmask & UNORDERED_COMPARE_FLAG) ? new SetCache : undefined;

  stack.set(array, other);
  stack.set(other, array);

  // Ignore non-index properties.
  while (++index < arrLength) {
    var arrValue = array[index],
        othValue = other[index];

    if (customizer) {
      var compared = isPartial
        ? customizer(othValue, arrValue, index, other, array, stack)
        : customizer(arrValue, othValue, index, array, other, stack);
    }
    if (compared !== undefined) {
      if (compared) {
        continue;
      }
      result = false;
      break;
    }
    // Recursively compare arrays (susceptible to call stack limits).
    if (seen) {
      if (!arraySome(other, function(othValue, othIndex) {
            if (!seen.has(othIndex) &&
                (arrValue === othValue || equalFunc(arrValue, othValue, customizer, bitmask, stack))) {
              return seen.add(othIndex);
            }
          })) {
        result = false;
        break;
      }
    } else if (!(
          arrValue === othValue ||
            equalFunc(arrValue, othValue, customizer, bitmask, stack)
        )) {
      result = false;
      break;
    }
  }
  stack['delete'](array);
  stack['delete'](other);
  return result;
}

/**
 * A specialized version of `baseIsEqualDeep` for comparing objects of
 * the same `toStringTag`.
 *
 * **Note:** This function only supports comparing values with tags of
 * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {string} tag The `toStringTag` of the objects to compare.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Function} customizer The function to customize comparisons.
 * @param {number} bitmask The bitmask of comparison flags. See `baseIsEqual`
 *  for more details.
 * @param {Object} stack Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function equalByTag(object, other, tag, equalFunc, customizer, bitmask, stack) {
  switch (tag) {
    case dataViewTag:
      if ((object.byteLength != other.byteLength) ||
          (object.byteOffset != other.byteOffset)) {
        return false;
      }
      object = object.buffer;
      other = other.buffer;

    case arrayBufferTag:
      if ((object.byteLength != other.byteLength) ||
          !equalFunc(new Uint8Array(object), new Uint8Array(other))) {
        return false;
      }
      return true;

    case boolTag:
    case dateTag:
    case numberTag:
      // Coerce booleans to `1` or `0` and dates to milliseconds.
      // Invalid dates are coerced to `NaN`.
      return eq(+object, +other);

    case errorTag:
      return object.name == other.name && object.message == other.message;

    case regexpTag:
    case stringTag:
      // Coerce regexes to strings and treat strings, primitives and objects,
      // as equal. See http://www.ecma-international.org/ecma-262/7.0/#sec-regexp.prototype.tostring
      // for more details.
      return object == (other + '');

    case mapTag:
      var convert = mapToArray;

    case setTag:
      var isPartial = bitmask & PARTIAL_COMPARE_FLAG;
      convert || (convert = setToArray);

      if (object.size != other.size && !isPartial) {
        return false;
      }
      // Assume cyclic values are equal.
      var stacked = stack.get(object);
      if (stacked) {
        return stacked == other;
      }
      bitmask |= UNORDERED_COMPARE_FLAG;

      // Recursively compare objects (susceptible to call stack limits).
      stack.set(object, other);
      var result = equalArrays(convert(object), convert(other), equalFunc, customizer, bitmask, stack);
      stack['delete'](object);
      return result;

    case symbolTag:
      if (symbolValueOf) {
        return symbolValueOf.call(object) == symbolValueOf.call(other);
      }
  }
  return false;
}

/**
 * A specialized version of `baseIsEqualDeep` for objects with support for
 * partial deep comparisons.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Function} customizer The function to customize comparisons.
 * @param {number} bitmask The bitmask of comparison flags. See `baseIsEqual`
 *  for more details.
 * @param {Object} stack Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function equalObjects(object, other, equalFunc, customizer, bitmask, stack) {
  var isPartial = bitmask & PARTIAL_COMPARE_FLAG,
      objProps = keys(object),
      objLength = objProps.length,
      othProps = keys(other),
      othLength = othProps.length;

  if (objLength != othLength && !isPartial) {
    return false;
  }
  var index = objLength;
  while (index--) {
    var key = objProps[index];
    if (!(isPartial ? key in other : hasOwnProperty.call(other, key))) {
      return false;
    }
  }
  // Assume cyclic values are equal.
  var stacked = stack.get(object);
  if (stacked && stack.get(other)) {
    return stacked == other;
  }
  var result = true;
  stack.set(object, other);
  stack.set(other, object);

  var skipCtor = isPartial;
  while (++index < objLength) {
    key = objProps[index];
    var objValue = object[key],
        othValue = other[key];

    if (customizer) {
      var compared = isPartial
        ? customizer(othValue, objValue, key, other, object, stack)
        : customizer(objValue, othValue, key, object, other, stack);
    }
    // Recursively compare objects (susceptible to call stack limits).
    if (!(compared === undefined
          ? (objValue === othValue || equalFunc(objValue, othValue, customizer, bitmask, stack))
          : compared
        )) {
      result = false;
      break;
    }
    skipCtor || (skipCtor = key == 'constructor');
  }
  if (result && !skipCtor) {
    var objCtor = object.constructor,
        othCtor = other.constructor;

    // Non `Object` object instances with different constructors are not equal.
    if (objCtor != othCtor &&
        ('constructor' in object && 'constructor' in other) &&
        !(typeof objCtor == 'function' && objCtor instanceof objCtor &&
          typeof othCtor == 'function' && othCtor instanceof othCtor)) {
      result = false;
    }
  }
  stack['delete'](object);
  stack['delete'](other);
  return result;
}

/**
 * Gets the data for `map`.
 *
 * @private
 * @param {Object} map The map to query.
 * @param {string} key The reference key.
 * @returns {*} Returns the map data.
 */
function getMapData(map, key) {
  var data = map.__data__;
  return isKeyable(key)
    ? data[typeof key == 'string' ? 'string' : 'hash']
    : data.map;
}

/**
 * Gets the property names, values, and compare flags of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the match data of `object`.
 */
function getMatchData(object) {
  var result = keys(object),
      length = result.length;

  while (length--) {
    var key = result[length],
        value = object[key];

    result[length] = [key, value, isStrictComparable(value)];
  }
  return result;
}

/**
 * Gets the native function at `key` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the method to get.
 * @returns {*} Returns the function if it's native, else `undefined`.
 */
function getNative(object, key) {
  var value = getValue(object, key);
  return baseIsNative(value) ? value : undefined;
}

/**
 * Gets the `toStringTag` of `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
var getTag = baseGetTag;

// Fallback for data views, maps, sets, and weak maps in IE 11,
// for data views in Edge < 14, and promises in Node.js.
if ((DataView && getTag(new DataView(new ArrayBuffer(1))) != dataViewTag) ||
    (Map && getTag(new Map) != mapTag) ||
    (Promise && getTag(Promise.resolve()) != promiseTag) ||
    (Set && getTag(new Set) != setTag) ||
    (WeakMap && getTag(new WeakMap) != weakMapTag)) {
  getTag = function(value) {
    var result = objectToString.call(value),
        Ctor = result == objectTag ? value.constructor : undefined,
        ctorString = Ctor ? toSource(Ctor) : undefined;

    if (ctorString) {
      switch (ctorString) {
        case dataViewCtorString: return dataViewTag;
        case mapCtorString: return mapTag;
        case promiseCtorString: return promiseTag;
        case setCtorString: return setTag;
        case weakMapCtorString: return weakMapTag;
      }
    }
    return result;
  };
}

/**
 * Checks if `path` exists on `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array|string} path The path to check.
 * @param {Function} hasFunc The function to check properties.
 * @returns {boolean} Returns `true` if `path` exists, else `false`.
 */
function hasPath(object, path, hasFunc) {
  path = isKey(path, object) ? [path] : castPath(path);

  var result,
      index = -1,
      length = path.length;

  while (++index < length) {
    var key = toKey(path[index]);
    if (!(result = object != null && hasFunc(object, key))) {
      break;
    }
    object = object[key];
  }
  if (result) {
    return result;
  }
  var length = object ? object.length : 0;
  return !!length && isLength(length) && isIndex(key, length) &&
    (isArray(object) || isArguments(object));
}

/**
 * Checks if `value` is a valid array-like index.
 *
 * @private
 * @param {*} value The value to check.
 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
 */
function isIndex(value, length) {
  length = length == null ? MAX_SAFE_INTEGER : length;
  return !!length &&
    (typeof value == 'number' || reIsUint.test(value)) &&
    (value > -1 && value % 1 == 0 && value < length);
}

/**
 * Checks if `value` is a property name and not a property path.
 *
 * @private
 * @param {*} value The value to check.
 * @param {Object} [object] The object to query keys on.
 * @returns {boolean} Returns `true` if `value` is a property name, else `false`.
 */
function isKey(value, object) {
  if (isArray(value)) {
    return false;
  }
  var type = typeof value;
  if (type == 'number' || type == 'symbol' || type == 'boolean' ||
      value == null || isSymbol(value)) {
    return true;
  }
  return reIsPlainProp.test(value) || !reIsDeepProp.test(value) ||
    (object != null && value in Object(object));
}

/**
 * Checks if `value` is suitable for use as unique object key.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
 */
function isKeyable(value) {
  var type = typeof value;
  return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
    ? (value !== '__proto__')
    : (value === null);
}

/**
 * Checks if `func` has its source masked.
 *
 * @private
 * @param {Function} func The function to check.
 * @returns {boolean} Returns `true` if `func` is masked, else `false`.
 */
function isMasked(func) {
  return !!maskSrcKey && (maskSrcKey in func);
}

/**
 * Checks if `value` is likely a prototype object.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
 */
function isPrototype(value) {
  var Ctor = value && value.constructor,
      proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto;

  return value === proto;
}

/**
 * Checks if `value` is suitable for strict equality comparisons, i.e. `===`.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` if suitable for strict
 *  equality comparisons, else `false`.
 */
function isStrictComparable(value) {
  return value === value && !isObject(value);
}

/**
 * A specialized version of `matchesProperty` for source values suitable
 * for strict equality comparisons, i.e. `===`.
 *
 * @private
 * @param {string} key The key of the property to get.
 * @param {*} srcValue The value to match.
 * @returns {Function} Returns the new spec function.
 */
function matchesStrictComparable(key, srcValue) {
  return function(object) {
    if (object == null) {
      return false;
    }
    return object[key] === srcValue &&
      (srcValue !== undefined || (key in Object(object)));
  };
}

/**
 * Converts `string` to a property path array.
 *
 * @private
 * @param {string} string The string to convert.
 * @returns {Array} Returns the property path array.
 */
var stringToPath = memoize(function(string) {
  string = toString(string);

  var result = [];
  if (reLeadingDot.test(string)) {
    result.push('');
  }
  string.replace(rePropName, function(match, number, quote, string) {
    result.push(quote ? string.replace(reEscapeChar, '$1') : (number || match));
  });
  return result;
});

/**
 * Converts `value` to a string key if it's not a string or symbol.
 *
 * @private
 * @param {*} value The value to inspect.
 * @returns {string|symbol} Returns the key.
 */
function toKey(value) {
  if (typeof value == 'string' || isSymbol(value)) {
    return value;
  }
  var result = (value + '');
  return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
}

/**
 * Converts `func` to its source code.
 *
 * @private
 * @param {Function} func The function to process.
 * @returns {string} Returns the source code.
 */
function toSource(func) {
  if (func != null) {
    try {
      return funcToString.call(func);
    } catch (e) {}
    try {
      return (func + '');
    } catch (e) {}
  }
  return '';
}

/**
 * Reduces `collection` to a value which is the accumulated result of running
 * each element in `collection` thru `iteratee`, where each successive
 * invocation is supplied the return value of the previous. If `accumulator`
 * is not given, the first element of `collection` is used as the initial
 * value. The iteratee is invoked with four arguments:
 * (accumulator, value, index|key, collection).
 *
 * Many lodash methods are guarded to work as iteratees for methods like
 * `_.reduce`, `_.reduceRight`, and `_.transform`.
 *
 * The guarded methods are:
 * `assign`, `defaults`, `defaultsDeep`, `includes`, `merge`, `orderBy`,
 * and `sortBy`
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Collection
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} [iteratee=_.identity] The function invoked per iteration.
 * @param {*} [accumulator] The initial value.
 * @returns {*} Returns the accumulated value.
 * @see _.reduceRight
 * @example
 *
 * _.reduce([1, 2], function(sum, n) {
 *   return sum + n;
 * }, 0);
 * // => 3
 *
 * _.reduce({ 'a': 1, 'b': 2, 'c': 1 }, function(result, value, key) {
 *   (result[value] || (result[value] = [])).push(key);
 *   return result;
 * }, {});
 * // => { '1': ['a', 'c'], '2': ['b'] } (iteration order is not guaranteed)
 */
function reduce(collection, iteratee, accumulator) {
  var func = isArray(collection) ? arrayReduce : baseReduce,
      initAccum = arguments.length < 3;

  return func(collection, baseIteratee(iteratee, 4), accumulator, initAccum, baseEach);
}

/**
 * Creates a function that memoizes the result of `func`. If `resolver` is
 * provided, it determines the cache key for storing the result based on the
 * arguments provided to the memoized function. By default, the first argument
 * provided to the memoized function is used as the map cache key. The `func`
 * is invoked with the `this` binding of the memoized function.
 *
 * **Note:** The cache is exposed as the `cache` property on the memoized
 * function. Its creation may be customized by replacing the `_.memoize.Cache`
 * constructor with one whose instances implement the
 * [`Map`](http://ecma-international.org/ecma-262/7.0/#sec-properties-of-the-map-prototype-object)
 * method interface of `delete`, `get`, `has`, and `set`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to have its output memoized.
 * @param {Function} [resolver] The function to resolve the cache key.
 * @returns {Function} Returns the new memoized function.
 * @example
 *
 * var object = { 'a': 1, 'b': 2 };
 * var other = { 'c': 3, 'd': 4 };
 *
 * var values = _.memoize(_.values);
 * values(object);
 * // => [1, 2]
 *
 * values(other);
 * // => [3, 4]
 *
 * object.a = 2;
 * values(object);
 * // => [1, 2]
 *
 * // Modify the result cache.
 * values.cache.set(object, ['a', 'b']);
 * values(object);
 * // => ['a', 'b']
 *
 * // Replace `_.memoize.Cache`.
 * _.memoize.Cache = WeakMap;
 */
function memoize(func, resolver) {
  if (typeof func != 'function' || (resolver && typeof resolver != 'function')) {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  var memoized = function() {
    var args = arguments,
        key = resolver ? resolver.apply(this, args) : args[0],
        cache = memoized.cache;

    if (cache.has(key)) {
      return cache.get(key);
    }
    var result = func.apply(this, args);
    memoized.cache = cache.set(key, result);
    return result;
  };
  memoized.cache = new (memoize.Cache || MapCache);
  return memoized;
}

// Assign cache to `_.memoize`.
memoize.Cache = MapCache;

/**
 * Performs a
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * comparison between two values to determine if they are equivalent.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * _.eq(object, object);
 * // => true
 *
 * _.eq(object, other);
 * // => false
 *
 * _.eq('a', 'a');
 * // => true
 *
 * _.eq('a', Object('a'));
 * // => false
 *
 * _.eq(NaN, NaN);
 * // => true
 */
function eq(value, other) {
  return value === other || (value !== value && other !== other);
}

/**
 * Checks if `value` is likely an `arguments` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 *  else `false`.
 * @example
 *
 * _.isArguments(function() { return arguments; }());
 * // => true
 *
 * _.isArguments([1, 2, 3]);
 * // => false
 */
function isArguments(value) {
  // Safari 8.1 makes `arguments.callee` enumerable in strict mode.
  return isArrayLikeObject(value) && hasOwnProperty.call(value, 'callee') &&
    (!propertyIsEnumerable.call(value, 'callee') || objectToString.call(value) == argsTag);
}

/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */
var isArray = Array.isArray;

/**
 * Checks if `value` is array-like. A value is considered array-like if it's
 * not a function and has a `value.length` that's an integer greater than or
 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
 * @example
 *
 * _.isArrayLike([1, 2, 3]);
 * // => true
 *
 * _.isArrayLike(document.body.children);
 * // => true
 *
 * _.isArrayLike('abc');
 * // => true
 *
 * _.isArrayLike(_.noop);
 * // => false
 */
function isArrayLike(value) {
  return value != null && isLength(value.length) && !isFunction(value);
}

/**
 * This method is like `_.isArrayLike` except that it also checks if `value`
 * is an object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array-like object,
 *  else `false`.
 * @example
 *
 * _.isArrayLikeObject([1, 2, 3]);
 * // => true
 *
 * _.isArrayLikeObject(document.body.children);
 * // => true
 *
 * _.isArrayLikeObject('abc');
 * // => false
 *
 * _.isArrayLikeObject(_.noop);
 * // => false
 */
function isArrayLikeObject(value) {
  return isObjectLike(value) && isArrayLike(value);
}

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 8-9 which returns 'object' for typed array and other constructors.
  var tag = isObject(value) ? objectToString.call(value) : '';
  return tag == funcTag || tag == genTag;
}

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This method is loosely based on
 * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 * @example
 *
 * _.isLength(3);
 * // => true
 *
 * _.isLength(Number.MIN_VALUE);
 * // => false
 *
 * _.isLength(Infinity);
 * // => false
 *
 * _.isLength('3');
 * // => false
 */
function isLength(value) {
  return typeof value == 'number' &&
    value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return !!value && typeof value == 'object';
}

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol(value) {
  return typeof value == 'symbol' ||
    (isObjectLike(value) && objectToString.call(value) == symbolTag);
}

/**
 * Checks if `value` is classified as a typed array.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 * @example
 *
 * _.isTypedArray(new Uint8Array);
 * // => true
 *
 * _.isTypedArray([]);
 * // => false
 */
var isTypedArray = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray;

/**
 * Converts `value` to a string. An empty string is returned for `null`
 * and `undefined` values. The sign of `-0` is preserved.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 * @example
 *
 * _.toString(null);
 * // => ''
 *
 * _.toString(-0);
 * // => '-0'
 *
 * _.toString([1, 2, 3]);
 * // => '1,2,3'
 */
function toString(value) {
  return value == null ? '' : baseToString(value);
}

/**
 * Gets the value at `path` of `object`. If the resolved value is
 * `undefined`, the `defaultValue` is returned in its place.
 *
 * @static
 * @memberOf _
 * @since 3.7.0
 * @category Object
 * @param {Object} object The object to query.
 * @param {Array|string} path The path of the property to get.
 * @param {*} [defaultValue] The value returned for `undefined` resolved values.
 * @returns {*} Returns the resolved value.
 * @example
 *
 * var object = { 'a': [{ 'b': { 'c': 3 } }] };
 *
 * _.get(object, 'a[0].b.c');
 * // => 3
 *
 * _.get(object, ['a', '0', 'b', 'c']);
 * // => 3
 *
 * _.get(object, 'a.b.c', 'default');
 * // => 'default'
 */
function get(object, path, defaultValue) {
  var result = object == null ? undefined : baseGet(object, path);
  return result === undefined ? defaultValue : result;
}

/**
 * Checks if `path` is a direct or inherited property of `object`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Object
 * @param {Object} object The object to query.
 * @param {Array|string} path The path to check.
 * @returns {boolean} Returns `true` if `path` exists, else `false`.
 * @example
 *
 * var object = _.create({ 'a': _.create({ 'b': 2 }) });
 *
 * _.hasIn(object, 'a');
 * // => true
 *
 * _.hasIn(object, 'a.b');
 * // => true
 *
 * _.hasIn(object, ['a', 'b']);
 * // => true
 *
 * _.hasIn(object, 'b');
 * // => false
 */
function hasIn(object, path) {
  return object != null && hasPath(object, path, baseHasIn);
}

/**
 * Creates an array of the own enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects. See the
 * [ES spec](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
 * for more details.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keys(new Foo);
 * // => ['a', 'b'] (iteration order is not guaranteed)
 *
 * _.keys('hi');
 * // => ['0', '1']
 */
function keys(object) {
  return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
}

/**
 * This method returns the first argument it receives.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Util
 * @param {*} value Any value.
 * @returns {*} Returns `value`.
 * @example
 *
 * var object = { 'a': 1 };
 *
 * console.log(_.identity(object) === object);
 * // => true
 */
function identity(value) {
  return value;
}

/**
 * Creates a function that returns the value at `path` of a given object.
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Util
 * @param {Array|string} path The path of the property to get.
 * @returns {Function} Returns the new accessor function.
 * @example
 *
 * var objects = [
 *   { 'a': { 'b': 2 } },
 *   { 'a': { 'b': 1 } }
 * ];
 *
 * _.map(objects, _.property('a.b'));
 * // => [2, 1]
 *
 * _.map(_.sortBy(objects, _.property(['a', 'b'])), 'a.b');
 * // => [1, 2]
 */
function property(path) {
  return isKey(path) ? baseProperty(toKey(path)) : basePropertyDeep(path);
}

module.exports = reduce;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],7:[function(require,module,exports){
/**
 * lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */

/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER = 9007199254740991;

/** `Object#toString` result references. */
var argsTag = '[object Arguments]',
    funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]';

/** Used to detect unsigned integer values. */
var reIsUint = /^(?:0|[1-9]\d*)$/;

/**
 * A specialized version of `_.map` for arrays without support for iteratee
 * shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the new mapped array.
 */
function arrayMap(array, iteratee) {
  var index = -1,
      length = array ? array.length : 0,
      result = Array(length);

  while (++index < length) {
    result[index] = iteratee(array[index], index, array);
  }
  return result;
}

/**
 * The base implementation of `_.times` without support for iteratee shorthands
 * or max array length checks.
 *
 * @private
 * @param {number} n The number of times to invoke `iteratee`.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the array of results.
 */
function baseTimes(n, iteratee) {
  var index = -1,
      result = Array(n);

  while (++index < n) {
    result[index] = iteratee(index);
  }
  return result;
}

/**
 * The base implementation of `_.values` and `_.valuesIn` which creates an
 * array of `object` property values corresponding to the property names
 * of `props`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array} props The property names to get values for.
 * @returns {Object} Returns the array of property values.
 */
function baseValues(object, props) {
  return arrayMap(props, function(key) {
    return object[key];
  });
}

/**
 * Creates a unary function that invokes `func` with its argument transformed.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {Function} transform The argument transform.
 * @returns {Function} Returns the new function.
 */
function overArg(func, transform) {
  return function(arg) {
    return func(transform(arg));
  };
}

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/** Built-in value references. */
var propertyIsEnumerable = objectProto.propertyIsEnumerable;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeKeys = overArg(Object.keys, Object);

/**
 * Creates an array of the enumerable property names of the array-like `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @param {boolean} inherited Specify returning inherited property names.
 * @returns {Array} Returns the array of property names.
 */
function arrayLikeKeys(value, inherited) {
  // Safari 8.1 makes `arguments.callee` enumerable in strict mode.
  // Safari 9 makes `arguments.length` enumerable in strict mode.
  var result = (isArray(value) || isArguments(value))
    ? baseTimes(value.length, String)
    : [];

  var length = result.length,
      skipIndexes = !!length;

  for (var key in value) {
    if ((inherited || hasOwnProperty.call(value, key)) &&
        !(skipIndexes && (key == 'length' || isIndex(key, length)))) {
      result.push(key);
    }
  }
  return result;
}

/**
 * The base implementation of `_.keys` which doesn't treat sparse arrays as dense.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function baseKeys(object) {
  if (!isPrototype(object)) {
    return nativeKeys(object);
  }
  var result = [];
  for (var key in Object(object)) {
    if (hasOwnProperty.call(object, key) && key != 'constructor') {
      result.push(key);
    }
  }
  return result;
}

/**
 * Checks if `value` is a valid array-like index.
 *
 * @private
 * @param {*} value The value to check.
 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
 */
function isIndex(value, length) {
  length = length == null ? MAX_SAFE_INTEGER : length;
  return !!length &&
    (typeof value == 'number' || reIsUint.test(value)) &&
    (value > -1 && value % 1 == 0 && value < length);
}

/**
 * Checks if `value` is likely a prototype object.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
 */
function isPrototype(value) {
  var Ctor = value && value.constructor,
      proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto;

  return value === proto;
}

/**
 * Checks if `value` is likely an `arguments` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 *  else `false`.
 * @example
 *
 * _.isArguments(function() { return arguments; }());
 * // => true
 *
 * _.isArguments([1, 2, 3]);
 * // => false
 */
function isArguments(value) {
  // Safari 8.1 makes `arguments.callee` enumerable in strict mode.
  return isArrayLikeObject(value) && hasOwnProperty.call(value, 'callee') &&
    (!propertyIsEnumerable.call(value, 'callee') || objectToString.call(value) == argsTag);
}

/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */
var isArray = Array.isArray;

/**
 * Checks if `value` is array-like. A value is considered array-like if it's
 * not a function and has a `value.length` that's an integer greater than or
 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
 * @example
 *
 * _.isArrayLike([1, 2, 3]);
 * // => true
 *
 * _.isArrayLike(document.body.children);
 * // => true
 *
 * _.isArrayLike('abc');
 * // => true
 *
 * _.isArrayLike(_.noop);
 * // => false
 */
function isArrayLike(value) {
  return value != null && isLength(value.length) && !isFunction(value);
}

/**
 * This method is like `_.isArrayLike` except that it also checks if `value`
 * is an object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array-like object,
 *  else `false`.
 * @example
 *
 * _.isArrayLikeObject([1, 2, 3]);
 * // => true
 *
 * _.isArrayLikeObject(document.body.children);
 * // => true
 *
 * _.isArrayLikeObject('abc');
 * // => false
 *
 * _.isArrayLikeObject(_.noop);
 * // => false
 */
function isArrayLikeObject(value) {
  return isObjectLike(value) && isArrayLike(value);
}

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 8-9 which returns 'object' for typed array and other constructors.
  var tag = isObject(value) ? objectToString.call(value) : '';
  return tag == funcTag || tag == genTag;
}

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This method is loosely based on
 * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 * @example
 *
 * _.isLength(3);
 * // => true
 *
 * _.isLength(Number.MIN_VALUE);
 * // => false
 *
 * _.isLength(Infinity);
 * // => false
 *
 * _.isLength('3');
 * // => false
 */
function isLength(value) {
  return typeof value == 'number' &&
    value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return !!value && typeof value == 'object';
}

/**
 * Creates an array of the own enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects. See the
 * [ES spec](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
 * for more details.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keys(new Foo);
 * // => ['a', 'b'] (iteration order is not guaranteed)
 *
 * _.keys('hi');
 * // => ['0', '1']
 */
function keys(object) {
  return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
}

/**
 * Creates an array of the own enumerable string keyed property values of `object`.
 *
 * **Note:** Non-object values are coerced to objects.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property values.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.values(new Foo);
 * // => [1, 2] (iteration order is not guaranteed)
 *
 * _.values('hi');
 * // => ['h', 'i']
 */
function values(object) {
  return object ? baseValues(object, keys(object)) : [];
}

module.exports = values;

},{}],8:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],9:[function(require,module,exports){
/*

StackBlur - a fast almost Gaussian Blur For Canvas

Version: 	0.5
Author:		Mario Klingemann
Contact: 	mario@quasimondo.com
Website:	http://www.quasimondo.com/StackBlurForCanvas
Twitter:	@quasimondo

In case you find this class useful - especially in commercial projects -
I am not totally unhappy for a small donation to my PayPal account
mario@quasimondo.de

Or support me on flattr: 
https://flattr.com/thing/72791/StackBlur-a-fast-almost-Gaussian-Blur-Effect-for-CanvasJavascript

Copyright (c) 2010 Mario Klingemann

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.
*/

var mul_table = [
        512,512,456,512,328,456,335,512,405,328,271,456,388,335,292,512,
        454,405,364,328,298,271,496,456,420,388,360,335,312,292,273,512,
        482,454,428,405,383,364,345,328,312,298,284,271,259,496,475,456,
        437,420,404,388,374,360,347,335,323,312,302,292,282,273,265,512,
        497,482,468,454,441,428,417,405,394,383,373,364,354,345,337,328,
        320,312,305,298,291,284,278,271,265,259,507,496,485,475,465,456,
        446,437,428,420,412,404,396,388,381,374,367,360,354,347,341,335,
        329,323,318,312,307,302,297,292,287,282,278,273,269,265,261,512,
        505,497,489,482,475,468,461,454,447,441,435,428,422,417,411,405,
        399,394,389,383,378,373,368,364,359,354,350,345,341,337,332,328,
        324,320,316,312,309,305,301,298,294,291,287,284,281,278,274,271,
        268,265,262,259,257,507,501,496,491,485,480,475,470,465,460,456,
        451,446,442,437,433,428,424,420,416,412,408,404,400,396,392,388,
        385,381,377,374,370,367,363,360,357,354,350,347,344,341,338,335,
        332,329,326,323,320,318,315,312,310,307,304,302,299,297,294,292,
        289,287,285,282,280,278,275,273,271,269,267,265,263,261,259];
        
   
var shg_table = [
	     9, 11, 12, 13, 13, 14, 14, 15, 15, 15, 15, 16, 16, 16, 16, 17, 
		17, 17, 17, 17, 17, 17, 18, 18, 18, 18, 18, 18, 18, 18, 18, 19, 
		19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 20, 20, 20,
		20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 21,
		21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21,
		21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 22, 22, 22, 22, 22, 22, 
		22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22,
		22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 23, 
		23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23,
		23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23,
		23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 
		23, 23, 23, 23, 23, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 
		24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24,
		24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24,
		24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24,
		24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24 ];

function blur( pixels, width, height, radius )
{
	if ( isNaN(radius) || radius < 1 ) return;
	radius |= 0;

	var x, y, i, p, yp, yi, yw, r_sum, g_sum, b_sum, a_sum, 
	r_out_sum, g_out_sum, b_out_sum, a_out_sum,
	r_in_sum, g_in_sum, b_in_sum, a_in_sum, 
	pr, pg, pb, pa, rbs;
			
	var div = radius + radius + 1;
	var w4 = width << 2;
	var widthMinus1  = width - 1;
	var heightMinus1 = height - 1;
	var radiusPlus1  = radius + 1;
	var sumFactor = radiusPlus1 * ( radiusPlus1 + 1 ) / 2;
	
	var stackStart = new BlurStack();
	var stack = stackStart;
	for ( i = 1; i < div; i++ )
	{
		stack = stack.next = new BlurStack();
		if ( i == radiusPlus1 ) var stackEnd = stack;
	}
	stack.next = stackStart;
	var stackIn = null;
	var stackOut = null;
	
	yw = yi = 0;
	
	var mul_sum = mul_table[radius];
	var shg_sum = shg_table[radius];
	
	for ( y = 0; y < height; y++ )
	{
		r_in_sum = g_in_sum = b_in_sum = a_in_sum = r_sum = g_sum = b_sum = a_sum = 0;
		
		r_out_sum = radiusPlus1 * ( pr = pixels[yi] );
		g_out_sum = radiusPlus1 * ( pg = pixels[yi+1] );
		b_out_sum = radiusPlus1 * ( pb = pixels[yi+2] );
		a_out_sum = radiusPlus1 * ( pa = pixels[yi+3] );
		
		r_sum += sumFactor * pr;
		g_sum += sumFactor * pg;
		b_sum += sumFactor * pb;
		a_sum += sumFactor * pa;
		
		stack = stackStart;
		
		for( i = 0; i < radiusPlus1; i++ )
		{
			stack.r = pr;
			stack.g = pg;
			stack.b = pb;
			stack.a = pa;
			stack = stack.next;
		}
		
		for( i = 1; i < radiusPlus1; i++ )
		{
			p = yi + (( widthMinus1 < i ? widthMinus1 : i ) << 2 );
			r_sum += ( stack.r = ( pr = pixels[p])) * ( rbs = radiusPlus1 - i );
			g_sum += ( stack.g = ( pg = pixels[p+1])) * rbs;
			b_sum += ( stack.b = ( pb = pixels[p+2])) * rbs;
			a_sum += ( stack.a = ( pa = pixels[p+3])) * rbs;
			
			r_in_sum += pr;
			g_in_sum += pg;
			b_in_sum += pb;
			a_in_sum += pa;
			
			stack = stack.next;
		}
		
		
		stackIn = stackStart;
		stackOut = stackEnd;
		for ( x = 0; x < width; x++ )
		{
			pixels[yi+3] = pa = (a_sum * mul_sum) >> shg_sum;
			if ( pa != 0 )
			{
				pa = 255 / pa;
				pixels[yi]   = ((r_sum * mul_sum) >> shg_sum) * pa;
				pixels[yi+1] = ((g_sum * mul_sum) >> shg_sum) * pa;
				pixels[yi+2] = ((b_sum * mul_sum) >> shg_sum) * pa;
			} else {
				pixels[yi] = pixels[yi+1] = pixels[yi+2] = 0;
			}
			
			r_sum -= r_out_sum;
			g_sum -= g_out_sum;
			b_sum -= b_out_sum;
			a_sum -= a_out_sum;
			
			r_out_sum -= stackIn.r;
			g_out_sum -= stackIn.g;
			b_out_sum -= stackIn.b;
			a_out_sum -= stackIn.a;
			
			p =  ( yw + ( ( p = x + radius + 1 ) < widthMinus1 ? p : widthMinus1 ) ) << 2;
			
			r_in_sum += ( stackIn.r = pixels[p]);
			g_in_sum += ( stackIn.g = pixels[p+1]);
			b_in_sum += ( stackIn.b = pixels[p+2]);
			a_in_sum += ( stackIn.a = pixels[p+3]);
			
			r_sum += r_in_sum;
			g_sum += g_in_sum;
			b_sum += b_in_sum;
			a_sum += a_in_sum;
			
			stackIn = stackIn.next;
			
			r_out_sum += ( pr = stackOut.r );
			g_out_sum += ( pg = stackOut.g );
			b_out_sum += ( pb = stackOut.b );
			a_out_sum += ( pa = stackOut.a );
			
			r_in_sum -= pr;
			g_in_sum -= pg;
			b_in_sum -= pb;
			a_in_sum -= pa;
			
			stackOut = stackOut.next;

			yi += 4;
		}
		yw += width;
	}

	
	for ( x = 0; x < width; x++ )
	{
		g_in_sum = b_in_sum = a_in_sum = r_in_sum = g_sum = b_sum = a_sum = r_sum = 0;
		
		yi = x << 2;
		r_out_sum = radiusPlus1 * ( pr = pixels[yi]);
		g_out_sum = radiusPlus1 * ( pg = pixels[yi+1]);
		b_out_sum = radiusPlus1 * ( pb = pixels[yi+2]);
		a_out_sum = radiusPlus1 * ( pa = pixels[yi+3]);
		
		r_sum += sumFactor * pr;
		g_sum += sumFactor * pg;
		b_sum += sumFactor * pb;
		a_sum += sumFactor * pa;
		
		stack = stackStart;
		
		for( i = 0; i < radiusPlus1; i++ )
		{
			stack.r = pr;
			stack.g = pg;
			stack.b = pb;
			stack.a = pa;
			stack = stack.next;
		}
		
		yp = width;
		
		for( i = 1; i <= radius; i++ )
		{
			yi = ( yp + x ) << 2;
			
			r_sum += ( stack.r = ( pr = pixels[yi])) * ( rbs = radiusPlus1 - i );
			g_sum += ( stack.g = ( pg = pixels[yi+1])) * rbs;
			b_sum += ( stack.b = ( pb = pixels[yi+2])) * rbs;
			a_sum += ( stack.a = ( pa = pixels[yi+3])) * rbs;
		   
			r_in_sum += pr;
			g_in_sum += pg;
			b_in_sum += pb;
			a_in_sum += pa;
			
			stack = stack.next;
		
			if( i < heightMinus1 )
			{
				yp += width;
			}
		}
		
		yi = x;
		stackIn = stackStart;
		stackOut = stackEnd;
		for ( y = 0; y < height; y++ )
		{
			p = yi << 2;
			pixels[p+3] = pa = (a_sum * mul_sum) >> shg_sum;
			if ( pa > 0 )
			{
				pa = 255 / pa;
				pixels[p]   = ((r_sum * mul_sum) >> shg_sum ) * pa;
				pixels[p+1] = ((g_sum * mul_sum) >> shg_sum ) * pa;
				pixels[p+2] = ((b_sum * mul_sum) >> shg_sum ) * pa;
			} else {
				pixels[p] = pixels[p+1] = pixels[p+2] = 0;
			}
			
			r_sum -= r_out_sum;
			g_sum -= g_out_sum;
			b_sum -= b_out_sum;
			a_sum -= a_out_sum;
		   
			r_out_sum -= stackIn.r;
			g_out_sum -= stackIn.g;
			b_out_sum -= stackIn.b;
			a_out_sum -= stackIn.a;
			
			p = ( x + (( ( p = y + radiusPlus1) < heightMinus1 ? p : heightMinus1 ) * width )) << 2;
			
			r_sum += ( r_in_sum += ( stackIn.r = pixels[p]));
			g_sum += ( g_in_sum += ( stackIn.g = pixels[p+1]));
			b_sum += ( b_in_sum += ( stackIn.b = pixels[p+2]));
			a_sum += ( a_in_sum += ( stackIn.a = pixels[p+3]));
		   
			stackIn = stackIn.next;
			
			r_out_sum += ( pr = stackOut.r );
			g_out_sum += ( pg = stackOut.g );
			b_out_sum += ( pb = stackOut.b );
			a_out_sum += ( pa = stackOut.a );
			
			r_in_sum -= pr;
			g_in_sum -= pg;
			b_in_sum -= pb;
			a_in_sum -= pa;
			
			stackOut = stackOut.next;
			
			yi += width;
		}
	}
}

function BlurStack()
{
	this.r = 0;
	this.g = 0;
	this.b = 0;
	this.a = 0;
	this.next = null;
}

module.exports = blur;
},{}],10:[function(require,module,exports){
function DOMParser(options){
	this.options = options ||{locator:{}};
	
}
DOMParser.prototype.parseFromString = function(source,mimeType){
	var options = this.options;
	var sax =  new XMLReader();
	var domBuilder = options.domBuilder || new DOMHandler();//contentHandler and LexicalHandler
	var errorHandler = options.errorHandler;
	var locator = options.locator;
	var defaultNSMap = options.xmlns||{};
	var entityMap = {'lt':'<','gt':'>','amp':'&','quot':'"','apos':"'"}
	if(locator){
		domBuilder.setDocumentLocator(locator)
	}
	
	sax.errorHandler = buildErrorHandler(errorHandler,domBuilder,locator);
	sax.domBuilder = options.domBuilder || domBuilder;
	if(/\/x?html?$/.test(mimeType)){
		entityMap.nbsp = '\xa0';
		entityMap.copy = '\xa9';
		defaultNSMap['']= 'http://www.w3.org/1999/xhtml';
	}
	defaultNSMap.xml = defaultNSMap.xml || 'http://www.w3.org/XML/1998/namespace';
	if(source){
		sax.parse(source,defaultNSMap,entityMap);
	}else{
		sax.errorHandler.error("invalid doc source");
	}
	return domBuilder.doc;
}
function buildErrorHandler(errorImpl,domBuilder,locator){
	if(!errorImpl){
		if(domBuilder instanceof DOMHandler){
			return domBuilder;
		}
		errorImpl = domBuilder ;
	}
	var errorHandler = {}
	var isCallback = errorImpl instanceof Function;
	locator = locator||{}
	function build(key){
		var fn = errorImpl[key];
		if(!fn && isCallback){
			fn = errorImpl.length == 2?function(msg){errorImpl(key,msg)}:errorImpl;
		}
		errorHandler[key] = fn && function(msg){
			fn('[xmldom '+key+']\t'+msg+_locator(locator));
		}||function(){};
	}
	build('warning');
	build('error');
	build('fatalError');
	return errorHandler;
}

//console.log('#\n\n\n\n\n\n\n####')
/**
 * +ContentHandler+ErrorHandler
 * +LexicalHandler+EntityResolver2
 * -DeclHandler-DTDHandler 
 * 
 * DefaultHandler:EntityResolver, DTDHandler, ContentHandler, ErrorHandler
 * DefaultHandler2:DefaultHandler,LexicalHandler, DeclHandler, EntityResolver2
 * @link http://www.saxproject.org/apidoc/org/xml/sax/helpers/DefaultHandler.html
 */
function DOMHandler() {
    this.cdata = false;
}
function position(locator,node){
	node.lineNumber = locator.lineNumber;
	node.columnNumber = locator.columnNumber;
}
/**
 * @see org.xml.sax.ContentHandler#startDocument
 * @link http://www.saxproject.org/apidoc/org/xml/sax/ContentHandler.html
 */ 
DOMHandler.prototype = {
	startDocument : function() {
    	this.doc = new DOMImplementation().createDocument(null, null, null);
    	if (this.locator) {
        	this.doc.documentURI = this.locator.systemId;
    	}
	},
	startElement:function(namespaceURI, localName, qName, attrs) {
		var doc = this.doc;
	    var el = doc.createElementNS(namespaceURI, qName||localName);
	    var len = attrs.length;
	    appendElement(this, el);
	    this.currentElement = el;
	    
		this.locator && position(this.locator,el)
	    for (var i = 0 ; i < len; i++) {
	        var namespaceURI = attrs.getURI(i);
	        var value = attrs.getValue(i);
	        var qName = attrs.getQName(i);
			var attr = doc.createAttributeNS(namespaceURI, qName);
			this.locator &&position(attrs.getLocator(i),attr);
			attr.value = attr.nodeValue = value;
			el.setAttributeNode(attr)
	    }
	},
	endElement:function(namespaceURI, localName, qName) {
		var current = this.currentElement
		var tagName = current.tagName;
		this.currentElement = current.parentNode;
	},
	startPrefixMapping:function(prefix, uri) {
	},
	endPrefixMapping:function(prefix) {
	},
	processingInstruction:function(target, data) {
	    var ins = this.doc.createProcessingInstruction(target, data);
	    this.locator && position(this.locator,ins)
	    appendElement(this, ins);
	},
	ignorableWhitespace:function(ch, start, length) {
	},
	characters:function(chars, start, length) {
		chars = _toString.apply(this,arguments)
		//console.log(chars)
		if(chars){
			if (this.cdata) {
				var charNode = this.doc.createCDATASection(chars);
			} else {
				var charNode = this.doc.createTextNode(chars);
			}
			if(this.currentElement){
				this.currentElement.appendChild(charNode);
			}else if(/^\s*$/.test(chars)){
				this.doc.appendChild(charNode);
				//process xml
			}
			this.locator && position(this.locator,charNode)
		}
	},
	skippedEntity:function(name) {
	},
	endDocument:function() {
		this.doc.normalize();
	},
	setDocumentLocator:function (locator) {
	    if(this.locator = locator){// && !('lineNumber' in locator)){
	    	locator.lineNumber = 0;
	    }
	},
	//LexicalHandler
	comment:function(chars, start, length) {
		chars = _toString.apply(this,arguments)
	    var comm = this.doc.createComment(chars);
	    this.locator && position(this.locator,comm)
	    appendElement(this, comm);
	},
	
	startCDATA:function() {
	    //used in characters() methods
	    this.cdata = true;
	},
	endCDATA:function() {
	    this.cdata = false;
	},
	
	startDTD:function(name, publicId, systemId) {
		var impl = this.doc.implementation;
	    if (impl && impl.createDocumentType) {
	        var dt = impl.createDocumentType(name, publicId, systemId);
	        this.locator && position(this.locator,dt)
	        appendElement(this, dt);
	    }
	},
	/**
	 * @see org.xml.sax.ErrorHandler
	 * @link http://www.saxproject.org/apidoc/org/xml/sax/ErrorHandler.html
	 */
	warning:function(error) {
		console.warn('[xmldom warning]\t'+error,_locator(this.locator));
	},
	error:function(error) {
		console.error('[xmldom error]\t'+error,_locator(this.locator));
	},
	fatalError:function(error) {
		console.error('[xmldom fatalError]\t'+error,_locator(this.locator));
	    throw error;
	}
}
function _locator(l){
	if(l){
		return '\n@'+(l.systemId ||'')+'#[line:'+l.lineNumber+',col:'+l.columnNumber+']'
	}
}
function _toString(chars,start,length){
	if(typeof chars == 'string'){
		return chars.substr(start,length)
	}else{//java sax connect width xmldom on rhino(what about: "? && !(chars instanceof String)")
		if(chars.length >= start+length || start){
			return new java.lang.String(chars,start,length)+'';
		}
		return chars;
	}
}

/*
 * @link http://www.saxproject.org/apidoc/org/xml/sax/ext/LexicalHandler.html
 * used method of org.xml.sax.ext.LexicalHandler:
 *  #comment(chars, start, length)
 *  #startCDATA()
 *  #endCDATA()
 *  #startDTD(name, publicId, systemId)
 *
 *
 * IGNORED method of org.xml.sax.ext.LexicalHandler:
 *  #endDTD()
 *  #startEntity(name)
 *  #endEntity(name)
 *
 *
 * @link http://www.saxproject.org/apidoc/org/xml/sax/ext/DeclHandler.html
 * IGNORED method of org.xml.sax.ext.DeclHandler
 * 	#attributeDecl(eName, aName, type, mode, value)
 *  #elementDecl(name, model)
 *  #externalEntityDecl(name, publicId, systemId)
 *  #internalEntityDecl(name, value)
 * @link http://www.saxproject.org/apidoc/org/xml/sax/ext/EntityResolver2.html
 * IGNORED method of org.xml.sax.EntityResolver2
 *  #resolveEntity(String name,String publicId,String baseURI,String systemId)
 *  #resolveEntity(publicId, systemId)
 *  #getExternalSubset(name, baseURI)
 * @link http://www.saxproject.org/apidoc/org/xml/sax/DTDHandler.html
 * IGNORED method of org.xml.sax.DTDHandler
 *  #notationDecl(name, publicId, systemId) {};
 *  #unparsedEntityDecl(name, publicId, systemId, notationName) {};
 */
"endDTD,startEntity,endEntity,attributeDecl,elementDecl,externalEntityDecl,internalEntityDecl,resolveEntity,getExternalSubset,notationDecl,unparsedEntityDecl".replace(/\w+/g,function(key){
	DOMHandler.prototype[key] = function(){return null}
})

/* Private static helpers treated below as private instance methods, so don't need to add these to the public API; we might use a Relator to also get rid of non-standard public properties */
function appendElement (hander,node) {
    if (!hander.currentElement) {
        hander.doc.appendChild(node);
    } else {
        hander.currentElement.appendChild(node);
    }
}//appendChild and setAttributeNS are preformance key

//if(typeof require == 'function'){
	var XMLReader = require('./sax').XMLReader;
	var DOMImplementation = exports.DOMImplementation = require('./dom').DOMImplementation;
	exports.XMLSerializer = require('./dom').XMLSerializer ;
	exports.DOMParser = DOMParser;
//}

},{"./dom":11,"./sax":12}],11:[function(require,module,exports){
/*
 * DOM Level 2
 * Object DOMException
 * @see http://www.w3.org/TR/REC-DOM-Level-1/ecma-script-language-binding.html
 * @see http://www.w3.org/TR/2000/REC-DOM-Level-2-Core-20001113/ecma-script-binding.html
 */

function copy(src,dest){
	for(var p in src){
		dest[p] = src[p];
	}
}
/**
^\w+\.prototype\.([_\w]+)\s*=\s*((?:.*\{\s*?[\r\n][\s\S]*?^})|\S.*?(?=[;\r\n]));?
^\w+\.prototype\.([_\w]+)\s*=\s*(\S.*?(?=[;\r\n]));?
 */
function _extends(Class,Super){
	var pt = Class.prototype;
	if(Object.create){
		var ppt = Object.create(Super.prototype)
		pt.__proto__ = ppt;
	}
	if(!(pt instanceof Super)){
		function t(){};
		t.prototype = Super.prototype;
		t = new t();
		copy(pt,t);
		Class.prototype = pt = t;
	}
	if(pt.constructor != Class){
		if(typeof Class != 'function'){
			console.error("unknow Class:"+Class)
		}
		pt.constructor = Class
	}
}
var htmlns = 'http://www.w3.org/1999/xhtml' ;
// Node Types
var NodeType = {}
var ELEMENT_NODE                = NodeType.ELEMENT_NODE                = 1;
var ATTRIBUTE_NODE              = NodeType.ATTRIBUTE_NODE              = 2;
var TEXT_NODE                   = NodeType.TEXT_NODE                   = 3;
var CDATA_SECTION_NODE          = NodeType.CDATA_SECTION_NODE          = 4;
var ENTITY_REFERENCE_NODE       = NodeType.ENTITY_REFERENCE_NODE       = 5;
var ENTITY_NODE                 = NodeType.ENTITY_NODE                 = 6;
var PROCESSING_INSTRUCTION_NODE = NodeType.PROCESSING_INSTRUCTION_NODE = 7;
var COMMENT_NODE                = NodeType.COMMENT_NODE                = 8;
var DOCUMENT_NODE               = NodeType.DOCUMENT_NODE               = 9;
var DOCUMENT_TYPE_NODE          = NodeType.DOCUMENT_TYPE_NODE          = 10;
var DOCUMENT_FRAGMENT_NODE      = NodeType.DOCUMENT_FRAGMENT_NODE      = 11;
var NOTATION_NODE               = NodeType.NOTATION_NODE               = 12;

// ExceptionCode
var ExceptionCode = {}
var ExceptionMessage = {};
var INDEX_SIZE_ERR              = ExceptionCode.INDEX_SIZE_ERR              = ((ExceptionMessage[1]="Index size error"),1);
var DOMSTRING_SIZE_ERR          = ExceptionCode.DOMSTRING_SIZE_ERR          = ((ExceptionMessage[2]="DOMString size error"),2);
var HIERARCHY_REQUEST_ERR       = ExceptionCode.HIERARCHY_REQUEST_ERR       = ((ExceptionMessage[3]="Hierarchy request error"),3);
var WRONG_DOCUMENT_ERR          = ExceptionCode.WRONG_DOCUMENT_ERR          = ((ExceptionMessage[4]="Wrong document"),4);
var INVALID_CHARACTER_ERR       = ExceptionCode.INVALID_CHARACTER_ERR       = ((ExceptionMessage[5]="Invalid character"),5);
var NO_DATA_ALLOWED_ERR         = ExceptionCode.NO_DATA_ALLOWED_ERR         = ((ExceptionMessage[6]="No data allowed"),6);
var NO_MODIFICATION_ALLOWED_ERR = ExceptionCode.NO_MODIFICATION_ALLOWED_ERR = ((ExceptionMessage[7]="No modification allowed"),7);
var NOT_FOUND_ERR               = ExceptionCode.NOT_FOUND_ERR               = ((ExceptionMessage[8]="Not found"),8);
var NOT_SUPPORTED_ERR           = ExceptionCode.NOT_SUPPORTED_ERR           = ((ExceptionMessage[9]="Not supported"),9);
var INUSE_ATTRIBUTE_ERR         = ExceptionCode.INUSE_ATTRIBUTE_ERR         = ((ExceptionMessage[10]="Attribute in use"),10);
//level2
var INVALID_STATE_ERR        	= ExceptionCode.INVALID_STATE_ERR        	= ((ExceptionMessage[11]="Invalid state"),11);
var SYNTAX_ERR               	= ExceptionCode.SYNTAX_ERR               	= ((ExceptionMessage[12]="Syntax error"),12);
var INVALID_MODIFICATION_ERR 	= ExceptionCode.INVALID_MODIFICATION_ERR 	= ((ExceptionMessage[13]="Invalid modification"),13);
var NAMESPACE_ERR            	= ExceptionCode.NAMESPACE_ERR           	= ((ExceptionMessage[14]="Invalid namespace"),14);
var INVALID_ACCESS_ERR       	= ExceptionCode.INVALID_ACCESS_ERR      	= ((ExceptionMessage[15]="Invalid access"),15);


function DOMException(code, message) {
	if(message instanceof Error){
		var error = message;
	}else{
		error = this;
		Error.call(this, ExceptionMessage[code]);
		this.message = ExceptionMessage[code];
		if(Error.captureStackTrace) Error.captureStackTrace(this, DOMException);
	}
	error.code = code;
	if(message) this.message = this.message + ": " + message;
	return error;
};
DOMException.prototype = Error.prototype;
copy(ExceptionCode,DOMException)
/**
 * @see http://www.w3.org/TR/2000/REC-DOM-Level-2-Core-20001113/core.html#ID-536297177
 * The NodeList interface provides the abstraction of an ordered collection of nodes, without defining or constraining how this collection is implemented. NodeList objects in the DOM are live.
 * The items in the NodeList are accessible via an integral index, starting from 0.
 */
function NodeList() {
};
NodeList.prototype = {
	/**
	 * The number of nodes in the list. The range of valid child node indices is 0 to length-1 inclusive.
	 * @standard level1
	 */
	length:0, 
	/**
	 * Returns the indexth item in the collection. If index is greater than or equal to the number of nodes in the list, this returns null.
	 * @standard level1
	 * @param index  unsigned long 
	 *   Index into the collection.
	 * @return Node
	 * 	The node at the indexth position in the NodeList, or null if that is not a valid index. 
	 */
	item: function(index) {
		return this[index] || null;
	},
	toString:function(isHTML,nodeFilter){
		for(var buf = [], i = 0;i<this.length;i++){
			serializeToString(this[i],buf,isHTML,nodeFilter);
		}
		return buf.join('');
	}
};
function LiveNodeList(node,refresh){
	this._node = node;
	this._refresh = refresh
	_updateLiveList(this);
}
function _updateLiveList(list){
	var inc = list._node._inc || list._node.ownerDocument._inc;
	if(list._inc != inc){
		var ls = list._refresh(list._node);
		//console.log(ls.length)
		__set__(list,'length',ls.length);
		copy(ls,list);
		list._inc = inc;
	}
}
LiveNodeList.prototype.item = function(i){
	_updateLiveList(this);
	return this[i];
}

_extends(LiveNodeList,NodeList);
/**
 * 
 * Objects implementing the NamedNodeMap interface are used to represent collections of nodes that can be accessed by name. Note that NamedNodeMap does not inherit from NodeList; NamedNodeMaps are not maintained in any particular order. Objects contained in an object implementing NamedNodeMap may also be accessed by an ordinal index, but this is simply to allow convenient enumeration of the contents of a NamedNodeMap, and does not imply that the DOM specifies an order to these Nodes.
 * NamedNodeMap objects in the DOM are live.
 * used for attributes or DocumentType entities 
 */
function NamedNodeMap() {
};

function _findNodeIndex(list,node){
	var i = list.length;
	while(i--){
		if(list[i] === node){return i}
	}
}

function _addNamedNode(el,list,newAttr,oldAttr){
	if(oldAttr){
		list[_findNodeIndex(list,oldAttr)] = newAttr;
	}else{
		list[list.length++] = newAttr;
	}
	if(el){
		newAttr.ownerElement = el;
		var doc = el.ownerDocument;
		if(doc){
			oldAttr && _onRemoveAttribute(doc,el,oldAttr);
			_onAddAttribute(doc,el,newAttr);
		}
	}
}
function _removeNamedNode(el,list,attr){
	//console.log('remove attr:'+attr)
	var i = _findNodeIndex(list,attr);
	if(i>=0){
		var lastIndex = list.length-1
		while(i<lastIndex){
			list[i] = list[++i]
		}
		list.length = lastIndex;
		if(el){
			var doc = el.ownerDocument;
			if(doc){
				_onRemoveAttribute(doc,el,attr);
				attr.ownerElement = null;
			}
		}
	}else{
		throw DOMException(NOT_FOUND_ERR,new Error(el.tagName+'@'+attr))
	}
}
NamedNodeMap.prototype = {
	length:0,
	item:NodeList.prototype.item,
	getNamedItem: function(key) {
//		if(key.indexOf(':')>0 || key == 'xmlns'){
//			return null;
//		}
		//console.log()
		var i = this.length;
		while(i--){
			var attr = this[i];
			//console.log(attr.nodeName,key)
			if(attr.nodeName == key){
				return attr;
			}
		}
	},
	setNamedItem: function(attr) {
		var el = attr.ownerElement;
		if(el && el!=this._ownerElement){
			throw new DOMException(INUSE_ATTRIBUTE_ERR);
		}
		var oldAttr = this.getNamedItem(attr.nodeName);
		_addNamedNode(this._ownerElement,this,attr,oldAttr);
		return oldAttr;
	},
	/* returns Node */
	setNamedItemNS: function(attr) {// raises: WRONG_DOCUMENT_ERR,NO_MODIFICATION_ALLOWED_ERR,INUSE_ATTRIBUTE_ERR
		var el = attr.ownerElement, oldAttr;
		if(el && el!=this._ownerElement){
			throw new DOMException(INUSE_ATTRIBUTE_ERR);
		}
		oldAttr = this.getNamedItemNS(attr.namespaceURI,attr.localName);
		_addNamedNode(this._ownerElement,this,attr,oldAttr);
		return oldAttr;
	},

	/* returns Node */
	removeNamedItem: function(key) {
		var attr = this.getNamedItem(key);
		_removeNamedNode(this._ownerElement,this,attr);
		return attr;
		
		
	},// raises: NOT_FOUND_ERR,NO_MODIFICATION_ALLOWED_ERR
	
	//for level2
	removeNamedItemNS:function(namespaceURI,localName){
		var attr = this.getNamedItemNS(namespaceURI,localName);
		_removeNamedNode(this._ownerElement,this,attr);
		return attr;
	},
	getNamedItemNS: function(namespaceURI, localName) {
		var i = this.length;
		while(i--){
			var node = this[i];
			if(node.localName == localName && node.namespaceURI == namespaceURI){
				return node;
			}
		}
		return null;
	}
};
/**
 * @see http://www.w3.org/TR/REC-DOM-Level-1/level-one-core.html#ID-102161490
 */
function DOMImplementation(/* Object */ features) {
	this._features = {};
	if (features) {
		for (var feature in features) {
			 this._features = features[feature];
		}
	}
};

DOMImplementation.prototype = {
	hasFeature: function(/* string */ feature, /* string */ version) {
		var versions = this._features[feature.toLowerCase()];
		if (versions && (!version || version in versions)) {
			return true;
		} else {
			return false;
		}
	},
	// Introduced in DOM Level 2:
	createDocument:function(namespaceURI,  qualifiedName, doctype){// raises:INVALID_CHARACTER_ERR,NAMESPACE_ERR,WRONG_DOCUMENT_ERR
		var doc = new Document();
		doc.implementation = this;
		doc.childNodes = new NodeList();
		doc.doctype = doctype;
		if(doctype){
			doc.appendChild(doctype);
		}
		if(qualifiedName){
			var root = doc.createElementNS(namespaceURI,qualifiedName);
			doc.appendChild(root);
		}
		return doc;
	},
	// Introduced in DOM Level 2:
	createDocumentType:function(qualifiedName, publicId, systemId){// raises:INVALID_CHARACTER_ERR,NAMESPACE_ERR
		var node = new DocumentType();
		node.name = qualifiedName;
		node.nodeName = qualifiedName;
		node.publicId = publicId;
		node.systemId = systemId;
		// Introduced in DOM Level 2:
		//readonly attribute DOMString        internalSubset;
		
		//TODO:..
		//  readonly attribute NamedNodeMap     entities;
		//  readonly attribute NamedNodeMap     notations;
		return node;
	}
};


/**
 * @see http://www.w3.org/TR/2000/REC-DOM-Level-2-Core-20001113/core.html#ID-1950641247
 */

function Node() {
};

Node.prototype = {
	firstChild : null,
	lastChild : null,
	previousSibling : null,
	nextSibling : null,
	attributes : null,
	parentNode : null,
	childNodes : null,
	ownerDocument : null,
	nodeValue : null,
	namespaceURI : null,
	prefix : null,
	localName : null,
	// Modified in DOM Level 2:
	insertBefore:function(newChild, refChild){//raises 
		return _insertBefore(this,newChild,refChild);
	},
	replaceChild:function(newChild, oldChild){//raises 
		this.insertBefore(newChild,oldChild);
		if(oldChild){
			this.removeChild(oldChild);
		}
	},
	removeChild:function(oldChild){
		return _removeChild(this,oldChild);
	},
	appendChild:function(newChild){
		return this.insertBefore(newChild,null);
	},
	hasChildNodes:function(){
		return this.firstChild != null;
	},
	cloneNode:function(deep){
		return cloneNode(this.ownerDocument||this,this,deep);
	},
	// Modified in DOM Level 2:
	normalize:function(){
		var child = this.firstChild;
		while(child){
			var next = child.nextSibling;
			if(next && next.nodeType == TEXT_NODE && child.nodeType == TEXT_NODE){
				this.removeChild(next);
				child.appendData(next.data);
			}else{
				child.normalize();
				child = next;
			}
		}
	},
  	// Introduced in DOM Level 2:
	isSupported:function(feature, version){
		return this.ownerDocument.implementation.hasFeature(feature,version);
	},
    // Introduced in DOM Level 2:
    hasAttributes:function(){
    	return this.attributes.length>0;
    },
    lookupPrefix:function(namespaceURI){
    	var el = this;
    	while(el){
    		var map = el._nsMap;
    		//console.dir(map)
    		if(map){
    			for(var n in map){
    				if(map[n] == namespaceURI){
    					return n;
    				}
    			}
    		}
    		el = el.nodeType == ATTRIBUTE_NODE?el.ownerDocument : el.parentNode;
    	}
    	return null;
    },
    // Introduced in DOM Level 3:
    lookupNamespaceURI:function(prefix){
    	var el = this;
    	while(el){
    		var map = el._nsMap;
    		//console.dir(map)
    		if(map){
    			if(prefix in map){
    				return map[prefix] ;
    			}
    		}
    		el = el.nodeType == ATTRIBUTE_NODE?el.ownerDocument : el.parentNode;
    	}
    	return null;
    },
    // Introduced in DOM Level 3:
    isDefaultNamespace:function(namespaceURI){
    	var prefix = this.lookupPrefix(namespaceURI);
    	return prefix == null;
    }
};


function _xmlEncoder(c){
	return c == '<' && '&lt;' ||
         c == '>' && '&gt;' ||
         c == '&' && '&amp;' ||
         c == '"' && '&quot;' ||
         '&#'+c.charCodeAt()+';'
}


copy(NodeType,Node);
copy(NodeType,Node.prototype);

/**
 * @param callback return true for continue,false for break
 * @return boolean true: break visit;
 */
function _visitNode(node,callback){
	if(callback(node)){
		return true;
	}
	if(node = node.firstChild){
		do{
			if(_visitNode(node,callback)){return true}
        }while(node=node.nextSibling)
    }
}



function Document(){
}
function _onAddAttribute(doc,el,newAttr){
	doc && doc._inc++;
	var ns = newAttr.namespaceURI ;
	if(ns == 'http://www.w3.org/2000/xmlns/'){
		//update namespace
		el._nsMap[newAttr.prefix?newAttr.localName:''] = newAttr.value
	}
}
function _onRemoveAttribute(doc,el,newAttr,remove){
	doc && doc._inc++;
	var ns = newAttr.namespaceURI ;
	if(ns == 'http://www.w3.org/2000/xmlns/'){
		//update namespace
		delete el._nsMap[newAttr.prefix?newAttr.localName:'']
	}
}
function _onUpdateChild(doc,el,newChild){
	if(doc && doc._inc){
		doc._inc++;
		//update childNodes
		var cs = el.childNodes;
		if(newChild){
			cs[cs.length++] = newChild;
		}else{
			//console.log(1)
			var child = el.firstChild;
			var i = 0;
			while(child){
				cs[i++] = child;
				child =child.nextSibling;
			}
			cs.length = i;
		}
	}
}

/**
 * attributes;
 * children;
 * 
 * writeable properties:
 * nodeValue,Attr:value,CharacterData:data
 * prefix
 */
function _removeChild(parentNode,child){
	var previous = child.previousSibling;
	var next = child.nextSibling;
	if(previous){
		previous.nextSibling = next;
	}else{
		parentNode.firstChild = next
	}
	if(next){
		next.previousSibling = previous;
	}else{
		parentNode.lastChild = previous;
	}
	_onUpdateChild(parentNode.ownerDocument,parentNode);
	return child;
}
/**
 * preformance key(refChild == null)
 */
function _insertBefore(parentNode,newChild,nextChild){
	var cp = newChild.parentNode;
	if(cp){
		cp.removeChild(newChild);//remove and update
	}
	if(newChild.nodeType === DOCUMENT_FRAGMENT_NODE){
		var newFirst = newChild.firstChild;
		if (newFirst == null) {
			return newChild;
		}
		var newLast = newChild.lastChild;
	}else{
		newFirst = newLast = newChild;
	}
	var pre = nextChild ? nextChild.previousSibling : parentNode.lastChild;

	newFirst.previousSibling = pre;
	newLast.nextSibling = nextChild;
	
	
	if(pre){
		pre.nextSibling = newFirst;
	}else{
		parentNode.firstChild = newFirst;
	}
	if(nextChild == null){
		parentNode.lastChild = newLast;
	}else{
		nextChild.previousSibling = newLast;
	}
	do{
		newFirst.parentNode = parentNode;
	}while(newFirst !== newLast && (newFirst= newFirst.nextSibling))
	_onUpdateChild(parentNode.ownerDocument||parentNode,parentNode);
	//console.log(parentNode.lastChild.nextSibling == null)
	if (newChild.nodeType == DOCUMENT_FRAGMENT_NODE) {
		newChild.firstChild = newChild.lastChild = null;
	}
	return newChild;
}
function _appendSingleChild(parentNode,newChild){
	var cp = newChild.parentNode;
	if(cp){
		var pre = parentNode.lastChild;
		cp.removeChild(newChild);//remove and update
		var pre = parentNode.lastChild;
	}
	var pre = parentNode.lastChild;
	newChild.parentNode = parentNode;
	newChild.previousSibling = pre;
	newChild.nextSibling = null;
	if(pre){
		pre.nextSibling = newChild;
	}else{
		parentNode.firstChild = newChild;
	}
	parentNode.lastChild = newChild;
	_onUpdateChild(parentNode.ownerDocument,parentNode,newChild);
	return newChild;
	//console.log("__aa",parentNode.lastChild.nextSibling == null)
}
Document.prototype = {
	//implementation : null,
	nodeName :  '#document',
	nodeType :  DOCUMENT_NODE,
	doctype :  null,
	documentElement :  null,
	_inc : 1,
	
	insertBefore :  function(newChild, refChild){//raises 
		if(newChild.nodeType == DOCUMENT_FRAGMENT_NODE){
			var child = newChild.firstChild;
			while(child){
				var next = child.nextSibling;
				this.insertBefore(child,refChild);
				child = next;
			}
			return newChild;
		}
		if(this.documentElement == null && newChild.nodeType == ELEMENT_NODE){
			this.documentElement = newChild;
		}
		
		return _insertBefore(this,newChild,refChild),(newChild.ownerDocument = this),newChild;
	},
	removeChild :  function(oldChild){
		if(this.documentElement == oldChild){
			this.documentElement = null;
		}
		return _removeChild(this,oldChild);
	},
	// Introduced in DOM Level 2:
	importNode : function(importedNode,deep){
		return importNode(this,importedNode,deep);
	},
	// Introduced in DOM Level 2:
	getElementById :	function(id){
		var rtv = null;
		_visitNode(this.documentElement,function(node){
			if(node.nodeType == ELEMENT_NODE){
				if(node.getAttribute('id') == id){
					rtv = node;
					return true;
				}
			}
		})
		return rtv;
	},
	
	//document factory method:
	createElement :	function(tagName){
		var node = new Element();
		node.ownerDocument = this;
		node.nodeName = tagName;
		node.tagName = tagName;
		node.childNodes = new NodeList();
		var attrs	= node.attributes = new NamedNodeMap();
		attrs._ownerElement = node;
		return node;
	},
	createDocumentFragment :	function(){
		var node = new DocumentFragment();
		node.ownerDocument = this;
		node.childNodes = new NodeList();
		return node;
	},
	createTextNode :	function(data){
		var node = new Text();
		node.ownerDocument = this;
		node.appendData(data)
		return node;
	},
	createComment :	function(data){
		var node = new Comment();
		node.ownerDocument = this;
		node.appendData(data)
		return node;
	},
	createCDATASection :	function(data){
		var node = new CDATASection();
		node.ownerDocument = this;
		node.appendData(data)
		return node;
	},
	createProcessingInstruction :	function(target,data){
		var node = new ProcessingInstruction();
		node.ownerDocument = this;
		node.tagName = node.target = target;
		node.nodeValue= node.data = data;
		return node;
	},
	createAttribute :	function(name){
		var node = new Attr();
		node.ownerDocument	= this;
		node.name = name;
		node.nodeName	= name;
		node.localName = name;
		node.specified = true;
		return node;
	},
	createEntityReference :	function(name){
		var node = new EntityReference();
		node.ownerDocument	= this;
		node.nodeName	= name;
		return node;
	},
	// Introduced in DOM Level 2:
	createElementNS :	function(namespaceURI,qualifiedName){
		var node = new Element();
		var pl = qualifiedName.split(':');
		var attrs	= node.attributes = new NamedNodeMap();
		node.childNodes = new NodeList();
		node.ownerDocument = this;
		node.nodeName = qualifiedName;
		node.tagName = qualifiedName;
		node.namespaceURI = namespaceURI;
		if(pl.length == 2){
			node.prefix = pl[0];
			node.localName = pl[1];
		}else{
			//el.prefix = null;
			node.localName = qualifiedName;
		}
		attrs._ownerElement = node;
		return node;
	},
	// Introduced in DOM Level 2:
	createAttributeNS :	function(namespaceURI,qualifiedName){
		var node = new Attr();
		var pl = qualifiedName.split(':');
		node.ownerDocument = this;
		node.nodeName = qualifiedName;
		node.name = qualifiedName;
		node.namespaceURI = namespaceURI;
		node.specified = true;
		if(pl.length == 2){
			node.prefix = pl[0];
			node.localName = pl[1];
		}else{
			//el.prefix = null;
			node.localName = qualifiedName;
		}
		return node;
	}
};
_extends(Document,Node);


function Element() {
	this._nsMap = {};
};
Element.prototype = {
	nodeType : ELEMENT_NODE,
	hasAttribute : function(name){
		return this.getAttributeNode(name)!=null;
	},
	getAttribute : function(name){
		var attr = this.getAttributeNode(name);
		return attr && attr.value || '';
	},
	getAttributeNode : function(name){
		return this.attributes.getNamedItem(name);
	},
	setAttribute : function(name, value){
		var attr = this.ownerDocument.createAttribute(name);
		attr.value = attr.nodeValue = "" + value;
		this.setAttributeNode(attr)
	},
	removeAttribute : function(name){
		var attr = this.getAttributeNode(name)
		attr && this.removeAttributeNode(attr);
	},
	
	//four real opeartion method
	appendChild:function(newChild){
		if(newChild.nodeType === DOCUMENT_FRAGMENT_NODE){
			return this.insertBefore(newChild,null);
		}else{
			return _appendSingleChild(this,newChild);
		}
	},
	setAttributeNode : function(newAttr){
		return this.attributes.setNamedItem(newAttr);
	},
	setAttributeNodeNS : function(newAttr){
		return this.attributes.setNamedItemNS(newAttr);
	},
	removeAttributeNode : function(oldAttr){
		//console.log(this == oldAttr.ownerElement)
		return this.attributes.removeNamedItem(oldAttr.nodeName);
	},
	//get real attribute name,and remove it by removeAttributeNode
	removeAttributeNS : function(namespaceURI, localName){
		var old = this.getAttributeNodeNS(namespaceURI, localName);
		old && this.removeAttributeNode(old);
	},
	
	hasAttributeNS : function(namespaceURI, localName){
		return this.getAttributeNodeNS(namespaceURI, localName)!=null;
	},
	getAttributeNS : function(namespaceURI, localName){
		var attr = this.getAttributeNodeNS(namespaceURI, localName);
		return attr && attr.value || '';
	},
	setAttributeNS : function(namespaceURI, qualifiedName, value){
		var attr = this.ownerDocument.createAttributeNS(namespaceURI, qualifiedName);
		attr.value = attr.nodeValue = "" + value;
		this.setAttributeNode(attr)
	},
	getAttributeNodeNS : function(namespaceURI, localName){
		return this.attributes.getNamedItemNS(namespaceURI, localName);
	},
	
	getElementsByTagName : function(tagName){
		return new LiveNodeList(this,function(base){
			var ls = [];
			_visitNode(base,function(node){
				if(node !== base && node.nodeType == ELEMENT_NODE && (tagName === '*' || node.tagName == tagName)){
					ls.push(node);
				}
			});
			return ls;
		});
	},
	getElementsByTagNameNS : function(namespaceURI, localName){
		return new LiveNodeList(this,function(base){
			var ls = [];
			_visitNode(base,function(node){
				if(node !== base && node.nodeType === ELEMENT_NODE && (namespaceURI === '*' || node.namespaceURI === namespaceURI) && (localName === '*' || node.localName == localName)){
					ls.push(node);
				}
			});
			return ls;
			
		});
	}
};
Document.prototype.getElementsByTagName = Element.prototype.getElementsByTagName;
Document.prototype.getElementsByTagNameNS = Element.prototype.getElementsByTagNameNS;


_extends(Element,Node);
function Attr() {
};
Attr.prototype.nodeType = ATTRIBUTE_NODE;
_extends(Attr,Node);


function CharacterData() {
};
CharacterData.prototype = {
	data : '',
	substringData : function(offset, count) {
		return this.data.substring(offset, offset+count);
	},
	appendData: function(text) {
		text = this.data+text;
		this.nodeValue = this.data = text;
		this.length = text.length;
	},
	insertData: function(offset,text) {
		this.replaceData(offset,0,text);
	
	},
	appendChild:function(newChild){
		throw new Error(ExceptionMessage[HIERARCHY_REQUEST_ERR])
	},
	deleteData: function(offset, count) {
		this.replaceData(offset,count,"");
	},
	replaceData: function(offset, count, text) {
		var start = this.data.substring(0,offset);
		var end = this.data.substring(offset+count);
		text = start + text + end;
		this.nodeValue = this.data = text;
		this.length = text.length;
	}
}
_extends(CharacterData,Node);
function Text() {
};
Text.prototype = {
	nodeName : "#text",
	nodeType : TEXT_NODE,
	splitText : function(offset) {
		var text = this.data;
		var newText = text.substring(offset);
		text = text.substring(0, offset);
		this.data = this.nodeValue = text;
		this.length = text.length;
		var newNode = this.ownerDocument.createTextNode(newText);
		if(this.parentNode){
			this.parentNode.insertBefore(newNode, this.nextSibling);
		}
		return newNode;
	}
}
_extends(Text,CharacterData);
function Comment() {
};
Comment.prototype = {
	nodeName : "#comment",
	nodeType : COMMENT_NODE
}
_extends(Comment,CharacterData);

function CDATASection() {
};
CDATASection.prototype = {
	nodeName : "#cdata-section",
	nodeType : CDATA_SECTION_NODE
}
_extends(CDATASection,CharacterData);


function DocumentType() {
};
DocumentType.prototype.nodeType = DOCUMENT_TYPE_NODE;
_extends(DocumentType,Node);

function Notation() {
};
Notation.prototype.nodeType = NOTATION_NODE;
_extends(Notation,Node);

function Entity() {
};
Entity.prototype.nodeType = ENTITY_NODE;
_extends(Entity,Node);

function EntityReference() {
};
EntityReference.prototype.nodeType = ENTITY_REFERENCE_NODE;
_extends(EntityReference,Node);

function DocumentFragment() {
};
DocumentFragment.prototype.nodeName =	"#document-fragment";
DocumentFragment.prototype.nodeType =	DOCUMENT_FRAGMENT_NODE;
_extends(DocumentFragment,Node);


function ProcessingInstruction() {
}
ProcessingInstruction.prototype.nodeType = PROCESSING_INSTRUCTION_NODE;
_extends(ProcessingInstruction,Node);
function XMLSerializer(){}
XMLSerializer.prototype.serializeToString = function(node,isHtml,nodeFilter){
	return nodeSerializeToString.call(node,isHtml,nodeFilter);
}
Node.prototype.toString = nodeSerializeToString;
function nodeSerializeToString(isHtml,nodeFilter){
	var buf = [];
	var refNode = this.nodeType == 9?this.documentElement:this;
	var prefix = refNode.prefix;
	var uri = refNode.namespaceURI;
	
	if(uri && prefix == null){
		//console.log(prefix)
		var prefix = refNode.lookupPrefix(uri);
		if(prefix == null){
			//isHTML = true;
			var visibleNamespaces=[
			{namespace:uri,prefix:null}
			//{namespace:uri,prefix:''}
			]
		}
	}
	serializeToString(this,buf,isHtml,nodeFilter,visibleNamespaces);
	//console.log('###',this.nodeType,uri,prefix,buf.join(''))
	return buf.join('');
}
function needNamespaceDefine(node,isHTML, visibleNamespaces) {
	var prefix = node.prefix||'';
	var uri = node.namespaceURI;
	if (!prefix && !uri){
		return false;
	}
	if (prefix === "xml" && uri === "http://www.w3.org/XML/1998/namespace" 
		|| uri == 'http://www.w3.org/2000/xmlns/'){
		return false;
	}
	
	var i = visibleNamespaces.length 
	//console.log('@@@@',node.tagName,prefix,uri,visibleNamespaces)
	while (i--) {
		var ns = visibleNamespaces[i];
		// get namespace prefix
		//console.log(node.nodeType,node.tagName,ns.prefix,prefix)
		if (ns.prefix == prefix){
			return ns.namespace != uri;
		}
	}
	//console.log(isHTML,uri,prefix=='')
	//if(isHTML && prefix ==null && uri == 'http://www.w3.org/1999/xhtml'){
	//	return false;
	//}
	//node.flag = '11111'
	//console.error(3,true,node.flag,node.prefix,node.namespaceURI)
	return true;
}
function serializeToString(node,buf,isHTML,nodeFilter,visibleNamespaces){
	if(nodeFilter){
		node = nodeFilter(node);
		if(node){
			if(typeof node == 'string'){
				buf.push(node);
				return;
			}
		}else{
			return;
		}
		//buf.sort.apply(attrs, attributeSorter);
	}
	switch(node.nodeType){
	case ELEMENT_NODE:
		if (!visibleNamespaces) visibleNamespaces = [];
		var startVisibleNamespaces = visibleNamespaces.length;
		var attrs = node.attributes;
		var len = attrs.length;
		var child = node.firstChild;
		var nodeName = node.tagName;
		
		isHTML =  (htmlns === node.namespaceURI) ||isHTML 
		buf.push('<',nodeName);
		
		
		
		for(var i=0;i<len;i++){
			// add namespaces for attributes
			var attr = attrs.item(i);
			if (attr.prefix == 'xmlns') {
				visibleNamespaces.push({ prefix: attr.localName, namespace: attr.value });
			}else if(attr.nodeName == 'xmlns'){
				visibleNamespaces.push({ prefix: '', namespace: attr.value });
			}
		}
		for(var i=0;i<len;i++){
			var attr = attrs.item(i);
			if (needNamespaceDefine(attr,isHTML, visibleNamespaces)) {
				var prefix = attr.prefix||'';
				var uri = attr.namespaceURI;
				var ns = prefix ? ' xmlns:' + prefix : " xmlns";
				buf.push(ns, '="' , uri , '"');
				visibleNamespaces.push({ prefix: prefix, namespace:uri });
			}
			serializeToString(attr,buf,isHTML,nodeFilter,visibleNamespaces);
		}
		// add namespace for current node		
		if (needNamespaceDefine(node,isHTML, visibleNamespaces)) {
			var prefix = node.prefix||'';
			var uri = node.namespaceURI;
			var ns = prefix ? ' xmlns:' + prefix : " xmlns";
			buf.push(ns, '="' , uri , '"');
			visibleNamespaces.push({ prefix: prefix, namespace:uri });
		}
		
		if(child || isHTML && !/^(?:meta|link|img|br|hr|input)$/i.test(nodeName)){
			buf.push('>');
			//if is cdata child node
			if(isHTML && /^script$/i.test(nodeName)){
				while(child){
					if(child.data){
						buf.push(child.data);
					}else{
						serializeToString(child,buf,isHTML,nodeFilter,visibleNamespaces);
					}
					child = child.nextSibling;
				}
			}else
			{
				while(child){
					serializeToString(child,buf,isHTML,nodeFilter,visibleNamespaces);
					child = child.nextSibling;
				}
			}
			buf.push('</',nodeName,'>');
		}else{
			buf.push('/>');
		}
		// remove added visible namespaces
		//visibleNamespaces.length = startVisibleNamespaces;
		return;
	case DOCUMENT_NODE:
	case DOCUMENT_FRAGMENT_NODE:
		var child = node.firstChild;
		while(child){
			serializeToString(child,buf,isHTML,nodeFilter,visibleNamespaces);
			child = child.nextSibling;
		}
		return;
	case ATTRIBUTE_NODE:
		return buf.push(' ',node.name,'="',node.value.replace(/[<&"]/g,_xmlEncoder),'"');
	case TEXT_NODE:
		return buf.push(node.data.replace(/[<&]/g,_xmlEncoder));
	case CDATA_SECTION_NODE:
		return buf.push( '<![CDATA[',node.data,']]>');
	case COMMENT_NODE:
		return buf.push( "<!--",node.data,"-->");
	case DOCUMENT_TYPE_NODE:
		var pubid = node.publicId;
		var sysid = node.systemId;
		buf.push('<!DOCTYPE ',node.name);
		if(pubid){
			buf.push(' PUBLIC "',pubid);
			if (sysid && sysid!='.') {
				buf.push( '" "',sysid);
			}
			buf.push('">');
		}else if(sysid && sysid!='.'){
			buf.push(' SYSTEM "',sysid,'">');
		}else{
			var sub = node.internalSubset;
			if(sub){
				buf.push(" [",sub,"]");
			}
			buf.push(">");
		}
		return;
	case PROCESSING_INSTRUCTION_NODE:
		return buf.push( "<?",node.target," ",node.data,"?>");
	case ENTITY_REFERENCE_NODE:
		return buf.push( '&',node.nodeName,';');
	//case ENTITY_NODE:
	//case NOTATION_NODE:
	default:
		buf.push('??',node.nodeName);
	}
}
function importNode(doc,node,deep){
	var node2;
	switch (node.nodeType) {
	case ELEMENT_NODE:
		node2 = node.cloneNode(false);
		node2.ownerDocument = doc;
		//var attrs = node2.attributes;
		//var len = attrs.length;
		//for(var i=0;i<len;i++){
			//node2.setAttributeNodeNS(importNode(doc,attrs.item(i),deep));
		//}
	case DOCUMENT_FRAGMENT_NODE:
		break;
	case ATTRIBUTE_NODE:
		deep = true;
		break;
	//case ENTITY_REFERENCE_NODE:
	//case PROCESSING_INSTRUCTION_NODE:
	////case TEXT_NODE:
	//case CDATA_SECTION_NODE:
	//case COMMENT_NODE:
	//	deep = false;
	//	break;
	//case DOCUMENT_NODE:
	//case DOCUMENT_TYPE_NODE:
	//cannot be imported.
	//case ENTITY_NODE:
	//case NOTATION_NODE：
	//can not hit in level3
	//default:throw e;
	}
	if(!node2){
		node2 = node.cloneNode(false);//false
	}
	node2.ownerDocument = doc;
	node2.parentNode = null;
	if(deep){
		var child = node.firstChild;
		while(child){
			node2.appendChild(importNode(doc,child,deep));
			child = child.nextSibling;
		}
	}
	return node2;
}
//
//var _relationMap = {firstChild:1,lastChild:1,previousSibling:1,nextSibling:1,
//					attributes:1,childNodes:1,parentNode:1,documentElement:1,doctype,};
function cloneNode(doc,node,deep){
	var node2 = new node.constructor();
	for(var n in node){
		var v = node[n];
		if(typeof v != 'object' ){
			if(v != node2[n]){
				node2[n] = v;
			}
		}
	}
	if(node.childNodes){
		node2.childNodes = new NodeList();
	}
	node2.ownerDocument = doc;
	switch (node2.nodeType) {
	case ELEMENT_NODE:
		var attrs	= node.attributes;
		var attrs2	= node2.attributes = new NamedNodeMap();
		var len = attrs.length
		attrs2._ownerElement = node2;
		for(var i=0;i<len;i++){
			node2.setAttributeNode(cloneNode(doc,attrs.item(i),true));
		}
		break;;
	case ATTRIBUTE_NODE:
		deep = true;
	}
	if(deep){
		var child = node.firstChild;
		while(child){
			node2.appendChild(cloneNode(doc,child,deep));
			child = child.nextSibling;
		}
	}
	return node2;
}

function __set__(object,key,value){
	object[key] = value
}
//do dynamic
try{
	if(Object.defineProperty){
		Object.defineProperty(LiveNodeList.prototype,'length',{
			get:function(){
				_updateLiveList(this);
				return this.$$length;
			}
		});
		Object.defineProperty(Node.prototype,'textContent',{
			get:function(){
				return getTextContent(this);
			},
			set:function(data){
				switch(this.nodeType){
				case ELEMENT_NODE:
				case DOCUMENT_FRAGMENT_NODE:
					while(this.firstChild){
						this.removeChild(this.firstChild);
					}
					if(data || String(data)){
						this.appendChild(this.ownerDocument.createTextNode(data));
					}
					break;
				default:
					//TODO:
					this.data = data;
					this.value = data;
					this.nodeValue = data;
				}
			}
		})
		
		function getTextContent(node){
			switch(node.nodeType){
			case ELEMENT_NODE:
			case DOCUMENT_FRAGMENT_NODE:
				var buf = [];
				node = node.firstChild;
				while(node){
					if(node.nodeType!==7 && node.nodeType !==8){
						buf.push(getTextContent(node));
					}
					node = node.nextSibling;
				}
				return buf.join('');
			default:
				return node.nodeValue;
			}
		}
		__set__ = function(object,key,value){
			//console.log(value)
			object['$$'+key] = value
		}
	}
}catch(e){//ie8
}

//if(typeof require == 'function'){
	exports.DOMImplementation = DOMImplementation;
	exports.XMLSerializer = XMLSerializer;
//}

},{}],12:[function(require,module,exports){
//[4]   	NameStartChar	   ::=   	":" | [A-Z] | "_" | [a-z] | [#xC0-#xD6] | [#xD8-#xF6] | [#xF8-#x2FF] | [#x370-#x37D] | [#x37F-#x1FFF] | [#x200C-#x200D] | [#x2070-#x218F] | [#x2C00-#x2FEF] | [#x3001-#xD7FF] | [#xF900-#xFDCF] | [#xFDF0-#xFFFD] | [#x10000-#xEFFFF]
//[4a]   	NameChar	   ::=   	NameStartChar | "-" | "." | [0-9] | #xB7 | [#x0300-#x036F] | [#x203F-#x2040]
//[5]   	Name	   ::=   	NameStartChar (NameChar)*
var nameStartChar = /[A-Z_a-z\xC0-\xD6\xD8-\xF6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]///\u10000-\uEFFFF
var nameChar = new RegExp("[\\-\\.0-9"+nameStartChar.source.slice(1,-1)+"\\u00B7\\u0300-\\u036F\\u203F-\\u2040]");
var tagNamePattern = new RegExp('^'+nameStartChar.source+nameChar.source+'*(?:\:'+nameStartChar.source+nameChar.source+'*)?$');
//var tagNamePattern = /^[a-zA-Z_][\w\-\.]*(?:\:[a-zA-Z_][\w\-\.]*)?$/
//var handlers = 'resolveEntity,getExternalSubset,characters,endDocument,endElement,endPrefixMapping,ignorableWhitespace,processingInstruction,setDocumentLocator,skippedEntity,startDocument,startElement,startPrefixMapping,notationDecl,unparsedEntityDecl,error,fatalError,warning,attributeDecl,elementDecl,externalEntityDecl,internalEntityDecl,comment,endCDATA,endDTD,endEntity,startCDATA,startDTD,startEntity'.split(',')

//S_TAG,	S_ATTR,	S_EQ,	S_ATTR_NOQUOT_VALUE
//S_ATTR_SPACE,	S_ATTR_END,	S_TAG_SPACE, S_TAG_CLOSE
var S_TAG = 0;//tag name offerring
var S_ATTR = 1;//attr name offerring 
var S_ATTR_SPACE=2;//attr name end and space offer
var S_EQ = 3;//=space?
var S_ATTR_NOQUOT_VALUE = 4;//attr value(no quot value only)
var S_ATTR_END = 5;//attr value end and no space(quot end)
var S_TAG_SPACE = 6;//(attr value end || tag end ) && (space offer)
var S_TAG_CLOSE = 7;//closed el<el />

function XMLReader(){
	
}

XMLReader.prototype = {
	parse:function(source,defaultNSMap,entityMap){
		var domBuilder = this.domBuilder;
		domBuilder.startDocument();
		_copy(defaultNSMap ,defaultNSMap = {})
		parse(source,defaultNSMap,entityMap,
				domBuilder,this.errorHandler);
		domBuilder.endDocument();
	}
}
function parse(source,defaultNSMapCopy,entityMap,domBuilder,errorHandler){
	function fixedFromCharCode(code) {
		// String.prototype.fromCharCode does not supports
		// > 2 bytes unicode chars directly
		if (code > 0xffff) {
			code -= 0x10000;
			var surrogate1 = 0xd800 + (code >> 10)
				, surrogate2 = 0xdc00 + (code & 0x3ff);

			return String.fromCharCode(surrogate1, surrogate2);
		} else {
			return String.fromCharCode(code);
		}
	}
	function entityReplacer(a){
		var k = a.slice(1,-1);
		if(k in entityMap){
			return entityMap[k]; 
		}else if(k.charAt(0) === '#'){
			return fixedFromCharCode(parseInt(k.substr(1).replace('x','0x')))
		}else{
			errorHandler.error('entity not found:'+a);
			return a;
		}
	}
	function appendText(end){//has some bugs
		if(end>start){
			var xt = source.substring(start,end).replace(/&#?\w+;/g,entityReplacer);
			locator&&position(start);
			domBuilder.characters(xt,0,end-start);
			start = end
		}
	}
	function position(p,m){
		while(p>=lineEnd && (m = linePattern.exec(source))){
			lineStart = m.index;
			lineEnd = lineStart + m[0].length;
			locator.lineNumber++;
			//console.log('line++:',locator,startPos,endPos)
		}
		locator.columnNumber = p-lineStart+1;
	}
	var lineStart = 0;
	var lineEnd = 0;
	var linePattern = /.*(?:\r\n?|\n)|.*$/g
	var locator = domBuilder.locator;
	
	var parseStack = [{currentNSMap:defaultNSMapCopy}]
	var closeMap = {};
	var start = 0;
	while(true){
		try{
			var tagStart = source.indexOf('<',start);
			if(tagStart<0){
				if(!source.substr(start).match(/^\s*$/)){
					var doc = domBuilder.doc;
	    			var text = doc.createTextNode(source.substr(start));
	    			doc.appendChild(text);
	    			domBuilder.currentElement = text;
				}
				return;
			}
			if(tagStart>start){
				appendText(tagStart);
			}
			switch(source.charAt(tagStart+1)){
			case '/':
				var end = source.indexOf('>',tagStart+3);
				var tagName = source.substring(tagStart+2,end);
				var config = parseStack.pop();
				if(end<0){
					
	        		tagName = source.substring(tagStart+2).replace(/[\s<].*/,'');
	        		//console.error('#@@@@@@'+tagName)
	        		errorHandler.error("end tag name: "+tagName+' is not complete:'+config.tagName);
	        		end = tagStart+1+tagName.length;
	        	}else if(tagName.match(/\s</)){
	        		tagName = tagName.replace(/[\s<].*/,'');
	        		errorHandler.error("end tag name: "+tagName+' maybe not complete');
	        		end = tagStart+1+tagName.length;
				}
				//console.error(parseStack.length,parseStack)
				//console.error(config);
				var localNSMap = config.localNSMap;
				var endMatch = config.tagName == tagName;
				var endIgnoreCaseMach = endMatch || config.tagName&&config.tagName.toLowerCase() == tagName.toLowerCase()
		        if(endIgnoreCaseMach){
		        	domBuilder.endElement(config.uri,config.localName,tagName);
					if(localNSMap){
						for(var prefix in localNSMap){
							domBuilder.endPrefixMapping(prefix) ;
						}
					}
					if(!endMatch){
		            	errorHandler.fatalError("end tag name: "+tagName+' is not match the current start tagName:'+config.tagName );
					}
		        }else{
		        	parseStack.push(config)
		        }
				
				end++;
				break;
				// end elment
			case '?':// <?...?>
				locator&&position(tagStart);
				end = parseInstruction(source,tagStart,domBuilder);
				break;
			case '!':// <!doctype,<![CDATA,<!--
				locator&&position(tagStart);
				end = parseDCC(source,tagStart,domBuilder,errorHandler);
				break;
			default:
				locator&&position(tagStart);
				var el = new ElementAttributes();
				var currentNSMap = parseStack[parseStack.length-1].currentNSMap;
				//elStartEnd
				var end = parseElementStartPart(source,tagStart,el,currentNSMap,entityReplacer,errorHandler);
				var len = el.length;
				
				
				if(!el.closed && fixSelfClosed(source,end,el.tagName,closeMap)){
					el.closed = true;
					if(!entityMap.nbsp){
						errorHandler.warning('unclosed xml attribute');
					}
				}
				if(locator && len){
					var locator2 = copyLocator(locator,{});
					//try{//attribute position fixed
					for(var i = 0;i<len;i++){
						var a = el[i];
						position(a.offset);
						a.locator = copyLocator(locator,{});
					}
					//}catch(e){console.error('@@@@@'+e)}
					domBuilder.locator = locator2
					if(appendElement(el,domBuilder,currentNSMap)){
						parseStack.push(el)
					}
					domBuilder.locator = locator;
				}else{
					if(appendElement(el,domBuilder,currentNSMap)){
						parseStack.push(el)
					}
				}
				
				
				
				if(el.uri === 'http://www.w3.org/1999/xhtml' && !el.closed){
					end = parseHtmlSpecialContent(source,end,el.tagName,entityReplacer,domBuilder)
				}else{
					end++;
				}
			}
		}catch(e){
			errorHandler.error('element parse error: '+e)
			//errorHandler.error('element parse error: '+e);
			end = -1;
			//throw e;
		}
		if(end>start){
			start = end;
		}else{
			//TODO: 这里有可能sax回退，有位置错误风险
			appendText(Math.max(tagStart,start)+1);
		}
	}
}
function copyLocator(f,t){
	t.lineNumber = f.lineNumber;
	t.columnNumber = f.columnNumber;
	return t;
}

/**
 * @see #appendElement(source,elStartEnd,el,selfClosed,entityReplacer,domBuilder,parseStack);
 * @return end of the elementStartPart(end of elementEndPart for selfClosed el)
 */
function parseElementStartPart(source,start,el,currentNSMap,entityReplacer,errorHandler){
	var attrName;
	var value;
	var p = ++start;
	var s = S_TAG;//status
	while(true){
		var c = source.charAt(p);
		switch(c){
		case '=':
			if(s === S_ATTR){//attrName
				attrName = source.slice(start,p);
				s = S_EQ;
			}else if(s === S_ATTR_SPACE){
				s = S_EQ;
			}else{
				//fatalError: equal must after attrName or space after attrName
				throw new Error('attribute equal must after attrName');
			}
			break;
		case '\'':
		case '"':
			if(s === S_EQ || s === S_ATTR //|| s == S_ATTR_SPACE
				){//equal
				if(s === S_ATTR){
					errorHandler.warning('attribute value must after "="')
					attrName = source.slice(start,p)
				}
				start = p+1;
				p = source.indexOf(c,start)
				if(p>0){
					value = source.slice(start,p).replace(/&#?\w+;/g,entityReplacer);
					el.add(attrName,value,start-1);
					s = S_ATTR_END;
				}else{
					//fatalError: no end quot match
					throw new Error('attribute value no end \''+c+'\' match');
				}
			}else if(s == S_ATTR_NOQUOT_VALUE){
				value = source.slice(start,p).replace(/&#?\w+;/g,entityReplacer);
				//console.log(attrName,value,start,p)
				el.add(attrName,value,start);
				//console.dir(el)
				errorHandler.warning('attribute "'+attrName+'" missed start quot('+c+')!!');
				start = p+1;
				s = S_ATTR_END
			}else{
				//fatalError: no equal before
				throw new Error('attribute value must after "="');
			}
			break;
		case '/':
			switch(s){
			case S_TAG:
				el.setTagName(source.slice(start,p));
			case S_ATTR_END:
			case S_TAG_SPACE:
			case S_TAG_CLOSE:
				s =S_TAG_CLOSE;
				el.closed = true;
			case S_ATTR_NOQUOT_VALUE:
			case S_ATTR:
			case S_ATTR_SPACE:
				break;
			//case S_EQ:
			default:
				throw new Error("attribute invalid close char('/')")
			}
			break;
		case ''://end document
			//throw new Error('unexpected end of input')
			errorHandler.error('unexpected end of input');
			if(s == S_TAG){
				el.setTagName(source.slice(start,p));
			}
			return p;
		case '>':
			switch(s){
			case S_TAG:
				el.setTagName(source.slice(start,p));
			case S_ATTR_END:
			case S_TAG_SPACE:
			case S_TAG_CLOSE:
				break;//normal
			case S_ATTR_NOQUOT_VALUE://Compatible state
			case S_ATTR:
				value = source.slice(start,p);
				if(value.slice(-1) === '/'){
					el.closed  = true;
					value = value.slice(0,-1)
				}
			case S_ATTR_SPACE:
				if(s === S_ATTR_SPACE){
					value = attrName;
				}
				if(s == S_ATTR_NOQUOT_VALUE){
					errorHandler.warning('attribute "'+value+'" missed quot(")!!');
					el.add(attrName,value.replace(/&#?\w+;/g,entityReplacer),start)
				}else{
					if(currentNSMap[''] !== 'http://www.w3.org/1999/xhtml' || !value.match(/^(?:disabled|checked|selected)$/i)){
						errorHandler.warning('attribute "'+value+'" missed value!! "'+value+'" instead!!')
					}
					el.add(value,value,start)
				}
				break;
			case S_EQ:
				throw new Error('attribute value missed!!');
			}
//			console.log(tagName,tagNamePattern,tagNamePattern.test(tagName))
			return p;
		/*xml space '\x20' | #x9 | #xD | #xA; */
		case '\u0080':
			c = ' ';
		default:
			if(c<= ' '){//space
				switch(s){
				case S_TAG:
					el.setTagName(source.slice(start,p));//tagName
					s = S_TAG_SPACE;
					break;
				case S_ATTR:
					attrName = source.slice(start,p)
					s = S_ATTR_SPACE;
					break;
				case S_ATTR_NOQUOT_VALUE:
					var value = source.slice(start,p).replace(/&#?\w+;/g,entityReplacer);
					errorHandler.warning('attribute "'+value+'" missed quot(")!!');
					el.add(attrName,value,start)
				case S_ATTR_END:
					s = S_TAG_SPACE;
					break;
				//case S_TAG_SPACE:
				//case S_EQ:
				//case S_ATTR_SPACE:
				//	void();break;
				//case S_TAG_CLOSE:
					//ignore warning
				}
			}else{//not space
//S_TAG,	S_ATTR,	S_EQ,	S_ATTR_NOQUOT_VALUE
//S_ATTR_SPACE,	S_ATTR_END,	S_TAG_SPACE, S_TAG_CLOSE
				switch(s){
				//case S_TAG:void();break;
				//case S_ATTR:void();break;
				//case S_ATTR_NOQUOT_VALUE:void();break;
				case S_ATTR_SPACE:
					var tagName =  el.tagName;
					if(currentNSMap[''] !== 'http://www.w3.org/1999/xhtml' || !attrName.match(/^(?:disabled|checked|selected)$/i)){
						errorHandler.warning('attribute "'+attrName+'" missed value!! "'+attrName+'" instead2!!')
					}
					el.add(attrName,attrName,start);
					start = p;
					s = S_ATTR;
					break;
				case S_ATTR_END:
					errorHandler.warning('attribute space is required"'+attrName+'"!!')
				case S_TAG_SPACE:
					s = S_ATTR;
					start = p;
					break;
				case S_EQ:
					s = S_ATTR_NOQUOT_VALUE;
					start = p;
					break;
				case S_TAG_CLOSE:
					throw new Error("elements closed character '/' and '>' must be connected to");
				}
			}
		}//end outer switch
		//console.log('p++',p)
		p++;
	}
}
/**
 * @return true if has new namespace define
 */
function appendElement(el,domBuilder,currentNSMap){
	var tagName = el.tagName;
	var localNSMap = null;
	//var currentNSMap = parseStack[parseStack.length-1].currentNSMap;
	var i = el.length;
	while(i--){
		var a = el[i];
		var qName = a.qName;
		var value = a.value;
		var nsp = qName.indexOf(':');
		if(nsp>0){
			var prefix = a.prefix = qName.slice(0,nsp);
			var localName = qName.slice(nsp+1);
			var nsPrefix = prefix === 'xmlns' && localName
		}else{
			localName = qName;
			prefix = null
			nsPrefix = qName === 'xmlns' && ''
		}
		//can not set prefix,because prefix !== ''
		a.localName = localName ;
		//prefix == null for no ns prefix attribute 
		if(nsPrefix !== false){//hack!!
			if(localNSMap == null){
				localNSMap = {}
				//console.log(currentNSMap,0)
				_copy(currentNSMap,currentNSMap={})
				//console.log(currentNSMap,1)
			}
			currentNSMap[nsPrefix] = localNSMap[nsPrefix] = value;
			a.uri = 'http://www.w3.org/2000/xmlns/'
			domBuilder.startPrefixMapping(nsPrefix, value) 
		}
	}
	var i = el.length;
	while(i--){
		a = el[i];
		var prefix = a.prefix;
		if(prefix){//no prefix attribute has no namespace
			if(prefix === 'xml'){
				a.uri = 'http://www.w3.org/XML/1998/namespace';
			}if(prefix !== 'xmlns'){
				a.uri = currentNSMap[prefix || '']
				
				//{console.log('###'+a.qName,domBuilder.locator.systemId+'',currentNSMap,a.uri)}
			}
		}
	}
	var nsp = tagName.indexOf(':');
	if(nsp>0){
		prefix = el.prefix = tagName.slice(0,nsp);
		localName = el.localName = tagName.slice(nsp+1);
	}else{
		prefix = null;//important!!
		localName = el.localName = tagName;
	}
	//no prefix element has default namespace
	var ns = el.uri = currentNSMap[prefix || ''];
	domBuilder.startElement(ns,localName,tagName,el);
	//endPrefixMapping and startPrefixMapping have not any help for dom builder
	//localNSMap = null
	if(el.closed){
		domBuilder.endElement(ns,localName,tagName);
		if(localNSMap){
			for(prefix in localNSMap){
				domBuilder.endPrefixMapping(prefix) 
			}
		}
	}else{
		el.currentNSMap = currentNSMap;
		el.localNSMap = localNSMap;
		//parseStack.push(el);
		return true;
	}
}
function parseHtmlSpecialContent(source,elStartEnd,tagName,entityReplacer,domBuilder){
	if(/^(?:script|textarea)$/i.test(tagName)){
		var elEndStart =  source.indexOf('</'+tagName+'>',elStartEnd);
		var text = source.substring(elStartEnd+1,elEndStart);
		if(/[&<]/.test(text)){
			if(/^script$/i.test(tagName)){
				//if(!/\]\]>/.test(text)){
					//lexHandler.startCDATA();
					domBuilder.characters(text,0,text.length);
					//lexHandler.endCDATA();
					return elEndStart;
				//}
			}//}else{//text area
				text = text.replace(/&#?\w+;/g,entityReplacer);
				domBuilder.characters(text,0,text.length);
				return elEndStart;
			//}
			
		}
	}
	return elStartEnd+1;
}
function fixSelfClosed(source,elStartEnd,tagName,closeMap){
	//if(tagName in closeMap){
	var pos = closeMap[tagName];
	if(pos == null){
		//console.log(tagName)
		pos =  source.lastIndexOf('</'+tagName+'>')
		if(pos<elStartEnd){//忘记闭合
			pos = source.lastIndexOf('</'+tagName)
		}
		closeMap[tagName] =pos
	}
	return pos<elStartEnd;
	//} 
}
function _copy(source,target){
	for(var n in source){target[n] = source[n]}
}
function parseDCC(source,start,domBuilder,errorHandler){//sure start with '<!'
	var next= source.charAt(start+2)
	switch(next){
	case '-':
		if(source.charAt(start + 3) === '-'){
			var end = source.indexOf('-->',start+4);
			//append comment source.substring(4,end)//<!--
			if(end>start){
				domBuilder.comment(source,start+4,end-start-4);
				return end+3;
			}else{
				errorHandler.error("Unclosed comment");
				return -1;
			}
		}else{
			//error
			return -1;
		}
	default:
		if(source.substr(start+3,6) == 'CDATA['){
			var end = source.indexOf(']]>',start+9);
			domBuilder.startCDATA();
			domBuilder.characters(source,start+9,end-start-9);
			domBuilder.endCDATA() 
			return end+3;
		}
		//<!DOCTYPE
		//startDTD(java.lang.String name, java.lang.String publicId, java.lang.String systemId) 
		var matchs = split(source,start);
		var len = matchs.length;
		if(len>1 && /!doctype/i.test(matchs[0][0])){
			var name = matchs[1][0];
			var pubid = len>3 && /^public$/i.test(matchs[2][0]) && matchs[3][0]
			var sysid = len>4 && matchs[4][0];
			var lastMatch = matchs[len-1]
			domBuilder.startDTD(name,pubid && pubid.replace(/^(['"])(.*?)\1$/,'$2'),
					sysid && sysid.replace(/^(['"])(.*?)\1$/,'$2'));
			domBuilder.endDTD();
			
			return lastMatch.index+lastMatch[0].length
		}
	}
	return -1;
}



function parseInstruction(source,start,domBuilder){
	var end = source.indexOf('?>',start);
	if(end){
		var match = source.substring(start,end).match(/^<\?(\S*)\s*([\s\S]*?)\s*$/);
		if(match){
			var len = match[0].length;
			domBuilder.processingInstruction(match[1], match[2]) ;
			return end+2;
		}else{//error
			return -1;
		}
	}
	return -1;
}

/**
 * @param source
 */
function ElementAttributes(source){
	
}
ElementAttributes.prototype = {
	setTagName:function(tagName){
		if(!tagNamePattern.test(tagName)){
			throw new Error('invalid tagName:'+tagName)
		}
		this.tagName = tagName
	},
	add:function(qName,value,offset){
		if(!tagNamePattern.test(qName)){
			throw new Error('invalid attribute:'+qName)
		}
		this[this.length++] = {qName:qName,value:value,offset:offset}
	},
	length:0,
	getLocalName:function(i){return this[i].localName},
	getLocator:function(i){return this[i].locator},
	getQName:function(i){return this[i].qName},
	getURI:function(i){return this[i].uri},
	getValue:function(i){return this[i].value}
//	,getIndex:function(uri, localName)){
//		if(localName){
//			
//		}else{
//			var qName = uri
//		}
//	},
//	getValue:function(){return this.getValue(this.getIndex.apply(this,arguments))},
//	getType:function(uri,localName){}
//	getType:function(i){},
}




function _set_proto_(thiz,parent){
	thiz.__proto__ = parent;
	return thiz;
}
if(!(_set_proto_({},_set_proto_.prototype) instanceof _set_proto_)){
	_set_proto_ = function(thiz,parent){
		function p(){};
		p.prototype = parent;
		p = new p();
		for(parent in thiz){
			p[parent] = thiz[parent];
		}
		return p;
	}
}

function split(source,start){
	var match;
	var buf = [];
	var reg = /'[^']+'|"[^"]+"|[^\s<>\/=]+=?|(\/?\s*>|<)/g;
	reg.lastIndex = start;
	reg.exec(source);//skip <
	while(match = reg.exec(source)){
		buf.push(match);
		if(match[1])return buf;
	}
}

exports.XMLReader = XMLReader;


},{}],13:[function(require,module,exports){
'use strict';

var isEmpty = require('lodash.isempty');
var flatten = require('lodash.flatten');

var vg = require('./libraries/vg/vg');
var img = require('./libraries/img/img');

var g = {};

// Commands
function importCommands(module) {
    for (var k in module) {
        g[k] = module[k];
    }
}

for (var k in vg) {
    g[k] = vg[k];
}
delete g['delete'];

for (var k in img) {
    g[k] = img[k];
}

importCommands(require('./libraries/math'));
importCommands(require('./libraries/string'));
importCommands(require('./libraries/list'));
importCommands(require('./libraries/data'));
importCommands(require('./libraries/image'));
importCommands(require('./libraries/graphics'));
importCommands(require('./libraries/easing'));

g.importSVG = function (svgString) {
    return g.svg.parseString(svgString);
};

g.importImage = function (image) {
    var layer = g.Layer.fromImage(image);
    return new g.Img(layer.toCanvas());
};

g.importText = function (string) {
    return string ? String(string) : '';
};

// Split the row, taking quotes into account.
function splitRow(s, delimiter) {
    var row = [], c, col = '', i, inString = false;
    s = s.trim();
    for (i = 0; i < s.length; i += 1) {
        c = s[i];
        if (c === '"') {
            if (s[i+1] === '"') {
                col += '"';
                i += 1;
            } else {
                inString = !inString;
            }
        } else if (c === delimiter) {
            if (!inString) {
                row.push(col);
                col = '';
            } else {
                col += c;
            }
        } else {
            col += c;
        }
    }
    row.push(col);
    return row;
}

g.importCSV = function (csvString, delimiter) {
    var csvRows, header;
    delimiter = delimiter || ',';

    if (!csvString) return null;
    csvRows = csvString.split(/\r\n|\r|\n/g);
    header = splitRow(csvRows[0], delimiter);
    csvRows = csvRows.slice(1);
    
    var row, rows = [];
    var m, sr, col, index;
    for (var i = 0; i < csvRows.length; i += 1) {
        row = csvRows[i];
        if (!isEmpty(row)) {
            m = {};
            sr = splitRow(row, delimiter);
            for (index = 0; index < sr.length; index += 1) {
                col = sr[index];
                m[header[index]] = isNaN(col) ? col : parseFloat(col);
            }
            rows.push(m);
        }
    }
    return rows;
};

g.merge = function () {
    var args = flatten(arguments);
    if (Array.isArray(args)) {
        var objects = [];
        for (var i = 0; i < args.length; i += 1) {
            if (!isEmpty(args[i])) {
                objects.push(args[i]);
            }
        }
        if (objects.length > 0) {
            var o = objects[0];
            if (o && (o.commands || o.shapes || o.fontFamily)) {
                return vg.merge(objects);
            } else if (o instanceof img.Img) {
                return img.merge(objects);
            }
        }
    }
    return null;
};

g.mix = function (a, b, t) {
    t = t !== undefined ? t : 0.5;
    if (typeof a === 'number') {
        return (a * (1 - t)) + (b * t);
    } else if (typeof a === 'object') {
        var result = {};
        var keys = Object.keys(a);
        for (var i = 0, n = keys.length; i < n; i += 1) {
            var k = keys[i];
            var va = a[k];
            var vb = b[k];
            if (va !== undefined && vb !== undefined) {
                result[k] = g.mix(va, vb, t);
            }
        }
        return result;
    } else {
        return 0;
    }
};

module.exports = g;

},{"./libraries/data":14,"./libraries/easing":16,"./libraries/graphics":17,"./libraries/image":18,"./libraries/img/img":22,"./libraries/list":25,"./libraries/math":26,"./libraries/string":27,"./libraries/vg/vg":49,"lodash.flatten":3,"lodash.isempty":5}],14:[function(require,module,exports){
'use strict';

var values = require('lodash.values');
var groupBy = require('lodash.groupby');

var list = require('./list');

var g = {};

// Convert values from one range to another
g.convert = function (v, inMin, inMax, outMin, outMax) {
    var argLength = arguments.length;
    if (argLength === 2) {
        var d = arguments[1];
        inMin = d.inMin;
        inMax = d.inMax;
        outMin = d.outMin;
        outMax = d.outMax;
    } else if (argLength === 3) {
        inMin = arguments[1][0];
        inMax = arguments[1][1];
        outMin = arguments[2][0];
        outMax = arguments[2][1];
    }
    try {
        v = (v - inMin) / (inMax - inMin);
    } catch (e) {
        v = inMin;
    }
    // Convert value to target range.
    return outMin + v * (outMax - outMin);
};

g.filterData = function (data, key, op, value) {
    var i, l, row, obj;
    if (value === null || value === undefined) {
        return data;
    }
    var results = [];
    if (op === '==') {
        for (i = 0, l = data.length; i < l; i++) {
            row = data[i];
            obj = row[key];
            if (obj == value) { // jshint ignore:line
                results.push(row);
            }
        }
    } else if (op === '!=') {
        for (i = 0, l = data.length; i < l; i++) {
            row = data[i];
            obj = row[key];
            if (obj != value) { // jshint ignore:line
                results.push(row);
            }
        }
    } else if (op === '>') {
        for (i = 0, l = data.length; i < l; i++) {
            row = data[i];
            obj = row[key];
            if (obj > value) {
                results.push(row);
            }
        }
    } else if (op === '>=') {
        for (i = 0, l = data.length; i < l; i++) {
            row = data[i];
            obj = row[key];
            if (obj >= value) {
                results.push(row);
            }
        }
    } else if (op === '<') {
        for (i = 0, l = data.length; i < l; i++) {
            row = data[i];
            obj = row[key];
            if (obj < value) {
                results.push(row);
            }
        }
    } else if (op === '<=') {
        for (i = 0, l = data.length; i < l; i++) {
            row = data[i];
            obj = row[key];
            if (obj <= value) {
                results.push(row);
            }
        }
    } else {
        throw new Error('Invalid op ' + op);
    }
    return results;
};

g.groupBy = function (data, key) {
    return values(groupBy(data, key));
};

/* // Draw a legend. ==> rename to axis?
g.legend = function (scale, position, direction, nTicks) {
    var ticks = g.ticks(scale, nTicks),
        group = new vg.Group(),
        p = new vg.Path(),
        textOptions = {fontSize: 9, align: 'center'},
        t,
        i,
        v;
    p.moveTo(scale.outMax, position.y);
    p.lineTo(scale.outMin, position.y);
    p.stroke = 'black';
    group.add(p);
    for (i = 0; i < ticks.length; i += 1) {
        v = g.convert(scale, ticks[i]);
        p.moveTo(v, position.y);
        p.lineTo(v, position.y + 5);
        t = new g.Text('' + ticks[i], v, position.y + 15, textOptions);
        group.add(t);
    }
    return group;
}; */

g.keys = function (data) {
    var allKeys = [];
    for (var i = 0; i < data.length; i++) {
        allKeys = allKeys.concat(Object.keys(data[i]));
    }
    return list.distinct(allKeys);
};

g.lookup = function (table, key) {
    var obj, v;
    obj = table;
    // First try to lookup the key as-is.
    v = obj[key];
    if (v !== undefined) {
        if (typeof v === 'function') {
            v = v.call(obj);
        }
        return v;
    }
    var token, tokens = key.split('.');
    for (var i = 0; i < tokens.length; i += 1) {
        token = tokens[i];
        if (!obj) { continue; }
        if (typeof obj[token] === 'function') {
            v = obj[token];
            obj = v.call(obj);
        } else {
            obj = obj[token];
        }
    }
    return obj;
};

// Create a scale that maps values from the input domain to the output range.
g.dataScale = function (domain, outMin, outMax) {
    return {domain: domain, outMin: outMin, outMax: outMax};
};


// Generate about n values for the given scale.
g.ticks = function (min, max, n) {
    n = n !== undefined ? n : 10;

    var span = max - min,
        step = Math.pow(10, Math.floor(Math.log(span / n) / Math.LN10)),
        err = n / span * step,
        ticks = [],
        i;

    if (err <= 0.15) {
        step *= 10;
    } else if (err <= 0.35) {
        step *= 5;
    } else if (err <= 0.75) {
        step *= 2;
    }

    min = Math.ceil(min / step) * step;
    max = Math.floor(max / step) * step + (step * 0.5);

    for (i = min; i < max; i += step) {
        ticks.push(i);
    }

    return ticks;
};

module.exports = g;

},{"./list":25,"lodash.groupby":4,"lodash.values":7}],15:[function(require,module,exports){
/* jshint eqeqeq:false */

'use strict';

// Equality functionality taken from node.js' (http://nodejs.org) assert module:
// https://github.com/joyent/node/blob/master/lib/assert.js

function isBuffer() {
    return false;
}

function isObject(arg) {
    return typeof arg === 'object' && arg !== null;
}

function objectToString(o) {
    return Object.prototype.toString.call(o);
}

function isRegExp(re) {
    return isObject(re) && objectToString(re) === '[object RegExp]';
}

function isDate(d) {
    return isObject(d) && objectToString(d) === '[object Date]';
}

function isNullOrUndefined(arg) {
    return (arg === null || arg === undefined);
}

var util = {
    isObject: isObject,
    isRegExp: isRegExp,
    isDate: isDate,
    isNullOrUndefined: isNullOrUndefined,
    isBuffer: isBuffer
};

var pSlice = Array.prototype.slice;
var deepEqual = {};

var isArguments, _deepEqual, objEquiv;

_deepEqual = function (actual, expected) {
    // 7.1. All identical values are equivalent, as determined by ===.
    if (actual === expected) {
        return true;
    } else if (util.isBuffer(actual) && util.isBuffer(expected)) {
        if (actual.length !== expected.length) return false;

        for (var i = 0; i < actual.length; i++) {
            if (actual[i] !== expected[i]) return false;
        }

        return true;

    // 7.2. If the expected value is a Date object, the actual value is
    // equivalent if it is also a Date object that refers to the same time.
    } else if (util.isDate(actual) && util.isDate(expected)) {
        return actual.getTime() === expected.getTime();

    // 7.3 If the expected value is a RegExp object, the actual value is
    // equivalent if it is also a RegExp object with the same source and
    // properties (`global`, `multiline`, `lastIndex`, `ignoreCase`).
    } else if (util.isRegExp(actual) && util.isRegExp(expected)) {
        return actual.source === expected.source &&
            actual.global === expected.global &&
            actual.multiline === expected.multiline &&
            actual.lastIndex === expected.lastIndex &&
            actual.ignoreCase === expected.ignoreCase;

    // 7.4. Other pairs that do not both pass typeof value == 'object',
    // equivalence is determined by ==.
    } else if (!util.isObject(actual) && !util.isObject(expected)) {
        return actual == expected;

    // 7.5 For all other Object pairs, including Array objects, equivalence is
    // determined by having the same number of owned properties (as verified
    // with Object.prototype.hasOwnProperty.call), the same set of keys
    // (although not necessarily the same order), equivalent values for every
    // corresponding key, and an identical 'prototype' property. Note: this
    // accounts for both named and indexed properties on Arrays.
    } else {
        return objEquiv(actual, expected);
    }
};

deepEqual.deepEqual = _deepEqual;

isArguments = function (object) {
    return Object.prototype.toString.call(object) === '[object Arguments]';
};

objEquiv = function (a, b) {
    if (util.isNullOrUndefined(a) || util.isNullOrUndefined(b))
        return false;
    // an identical 'prototype' property.
    if (a.prototype !== b.prototype) return false;
    //~~~I've managed to break Object.keys through screwy arguments passing.
    //   Converting to array solves the problem.
    var aIsArgs = isArguments(a),
        bIsArgs = isArguments(b);
    if ((aIsArgs && !bIsArgs) || (!aIsArgs && bIsArgs))
        return false;
    if (aIsArgs) {
        a = pSlice.call(a);
        b = pSlice.call(b);
        return _deepEqual(a, b);
    }
    var ka, kb, key, i;
    try {
        ka = Object.keys(a);
        kb = Object.keys(b);
    } catch (e) {//happens when one is a string literal and the other isn't
        return false;
    }
    // having the same number of owned properties (keys incorporates
    // hasOwnProperty)
    if (ka.length !== kb.length)
        return false;
    //the same set of keys (although not necessarily the same order),
    ka.sort();
    kb.sort();
    //~~~cheap key test
    for (i = ka.length - 1; i >= 0; i--) {
        if (ka[i] != kb[i])
            return false;
    }
    //equivalent values for every corresponding key, and
    //~~~possibly expensive deep test
    for (i = ka.length - 1; i >= 0; i--) {
        key = ka[i];
        if (!_deepEqual(a[key], b[key])) return false;
    }
    return true;
};

module.exports = deepEqual;
},{}],16:[function(require,module,exports){
'use strict';

// Easing functions in javascript ported from jQuery Easing Plugin:
// https://github.com/gdsmith/jquery.easing
// t: current time, b: beginning value, c: change in value, d: duration

var g = {};

g.easeInQuad = function (t, b, c, d) {
    return c * (t /= d) * t + b;
};

g.easeOutQuad = function (t, b, c, d) {
    return -c * (t /= d) * (t - 2) + b;
};

g.easeInOutQuad = function (t, b, c, d) {
    if ((t /= d / 2) < 1) { return c / 2 * t * t + b; }
    return -c / 2 * ((--t) * (t - 2) - 1) + b;
};

g.easeInCubic = function (t, b, c, d) {
    return c * (t /= d) * t * t + b;
};

g.easeOutCubic = function (t, b, c, d) {
    return c * ((t = t / d - 1) * t * t + 1) + b;
};

g.easeInOutCubic = function (t, b, c, d) {
    if ((t /= d / 2) < 1) { return c / 2 * t * t * t + b; }
    return c / 2 * ((t -= 2) * t * t + 2) + b;
};

g.easeInQuart = function (t, b, c, d) {
    return c * (t /= d) * t * t * t + b;
};

g.easeOutQuart = function (t, b, c, d) {
    return -c * ((t = t / d - 1) * t * t * t - 1) + b;
};

g.easeInOutQuart = function (t, b, c, d) {
    if ((t /= d / 2) < 1) { return c / 2 * t * t * t * t + b; }
    return -c / 2 * ((t -= 2) * t * t * t - 2) + b;
};

g.easeInQuint = function (t, b, c, d) {
    return c * (t /= d) * t * t * t * t + b;
};

g.easeOutQuint = function (t, b, c, d) {
    return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
};

g.easeInOutQuint = function (t, b, c, d) {
    if ((t /= d / 2) < 1) { return c / 2 * t * t * t * t * t + b; }
    return c / 2 * ((t -= 2) * t * t * t * t + 2) + b;
};

g.easeInSine = function (t, b, c, d) {
    return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
};

g.easeOutSine = function (t, b, c, d) {
    return c * Math.sin(t / d * (Math.PI / 2)) + b;
};

g.easeInOutSine = function (t, b, c, d) {
    return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
};

g.easeInExpo = function (t, b, c, d) {
    return (t === 0) ? b : c * Math.pow(2, 10 * (t / d - 1)) + b;
};

g.easeOutExpo = function (t, b, c, d) {
    return (t === d) ? b + c : c * (-Math.pow(2, -10 * t / d) + 1) + b;
};

g.easeInOutExpo = function (t, b, c, d) {
    if (t === 0) { return b; }
    if (t === d) { return b + c; }
    if ((t /= d / 2) < 1) { return c / 2 * Math.pow(2, 10 * (t - 1)) + b; }
    return c / 2 * (-Math.pow(2, -10 * --t) + 2) + b;
};

g.easeInCirc = function (t, b, c, d) {
    return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b;
};

g.easeOutCirc = function (t, b, c, d) {
    return c * Math.sqrt(1 - (t = t / d - 1) * t) + b;
};

g.easeInOutCirc = function (t, b, c, d) {
    if ((t /= d / 2) < 1) { return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b; }
    return c / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b;
};

g.easeInElastic = function (t, b, c, d) {
    var s = 1.70158;
    var p = 0;
    var a = c;
    if (t === 0) { return b; }
    if ((t /= d) === 1) { return b + c; }
    if (!p) p = d * 0.3;
    if (a < Math.abs(c)) {
        a = c;
        s = p / 4;
    }
    else {
        s = p / (2 * Math.PI) * Math.asin(c / a);
    }
    return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
};

g.easeOutElastic = function (t, b, c, d) {
    var s = 1.70158;
    var p = 0;
    var a = c;
    if (t === 0) { return b; }
    if ((t /= d) === 1) { return b + c; }
    if (!p) p = d * 0.3;
    if (a < Math.abs(c)) {
        a = c;
        s = p / 4;
    }
    else {
        s = p / (2 * Math.PI) * Math.asin(c / a);
    }
    return a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b;
};

g.easeInOutElastic = function (t, b, c, d) {
    var s = 1.70158;
    var p = 0;
    var a = c;
    if (t === 0) { return b; }
    if ((t /= d / 2) === 2) { return b + c; }
    if (!p) p = d * (0.3 * 1.5);
    if (a < Math.abs(c)) {
        a = c;
        s = p / 4;
    }
    else {
        s = p / (2 * Math.PI) * Math.asin(c / a);
    }
    if (t < 1) { return -0.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b; }
    return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p) * 0.5 + c + b;
};

g.easeInBack = function (t, b, c, d, s) {
    if (s === undefined) {
        s = 1.70158;
    }
    return c * (t /= d) * t * ((s + 1) * t - s) + b;
};

g.easeOutBack = function (t, b, c, d, s) {
    if (s === undefined) {
        s = 1.70158;
    }
    return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
};

g.easeInOutBack = function (t, b, c, d, s) {
    if (s === undefined) {
        s = 1.70158;
    }
    if ((t /= d / 2) < 1) { return c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b; }
    return c / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b;
};

g.easeInBounce = function (t, b, c, d) {
    return c - g.easeOutBounce(d - t, 0, c, d) + b;
};

g.easeOutBounce = function (t, b, c, d) {
    if ((t /= d) < (1 / 2.75)) {
        return c * (7.5625 * t * t) + b;
    } else if (t < (2 / 2.75)) {
        return c * (7.5625 * (t -= (1.5 / 2.75)) * t + 0.75) + b;
    } else if (t < (2.5 / 2.75)) {
        return c * (7.5625 * (t -= (2.25 / 2.75)) * t + 0.9375) + b;
    } else {
        return c * (7.5625 * (t -= (2.625 / 2.75)) * t + 0.984375) + b;
    }
};

g.easeInOutBounce = function (t, b, c, d) {
    if (t < d / 2) { return g.easeInBounce(t * 2, 0, c, d) * 0.5 + b; }
    return g.easeOutBounce(t * 2 - d, 0, c, d) * 0.5 + c * 0.5 + b;
};

g.easing = function (f) {
    var fn = g[f];
    var args = Array.prototype.slice.call(arguments, 1);
    return fn.apply(null, args);
};

module.exports = g;

},{}],17:[function(require,module,exports){
'use strict';

var vg = require('./vg/vg');
var img = require('./img/img');
var math = require('./math');

var g = {};

g.HORIZONTAL = 'horizontal';
g.VERTICAL = 'vertical';
g.BOTH = 'both';

g.LEFT = 'left';
g.RIGHT = 'right';
g.CENTER = 'center';
g.TOP = 'top';
g.BOTTOM = 'bottom';
g.MIDDLE = 'middle';

function clamp(val, min, max) {
    return Math.min(max, Math.max(min, val));
}

function transformShape(shape, t) {
    return t.transformShape(shape);
}

function transformImage(image, t) {
    return image._transform(t.m);
}

function transform(shape, t) {
    if (shape instanceof vg.Path || shape instanceof vg.Group || shape instanceof vg.Text || ((shape.x !== undefined && shape.y !== undefined))) {
        return transformShape(shape, t);
    } else if (Array.isArray(shape)) {
        var l = [];
        for (var i = 0; i < shape.length; i += 1) {
            l.push(transform(shape[i], t));
        }
        return l;
    } else if (shape instanceof img.Img) {
        return transformImage(shape, t);
    }
}

g.align = function (shape, position, hAlign, vAlign) {
    if (!shape) {
        return;
    }
    var dx, dy, t,
        x = position.x,
        y = position.y,
        bounds = vg.bounds(shape);
    if (hAlign === g.LEFT) {
        dx = x - bounds.x;
    } else if (hAlign === g.RIGHT) {
        dx = x - bounds.x - bounds.width;
    } else if (hAlign === g.CENTER) {
        dx = x - bounds.x - bounds.width / 2;
    } else {
        dx = 0;
    }
    if (vAlign === g.TOP) {
        dy = y - bounds.y;
    } else if (vAlign === g.BOTTOM) {
        dy = y - bounds.y - bounds.height;
    } else if (vAlign === g.MIDDLE) {
        dy = y - bounds.y - bounds.height / 2;
    } else {
        dy = 0;
    }

    t = new vg.Transform().translate(dx, dy);
    return transform(shape, t);
};

g.colorize = function (shape, options) {
    var args = arguments;
    if (typeof options !== 'object' || options instanceof vg.Color) {
        options = {};
        if (args[1] !== undefined) { options.fill = args[1]; }
        if (args[2] !== undefined) { options.stroke = args[2]; }
        if (args[3] !== undefined) { options.strokeWidth = args[3]; }
    }
    if (shape instanceof vg.Path || shape instanceof vg.Group) {
        return shape.colorize(options);
    } else if (shape instanceof img.Img || shape instanceof vg.Text) {
        if (options.fill || options.fill === 0) {
            return shape.colorize(options.fill);
        } else {
            throw new Error('No color given');
        }
    }
};

g.copy = function (shape, copies, order, translate, rotate, scale) {
    var i, t, j, op, fn,
        shapes = [],
        tx = 0,
        ty = 0,
        r = 0,
        sx = 1.0,
        sy = 1.0,
        isListOfPoints = false;

    if (shape instanceof vg.Path || shape instanceof vg.Group || shape instanceof vg.Text) {
        fn = transformShape;
    } else if (Array.isArray(shape) && shape.length > 0 && shape[0].x !== undefined && shape[0].y !== undefined) {
        isListOfPoints = true;
        fn = transformShape;
    } else if (shape instanceof img.Img) {
        fn = transformImage;
    }

    for (i = 0; i < copies; i += 1) {
        t = new vg.Transform();
        for (j = 0; j < order.length; j += 1) {
            op = order[j];
            if (op === 't') {
                t = t.translate(tx, ty);
            } else if (op === 'r') {
                t = t.rotate(r);
            } else if (op === 's') {
                t = t.scale(sx, sy);
            }
        }
        if (isListOfPoints) {
            shapes = shapes.concat(fn(shape, t));
        } else {
            shapes.push(fn(shape, t));
        }

        tx += translate.x;
        ty += translate.y;
        r += rotate;
        sx += scale.x;
        sy += scale.y;
    }
    return shapes;
};

g.flip = function (shape, axis) {
    if (axis === 'none') { return shape; }
    if (shape instanceof vg.Path || shape instanceof vg.Group || shape instanceof vg.Text || (Array.isArray(shape) && shape.length > 0 && shape[0].x !== undefined && shape[0].y !== undefined)) {
        var x = axis === g.HORIZONTAL || axis === g.BOTH ? -1 : 1;
        var y = axis === g.VERTICAL || axis === g.BOTH ? -1 : 1;
        return vg.scale(shape, new vg.Point(x, y), vg.centerPoint(shape));
    } else if (shape instanceof img.Img) {
        var image = shape;
        var layer = image.toLayer(false);
        if (axis === g.HORIZONTAL || axis === g.BOTH) {
            layer.flipHorizontal();
        }
        if (axis === g.VERTICAL || axis === g.BOTH) {
            layer.flipVertical();
        }
        return image.withCanvas(layer.toCanvas());
    }
};

g.fit = function (shape, position, width, height, stretch) {
    if (!shape) {
        return;
    }
    stretch = stretch !== undefined ? stretch : false;
    var t, sx, sy,
        bounds = vg.bounds(shape),
        bx = bounds.x,
        by = bounds.y,
        bw = bounds.width,
        bh = bounds.height;

    // Make sure bw and bh aren't infinitely small numbers.
    // This will lead to incorrect transformations with for examples lines.
    bw = (bw > 0.000000000001) ? bw : 0;
    bh = (bh > 0.000000000001) ? bh : 0;

    t = new vg.Transform();
    t = t.translate(position.x, position.y);

    if (!stretch) {
        // don't scale widths or heights that are equal to zero.
        sx = (bw > 0) ? (width / bw) : Number.MAX_VALUE;
        sy = (bh > 0) ? (height / bh) : Number.MAX_VALUE;
        sx = sy = Math.min(sx, sy);
    } else {
        sx = (bw > 0) ? (width / bw) : 1;
        sy = (bh > 0) ? (height / bh) : 1;
    }

    t = t.scale(sx, sy);
    t = t.translate(-bw / 2 - bx, -bh / 2 - by);
    return transform(shape, t);
};

g.fitTo = function (shape, bounding, stretch) {
    if (!shape) {
        return;
    }
    if (!bounding) {
        return shape;
    }

    var bounds = vg.bounds(bounding),
        bx = bounds.x,
        by = bounds.y,
        bw = bounds.width,
        bh = bounds.height;

    return g.fit(shape, {x: bx + bw / 2, y: by + bh / 2}, bw, bh, stretch);
};

g.hslAdjust = function (v, hue, saturation, lightness, alpha) {
    if (!alpha) { alpha = 0; }

    // First, handle the image case.
    if (v instanceof img.Img) {
        var image = v;
        var layer = image.toLayer(false);
        layer.addFilter('hslAdjust', {h: hue, s: saturation, l: lightness, a: alpha});
        return image.withCanvas(layer.toCanvas());
    }

    hue = clamp(hue, -1, 1);
    saturation = clamp(saturation, -1, 1);
    lightness = clamp(lightness, -1, 1);
    alpha = clamp(alpha, -1, 1);
    var satMul = 1 + saturation * (saturation < 0 ? 1 : 2);
    var lightMul = lightness < 0 ? 1 + lightness : 1 - lightness;
    var lightAdd = lightness < 0 ? 0 : lightness;
    var r, g, b, vs, ms, vm, h, s, l, m, vmh, sextant;
    hue = (hue * 6) % 6;

    function hslAdjust(v1) {
        if (v1 instanceof vg.Group) {
            var newShapes = [];
            for (var i = 0; i < v1.shapes.length; i += 1) {
                newShapes.push(hslAdjust(v1.shapes[i]));
            }
            return new vg.Group(newShapes);
        } else if (v1 instanceof vg.Path) {
            var p = v1.clone();
            p.fill = hslAdjust(p.fill);
            p.stroke = hslAdjust(p.stroke);
            return p;
        }
        var c = v1;
        if (!(c instanceof vg.Color)) {
            c = vg.Color.parse(c);
        }

        r = c.r;
        g = c.g;
        b = c.b;

        if (hue !== 0 || saturation !== 0) {
            // ok, here comes rgb to hsl + adjust + hsl to rgb, all in one jumbled mess.
            // It's not so pretty, but it's been optimized to get somewhat decent performance.
            // The transforms were originally adapted from the ones found in Graphics Gems, but have been heavily modified.
            vs = r;
            if (g > vs) {
                vs = g;
            }
            if (b > vs) {
                vs = b;
            }
            ms = r;
            if (g < ms) {
                ms = g;
            }
            if (b < ms) {
                ms = b;
            }
            vm = vs - ms;
            l = (ms + vs) / 2;

            if (l > 0 && vm > 0) {
                if (l <= 0.5) {
                    s = vm / (vs + ms) * satMul;
                    if (s > 1) {
                        s = 1;
                    }
                    v = (l * (1 + s));
                } else {
                    s = vm / (2 - vs - ms) * satMul;
                    if (s > 1) {
                        s = 1;
                    }
                    v = (l + s - l * s);
                }
                if (r === vs) {
                    if (g === ms) {
                        h = 5 + ((vs - b) / vm) + hue;
                    } else {
                        h = 1 - ((vs - g) / vm) + hue;
                    }
                } else if (g === vs) {
                    if (b === ms) {
                        h = 1 + ((vs - r) / vm) + hue;
                    } else {
                        h = 3 - ((vs - b) / vm) + hue;
                    }
                } else {
                    if (r === ms) {
                        h = 3 + ((vs - g) / vm) + hue;
                    } else {
                        h = 5 - ((vs - r) / vm) + hue;
                    }
                }
                if (h < 0) {
                    h += 6;
                }
                if (h >= 6) {
                    h -= 6;
                }
                m = (l + l - v);
                sextant = h >> 0;
                vmh = (v - m) * (h - sextant);
                if (sextant === 0) {
                    r = v;
                    g = m + vmh;
                    b = m;
                } else if (sextant === 1) {
                    r = v - vmh;
                    g = v;
                    b = m;
                } else if (sextant === 2) {
                    r = m;
                    g = v;
                    b = m + vmh;
                } else if (sextant === 3) {
                    r = m;
                    g = v - vmh;
                    b = v;
                } else if (sextant === 4) {
                    r = m + vmh;
                    g = m;
                    b = v;
                } else if (sextant === 5) {
                    r = v;
                    g = m;
                    b = v - vmh;
                }
            }
        }

        r = r * lightMul + lightAdd;
        g = g * lightMul + lightAdd;
        b = b * lightMul + lightAdd;

        if (r < 0) { r = 0; }
        if (g < 0) { g = 0; }
        if (b < 0) { b = 0; }
        if (r > 1) { r = 1; }
        if (g > 1) { g = 1; }
        if (b > 1) { b = 1; }

        return new vg.Color(r, g, b, c.a + alpha);
    }
    return hslAdjust(v);
};

g.rgbAdjust = function (v, red, green, blue, alpha) {
    if (!alpha) { alpha = 0; }
    red = clamp(red, -1, 1);
    green = clamp(green, -1, 1);
    blue = clamp(blue, -1, 1);
    alpha = clamp(alpha, -1, 1);

    function rgbAdjust(v) {
        if (v instanceof img.Img) {
            var image = v;
            var layer = image.toLayer(false);
            layer.addFilter('rgbAdjust', {r: red, g: green, b: blue, a: alpha});
            return image.withCanvas(layer.toCanvas());
        } else if (v instanceof vg.Group) {
            var newShapes = [];
            for (var i = 0; i < v.shapes.length; i += 1) {
                newShapes.push(rgbAdjust(v.shapes[i]));
            }
            return new vg.Group(newShapes);
        } else if (v instanceof vg.Path) {
            var p = v.clone();
            p.fill = rgbAdjust(p.fill);
            p.stroke = rgbAdjust(p.stroke);
            return p;
        }
        var c = v;
        if (!(c instanceof vg.Color)) {
            c = vg.Color.parse(c);
        }
        return new vg.Color(c.r + red, c.g + green, c.b + blue, c.a + alpha);
    }
    return rgbAdjust(v);
};

g.stack = function (shapes, direction, margin) {
    if (!shapes) {
        return [];
    }
    if (shapes.length <= 1) {
        return shapes;
    }

    var i, shape, tx, ty, t, bounds,
        firstBounds = shapes[0].bounds(),
        newShapes = [];

    if (direction === 'e') {
        tx = firstBounds.x;
        for (i = 0; i < shapes.length; i += 1) {
            shape = shapes[i];
            bounds = shape.bounds();
            t = new vg.Transform().translate(tx - bounds.x, 0);
            newShapes.push(transform(shape, t));
            tx += bounds.width + margin;
        }
    } else if (direction === 'w') {
        tx = firstBounds.x + firstBounds.width;
        for (i = 0; i < shapes.length; i += 1) {
            shape = shapes[i];
            bounds = shape.bounds();
            t = new vg.Transform().translate(tx - (bounds.x + bounds.width), 0);
            newShapes.push(transform(shape, t));
            tx -= bounds.width + margin;
        }
    } else if (direction === 'n') {
        ty = firstBounds.y + firstBounds.height;
        for (i = 0; i < shapes.length; i += 1) {
            shape = shapes[i];
            bounds = shape.bounds();
            t = new vg.Transform().translate(0, ty - (bounds.y + bounds.height));
            newShapes.push(transform(shape, t));
            ty -= bounds.height + margin;
        }
    } else if (direction === 's') {
        ty = firstBounds.y;
        for (i = 0; i < shapes.length; i += 1) {
            shape = shapes[i];
            bounds = shape.bounds();
            t = new vg.Transform().translate(0, ty - bounds.y);
            newShapes.push(transform(shape, t));
            ty += bounds.height + margin;
        }
    }
    return newShapes;
};

g.angle = function (point1, point2) {
    var args = arguments;
    if (args.length === 4) {
        point1 = vg.Point.read(args[0], args[1]);
        point2 = vg.Point.read(args[2], args[3]);
    } else {
        point1 = vg.Point.read(point1);
        point2 = vg.Point.read(point2);
    }
    return math.degrees(Math.atan2(point2.y - point1.y, point2.x - point1.x));
};

g.coordinates = function (point, angle, distance) {
    var args = arguments;
    if (args.length === 4) {
        point = vg.Point.read(args[0], args[1]);
        angle = args[2];
        distance = args[3];
    } else {
        point = vg.Point.read(point);
    }
    return vg.geo.coordinates(point.x, point.y, angle, distance);
};

g.distance = function (point1, point2) {
    var args = arguments;
    if (args.length === 4) {
        point1 = vg.Point.read(args[0], args[1]);
        point2 = vg.Point.read(args[2], args[3]);
    } else {
        point1 = vg.Point.read(point1);
        point2 = vg.Point.read(point2);
    }
    return Math.sqrt(Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2));
};

g.grayColor = function (gray, alpha) {
    if (!alpha && alpha !== 0) { alpha = 1; }
    return vg.Color.gray(gray, alpha, 1.0);
};

g.hexColor = function (s) {
    function isNumeric(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    }
    if (isNumeric(s)) {
        s = s.toString(16);
    } else {
        s = String(s);
    }
    if (s[0] !== '#') {
        s = '#' + s;
    }
    return vg.Color.parse(s);
};

g.hslColor = function (hue, saturation, lightness, alpha) {
    if (!alpha && alpha !== 0) { alpha = 1; }
    return vg.Color.hsl(hue, saturation, lightness, alpha, 1.0);
};

g.rgbColor = function (red, green, blue, alpha) {
    if (!alpha && alpha !== 0) { alpha = 1; }
    return vg.Color.rgb(red, green, blue, alpha, 1.0);
};

g.desaturate = function (shape, method) {
    if (!shape) { return null; }
    return shape.desaturate({method: method});
};

g.invert = function (shape) {
    if (!shape) { return null; }
    if (shape instanceof img.Img) {
        var image = shape;
        var layer = image.toLayer(false);
        layer.addFilter('invert');
        return image.withCanvas(layer.toCanvas());
    }
    return shape.invert();
};

module.exports = g;

},{"./img/img":22,"./math":26,"./vg/vg":49}],18:[function(require,module,exports){
'use strict';

var vg = require('./vg/vg');
var img = require('./img/img');

var Img = img.Img;
var Layer = img.Layer;
var ImageCanvas = img.ImageCanvas;
var g = {};

g.blend = function (image1, image2, mode) {
    var b1 = image1.bounds();
    var b2 = image2.bounds();

    var b = new vg.Rect(b1.x, b1.y, b1.width, b1.height).unite(b2);
    var width = Math.ceil(b.width);
    var height = Math.ceil(b.height);
    var dx = width / 2 + b.x;
    var dy = height / 2 + b.y;

    var canvas = new ImageCanvas(width, height);
    var l1 = canvas.addLayer(image1.toLayer());
    l1.translate(-dx, -dy);
    var l2 = canvas.addLayer(image2.toLayer());
    l2.translate(-dx, -dy);
    l2.blendmode = mode;
    return new Img(canvas.render(), dx, dy);
};

g.blur = function (image, radius) {
    var layer = image.toLayer(false);
    layer.addFilter('blur', {radius: radius});
    return image.withCanvas(layer.toCanvas());
};

g.brighten = function (image, brightness, contrast) {
    var layer = image.toLayer(false);
    layer.addFilter('brightness', {brightness: brightness / 100, contrast: contrast / 100});
    return image.withCanvas(layer.toCanvas());
};

g.bump = function (image, position, radius, zoom) {
    var layer = image.toLayer(false);
    layer.addFilter('bump', {dx: position.x, dy: position.y, radius: radius, zoom: zoom / 100});
    return image.withCanvas(layer.toCanvas());
};

g.colorImage = function (width, height, color) {
    var layer = Layer.fromColor(color);
    layer.width = width;
    layer.height = height;
    return new Img(layer.toCanvas());
};

g.crop = function (image, bounding) {
    return image.crop(bounding);
};

g.crossEdges = function (image, strength) {
    var layer = image.toLayer(false);
    layer.addFilter('crossedges', {strength: strength / 100});
    return image.withCanvas(layer.toCanvas());
};

g.dent = function (image, position, radius, zoom) {
    var layer = image.toLayer(false);
    layer.addFilter('dent', {dx: position.x, dy: position.y, radius: radius, zoom: zoom / 100});
    return image.withCanvas(layer.toCanvas());
};

g.emboss = function (image, amount, angle) {
    var layer = image.toLayer(false);
    layer.addFilter('emboss', {amount: amount / 100, angle: angle});
    return image.withCanvas(layer.toCanvas());
};

g.equalize = function (image) {
    var layer = image.toLayer(false);
    layer.addFilter('equalize');
    return image.withCanvas(layer.toCanvas());
};

g.findEdges = function (image) {
    var layer = image.toLayer(false);
    layer.addFilter('findedges');
    return image.withCanvas(layer.toCanvas());
};

g.glow = function (image, amount, kernelSize) {
    var layer = image.toLayer(false);
    layer.addFilter('glow', {amount: amount / 100, kernelSize: kernelSize});
    return image.withCanvas(layer.toCanvas());
};

g.gradientImage = function (width, height, startColor, endColor, type, angle, spread) {
    var layer = Layer.fromGradient(startColor, endColor, type, angle, spread / 100);
    layer.width = width;
    layer.height = height;
    return new Img(layer.toCanvas());
};

g.histogram = function (image, channel, relative) {
    var pixels = image.getPixels();
    var vals = new Array(256);
    var i, c, pixel, comp;
    for (i = 0; i < vals.length; i += 1) { vals[i] = 0; }
    if (channel === 'lum') {
        for (i = 0; i < pixels.width * pixels.height; i += 1) {
            pixel = pixels.get(i);
            comp = pixel[0] * 0.2125 + pixel[1] * 0.7154 + pixel[2] * 0.0721;
            vals[Math.round(comp)] += 1;
        }
    } else {
        if (channel === 'red') { c = 0; }
        if (channel === 'green') { c = 1; }
        if (channel === 'blue') { c = 2; }
        if (channel === 'alpha') { c = 3; }
        for (i = 0; i < pixels.width * pixels.height; i += 1) {
            pixel = pixels.get(i);
            comp = pixel[c];
            vals[comp] += 1;
        }
    }
    if (relative) {
        for (i = 0; i < vals.length; i += 1) {
            vals[i] /= (pixels.width * pixels.height);
        }
    }
    return vals;
};

g.lightTunnel = function (image, position, radius) {
    var layer = image.toLayer(false);
    layer.addFilter('splash', {dx: position.x, dy: position.y, radius: radius});
    return image.withCanvas(layer.toCanvas());
};

g.luminanceBW = function (image) {
    var layer = image.toLayer(false);
    layer.addFilter('luminancebw');
    return image.withCanvas(layer.toCanvas());
};

g.mask = function (image, mask) {
    image = image.transformed();
    mask = mask.transformed();

    var layer = image.toLayer(false);
    var maskLayer = mask.toLayer();

    var b1 = image.bounds();
    var b2 = mask.bounds();

    var b = new vg.Rect(b1.x, b1.y, b1.width, b1.height).unite(b2);
    var width = Math.ceil(b.width);
    var height = Math.ceil(b.height);
    var dx = width / 2 + b.x;
    var dy = height / 2 + b.y;
    maskLayer.translate(-dx, -dy);

    var l = layer.mask.addLayer('white');
    l.width = layer.width;
    l.height = layer.height;
    layer.mask.addLayer(maskLayer);
    return image.withCanvas(layer.toCanvas());
};

g.mosaic = function (image, blockSize) {
    var layer = image.toLayer(false);
    layer.addFilter('mosaic', {blockSize: blockSize});
    return image.withCanvas(layer.toCanvas());
};

g.pinch = function (image, position, zoom) {
    var layer = image.toLayer(false);
    layer.addFilter('pinch', {dx: position.x, dy: position.y, zoom: zoom / 100});
    return image.withCanvas(layer.toCanvas());
};

g.posterize = function (image, levels) {
    var layer = image.toLayer(false);
    layer.addFilter('posterize', {levels: levels});
    return image.withCanvas(layer.toCanvas());
};

g.removeNoise = function (image) {
    var layer = image.toLayer(false);
    layer.addFilter('removenoise');
    return image.withCanvas(layer.toCanvas());
};

g.solarize = function (image) {
    var layer = image.toLayer(false);
    layer.addFilter('solarize');
    return image.withCanvas(layer.toCanvas());
};

g.toBitmap = function (shape, bounding) {
    var canvas = document.createElement('canvas');
    var bounds;
    if (bounding) {
        bounds = bounding.bounds();
    } else {
        bounds = shape.bounds();
    }
    var x = bounds.x;
    var y = bounds.y;
    var width = canvas.width = Math.ceil(bounds.width);
    var height = canvas.height = Math.ceil(bounds.height);
    var ctx = canvas.getContext('2d');
    ctx.translate(-x, -y);
    shape.draw(ctx);
    return new Img(canvas, width / 2 + x, height / 2 + y);
};

g.toPixels = function (image, step) {
    step = step > 1 ? step : 1;
    var canvas = image.canvas;
    var imgWidth = canvas.width;
    var imgHeight = canvas.height;
    var ctx = canvas.getContext('2d');
    var data = ctx.getImageData(0, 0, canvas.width, canvas.height);
    var pixels = data.data;
    var stride = canvas.width * 4;

    var outPixels = [];
    for (var y = 0; y < imgHeight; y += step) {
        for (var x = 0; x < imgWidth; x += step) {
            var offset = y * stride + x * 4;
            var pr = pixels[offset];
            var pg = pixels[offset + 1];
            var pb = pixels[offset + 2];
            var pa = pixels[offset + 3];
            outPixels.push({
                x: x - imgWidth / 2,
                y: y - imgHeight / 2,
                r: pr,
                g: pg,
                b: pb,
                a: pa,
                color: new vg.Color(pr / 255, pg / 255, pb / 255, pa / 255)
            });
        }
    }
    return outPixels;
};

g.twirl = function (image, position, radius, angle) {
    var layer = image.toLayer(false);
    layer.addFilter('twirl', {dx: position.x, dy: position.y, radius: radius, angle: angle});
    return image.withCanvas(layer.toCanvas());
};

module.exports = g;

},{"./img/img":22,"./vg/vg":49}],19:[function(require,module,exports){
'use strict';

var async = require('async');
var process = require('./process');
var CanvasRenderer = require('./canvasrenderer');

// Utility function that passes its input (normally a html canvas) to the next function.
function passThrough(canvas, callback) {
    callback(null, canvas);
}

// RENDERING.

// The Layer and ImageCanvas objects don't do any actual pixel operations themselves,
// they only contain information about the operations. The actual rendering is done
// by a Renderer object. Currently there is only one kind available, the CanvasRenderer,
// which uses the HTML Canvas object (containing the pixel data) and a 2D context that
// acts on this canvas object. In the future, a webgl renderer might be added as well.

var AsyncRenderer = {};

// Renders a html canvas as an html Image. Currently unused.
AsyncRenderer.toImage = function () {
    return function (canvas, callback) {
        callback(null, CanvasRenderer.toImage(canvas));
    };
};


// 'LOADING' OF LAYERS.

// Returns a html canvas dependent on the type of the layer provided.
AsyncRenderer.load = function (iCanvas, layer) {
    if (layer.isPath()) {
        return AsyncRenderer.loadFile(layer.data);
    } else if (layer.isFill()) {
        return AsyncRenderer.generateColor(iCanvas, layer);
    } else if (layer.isGradient()) {
        return AsyncRenderer.generateGradient(iCanvas, layer);
    } else if (layer.isHtmlCanvas()) {
        return AsyncRenderer.loadHtmlCanvas(layer.data);
    } else if (layer.isImage()) {
        return AsyncRenderer.loadImage(layer.data);
    } else if (layer.isImageCanvas()) {
        return AsyncRenderer.loadImageCanvas(layer.data);
    }
};

// Returns a html canvas from an image file location.
AsyncRenderer.loadFile = function (src) {
    return function (_, callback) {
        var canvas = document.createElement('canvas');
        var ctx = canvas.getContext('2d');

        var source = new Image();
        source.onload = function () {
            canvas.width = source.width;
            canvas.height = source.height;
            ctx.drawImage(source, 0, 0, canvas.width, canvas.height);
            callback(null, canvas);
        };
        source.src = src;
    };
};

// Passes a html canvas.
AsyncRenderer.loadHtmlCanvas = function (canvas) {
    return function (_, callback) {
        callback(null, canvas);
    };
};

// Returns a html canvas from rendering an ImageCanvas.
AsyncRenderer.loadImageCanvas = function (iCanvas) {
    return function (_, callback) {
        iCanvas.render(function (canvas) {
            callback(null, canvas);
        });
    };
};

// Returns a html canvas from rendering a stored Image file.
AsyncRenderer.loadImage = function (img) {
    return function (_, callback) {
        var canvas = CanvasRenderer.loadImage(img);
        callback(null, canvas);
    };
};

// Returns a html canvas with a solid fill color.
AsyncRenderer.generateColor = function (iCanvas, layer) {
    return function (_, callback) {
        var canvas = CanvasRenderer.generateColor(iCanvas, layer);
        callback(null, canvas);
    };
};

// Returns a html canvas with a gradient.
AsyncRenderer.generateGradient = function (iCanvas, layer) {
    return function (_, callback) {
        var canvas = CanvasRenderer.generateGradient(iCanvas, layer);
        callback(null, canvas);
    };
};


// PROCESSING OF LAYERS.

// Performs a number of filtering operations on an html image.
// This method executes on the main thread if web workers aren't available on the current system.
AsyncRenderer.processImage = function (filters) {
    if (filters.length === 0) {
        return passThrough;
    }

    return function (canvas, callback) {
        CanvasRenderer.processImage(canvas, filters);
        callback(null, canvas);
    };
};

// Renders the layer mask and applies it to the layer that it is supposed to mask.
AsyncRenderer.processMask = function (mask) {
    if (mask.layers.length === 0) {
        return passThrough;
    }
    return function (canvas, callback) {
        mask.width = canvas.width;
        mask.height = canvas.height;

        // First, make a black and white version of the masking canvas and pass
        // the result to the masking operation.
        AsyncRenderer.renderBW(mask, function (c) {
            var data = c.getContext('2d').getImageData(0, 0, c.width, c.height).data;
            var maskFilter = {name: 'mask', options: {data: data, x: 0, y: 0, width: c.width, height: c.height} };
            var fn = AsyncRenderer.processImage([maskFilter]);
            fn(canvas, callback);
        });
    };
};

// Processes a single layer. First the layer image is loaded, then a mask (if applicable) is applied to it,
// and finally the filters (if any) are applied to it.
function processLayers(iCanvas) {
    return function (layer, callback) {
        async.compose(
            AsyncRenderer.processImage(layer.filters),
            AsyncRenderer.processMask(layer.mask),
            AsyncRenderer.load(iCanvas, layer)
        )(null, callback);
    };
}


// LAYER BLENDING.

// Blends the subsequent layer images with the base layer and returns a single image.
// This method is used when web workers aren't available for use on this system.
AsyncRenderer.mergeManualBlend = function (iCanvas, layerData) {
    return function (canvas, callback) {
        CanvasRenderer.mergeManualBlend(iCanvas, layerData)(canvas);
        callback(null, canvas);
    };
};

// Blends the subsequent layer images with the base layer and returns the resulting image.
// This method is used when the system supports the requested blending mode(s).
AsyncRenderer.mergeNativeBlend = function (iCanvas, layerData) {
    return function (canvas, callback) {
        CanvasRenderer.mergeNativeBlend(iCanvas, layerData)(canvas);
        callback(null, canvas);
    };
};

// Merges the different canvas layers together in a single image and returns this as a html canvas.
AsyncRenderer.merge = function (iCanvas, layerData, callback) {
    var renderPipe = CanvasRenderer.createRenderPipe(AsyncRenderer, iCanvas, layerData);
    renderPipe.reverse();

    var canvas = CanvasRenderer.singleLayerWithOpacity(iCanvas, layerData[0]);
    renderPipe.push(function (_, cb) {
        cb(null, canvas);
    });

    async.compose.apply(null, renderPipe)(null, function () {
        callback(canvas);
    });
};

AsyncRenderer.composite = function (iCanvas, layerData, callback) {
    if (!layerData || layerData.length === 0) {
        callback(null);
        return;
    }
    if (layerData.length === 1) {
        callback(CanvasRenderer.singleLayerWithOpacity(iCanvas, layerData[0]));
        return;
    }

    AsyncRenderer.merge(iCanvas, layerData, callback);
};

// Renders the image canvas. Top level.
AsyncRenderer.render = function (iCanvas, callback) {
    async.map(iCanvas.layers,
        processLayers(iCanvas), function (err, layerImages) {
            if (callback) {
                AsyncRenderer.composite(iCanvas, CanvasRenderer.getLayerData(iCanvas, layerImages), callback);
            }
        });
};

// Renders the image canvas and turns it into a black and white image. Useful for rendering a layer mask.
AsyncRenderer.renderBW = function (iCanvas, callback) {
    AsyncRenderer.render(iCanvas, function (canvas) {
        var data = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height).data;
        var bwFilter = {name: 'desaturate', options: {method: 'ITU-R BT.709'}};
        var fn = AsyncRenderer.processImage([bwFilter]);
        fn(canvas, function (err, c) {
            callback(c);
        });
    });
};

module.exports = AsyncRenderer;

},{"./canvasrenderer":21,"./process":23,"async":1}],20:[function(require,module,exports){
'use strict';

var blend, process;

var aliases = {
    normal: 'source-over',
    'linear-dodge': 'add'
};

function addAliases(d) {
    var i, mode, alias;
    var modes = Object.keys(aliases);
    for (i = 0; i < modes.length; i += 1) {
        mode = modes[i];
        alias = aliases[mode];
        d[mode] = d[alias];
    }
}

function realBlendMode(mode) {
    if (aliases[mode] !== undefined) { return aliases[mode]; }
    return mode;
}

// Tests which blending modes are supported on the current system and returns a dictionary with the results.
// For example d['source-over'] always results in true.
function getNativeModes() {
    if (typeof document === 'undefined') {
        return {};
    }
    var i, mode, darken, ok;
    var nativeModes = {};
    var dCanvas = document.createElement('canvas');
    var ctx = dCanvas.getContext('2d');

    if (!ctx) { return {}; }

    var native = ['source-over', 'source-in', 'source-out', 'source-atop',
            'destination-over', 'destination-in', 'destination-out',
            'destination-atop', 'lighter', 'darker', 'copy', 'xor'];

    var maybeNative = ['multiply', 'screen', 'overlay', 'soft-light', 'hard-light',
            'color-dodge', 'color-burn', 'darken', 'lighten', 'difference',
            'exclusion', 'hue', 'saturation', 'luminosity', 'color',
            'add', 'subtract', 'average', 'negation'];

    var nonNative = ['divide', 'darker-color', 'lighter-color', 'linear-burn', 'linear-light',
            'vivid-light', 'pin-light', 'hard-mix'];

    for (i = 0; i < native.length; i += 1) {
        nativeModes[native[i]] = true;
    }
    for (i = 0; i < nonNative.length; i += 1) {
        nativeModes[nonNative[i]] = false;
    }
    dCanvas.width = 1;
    dCanvas.height = 1;
    for (i = 0; i < maybeNative.length; i += 1) {
        mode = maybeNative[i];
        darken = mode === 'darken';
        ok = false;
        ctx.save();
        try {
            ctx.fillStyle = darken ? '#300' : '#a00';
            ctx.fillRect(0, 0, 1, 1);
            ctx.globalCompositeOperation = mode;
            if (ctx.globalCompositeOperation === mode) {
                ctx.fillStyle = darken ? '#a00' : '#300';
                ctx.fillRect(0, 0, 1, 1);
                ok = ctx.getImageData(0, 0, 1, 1).data[0] !== (darken ? 170 : 51);
            }
        } catch (e) {
        }
        ctx.restore();
        nativeModes[mode] = ok;
    }

    addAliases(nativeModes);

    return nativeModes;
}

process = function (inData, outData, width, height, options) {

    var blend_fn,
        sr, sg, sb, sa,
        dr, dg, db, da,
        or, og, ob, oa;
    var max = Math.max;
    var min = Math.min;
    var div_2_255 = 2 / 255;

    /*R = 0.299;
     G = 0.587;
     B = 0.114;*/

    var R = 0.2126;
    var G = 0.7152;
    var B = 0.0722;

    /** This is the formula used by Photoshop to convert a color from
     * RGB (Red, Green, Blue) to HSY (Hue, Saturation, Luminosity).
     * The hue is calculated using the exacone approximation of the saturation
     * cone.
     * @param rgb The input color RGB normalized components.
     * @param hsy The output color HSY normalized components.
     */
    function rgbToHsy(r, g, b) {
        r /= 255;
        g /= 255;
        b /= 255;
        var h, s, y;

        // For saturation equals to 0 any value of hue are valid.
        // In this case we choose 0 as a default value.

        if (r === g && g === b) {            // Limit case.
            s = 0;
            h = 0;
        } else if ((r >= g) && (g >= b)) { // Sector 0: 0° - 60°
            s = r - b;
            h = 60 * (g - b) / s;
        } else if ((g > r) && (r >= b)) {  // Sector 1: 60° - 120°
            s = g - b;
            h = 60 * (g - r) / s + 60;
        } else if ((g >= b) && (b > r)) {  // Sector 2: 120° - 180°
            s = g - r;
            h = 60 * (b - r) / s + 120;
        } else if ((b > g) && (g > r)) {   // Sector 3: 180° - 240°
            s = b - r;
            h = 60 * (b - g) / s + 180;
        } else if ((b > r) && (r >= g)) {  // Sector 4: 240° - 300°
            s = b - g;
            h = 60 * (r - g) / s + 240;
        } else {                           // Sector 5: 300° - 360°
            s = r - g;
            h = 60 * (r - b) / s + 300;
        }

        y = R * r + G * g + B * b;

        // Approximations erros can cause values to exceed bounds.

        return [h % 360,
            min(max(s, 0), 1),
            min(max(y, 0), 1)];
    }

    /**
     * This is the formula used by Photoshop to convert a color from
     * HSY (Hue, Saturation, Luminosity) to RGB (Red, Green, Blue).
     * The hue is calculated using the exacone approximation of the saturation
     * cone.
     * @param hsy The input color HSY normalized components.
     * @param rgb The output color RGB normalized components.
     */
    function hsyToRgb(h, s, y) {

        h = h % 360;
        var r, g, b, k; // Intermediate variable.

        if (h >= 0 && h < 60) {           // Sector 0: 0° - 60°
            k = s * h / 60;
            b = y - R * s - G * k;
            r = b + s;
            g = b + k;
        } else if (h >= 60 && h < 120) {  // Sector 1: 60° - 120°
            k = s * (h - 60) / 60;
            g = y + B * s + R * k;
            b = g - s;
            r = g - k;
        } else if (h >= 120 && h < 180) { // Sector 2: 120° - 180°
            k = s * (h - 120) / 60;
            r = y - G * s - B * k;
            g = r + s;
            b = r + k;
        } else if (h >= 180 && h < 240) { // Sector 3: 180° - 240°
            k = s * (h - 180) / 60;
            b = y + R * s + G * k;
            r = b - s;
            g = b - k;
        } else if (h >= 240 && h < 300) { // Sector 4: 240° - 300°
            k = s * (h - 240) / 60;
            g = y - B * s - R * k;
            b = g + s;
            r = g + k;
        } else {                          // Sector 5: 300° - 360°
            k = s * (h - 300) / 60;
            r = y + G * s + B * k;
            g = r - s;
            b = r - k;
        }

        // Approximations erros can cause values to exceed bounds.

        r = min(max(r, 0), 1) * 255;
        g = min(max(g, 0), 1) * 255;
        b = min(max(b, 0), 1) * 255;
        return [r, g, b];
    }

    function _sourceover() {
        or = sr;
        og = sg;
        ob = sb;
    }

    function _svg_sourceover() {
        or = sr + dr - dr * sa;
        og = sg + dg - dg * sa;
        ob = sb + db - db * sa;
    }

    function _multiply() {
        or = dr * sr / 255;
        og = dg * sg / 255;
        ob = db * sb / 255;
    }

    function _svg_multiply() {
        or = sr * dr + sr * (1 - da) + dr * (1 - sa);
        og = sg * dg + sg * (1 - da) + dg * (1 - sa);
        ob = sb * db + sb * (1 - da) + db * (1 - sa);
    }

    function _subtract() {
        or = max(dr - sr, 0);
        og = max(dg - sg, 0);
        ob = max(db - sb, 0);
    }

    function _svg_subtract() {
        or = max(dr * sa - sr * da, 0) + sr * (1 - da) + dr * (1 - sa);
        og = max(dg * sa - sg * da, 0) + sg * (1 - da) + dg * (1 - sa);
        ob = max(db * sa - sb * da, 0) + sb * (1 - da) + db * (1 - sa);
    }

    function _divide() {
        or = sr === 0 ? 0 : dr / sr * 255;
        og = sg === 0 ? 0 : dg / sg * 255;
        ob = sb === 0 ? 0 : db / sb * 255;
    }

    function _screen() {
        or = (255 - (((255 - dr) * (255 - sr)) >> 8));
        og = (255 - (((255 - dg) * (255 - sg)) >> 8));
        ob = (255 - (((255 - db) * (255 - sb)) >> 8));
    }

    function _svg_screen() {
        or = sr + dr - sr * dr;
        og = sg + dg - sg * dg;
        ob = sb + db - sb * db;
    }

    function _lighten() {
        or = dr > sr ? dr : sr;
        og = dg > sg ? dg : sg;
        ob = db > sb ? db : sb;
    }

    function _svg_lighten() {
        or = max(sr * da, dr * sa) + sr * (1 - da) + dr * (1 - sa);
        og = max(sg * da, dg * sa) + sg * (1 - da) + dg * (1 - sa);
        ob = max(sb * da, db * sa) + sb * (1 - da) + db * (1 - sa);
    }

    function _darken() {
        or = dr < sr ? dr : sr;
        og = dg < sg ? dg : sg;
        ob = db < sb ? db : sb;
    }

    function _svg_darken() {
        or = min(sr * da, dr * sa) + sr * (1 - da) + dr * (1 - sa);
        og = min(sg * da, dg * sa) + sg * (1 - da) + dg * (1 - sa);
        ob = min(sb * da, db * sa) + sb * (1 - da) + db * (1 - sa);
    }

    function _darkercolor() {
        if (dr * 0.3 + dg * 0.59 + db * 0.11 <= sr * 0.3 + sg * 0.59 + sb * 0.11) {
            or = dr;
            og = dg;
            ob = db;
        } else {
            or = sr;
            og = sg;
            ob = sb;
        }
    }

    function _svg_darkercolor() {
        if (dr * sa * 0.3 + dg * sa * 0.59 + db * sa * 0.11 <= sr * da * 0.3 + sg * da * 0.59 + sb * da * 0.11) {
            or = dr * sa;
            og = dg * sa;
            ob = db * sa;
        } else {
            or = sr * da;
            og = sg * da;
            ob = sb * da;
        }
        or += sr * (1 - da) + dr * (1 - sa);
        og += sg * (1 - da) + dg * (1 - sa);
        ob += sb * (1 - da) + db * (1 - sa);
    }

    function _lightercolor() {
        if (dr * 0.3 + dg * 0.59 + db * 0.11 > sr * 0.3 + sg * 0.59 + sb * 0.11) {
            or = dr;
            og = dg;
            ob = db;
        } else {
            or = sr;
            og = sg;
            ob = sb;
        }
    }

    function _svg_lightercolor() {
        if (dr * sa * 0.3 + dg * sa * 0.59 + db * sa * 0.11 > sr * da * 0.3 + sg * da * 0.59 + sb * da * 0.11) {
            or = dr * sa;
            og = dg * sa;
            ob = db * sa;
        } else {
            or = sr * da;
            og = sg * da;
            ob = sb * da;
        }
        or += sr * (1 - da) + dr * (1 - sa);
        og += sg * (1 - da) + dg * (1 - sa);
        ob += sb * (1 - da) + db * (1 - sa);
    }

    function _add() { // also known as linear dodge
        or = min(dr + sr, 255);
        og = min(dg + sg, 255);
        ob = min(db + sb, 255);
    }

    function _linearburn() {
        or = dr + sr;
        og = dg + sg;
        ob = db + sb;

        or = or < 255 ? 0 : (or - 255);
        og = og < 255 ? 0 : (og - 255);
        ob = ob < 255 ? 0 : (ob - 255);
    }

    function _difference() {
        or = dr - sr;
        og = dg - sg;
        ob = db - sb;

        or = or < 0 ? -or : or;
        og = og < 0 ? -og : og;
        ob = ob < 0 ? -ob : ob;
    }

    function _svg_difference() {
        or = sr + dr - 2 * min(sr * da, dr * sa);
        og = sg + dg - 2 * min(sg * da, dg * sa);
        ob = sb + db - 2 * min(sb * da, db * sa);
    }

    function _exclusion() {
        or = dr - (dr * div_2_255 - 1) * sr;
        og = dg - (dg * div_2_255 - 1) * sg;
        ob = db - (db * div_2_255 - 1) * sb;
    }

    function _svg_exclusion() {
        or = sr * da + dr * sa - 2 * sr * dr + sr * (1 - da) + dr * (1 - sa);
        og = sg * da + dg * sa - 2 * sg * dg + sg * (1 - da) + dg * (1 - sa);
        ob = sb * da + db * sa - 2 * sb * db + sb * (1 - da) + db * (1 - sa);
    }

    function _overlay() {
        if (dr < 128) {
            or = sr * dr * div_2_255;
        } else {
            or = 255 - (255 - sr) * (255 - dr) * div_2_255;
        }

        if (dg < 128) {
            og = sg * dg * div_2_255;
        } else {
            og = 255 - (255 - sg) * (255 - dg) * div_2_255;
        }

        if (db < 128) {
            ob = sb * db * div_2_255;
        } else {
            ob = 255 - (255 - sb) * (255 - db) * div_2_255;
        }
    }

    function _svg_overlay() {
        if (2 * dr <= da) {
            or = 2 * sr * dr + sr * (1 - da) + dr * (1 - sa);
        } else {
            or = sr * (1 + da) + dr * (1 + sa) - 2 * dr * sr - da * sa;
        }
        if (2 * dg <= da) {
            og = 2 * sg * dg + sg * (1 - da) + dg * (1 - sa);
        } else {
            og = sg * (1 + da) + dg * (1 + sa) - 2 * dg * sg - da * sa;
        }
        if (2 * db <= da) {
            ob = 2 * sb * db + sb * (1 - da) + db * (1 - sa);
        } else {
            ob = sb * (1 + da) + db * (1 + sa) - 2 * db * sb - da * sa;
        }
    }

    function _softlight() {
        if (dr < 128) {
            or = ((sr >> 1) + 64) * dr * div_2_255;
        } else {
            or = 255 - (191 - (sr >> 1)) * (255 - dr) * div_2_255;
        }

        if (dg < 128) {
            og = ((sg >> 1) + 64) * dg * div_2_255;
        } else {
            og = 255 - (191 - (sg >> 1)) * (255 - dg) * div_2_255;
        }

        if (db < 128) {
            ob = ((sb >> 1) + 64) * db * div_2_255;
        } else {
            ob = 255 - (191 - (sb >> 1)) * (255 - db) * div_2_255;
        }
    }

    function _svg_softlight() {
        var m;
        var pow = Math.pow;

        if (0.0 === da) {
            or = sr;
            og = sg;
            ob = sb;
            return;
        }

        m = dr / da;
        if (2 * sr <= sa) {
            or = dr * (sa + (2 * sr - sa) * (1 - m)) + sr * (1 - da) + dr * (1 - sa);
        } else if (2 * sr > sa && 4 * dr <= da) {
            or = da * (2 * sr - sa) * (16 * pow(m, 3) - 12 * pow(m, 2) - 3 * m) + sr - sr * da + dr;
        } else if (2 * sr > sa && 4 * dr > da) {
            or = da * (2 * sr - sa) * (pow(m, 0.5) - m) + sr - sr * da + dr;
        }

        m = dg / da;
        if (2 * sg <= sa) {
            og = dg * (sa + (2 * sg - sa) * (1 - m)) + sg * (1 - da) + dg * (1 - sa);
        } else if (2 * sg > sa && 4 * dg <= da) {
            og = da * (2 * sg - sa) * (16 * pow(m, 3) - 12 * pow(m, 2) - 3 * m) + sg - sg * da + dg;
        } else if (2 * sg > sa && 4 * dg > da) {
            og = da * (2 * sg - sa) * (pow(m, 0.5) - m) + sg - sg * da + dg;
        }

        m = db / da;
        if (2 * sb <= sa) {
            ob = db * (sa + (2 * sb - sa) * (1 - m)) + sb * (1 - da) + db * (1 - sa);
        } else if (2 * sb > sa && 4 * db <= da) {
            ob = da * (2 * sb - sa) * (16 * pow(m, 3) - 12 * pow(m, 2) - 3 * m) + sb - sb * da + db;
        } else if (2 * sb > sa && 4 * db > da) {
            ob = da * (2 * sb - sa) * (pow(m, 0.5) - m) + sb - sb * da + db;
        }
    }

    function _hardlight() {
        if (sr < 128) {
            or = dr * sr * div_2_255;
        } else {
            or = 255 - (255 - dr) * (255 - sr) * div_2_255;
        }

        if (sg < 128) {
            og = dg * sg * div_2_255;
        } else {
            og = 255 - (255 - dg) * (255 - sg) * div_2_255;
        }

        if (sb < 128) {
            ob = db * sb * div_2_255;
        } else {
            ob = 255 - (255 - db) * (255 - sb) * div_2_255;
        }
    }

    function _svg_hardlight() {
        if (2 * sr <= sa) {
            or = 2 * sr * dr + sr * (1 - da) + dr * (1 - sa);
        } else {
            or = sr * (1 + da) + dr * (1 + sa) - sa * da - 2 * sr * dr;
        }

        if (2 * sg <= sa) {
            og = 2 * sg * dg + sg * (1 - da) + dg * (1 - sa);
        } else {
            og = sg * (1 + da) + dg * (1 + sa) - sa * da - 2 * sg * dg;
        }

        if (2 * sb <= sa) {
            ob = 2 * sb * db + sb * (1 - da) + db * (1 - sa);
        } else {
            ob = sb * (1 + da) + db * (1 + sa) - sa * da - 2 * sb * db;
        }
    }

    function _colordodge() {
        var dr1 = (dr << 8) / (255 - sr);
        var dg1 = (dg << 8) / (255 - sg);
        var db1 = (db << 8) / (255 - sb);

        or = (dr1 > 255 || sr === 255) ? 255 : dr1;
        og = (dg1 > 255 || sg === 255) ? 255 : dg1;
        ob = (db1 > 255 || sb === 255) ? 255 : db1;
    }

    function _svg_colordodge() {
        if (da === 0) {
            or = sr;
            og = sg;
            ob = sb;
            return;
        }

        if (sr === sa && dr === 0) {
            or = sr * (1 - da);
        } else if (sr === sa) {
            or = sa * da + sr * (1 - da) + dr * (1 - sa);
        } else if (sr < sa) {
            or = sa * da * min(1, dr / da * sa / (sa - sr)) + sr * (1 - da) + dr * (1 - sa);
        }

        if (sg === sa && dg === 0) {
            og = sg * (1 - da);
        } else if (sr === sa) {
            og = sa * da + sg * (1 - da) + dg * (1 - sa);
        } else if (sr < sa) {
            og = sa * da * min(1, dg / da * sa / (sa - sg)) + sg * (1 - da) + dg * (1 - sa);
        }

        if (sb === sa && db === 0) {
            ob = sb * (1 - da);
        } else if (sr === sa) {
            ob = sa * da + sb * (1 - da) + db * (1 - sa);
        } else if (sr < sa) {
            ob = sa * da * min(1, db / da * sa / (sa - sb)) + sb * (1 - da) + db * (1 - sa);
        }
    }

    function _colorburn() {
        var dr1 = 255 - ((255 - dr) << 8) / sr;
        var dg1 = 255 - ((255 - dg) << 8) / sg;
        var db1 = 255 - ((255 - db) << 8) / sb;

        or = (dr1 < 0 || sr === 0) ? 0 : dr1;
        og = (dg1 < 0 || sg === 0) ? 0 : dg1;
        ob = (db1 < 0 || sb === 0) ? 0 : db1;
    }

    function _svg_colorburn() {
        if (da === 0) {
            or = sr;
            og = sg;
            ob = sb;
            return;
        }

        if (sr === 0 && dr === da) {
            or = sa * da + dr * (1 - sa);
        } else if (sr === 0) {
            or = dr * (1 - sa);
        } else if (sr > 0) {
            or = sa * da * (1 - min(1, (1 - dr / da) * sa / sr)) + sr * (1 - da) + dr * (1 - sa);
        }

        if (sg === 0 && dg === da) {
            og = sa * da + dg * (1 - sa);
        } else if (sg === 0) {
            og = dg * (1 - sa);
        } else if (sg > 0) {
            og = sa * da * (1 - min(1, (1 - dg / da) * sa / sg)) + sg * (1 - da) + dg * (1 - sa);
        }

        if (sb === 0 && db === da) {
            ob = sa * da + db * (1 - sa);
        } else if (sb === 0) {
            ob = db * (1 - sa);
        } else if (sb > 0) {
            ob = sa * da * (1 - min(1, (1 - db / da) * sa / sb)) + sb * (1 - da) + db * (1 - sa);
        }
    }

    function _linearlight() {
        var dr1 = 2 * sr + dr - 256;
        var dg1 = 2 * sg + dg - 256;
        var db1 = 2 * sb + db - 256;

        or = (dr1 < 0 || (sr < 128 && dr1 < 0)) ? 0 : (dr1 > 255 ? 255 : dr1);
        og = (dg1 < 0 || (sg < 128 && dg1 < 0)) ? 0 : (dg1 > 255 ? 255 : dg1);
        ob = (db1 < 0 || (sb < 128 && db1 < 0)) ? 0 : (db1 > 255 ? 255 : db1);
    }

    function _vividlight() {
        var a;

        if (sr < 128) {
            if (sr) {
                a = 255 - ((255 - dr) << 8) / (2 * sr);
                or = a < 0 ? 0 : a;
            } else {
                or = 0;
            }
        } else {
            a = 2 * sr - 256;
            if (a < 255) {
                a = (dr << 8) / (255 - a);
                or = a > 255 ? 255 : a;
            } else {
                or = a < 0 ? 0 : a;
            }
        }

        if (sg < 128) {
            if (sg) {
                a = 255 - ((255 - dg) << 8) / (2 * sg);
                og = a < 0 ? 0 : a;
            } else {
                og = 0;
            }
        } else {
            a = 2 * sg - 256;
            if (a < 255) {
                a = (dg << 8) / (255 - a);
                og = a > 255 ? 255 : a;
            } else {
                og = a < 0 ? 0 : a;
            }
        }

        if (sb < 128) {
            if (sb) {
                a = 255 - ((255 - db) << 8) / (2 * sb);
                ob = a < 0 ? 0 : a;
            } else {
                ob = 0;
            }
        } else {
            a = 2 * sb - 256;
            if (a < 255) {
                a = (db << 8) / (255 - a);
                ob = a > 255 ? 255 : a;
            } else {
                ob = a < 0 ? 0 : a;
            }
        }
    }

    function _pinlight() {
        var a;

        if (sr < 128) {
            a = 2 * sr;
            or = dr < a ? dr : a;
        } else {
            a = 2 * sr - 256;
            or = dr > a ? dr : a;
        }

        if (sg < 128) {
            a = 2 * sg;
            og = dg < a ? dg : a;
        } else {
            a = 2 * sg - 256;
            og = dg > a ? dg : a;
        }

        if (sb < 128) {
            a = 2 * sb;
            ob = db < a ? db : a;
        } else {
            a = 2 * sb - 256;
            ob = db > a ? db : a;
        }
    }

    function _hardmix() {
        var a;

        if (sr < 128) {
            or = (255 - ((255 - dr) << 8) / (2 * sr) < 128 || sr === 0) ? 0 : 255;
        } else {
            a = 2 * sr - 256;
            or = (a < 255 && (dr << 8) / (255 - a) < 128) ? 0 : 255;
        }

        if (sg < 128) {
            og = (255 - ((255 - dg) << 8) / (2 * sg) < 128 || sg === 0) ? 0 : 255;
        } else {
            a = 2 * sg - 256;
            og = (a < 255 && (dg << 8) / (255 - a) < 128) ? 0 : 255;
        }

        if (sb < 128) {
            ob = (255 - ((255 - db) << 8) / (2 * sb) < 128 || sb === 0) ? 0 : 255;
        } else {
            a = 2 * sb - 256;
            ob = (a < 255 && (db << 8) / (255 - a) < 128) ? 0 : 255;
        }
    }

    function _hue() {
        var hcl1 = rgbToHsy(dr, dg, db);
        var hcl2 = rgbToHsy(sr, sg, sb);
        var rgb = hsyToRgb(hcl2[0], hcl1[1], hcl1[2]);
        or = rgb[0];
        og = rgb[1];
        ob = rgb[2];
    }

    function _saturation() {
        var hcl1 = rgbToHsy(dr, dg, db);
        var hcl2 = rgbToHsy(sr, sg, sb);
        var rgb = hsyToRgb(hcl1[0], hcl2[1], hcl1[2]);
        or = rgb[0];
        og = rgb[1];
        ob = rgb[2];
    }

    function _luminosity() {
        var hcl1 = rgbToHsy(dr, dg, db);
        var hcl2 = rgbToHsy(sr, sg, sb);
        var rgb = hsyToRgb(hcl1[0], hcl1[1], hcl2[2]);
        or = rgb[0];
        og = rgb[1];
        ob = rgb[2];
    }

    function _color() {
        var hcl1 = rgbToHsy(dr, dg, db);
        var hcl2 = rgbToHsy(sr, sg, sb);
        var rgb = hsyToRgb(hcl2[0], hcl2[1], hcl1[2]);
        or = rgb[0];
        og = rgb[1];
        ob = rgb[2];
    }

    blend_fn = {
        'source-over': _svg_sourceover,
        'multiply': _svg_multiply,
        'subtract': _svg_subtract,
        'divide': _divide,
        'screen': _svg_screen,
        'lighten': _svg_lighten,
        'darken': _svg_darken,
        'darker-color': _svg_darkercolor,
        'lighter-color': _svg_lightercolor,
        'add': _add,
        'linear-burn': _linearburn,
        'difference': _svg_difference,
        'exclusion': _svg_exclusion,
        'overlay': _svg_overlay,
        'soft-light': _svg_softlight,
        'hard-light': _svg_hardlight,
        'color-dodge': _svg_colordodge,
        'color-burn': _svg_colorburn,
        'linear-light': _linearlight,
        'vivid-light': _vividlight,
        'pin-light': _pinlight,
        'hard-mix': _hardmix,
        'hue': _hue,
        'saturation': _saturation,
        'luminosity': _luminosity,
        'color': _color
    };

    function rectIntersect(r1, r2) {
        var right1 = r1.x + r1.width;
        var bottom1 = r1.y + r1.height;
        var right2 = r2.x + r2.width;
        var bottom2 = r2.y + r2.height;

        var x = max(r1.x, r2.x);
        var y = max(r1.y, r2.y);
        var w = max(min(right1, right2) - x, 0);
        var h = max(min(bottom1, bottom2) - y, 0);
        return [x, y, w, h];
    }

    (function () {
        var pix, pixIn, x, y, a, a2, da2, demultiply, fBlend;
        var data2 = options.data;
        var opacity = options.opacity === 0 ? 0 : options.opacity || 1;
        var fn = blend_fn[options.type || '_svg_normal'];
        var dx = options.dx || 0;
        var dy = options.dy || 0;
        var ri = rectIntersect({x: 0, y: 0, width: width, height: height},
             {x: dx, y: dy, width: options.width, height: options.height});
        var xi = ri[0];
        var yi = ri[1];
        var wi = ri[2];
        var hi = ri[3];

        function pBlend() {
            sa = data2[pixIn + 3] / 255 * opacity;
            da = inData[pix + 3] / 255;
            da2 = (sa + da - sa * da);
            demultiply = 255 / da2;

            sr = data2[pixIn] / 255 * sa;
            sg = data2[pixIn + 1] / 255 * sa;
            sb = data2[pixIn + 2] / 255 * sa;

            dr = inData[pix] / 255 * da;
            dg = inData[pix + 1] / 255 * da;
            db = inData[pix + 2] / 255 * da;

            fn();

            outData[pix] = or * demultiply;
            outData[pix + 1] = og * demultiply;
            outData[pix + 2] = ob * demultiply;
            outData[pix + 3] = da2 * 255;
        }

        function sBlend() {
            dr = inData[pix];
            dg = inData[pix + 1];
            db = inData[pix + 2];

            sr = data2[pixIn];
            sg = data2[pixIn + 1];
            sb = data2[pixIn + 2];

            fn();

            outData[pix] = or;
            outData[pix + 1] = og;
            outData[pix + 2] = ob;
            outData[pix + 3] = inData[pix + 3];

            a = opacity * data2[pixIn + 3] / 255;
            if (a < 1) {
                a2 = 1 - a;
                outData[pix] = (inData[pix] * a2 + outData[pix] * a);
                outData[pix + 1] = (inData[pix + 1] * a2 + outData[pix + 1] * a);
                outData[pix + 2] = (inData[pix + 2] * a2 + outData[pix + 2] * a);
            }
        }

        fBlend = fn.name.indexOf('_svg_') === 0 ? pBlend : sBlend;

        for (y = 0; y < height; y += 1) {
            for (x = 0; x < width; x += 1) {
                pix = (y * width + x) * 4;
                if (y >= yi && x >= xi && x < xi + wi && y < yi + hi) {
                    pixIn = ((y - dy) * options.width + x - dx) * 4;
                    fBlend();
                } else {
                    outData[pix] = inData[pix];
                    outData[pix + 1] = inData[pix + 1];
                    outData[pix + 2] = inData[pix + 2];
                    outData[pix + 3] = inData[pix + 3];
                }
            }
        }
    }());
};

function _blend(inData, outData, width, height, options) {
    process(inData, outData, width, height, options);
}

function _wrap(type) {
    return function (inData, outData, width, height, options) {
        options.type = type;
        _blend(inData, outData, width, height, options);
    };
}

blend = (function () {
    var mode;
    var d = { blend: _blend };
    var modes = ['source-over', 'add', 'multiply', 'subtract', 'divide', 'screen',
            'lighten', 'darken', 'darker-color', 'lighter-color', 'linear-burn',
            'difference', 'exclusion', 'overlay', 'soft-light', 'hard-light',
            'color-dodge', 'color-burn', 'linear-light', 'vivid-light', 'pin-light',
            'hard-mix', 'hue', 'saturation', 'luminosity', 'color'];
    for (var i = 0; i < modes.length; i += 1) {
        mode = modes[i];
        d[mode] = _wrap(mode);
    }
    modes = Object.keys(modes);
    for (i = 0; i < modes.length; i += 1) {

    }
    // Aliases for the blending modes
    addAliases(d);

    d.getNativeModes = getNativeModes;
    d.realBlendMode = realBlendMode;

    return d;
}());

// MODULE SUPPORT ///////////////////////////////////////////////////////

module.exports = blend;

},{}],21:[function(require,module,exports){
'use strict';

var blend = require('./blend');
var process = require('./process');
var util = require('./util');

// Dictionary of blend modes that the client browser does or does not support.
var nativeBlendModes = blend.getNativeModes();

function createImageData(ctx, width, height) {
    if (ctx.createImageData) {
        return ctx.createImageData(width, height);
    } else {
        return ctx.getImageData(0, 0, width, height);
    }
}

// RENDERING.

// The Layer and ImageCanvas objects don't do any actual pixel operations themselves,
// they only contain information about the operations. The actual rendering is done
// by a Renderer object. Currently there is only one kind available, the CanvasRenderer,
// which uses the HTML Canvas object (containing the pixel data) and a 2D context that
// acts on this canvas object. In the future, a webgl renderer might be added as well.

var CanvasRenderer = {};

// Renders a html canvas as an html Image. Currently unused.
CanvasRenderer.toImage = function (canvas) {
    var img = new Image();
    img.width = canvas.width;
    img.height = canvas.height;
    img.src = canvas.toDataURL();
    return img;
};

// 'LOADING' OF LAYERS.

// Returns a html canvas dependent on the type of the layer provided.
CanvasRenderer.load = function (iCanvas, layer) {
    if (layer.isFill()) {
        return CanvasRenderer.generateColor(iCanvas, layer);
    } else if (layer.isGradient()) {
        return CanvasRenderer.generateGradient(iCanvas, layer);
    } else if (layer.isHtmlCanvas()) {
        return CanvasRenderer.loadHtmlCanvas(layer.data);
    } else if (layer.isImage()) {
        return CanvasRenderer.loadImage(layer.data);
    } else if (layer.isImageCanvas()) {
        return CanvasRenderer.loadImageCanvas(layer.data);
    }
};

// Passes a html canvas.
CanvasRenderer.loadHtmlCanvas = function (canvas) {
    return canvas;
};

// Returns a html canvas from rendering an ImageCanvas.
CanvasRenderer.loadImageCanvas = function (iCanvas) {
    return iCanvas.render();
};

// Returns a html canvas from rendering a stored Image file.
CanvasRenderer.loadImage = function (img) {
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    return canvas;
};

// Returns a html canvas with a solid fill color.
CanvasRenderer.generateColor = function (iCanvas, layer) {
    var width = layer.width !== undefined ? layer.width : iCanvas.width;
    var height = layer.height !== undefined ? layer.height : iCanvas.height;
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');

    canvas.width = width;
    canvas.height = height;
    ctx.fillStyle = layer.data;
    ctx.fillRect(0, 0, width, height);
    return canvas;
};

// Returns a html canvas with a gradient.
CanvasRenderer.generateGradient = function (iCanvas, layer) {
    var grd, x1, y1, x2, y2;
    var width = layer.width !== undefined ? layer.width : iCanvas.width;
    var height = layer.height !== undefined ? layer.height : iCanvas.height;
    var cx = width / 2;
    var cy = height / 2;
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
    var data = layer.data;
    var type = data.type || 'linear';
    var rotateDegrees = data.rotation || 0;

    if (type === 'radial') {
        grd = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.min(width, height) / 2);
    } else {
        // Rotation code taken from html5-canvas-gradient-creator:
        // Website: http://victorblog.com/html5-canvas-gradient-creator/
        // Code: https://github.com/evictor/html5-canvas-gradient-creator/blob/master/js/src/directive/previewCanvas.coffee
        if (rotateDegrees < 0) {
            rotateDegrees += 360;
        }
        if ((0 <= rotateDegrees && rotateDegrees < 45)) {
            x1 = 0;
            y1 = height / 2 * (45 - rotateDegrees) / 45;
            x2 = width;
            y2 = height - y1;
        } else if ((45 <= rotateDegrees && rotateDegrees < 135)) {
            x1 = width * (rotateDegrees - 45) / (135 - 45);
            y1 = 0;
            x2 = width - x1;
            y2 = height;
        } else if ((135 <= rotateDegrees && rotateDegrees < 225)) {
            x1 = width;
            y1 = height * (rotateDegrees - 135) / (225 - 135);
            x2 = 0;
            y2 = height - y1;
        } else if ((225 <= rotateDegrees && rotateDegrees < 315)) {
            x1 = width * (1 - (rotateDegrees - 225) / (315 - 225));
            y1 = height;
            x2 = width - x1;
            y2 = 0;
        } else if (315 <= rotateDegrees) {
            x1 = 0;
            y1 = height - height / 2 * (rotateDegrees - 315) / (360 - 315);
            x2 = width;
            y2 = height - y1;
        }
        grd = ctx.createLinearGradient(x1, y1, x2, y2);
    }
    grd.addColorStop(data.spread || 0, data.startColor);
    grd.addColorStop(1, data.endColor);

    canvas.width = width;
    canvas.height = height;
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, width, height);
    return canvas;
};

// PROCESSING OF LAYERS.

// Performs a number of filtering operations on an html image.
CanvasRenderer.processImage = function (canvas, filters) {
    if (filters.length === 0) {
        return canvas;
    }
    var filter, tmpData;
    var ctx = canvas.getContext('2d');
    var width = canvas.width;
    var height = canvas.height;
    var inData = ctx.getImageData(0, 0, width, height);
    var outData = createImageData(ctx, width, height);

    for (var i = 0; i < filters.length; i += 1) {
        if (i > 0) {
            tmpData = inData;
            inData = outData;
            outData = tmpData;
        }
        filter = filters[i];
        process[filter.name](inData.data, outData.data, width, height, filter.options);
    }

    ctx.putImageData(outData, 0, 0);
    return canvas;
};

// Renders the layer mask and applies it to the layer that it is supposed to mask.
CanvasRenderer.processMask = function (canvas, mask) {
    if (mask.layers.length === 0) {
        return canvas;
    }
    mask.width = canvas.width;
    mask.height = canvas.height;
    // First, make a black and white version of the masking canvas and pass
    // the result to the masking operation.
    var c = CanvasRenderer.renderBW(mask);
    var data = c.getContext('2d').getImageData(0, 0, c.width, c.height).data;
    var maskFilter = {name: 'mask', options: {data: data, x: 0, y: 0, width: c.width, height: c.height} };
    return CanvasRenderer.processImage(canvas, [maskFilter]);
};

// Processes a single layer. First the layer image is loaded, then a mask (if applicable) is applied to it,
// and finally the filters (if any) are applied to it.
CanvasRenderer.processLayer = function (iCanvas, layer) {
    var layerImage = CanvasRenderer.load(iCanvas, layer);
    var maskedImage = CanvasRenderer.processMask(layerImage, layer.mask);
    return CanvasRenderer.processImage(maskedImage, layer.filters);
};


// LAYER TRANFORMATIONS.


// Transforms the 2d context that acts upon this layer's image. Utility function. -> Rename this?
function transformLayer(ctx, iCanvas, layer) {
    var m = layer.transform.matrix();

    ctx.translate(iCanvas.width / 2, iCanvas.height / 2);
    ctx.transform(m[0], m[1], m[3], m[4], m[6], m[7]);
    if (layer.flip_h || layer.flip_v) {
        ctx.scale(layer.flip_h ? -1 : 1, layer.flip_v ? -1 : 1);
    }
    ctx.translate(-layer.img.width / 2, -layer.img.height / 2);
}

// Transforms the bounds of a layer (the bounding rectangle) and returns the bounding rectangle
// that encloses this transformed rectangle.
function transformRect(iCanvas, layer) {
    var pt, minx, miny, maxx, maxy;
    var width = layer.img.width;
    var height = layer.img.height;
    var p1 = {x: 0, y: 0};
    var p2 = {x: width, y: 0};
    var p3 = {x: 0, y: height};
    var p4 = {x: width, y: height};
    var points = [p1, p2, p3, p4];

    var t = util.transform();
    t = t.translate(iCanvas.width / 2, iCanvas.height / 2);
    t = t.append(layer.transform);
    t = t.translate(-layer.img.width / 2, -layer.img.height / 2);

    for (var i = 0; i < 4; i += 1) {
        pt = t.transformPoint(points[i]);
        if (i === 0) {
            minx = maxx = pt.x;
            miny = maxy = pt.y;
        } else {
            if (pt.x < minx) {
                minx = pt.x;
            }
            if (pt.x > maxx) {
                maxx = pt.x;
            }
            if (pt.y < miny) {
                miny = pt.y;
            }
            if (pt.y > maxy) {
                maxy = pt.y;
            }
        }
    }
    return {x: minx, y: miny, width: maxx - minx, height: maxy - miny};
}

// Calculates the intersecting rectangle of two input rectangles.
function rectIntersect(r1, r2) {
    var right1 = r1.x + r1.width;
    var bottom1 = r1.y + r1.height;
    var right2 = r2.x + r2.width;
    var bottom2 = r2.y + r2.height;

    var x = Math.max(r1.x, r2.x);
    var y = Math.max(r1.y, r2.y);
    var w = Math.max(Math.min(right1, right2) - x, 0);
    var h = Math.max(Math.min(bottom1, bottom2) - y, 0);
    return {x: x, y: y, width: w, height: h};
}

// Calculates the mimimal area that a transformed layer needs so that it
// can still be drawn on the canvas. Returns a rectangle.
function calcLayerRect(iCanvas, layer) {
    var rect = transformRect(iCanvas, layer);
    rect = rectIntersect(rect, {x: 0, y: 0, width: iCanvas.width, height: iCanvas.height});
    return { x: Math.round(rect.x),
        y: Math.round(rect.y),
        width: Math.ceil(rect.width),
        height: Math.ceil(rect.height)};
}

// Transforms a layer and returns the resulting pixel data.
function getTransformedLayerData(iCanvas, layer, rect) {
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
    canvas.width = rect.width;
    canvas.height = rect.height;
    ctx.translate(-rect.x, -rect.y);
    transformLayer(ctx, iCanvas, layer);
    ctx.drawImage(layer.img, 0, 0);
    return ctx.getImageData(0, 0, rect.width, rect.height);
}


// LAYER BLENDING.

// Blends the subsequent layer images with the base layer and returns a single image.
// This method is used when web workers aren't available for use on this system.
CanvasRenderer.mergeManualBlend = function (iCanvas, layerData) {
    return function (canvas) {
        var layer, blendMode, blendData, tmpData, layerOptions, rect;
        var ctx = canvas.getContext('2d');
        var width = iCanvas.width;
        var height = iCanvas.height;
        var baseData = ctx.getImageData(0, 0, width, height);
        var outData = createImageData(ctx, width, height);
        for (var i = 0; i < layerData.length; i += 1) {
            layer = layerData[i];
            rect = calcLayerRect(iCanvas, layer);
            if (rect.width > 0 && rect.height > 0) {
                if (i > 0) {
                    tmpData = baseData;
                    baseData = outData;
                    outData = tmpData;
                }
                blendData = getTransformedLayerData(iCanvas, layer, rect);
                layerOptions = {data: blendData.data, width: rect.width, height: rect.height, opacity: layer.opacity, dx: rect.x, dy: rect.y};
                if (blend[layer.blendmode] === undefined) {
                    throw new Error('No blend mode named \'' + layer.blendmode + '\'');
                }
                blendMode = blend.realBlendMode(layer.blendmode);
                blend[blendMode](baseData.data, outData.data, width, height, layerOptions);
            }
        }
        ctx.putImageData(outData, 0, 0);
        return canvas;
    };
};

// Renders a single layer. This is useful when there's only one layer available (and no blending is needed)
// or to render the base layer on which subsequent layers are blended.
CanvasRenderer.singleLayerWithOpacity = function (iCanvas, layer) {
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');

    canvas.width = iCanvas.width;
    canvas.height = iCanvas.height;

    ctx.save();
    transformLayer(ctx, iCanvas, layer);
    if (layer.opacity !== 1) {
        ctx.globalAlpha = layer.opacity;
    }
    ctx.drawImage(layer.img, 0, 0);
    ctx.restore();
    return canvas;
};

// Blends the subsequent layer images with the base layer and returns the resulting image.
// This method is used when the system supports the requested blending mode(s).
CanvasRenderer.mergeNativeBlend = function (iCanvas, layerData) {
    return function (canvas) {
        var ctx = canvas.getContext('2d');
        var layer;
        for (var i = 0; i < layerData.length; i += 1) {
            layer = layerData[i];
            ctx.save();
            transformLayer(ctx, iCanvas, layer);
            if (layer.opacity !== 1) {
                ctx.globalAlpha = layer.opacity;
            }
            if (layer.blendmode !== 'source-over') {
                ctx.globalCompositeOperation = blend.realBlendMode(layer.blendmode);
            }
            ctx.drawImage(layer.img, 0, 0);
            ctx.restore();
        }
        return canvas;
    };
};

CanvasRenderer.createRenderPipe = function (Renderer, iCanvas, layerData) {
    var mode, useNative, currentList, layer;
    var renderPipe = [];

    function pushList() {
        if (useNative !== undefined) {
            var fn = useNative ? Renderer.mergeNativeBlend : Renderer.mergeManualBlend;
            renderPipe.push(fn(iCanvas, currentList));
        }
    }

    for (var i = 1; i < layerData.length; i += 1) {
        layer = layerData[i];
        mode = layer.blendmode;
        // todo: handle blendmode aliases.
        if (useNative === undefined || useNative !== nativeBlendModes[mode]) {
            pushList();
            currentList = [];
        }
        currentList.push(layer);
        useNative = nativeBlendModes[mode];
        if (i === layerData.length - 1) {
            pushList();
        }
    }
    return renderPipe;
};

// Merges the different canvas layers together in a single image and returns this as a html canvas.
CanvasRenderer.merge = function (iCanvas, layerData) {
    var renderPipe = CanvasRenderer.createRenderPipe(CanvasRenderer, iCanvas, layerData);
    var canvas = CanvasRenderer.singleLayerWithOpacity(iCanvas, layerData[0]);
    for (var i = 0; i < renderPipe.length; i += 1) {
        canvas = renderPipe[i](canvas);
    }
    return canvas;
};

CanvasRenderer.composite = function (iCanvas, layerData) {
    if (!layerData || layerData.length === 0) {
        return null;
    }
    if (layerData.length === 1) {
        return CanvasRenderer.singleLayerWithOpacity(iCanvas, layerData[0]);
    }

    return CanvasRenderer.merge(iCanvas, layerData);
};

// Returns an object with additional layer information as well as the input images
// to be passed to the different processing functions.
CanvasRenderer.getLayerData = function (iCanvas, layerImages) {
    var d, layer, layerImg;
    var layerData = [];
    for (var i = 0; i < layerImages.length; i += 1) {
        layer = iCanvas.layers[i];
        layerImg = layerImages[i];
        d = { img: layerImg,
            opacity: layer.opacity,
            blendmode: layer.blendmode,
            transform: layer.transform,
            flip_h: layer.flip_h, flip_v: layer.flip_v
        };
        layerData.push(d);
    }
    return layerData;
};

// Renders the image canvas. Top level.
CanvasRenderer.render = function (iCanvas) {
    var layerImages = [];
    for (var i = 0; i < iCanvas.layers.length; i += 1) {
        layerImages.push(CanvasRenderer.processLayer(iCanvas, iCanvas.layers[i]));
    }
    return CanvasRenderer.composite(iCanvas, CanvasRenderer.getLayerData(iCanvas, layerImages));
};

// Renders the image canvas and turns it into a black and white image. Useful for rendering a layer mask.
CanvasRenderer.renderBW = function (iCanvas) {
    var canvas = CanvasRenderer.render(iCanvas);
    var data = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height).data;
    var bwFilter = {name: 'desaturate', options: {method: 'ITU-R BT.709'}};
    return CanvasRenderer.processImage(canvas, [bwFilter]);
};

module.exports = CanvasRenderer;

},{"./blend":20,"./process":23,"./util":24}],22:[function(require,module,exports){
'use strict';

var util = require('./util');
var CanvasRenderer = require('./canvasrenderer');
var AsyncRenderer = require('./asyncrenderer');

var img, ImageCanvas, Layer, Img;

var DEFAULT_WIDTH = 800;
var DEFAULT_HEIGHT = 800;

// Different layer types.
var TYPE_PATH = 'path';
var TYPE_IMAGE = 'image';
var TYPE_HTML_CANVAS = 'htmlCanvas';
var TYPE_IMAGE_CANVAS = 'iCanvas';
var TYPE_FILL = 'fill';
var TYPE_GRADIENT = 'gradient';

var IDENTITY_TRANSFORM = util.transform();
var Transform = IDENTITY_TRANSFORM;

var clamp = util.clamp;

// Named colors supported by all browsers.
// See: http://www.w3schools.com/html/html_colornames.asp
var colors = ['aliceblue', 'antiquewhite', 'aqua', 'aquamarine', 'azure', 'beige', 'bisque', 'black', 'blanchedalmond', 'blue', 'blueviolet', 'brown', 'burlywood', 'cadetblue', 'chartreuse', 'chocolate', 'coral', 'cornflowerblue', 'cornsilk', 'crimson', 'cyan', 'darkblue', 'darkcyan', 'darkgoldenrod', 'darkgray', 'darkgreen', 'darkkhaki', 'darkmagenta', 'darkolivegreen', 'darkorange', 'darkorchid', 'darkred', 'darksalmon', 'darkseagreen', 'darkslateblue', 'darkslategray', 'darkturquoise', 'darkviolet', 'deeppink', 'deepskyblue', 'dimgray', 'dimgrey', 'dodgerblue', 'firebrick', 'floralwhite', 'forestgreen', 'fuchsia', 'gainsboro', 'ghostwhite', 'gold', 'goldenrod', 'gray', 'green', 'greenyellow', 'grey', 'honeydew', 'hotpink', 'indianred', 'indigo', 'ivory', 'khaki', 'lavender', 'lavenderblush', 'lawngreen', 'lemonchiffon', 'lightblue', 'lightcoral', 'lightcyan', 'lightgoldenrodyellow', 'lightgreen', 'lightgrey', 'lightpink', 'lightsalmon', 'lightseagreen', 'lightskyblue', 'lightslategray', 'lightsteelblue', 'lightyellow', 'lime', 'limegreen', 'linen', 'maroon', 'mediumaquamarine', 'mediumblue', 'mediumorchid', 'mediumpurple', 'mediumseagreen', 'mediumslateblue', 'mediumspringgreen', 'mediumturquoise', 'mediumvioletred', 'midnightblue', 'mintcream', 'mistyrose', 'moccasin', 'navajowhite', 'navy', 'oldlace', 'olive', 'olivedrab', 'orange', 'orangered', 'orchid', 'palegoldenrod', 'palegreen', 'paleturquoise', 'palevioletred', 'papayawhip', 'peachpuff', 'peru', 'pink', 'plum', 'powderblue', 'purple', 'red', 'rosybrown', 'royalblue', 'saddlebrown', 'salmon', 'sandybrown', 'seagreen', 'seashell', 'sienna', 'silver', 'skyblue', 'slateblue', 'slategray', 'snow', 'springgreen', 'steelblue', 'tan', 'teal', 'thistle', 'tomato', 'transparent', 'turquoise', 'violet', 'wheat', 'white', 'whitesmoke', 'yellow', 'yellowgreen'];


// Converts a number of arguments to a type of color argument that the html canvas context can understand:
// a named color, a hex color or a string in the form of rgba(r, g, b, a)
function toColor(v1, v2, v3, v4, v5) {
    var _r, _g, _b, _a, R, G, B, rgb, options;
    if (v1 === undefined) {
        _r = _g = _b = 0;
        _a = 1;
    } else if (Array.isArray(v1)) {
        options = v2 || {};
        _r = v1[0] !== undefined ? v1[0] : 0;
        _g = v1[1] !== undefined ? v1[1] : 0;
        _b = v1[2] !== undefined ? v1[2] : 0;
        _a = v1[3] !== undefined ? v1[3] : options.base || 1;
    } else if (v1.r !== undefined) {
        options = v2 || {};
        _r = v1.r;
        _g = v1.g;
        _b = v1.b;
        _a = v1.a !== undefined ? v1.a : options.base || 1;
    } else if (typeof v1 === 'string') {
        if (v1.indexOf('#') === 0) {
            return v1;
        }
        if (v1.indexOf('rgb') === 0) {
            return v1;
        }
        if (colors.indexOf(v1) !== -1) {
            return v1;
        }
    } else if (typeof v1 === 'number') {
        if (arguments.length === 1) { // Grayscale value
            _r = _g = _b = v1;
            _a = 1;
        } else if (arguments.length === 2) { // Gray and alpha or options
            _r = _g = _b = v1;
            if (typeof v2 === 'number') {
                _a = v2;
            } else {
                options = v2;
                _a = options.base || 1;
            }
        } else if (arguments.length === 3) { // RGB or gray, alpha and options
            if (typeof v3 === 'number') {
                _r = v1;
                _g = v2;
                _b = v3;
                _a = 1;
            } else {
                _r = _g = _b = v1;
                _a = v2;
                options = v3;
            }
        } else if (arguments.length === 4) { // RGB and alpha or options
            _r = v1;
            _g = v2;
            _b = v3;
            if (typeof v4 === 'number') {
                _a = v4;
            } else {
                options = v4 || {};
                _a = options.base || 1;
            }
        } else { // RGBA + options
            _r = v1;
            _g = v2;
            _b = v3;
            _a = v4;
            options = v5;
        }
    }

    if (!(typeof _r === 'number' &&
        typeof _g === 'number' &&
        typeof _b === 'number' &&
        typeof _a === 'number')) {
        throw new Error('Invalid color arguments');
    }

    options = options || {};

    // The base option allows you to specify values in a different range.
    if (options.base !== undefined) {
        _r /= options.base;
        _g /= options.base;
        _b /= options.base;
        _a /= options.base;
    }
    R = Math.round(_r * 255);
    G = Math.round(_g * 255);
    B = Math.round(_b * 255);
    return 'rgba(' + R + ', ' + G + ', ' + B + ', ' + _a + ')';
}

// Converts a number of arguments into a dictionary of gradient information that is understood by the renderer.
function toGradientData(v1, v2, v3, v4, v5) {
    var startColor, endColor, type, rotation, spread, d;
    var data = {};

    if (arguments.length === 1) { // The argument is a dictionary or undefined.
        d = v1 || {};
        startColor = d.startColor;
        endColor = d.endColor;
        type = d.type;
        rotation = d.rotation;
        spread = d.spread;
    } else if (arguments.length >= 2) { // The first two arguments are a start color and an end color.
        startColor = v1;
        endColor = v2;
        type = 'linear';
        rotation = 0;
        spread = 0;
        if (arguments.length === 3) {
            if (typeof v3 === 'string') { // The type can be either linear or radial.
                type = v3;
            } else if (typeof v3 === 'number') { // The type is implicitly linear and the third argument is the rotation angle.
                rotation = v3;
            }
        } else if (arguments.length === 4) {
            if (typeof v3 === 'number') { // The type is implicitly linear and the third/forth arguments are the rotation angle and gradient spread.
                rotation = v3;
                spread = v4;
            } else if (v3 === 'linear') { // The type is explicitly linear and the forth argument is the rotation angle.
                rotation = v4;
            } else if (v3 === 'radial') { // The type is explicitly radial and the forth argument is the gradient spread.
                type = v3;
                spread = v4;
            } else {
                throw new Error('Wrong argument provided: ' + v3);
            }
        } else if (arguments.length === 5) { // Type, rotation (unused in case of radial type gradient), and gradient spread.
            type = v3;
            rotation = v4;
            spread = v5;
        }
    }

    if (!startColor && startColor !== 0) {
        throw new Error('No startColor was given.');
    }
    if (!endColor && endColor !== 0) {
        throw new Error('No endColor was given.');
    }

    try {
        data.startColor = toColor(startColor);
    } catch (e1) {
        throw new Error('startColor is not a valid color: ' + startColor);
    }

    try {
        data.endColor = toColor(endColor);
    } catch (e2) {
        throw new Error('endColor is not a valid color: ' + endColor);
    }

    if (type === undefined) {
        type = 'linear';
    }
    if (type !== 'linear' && type !== 'radial') {
        throw new Error('Unknown gradient type: ' + type);
    }

    data.type = type;

    if (spread === undefined) {
        spread = 0;
    }
    if (typeof spread !== 'number') {
        throw new Error('Spread value is not a number: ' + spread);
    }

    if (type === 'linear') {
        if (rotation === undefined) {
            rotation = 0;
        }
        if (typeof rotation !== 'number') {
            throw new Error('Rotation value is not a number: ' + rotation);
        }
        data.rotation = rotation;
    }

    data.spread = clamp(spread, 0, 0.99);

    return data;
}

function findType(data) {
    if (typeof data === 'string') {
        return TYPE_PATH;
    } else if (data instanceof Image) {
        return TYPE_IMAGE;
    } else if (data instanceof HTMLCanvasElement) {
        return TYPE_HTML_CANVAS;
    } else if (data instanceof ImageCanvas) {
        return TYPE_IMAGE_CANVAS;
    } else if (data.r !== undefined && data.g !== undefined && data.b !== undefined && data.a !== undefined) {
        return TYPE_FILL;
    } else if (data.startColor !== undefined && data.endColor !== undefined) {
        return TYPE_GRADIENT;
    }
    throw new Error('Cannot establish type for data ', data);
}


// IMAGE LAYER.

Layer = function (data, type) {
    if (!type) {
        type = findType(data);
    }
    this.data = data;
    this.type = type;

    if (type === TYPE_HTML_CANVAS || type === TYPE_IMAGE_CANVAS || type === TYPE_IMAGE) {
        this.width = data.width;
        this.height = data.height;
    }

    // Compositing.
    this.opacity = 1.0;
    this.blendmode = 'source-over';

    // Transformations.
    this.transform = IDENTITY_TRANSFORM;
    this.flip_h = false;
    this.flip_v = false;

    // An alpha mask hides parts of the masked layer where the mask is darker.
    this.mask = new ImageCanvas();

    this.filters = [];
};

Layer.Transform = Layer.IDENTITY_TRANSFORM = IDENTITY_TRANSFORM;

// Copies the layer object.
Layer.prototype.clone = function () {
    function cloneFilter(filter) {
        var key, value;
        var f = {};
        f.name = filter.name;
        if (filter.options !== undefined) {
            f.options = {};
            var optionsKeys = Object.keys(filter.options);
            for (var i = 0; i < optionsKeys.length; i += 1) {
                key = optionsKeys[i];
                value = filter.options[key];
                if (Array.isArray(value)) {
                    f.options[key] = value.slice(0);
                } else {
                    f.options[key] = value;
                }
            }
        }
        return f;
    }

    var d = Object.create(Layer.prototype);
    d.data = this.data;
    d.type = this.type;
    d.width = this.width;
    d.height = this.height;
    d.opacity = this.opacity;
    d.blendmode = this.blendmode;
    d.transform = this.transform;
    d.flip_h = this.flip_h;
    d.flip_v = this.flip_v;
    d.mask = this.mask.clone();
    d.filters = [];

    if (this.type === TYPE_IMAGE_CANVAS) {
        d.data = this.data.clone();
    } else if (this.type === TYPE_GRADIENT) {
        d.data = {
            startColor: this.data.startColor,
            endColor: this.data.endColor,
            type: this.data.type,
            rotation: this.data.rotation,
            spread: this.data.spread
        };
    }

    for (var i = 0; i < this.filters.length; i += 1) {
        d.filters.push(cloneFilter(this.filters[i]));
    }

    return d;
};

// Sets the opacity of the layer (requires a number in the range 0.0-1.0).
Layer.prototype.setOpacity = function (opacity) {
    this.opacity = clamp(opacity, 0, 1);
};

// Within an image canvas, a layer is by default positioned in the center.
// Translating moves the layer away from this center.
// Each successive call to the translate function performs an additional translation on top of the current transformation matrix.
Layer.prototype.translate = function (tx, ty) {
    ty = ty === undefined ? 0 : ty;
    var t = Transform.translate(tx, ty);
    this.transform = this.transform.prepend(t);
};

// Scaling happens relatively in a 0.0-1.0 based range where 1.0 stands for 100%.
// Each successive call to the scale function performs an additional scaling operation on top of the current transformation matrix.
// If only one parameter is supplied, the layer is scaled proportionally.
Layer.prototype.scale = function (sx, sy) {
    sy = sy === undefined ? sx : sy;
    var t = Transform.scale(sx, sy);
    this.transform = this.transform.prepend(t);
};

// The supplied parameter should be in degrees (not radians).
// Each successive call to the rotation function performs an additional rotation on top of the current transformation matrix.
Layer.prototype.rotate = function (rot) {
    var t = Transform.rotate(rot);
    this.transform = this.transform.prepend(t);
};

// Each successive call to the skew function performs an additional skewing operation on top of the current transformation matrix.
Layer.prototype.skew = function (kx, ky) {
    ky = ky === undefined ? kx : ky;
    var t = Transform.skew(kx, ky);
    this.transform = this.transform.prepend(t);
};

// Flips the layer horizontally.
Layer.prototype.flipHorizontal = function (arg) {
    if (arg !== undefined) {
        this.flip_h = arg;
    } else {
        this.flip_h = !this.flip_h;
    }
};

// Flips the layer vertically.
Layer.prototype.flipVertical = function (arg) {
    if (arg !== undefined) {
        this.flip_v = arg;
    } else {
        this.flip_v = !this.flip_v;
    }
};

Layer.prototype.addFilter = function (filter, options) {
    this.filters.push({
        name: filter,
        options: options
    });
};

// Renders the layer to a new canvas.
Layer.prototype.draw = function (ctx) {
    var width = this.width === undefined ? DEFAULT_WIDTH : this.width;
    var height = this.height === undefined ? DEFAULT_HEIGHT : this.height;
    var canvas = new ImageCanvas(width, height);
    canvas.addLayer(this);
    canvas.draw(ctx);
};

Layer.prototype.toCanvas = function () {
    var canvas = document.createElement('canvas');
    canvas.width = this.width;
    canvas.height = this.height;
    var ctx = canvas.getContext('2d');
    this.draw(ctx);
    return canvas;
};

Layer.fromFile = function (filename) {
    return new Layer(filename, TYPE_PATH);
};

Layer.fromImage = function (image) {
    return new Layer(image, TYPE_IMAGE);
};

Layer.fromCanvas = function (canvas) {
    if (canvas instanceof HTMLCanvasElement) {
        return Layer.fromHtmlCanvas(canvas);
    }
    return Layer.fromImageCanvas(canvas);
};

Layer.fromHtmlCanvas = function (canvas) {
    return new Layer(canvas, TYPE_HTML_CANVAS);
};

Layer.fromImageCanvas = function (iCanvas) {
    return new Layer(iCanvas, TYPE_IMAGE_CANVAS);
};

Layer.fromColor = function (color) {
    return new Layer(toColor(color), TYPE_FILL);
};

Layer.fromGradient = function () {
    return new Layer(toGradientData.apply(null, arguments), TYPE_GRADIENT);
};

Layer.prototype.isPath = function () {
    return this.type === TYPE_PATH;
};

Layer.prototype.isFill = function () {
    return this.type === TYPE_FILL;
};

Layer.prototype.isGradient = function () {
    return this.type === TYPE_GRADIENT;
};

Layer.prototype.isHtmlCanvas = function () {
    return this.type === TYPE_HTML_CANVAS;
};

Layer.prototype.isImage = function () {
    return this.type === TYPE_IMAGE;
};

Layer.prototype.isImageCanvas = function () {
    return this.type === TYPE_IMAGE_CANVAS;
};


// IMAGE PIXELS.

var Pixels = function (canvas) {
    this.width = canvas.width;
    this.height = canvas.height;
    var ctx = canvas.getContext('2d');
    this._data = ctx.getImageData(0, 0, this.width, this.height);
    this.array = this._data.data;
};

Pixels.prototype.get = function (i) {
    i *= 4;
    var v = this.array;
    return [v[i + 0], v[i + 1], v[i + 2], v[i + 3]];
};

Pixels.prototype.set = function (i, rgba) {
    i *= 4;
    var v = this.array;
    v[i + 0] = rgba[0];
    v[i + 1] = rgba[1];
    v[i + 2] = rgba[2];
    v[i + 3] = rgba[3];
};

Pixels.prototype.toCanvas = function () {
    var canvas = document.createElement('canvas');
    canvas.width = this.width;
    canvas.height = this.height;
    var ctx = canvas.getContext('2d');
    ctx.putImageData(this._data, 0, 0);
    return canvas;
};


// IMAGE CANVAS.

ImageCanvas = function (width, height) {
    if (!width) {
        width = DEFAULT_WIDTH;
    }
    if (!height) {
        height = DEFAULT_HEIGHT;
    }

    this.width = width;
    this.height = height;
    this.layers = [];
};

// Copies the ImageCanvas.
ImageCanvas.prototype.clone = function () {
    var c = new ImageCanvas(this.width, this.height);
    for (var i = 0; i < this.layers.length; i += 1) {
        c.layers.push(this.layers[i].clone());
    }
    return c;
};

// Creates a new layer from figuring out the given argument(s) and adds it to the canvas.
ImageCanvas.prototype.addLayer = function (arg0) {
    var layer;

    try {
        return this.addGradientLayer.apply(this, arguments);
    } catch (e1) {
    }

    try {
        return this.addColorLayer.apply(this, arguments);
    } catch (e2) {
    }

    if (arguments.length === 1) {
        if (typeof arg0 === 'string') {
            layer = new Layer(arg0, TYPE_PATH);
        } else if (arg0 instanceof Layer) {
            layer = arg0;
        } else if (arg0 instanceof HTMLCanvasElement) {
            layer = new Layer(arg0, TYPE_HTML_CANVAS);
        } else if (arg0 instanceof Image) {
            layer = new Layer(arg0, TYPE_IMAGE);
        } else if (arg0 instanceof ImageCanvas) {
            layer = new Layer(arg0, TYPE_IMAGE_CANVAS);
        }
    }

    if (!layer) {
        throw new Error('Error creating layer.');
    }

    this.layers.push(layer);
    return layer;
};

// Adds a new color layer to the canvas.
ImageCanvas.prototype.addColorLayer = function () {
    var c = toColor.apply(null, arguments);
    var layer = new Layer(c, TYPE_FILL);
    this.layers.push(layer);
    return layer;
};

// Adds a new gradient layer to the canvas.
ImageCanvas.prototype.addGradientLayer = function () {
    var c = toGradientData.apply(null, arguments);
    var layer = new Layer(c, TYPE_GRADIENT);
    this.layers.push(layer);
    return layer;
};

// Renders the canvas and passes the result (a html canvas) to the given callback function.
ImageCanvas.prototype.render = function (callback) {
    var renderer = callback ? AsyncRenderer : CanvasRenderer;
    return renderer.render(this, callback);
};

// Renders the canvas on another canvas.
ImageCanvas.prototype.draw = function (ctx, callback) {
    if (callback) {
        this.render(function (canvas) {
            ctx.drawImage(canvas, 0, 0, canvas.width, canvas.height);
        });
    } else {
        var canvas = this.render();
        ctx.drawImage(canvas, 0, 0, canvas.width, canvas.height);
    }
};


// Img

function isPoint(arg) {
    if (!arg) { return false; }
    return arg.x !== undefined && arg.y !== undefined;
}

function pointFromArray(arg) {
    var x = arg[0];
    var y = arg.length > 1 ? arg[1] : x;
    return {x: x, y: y};
}

function pointFromNumber(arg) {
    return {x: arg, y: arg};
}

function isValidArg(arg) {
    return arg !== undefined && arg !== null;
}

function convertArg(arg) {
    if (Array.isArray(arg)) {
        return pointFromArray(arg);
    } else if (typeof arg === 'number') {
        return pointFromNumber(arg);
    } else if (isPoint(arg)) {
        return arg;
    }
}

Img = function (canvas, x, y) {
    this.canvas = canvas;
    this.originalWidth = canvas ? canvas.width : 0;
    this.originalHeight = canvas ? canvas.height: 0;
    this.transform = x || y ? Transform.translate(x, y) : Layer.IDENTITY_TRANSFORM;
};

Img.prototype.clone = function () {
    var n = new Img();
    n.canvas = this.canvas;
    n.originalWidth = this.originalWidth;
    n.originalHeight = this.originalHeight;
    n.transform = this.transform;
    return n;
};

Img.prototype.withCanvas = function (canvas) {
    var n = this.clone();
    n.canvas = canvas;
    return n;
};

Img.prototype._transform = function (t) {
    var n = this.clone();
    n.transform = n.transform.prepend(t);
    return n;
};

Img.prototype.translate = function (position) {
    var t = pointFromNumber(0);
    var args = arguments;
    if (args.length === 1 && isValidArg(position)) {
        t = convertArg(position);
    } else if (args.length === 2) {
        t = {x: args[0], y: args[1]};
    }
    if (t.x === 0 && t.y === 0) { return this; }
    return this._transform(Transform.translate(t.x, t.y));
};

Img.prototype.rotate = function (angle) {
    if (!angle) { return this; }
    var o = pointFromNumber(0);
    var args = arguments;
    if (args.length === 2) {
        o = convertArg(args[1]);
    } else if (args.length === 3) {
        o = {x: args[1], y: args[2]};
    }
    return this._transform(Transform.translate(o.x, o.y).rotate(angle).translate(-o.x, -o.y));
};

Img.prototype.scale = function (scale) {
    var s = pointFromNumber(1);
    var o = pointFromNumber(0);
    var args = arguments;
    if (args.length === 1 && isValidArg(scale)) {
        s = convertArg(scale);
    } else if (args.length === 2) {
        if (typeof scale === 'number' && typeof args[1] === 'number') {
            s = {x: args[0], y: args[1]};
        } else {
            s = convertArg(scale);
            o = convertArg(args[1]);
        }
    } else if (args.length === 4) {
        s = {x: args[0], y: args[1]};
        o = {x: args[2], y: args[3]};
    }
    if (s.x === 1 && s.y === 1) { return this; }
    return this._transform(Transform.translate(o.x, o.y).scale(s.x, s.y).translate(-o.x, -o.y));
};

Img.prototype.skew = function (skew) {
    var k = pointFromNumber(0);
    var o = pointFromNumber(0);
    var args = arguments;
    if (args.length === 1 && isValidArg(skew)) {
        k = convertArg(skew);
    } else if (args.length === 2) {
        if (typeof skew === 'number' && typeof args[1] === 'number') {
            k = {x: args[0], y: args[1]};
        } else {
            k = convertArg(skew);
            o = convertArg(args[1]);
        }
    } else if (args.length === 4) {
        k = {x: args[0], y: args[1]};
        o = {x: args[2], y: args[3]};
    }
    if (k.x === 0 && k.y === 0) { return this; }
    return this._transform(Transform.translate(o.x, o.y).skew(k.x, k.y).translate(-o.x, -o.y));
};

Img.prototype.transformed = function () {
    return img.merge([this]);
};

Img.prototype.bounds = function () {
    var t = this.transform;
    var x = this.originalWidth / 2;
    var y = this.originalHeight / 2;

    var p1 = {x: -x, y: -y};
    var p2 = {x: x, y: -y};
    var p3 = {x: -x, y: y};
    var p4 = {x: x, y: y};
    var points = [p1, p2, p3, p4];
    var pt, minx, miny, maxx, maxy;

    for (var i = 0; i < 4; i += 1) {
        pt = t.transformPoint(points[i]);
        if (i === 0) {
            minx = maxx = pt.x;
            miny = maxy = pt.y;
        } else {
            if (pt.x < minx) {
                minx = pt.x;
            }
            if (pt.x > maxx) {
                maxx = pt.x;
            }
            if (pt.y < miny) {
                miny = pt.y;
            }
            if (pt.y > maxy) {
                maxy = pt.y;
            }
        }
    }
    return {x: minx, y: miny, width: maxx - minx, height: maxy - miny};
};

Img.prototype.colorize = function (color) {
    var colorLayer = Layer.fromColor(color);
    colorLayer.width = this.originalWidth;
    colorLayer.height = this.originalHeight;
    var i = new Img(colorLayer.toCanvas());
    i = i._transform(this.transform.matrix());
    return img.merge([this, i]);
};

Img.prototype.desaturate = function (options) {
    var layer = this.toLayer(false);
    layer.addFilter('desaturate', options);
    return this.withCanvas(layer.toCanvas());
};

Img.prototype.crop = function (bounding) {
    // Calculates the intersecting rectangle of two input rectangles.
    function rectIntersect(r1, r2) {
        var right1 = r1.x + r1.width,
            bottom1 = r1.y + r1.height,
            right2 = r2.x + r2.width,
            bottom2 = r2.y + r2.height,

            x = Math.max(r1.x, r2.x),
            y = Math.max(r1.y, r2.y),
            w = Math.max(Math.min(right1, right2) - x, 0),
            h = Math.max(Math.min(bottom1, bottom2) - y, 0);
        return {x: x, y: y, width: w, height: h};
    }

    var iBounds = this.bounds();
    var bounds = bounding.bounds();
    var ri = rectIntersect(iBounds, bounds);
    var width = Math.ceil(ri.width);
    var height = Math.ceil(ri.height);

    if (ri.width === 0 || ri.height === 0) {
        throw new Error('Resulting image has no dimensions');
    }

    var canvas = new img.ImageCanvas(width, height);
    var l1 = canvas.addLayer(this.toLayer());
    l1.translate(width / 2 - bounds.width - bounds.x,
        height / 2 - bounds.height - bounds.y);
    if (width < bounds.width && ri.x > iBounds.x) {
        l1.translate(bounds.width - width, 0);
    }
    if (height < bounds.height && ri.y > iBounds.y) {
        l1.translate(0, bounds.height - height);
    }

    return new Img(canvas.render(), ri.x + width / 2, ri.y + height / 2);
};

Img.prototype.draw = function (ctx) {
    ctx.save();
    var m = this.transform.matrix();
    ctx.transform(m[0], m[1], m[3], m[4], m[6], m[7]);
    ctx.translate(-this.originalWidth / 2, -this.originalHeight / 2);
    ctx.drawImage(this.canvas, 0, 0);
    ctx.restore();
};

Img.prototype.toLayer = function (copyTransformations) {
    var canvas = document.createElement('canvas');
    canvas.width = this.canvas.width;
    canvas.height = this.canvas.height;
    var ctx = canvas.getContext('2d');
    ctx.drawImage(this.canvas, 0, 0);
    var layer = img.Layer.fromHtmlCanvas(canvas);
    if (copyTransformations === undefined) {
        copyTransformations = true;
    }
    if (copyTransformations) {
        layer.transform = this.transform;
    }
    return layer;
};

Img.prototype.getPixels = function () {
    return new Pixels(this.canvas);
};

Img.prototype.toImage = function () {
    var b = this.bounds();
    var cropped = this.crop({bounds: function() { return b; }});
    var i = new Image();
    i.width = cropped.canvas.width;
    i.height = cropped.canvas.height;
    i.src = cropped.canvas.toDataURL();
    return i;
};

img = {};
img.Layer = Layer;
img.ImageCanvas = ImageCanvas;
img.Img = Img;
img.Pixels = Pixels;

// MODULE SUPPORT ///////////////////////////////////////////////////////

var async = require('async');

function loadImage(image, callback) {
    var img = new Image();
    img.onload = function () {
        callback(null, [image, this]);
    };
    img.src = image;
}

function loadImages(images, callback) {
    async.map(images,
        loadImage, function (err, loadedImages) {
            if (callback) {
                var name, image;
                var d = {};
                for (var i = 0; i < loadedImages.length; i += 1) {
                    name = loadedImages[i][0];
                    image = loadedImages[i][1];
                    d[name] = image;
                }
                callback(d);
            }
        });
}

function rectUnite(r1, r2) {
    var x = Math.min(r1.x, r2.x),
        y = Math.min(r1.y, r2.y),
        width = Math.max(r1.x + r1.width, r2.x + r2.width) - x,
        height = Math.max(r1.y + r1.height, r2.y + r2.height) - y;
    return {x: x, y: y, width: width, height: height};
}

function merge(images) {
    var i, image, b, l;
    for (i = 0; i < images.length; i += 1) {
        image = images[i];
        if (i === 0) {
            b = image.bounds();
        } else {
            b = rectUnite(b, image.bounds());
        }
    }
    var dx = b.width / 2 + b.x;
    var dy = b.height / 2 + b.y;

    var canvas = new ImageCanvas(b.width, b.height);
    for (i = 0; i < images.length; i += 1) {
        l = canvas.addLayer(images[i].toLayer());
        l.translate(-dx, -dy);
    }
    return new Img(canvas.render(), dx, dy);
}

img.loadImages = loadImages;
img.merge = merge;

module.exports = img;

},{"./asyncrenderer":19,"./canvasrenderer":21,"./util":24,"async":1}],23:[function(require,module,exports){
/*!
 * Image processing based on Pixastic library:
 *
 * Pixastic - JavaScript Image Processing
 * http://pixastic.com/
 * Copyright 2012, Jacob Seidelin
 *
 * Dual licensed under the MPL 1.1 or GPLv3 licenses.
 * http://pixastic.com/license-mpl.txt
 * http://pixastic.com/license-gpl-3.0.txt
 *
 */

'use strict';

var stackblur = require('stackblur');
var util = require('./util');

var clamp = util.clamp;

var LUMINOSITY_ITU_R_BT601 = 'ITU-R BT.601';
var LUMINOSITY_ITU_R_BT709 = 'ITU-R BT.709';

function defaultOptions(options, defaults) {
    if (!options) {
        return defaults;
    }
    var opt, o = {};
    for (opt in defaults) {
        if (defaults.hasOwnProperty(opt)) {
            if (typeof options[opt] === 'undefined') {
                o[opt] = defaults[opt];
            } else {
                o[opt] = options[opt];
            }
        }
    }
    return o;
}

function smoothstep(a, b, x) {
    /* Returns a smooth transition between 0.0 and 1.0 using Hermite interpolation (cubic spline),
     * where x is a number between a and b. The return value will ease (slow down) as x nears a or b.
     * For x smaller than a, returns 0.0. For x bigger than b, returns 1.0.
     */
    if (x < a) { return 0.0; }
    if (x >=b) { return 1.0; }
    x = (x - a) / ( b - a);
    return x * x * (3 - 2 * x);
}

function noise() {
    return Math.random() * 0.5 + 0.5;
}

function colorDistance(scale, dest, src) {
    return clamp(scale * dest + (1 - scale) * src, 0, 255);
}

function convolve3x3(inData, outData, width, height, kernel, alpha, invert, mono) {
    var x, y, n = width * height * 4,
        idx, r, g, b, a,
        pyc, pyp, pyn,
        pxc, pxp, pxn,

        k00 = kernel[0][0], k01 = kernel[0][1], k02 = kernel[0][2],
        k10 = kernel[1][0], k11 = kernel[1][1], k12 = kernel[1][2],
        k20 = kernel[2][0], k21 = kernel[2][1], k22 = kernel[2][2],

        p00, p01, p02,
        p10, p11, p12,
        p20, p21, p22;

    for (y = 0; y < height; y += 1) {
        pyc = y * width * 4;
        pyp = pyc - width * 4;
        pyn = pyc + width * 4;

        if (y < 1) {
            pyp = pyc;
        }
        if (y >= width - 1) {
            pyn = pyc;
        }

        for (x = 0; x < width; x += 1) {
            idx = (y * width + x) * 4;

            pxc = x * 4;
            pxp = pxc - 4;
            pxn = pxc + 4;

            if (x < 1) {
                pxp = pxc;
            }
            if (x >= width - 1) {
                pxn = pxc;
            }

            p00 = pyp + pxp;
            p01 = pyp + pxc;
            p02 = pyp + pxn;
            p10 = pyc + pxp;
            p11 = pyc + pxc;
            p12 = pyc + pxn;
            p20 = pyn + pxp;
            p21 = pyn + pxc;
            p22 = pyn + pxn;

            r = inData[p00] * k00 + inData[p01] * k01 + inData[p02] * k02 +
                inData[p10] * k10 + inData[p11] * k11 + inData[p12] * k12 +
                inData[p20] * k20 + inData[p21] * k21 + inData[p22] * k22;

            g = inData[p00 + 1] * k00 + inData[p01 + 1] * k01 + inData[p02 + 1] * k02 +
                inData[p10 + 1] * k10 + inData[p11 + 1] * k11 + inData[p12 + 1] * k12 +
                inData[p20 + 1] * k20 + inData[p21 + 1] * k21 + inData[p22 + 1] * k22;

            b = inData[p00 + 2] * k00 + inData[p01 + 2] * k01 + inData[p02 + 2] * k02 +
                inData[p10 + 2] * k10 + inData[p11 + 2] * k11 + inData[p12 + 2] * k12 +
                inData[p20 + 2] * k20 + inData[p21 + 2] * k21 + inData[p22 + 2] * k22;

            if (alpha) {
                a = inData[p00 + 3] * k00 + inData[p01 + 3] * k01 + inData[p02 + 3] * k02 +
                    inData[p10 + 3] * k10 + inData[p11 + 3] * k11 + inData[p12 + 3] * k12 +
                    inData[p20 + 3] * k20 + inData[p21 + 3] * k21 + inData[p22 + 3] * k22;
            } else {
                a = inData[idx + 3];
            }

            if (mono) {
                r = g = b = (r + g + b) / 3;
            }
            if (invert) {
                r = 255 - r;
                g = 255 - g;
                b = 255 - b;
            }

            outData[idx] = r;
            outData[idx + 1] = g;
            outData[idx + 2] = b;
            outData[idx + 3] = a;
        }
    }
}

function convolve5x5(inData, outData, width, height, kernel, alpha, invert, mono) {
    var x, y, n = width * height * 4,
        idx, r, g, b, a,
        pyc, pyp, pyn, pypp, pynn,
        pxc, pxp, pxn, pxpp, pxnn,

        k00 = kernel[0][0], k01 = kernel[0][1], k02 = kernel[0][2], k03 = kernel[0][3], k04 = kernel[0][4],
        k10 = kernel[1][0], k11 = kernel[1][1], k12 = kernel[1][2], k13 = kernel[1][3], k14 = kernel[1][4],
        k20 = kernel[2][0], k21 = kernel[2][1], k22 = kernel[2][2], k23 = kernel[2][3], k24 = kernel[2][4],
        k30 = kernel[3][0], k31 = kernel[3][1], k32 = kernel[3][2], k33 = kernel[3][3], k34 = kernel[3][4],
        k40 = kernel[4][0], k41 = kernel[4][1], k42 = kernel[4][2], k43 = kernel[4][3], k44 = kernel[4][4],

        p00, p01, p02, p03, p04,
        p10, p11, p12, p13, p14,
        p20, p21, p22, p23, p24,
        p30, p31, p32, p33, p34,
        p40, p41, p42, p43, p44;

    for (y = 0; y < height; y += 1) {
        pyc = y * width * 4;
        pyp = pyc - width * 4;
        pypp = pyc - width * 4 * 2;
        pyn = pyc + width * 4;
        pynn = pyc + width * 4 * 2;

        if (y < 1) {
            pyp = pyc;
        }
        if (y >= width - 1) {
            pyn = pyc;
        }
        if (y < 2) {
            pypp = pyp;
        }
        if (y >= width - 2) {
            pynn = pyn;
        }

        for (x = 0; x < width; x += 1) {
            idx = (y * width + x) * 4;

            pxc = x * 4;
            pxp = pxc - 4;
            pxn = pxc + 4;
            pxpp = pxc - 8;
            pxnn = pxc + 8;

            if (x < 1) {
                pxp = pxc;
            }
            if (x >= width - 1) {
                pxn = pxc;
            }
            if (x < 2) {
                pxpp = pxp;
            }
            if (x >= width - 2) {
                pxnn = pxn;
            }

            p00 = pypp + pxpp;
            p01 = pypp + pxp;
            p02 = pypp + pxc;
            p03 = pypp + pxn;
            p04 = pypp + pxnn;
            p10 = pyp + pxpp;
            p11 = pyp + pxp;
            p12 = pyp + pxc;
            p13 = pyp + pxn;
            p14 = pyp + pxnn;
            p20 = pyc + pxpp;
            p21 = pyc + pxp;
            p22 = pyc + pxc;
            p23 = pyc + pxn;
            p24 = pyc + pxnn;
            p30 = pyn + pxpp;
            p31 = pyn + pxp;
            p32 = pyn + pxc;
            p33 = pyn + pxn;
            p34 = pyn + pxnn;
            p40 = pynn + pxpp;
            p41 = pynn + pxp;
            p42 = pynn + pxc;
            p43 = pynn + pxn;
            p44 = pynn + pxnn;

            r = inData[p00] * k00 + inData[p01] * k01 + inData[p02] * k02 + inData[p03] * k04 + inData[p02] * k04 +
                inData[p10] * k10 + inData[p11] * k11 + inData[p12] * k12 + inData[p13] * k14 + inData[p12] * k14 +
                inData[p20] * k20 + inData[p21] * k21 + inData[p22] * k22 + inData[p23] * k24 + inData[p22] * k24 +
                inData[p30] * k30 + inData[p31] * k31 + inData[p32] * k32 + inData[p33] * k34 + inData[p32] * k34 +
                inData[p40] * k40 + inData[p41] * k41 + inData[p42] * k42 + inData[p43] * k44 + inData[p42] * k44;

            g = inData[p00 + 1] * k00 + inData[p01 + 1] * k01 + inData[p02 + 1] * k02 + inData[p03 + 1] * k04 + inData[p02 + 1] * k04 +
                inData[p10 + 1] * k10 + inData[p11 + 1] * k11 + inData[p12 + 1] * k12 + inData[p13 + 1] * k14 + inData[p12 + 1] * k14 +
                inData[p20 + 1] * k20 + inData[p21 + 1] * k21 + inData[p22 + 1] * k22 + inData[p23 + 1] * k24 + inData[p22 + 1] * k24 +
                inData[p30 + 1] * k30 + inData[p31 + 1] * k31 + inData[p32 + 1] * k32 + inData[p33 + 1] * k34 + inData[p32 + 1] * k34 +
                inData[p40 + 1] * k40 + inData[p41 + 1] * k41 + inData[p42 + 1] * k42 + inData[p43 + 1] * k44 + inData[p42 + 1] * k44;

            b = inData[p00 + 2] * k00 + inData[p01 + 2] * k01 + inData[p02 + 2] * k02 + inData[p03 + 2] * k04 + inData[p02 + 2] * k04 +
                inData[p10 + 2] * k10 + inData[p11 + 2] * k11 + inData[p12 + 2] * k12 + inData[p13 + 2] * k14 + inData[p12 + 2] * k14 +
                inData[p20 + 2] * k20 + inData[p21 + 2] * k21 + inData[p22 + 2] * k22 + inData[p23 + 2] * k24 + inData[p22 + 2] * k24 +
                inData[p30 + 2] * k30 + inData[p31 + 2] * k31 + inData[p32 + 2] * k32 + inData[p33 + 2] * k34 + inData[p32 + 2] * k34 +
                inData[p40 + 2] * k40 + inData[p41 + 2] * k41 + inData[p42 + 2] * k42 + inData[p43 + 2] * k44 + inData[p42 + 2] * k44;

            if (alpha) {
                a = inData[p00 + 3] * k00 + inData[p01 + 3] * k01 + inData[p02 + 3] * k02 + inData[p03 + 3] * k04 + inData[p02 + 3] * k04 +
                    inData[p10 + 3] * k10 + inData[p11 + 3] * k11 + inData[p12 + 3] * k12 + inData[p13 + 3] * k14 + inData[p12 + 3] * k14 +
                    inData[p20 + 3] * k20 + inData[p21 + 3] * k21 + inData[p22 + 3] * k22 + inData[p23 + 3] * k24 + inData[p22 + 3] * k24 +
                    inData[p30 + 3] * k30 + inData[p31 + 3] * k31 + inData[p32 + 3] * k32 + inData[p33 + 3] * k34 + inData[p32 + 3] * k34 +
                    inData[p40 + 3] * k40 + inData[p41 + 3] * k41 + inData[p42 + 3] * k42 + inData[p43 + 3] * k44 + inData[p42 + 3] * k44;
            } else {
                a = inData[idx + 3];
            }

            if (mono) {
                r = g = b = (r + g + b) / 3;
            }

            if (invert) {
                r = 255 - r;
                g = 255 - g;
                b = 255 - b;
            }

            outData[idx] = r;
            outData[idx + 1] = g;
            outData[idx + 2] = b;
            outData[idx + 3] = a;
        }
    }
}

function gaussian(inData, outData, width, height, kernelSize) {
    var x, y, i, j, n = width * height * 4,
        r, g, b, a, idx,
        inx, iny, w,
        tmpData = [],
        maxKernelSize = 13,
        k1, k2, weights,
        kernels = [
            [1]
        ];

    kernelSize = clamp(kernelSize, 3, maxKernelSize);
    k1 = -kernelSize / 2 + (kernelSize % 2 ? 0.5 : 0);
    k2 = kernelSize + k1;

    for (i = 1; i < maxKernelSize; i += 1) {
        kernels[0][i] = 0;
    }

    for (i = 1; i < maxKernelSize; i += 1) {
        kernels[i] = [1];
        for (j = 1; j < maxKernelSize; j += 1) {
            kernels[i][j] = kernels[i - 1][j] + kernels[i - 1][j - 1];
        }
    }

    weights = kernels[kernelSize - 1];

    for (i = 0, w = 0; i < kernelSize; i += 1) {
        w += weights[i];
    }
    for (i = 0; i < kernelSize; i += 1) {
        weights[i] /= w;
    }

    // pass 1
    for (y = 0; y < height; y += 1) {
        for (x = 0; x < width; x += 1) {
            r = g = b = a = 0;

            for (i = k1; i < k2; i += 1) {
                inx = x + i;
                iny = y;
                w = weights[i - k1];

                if (inx < 0) {
                    inx = 0;
                }
                if (inx >= width) {
                    inx = width - 1;
                }

                idx = (iny * width + inx) * 4;

                r += inData[idx] * w;
                g += inData[idx + 1] * w;
                b += inData[idx + 2] * w;
                a += inData[idx + 3] * w;

            }

            idx = (y * width + x) * 4;

            tmpData[idx] = r;
            tmpData[idx + 1] = g;
            tmpData[idx + 2] = b;
            tmpData[idx + 3] = a;
        }
    }

    // pass 2
    for (y = 0; y < height; y += 1) {
        for (x = 0; x < width; x += 1) {
            r = g = b = a = 0;

            for (i = k1; i < k2; i += 1) {
                inx = x;
                iny = y + i;
                w = weights[i - k1];

                if (iny < 0) {
                    iny = 0;
                }
                if (iny >= height) {
                    iny = height - 1;
                }

                idx = (iny * width + inx) * 4;

                r += tmpData[idx] * w;
                g += tmpData[idx + 1] * w;
                b += tmpData[idx + 2] * w;
                a += tmpData[idx + 3] * w;
            }

            idx = (y * width + x) * 4;

            outData[idx] = r;
            outData[idx + 1] = g;
            outData[idx + 2] = b;
            outData[idx + 3] = a;
        }
    }
}

function getPixel(v, i) {
    i *= 4;
    return [v[i + 0], v[i + 1], v[i + 2], v[i + 3]];
}

function setPixel(v, i, rgba) {
    i *= 4;
    v[i + 0] = rgba[0];
    v[i + 1] = rgba[1];
    v[i + 2] = rgba[2];
    v[i + 3] = rgba[3];
}

// Polar filters (distortion filters) are from canvas.js: https://github.com/clips/pattern/blob/master/pattern/canvas.js (BSD)
// De Smedt T. & Daelemans W. (2012). Pattern for Python. Journal of Machine Learning Research.
// Based on: L. Spagnolini, 2007

function polar(inData, outData, x0, y0, width, height, callback) {
    /* Sets image data based on a polar coordinates filter.
     * The given callback is a function(distance, angle) that returns new [distance, angle].
     */
    x0 = width / 2 + (x0 || 0);
    y0 = height / 2 + (y0 || 0);
    var y1, x1, x, y, d, a, v;
    for (y1 = 0; y1 < height; y1 += 1) {
        for (x1 = 0; x1 < width; x1 += 1) {
            x = x1 - x0;
            y = y1 - y0;
            d = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
            a = Math.atan2(y, x);
            v = callback(d, a);
            d = v[0];
            a = v[1];
            setPixel(outData, x1 + y1 * width, getPixel(inData,
                Math.round(x0 + Math.cos(a) * d) +
                Math.round(y0 + Math.sin(a) * d) * width
            ));
        }
    }
}

var process = {

    invert: function (inData, outData, width, height) {
        var i, n = width * height * 4;

        for (i = 0; i < n; i += 4) {
            outData[i] = 255 - inData[i];
            outData[i + 1] = 255 - inData[i + 1];
            outData[i + 2] = 255 - inData[i + 2];
            outData[i + 3] = inData[i + 3];
        }
    },

    sepia: function (inData, outData, width, height) {
        var i, n = width * height * 4,
            r, g, b;

        for (i = 0; i < n; i += 4) {
            r = inData[i];
            g = inData[i + 1];
            b = inData[i + 2];
            outData[i] = (r * 0.393 + g * 0.769 + b * 0.189);
            outData[i + 1] = (r * 0.349 + g * 0.686 + b * 0.168);
            outData[i + 2] = (r * 0.272 + g * 0.534 + b * 0.131);
            outData[i + 3] = inData[i + 3];
        }
    },

    solarize: function (inData, outData, width, height) {
        var i, n = width * height * 4,
            r, g, b;

        for (i = 0; i < n; i += 4) {
            r = inData[i];
            g = inData[i + 1];
            b = inData[i + 2];

            outData[i] = r > 127 ? 255 - r : r;
            outData[i + 1] = g > 127 ? 255 - g : g;
            outData[i + 2] = b > 127 ? 255 - b : b;
            outData[i + 3] = inData[i + 3];
        }
    },

    brightness: function (inData, outData, width, height, options) {
        options = defaultOptions(options, {
            brightness: 1,
            contrast: 0
        });

        var i, n = width * height * 4,
            r, g, b,
            contrast = clamp(options.contrast, -1, 1) / 2,
            brightness = 1 + clamp(options.brightness, -1, 1),
            brightMul = brightness < 0 ? -brightness : brightness,
            brightAdd = brightness < 0 ? 0 : brightness,
            contrastAdd;

        contrast = 0.5 * Math.tan((contrast + 1) * Math.PI / 4);
        contrastAdd = -(contrast - 0.5) * 255;

        for (i = 0; i < n; i += 4) {
            r = inData[i];
            g = inData[i + 1];
            b = inData[i + 2];

            r = (r + r * brightMul + brightAdd) * contrast + contrastAdd;
            g = (g + g * brightMul + brightAdd) * contrast + contrastAdd;
            b = (b + b * brightMul + brightAdd) * contrast + contrastAdd;

            outData[i] = r;
            outData[i + 1] = g;
            outData[i + 2] = b;
            outData[i + 3] = inData[i + 3];
        }
    },

    desaturate: function (inData, outData, width, height, options) {
        options = defaultOptions(options, {method: LUMINOSITY_ITU_R_BT601});
        var i, n = width * height * 4,
            level, rCoeff, gCoeff, bCoeff;

        if (options.method === LUMINOSITY_ITU_R_BT601) {
            rCoeff = 0.3; gCoeff = 0.59; bCoeff = 0.11;
        } else if (options.method === LUMINOSITY_ITU_R_BT709) {
            rCoeff = 0.2125; gCoeff = 0.7154; bCoeff = 0.0721;
        }

        for (i = 0; i < n; i += 4) {
            level = inData[i] * rCoeff + inData[i + 1] * gCoeff + inData[i + 2] * bCoeff;
            outData[i] = level;
            outData[i + 1] = level;
            outData[i + 2] = level;
            outData[i + 3] = inData[i + 3];
        }
    },

    lighten: function (inData, outData, width, height, options) {
        options = defaultOptions(options, {amount: 0.25});
        var i, n = width * height * 4,
            mul = 1 + clamp(options.amount, 0, 1);

        for (i = 0; i < n; i += 4) {
            outData[i] = inData[i] * mul;
            outData[i + 1] = inData[i + 1] * mul;
            outData[i + 2] = inData[i + 2] * mul;
            outData[i + 3] = inData[i + 3];
        }
    },

    noise: function (inData, outData, width, height, options) {
        options = defaultOptions(options, {amount: 0.5, strength: 0.5, mono: false});
        var i, n = width * height * 4,
            rnd, r, g, b,
            amount = clamp(options.amount, 0, 1),
            strength = clamp(options.strength, 0, 1),
            mono = !!options.mono,
            random = Math.random;

        for (i = 0; i < n; i += 4) {
            r = inData[i];
            g = inData[i + 1];
            b = inData[i + 2];

            rnd = random();

            if (rnd < amount) {
                if (mono) {
                    rnd = strength * ((rnd / amount) * 2 - 1) * 255;
                    r += rnd;
                    g += rnd;
                    b += rnd;
                } else {
                    r += strength * random() * 255;
                    g += strength * random() * 255;
                    b += strength * random() * 255;
                }
            }

            outData[i] = r;
            outData[i + 1] = g;
            outData[i + 2] = b;
            outData[i + 3] = inData[i + 3];
        }
    },

    flipv: function (inData, outData, width, height) {
        var x, y, n = width * height * 4,
            inPix, outPix;

        for (y = 0; y < height; y += 1) {
            for (x = 0; x < width; x += 1) {
                inPix = (y * width + x) * 4;
                outPix = (y * width + (width - x - 1)) * 4;

                outData[outPix] = inData[inPix];
                outData[outPix + 1] = inData[inPix + 1];
                outData[outPix + 2] = inData[inPix + 2];
                outData[outPix + 3] = inData[inPix + 3];
            }
        }
    },

    fliph: function (inData, outData, width, height) {
        var x, y, n = width * height * 4,
            inPix, outPix;

        for (y = 0; y < height; y += 1) {
            for (x = 0; x < width; x += 1) {
                inPix = (y * width + x) * 4;
                outPix = ((height - y - 1) * width + x) * 4;

                outData[outPix] = inData[inPix];
                outData[outPix + 1] = inData[inPix + 1];
                outData[outPix + 2] = inData[inPix + 2];
                outData[outPix + 3] = inData[inPix + 3];
            }
        }
    },

    // Uses fast stackblur algorithm from http://www.quasimondo.com/StackBlurForCanvas
    blur: function (inData, outData, width, height, options) {
        options = defaultOptions(options, {radius: 10});
        for (var i = 0; i < inData.length; i += 1) {
            outData[i] = inData[i];
        }
        stackblur(outData, width, height, options.radius);
    },

    glow: function (inData, outData, width, height, options) {
        options = defaultOptions(options, {amount: 0.75, kernelSize: 5});
        var i, n = width * height * 4,
            r, g, b,
            amount = options.amount,
            tmpData = [];

        gaussian(inData, tmpData, width, height, options.kernelSize);

        for (i = 0; i < n; i += 4) {
            r = inData[i] + tmpData[i] * amount;
            g = inData[i + 1] + tmpData[i + 1] * amount;
            b = inData[i + 2] + tmpData[i + 2] * amount;
            if (r > 255) {
                r = 255;
            }
            if (g > 255) {
                g = 255;
            }
            if (b > 255) {
                b = 255;
            }
            outData[i] = r;
            outData[i + 1] = g;
            outData[i + 2] = b;
            outData[i + 3] = inData[i + 3];
        }
    },

    convolve3x3: function (inData, outData, width, height, options) {
        convolve3x3(inData, outData, width, height, options.kernel);
    },

    convolve5x5: function (inData, outData, width, height, options) {
        convolve5x5(inData, outData, width, height, options.kernel);
    },

    // A 3x3 high-pass filter
    sharpen3x3: function (inData, outData, width, height, options) {
        options = defaultOptions(options, {strength: 1});
        var a = -clamp(options.strength, 0, 1);
        convolve3x3(inData, outData, width, height,
            [
                [a, a, a],
                [a, 1 - a * 8, a],
                [a, a, a]
            ]);
    },

    // A 5x5 high-pass filter
    sharpen5x5: function (inData, outData, width, height, options) {
        options = defaultOptions(options, {strength: 1});
        var a = -clamp(options.strength, 0, 1);
        convolve5x5(inData, outData, width, height,
            [
                [a, a, a, a, a],
                [a, a, a, a, a],
                [a, a, 1 - a * 24, a, a],
                [a, a, a, a, a],
                [a, a, a, a, a]
            ]);
    },

    // A 3x3 low-pass mean filter
    soften3x3: function (inData, outData, width, height) {
        var c = 1 / 9;
        convolve3x3(inData, outData, width, height,
            [
                [c, c, c],
                [c, c, c],
                [c, c, c]
            ]);
    },

    // A 5x5 low-pass mean filter
    soften5x5: function (inData, outData, width, height) {
        var c = 1 / 25;
        convolve5x5(inData, outData, width, height,
            [
                [c, c, c, c, c],
                [c, c, c, c, c],
                [c, c, c, c, c],
                [c, c, c, c, c],
                [c, c, c, c, c]
            ]);
    },

    // A 3x3 Cross edge-detect
    crossedges: function (inData, outData, width, height, options) {
        options = defaultOptions(options, {strength: 1});
        var a = clamp(options.strength, 0, 1) * 5;
        convolve3x3(inData, outData, width, height,
            [
                [ 0, -a, 0],
                [-a, 0, a],
                [ 0, a, 0]
            ],
            false, true);
    },

    // 3x3 directional emboss
    emboss: function (inData, outData, width, height, options) {
        options = defaultOptions(options, {amount: 1, angle: 0});
        var i, n = width * height * 4,
            amount = options.amount,
            angle = options.angle,
            x = Math.cos(-angle) * amount,
            y = Math.sin(-angle) * amount,

            a00 = -x - y,
            a10 = -x,
            a20 = y - x,
            a01 = -y,
            a21 = y,
            a02 = -y + x,
            a12 = x,
            a22 = y + x,

            tmpData = [];

        convolve3x3(inData, tmpData, width, height,
            [
                [a00, a01, a02],
                [a10, 0, a12],
                [a20, a21, a22]
            ]);

        for (i = 0; i < n; i += 4) {
            outData[i] = 128 + tmpData[i];
            outData[i + 1] = 128 + tmpData[i + 1];
            outData[i + 2] = 128 + tmpData[i + 2];
            outData[i + 3] = inData[i + 3];
        }
    },


    // A 3x3 Sobel edge detect (similar to Photoshop's)
    findedges: function (inData, outData, width, height) {
        var i, n = width * height * 4,
            gr1, gr2, gg1, gg2, gb1, gb2,
            data1 = [],
            data2 = [];

        convolve3x3(inData, data1, width, height,
            [
                [-1, 0, 1],
                [-2, 0, 2],
                [-1, 0, 1]
            ]);

        convolve3x3(inData, data2, width, height,
            [
                [-1, -2, -1],
                [ 0, 0, 0],
                [ 1, 2, 1]
            ]);

        for (i = 0; i < n; i += 4) {
            gr1 = data1[i];
            gr2 = data2[i];
            gg1 = data1[i + 1];
            gg2 = data2[i + 1];
            gb1 = data1[i + 2];
            gb2 = data2[i + 2];

            if (gr1 < 0) {
                gr1 = -gr1;
            }
            if (gr2 < 0) {
                gr2 = -gr2;
            }
            if (gg1 < 0) {
                gg1 = -gg1;
            }
            if (gg2 < 0) {
                gg2 = -gg2;
            }
            if (gb1 < 0) {
                gb1 = -gb1;
            }
            if (gb2 < 0) {
                gb2 = -gb2;
            }

            outData[i] = 255 - (gr1 + gr2) * 0.8;
            outData[i + 1] = 255 - (gg1 + gg2) * 0.8;
            outData[i + 2] = 255 - (gb1 + gb2) * 0.8;
            outData[i + 3] = inData[i + 3];
        }
    },

    // A 3x3 edge enhance
    edgeenhance3x3: function (inData, outData, width, height) {
        var c = -1 / 9;
        convolve3x3(inData, outData, width, height,
            [
                [c, c, c],
                [c, 17 / 9, c],
                [c, c, c]
            ]);
    },

    // A 5x5 edge enhance
    edgeenhance5x5: function (inData, outData, width, height) {
        var c = -1 / 25;
        convolve5x5(inData, outData, width, height,
            [
                [c, c, c, c, c],
                [c, c, c, c, c],
                [c, c, 49 / 25, c, c],
                [c, c, c, c, c],
                [c, c, c, c, c]
            ]);
    },

    // A 3x3 Laplacian edge-detect
    laplace3x3: function (inData, outData, width, height) {
        convolve3x3(inData, outData, width, height,
            [
                [-1, -1, -1],
                [-1, 8, -1],
                [-1, -1, -1]
            ],
            false, true, true);
    },

    // A 5x5 Laplacian edge-detect
    laplace5x5: function (inData, outData, width, height) {
        convolve5x5(inData, outData, width, height,
            [
                [-1, -1, -1, -1, -1],
                [-1, -1, -1, -1, -1],
                [-1, -1, 24, -1, -1],
                [-1, -1, -1, -1, -1],
                [-1, -1, -1, -1, -1]
            ],
            false, true, true);
    },

    rgbAdjust: function (inData, outData, width, height, options) {
        options = defaultOptions(options, {r: 0, g: 0, b: 0, a: 0});
        var i, n = width * height * 4,
            r, g, b, a,
            ar = clamp(options.r, -1, 1) * 255,
            ag = clamp(options.g, -1, 1) * 255,
            ab = clamp(options.b, -1, 1) * 255,
            aa = clamp(options.a, -1, 1) * 255;

        for (i = 0; i < n; i += 4) {
            r = inData[i] + ar;
            g = inData[i + 1] + ag;
            b = inData[i + 2] + ab;
            a = inData[i + 3] + aa;
            if (r < 0) {
                r = 0;
            }
            if (g < 0) {
                g = 0;
            }
            if (b < 0) {
                b = 0;
            }
            if (a < 0) {
                a = 0;
            }
            if (r > 255) {
                r = 255;
            }
            if (g > 255) {
                g = 255;
            }
            if (b > 255) {
                b = 255;
            }
            if (a > 255) {
                a = 255;
            }
            outData[i] = r;
            outData[i + 1] = g;
            outData[i + 2] = b;
            outData[i + 3] = a;
        }
    },

    colorfilter: function (inData, outData, width, height, options) {
        options = defaultOptions(options, {luminosity: false, r: 1, g: 0.5, b: 0});
        var i, n = width * height * 4,
            r, g, b,
            luminosity = !!options.luminosity,
            min, max, h, l, h1, chroma, tmp, m,
            ar = clamp(options.r, 0, 1),
            ag = clamp(options.g, 0, 1),
            ab = clamp(options.b, 0, 1);

        for (i = 0; i < n; i += 4) {
            r = inData[i] / 255;
            g = inData[i + 1] / 255;
            b = inData[i + 2] / 255;

            l = r * 0.3 + g * 0.59 + b * 0.11;

            r = (r + r * ar) / 2;
            g = (g + g * ag) / 2;
            b = (b + b * ab) / 2;

            if (luminosity) {
                min = max = r;
                if (g > max) {
                    max = g;
                }
                if (b > max) {
                    max = b;
                }
                if (g < min) {
                    min = g;
                }
                if (b < min) {
                    min = b;
                }
                chroma = (max - min);

                if (r === max) {
                    h = ((g - b) / chroma) % 6;
                } else if (g === max) {
                    h = ((b - r) / chroma) + 2;
                } else {
                    h = ((r - g) / chroma) + 4;
                }

                h1 = h >> 0;
                tmp = chroma * (h - h1);
                r = g = b = l - (r * 0.3 + g * 0.59 + b * 0.11);

                if (h1 === 0) {
                    r += chroma;
                    g += tmp;
                } else if (h1 === 1) {
                    r += chroma - tmp;
                    g += chroma;
                } else if (h1 === 2) {
                    g += chroma;
                    b += tmp;
                } else if (h1 === 3) {
                    g += chroma - tmp;
                    b += chroma;
                } else if (h1 === 4) {
                    r += tmp;
                    b += chroma;
                } else if (h1 === 5) {
                    r += chroma;
                    b += chroma - tmp;
                }
            }

            outData[i] = r * 255;
            outData[i + 1] = g * 255;
            outData[i + 2] = b * 255;
            outData[i + 3] = inData[i + 3];
        }
    },

    hslAdjust: function (inData, outData, width, height, options) {
        options = defaultOptions(options, {h: 0.5, s: 0.3, l: 0.1, a: 0});
        var i, n = width * height * 4,
            r, g, b, a,
            hue = clamp(options.h, -1, 1),
            saturation = clamp(options.s, -1, 1),
            lightness = clamp(options.l, -1, 1),
            aa = clamp(options.a, -1, 1) * 255,
            satMul = 1 + saturation * (saturation < 0 ? 1 : 2),
            lightMul = lightness < 0 ? 1 + lightness : 1 - lightness,
            lightAdd = lightness < 0 ? 0 : lightness * 255,
            vs, ms, vm, h, s, l, v, m, vmh, sextant;

        hue = (hue * 6) % 6;

        for (i = 0; i < n; i += 4) {

            r = inData[i];
            g = inData[i + 1];
            b = inData[i + 2];
            a = inData[i + 3] + aa;

            if (hue !== 0 || saturation !== 0) {
                // ok, here comes rgb to hsl + adjust + hsl to rgb, all in one jumbled mess.
                // It's not so pretty, but it's been optimized to get somewhat decent performance.
                // The transforms were originally adapted from the ones found in Graphics Gems, but have been heavily modified.
                vs = r;
                if (g > vs) {
                    vs = g;
                }
                if (b > vs) {
                    vs = b;
                }
                ms = r;
                if (g < ms) {
                    ms = g;
                }
                if (b < ms) {
                    ms = b;
                }
                vm = vs - ms;
                l = (ms + vs) / 510;

                if (l > 0 && vm > 0) {
                    if (l <= 0.5) {
                        s = vm / (vs + ms) * satMul;
                        if (s > 1) {
                            s = 1;
                        }
                        v = (l * (1 + s));
                    } else {
                        s = vm / (510 - vs - ms) * satMul;
                        if (s > 1) {
                            s = 1;
                        }
                        v = (l + s - l * s);
                    }
                    if (r === vs) {
                        if (g === ms) {
                            h = 5 + ((vs - b) / vm) + hue;
                        } else {
                            h = 1 - ((vs - g) / vm) + hue;
                        }
                    } else if (g === vs) {
                        if (b === ms) {
                            h = 1 + ((vs - r) / vm) + hue;
                        } else {
                            h = 3 - ((vs - b) / vm) + hue;
                        }
                    } else {
                        if (r === ms) {
                            h = 3 + ((vs - g) / vm) + hue;
                        } else {
                            h = 5 - ((vs - r) / vm) + hue;
                        }
                    }
                    if (h < 0) {
                        h += 6;
                    }
                    if (h >= 6) {
                        h -= 6;
                    }
                    m = (l + l - v);
                    sextant = h >> 0;
                    vmh = (v - m) * (h - sextant);
                    if (sextant === 0) {
                        r = v;
                        g = m + vmh;
                        b = m;
                    } else if (sextant === 1) {
                        r = v - vmh;
                        g = v;
                        b = m;
                    } else if (sextant === 2) {
                        r = m;
                        g = v;
                        b = m + vmh;
                    } else if (sextant === 3) {
                        r = m;
                        g = v - vmh;
                        b = v;
                    } else if (sextant === 4) {
                        r = m + vmh;
                        g = m;
                        b = v;
                    } else if (sextant === 5) {
                        r = v;
                        g = m;
                        b = v - vmh;
                    }

                    r *= 255;
                    g *= 255;
                    b *= 255;
                }
            }

            r = r * lightMul + lightAdd;
            g = g * lightMul + lightAdd;
            b = b * lightMul + lightAdd;

            if (r < 0) { r = 0; }
            if (g < 0) { g = 0; }
            if (b < 0) { b = 0; }
            if (a < 0) { a = 0; }
            if (r > 255) { r = 255; }
            if (g > 255) { g = 255; }
            if (b > 255) { b = 255; }
            if (a > 255) { a = 255; }

            outData[i] = r;
            outData[i + 1] = g;
            outData[i + 2] = b;
            outData[i + 3] = a;
        }
    },

    posterize: function (inData, outData, width, height, options) {
        options = defaultOptions(options, {levels: 5});
        var i, n = width * height * 4,
            r, g, b,
            numLevels = clamp(options.levels, 2, 256),
            numAreas = 256 / numLevels,
            numValues = 256 / (numLevels - 1);

        for (i = 0; i < n; i += 4) {
            outData[i] = numValues * ((inData[i] / numAreas) >> 0);
            outData[i + 1] = numValues * ((inData[i + 1] / numAreas) >> 0);
            outData[i + 2] = numValues * ((inData[i + 2] / numAreas) >> 0);
            outData[i + 3] = inData[i + 3];
        }
    },

    removenoise: function (inData, outData, width, height) {
        var x, y, n = width * height * 4,
            r, g, b, c, idx,
            pyc, pyp, pyn,
            pxc, pxp, pxn,
            minR, minG, minB, maxR, maxG, maxB;

        for (y = 0; y < height; y += 1) {
            pyc = y * width * 4;
            pyp = pyc - width * 4;
            pyn = pyc + width * 4;

            if (y < 1) {
                pyp = pyc;
            }
            if (y >= width - 1) {
                pyn = pyc;
            }

            for (x = 0; x < width; x += 1) {
                idx = (y * width + x) * 4;

                pxc = x * 4;
                pxp = pxc - 4;
                pxn = pxc + 4;

                if (x < 1) {
                    pxp = pxc;
                }
                if (x >= width - 1) {
                    pxn = pxc;
                }

                minR = maxR = inData[pyc + pxp];
                c = inData[pyc + pxn];
                if (c < minR) {
                    minR = c;
                }
                if (c > maxR) {
                    maxR = c;
                }
                c = inData[pyp + pxc];
                if (c < minR) {
                    minR = c;
                }
                if (c > maxR) {
                    maxR = c;
                }
                c = inData[pyn + pxc];
                if (c < minR) {
                    minR = c;
                }
                if (c > maxR) {
                    maxR = c;
                }

                minG = inData[pyc + pxp + 1];
                c = inData[pyc + pxn + 1];
                if (c < minG) {
                    minG = c;
                }
                c = inData[pyp + pxc + 1];
                if (c < minG) {
                    minG = c;
                }
                c = inData[pyn + pxc + 1];
                if (c < minG) {
                    minG = c;
                }

                minB = inData[pyc + pxp + 2];
                c = inData[pyc + pxn + 2];
                if (c < minB) {
                    minB = c;
                }
                c = inData[pyp + pxc + 2];
                if (c < minB) {
                    minB = c;
                }
                c = inData[pyn + pxc + 2];
                if (c < minB) {
                    minB = c;
                }

                r = inData[idx];
                g = inData[idx + 1];
                b = inData[idx + 2];

                if (r < minR) {
                    r = minR;
                }
                if (r > maxR) {
                    r = maxR;
                }
                if (g < minG) {
                    g = minG;
                }
                if (g > maxG) {
                    g = maxG;
                }
                if (b < minB) {
                    b = minB;
                }
                if (b > maxB) {
                    b = maxB;
                }

                outData[idx] = r;
                outData[idx + 1] = g;
                outData[idx + 2] = b;
                outData[idx + 3] = inData[idx + 3];
            }
        }
    },

    mosaic: function (inData, outData, width, height, options) {
        options = defaultOptions(options, {blockSize: 8});
        var blockSize = clamp(options.blockSize, 1, Math.max(width, height)),
            yBlocks = Math.ceil(height / blockSize),
            xBlocks = Math.ceil(width / blockSize),
            y0, y1, x0, x1, idx, pidx,
            i, j, bidx, r, g, b, bi, bj,
            n = yBlocks * xBlocks,
            prog, lastProg = 0;

        y0 = 0;
        bidx = 0;
        for (i = 0; i < yBlocks; i += 1) {
            y1 = clamp(y0 + blockSize, 0, height);
            x0 = 0;
            for(j = 0; j < xBlocks; j += 1) {
                x1 = clamp(x0 + blockSize, 0, width);

                idx = (y0 * width + x0) << 2;
                r = inData[idx];
                g = inData[idx + 1];
                b = inData[idx + 2];

                for(bi = y0; bi < y1; bi += 1) {
                   for(bj = x0; bj < x1; bj += 1) {
                       pidx = (bi * width + bj) << 2;
                       outData[pidx] = r;
                       outData[pidx + 1] = g;
                       outData[pidx + 2] = b;
                       outData[pidx + 3] = inData[pidx + 3];
                   }
                }
                x0 = x1;
                bidx += 1;
            }
            y0 = y1;
        }
    },

    equalize : function(inData, outData, width, height, options) {
        var n = width * height, p, i, level, ratio,
            prog, lastProg;
        var round = Math.round;
        // build histogram
        var pdf = new Array(256);
        for (i = 0; i < 256; i += 1) {
            pdf[i] = 0;
        }

        for (i = 0; i < n; i += 1) {
            p = i * 4;
            level = clamp(round(inData[p] * 0.3 + inData[p + 1] * 0.59 + inData[p + 2] * 0.11), 0, 255);
            outData[p + 3] = level;
            pdf[level] += 1;
        }

        // build cdf
        var cdf = new Array(256);
        cdf[0] = pdf[0];
        for(i = 1; i < 256; i += 1) {
            cdf[i] = cdf[i - 1] + pdf[i];
        }

        // normalize cdf
        for(i = 0; i < 256; i += 1) {
            cdf[i] = cdf[i] / n * 255.0;
        }

        // map the pixel values
        for (i = 0; i < n; i += 1) {
            p = i * 4;
            level = outData[p + 3];
            ratio = cdf[level] / (level || 1);
            outData[p] = clamp(round(inData[p] * ratio), 0, 255);
            outData[p + 1] = clamp(round(inData[p + 1] * ratio), 0, 255);
            outData[p + 2] = clamp(round(inData[p + 2] * ratio), 0, 255);
            outData[p + 3] = inData[p + 3];
        }
    },

    mask: function (inData, outData, width, height, options) {
        var i, n = width * height * 4,
            data = options.data;

        // todo: consider the masking image's dimensions and position.

        for (i = 0; i < n; i += 4) {
            outData[i] = inData[i];
            outData[i + 1] = inData[i + 1];
            outData[i + 2] = inData[i + 2];
            outData[i + 3] = inData[i + 3] * data[i] / 255 * data[i + 3] / 255;
        }
    },

    // Distortion filters

    bump: function (inData, outData, width, height, options) {
        /* options:
         *  - dx: horizontal offset (in pixels) of the effect.
         *  - dy: vertical offset (in pixels) of the effect.
         *  - radius: the radius of the effect in pixels.
         *  - zoom: the amount of bulge (0.0-1.0).
         */
        options = defaultOptions(options, {dx: 0, dy: 0, radius: 0, zoom: 0});
        var m1 = options.radius;
        var m2 = clamp(options.zoom, 0, 1);
        return polar(inData, outData, options.dx, options.dy, width, height, function (d, a) {
            return [d * smoothstep(0, m2, d / m1), a];
        });
    },

    dent: function (inData, outData, width, height, options) {
        /* options:
         *  - dx: horizontal offset (in pixels) of the effect.
         *  - dy: vertical offset (in pixels) of the effect.
         *  - radius: the radius of the effect in pixels.
         *  - zoom: the amount of pinch (0.0-1.0).
         */
        options = defaultOptions(options, {dx: 0, dy: 0, radius: 0, zoom: 0});
        var m1 = options.radius;
        var m2 = clamp(options.zoom, 0, 1);
        return polar(inData, outData, options.dx, options.dy, width, height, function (d, a) {
            return [2 * d - d * smoothstep(0, m2, d / m1), a];
        });
    },

    pinch: function (inData, outData, width, height, options) {
        /* options:
         *  - dx: horizontal offset (in pixels) of the effect.
         *  - dy: vertical offset (in pixels) of the effect.
         *  - zoom: the amount of bulge or pinch (-1.0-1.0):
         */
        options = defaultOptions(options, {dx: 0, dy: 0, zoom: 0});
        var m1 = util.distance(0, 0, width, height);
        var m2 = clamp(options.zoom * 0.75, -0.75, 0.75);
        return polar(inData, outData, options.dx, options.dy, width, height, function (d, a) {
            return [d * Math.pow(m1 / d, m2) * (1 - m2), a];
        });
    },

    splash: function (inData, outData, width, height, options) {
        /* options:
         *  - dx: horizontal offset (in pixels) of the effect.
         *  - dy: vertical offset (in pixels) of the effect.
         *  - radius: the radius of the unaffected area in pixels.
         */
        options = defaultOptions(options, {dx: 0, dy: 0, radius: 0});
        var m = options.radius;
        return polar(inData, outData, options.dx, options.dy, width, height, function (d, a) {
            return [(d > m)? m : d, a];
        });
    },

    twirl: function (inData, outData, width, height, options) {
        /* options:
         *  - dx: horizontal offset (in pixels) of the effect.
         *  - dy: vertical offset (in pixels) of the effect.
         *  - radius: the radius of the effect in pixels.
         *  - angle: the amount of rotation in degrees.
         */
        options = defaultOptions(options, {dx: 0, dy: 0, radius: 0, angle: 0});
        var m1 = util.radians(options.angle);
        var m2 = options.radius;
        return polar(inData, outData, options.dx, options.dy, width, height, function (d, a) {
            return [d, a + (1 - smoothstep(-m2, m2, d)) * m1];
        });
    }
};


// MODULE SUPPORT ///////////////////////////////////////////////////////

module.exports = process;

},{"./util":24,"stackblur":9}],24:[function(require,module,exports){
'use strict';

// UTILITIES.

function degrees(radians) {
    return radians * 180 / Math.PI;
}

function radians(degrees) {
    return degrees / 180 * Math.PI;
}

function distance(x0, y0, x1, y1) {
    return Math.sqrt(Math.pow(x1 - x0, 2) + Math.pow(y1 - y0, 2));
}

function clamp(val, min, max) {
    return Math.min(max, Math.max(min, val));
}

// Basic affine transform functionality.
function transform(m) {
    // Identity matrix.
    if (m === undefined) {
        m = [1, 0, 0, 0, 1, 0, 0, 0, 1];
    } else {
        m = m.slice();
    }

    // Performs the 3x3 matrix multiplication of the current matrix with the input matrix a.
    function _mmult(a, m) {
        m = m.slice();

        var m0 = m[0];
        var m1 = m[1];
        var m2 = m[2];
        var m3 = m[3];
        var m4 = m[4];
        var m5 = m[5];
        var m6 = m[6];
        var m7 = m[7];
        var m8 = m[8];

        m[0] = a[0] * m0 + a[1] * m3;
        m[1] = a[0] * m1 + a[1] * m4;
        m[3] = a[3] * m0 + a[4] * m3;
        m[4] = a[3] * m1 + a[4] * m4;
        m[6] = a[6] * m0 + a[7] * m3 + m6;
        m[7] = a[6] * m1 + a[7] * m4 + m7;

        return transform(m);
    }

    return {
        matrix: function () {
            return m.slice();
        },

        clone: function () {
            return transform(m);
        },

        prepend: function (t) {
            if (t.matrix) {
                t = t.matrix();
            }
            return _mmult(m, t);
        },

        append: function (t) {
            if (t.matrix) {
                t = t.matrix();
            }
            return _mmult(t, m);
        },

        translate: function (x, y) {
            return _mmult([1, 0, 0, 0, 1, 0, x, y, 1], m);
        },

        scale: function (x, y) {
            if (y === undefined) {
                y = x;
            }
            return _mmult([x, 0, 0, 0, y, 0, 0, 0, 1], m);
        },

        skew: function (x, y) {
            if (y === undefined) {
                y = x;
            }
            var kx = Math.PI * x / 180.0;
            var ky = Math.PI * y / 180.0;
            return _mmult([1, Math.tan(ky), 0, -Math.tan(kx), 1, 0, 0, 0, 1], m);
        },

        rotate: function (angle) {
            var c = Math.cos(radians(angle));
            var s = Math.sin(radians(angle));
            return _mmult([c, s, 0, -s, c, 0, 0, 0, 1], m);
        },

        transformPoint: function (point) {
            var x = point.x;
            var y = point.y;
            return {x: x * m[0] + y * m[3] + m[6],
                y: x * m[1] + y * m[4] + m[7]};
        }
    };
}

module.exports = {
    degrees: degrees,
    radians: radians,
    distance: distance,
    clamp: clamp,
    transform: transform
};

},{}],25:[function(require,module,exports){
'use strict';

var deepEqual = require('./deepequal');
var util = require('./util');
var g = {};

g.combine = function () {
    var i, l, result = [];
    for (i = 0; i < arguments.length; i++) {
        l = arguments[i];
        if (l) {
            result = result.concat(l);
        }
    }
    return result;
};

g.contains = function (l, value) {
    for (var i = 0; i < l.length; i += 1) {
        if (deepEqual.deepEqual(l[i], value)) {
            return true;
        }
    }
    return false;
};

g.cycle = function (l, length) {
    if (!l || length <= 0) { return []; }
    var newList = [];
    var ll = l.length;
    for (var i = 0; i < length; i += 1) {
        newList.push(l[i % ll]);
    }
    return newList;
};

g.equals = function (o1, o2) {
    return deepEqual.deepEqual(o1, o2);
};

g.count = function (l) {
    if (l && l.length) {
        return l.length;
    } else {
        return 0;
    }
};

g.cull = function (l, booleans) {
    if (!l) { return []; }
    if (!booleans) { return l; }
    var i, keep, results = [];
    for (i = 0; i < l.length; i++) {
        // Cycle through the list of boolean values.
        keep = booleans[i % booleans.length];
        if (keep) {
            results.push(l[i]);
        }
    }
    return results;
};

g.distinct = function(l) {
    if (!l) { return []; }
    var i, length, value,
        result = [],
        seen = [];
    for (i = 0, length = l.length; i < length; i += 1) {
        value = l[i];
        if (!g.contains(seen, value)) {
            seen.push(value);
            result.push(l[i]);
        }
    }
    return result;
};

g.first = function (l) {
    if (!l || l.length === 0) { return null; }
    return l[0];
};

g.get = function (l, i) {
    if (!l || l.length === 0) { return null; }
    return l[i];
};

g.interleave = function () {
    if (arguments.length === 0) return [];
    var results = [];
    var elIndex = 0;
    while (true) {
        for (var i = 0; i < arguments.length; i++) {
            var arg = arguments[i];
            if (arg.length > elIndex) {
                results.push(arg[elIndex]);
            } else {
                return results;
            }
        }
        elIndex += 1;
    }
};

g.last = function (l) {
    if (!l || l.length === 0) { return null; }
    return l[l.length - 1];
};

g.pick = function (l, amount, seed) {
    if (!l || l.length === 0 || amount <= 0) {
        return [];
    }
    if (!seed && seed !== 0) {
        seed = Math.random();
    }
    var rand = util.randomGenerator(seed || 0);
    var results = [];
    for (var i = 0; i < amount; i += 1) {
        results.push(l[Math.floor(rand(0, l.length))]);
    }
    return results;
};

g.randomSample = function (l, amount, seed) {
    if (!l || l.length === 0 || amount <= 0) {
        return [];
    }
    if (!seed && seed !== 0) {
        seed = Math.random();
    }
    var shuffledlist = g.shuffle(l, seed);
    if (!amount) { return shuffledlist; }
    return g.slice(shuffledlist, 0, amount);
};

g.repeat = function (l, amount, perItem) {
    if (!l) { return []; }
    if (!Array.isArray(l)) {
        l = [l];
    }
    if (amount <= 0) { return []; }
    var i, j, v,
        newList = [];
    if (!perItem) {
        for (i = 0; i < amount; i += 1) {
            newList.push.apply(newList, l);
        }
    } else {
        for (i = 0; i < l.length; i += 1) {
            v = l[i];
            for (j = 0; j < amount; j += 1) {
                newList.push(v);
            }
        }
    }
    return newList;
};

g.rest = function (l) {
    if (!l) { return []; }
    return l.slice(1);
};

g.reverse = function (l) {
    return l.slice().reverse();

};

g.second = function (l) {
    if (!l || l.length < 2) { return null; }
    return l[1];
};

g.shift = function (l, amount) {
    // If the amount is bigger than the number of items, wrap around.
    if (!l) { return []; }
    amount = amount % l.length;
    var head = l.slice(0, amount),
        result = l.slice(amount);
    result.push.apply(result, head);
    return result;
};

g.shuffle = function (l, seed) {
    var i, j, tmp, r;
    if (!seed && seed !== 0) {
        seed = Math.random();
    }
    r = util.randomGenerator(seed || 0);
    l = l.slice();
    for (i = l.length - 1; i > 0; i--) {
        j = Math.floor(r(0, i + 1));
        tmp = l[i];
        l[i] = l[j];
        l[j] = tmp;
    }
    return l;
};

g.slice = function (l, start, size, invert) {
    if (!l) { return []; }
    var firstList, secondList;
    if (!invert) {
        return l.slice(start, start + size);
    } else {
        firstList = l.slice(0, start);
        secondList = l.slice(start + size);
        firstList.push.apply(firstList, secondList);
        return firstList;
    }
};

g.sort = function (l, key) {
    if (key) {
        if (typeof key === 'string') {
            return l.slice().sort(function (a, b) {
                if (a[key] > b[key]) { return 1; }
                else if (a[key] === b[key]) { return 0; }
                else { return -1; }
            });
        } else if (typeof key === 'function') {
            return l.slice().sort(key);
        }
    }
    if (l && l[0] !== undefined && l[0] !== null && typeof l[0] === 'number') {
        return l.slice().sort(function (a, b) { return a - b; });
    }
    return l.slice().sort();
};

g.switch = function (index) {
    var nLists = (arguments.length - 1);
    index = index % nLists;
    if (index < 0) {
        index += nLists;
    }
    return arguments[index + 1];
};

g.takeEvery = function (l, n, offset) {
    var i, results = [];
    offset = offset || 0;
    for (i = 0; i < l.length; i += 1) {
        if (i % n === offset) {
            results.push(l[i]);
        }
    }
    return results;
};

g.zipMap = function (keys, vals) {
    var i, k, v,
        m = {},
        minLength = Math.min(keys.length, vals.length);
    for (i = 0; i < minLength; i += 1) {
        k = keys[i];
        v = vals[i];
        m[k] = v;
    }
    return m;
};

module.exports = g;

},{"./deepequal":15,"./util":28}],26:[function(require,module,exports){
'use strict';

var reduce = require('lodash.reduce');

var util = require('./util');
var vg = require('./vg/vg');

var g = {};

var TWO_PI = Math.PI * 2;

g.abs = Math.abs;

g.accumulate = function (values) {
    if (arguments.length > 1) {
        values = arguments;
    } else if (arguments.length === 1 && !Array.isArray(values)) {
        values = [values];
    }
    if (!values || values.length === 0) { return [0.0]; }
    var i, b = [],
        currentTotal = 0;
    for (i = 0; i < values.length; i++) {
        b.push(currentTotal);
        currentTotal += values[i];
    }
    return b;
};

g.add = function (a, b) {
    if (arguments.length === 2) { return a + b; }
    return reduce(arguments, function(total, n) {
        return total + n;
    }, 0);
};

g.and = function (bool1, bool2) {
    var argLength = arguments.length;
    if (argLength === 2) {
        return bool1 && bool2;
    } else if (argLength === 1) {
        return !!bool1;
    } else if (argLength === 0) {
        throw new Error('Wrong number of arguments');
    }
    return reduce(arguments, function(b1, b2) {
        return b1 && b2;
    }, true);
};

g.average = function (values) {
    if (arguments.length > 1) {
        values = arguments;
    } else if (arguments.length === 1 && !Array.isArray(values)) {
        values = [values];
    }
    if (!values || values.length === 0) { return 0; }
    var i, sum = 0;
    for (i = 0; i < values.length; i += 1) {
        sum += values[i];
    }
    return sum / values.length;
};

g.boolean = function (v) {
    return !!v;
};

g.ceil = Math.ceil;

g.clamp = function (v, min, max) {
    min = typeof min === 'number' ? min : 0;
    max = typeof max === 'number' ? max : 1;
    return v < min ? min : (v > max ? max : v);
};

g.compare = function (v1, v2, comparator) {
    if (comparator === '<') {
        return v1 < v2;
    } else if (comparator === '>') {
        return v1 > v2;
    } else if (comparator === '<=') {
        return v1 <= v2;
    } else if (comparator === '>=') {
        return v1 >= v2;
    } else if (comparator === '==') {
        return v1 === v2;
    } else if (comparator === '!=') {
        return v1 !== v2;
    }
    throw new Error('Unknown comparison operation ' + comparator);
};

g.cos = Math.cos;

g.degrees = function (radians) {
    return radians * 180 / Math.PI;
};

g.divide = function (a, b) {
    var argLength = arguments.length;
    function checkIfZero(arg) {
        if (arg === 0) {
            throw new Error('Divide by zero');
        }
    }
    if (argLength === 2) {
        checkIfZero(b);
        return a / b;
    } else if (argLength === 1) {
        checkIfZero(a);
        return 1 / a;
    } else if (argLength === 0) {
        throw new Error('Wrong number of arguments');
    }
    return reduce([].slice.call(arguments, 1), function(total, n) {
        checkIfZero(n);
        return total / n;
    }, arguments[0]);
};

g.e = function () {
    return Math.E;
};

g.even = function (v) {
    return v % 2 === 0;
};

g.floor = Math.floor;

g.integer = function (v) {
    return v | 0;
};

g.log = function (v) {
    return v > 0 ? Math.log(v) : -Math.log(-v);
};

g.makeNumbers = function (s, separator) {
    if (!s) { return []; }
    if (!separator) { separator = ''; }
    var i, num, numbers = [],
        strings = s.split(separator);
    for (i = 0; i < strings.length; i += 1) {
        num = parseFloat(strings[i]);
        if (num === 0 || num) {
            numbers.push(num);
        }
    }
    return numbers;
};

g.max = function () {
    var values = arguments;
    if (arguments.length === 1 && Array.isArray(arguments[0])) {
        values = arguments[0];
    }
    if (values.length === 0) {
        throw new Error('Wrong number of arguments');
    }
    return Math.max.apply(null, values);
};

g.min = function () {
    var values = arguments;
    if (arguments.length === 1 && Array.isArray(arguments[0])) {
        values = arguments[0];
    }
    if (values.length === 0) {
        throw new Error('Wrong number of arguments');
    }
    return Math.min.apply(null, values);
};

g.mod = function (a, b) {
    return a % b;
};

g.multiply = function (a, b) {
    var argLength = arguments.length;
    if (argLength === 2) { return a * b; }
    else if (argLength === 1) { return a; }
    return reduce(arguments, function(total, n) {
        return total * n;
    }, 1);
};

g.negate = function (v) {
    return -v;
};

g.not = function (bool) {
    return !bool;
};

g.number = function (v) {
    return v;
};

g.odd = function (v) {
    return v % 2 !== 0;
};

g.or = function (bool1, bool2) {
    var argLength = arguments.length;
    if (argLength === 2) {
        return bool1 || bool2;
    } else if (argLength === 1) {
        return !!bool1;
    } else if (argLength === 0) {
        throw new Error('Wrong number of arguments');
    }
    return reduce(arguments, function(b1, b2) {
        return b1 || b2;
    }, false);
};

// Compute Perlin noise
g.perlinNoise = function (x, y, z) {
    // Call optimized internal noise function.
    return vg.math.noise(x, y, z);
};

g.pi = function () {
    return Math.PI;
};

g.pow = Math.pow;

g.radians = function (degrees) {
    return degrees * Math.PI / 180;
};

g.randomNumbers = function (amount, min, max, seed) {
    var argLength = arguments.length;
    if (argLength < 4 || (!seed && seed !== 0)) {
        seed = Math.random();
    }
    if (argLength === 3 || argLength === 4) {
        min = min || 0;
        max = max || (max === 0 ? 0 : 1);
    } else if (argLength === 2) {
        max = min || (min === 0 ? 0 : 1);
        min = 0;
    } else if (argLength === 1) {
        min = 0;
        max = 1;
    }
    if (max < min) {
        var tmp = max;
        max = min;
        min = tmp;
    }
    var v;
    var delta = max - min;
    var numbers = [];
    var rand = util.randomGenerator(seed || 0);
    for (var i = 0; i < amount; i += 1) {
        v = min + (rand(0, 1) * delta);
        numbers.push(v);
    }
    return numbers;
};

g.range = function (min, max, step, includeMax) {
    if (min === max) { return []; }
    if (step !== 0) {
        step = step || (min < max ? 1 : -1);
    }
    if (step > 0 && min > max) return [];
    if (step < 0 && min < max) return [];
    if (step === 0) return [];
    var values = [];
    var i;
    if (min < max) {
        if (!!includeMax) {
            for (i = min; i <= max; i += step) {
                values.push(i);
            }
        } else {
            for (i = min; i < max; i += step) {
                values.push(i);
            }
        }
    } else {
        if (!!includeMax) {
            for (i = min; i >= max; i += step) {
                values.push(i);
            }
        } else {
            for (i = min; i > max; i += step) {
                values.push(i);
            }
        }
    }
    return values;
};

g.round = function (v, a) {
    a = a | 0;
    if (!a) {
        return Math.round(v);
    }
    return Math.round(v / a) * a;
};

g.sample = function (amount, min, max, circular) {
    var d,
        values = [],
        i;
    values.length = amount;
    if (circular) {
        d = (max - min) / amount;
    } else {
        d = (max - min) / (amount - 1);
    }
    for (i = 0; i < amount; i += 1) {
        values[i] = min + i * d;
    }
    return values;
};

g.sineWave = function (v, min, max, period, offset) {
    if (min === undefined) min = -1;
    if (max === undefined) max = 1;
    if (period === undefined) period = 1;
    if (offset === undefined) offset = 0;
    var amplitude = (max - min) / 2;
    return (min + amplitude) + Math.sin((offset + v) * TWO_PI / period) * amplitude;
};

g.squareWave = function (v, min, max, period, offset) {
    if (min === undefined) min = -1;
    if (max === undefined) max = 1;
    if (period === undefined) period = 1;
    if (offset === undefined) offset = 0;
    var halfPeriod = period / 2;
    var d = (v + offset) % period;
    if (d < halfPeriod) {
        return max;
    } else {
        return min;
    }
};

g.triangleWave = function (v, min, max, period, offset) {
    if (min === undefined) min = -1;
    if (max === undefined) max = 1;
    if (period === undefined) period = 1;
    if (offset === undefined) offset = 0;
    var amplitude = (max - min) / 2,
        frequency = TWO_PI / period,
        phase = 0,
        time = v + offset + period / 4;
    if (time % period !== 0) {
        phase = (time * frequency) % TWO_PI;
    }
    if (phase < 0) { phase += TWO_PI; }
    return 2 * amplitude * (1 + -Math.abs((phase / TWO_PI) * 2 - 1)) + min;
};

g.sawtoothWave = function (v, min, max, period, offset) {
    if (min === undefined) min = -1;
    if (max === undefined) max = 1;
    if (period === undefined) period = 1;
    if (offset === undefined) offset = 0;
    var amplitude = (max - min) / 2,
        frequency = TWO_PI / period,
        phase = 0,
        time = v + offset;
    if (time % period !== 0) {
        phase = (time * frequency) % TWO_PI;
    }
    if (phase < 0) { phase += TWO_PI; }
    return 2 * (phase / TWO_PI) * amplitude + min;
};

g.sign = function (v) {
    if (v > 0) {
        return 1;
    } else if (v === 0) {
        return 0;
    } else {
        return -1;
    }
};

g.sin = Math.sin;

g.sqrt = Math.sqrt;

g.subtract = function (a, b) {
    var argLength = arguments.length;
    if (argLength === 2) { return a - b; }
    else if (argLength === 1) { return -a; }
    else if (argLength === 0) { throw new Error('Wrong number of arguments'); }
    return reduce([].slice.call(arguments, 1), function(total, n) {
        return total - n;
    }, arguments[0]);
};

g.tan = Math.tan;

g.total = function (values) {
    if (arguments.length > 1) {
        values = arguments;
    } else if (arguments.length === 1 && !Array.isArray(values)) {
        values = [values];
    } else if (arguments.length === 0) {
        values = [];
    }
    if (values.length === 0) { return 0; }
    var i, total = 0;
    for (i = 0; i < values.length; i += 1) {
        total += values[i];
    }
    return total;
};

g.xor = function (bool1, bool2) {
    var argLength = arguments.length;
    if (argLength === 2) {
        return !!(bool1 ^ bool2);
    } else {
        throw new Error('Wrong number of arguments');
    }
};

module.exports = g;

},{"./util":28,"./vg/vg":49,"lodash.reduce":6}],27:[function(require,module,exports){
'use strict';

var g = {};

g.characterAt = function (s, index) {
    if (!s || s.length === 0) { return ''; }
    s = String(s);
    if (index < 0) {
        index = s.length + index;
    }
    return s.charAt(index);
};

g.concatenate = function () {
    var result = '';
    for (var i = 0; i < arguments.length; i++) {
        var s = arguments[i];
        s = s !== undefined ? String(s) : '';
        result += s;
    }
    return result;
};

g.endsWith = function (s, value) {
    if (!s || !value) { return false; }
    s = String(s);
    return s.indexOf(value, s.length - value.length) !== -1;
};

g.reverse = function (l) {
    return l.slice().reverse();
};

g.startsWith = function (s, value) {
    if (!s || !value) { return false; }
    s = String(s);
    return s.indexOf(value) === 0;
};

g.string = String;

g.stringContains = function (s, sub) {
    if (!s || !sub) { return false; }
    s = String(s);
    return s.indexOf(sub) !== -1;
};

g.stringEquals = function (string1, string2, ignoreCase) {
    string1 = String(string1);
    string2 = String(string2);
    if (!string1 || !string2) {
        return false;
    }
    if (ignoreCase) {
        return string1.toLowerCase() === string2.toLowerCase();
    } else {
        return string1 === string2;
    }
};

g.stringLength = function (s) {
    if (!s) { return 0; }
    s = String(s);
    return s.length;
};

g.stringReplace = function (s, old, new_) {
    s = String(s);
    return s.replace(new RegExp(old, 'g'), new_);
};

g.stringSplit = function (s, separator) {
    if (!s) { return []; }
    if (!separator || separator.length === 0) {
        separator = '';
    }
    s = String(s);
    return s.split(separator);
};

g.stringTrim = function (s) {
    if (!s) { return null; }
    s = String(s);
    return s.trim();
};

g.substring = function (s, start, end, endOffset) {
    if (!s) { return ''; }
    if (end < start) { return ''; }
    s = String(s);

    if (start < 0 && end < 0) {
        start = s.length + start;
        end = s.length + end;
    }

    if (end !== undefined) {
        if (endOffset) {
            end += 1;
        }
    }
    return s.substring(start, end);
};

g.toCharacterCodes = function(s) {
    if (!s) return [];
    var codes = [];
    codes.length = s.length;
    for (var i = 0; i < s.length; i += 1) {
        codes[i] = s.charCodeAt(i);
    }
    return codes;
};

g.toCharacters = function (s) {
    if (!s) { return []; }
    s = String(s);
    return s.split('');
};

g.toLowerCase = function (s) {
    s = String(s);
    return s.toLowerCase();
};

g.toTitleCase = function (s) {
    var c, result = '';
    s = String(s);
    for (var i = 0; i < s.length; i += 1) {
        c = s[i];
        if (result.length === 0 || result[result.length - 1] === ' ') {
            result += c.toUpperCase();
        } else {
            result += c;
        }
    }
    return result;
};

g.toUpperCase = function (s) {
    s = String(s);
    return s.toUpperCase();
};

g.wordCount = function (s) {
    if (!s) { return 0; }
    s = String(s);
    var split = s.split(new RegExp('\\w+'));
    return split.length - 1;
};

g.toWords = function (s) {
    var l = s.split(/\W+/);
    if (l[l.length - 1] === '') {
        l.pop();
    }
    return l;
};


module.exports = g;

},{}],28:[function(require,module,exports){
'use strict';

var randomGenerator = function (seed) {
    // Note: the generator didn't work with negative seed values, so here we
    // transform our original seed into a new (positive) seed value with which we
    // create a new generator.
    if (seed < 0) {
        var gen = randomGenerator(Math.abs(seed));
        for (var i = 0; i < 23; i += 1) {
            gen();
        }
        return randomGenerator(gen(0, 10000));
    }

    // Based on random number generator from
    // http://indiegamr.com/generate-repeatable-random-numbers-in-js/
    return function (min, max) {
        min = min || 0;
        max = max || 1;
        seed = (seed * 9301 + 49297) % 233280;
        var v = seed / 233280;
        return min + v * (max - min);
    };
};

exports.randomGenerator = randomGenerator;
},{}],29:[function(require,module,exports){
// Draw objects to the canvas

'use strict';

var Color = require('../objects/color');

var vg = {};

// Return true if an object can be drawn using the `g.draw` function.
vg.isDrawable = function (o) {
    if (Array.isArray(o)) {
        o = o[0];
    }
    if (!o) {
        return false;
    } else if (typeof o.draw === 'function') {
        return true;
    } else if (typeof o.x === 'number' && typeof o.y === 'number') {
        return true;
    } else if (typeof o.r === 'number' && typeof o.g === 'number' && typeof o.b === 'number') {
        return true;
    } else {
        return false;
    }
};

vg.drawPoints = function (ctx, points) {
    ctx.fillStyle = 'blue';
    ctx.beginPath();
    var pt;
    for (var i = 0; i < points.length; i += 1) {
        pt = points[i];
        ctx.moveTo(pt.x, pt.y);
        ctx.arc(pt.x, pt.y, 2, 0, Math.PI * 2, false);
    }
    ctx.fill();
};

vg.drawColoredPoints = function (ctx, points) {
    var pt;
    for (var i = 0, n = points.length; i < n; i += 1) {
        pt = points[i];
        ctx.fillStyle = Color.toCSS(pt);
        ctx.fillRect(pt.x - 2, pt.y - 2, 4, 4);
    }
};

vg.drawRectangles = function (ctx, rectangles) {
    ctx.save();
    var r;
    for (var i = 0; i < rectangles.length; i += 1) {
        r = rectangles[i];
        ctx.strokeStyle = 'black';
        ctx.strokeWidth = 1;
        ctx.rect(r.x, r.y, r.width, r.height);
        ctx.stroke();
    }
    ctx.restore();
};

vg.drawColors = function (ctx, colors) {
    ctx.save();
    var c;
    for (var i = 0; i < colors.length; i += 1) {
        c = colors[i];
        ctx.fillStyle = Color.toCSS(c);
        ctx.fillRect(0, 0, 30, 30);
        ctx.translate(30, 0);
    }
    ctx.restore();
};

vg.draw = function (ctx, o) {
    var k = o;
    var isArray = false;
    if (Array.isArray(o)) {
        k = o[0];
        isArray = true;
    }

    if (k) {
        if (typeof k.draw === 'function') {
            if (isArray) {
                for (var i = 0, n = o.length; i < n; i += 1) {
                    vg.draw(ctx, o[i]);
                }
            } else {
                o.draw(ctx);
            }
        } else if (typeof k.x === 'number' && typeof k.y === 'number') {
            if (typeof k.r === 'number' && typeof k.g === 'number' && typeof k.b === 'number') {
                vg.drawColoredPoints(ctx, isArray ? o : [o]);
            } else if (typeof k.width === 'number' && typeof k.height === 'number') {
                vg.drawRectangles(ctx, isArray ? o : [o]);
            } else {
                vg.drawPoints(ctx, isArray ? o : [o]);
            }
        } else if (typeof k.r === 'number' && typeof k.g === 'number' && typeof k.b === 'number') {
            vg.drawColors(ctx, isArray ? o : [o]);
        }
    }
};

vg.toSVG = function (o, options) {
    options = options || {};
    var includeHeader = options.header === true;
    var x = options.x !== undefined ? options.x : 0;
    var y = options.y !== undefined ? options.y : 0;
    var width = options.width !== undefined ? options.width : 500;
    var height = options.height !== undefined ? options.height : 500;
    var svg = '';
    if (o) {
        if (typeof o.toSVG === 'function') {
            svg = o.toSVG();
        } else if (Array.isArray(o)) {
            svg = '<g>\n';
            for (var i = 0, n = o.length; i < n; i += 1) {
                svg += vg.toSVG(o[i]) + '\n';
            }
            svg += '</g>\n';
        }
    }
    if (includeHeader) {
        svg = '<?xml version="1.0" encoding="utf-8"?>' +
            '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" ' +
            'x="' + x + '" y="' + y + '" width="' + width + 'px" height="' + height + 'px"' +
            ' viewBox="' + x + ' ' + y + ' ' + width + ' ' + height + '">\n' +
            svg +
            '</svg>\n';
    }
    return svg;
};

module.exports = vg;

},{"../objects/color":32}],30:[function(require,module,exports){
// Object creation / manipulation commands

'use strict';

var flatten = require('lodash.flatten');

var ClipperLib = require('../../../../third_party/clipper');
var bezier = require('../util/bezier');
var geo = require('../util/geo');
var math = require('../util/math');
var random = require('../util/random');

var Color = require('../objects/color');
var Group = require('../objects/group');
var Path = require('../objects/path');
var Point = require('../objects/point');
var Rect = require('../objects/rect');
var Transform = require('../objects/transform');
var Transformable = require('../objects/transformable');

function _cloneCommand(cmd) {
    var newCmd = {type: cmd.type};
    if (newCmd.type !== bezier.CLOSE) {
        newCmd.x = cmd.x;
        newCmd.y = cmd.y;
    }
    if (newCmd.type === bezier.QUADTO) {
        newCmd.x1 = cmd.x1;
        newCmd.y1 = cmd.y1;
    } else if (newCmd.type === bezier.CURVETO) {
        newCmd.x1 = cmd.x1;
        newCmd.y1 = cmd.y1;
        newCmd.x2 = cmd.x2;
        newCmd.y2 = cmd.y2;
    }
    return newCmd;
}

var vg = {};

vg.HORIZONTAL = 'horizontal';
vg.VERTICAL = 'vertical';

vg.EAST = 'e';
vg.WEST = 'w';
vg.NORTH = 'n';
vg.SOUTH = 's';

vg.bounds = function (o) {
    var r, i, n;
    if (!o) {
        return new Rect();
    } else if (typeof o.bounds === 'function') {
        return o.bounds();
    } else if (o.x !== undefined && o.y !== undefined) {
        if (o.width !== undefined && o.height !== undefined) {
            return new Rect(o.x, o.y, o.width, o.height);
        } else {
            return new Rect(o.x, o.y, 0, 0);
        }
    } else if (o.r !== undefined && o.g !== undefined && o.b !== undefined) {
        return new vg.Rect(0, 0, 30, 30);
    } else if (Array.isArray(o)) {
        r = null;
        n = o.length;
        // A color array is special since the colors have no inherent position.
        if (n > 0 && o[0].r !== undefined && o[0].g !== undefined && o[0].b !== undefined) {
            return new Rect(0, 0, o.length * 30, 30);
        }
        for (i = 0; i < n; i += 1) {
            if (!r) {
                r = vg.bounds(o[i]);
            } else {
                r = r.unite(vg.bounds(o[i]));
            }
        }
        return r || new Rect();
    } else {
        return new Rect();
    }
};

vg.makeCenteredRect = function (cx, cy, width, height) {
    var x = cx - width / 2,
        y = cy - height / 2;
    return new Rect(x, y, width, height);
};

vg.makePoint = function (x, y) {
    return new Point(x, y);
};

vg.makeRect = function (x, y, width, height) {
    return new Rect(x, y, width, height);
};

// Combine all given shape arguments into a new group.
// This function works like makeGroup, except that this can take any number
// of arguments.
vg.merge = function () {
    var args = flatten(arguments);
    var shapes = [];
    for (var i = 0; i < args.length; i += 1) {
        if (args[i] && args[i].length !== 0) {
            shapes.push(args[i]);
        }
    }
    return new Group(shapes);
};

vg.combinePaths = function (shape) {
    return Path.combine(shape);
};

vg.shapePoints = vg.toPoints = function (shape) {
    if (!shape) {
        return [];
    }
    var i;
    if (shape.commands) {
        var cmd, commands = [];
        for (i= 0; i < shape.commands.length; i += 1) {
            cmd = shape.commands[i];
            if (cmd.x !== undefined) {
                commands.push(new Point(cmd.x, cmd.y));
            }
        }
        return commands;
    }
    var points = [];
    for (i = 0; i < shape.shapes.length; i += 1) {
        points = points.concat(vg.shapePoints(shape.shapes[i]));
    }
    return points;
};

// FILTERS //////////////////////////////////////////////////////////////

vg.colorize = function (shape, fill, stroke, strokeWidth) {
    if (!shape) {
        return;
    }
    return shape.colorize(fill, stroke, strokeWidth);
};

vg.translate = function (shape, position) {
    if (shape.translate) {
        return shape.translate(position);
    }
    return Transformable.translate.apply(shape, [position]);
};

vg.scale = function (shape, scale, origin) {
    if (shape.scale) {
        return shape.scale(scale, origin);
    }
    return Transformable.scale.apply(shape, [scale, origin]);
};

vg.rotate = function (shape, angle, origin) {
    if (shape.rotate) {
        return shape.rotate(angle, origin);
    }
    return Transformable.rotate.apply(shape, [angle, origin]);
};

vg.skew = function (shape, skew, origin) {
    if (shape.skew) {
        return shape.skew(skew, origin);
    }
    return Transformable.skew.apply(shape, [skew, origin]);
};

vg.copy = function (shape, copies, order, translate, rotate, scale) {
    var i, t, j, op,
        shapes = [],
        tx = 0,
        ty = 0,
        r = 0,
        sx = 1.0,
        sy = 1.0;
    for (i = 0; i < copies; i += 1) {
        t = new Transform();
        for (j = 0; j < order.length; j += 1) {
            op = order[j];
            if (op === 't') {
                t = t.translate(tx, ty);
            } else if (op === 'r') {
                t = t.rotate(r);
            } else if (op === 's') {
                t = t.scale(sx, sy);
            }
        }
        if (Array.isArray(shape) && shape.length > 0 && shape[0].x !== undefined && shape[0].y !== undefined) {
            shapes = shapes.concat(t.transformShape(shape));
        } else {
            shapes.push(t.transformShape(shape));
        }

        tx += translate.x;
        ty += translate.y;
        r += rotate;
        sx += scale.x;
        sy += scale.y;
    }
    return shapes;
};

vg.fit = function (shape, position, width, height, stretch) {
    if (!shape) {
        return;
    }
    stretch = stretch !== undefined ? stretch : false;
    var t, sx, sy,
        bounds = vg.bounds(shape),
        bx = bounds.x,
        by = bounds.y,
        bw = bounds.width,
        bh = bounds.height;

    // Make sure bw and bh aren't infinitely small numbers.
    // This will lead to incorrect transformations with for examples lines.
    bw = (bw > 0.000000000001) ? bw : 0;
    bh = (bh > 0.000000000001) ? bh : 0;

    t = new Transform();
    t = t.translate(position.x, position.y);

    if (!stretch) {
        // don't scale widths or heights that are equal to zero.
        sx = (bw > 0) ? (width / bw) : Number.MAX_VALUE;
        sy = (bh > 0) ? (height / bh) : Number.MAX_VALUE;
        sx = sy = Math.min(sx, sy);
    } else {
        sx = (bw > 0) ? (width / bw) : 1;
        sy = (bh > 0) ? (height / bh) : 1;
    }

    t = t.scale(sx, sy);
    t = t.translate(-bw / 2 - bx, -bh / 2 - by);

    return t.transformShape(shape);
};

// Fit the given shape to the bounding shape.
// If stretch = true, proportions will be distorted.
vg.fitTo = function (shape, bounding, stretch) {
    if (!shape) {
        return;
    }
    if (!bounding) {
        return;
    }

    var bounds = vg.bounds(bounding),
        bx = bounds.x,
        by = bounds.y,
        bw = bounds.width,
        bh = bounds.height;

    return vg.fit(shape, {x: bx + bw / 2, y: by + bh / 2}, bw, bh, stretch);
};

vg.mirror = function (shape, angle, origin, keepOriginal) {
    if (!shape) { return; }
    var t = new Transform();
    t = t.translate(origin.x, origin.y);
    t = t.rotate(angle * 2 - 180);
    t = t.scale(-1, 1);
    t = t.translate(-origin.x, -origin.y);
    var newShape = t.transformShape(shape);

    if (keepOriginal) {
        if (Array.isArray(shape) && shape.length > 0) {
            return shape.concat(newShape);
        }
        return new Group([shape, newShape]);
    } else {
        return newShape;
    }
};

vg.pathLength = function (shape, options) {
    var precision = 20;
    if (options && options.precision) {
        precision = options.precision;
    }
    return shape.length(precision);
};

vg.resampleByLength = function (shape, maxLength) {
    if (!shape) { return; }
    return shape.resampleByLength(maxLength);
};

vg.resampleByAmount = function (shape, amount, perContour) {
    if (!shape) { return; }
    return shape.resampleByAmount(amount, perContour);
};

vg._wigglePoints = function (shape, offset, rand) {
    var i, dx, dy;
    if (shape.commands) {
        var p = new Path([], shape.fill, shape.stroke, shape.strokeWidth);
        for (i = 0; i < shape.commands.length; i += 1) {
            dx = (rand(0, 1) - 0.5) * offset.x * 2;
            dy = (rand(0, 1) - 0.5) * offset.y * 2;
            var cmd = shape.commands[i];
            if (cmd.type === bezier.MOVETO) {
                p.moveTo(cmd.x + dx, cmd.y + dy);
            } else if (cmd.type === bezier.LINETO) {
                p.lineTo(cmd.x + dx, cmd.y + dy);
            } else if (cmd.type === bezier.CURVETO) {
                p.curveTo(cmd.x1, cmd.y1, cmd.x2, cmd.y2, cmd.x + dx, cmd.y + dy);
            } else if (cmd.type === bezier.CLOSE) {
                p.close();
            }
        }
        return p;
    } else if (shape.shapes) {
        var wShapes = [];
        wShapes.length = shape.shapes.length;
        for (i = 0; i < shape.shapes.length; i += 1) {
            wShapes[i] = vg._wigglePoints(shape.shapes[i], offset, rand);
        }
        return new Group(wShapes);
    } else if (Array.isArray(shape) && shape.length > 0 && shape[0].x !== undefined && shape[0].y !== undefined){
        var wPoints = [];
        wPoints.length = shape.length;
        for (i = 0; i < shape.length; i += 1) {
            dx = (rand(0, 1) - 0.5) * offset.x * 2;
            dy = (rand(0, 1) - 0.5) * offset.y * 2;
            wPoints[i] = new Point(shape[i].x + dx, shape[i].y + dy);
        }
        return wPoints;
    } else {
        var w = [];
        w.length = shape.length;
        for (i = 0; i < shape.length; i += 1) {
            w[i] = vg._wigglePoints(shape[i], offset, rand);
        }
        return w;
    }
};

vg.wigglePoints = function (shape, offset, seed) {
    seed = seed !== undefined ? seed : Math.random();
    var rand = random.generator(seed);
    if (offset === undefined) {
        offset = {x: 10, y: 10};
    } else if (typeof offset === 'number') {
        offset = {x: offset, y: offset};
    }
    return vg._wigglePoints(shape, offset, rand);
};

vg._wiggleContours = function (shape, offset, rand) {
    var i;
    if (shape.commands) {
        var dx, dy, t,
            subPaths = shape.contours(),
            commands = [];
        for (i = 0; i < subPaths.length; i += 1) {
            dx = (rand(0, 1) - 0.5) * offset.x * 2;
            dy = (rand(0, 1) - 0.5) * offset.y * 2;
            t = new Transform().translate(dx, dy);
            commands = commands.concat(t.transformShape(new Path(subPaths[i])).commands);
        }
        return new Path(commands, shape.fill, shape.stroke, shape.strokeWidth);
    } else if (shape.shapes) {
        var wShapes = [];
        wShapes.length = shape.shapes.length;
        for (i = 0; i < shape.shapes.length; i += 1) {
            wShapes[i] = vg._wiggleContours(shape.shapes[i], offset, rand);
        }
        return new Group(wShapes);
    } else {
        var w = [];
        w.length = shape.length;
        for (i = 0; i < shape.length; i += 1) {
            w[i] = vg._wiggleContours(shape[i], offset, rand);
        }
        return w;
    }
};

vg.wiggleContours = function (shape, offset, seed) {
    seed = seed !== undefined ? seed : Math.random();
    var rand = random.generator(seed);
    if (offset === undefined) {
        offset = {x: 10, y: 10};
    } else if (typeof offset === 'number') {
        offset = {x: offset, y: offset};
    }
    return vg._wiggleContours(shape, offset, rand);
};

vg._wigglePaths = function (shape, offset, rand) {
    if (shape.commands) {
        return shape;
    } else if (shape.shapes) {
        return new Group(vg._wigglePaths(shape.shapes, offset, rand));
    } else if (Array.isArray(shape)) {
        var subShape, dx, dy, t, newShapes = [];
        for (var i = 0; i < shape.length; i += 1) {
            subShape = shape[i];
            if (subShape.commands) {
                dx = (rand(0, 1) - 0.5) * offset.x * 2;
                dy = (rand(0, 1) - 0.5) * offset.y * 2;
                t = new Transform().translate(dx, dy);
                newShapes.push(t.transformShape(subShape));
            } else if (subShape.shapes) {
                newShapes.push(vg._wigglePaths(subShape, offset, rand));
            }
        }
        return newShapes;
    }
};

vg.wigglePaths = function (shape, offset, seed) {
    seed = seed !== undefined ? seed : Math.random();
    var rand = random.generator(seed);
    if (offset === undefined) {
        offset = {x: 10, y: 10};
    } else if (typeof offset === 'number') {
        offset = {x: offset, y: offset};
    }
    return vg._wigglePaths(shape, offset, rand);
};

vg.scatterPoints = function (shape, amount, seed) {
    // Generate points within the boundaries of a shape.
    if (!shape) {
        return;
    }
    seed = seed !== undefined ? seed : Math.random();
    var i, j, contourPath, nrKeypoints, tries, inContourCount, x, y,
        rand = random.generator(seed),
        bounds = shape.bounds(),
        bx = bounds.x,
        by = bounds.y,
        bw = bounds.width,
        bh = bounds.height,
        contours = shape.contours(),
        paths = [],
        points = [],
        POINTS_PER_SEGMENT = 5;

    for (i = 0; i < contours.length; i++) {
        contourPath = new Path(contours[i]);
        nrKeypoints = contourPath.commands.length;
        paths.push(contourPath.points(nrKeypoints * POINTS_PER_SEGMENT, {closed: true } ));
    }

    for (i = 0; i < amount; i += 1) {
        tries = 100;
        while (tries > 0) {
            inContourCount = 0;
            x = bx + rand(0, 1) * bw;
            y = by + rand(0, 1) * bh;
            for (j = 0; j < paths.length; j++) {
                if (geo.pointInPolygon(paths[j], x, y)) {
                    inContourCount += 1;
                }
            }
            if (inContourCount % 2) {
                points.push(new Point(x, y));
                break;
            }
            tries -= 1;
        }
    }
    return points;
};

vg.connectPoints = function (points, closed) {
    if (!points) {
        return;
    }
    var pt, p = new Path();
    for (var i = 0; i < points.length; i += 1) {
        pt = points[i];
        if (i === 0) {
            p.moveTo(pt.x, pt.y);
        } else {
            p.lineTo(pt.x, pt.y);
        }
    }
    if (closed) {
        p.close();
    }
    p.fill = null;
    p.stroke = Color.BLACK;
    return p;
};

vg.align = function (shape, position, hAlign, vAlign) {
    if (!shape) {
        return;
    }
    var dx, dy, t,
        x = position.x,
        y = position.y,
        bounds = vg.bounds(shape);
    if (hAlign === 'left') {
        dx = x - bounds.x;
    } else if (hAlign === 'right') {
        dx = x - bounds.x - bounds.width;
    } else if (hAlign === 'center') {
        dx = x - bounds.x - bounds.width / 2;
    } else {
        dx = 0;
    }
    if (vAlign === 'top') {
        dy = y - bounds.y;
    } else if (vAlign === 'bottom') {
        dy = y - bounds.y - bounds.height;
    } else if (vAlign === 'middle') {
        dy = y - bounds.y - bounds.height / 2;
    } else {
        dy = 0;
    }

    t = new Transform().translate(dx, dy);
    return t.transformShape(shape);
};

// Snap geometry to a grid.
vg.snap = function (shape, distance, strength, center) {
    if (!shape) {
        return;
    }
    strength = strength !== undefined ? strength : 1;
    center = center || Point.ZERO;

    var i, x, y;
    if (shape.commands) {
        var p = new Path([], shape.fill, shape.stroke, shape.strokeWidth);
        var cmd, x1, y1, x2, y2;
        for (i = 0; i < shape.commands.length; i += 1) {
            cmd = shape.commands[i];
            if (cmd.type === bezier.MOVETO || cmd.type === bezier.LINETO || cmd.type === bezier.CURVETO) {
                x = math.snap(cmd.x + center.x, distance, strength) - center.x;
                y = math.snap(cmd.y + center.y, distance, strength) - center.y;
                if (cmd.type === bezier.MOVETO) {
                    p.moveTo(x, y);
                } else if (cmd.type === bezier.LINETO) {
                    p.lineTo(x, y);
                } else if (cmd.type === bezier.CURVETO) {
                    x1 = math.snap(cmd.x1 + center.x, distance, strength) - center.x;
                    y1 = math.snap(cmd.y1 + center.y, distance, strength) - center.y;
                    x2 = math.snap(cmd.x2 + center.x, distance, strength) - center.x;
                    y2 = math.snap(cmd.y2 + center.y, distance, strength) - center.y;
                    p.curveTo(x1, y1, x2, y2, x, y);
                }
            } else if (cmd.type === bezier.CLOSE) {
                p.close();
            } else {
                throw new Error('Invalid path command ' + cmd);
            }
        }
        return p;
    } else if (shape.shapes) {
        var sShapes = [];
        sShapes.length = shape.shapes.length;
        for (i = 0; i < shape.shapes.length; i += 1) {
            sShapes[i] = vg.snap(shape.shapes[i], distance, strength, center);
        }
        return new Group(sShapes);
    } else if (Array.isArray(shape) && shape.length > 0 && shape[0].x !== undefined && shape[0].y !== undefined) {
        var point, sPoints = [];
        sPoints.length = shape.length;
        for (i = 0; i < shape.length; i += 1) {
            point = shape[i];
            x = math.snap(point.x + center.x, distance, strength) - center.x;
            y = math.snap(point.y + center.y, distance, strength) - center.y;
            sPoints[i] = new Point(x, y);
        }
        return sPoints;
    } else {
        var s = [];
        s.length = shape.length;
        for (i = 0; i < shape.length; i += 1) {
            s[i] = vg.snap(shape[i], distance, strength, center);
        }
        return s;
    }
};

vg.deletePoints = function (shape, bounding, invert) {
    var i, cmd, commands = [];
    var pt, points = [];
    if (shape.commands) {
        var newCurve = true;
        for (i = 0; i < shape.commands.length; i += 1) {
            cmd = _cloneCommand(shape.commands[i]);
            if (cmd.x === undefined ||
                    (invert && bounding.contains(cmd.x, cmd.y)) ||
                    (!invert && !bounding.contains(cmd.x, cmd.y))) {
                if (newCurve && cmd.type !== bezier.MOVETO) {
                    cmd.type = bezier.MOVETO;
                }
                commands.push(cmd);
                if (cmd.type === bezier.MOVETO) {
                    newCurve = false;
                } else if (cmd.type === bezier.CLOSE) {
                    newCurve = true;
                }
            }
        }
        return new Path(commands, shape.fill, shape.stroke, shape.strokeWidth);
    } else if (shape.shapes) {
        var dShapes = [];
        dShapes.length = shape.shapes.length;
        for (i = 0; i < shape.shapes.length; i += 1) {
            dShapes[i] = vg.deletePoints(shape.shapes[i], bounding, invert);
        }
        return new Group(dShapes);
    } else if (Array.isArray(shape) && shape.length > 0 && shape[0].x !== undefined && shape[0].y !== undefined){
        for (i = 0; i < shape.length; i += 1) {
            pt = shape[i];
            if ((invert && bounding.contains(pt.x, pt.y)) ||
               (!invert && !bounding.contains(pt.x, pt.y))) {
                points.push(_cloneCommand(pt));
            }
        }
        return points;
    } else {
        var d = [];
        d.length = shape.length;
        for (i = 0; i < shape.length; i += 1) {
            d[i] = vg.deletePoints(shape[i], bounding, invert);
        }
        return d;
    }
};

vg.deletePaths = function (shape, bounding, invert) {
    if (shape.commands) {
        return null;
    } else if (shape.shapes) {
        return new Group(vg.deletePaths(shape.shapes, bounding, invert));
    } else if (Array.isArray(shape)) {
        var j, s, selected, cmd, subShapes, newShapes = [];
        var shapes = shape;
        for (var i = 0; i < shapes.length; i += 1) {
            s = shapes[i];
            if (s.commands) {
                selected = false;
                for (j = 0; j < s.commands.length; j += 1) {
                    cmd = s.commands[j];
                    if (cmd.x !== undefined && bounding.contains(cmd.x, cmd.y)) {
                        selected = true;
                        break;
                    }
                }
                if (!((invert && !selected) || (selected && !invert))) {
                    newShapes.push(s);
                }
            } else if (s.shapes) {
                subShapes = vg.deletePaths(s, bounding, invert);
                if (subShapes.length !== 0) {
                    newShapes.push(subShapes);
                }
            }
        }
        return newShapes;
    }
};

vg['delete'] = function (shape, bounding, scope, invert) {
    if (shape === null || bounding === null) { return null; }
    if (scope === 'points') { return vg.deletePoints(shape, bounding, invert); }
    if (scope === 'paths') { return vg.deletePaths(shape, bounding, invert); }
    throw new Error('Invalid scope.');
};

vg.pointOnPath = function (shape, t) {
    if (!shape) {
        return;
    }
    if (shape.shapes) {
        shape = new Path(vg.combinePaths(shape));
    }
    t = t % 1;
    if (t < 0) {
        t = 1 + t;
    }
    var pt = shape.point(t);
    return new Point(pt.x, pt.y);
};

/*vg.shapeOnPath = function (shapes, path, amount, alignment, spacing, margin, baselineOffset) {
    if (!shapes) { return []; }
    if (path === null) { return []; }

    if (alignment === 'trailing') {
        shapes = shapes.slice();
        shapes.reverse();
    }

    var i, pos, p1, p2, a, t,
        length = path.length() - margin,
        m = margin / path.length(),
        c = 0,
        newShapes = [];

    function putOnPath(shape) {
        if (alignment === 'distributed') {
            var p = length / ((amount * shapes.length) - 1);
            pos = c * p / length;
            pos = m + (pos * (1 - 2 * m));
        } else {
            pos = ((c * spacing) % length) / length;
            pos = m + (pos * (1 - m));

            if (alignment === 'trailing') {
                pos = 1 - pos;
            }
        }

        p1 = path.point(pos);
        p2 = path.point(pos + 0.0000001);
        a = geo.angle(p1.x, p1.y, p2.x, p2.y);
        if (baselineOffset) {
            p1 = geo.coordinates(p1.x, p1.y, a - 90, baselineOffset);
        }
        t = new Transform();
        t = t.translate(p1.x, p1.y);
        t = t.rotate(a);
        newShapes.push(t.transformShape(shape));
        c += 1;
    }

    for (i = 0; i < amount; i += 1) {
        _.each(shapes, putOnPath);
    }
    return newShapes;
};*/

vg._x = function (shape) {
    if (shape.x !== undefined) {
        return shape.x;
    } else {
        return shape.bounds().x;
    }
};

vg._y = function (shape) {
    if (shape.y !== undefined) {
        return shape.y;
    } else {
        return shape.bounds().y;
    }
};

vg._angleToPoint = function (point) {
    return function (shape) {
        if (shape.x !== undefined && shape.y !== undefined) {
            return geo.angle(shape.x, shape.y, point.x, point.y);
        } else {
            var centerPoint = shape.bounds().centerPoint();
            return geo.angle(centerPoint.x, centerPoint.y, point.x, point.y);
        }
    };
};

vg._distanceToPoint = function (point) {
    return function (shape) {
        if (shape.x !== undefined && shape.y !== undefined) {
            return geo.distance(shape.x, shape.y, point.x, point.y);
        } else {
            var centerPoint = shape.bounds().centerPoint();
            return geo.distance(centerPoint.x, centerPoint.y, point.x, point.y);
        }
    };
};

vg.shapeSort = function (shapes, method, origin) {
    if (!shapes) {
        return;
    }
    origin = origin || Point.ZERO;

    var methods = {
        x: vg._x,
        y: vg._y,
        angle: vg._angleToPoint(origin),
        distance: vg._distanceToPoint(origin)
    };
    method = methods[method];
    if (method === undefined) { return shapes; }
    var newShapes = shapes.slice(0);
    newShapes.sort(function (a, b) {
        var _a = method(a),
            _b = method(b);
        if (_a < _b) { return -1; }
        if (_a > _b) { return 1; }
        return 0;
    });
    return newShapes;
};

vg.group = function () {
    return new Group(flatten(arguments));
};

vg.ungroup = function (shape) {
    if (!shape) {
        return [];
    } else if (shape.shapes) {
        var i, s, shapes = [];
        for (i = 0; i < shape.shapes.length; i += 1) {
            s = shape.shapes[i];
            if (s.commands) {
                shapes.push(s);
            } else if (s.shapes) {
                shapes = shapes.concat(vg.ungroup(s));
            }
        }
        return shapes;
    } else if (shape.commands) {
        return [shape];
    } else {
        return [];
    }
};

vg.centerPoint = function (shape) {
    if (!shape) {
        return Point.ZERO;
    }
    var r = vg.bounds(shape);
    return new Point(r.x + r.width / 2, r.y + r.height / 2);
};

vg.link = function (shape1, shape2, orientation) {
    if (!shape1 || !shape2) {
        return;
    }

    var p = new Path();
    var a = shape1.bounds();
    var b = shape2.bounds();
    if (orientation === vg.HORIZONTAL) {
        var hw = (b.x - (a.x + a.width)) / 2;
        p.moveTo(a.x + a.width, a.y);
        p.curveTo(a.x + a.width + hw, a.y, b.x - hw, b.y, b.x, b.y);
        p.lineTo(b.x, b.y + b.height);
        p.curveTo(b.x - hw, b.y + b.height, a.x + a.width + hw, a.y + a.height, a.x + a.width, a.y + a.height);
        p.close();
    } else {
        var hh = (b.y - (a.y + a.height)) / 2;
        p.moveTo(a.x, a.y + a.height);
        p.curveTo(a.x, a.y + a.height + hh, b.x, b.y - hh, b.x, b.y);
        p.lineTo(b.x + b.width, b.y);
        p.curveTo(b.x + b.width, b.y - hh, a.x + a.width, a.y + a.height + hh, a.x + a.width, a.y + a.height);
        p.close();
    }
    return p;
};

var compoundMethods = {
    'union': ClipperLib.ClipType.ctUnion,
    'difference': ClipperLib.ClipType.ctDifference,
    'intersection': ClipperLib.ClipType.ctIntersection,
    'xor': ClipperLib.ClipType.ctXor
};

vg._compoundToPoints = function (shape) {
    var l1 = [];
    var i, l, s, j, pt;
    for (i = 0; i < shape.length; i += 1) {
        l = [];
        s = shape[i];
        for (j = 0; j < s.length; j += 1) {
            pt = s[j];
            if (pt.type !== bezier.CLOSE) {
                l.push({X: pt.x, Y: pt.y});
            }
        }
        l1.push(l);
    }
    return l1;
};

vg.compound = function (shape1, shape2, method) {
    if (!shape1.commands) { shape1 = Path.combine(shape1); }
    if (!shape2.commands) { shape2 = Path.combine(shape2); }
    var contours1 = shape1.resampleByLength(1).contours();
    var contours2 = shape2.resampleByLength(1).contours();

    var subjPaths = vg._compoundToPoints(contours1);
    var clipPaths = vg._compoundToPoints(contours2);
    var scale = 100;
    ClipperLib.JS.ScaleUpPaths(subjPaths, scale);
    ClipperLib.JS.ScaleUpPaths(clipPaths, scale);

    var cpr = new ClipperLib.Clipper();
    cpr.AddPaths(subjPaths, ClipperLib.PolyType.ptSubject, shape1.isClosed());
    cpr.AddPaths(clipPaths, ClipperLib.PolyType.ptClip, shape2.isClosed());

    var solutionPaths = new ClipperLib.Paths();
    cpr.Execute(compoundMethods[method], solutionPaths, ClipperLib.PolyFillType.pftNonZero, ClipperLib.PolyFillType.pftNonZero);
    solutionPaths = ClipperLib.JS.Clean(solutionPaths, 0.1 * scale);
    ClipperLib.JS.ScaleDownPaths(solutionPaths, scale);
    var path = new Path();
    var i, j, s;
    for (i = 0; i < solutionPaths.length; i += 1) {
        s = solutionPaths[i];
        for (j = 0; j < s.length ; j += 1) {
            if (j === 0) {
                path.moveTo(s[j].X, s[j].Y);
            } else {
                path.lineTo(s[j].X, s[j].Y);
            }
        }
        if (s[0].X !== s[s.length-1].X || s[0].Y !== s[s.length-1].Y) {
            path.closePath();
        }
    }
    return path;
};

module.exports = vg;

},{"../../../../third_party/clipper":50,"../objects/color":32,"../objects/group":33,"../objects/path":35,"../objects/point":36,"../objects/rect":37,"../objects/transform":39,"../objects/transformable":40,"../util/bezier":42,"../util/geo":44,"../util/math":46,"../util/random":47,"lodash.flatten":3}],31:[function(require,module,exports){
// Basic shapes

'use strict';

var geo = require('../util/geo');

var Color = require('../objects/color');
var Path = require('../objects/path');
var Point = require('../objects/point');
var gText = require('../objects/text');

var vg = {};

vg.roundedRect = function (cx, cy, width, height, rx, ry) {
    var p = new Path();
    p.addRoundedRect(cx, cy, width, height, rx, ry);
    return p;
};

vg.quad = function (pt1, pt2, pt3, pt4) {
    var args = arguments;
    var p = new Path();
    if (args.length === 8) {
        Path.prototype.addQuad.apply(p, args);
    } else {
        pt1 = Point.read(pt1);
        pt2 = Point.read(pt2);
        pt3 = Point.read(pt3);
        pt4 = Point.read(pt4);
        p.addQuad(pt1.x, pt1.y, pt2.x, pt2.y, pt3.x, pt3.y, pt4.x, pt4.y);
    }
    return p;
};

vg.rect = function (position, width, height, roundness) {
    var args = arguments;
    if (args.length === 3) {
        position = Point.read(position);
    } else if (args.length === 4) {
        if (typeof args[0] === 'number' && typeof args[1] === 'number') {
            position = Point.read(args[0], args[1]);
            width = args[2];
            height = args[3];
            roundness = null;
        } else {
            position = Point.read(position);
            roundness = Point.read(roundness);
        }
    } else if (args.length === 5 || args.length === 6) {
        position = Point.read(args[0], args[1]);
        width = args[2];
        height = args[3];
        if (args.length === 5 && typeof args[4] === 'number') {
            roundness = Point.read(args[4], args[4]);
        } else {
            roundness = Point.read(args[4], args[5]);
        }
    }

    if (!roundness || (roundness.x === 0 && roundness.y === 0)) {
        var p = new Path();
        p.addRect(position.x - width / 2, position.y - height / 2, width, height);
        return p;
    } else {
        return vg.roundedRect(position.x - width / 2, position.y - height / 2, width, height, roundness.x, roundness.y);
    }
};

vg.ellipse = function (position, width, height) {
    var args = arguments;
    if (args.length === 4) {
        position = Point.read(args[0], args[1]);
        width = args[2];
        height = args[3];
    } else {
        position = Point.read(position);
    }
    var p = new Path();
    p.addEllipse(position.x - width / 2, position.y - height / 2, width, height);
    return p;
};

vg.line = function (point1, point2) {
    var args = arguments;
    if (args.length === 4) {
        point1 = Point.read(args[0], args[1]);
        point2 = Point.read(args[2], args[3]);
    } else {
        point1 = Point.read(point1);
        point2 = Point.read(point2);
    }
    var line = new Path();
    line.addLine(point1.x, point1.y, point2.x, point2.y);
    line.fill = null;
    line.stroke = 'black';
    return line;
};

vg.lineAngle = function (point, angle, distance) {
    var args = arguments;
    if (args.length === 4) {
        point = Point.read(args[0], args[1]);
        distance = args[2];
        angle = args[3];
    } else {
        point = Point.read(point);
    }
    var point2 = geo.coordinates(point.x, point.y, angle, distance);
    return vg.line(point, point2);
};

vg.arc = function (position, width, height, startAngle, degrees, arcType) {
    var args = arguments;
    if (args.length === 7) {
        position = Point.read(args[0], args[1]);
        width = args[2];
        height = args[3];
        startAngle = args[4];
        degrees = args[5];
        arcType = args[6];
    } else {
        position = Point.read(position);
    }
    var p = new Path();
    p.addArc(position.x, position.y, width, height, startAngle, degrees, arcType);
    return p;
};

vg.curve = function (pt1, pt2, t, distance) {
    var args = arguments;
    if (args.length === 6) {
        pt1 = Point.read(args[0], args[1]);
        pt2 = Point.read(args[2], args[3]);
        t = args[4];
        distance = args[5];
    } else {
        pt1 = Point.read(pt1);
        pt2 = Point.read(pt2);
    }

    var cx = pt1.x + t * (pt2.x - pt1.x),
        cy = pt1.y + t * (pt2.y - pt1.y),
        a = geo.angle(pt1.x, pt1.y, pt2.x, pt2.y) + 90,
        q = geo.coordinates(cx, cy, a, distance),
        qx = q.x,
        qy = q.y,

        c1x = pt1.x + 2 / 3.0 * (qx - pt1.x),
        c1y = pt1.y + 2 / 3.0 * (qy - pt1.y),
        c2x = pt2.x + 2 / 3.0 * (qx - pt2.x),
        c2y = pt2.y + 2 / 3.0 * (qy - pt2.y);

    var p = new Path();
    p.moveTo(pt1.x, pt1.y);
    p.curveTo(c1x, c1y, c2x, c2y, pt2.x, pt2.y);
    p.fill = null;
    p.stroke = Color.BLACK;
    return p;
};

vg.polygon = function (position, radius, sides, align) {
    var args = arguments;
    if (args.length === 5 || (args.length === 4 && typeof args[0] === 'number' && typeof args[1] === 'number')) {
        position = Point.read(args[0], args[1]);
        radius = args[2];
        sides = args[3];
        align = args.length === 5 ? args[4] : true;
    } else {
        position = Point.read(position);
        if (args.length === 3) {
            align = true;
        }
    }
    sides = Math.max(sides, 3);
    var c0, c1, i, c,
        x = position.x,
        y = position.y,
        r = radius,
        a = 360.0 / sides,
        da = 0;
    if (align === true) {
        c0 = geo.coordinates(x, y, 0, r);
        c1 = geo.coordinates(x, y, a, r);
        da = -geo.angle(c1.x, c1.y, c0.x, c0.y);
    }
    var p = new Path();
    for (i = 0; i < sides; i += 1) {
        c = geo.coordinates(x, y, (a * i) + da, r);
        if (i === 0) {
            p.moveTo(c.x, c.y);
        } else {
            p.lineTo(c.x, c.y);
        }
    }
    p.close();
    return p;
};

vg.star = function (position, points, outer, inner) {
    var args = arguments;
    if (args.length === 5 || (args.length === 4 && typeof args[0] === 'number' && typeof args[1] === 'number')) {
        position = Point.read(args[0], args[1]);
        points = args[2];
        outer = args[3];
        inner = args[4];
    } else {
        position = Point.read(position);
    }
    if (!inner) { inner = outer; }
    var i, angle, radius, x, y;
    var p = new Path();
    p.moveTo(position.x, position.y + outer / 2);
    // Calculate the points of the star.
    for (i = 1; i < points * 2; i += 1) {
        angle = i * Math.PI / points;
        radius = (i % 2 === 1) ? inner / 2 : outer / 2;
        x = position.x + radius * Math.sin(angle);
        y = position.y + radius * Math.cos(angle);
        p.lineTo(x, y);
    }
    p.close();
    return p;
};

var nonEmpty = function (s) {
    return s !== '';
};

var stripCommas = function (c) {
    return c.replace(/,/g, ' ');
};

vg.freehand = function (pathString) {
    var i, j, x, y, values,
        contours = [],
        elems = pathString.split('M');
        
    for (i = 0; i < elems.length; i += 1) {
        if (nonEmpty(elems[i])) {
            contours.push(stripCommas(elems[i]));
        }
    }

    var p = new Path();
    for (j = 0; j < contours.length; j += 1) {
        values = [];
        elems = contours[j].split(' ');
        for (i = 0; i < elems.length; i += 1) {
            if (nonEmpty(elems[i])) {
                values.push(elems[i]);
            }
        }
        for (i = 0; i < values.length; i += 2) {
            if (values[i + 1] !== undefined) {
                x = parseFloat(values[i]);
                y = parseFloat(values[i + 1]);
                if (i === 0) {
                    p.moveTo(x, y);
                } else {
                    p.lineTo(x, y);
                }
            }
        }
    }
    p.fill = null;
    p.stroke = Color.BLACK;
    return p;
};

// Create a grid of points.
vg.grid = function (columns, rows, columnWidth, rowHeight, position) {
    var gridWidth, left, gridHeight, top, rowIndex, colIndex, x, y, i,
        points = [];
    points.length = columns * rows;
    position = position !== undefined ? position : Point.ZERO;
    if (columns > 1) {
        gridWidth = columnWidth * (columns - 1);
        left = position.x - gridWidth / 2;
    } else {
        left = position.x;
    }
    if (rows > 1) {
        gridHeight = rowHeight * (rows - 1);
        top = position.y - gridHeight / 2;
    } else {
        top = position.y;
    }

    i = 0;
    for (rowIndex = 0; rowIndex < rows; rowIndex += 1) {
        for (colIndex = 0; colIndex < columns; colIndex += 1) {
            x = left + colIndex * columnWidth;
            y = top + rowIndex * rowHeight;
            points[i] = new Point(x, y);
            i += 1;
        }
    }
    return points;
};

// Generates a Text object.
// The function can take many possible argument forms, either by listing them in order
// (text, x, y, fontFamily, fontSize, align, fill), or by using an options object.
// The position can be specified as x, y; using a point {x: 10, y: 20} or using an array [10, 20].
// Here are a couple of ways to generate 'Hello' at position 0, 0 in 12pt Helvetica, centered.
//
//     vg.text('Hello', {x: 0, y: 0}, 'Helvetica', 12, 'center');
//     vg.text('Hello', [0, 0], {fontFamily: 'Helvetica', fontSize: 12, align: 'center'});
//     vg.text('Hello', 0, 0, {fontFamily: 'Helvetica', fontSize: 12});  // align: center is the default.
//     vg.text('Hello', {fontFamily: 'Helvetica', fontSize: 12}); // the position defaults to 0,0.
vg.text = function () {
    var t = Object.create(gText.prototype);
    t.constructor = gText.prototype;
    gText.apply(t, arguments);
    return t;
};

vg.demoRect = function () {
    return new vg.rect({x: 0, y: 0}, 100, 100, {x: 0, y: 0});
};

vg.demoEllipse = function () {
    return new vg.ellipse({x: 0, y: 0}, 100, 100);
};

module.exports = vg;

},{"../objects/color":32,"../objects/path":35,"../objects/point":36,"../objects/text":38,"../util/geo":44}],32:[function(require,module,exports){
// Color object

'use strict';

var math = require('../util/math');
var color = require('../util/color');
var js = require('../util/js');

// var RGB = 'RGB';
var HSB = 'HSB';
var HSL = 'HSL';
var HEX = 'HEX';

var Color = function (v1, v2, v3, v4, v5) {
    var _r, _g, _b, _a, rgb, options;
    if (v1 === undefined) {
        _r = _g = _b = 0;
        _a = 1;
    } else if (Array.isArray(v1)) {
        options = v2 || {};
        _r = v1[0] !== undefined ? v1[0] : 0;
        _g = v1[1] !== undefined ? v1[1] : 0;
        _b = v1[2] !== undefined ? v1[2] : 0;
        _a = v1[3] !== undefined ? v1[3] : options.range || 1;
    } else if (v1.r !== undefined) {
        options = v2 || {};
        _r = v1.r;
        _g = v1.g;
        _b = v1.b;
        _a = v1.a !== undefined ? v1.a : options.range || 1;
    } else if (typeof v1 === 'string') {
        rgb = color.hex2rgb(v1);
        _r = rgb[0];
        _g = rgb[1];
        _b = rgb[2];
        _a = 1;
    } else if (typeof v1 === 'number') {
        if (arguments.length === 1) { // Grayscale value
            _r = _g = _b = v1;
            _a = 1;
        } else if (arguments.length === 2) { // Gray and alpha or options
            _r = _g = _b = v1;
            if (typeof v2 === 'number') {
                _a = v2;
            } else {
                options = v2;
                _a = options.range || 1;
            }
        } else if (arguments.length === 3) { // RGB or gray, alpha and options
            if (typeof v3 === 'number') {
                _r = v1;
                _g = v2;
                _b = v3;
                _a = 1;
            } else {
                _r = _g = _b = v1;
                _a = v2;
                options = v3;
            }
        } else if (arguments.length === 4) { // RGB and alpha or options
            _r = v1;
            _g = v2;
            _b = v3;
            if (typeof v4 === 'number') {
                _a = v4;
            } else {
                options = v4;
                _a = options.range || 1;
            }
        } else { // RGBA + options
            _r = v1;
            _g = v2;
            _b = v3;
            _a = v4;
            options = v5;
        }
    }
    options = options || {};

    // The range option allows you to specify values in a different range.
    if (options.range !== undefined) {
        _r /= options.range;
        _g /= options.range;
        _b /= options.range;
        _a /= options.range;
        if (options.mode === HSB) {
            v1 /= options.range;
            v2 /= options.range;
            v3 /= options.range;
        }
    }
    // Convert HSB colors to RGB
    if (options.mode === HSB) {
        v1 = math.clamp(v1, 0, 1);
        v2 = math.clamp(v2, 0, 1);
        v3 = math.clamp(v3, 0, 1);
        rgb = color.hsb2rgb(v1, v2, v3);
        _r = rgb[0];
        _g = rgb[1];
        _b = rgb[2];
    // Convert HSL colors to RGB
    } else if (options.mode === HSL) {
        v1 = math.clamp(v1, 0, 1);
        v2 = math.clamp(v2, 0, 1);
        v3 = math.clamp(v3, 0, 1);
        rgb = color.hsl2rgb(v1, v2, v3);
        _r = rgb[0];
        _g = rgb[1];
        _b = rgb[2];
    } else if (options.mode === HEX) {
        rgb = color.hex2rgb(v1);
        _r = rgb[0];
        _g = rgb[1];
        _b = rgb[2];
        _a = 1;
    }

    this.r = math.clamp(_r, 0, 1);
    this.g = math.clamp(_g, 0, 1);
    this.b = math.clamp(_b, 0, 1);
    this.a = math.clamp(_a, 0, 1);
};

Color.BLACK = new Color(0);
Color.WHITE = new Color(1);

js.defineAlias(Color, 'r', 'red');
js.defineAlias(Color, 'g', 'green');
js.defineAlias(Color, 'b', 'blue');
js.defineAlias(Color, 'a', 'alpha');

// The hue of the color, in HSL color mode. (Although hue is the same in HSL and HSB).
js.defineGetter(Color, 'h', function () {
    return color.rgb2hsl(this.r, this.g, this.b)[0];
});

// The saturation of the color, in HSL color mode. (Saturation is different in HSL and HSB).
js.defineGetter(Color, 's', function () {
    return color.rgb2hsl(this.r, this.g, this.b)[1];
});

// The lightness of the color, in HSL color mode. (Lightness in HSL is different from brightness in HSB).
js.defineGetter(Color, 'l', function () {
    return color.rgb2hsl(this.r, this.g, this.b)[2];
});

js.defineAlias(Color, 'h', 'hue');
js.defineAlias(Color, 's', 'saturation');
js.defineAlias(Color, 'l', 'lightness');


js.defineGetter(Color, 'rgb', function () {
    return [this.r, this.g, this.b];
});

js.defineGetter(Color, 'rgba', function () {
    return [this.r, this.g, this.b, this.a];
});

js.defineGetter(Color, 'hsb', function () {
    return color.rgb2hsb(this.r, this.g, this.b);
});

js.defineGetter(Color, 'hsba', function () {
    return color.rgb2hsb(this.r, this.g, this.b).concat([this.a]);
});

js.defineGetter(Color, 'hsl', function () {
    return color.rgb2hsl(this.r, this.g, this.b);
});

js.defineGetter(Color, 'hsla', function () {
    return color.rgb2hsl(this.r, this.g, this.b).concat([this.a]);
});

Color.prototype.toCSS = function () {
    return Color.toCSS(this);
};

Color.prototype.toHex = function () {
    if (this.a >= 1) {
        return color.rgb2hex(this.r, this.g, this.b);
    } else {
        return color.rgba2hex(this.r, this.g, this.b, this.a);
    }
};

Color.prototype.desaturate = function (options) {
    if (this.r === this.g && this.g === this.b) { return this; }
    var rCoeff, gCoeff, bCoeff;
    if (options === undefined || !options.method || options.method === 'ITU-R BT.601') {
        rCoeff = 0.3; gCoeff = 0.59; bCoeff = 0.11;
    } else if (options.method === 'ITU-R BT.709') {
        rCoeff = 0.2125; gCoeff = 0.7154; bCoeff = 0.0721;
    }
    var gray = this.r * rCoeff + this.g * gCoeff + this.b * bCoeff;
    return new Color(gray, gray, gray, this.a);
};

Color.prototype.invert = function () {
    return new Color(1 - this.r, 1 - this.g, 1 - this.b, this.a);
};

Color.clone = function (c) {
    if (c === null || c === undefined) {
        return null;
    } else if (typeof c === 'string') {
        return c;
    } else {
        return new Color(c.r, c.g, c.b, c.a);
    }
};

Color.toCSS = function (c) {
    if (c === null) {
        return 'none';
    } else if (c === undefined) {
        return 'black';
    } else if (typeof c === 'string') {
        return c;
    } else if (c instanceof Color) {
        var r255 = Math.round(c.r * 255),
            g255 = Math.round(c.g * 255),
            b255 = Math.round(c.b * 255);
        return 'rgba(' + r255 + ', ' + g255 + ', ' + b255 + ', ' + c.a + ')';
    } else if (c.r !== undefined && c.g !== undefined && c.b !== undefined) {
        if (c.a === undefined) {
            return 'rgb(' + c.r + ', ' + c.g + ', ' + c.b + ')';
        } else {
            return 'rgba(' + c.r + ', ' + c.g + ', ' + c.b + ', ' + c.a + ')';
        }
    } else {
        throw new Error('Don\'t know how to convert ' + c + ' to CSS.');
    }
};

Color.toHex = function (c) {
    return Color.parse(c).toHex();
};

Color.make = function () {
    var c = Object.create(Color.prototype);
    c.constructor = Color.prototype;
    Color.apply(c, arguments);
    return c;
};

Color.parse = function (s) {
    function startsWith (s, value) {
        if (!s || !value) { return false; }
        s = String(s);
        return s.indexOf(value) === 0;
    }

    var m;
    if (s === undefined || s === null) {
        return new Color(0, 0, 0, 0);
    } else if (s instanceof Color) {
        return s;
    } else if (color.namedColors[s]) {
        return Color.make.apply(null, color.namedColors[s]);
    } else if (s[0] === '#') {
        return new Color(s, 0, 0, 0, { mode: HEX });
    } else if (startsWith(s, 'rgba')) {
        m = s.match(/^rgba\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+|\d+.\d+)\s*\)$/i);
        if (m) {
            return new Color(parseInt(m[1]) / 255, parseInt(m[2]) / 255, parseInt(m[3]) / 255, parseFloat(m[4]));
        } else {
            m = s.match(/^rgba\s*\(\s*(\d+|\d+.\d+)%\s*,\s*(\d+|\d+.\d+)%\s*,\s*(\d+|\d+.\d+)%\s*,\s*(\d+|\d+.\d+)\s*\)$/i);
            if (m) {
                return new Color(parseFloat(m[1]) / 100, parseFloat(m[2]) / 100, parseFloat(m[3]) / 100, parseFloat(m[4]));
            }
        }
        return new Color(0, 0, 0, 0);
    } else if (startsWith(s, 'rgb')) {
        m = s.match(/^rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/i);
        if (m) {
            return new Color(parseInt(m[1]) / 255, parseInt(m[2]) / 255, parseInt(m[3]) / 255);
        } else {
            m = s.match(/^rgb\s*\(\s*(\d+|\d+.\d+)%\s*,\s*(\d+|\d+.\d+)%\s*,\s*(\d+|\d+.\d+)%\s*\)$/i);
            if (m) {
                return new Color(parseFloat(m[1]) / 100, parseFloat(m[2]) / 100, parseFloat(m[3]) / 100);
            }
        }
        return new Color(0, 0, 0, 0);
    } else if (startsWith(s, 'hsla')) {
        m = s.match(/^hsla\s*\(\s*(\d+|\d+.\d+)\s*,\s*(\d+|\d+.\d+)%\s*,\s*(\d+|\d+.\d+)%\s*,\s*(\d+|\d+.\d+)\s*\)$/i);
        if (m) {
            return new Color(parseFloat(m[1]) / 360, parseFloat(m[2]) / 100, parseFloat(m[3]) / 100, parseFloat(m[4]));
        }
        return new Color(0, 0, 0, 0);
    } else if (startsWith(s, 'hsl')) {
        m = s.match(/^hsl\s*\(\s*(\d+|\d+.\d+)\s*,\s*(\d+|\d+.\d+)%\s*,\s*(\d+|\d+.\d+)%\s*\)$/i);
        if (m) {
            return new Color(parseFloat(m[1]) / 360, parseFloat(m[2]) / 100, parseFloat(m[3]) / 100);
        }
        return new Color(0, 0, 0, 0);
    } else if (s === 'none' || s === 'null' || startsWith(s, 'url(')) {
        return new Color(0, 0, 0, 0);
    } else {
        throw new Error('Color ' + s + 'can not be parsed');
    }
};

Color.gray = function (gray, alpha, range) {
    range = Math.max(range, 1);
    return new Color(gray / range, gray / range, gray / range, alpha / range);
};

Color.rgb = function (red, green, blue, alpha, range) {
    range = Math.max(range, 1);
    return new Color(red / range, green / range, blue / range, alpha / range);
};

Color.hsb = function (hue, saturation, brightness, alpha, range) {
    range = Math.max(range, 1);
    return new Color(hue / range, saturation / range, brightness / range, alpha / range, { mode: HSB });
};

Color.hsl = function (hue, saturation, lightness, alpha, range) {
    range = Math.max(range, 1);
    return new Color(hue / range, saturation / range, lightness / range, alpha / range, { mode: HSL });
};

module.exports = Color;

},{"../util/color":43,"../util/js":45,"../util/math":46}],33:[function(require,module,exports){
// Shape group object

'use strict';

var Path = require('../objects/path');
var Rect = require('../objects/rect');
var Color = require('../objects/color');

var Group = function (shapes) {
    if (!shapes) {
        this.shapes = [];
    } else if (shapes.shapes || shapes.commands) {
        this.shapes = [shapes];
    } else if (shapes) {
        this.shapes = shapes;
    }
};

Group.prototype.add = function (shape) {
    this.shapes.push(shape);
};

Group.prototype.clone = function () {
    var newShapes = [],
        n = this.shapes.length,
        i;
    newShapes.length = n;
    for (i = 0; i < n; i += 1) {
        newShapes[i] = this.shapes[i].clone();
    }
    return new Group(newShapes);
};

Group.prototype.colorize = function (options) {
    var args = arguments;
    if (typeof options !== 'object' || options instanceof Color) {
        options = {};
        if (args[0] !== undefined) { options.fill = args[0]; }
        if (args[1] !== undefined) { options.stroke = args[1]; }
        if (args[2] !== undefined) { options.strokeWidth = args[2]; }
    }
    var shapes = [];
    shapes.length = this.shapes.length;
    for (var i = 0; i < this.shapes.length; i += 1) {
        shapes[i] = this.shapes[i].colorize(options);
    }
    return new Group(shapes);
};

Group.prototype.desaturate = function (options) {
    var shapes = [];
    shapes.length = this.shapes.length;
    for (var i = 0; i < this.shapes.length; i += 1) {
        shapes[i] = this.shapes[i].desaturate(options);
    }
    return new Group(shapes);
};

Group.prototype.invert = function () {
    var shapes = [];
    shapes.length = this.shapes.length;
    for (var i = 0; i < this.shapes.length; i += 1) {
        shapes[i] = this.shapes[i].invert();
    }
    return new Group(shapes);
};

Group.prototype.bounds = function () {
    if (this.shapes.length === 0) { return new Rect(0, 0, 0, 0); }
    var i, r, shape,
        shapes = this.shapes;
    for (i = 0; i < shapes.length; i += 1) {
        shape = shapes[i];
        if (r === undefined) {
            r = shape.bounds();
        }
        if ((shape.shapes && shape.shapes.length !== 0) ||
            (shape.commands && shape.commands.length !== 0)) {
            r = r.unite(shape.bounds());
        }
    }
    return (r !== undefined) ? r : new Rect(0, 0, 0, 0);
};

// Returns true when point (x,y) falls within the contours of the group.
Group.prototype.contains = function (x, y, precision) {
    if (precision === undefined) { precision = 100; }
    var i, shapes = this.shapes;
    for (i = 0; i < shapes.length; i += 1) {
        if (shapes[i].contains(x, y, precision)) {
            return true;
        }
    }
    return false;
};

Group.prototype.length = function (precision) {
    if (precision === undefined) { precision = 10; }
    var sum = 0;
    var shapes = this.shapes;
    for (var i = 0; i < shapes.length; i += 1) {
        sum += shapes[i].length(precision);
    }
    return sum;
};

Group.prototype.resampleByAmount = function (points, perContour) {
    var path;
    if (!perContour) {
        path = new Path.combine(this);
        return path.resampleByAmount(points, perContour);
    }
    var shapes = [];
    shapes.length = this.shapes.length;
    for (var i = 0; i < this.shapes.length; i += 1) {
        shapes[i] = this.shapes[i].resampleByAmount(points, perContour);
    }
    return new Group(shapes);
};

Group.prototype.resampleByLength = function (length) {
    var shapes = [];
    shapes.length = this.shapes.length;
    for (var i = 0; i < this.shapes.length; i += 1) {
        shapes[i] = this.shapes[i].resampleByLength(length);
    }
    return new Group(shapes);
};

Group.prototype.toSVG = function () {
    var l = [];
    l.length = this.shapes.length;
    for (var i = 0; i < this.shapes.length; i += 1) {
        l[i] = this.shapes[i].toSVG();
    }
    return '<g>' + l.join('') + '</g>';
};

// Draw the group to a 2D context.
Group.prototype.draw = function (ctx) {
    var i, shapes = this.shapes, nShapes = shapes.length;
    for (i = 0; i < nShapes; i += 1) {
        shapes[i].draw(ctx);
    }
};

module.exports = Group;

},{"../objects/color":32,"../objects/path":35,"../objects/rect":37}],34:[function(require,module,exports){
// 3-dimensional matrix

'use strict';

var Vec3 = require('../objects/vec3');

// Construct a 4x4 matrix.
var Matrix4 = function (m) {
    if (m !== undefined) {
       // TODO Check for type and length
        this.m = m;
    } else {
        m = new Float32Array(16);
        m[0] = 1.0;
        m[1] = 0.0;
        m[2] = 0.0;
        m[3] = 0.0;
        m[4] = 0.0;
        m[5] = 1.0;
        m[6] = 0.0;
        m[7] = 0.0;
        m[8] = 0.0;
        m[9] = 0.0;
        m[10] = 1.0;
        m[11] = 0.0;
        m[12] = 0.0;
        m[13] = 0.0;
        m[14] = 0.0;
        m[15] = 1.0;
        this.m = m;
    }
};

Matrix4.IDENTITY = new Matrix4();

// Create a perspective matrix transformation.
Matrix4.perspective = function (fov, aspect, zNear, zFar) {
    var m = new Float32Array(Matrix4.IDENTITY.m),
        tan = 1.0 / (Math.tan(fov * 0.5));

    m[0] = tan / aspect;
    m[1] = m[2] = m[3] = 0.0;
    m[5] = tan;
    m[4] = m[6] = m[7] = 0.0;
    m[8] = m[9] = 0.0;
    m[10] = -zFar / (zNear - zFar);
    m[11] = 1.0;
    m[12] = m[13] = m[15] = 0.0;
    m[14] = (zNear * zFar) / (zNear - zFar);

    return new Matrix4(m);
};

Matrix4.lookAt = function (eye, target, up) {
    var m, zAxis, xAxis, yAxis, ex, ey, ez;
    m = new Float32Array(16);
    zAxis = target.subtract(eye).normalize();
    xAxis = Vec3.cross(up, zAxis).normalize();
    yAxis = Vec3.cross(zAxis, xAxis).normalize();

    ex = -Vec3.dot(xAxis, eye);
    ey = -Vec3.dot(yAxis, eye);
    ez = -Vec3.dot(zAxis, eye);

    m[0] = xAxis.x;
    m[1] = yAxis.x;
    m[2] = zAxis.x;
    m[3] = 0;
    m[4] = xAxis.y;
    m[5] = yAxis.y;
    m[6] = zAxis.y;
    m[7] = 0;
    m[8] = xAxis.z;
    m[9] = yAxis.z;
    m[10] = zAxis.z;
    m[11] = 0;
    m[12] = ex;
    m[13] = ey;
    m[14] = ez;
    m[15] = 1;

    return new Matrix4(m);
};

// Return a new matrix with the inversion of this matrix.
Matrix4.prototype.invert = function () {
    var l1, l2, l3, l4, l5, l6, l7, l8, l9, l10, l11, l12, l13, l14, l15, l16, l17, l18, l19, l20, l21, l22, l23, l24, l25, l26, l27, l28,
        l29, l30, l31, l32, l33, l34, l35, l36, l37, l38, l39, m;
    l1 = this.m[0];
    l2 = this.m[1];
    l3 = this.m[2];
    l4 = this.m[3];
    l5 = this.m[4];
    l6 = this.m[5];
    l7 = this.m[6];
    l8 = this.m[7];
    l9 = this.m[8];
    l10 = this.m[9];
    l11 = this.m[10];
    l12 = this.m[11];
    l13 = this.m[12];
    l14 = this.m[13];
    l15 = this.m[14];
    l16 = this.m[15];
    l17 = (l11 * l16) - (l12 * l15);
    l18 = (l10 * l16) - (l12 * l14);
    l19 = (l10 * l15) - (l11 * l14);
    l20 = (l9 * l16) - (l12 * l13);
    l21 = (l9 * l15) - (l11 * l13);
    l22 = (l9 * l14) - (l10 * l13);
    l23 = ((l6 * l17) - (l7 * l18)) + (l8 * l19);
    l24 = -(((l5 * l17) - (l7 * l20)) + (l8 * l21));
    l25 = ((l5 * l18) - (l6 * l20)) + (l8 * l22);
    l26 = -(((l5 * l19) - (l6 * l21)) + (l7 * l22));
    l27 = 1.0 / ((((l1 * l23) + (l2 * l24)) + (l3 * l25)) + (l4 * l26));
    l28 = (l7 * l16) - (l8 * l15);
    l29 = (l6 * l16) - (l8 * l14);
    l30 = (l6 * l15) - (l7 * l14);
    l31 = (l5 * l16) - (l8 * l13);
    l32 = (l5 * l15) - (l7 * l13);
    l33 = (l5 * l14) - (l6 * l13);
    l34 = (l7 * l12) - (l8 * l11);
    l35 = (l6 * l12) - (l8 * l10);
    l36 = (l6 * l11) - (l7 * l10);
    l37 = (l5 * l12) - (l8 * l9);
    l38 = (l5 * l11) - (l7 * l9);
    l39 = (l5 * l10) - (l6 * l9);

    m = new Float32Array(16);
    m[0] = l23 * l27;
    m[4] = l24 * l27;
    m[8] = l25 * l27;
    m[12] = l26 * l27;
    m[1] = -(((l2 * l17) - (l3 * l18)) + (l4 * l19)) * l27;
    m[5] = (((l1 * l17) - (l3 * l20)) + (l4 * l21)) * l27;
    m[9] = -(((l1 * l18) - (l2 * l20)) + (l4 * l22)) * l27;
    m[13] = (((l1 * l19) - (l2 * l21)) + (l3 * l22)) * l27;
    m[2] = (((l2 * l28) - (l3 * l29)) + (l4 * l30)) * l27;
    m[6] = -(((l1 * l28) - (l3 * l31)) + (l4 * l32)) * l27;
    m[10] = (((l1 * l29) - (l2 * l31)) + (l4 * l33)) * l27;
    m[14] = -(((l1 * l30) - (l2 * l32)) + (l3 * l33)) * l27;
    m[3] = -(((l2 * l34) - (l3 * l35)) + (l4 * l36)) * l27;
    m[7] = (((l1 * l34) - (l3 * l37)) + (l4 * l38)) * l27;
    m[11] = -(((l1 * l35) - (l2 * l37)) + (l4 * l39)) * l27;
    m[15] = (((l1 * l36) - (l2 * l38)) + (l3 * l39)) * l27;
    return new Matrix4(m);
};

Matrix4.prototype.multiply = function (other) {
    var m = new Float32Array(16);

    m[0] = this.m[0] * other.m[0] + this.m[1] * other.m[4] + this.m[2] * other.m[8] + this.m[3] * other.m[12];
    m[1] = this.m[0] * other.m[1] + this.m[1] * other.m[5] + this.m[2] * other.m[9] + this.m[3] * other.m[13];
    m[2] = this.m[0] * other.m[2] + this.m[1] * other.m[6] + this.m[2] * other.m[10] + this.m[3] * other.m[14];
    m[3] = this.m[0] * other.m[3] + this.m[1] * other.m[7] + this.m[2] * other.m[11] + this.m[3] * other.m[15];

    m[4] = this.m[4] * other.m[0] + this.m[5] * other.m[4] + this.m[6] * other.m[8] + this.m[7] * other.m[12];
    m[5] = this.m[4] * other.m[1] + this.m[5] * other.m[5] + this.m[6] * other.m[9] + this.m[7] * other.m[13];
    m[6] = this.m[4] * other.m[2] + this.m[5] * other.m[6] + this.m[6] * other.m[10] + this.m[7] * other.m[14];
    m[7] = this.m[4] * other.m[3] + this.m[5] * other.m[7] + this.m[6] * other.m[11] + this.m[7] * other.m[15];

    m[8] = this.m[8] * other.m[0] + this.m[9] * other.m[4] + this.m[10] * other.m[8] + this.m[11] * other.m[12];
    m[9] = this.m[8] * other.m[1] + this.m[9] * other.m[5] + this.m[10] * other.m[9] + this.m[11] * other.m[13];
    m[10] = this.m[8] * other.m[2] + this.m[9] * other.m[6] + this.m[10] * other.m[10] + this.m[11] * other.m[14];
    m[11] = this.m[8] * other.m[3] + this.m[9] * other.m[7] + this.m[10] * other.m[11] + this.m[11] * other.m[15];

    m[12] = this.m[12] * other.m[0] + this.m[13] * other.m[4] + this.m[14] * other.m[8] + this.m[15] * other.m[12];
    m[13] = this.m[12] * other.m[1] + this.m[13] * other.m[5] + this.m[14] * other.m[9] + this.m[15] * other.m[13];
    m[14] = this.m[12] * other.m[2] + this.m[13] * other.m[6] + this.m[14] * other.m[10] + this.m[15] * other.m[14];
    m[15] = this.m[12] * other.m[3] + this.m[13] * other.m[7] + this.m[14] * other.m[11] + this.m[15] * other.m[15];

    return new Matrix4(m);
};

Matrix4.prototype.translate = function (tx, ty, tz) {
    var m = new Float32Array(this.m);
    m[12] += tx;
    m[13] += ty;
    m[14] += tz;
    return new Matrix4(m);
};

module.exports = Matrix4;
},{"../objects/vec3":41}],35:[function(require,module,exports){
// Bézier path object

'use strict';

var flatten = require('lodash.flatten');

var bezier = require('../util/bezier');
var geo = require('../util/geo');
var math = require('../util/math');

var Color = require('../objects/color');
var Rect = require('../objects/rect');

var MOVETO  = bezier.MOVETO;
var LINETO  = bezier.LINETO;
var QUADTO  = bezier.QUADTO;
var CURVETO = bezier.CURVETO;
var CLOSE   = bezier.CLOSE;

var CLOSE_COMMAND = Object.freeze({ type: CLOSE });

var KAPPA = 0.5522847498307936; // (-1 + Math.sqrt(2)) / 3 * 4

function _cloneCommand(cmd) {
    var newCmd = {type: cmd.type};
    if (newCmd.type !== CLOSE) {
        newCmd.x = cmd.x;
        newCmd.y = cmd.y;
    }
    if (newCmd.type === QUADTO) {
        newCmd.x1 = cmd.x1;
        newCmd.y1 = cmd.y1;
    } else if (newCmd.type === CURVETO) {
        newCmd.x1 = cmd.x1;
        newCmd.y1 = cmd.y1;
        newCmd.x2 = cmd.x2;
        newCmd.y2 = cmd.y2;
    }
    return newCmd;
}

var Path = function (commands, fill, stroke, strokeWidth) {
    this.commands = commands !== undefined ? commands : [];
    this.fill = fill !== undefined ? fill : 'black';
    this.stroke = stroke !== undefined ? stroke : null;
    this.strokeWidth = strokeWidth !== undefined ? strokeWidth : 1;
};

Path.prototype.clone = function () {
    var p = new Path(),
        n = this.commands.length,
        i;
    p.commands.length = this.commands.length;
    for (i = 0; i < n; i += 1) {
        p.commands[i] = _cloneCommand(this.commands[i]);
    }
    p.fill = Color.clone(this.fill);
    p.stroke =  Color.clone(this.stroke);
    p.strokeWidth = this.strokeWidth;
    return p;
};

Path.prototype.extend = function (commandsOrPath) {
    var commands = commandsOrPath.commands || commandsOrPath;
    Array.prototype.push.apply(this.commands, commands);
};

Path.prototype.moveTo = function (x, y) {
    this.commands.push({type: MOVETO, x: x, y: y});
};

Path.prototype.lineTo = function (x, y) {
    this.commands.push({type: LINETO, x: x, y: y});
};

Path.prototype.curveTo = function (x1, y1, x2, y2, x, y) {
    this.commands.push({type: CURVETO, x1: x1, y1: y1, x2: x2, y2: y2, x: x, y: y});
};

Path.prototype.quadTo = function (x1, y1, x, y) {
    var prevX = this.commands[this.commands.length - 1].x,
        prevY = this.commands[this.commands.length - 1].y,
        cp1x = prevX + 2 / 3 * (x1 - prevX),
        cp1y = prevY + 2 / 3 * (y1 - prevY),
        cp2x = cp1x + 1 / 3 * (x - prevX),
        cp2y = cp1y + 1 / 3 * (y - prevY);
    this.curveTo(cp1x, cp1y, cp2x, cp2y, x, y);
};

Path.prototype.closePath = Path.prototype.close = function () {
    this.commands.push(CLOSE_COMMAND);
};

Path.prototype.isClosed = function () {
    if (this.commands.length === 0) { return false; }
    return this.commands[this.commands.length - 1].type === CLOSE;
};

Path.prototype.addRect = function (x, y, width, height) {
    this.moveTo(x, y);
    this.lineTo(x + width, y);
    this.lineTo(x + width, y + height);
    this.lineTo(x, y + height);
    this.close();
};

Path.prototype.addRoundedRect = function (cx, cy, width, height, rx, ry) {
    var ONE_MINUS_QUARTER = 1.0 - 0.552,

        dx = rx,
        dy = ry,

        left = cx,
        right = cx + width,
        top = cy,
        bottom = cy + height;

    // rx/ry cannot be greater than half of the width of the rectangle
    // (required by SVG spec)
    dx = Math.min(dx, width * 0.5);
    dy = Math.min(dy, height * 0.5);
    this.moveTo(left + dx, top);
    if (dx < width * 0.5) {
        this.lineTo(right - rx, top);
    }
    this.curveTo(right - dx * ONE_MINUS_QUARTER, top, right, top + dy * ONE_MINUS_QUARTER, right, top + dy);
    if (dy < height * 0.5) {
        this.lineTo(right, bottom - dy);
    }
    this.curveTo(right, bottom - dy * ONE_MINUS_QUARTER, right - dx * ONE_MINUS_QUARTER, bottom, right - dx, bottom);
    if (dx < width * 0.5) {
        this.lineTo(left + dx, bottom);
    }
    this.curveTo(left + dx * ONE_MINUS_QUARTER, bottom, left, bottom - dy * ONE_MINUS_QUARTER, left, bottom - dy);
    if (dy < height * 0.5) {
        this.lineTo(left, top + dy);
    }
    this.curveTo(left, top + dy * ONE_MINUS_QUARTER, left + dx * ONE_MINUS_QUARTER, top, left + dx, top);
    this.close();
};

Path.prototype.addEllipse = function (x, y, width, height) {
    var dx = KAPPA * 0.5 * width;
    var dy = KAPPA * 0.5 * height;
    var x0 = x + 0.5 * width;
    var y0 = y + 0.5 * height;
    var x1 = x + width;
    var y1 = y + height;

    this.moveTo(x, y0);
    this.curveTo(x, y0 - dy, x0 - dx, y, x0, y);
    this.curveTo(x0 + dx, y, x1, y0 - dy, x1, y0);
    this.curveTo(x1, y0 + dy, x0 + dx, y1, x0, y1);
    this.curveTo(x0 - dx, y1, x, y0 + dy, x, y0);
    this.close();
};

Path.prototype.addLine = function (x1, y1, x2, y2) {
    this.moveTo(x1, y1);
    this.lineTo(x2, y2);
};

Path.prototype.addQuad = function (x1, y1, x2, y2, x3, y3, x4, y4) {
    this.moveTo(x1, y1);
    this.lineTo(x2, y2);
    this.lineTo(x3, y3);
    this.lineTo(x4, y4);
    this.close();
};

Path.prototype.addArc = function (x, y, width, height, startAngle, degrees, arcType) {
    arcType = arcType || 'pie';
    var w, h, angStRad, ext, arcSegs, increment, cv, lineSegs,
        index, angle, relX, relY, coords;
    w = width / 2;
    h = height / 2;
    angStRad = math.radians(startAngle);
    ext = degrees;

    if (ext >= 360.0 || ext <= -360) {
        arcSegs = 4;
        increment = Math.PI / 2;
        cv = 0.5522847498307933;
        if (ext < 0) {
            increment = -increment;
            cv = -cv;
        }
    } else {
        arcSegs = Math.ceil(Math.abs(ext) / 90.0);
        increment = math.radians(ext / arcSegs);
        cv = 4.0 / 3.0 * Math.sin(increment / 2.0) / (1.0 + Math.cos(increment / 2.0));
        if (cv === 0) {
            arcSegs = 0;
        }
    }

    if (arcType === 'open') {
        lineSegs = 0;
    } else if (arcType === 'chord') {
        lineSegs = 1;
    } else if (arcType === 'pie') {
        lineSegs = 2;
    }

    if (w < 0 || h < 0) {
        arcSegs = lineSegs = -1;
    }

    index = 0;
    while (index <= arcSegs + lineSegs) {
        angle = angStRad;
        if (index === 0) {
            this.moveTo(x + Math.cos(angle) * w, y + Math.sin(angle) * h);
        } else if (index > arcSegs) {
            if (index === arcSegs + lineSegs) {
                this.close();
            } else {
                this.lineTo(x, y);
            }
        } else {
            angle += increment * (index - 1);
            relX = Math.cos(angle);
            relY = Math.sin(angle);
            coords = [];
            coords.push(x + (relX - cv * relY) * w);
            coords.push(y + (relY + cv * relX) * h);
            angle += increment;
            relX = Math.cos(angle);
            relY = Math.sin(angle);
            coords.push(x + (relX + cv * relY) * w);
            coords.push(y + (relY - cv * relX) * h);
            coords.push(x + relX * w);
            coords.push(y + relY * h);
            Path.prototype.curveTo.apply(this, coords);
        }
        index += 1;
    }
};

Path.prototype.colorize = function (options) {
    var args = arguments;
    if (typeof options !== 'object' || options instanceof Color) {
        options = {};
        if (args[0] !== undefined) { options.fill = args[0]; }
        if (args[1] !== undefined) { options.stroke = args[1]; }
        if (args[2] !== undefined) { options.strokeWidth = args[2]; }
    }
    var p = this.clone();
    if (options.fill) {
        p.fill = Color.clone(options.fill);
    }
    if (options.stroke) {
        p.stroke = Color.clone(options.stroke);
    }
    if (options.strokeWidth || options.strokeWidth === 0) {
        p.strokeWidth = options.strokeWidth;
    }
    return p;
};

Path.prototype.desaturate = function (options) {
    var p = this.clone();
    var fill = p.fill;
    var stroke = p.stroke;
    if (!(fill instanceof Color)) {
        fill = Color.parse(fill);
    }
    if (!(stroke instanceof Color)) {
        stroke = Color.parse(stroke);
    }
    p.fill = fill.desaturate(options);
    p.stroke = stroke.desaturate(options);
    return p;
};

Path.prototype.invert = function () {
    var p = this.clone();
    var fill = p.fill;
    var stroke = p.stroke;
    if (!(fill instanceof Color)) {
        fill = Color.parse(fill);
    }
    if (!(stroke instanceof Color)) {
        stroke = Color.parse(stroke);
    }
    p.fill = fill.invert();
    p.stroke = stroke.invert();
    return p;
};

Path.prototype.contours = function () {
    var contours = [],
        currentContour = [];

    var cmd;
    for (var i = 0; i < this.commands.length; i += 1) {
        cmd = this.commands[i];
        if (cmd.type === MOVETO) {
            if (currentContour.length !== 0) {
                contours.push(currentContour);
            }
            currentContour = [cmd];
        } else {
            currentContour.push(cmd);
        }
    }

    if (currentContour.length !== 0) {
        contours.push(currentContour);
    }

    return contours;
};

Path.prototype.bounds = function () {
    if (this._bounds) { return this._bounds; }
    if (this.commands.length === 0) { return new Rect(0, 0, 0, 0); }

    var px, py, prev, right, bottom,
        minX = Number.MAX_VALUE,
        minY = Number.MAX_VALUE,
        maxX = -(Number.MAX_VALUE),
        maxY = -(Number.MAX_VALUE);

    var cmd;
    for (var i = 0; i < this.commands.length; i += 1) {
        cmd = this.commands[i];
        if (cmd.type === MOVETO || cmd.type === LINETO) {
            px = cmd.x;
            py = cmd.y;
            if (px < minX) { minX = px; }
            if (py < minY) { minY = py; }
            if (px > maxX) { maxX = px; }
            if (py > maxY) { maxY = py; }
            prev = cmd;
        } else if (cmd.type === CURVETO) {
            var r = bezier.extrema(prev.x, prev.y, cmd.x1, cmd.y1, cmd.x2, cmd.y2, cmd.x, cmd.y);
            right = r.x + r.width;
            bottom = r.y + r.height;
            if (r.x < minX) { minX = r.x; }
            if (right > maxX) { maxX = right; }
            if (r.y < minY) { minY = r.y; }
            if (bottom > maxY) { maxY = bottom; }
            prev = cmd;
        }
    }

    return new Rect(minX, minY, maxX - minX, maxY - minY);
};

// Returns the DynamicPathElement at time t (0.0-1.0) on the path.
Path.prototype.point = function (t, segmentLengths) {
    if (segmentLengths === undefined) {
        // Cache the segment lengths for performance.
        segmentLengths = bezier.segmentLengths(this.commands, true, 10);
    }
    return bezier.point(this, t, segmentLengths);
};

// Returns an array of DynamicPathElements along the path.
// To omit the last point on closed paths: {end: 1-1.0/amount}
Path.prototype.points = function (amount, options) {
    var start = (options && options.start !== undefined) ? options.start : 0.0;
    var end = (options && options.end !== undefined) ? options.end : 1.0;
    if (this.commands.length === 0) {
        // Otherwise bezier.point() will raise an error for empty paths.
        return [];
    }
    amount = Math.round(amount);
    // "d" is the delta value for each point.
    // For closed paths (e.g. a circle), we don't want the last point, because it will equal the first point.
    // For open paths (e.g. a line) we do want the last point, so we use amount - 1.
    // E.g. If amount=4, and path is open, we want the point at t 0.0, 0.33, 0.66 and 1.0.
    // E.g. If amount=2, and path is open, we want the point at t 0.0 and 1.0.
    var d;
    if (options && options.closed) {
        d = (amount > 1) ? (end - start) / amount : (end - start);
    } else {
        d = (amount > 1) ? (end - start) / (amount - 1) : (end - start);
    }
    var pts = [];
    var segmentLengths = bezier.segmentLengths(this.commands, true, 10);
    for (var i = 0; i < amount; i += 1) {
        pts.push(this.point(start + d * i, segmentLengths));
    }
    return pts;
};

// Returns an approximation of the total length of the path.
Path.prototype.length = function (precision) {
    if (precision === undefined) { precision = 20; }
    return bezier.length(this, precision);
};

// Returns true when point (x,y) falls within the contours of the path.
Path.prototype.contains = function (x, y, precision) {
    var points = this.points(precision !== undefined ? precision : 100);
    return geo.pointInPolygon(points, x, y);
};

Path.prototype.resampleByAmount = function (points, perContour) {
    var subPaths = perContour ? this.contours() : [this.commands];
    var p = new Path([], this.fill, this.stroke, this.strokeWidth);
    for (var j = 0; j < subPaths.length; j += 1) {
        var subPath = new Path(subPaths[j]);
        var options = {};
        if (subPath.isClosed()) {
            options.closed = true;
        }
        var pts = subPath.points(points, options);
        for (var i = 0; i < pts.length; i += 1) {
            if (i === 0) {
                p.moveTo(pts[i].x, pts[i].y);
            } else {
                p.lineTo(pts[i].x, pts[i].y);
            }
        }
        if (subPath.isClosed()) {
            p.close();
        }
    }
    return p;
};

Path.prototype.resampleByLength = function (segmentLength, options) {
    options = options || {};
    var force = options.force || false;
    var subPaths = this.contours();
    var commands = [];
    if (!force) {
        segmentLength = Math.max(segmentLength, 1);
    }
    for (var i = 0; i < subPaths.length; i += 1) {
        var subPath = new Path(subPaths[i]);
        var contourLength = subPath.length();
        var amount = Math.ceil(contourLength / segmentLength);
        commands = commands.concat(subPath.resampleByAmount(amount).commands);
    }
    return new Path(commands, this.fill, this.stroke, this.strokeWidth);
};

Path.prototype.toPathData = function () {
    var i, d, cmd, x, y, x1, y1, x2, y2;
    d = '';
    for (i = 0; i < this.commands.length; i += 1) {
        cmd = this.commands[i];
        if (cmd.x !== undefined) {
            x = math.clamp(cmd.x, -9999, 9999);
            y = math.clamp(cmd.y, -9999, 9999);
        }
        if (cmd.x1 !== undefined) {
            x1 = math.clamp(cmd.x1, -9999, 9999);
            y1 = math.clamp(cmd.y1, -9999, 9999);
        }
        if (cmd.x2 !== undefined) {
            x2 = math.clamp(cmd.x2, -9999, 9999);
            y2 = math.clamp(cmd.y2, -9999, 9999);
        }
        if (cmd.type === MOVETO) {
            if (!isNaN(x) && !isNaN(y)) {
                d += 'M' + x + ' ' + y;
            }
        } else if (cmd.type === LINETO) {
            if (!isNaN(x) && !isNaN(y)) {
                d += 'L' + x + ' ' + y;
            }
        } else if (cmd.type === QUADTO) {
            if (!isNaN(x) && !isNaN(y) && !isNaN(x1) && !isNaN(y1)) {
                d += 'Q' + x1 + ' ' + y1 + ' ' + x + ' ' + y;
            }
        } else if (cmd.type === CURVETO) {
            if (!isNaN(x) && !isNaN(y) && !isNaN(x1) && !isNaN(y1) && !isNaN(x2) && !isNaN(y2)) {
                d += 'C' + x1 + ' ' + y1 + ' ' + x2 + ' ' + y2 + ' ' + x + ' ' + y;
            }
        } else if (cmd.type === CLOSE) {
            d += 'Z';
        }
    }
    return d;
};

// Output the path as an SVG string.
Path.prototype.toSVG = function () {
    var svg = '<path d="';
    svg += this.toPathData();
    svg += '"';

    var style = '';

    var fill;
    var fillOpacity;
    if (this.fill) {
        fill = Color.parse(this.fill);
        if (fill.a < 1) {
            fillOpacity = fill.a;
        }
        fill = Color.toHex(fill).substring(0, 7);
    }

    if (fill !== 'black' && fill !== '#000000') {
        if (fill === null || fill === undefined) {
            style += 'fill:none;';
        } else {
            style += 'fill:' + fill + ';';
        }
    }

    if (fillOpacity !== undefined) {
        style += 'fill-opacity:' + fillOpacity + ';';
    }

    var stroke;
    var strokeOpacity;

    if (this.stroke) {
        stroke = Color.parse(this.stroke);
        if (stroke.a < 1) {
            strokeOpacity = stroke.a;
        }
        stroke = Color.toHex(stroke).substring(0, 7);
    }
    if (stroke) {
        style += 'stroke:' + stroke + ';';
        style += 'stroke-width:' + this.strokeWidth + ';';
    }
    if (strokeOpacity !== undefined) {
        style += 'stroke-opacity:' + strokeOpacity + ';';
    }
    if (style) {
        svg += ' style="' + style + '"';
    }
    svg += '/>';
    return svg;
};

// Draw the path to a 2D context.
Path.prototype.draw = function (ctx) {
    var nCommands, i, cmd;
    ctx.beginPath();
    nCommands = this.commands.length;
    for (i = 0; i < nCommands; i += 1) {
        cmd = this.commands[i];
        if (cmd.type === MOVETO) {
            ctx.moveTo(cmd.x, cmd.y);
        } else if (cmd.type === LINETO) {
            ctx.lineTo(cmd.x, cmd.y);
        } else if (cmd.type === QUADTO) {
            ctx.quadraticCurveTo(cmd.x1, cmd.y1, cmd.x, cmd.y);
        } else if (cmd.type === CURVETO) {
            ctx.bezierCurveTo(cmd.x1, cmd.y1, cmd.x2, cmd.y2, cmd.x, cmd.y);
        } else if (cmd.type === CLOSE) {
            ctx.closePath();
        }
    }
    if (this.fill !== null && this.fill !== undefined) {
        ctx.fillStyle = Color.toCSS(this.fill);
        ctx.fill();
    }
    if (this.stroke !== null && this.stroke !== undefined && this.strokeWidth !== null && this.strokeWidth > 0) {
        ctx.strokeStyle = Color.toCSS(this.stroke);
        ctx.lineWidth = this.strokeWidth;
        ctx.stroke();
    }
};

Path.combine = function () {
    var args = Array.apply(null, arguments);
    var shapes = flatten(args);
    var shape, commands = [];
    for (var i = 0; i < shapes.length; i += 1) {
        shape = shapes[i];
        if (shape.commands) {
            commands = commands.concat(shape.commands);
        } else if (shape.shapes) {
            commands = commands.concat(Path.combine(shape.shapes).commands);
        }
    }
    return new Path(commands);
};

module.exports = Path;

},{"../objects/color":32,"../objects/rect":37,"../util/bezier":42,"../util/geo":44,"../util/math":46,"lodash.flatten":3}],36:[function(require,module,exports){
// 2-dimensional point object.

'use strict';

var Point = function (x, y) {
    this.x = x !== undefined ? x : 0;
    this.y = y !== undefined ? y : 0;
};

Object.defineProperty(Point.prototype, 'xy', {
    get: function () { return [this.x, this.y]; }
});

Point.ZERO = new Point(0, 0);

Point.read = function (x, y) {
    if (arguments.length === 2) { return new Point(x, y); }
    var arg = x;
    if (arg instanceof Point) {
        return arg;
    } else if (typeof arg === 'number') {
        return new Point(arg, arg);
    } else if (Array.isArray(arg)) {
        if (arg.length === 0) { return Point.ZERO; }
        x = arg[0];
        y = arg.length > 1 ? arg[1] : x;
        return new Point(x, y);
    } else if (arg.x !== undefined && arg.y !== undefined) {
        return new Point(arg.x, arg.y);
    } else {
        return Point.ZERO;
    }
};

Point.prototype.clone = function () {
    return new Point(this.x, this.y);
};

Point.prototype.add = function (v) {
    return new Point(this.x + v.x, this.y + v.y);
};

Point.prototype.subtract = Point.prototype.sub = function (v) {
    return new Point(this.x - v.x, this.y - v.y);
};

Point.prototype.divide = function (n) {
    return new Point(this.x / n, this.y / n);
};

Point.prototype.multiply = function (n) {
    return new Point(this.x * n, this.y * n);
};

Point.prototype.magnitude = function () {
    return Math.sqrt(this.x * this.x + this.y * this.y);
};

Point.prototype.magnitudeSquared = function () {
    return this.x * this.x + this.y * this.y;
};

Point.prototype.heading = function () {
    return Math.atan2(this.y, this.x);
};

Point.prototype.distanceTo = function (v) {
    var dx = this.x - v.x,
        dy = this.y - v.y;
    return Math.sqrt(dx * dx + dy * dy);
};

Point.prototype.normalize = function () {
    var m = this.magnitude();
    if (m !== 0) {
        return this.divide(m);
    } else {
        return Point.ZERO;
    }
};

Point.prototype.limit = function (speed) {
    if (this.magnitudeSquared() > speed * speed) {
        return this.normalize().multiply(speed);
    }
    return this;
};

Point.prototype.translate = function (tx, ty) {
    return new Point(this.x + tx, this.y + ty);
};

Point.prototype.scale = function (sx, sy) {
    sy = sy !== undefined ? sy : sx;
    return new Point(this.x * sx, this.y * sy);
};

Point.prototype.toString = function () {
    return '[' + this.x + ', ' + this.y + ']';
};

module.exports = Point;
},{}],37:[function(require,module,exports){
// Rectangle object

'use strict';

var Point = require('../objects/point');

var Rect = function (x, y, width, height) {
    this.x = x !== undefined ? x : 0;
    this.y = y !== undefined ? y : 0;
    this.width = width !== undefined ? width : 0;
    this.height = height !== undefined ? height : 0;
};

Object.defineProperty(Rect.prototype, 'xywh', {
    get: function () { return [this.x, this.y, this.width, this.height]; }
});

// Returns a new rectangle where width and height are guaranteed to be positive values.
Rect.prototype.normalize = function () {
    var x = this.x,
        y = this.y,
        width = this.width,
        height = this.height;

    if (width < 0) {
        x += width;
        width = -width;
    }

    if (height < 0) {
        y += height;
        height = -height;
    }
    return new Rect(x, y, width, height);
};

Rect.prototype.containsPoint = function (x, y) {
    if (arguments.length === 1) {
        y = x.y;
        x = x.x;
    }
    return (x >= this.x && x <= this.x + this.width && y >= this.y && y <= this.y + this.height);
};

Rect.prototype.containsRect = function (r) {
    return r.x >= this.x && r.x + r.width <= this.x + this.width &&
        r.y >= this.y && r.y + r.height <= this.y + this.height;
};

Rect.prototype.grow = function (dx, dy) {
    var x = this.x - dx,
        y = this.y - dy,
        width = this.width + dx * 2,
        height = this.height + dy * 2;
    return new Rect(x, y, width, height);
};

Rect.prototype.unite = function (r) {
    var x = Math.min(this.x, r.x),
        y = Math.min(this.y, r.y),
        width = Math.max(this.x + this.width, r.x + r.width) - x,
        height = Math.max(this.y + this.height, r.y + r.height) - y;
    return new Rect(x, y, width, height);
};

Rect.prototype.addPoint = function (x, y) {
    var dx, dy,
        _x = this.x,
        _y = this.y,
        width = this.width,
        height = this.height;

    if (x < this.x) {
        dx = this.x - x;
        _x = x;
        width += dx;
    } else if (x > this.x + this.width) {
        dx = x - (this.x + this.width);
        width += dx;
    }
    if (y < this.y) {
        dy = this.y - y;
        _y = y;
        height += dy;
    } else if (y > this.y + this.height) {
        dy = y - (this.y + this.height);
        height += dy;
    }
    return new Rect(_x, _y, width, height);
};

Rect.prototype.centerPoint = function () {
    return new Point(this.x + this.width / 2, this.y + this.height / 2);
};

module.exports = Rect;
},{"../objects/point":36}],38:[function(require,module,exports){
// Text object

// Internally the object is called "GText" to avoid conflicts with the DOM Text object.
// Externally it is exposed as g.Text.

'use strict';

var Color = require('../objects/color');
var Rect = require('../objects/rect');
var Transform = require('../objects/transform');

var _dummyContext = null;

// Generates a Text object.
// The function can take many possible argument forms, either by listing them in order
// (text, x, y, fontFamily, fontSize, align, fill), or by using an options object.
// The position can be specified as x, y; using a point {x: 10, y: 20} or using an array [10, 20].
// Here are a couple of ways to generate 'Hello' at position 0, 0 in 12pt Helvetica, centered.
//
//     new g.Text('Hello', {x: 0, y: 0}, 'Helvetica', 12, 'center');
//     new g.Text('Hello', [0, 0], {fontFamily: 'Helvetica', fontSize: 12, textAlign: 'center'});
//     new g.Text('Hello', 0, 0, {fontFamily: 'Helvetica', fontSize: 12});  // align: center is the default.
//     new g.Text('Hello', {fontFamily: 'Helvetica', fontSize: 12}); // the position defaults to 0,0.
var GText = function (text) {
    var args = Array.prototype.slice.call(arguments, 1),
        secondArg = arguments[1],
        thirdArg = arguments[2],
        lastArg = arguments[arguments.length - 1],
        options;

    // The text is required and always the first argument.
    this.text = String(text);

    // Second argument is position (as object or array) or x (as number).
    if (typeof secondArg === 'number') {
        this.x = secondArg;
        this.y = thirdArg;
        args = args.slice(2);
    } else if (Array.isArray(secondArg)) {
        this.x = secondArg[0];
        this.y = secondArg[1];
        args = args.slice(1);
    } else if (typeof secondArg === 'object') {
        this.x = secondArg.x !== undefined ? secondArg.x : 0;
        this.y = secondArg.y !== undefined ? secondArg.y : 0;
        args = args.slice(1);
    } else {
        this.x = 0;
        this.y = 0;
    }

    // The options object, if provided, is always the last argument.
    if (typeof lastArg === 'object') {
        options = lastArg;
        if (secondArg !== lastArg) {
            args = args.slice(0, args.length - 1);
        }
    } else {
        options = {};
    }

    if (args.length) {
        this.fontFamily = args.shift();
    } else {
        this.fontFamily = options.fontFamily || options.fontName || options.font || 'sans-serif';
    }

    if (args.length) {
        this.fontSize = args.shift();
    } else {
        this.fontSize = options.fontSize || 24;
    }

    if (args.length) {
        this.textAlign = args.shift();
    } else {
        this.textAlign = options.align || options.textAlign || 'left';
    }

    if (args.length) {
        this.fill = args.shift();
    } else {
        this.fill = options.fill || 'black';
    }

    this.transform = new Transform();
};

GText.prototype.clone = function () {
    var t = new GText();
    t.text = this.text;
    t.x = this.x;
    t.y = this.y;
    t.fontFamily = this.fontFamily;
    t.fontSize = this.fontSize;
    t.textAlign = this.textAlign;
    t.fill = Color.clone(this.fill);
    t.transform = this.transform;
    return t;
};

// The `measureWidth` function requires a canvas, so we set up a dummy one
// that we re-use for the duration of the page.
GText._getDummyContext = function () {
    if (!_dummyContext) {
        if (typeof document !== 'undefined') {
            _dummyContext = document.createElement('canvas').getContext('2d');
        } else {
            // For node.js, use a fake context that estimates the width.
            _dummyContext = {
                font: '10px sans-serif',
                measureText: function (text) {
                    var fontSize = parseFloat(this.font);
                    // The 0.6 is the average width / fontSize ratio across all characters and font sizes.
                    return {width: text.length * fontSize * 0.6};
                }
            };
        }
    }
    return _dummyContext;
};

GText.prototype._getFont = function () {
    return this.fontSize + 'px ' + this.fontFamily;
};

GText.prototype.colorize = function (fill) {
    var t = this.clone();
    t.fill = Color.clone(fill);
    return t;
};

GText.prototype.draw = function (ctx) {
    ctx.save();
    ctx.font = this._getFont();
    ctx.textAlign = this.textAlign;
    var m = this.transform.m;
    ctx.transform(m[0], m[1], m[3], m[4], m[6], m[7]);
    ctx.fillStyle = Color.toCSS(this.fill);
    ctx.fillText(this.text, this.x, this.y);
    ctx.restore();
};

GText.prototype.bounds = function () {
    var ctx = GText._getDummyContext(),
        metrics,
        x = this.x;
    ctx.font = this._getFont();
    // FIXME: measureText returns a TextMetrics object that only contains width.
    metrics = ctx.measureText(this.text);
    if (this.textAlign === 'center') {
        x = this.x - (metrics.width / 2);
    } else if (this.textAlign === 'right') {
        x = this.x - metrics.width;
    }
    return new Rect(x, this.y - this.fontSize, metrics.width, this.fontSize * 1.2);
};

GText.prototype.toSVG = function () {
    var svg = '<text';
    svg += ' x="' + this.x + '"';
    svg += ' y="' + this.y + '"';
    svg += ' font-family="' + this.fontFamily + '"';
    svg += ' font-size="' + this.fontSize + '"';
    var textAnchor;
    if (this.textAlign === 'left') {
        textAnchor = 'start';
    } else if (this.textAlign === 'center') {
        textAnchor = 'middle';
    } else if (this.textAlign === 'right') {
        textAnchor = 'end';
    }
    svg += ' text-anchor="' + textAnchor + '"';
    if (this.fill !== 'black') {
        svg += ' fill="' + Color.toCSS(this.fill) + '"';
    }
    svg += '>';
    svg += this.text;
    svg += '</text>';
    return svg;
};

module.exports = GText;
},{"../objects/color":32,"../objects/rect":37,"../objects/transform":39}],39:[function(require,module,exports){
// 2-dimensional transformation matrix

'use strict';

var bezier = require('../util/bezier');
var math = require('../util/math');

var Group = require('../objects/group');
var Path = require('../objects/path');
var Point = require('../objects/point');

var MOVETO  = bezier.MOVETO;
var LINETO  = bezier.LINETO;
var QUADTO  = bezier.QUADTO;
var CURVETO = bezier.CURVETO;
var CLOSE   = bezier.CLOSE;

// A geometric transformation in Euclidean space (i.e. 2D)
// that preserves collinearity and ratio of distance between points.
// Linear transformations include rotation, translation, scaling, shear.
var Transform = function (m) {
    if (m !== undefined) {
        this.m = m;
    } else {
        this.m = [1, 0, 0, 1, 0, 0]; // Identity matrix.
    }
};

Transform.IDENTITY = new Transform();

Transform.identity = function () {
    return new Transform();
};

// Returns the 3x3 matrix multiplication of A and B.
// Note that scale(), translate(), rotate() work with premultiplication,
// e.g. the matrix A followed by B = BA and not AB.
Transform._mmult = function (a, b) {
    if (a.m !== undefined) { a = a.m; }
    if (b.m !== undefined) { b = b.m; }

    return new Transform([
        a[0] * b[0] + a[1] * b[2],
        a[0] * b[1] + a[1] * b[3],
        a[2] * b[0] + a[3] * b[2],
        a[2] * b[1] + a[3] * b[3],
        a[4] * b[0] + a[5] * b[2] + b[4],
        a[4] * b[1] + a[5] * b[3] + b[5]
    ]);
};

Transform.prototype.isIdentity = function () {
    var m = this.m;
    return (m[0] === 1 && m[1] === 0 && m[2] === 0 && m[3] === 1 && m[4] === 0 && m[5] === 0);
};

Transform.prototype.prepend = function (matrix) {
    return Transform._mmult(this.m, matrix.m);
};

Transform.prototype.append = function (matrix) {
    return Transform._mmult(matrix.m, this.m);
};

Transform.prototype.inverse = function () {
    var m = this.m,
        d = m[0] * m[3] - m[1] * m[2];
    return new Transform([
        m[3] / d,
        -m[1] / d,
        -m[2] / d,
        m[0] / d,
        (m[2] * m[5] - m[3] * m[4]) / d,
        -(m[0] * m[5] - m[1] * m[4]) / d
    ]);
};

Transform.prototype.scale = function (x, y) {
    if (y === undefined) { y = x; }
    return Transform._mmult([x, 0, 0, y, 0, 0], this.m);
};

Transform.prototype.translate = function (x, y) {
    return Transform._mmult([1, 0, 0, 1, x, y], this.m);
};

Transform.prototype.rotate = function (angle) {
    var c = Math.cos(math.radians(angle)),
        s = Math.sin(math.radians(angle));
    return Transform._mmult([c, s, -s, c, 0, 0], this.m);
};

Transform.prototype.skew = function (x, y) {
    var kx = Math.PI * x / 180.0,
        ky = Math.PI * y / 180.0;
    return Transform._mmult([1, Math.tan(ky), -Math.tan(kx), 1, 0, 0], this.m);
};

// Returns the new coordinates of the given point (x,y) after transformation.
Transform.prototype.transformPoint = function (point) {
    var x = point.x,
        y = point.y,
        m = this.m;
    return new Point(
        x * m[0] + y * m[2] + m[4],
        x * m[1] + y * m[3] + m[5]
    );
};

Transform.prototype.transformPoints = function (points) {
    var transformedPoints = [];
    for (var i = 0; i < points.length; i += 1) {
        transformedPoints.push(this.transformPoint(points[i]));
    }
    return transformedPoints;
};

Transform.prototype.transformPath = function (path) {
    var m = this.m;
    var commands = [];
    commands.length = path.commands.length;
    for (var i = 0, l = path.commands.length; i < l; i++) {
        var cmd = path.commands[i];
        switch(cmd.type) {
            case MOVETO:
            case LINETO:
                commands[i] = {
                    type: cmd.type,
                    x: cmd.x * m[0] + cmd.y * m[2] + m[4],
                    y: cmd.x * m[1] + cmd.y * m[3] + m[5]
                };
                break;
            case QUADTO:
                commands[i] = {
                    type: QUADTO,
                    x: cmd.x * m[0] + cmd.y * m[2] + m[4],
                    y: cmd.x * m[1] + cmd.y * m[3] + m[5],
                    x1: cmd.x1 * m[0] + cmd.y1 * m[2] + m[4],
                    y1: cmd.x1 * m[1] + cmd.y1 * m[3] + m[5]
                };
                break;
            case CURVETO:
                commands[i] = {
                    type: CURVETO,
                    x: cmd.x * m[0] + cmd.y * m[2] + m[4],
                    y: cmd.x * m[1] + cmd.y * m[3] + m[5],
                    x1: cmd.x1 * m[0] + cmd.y1 * m[2] + m[4],
                    y1: cmd.x1 * m[1] + cmd.y1 * m[3] + m[5],
                    x2: cmd.x2 * m[0] + cmd.y2 * m[2] + m[4],
                    y2: cmd.x2 * m[1] + cmd.y2 * m[3] + m[5]
                };
                break;
            case CLOSE:
                commands[i] = { type: CLOSE };
                break;
            default:
                throw new Error('Unknown command type ' + cmd);
        }
    }
    return new Path(commands, path.fill, path.stroke, path.strokeWidth);
};

Transform.prototype.transformText = function (text) {
    var t = text.clone();
    t.transform = this.append(t.transform);
    return t;
};

Transform.prototype.transformGroup = function (group) {
    var transformedShapes = [];
    for (var i = 0; i < group.shapes.length; i += 1) {
        transformedShapes.push(this.transformShape(group.shapes[i]));
    }
    return new Group(transformedShapes);
};

Transform.prototype.transformShape = function (shape) {
    var fn;
    if (shape.shapes) {
        fn = this.transformGroup;
    } else if (shape.commands) {
        fn = this.transformPath;
    } else if (shape.text) {
        fn = this.transformText;
    } else if (shape.x !== undefined && shape.y !== undefined) {
        fn = this.transformPoint;
    } else if (shape._transform !== undefined) {
        return shape._transform(this.m);
    } else if (Array.isArray(shape) && shape.length > 0) {
        if (shape[0].x !== undefined && shape[0].y !== undefined) {
            fn = this.transformPoints;
        } else {
            var l = [];
            for (var i = 0; i < shape.length; i += 1) {
                l.push(this.transformShape(shape[i]));
            }
            return l;
        }
    } else {
        throw new Error('Don\'t know how to transform ' + shape);
    }
    return fn.call(this, shape);
};

module.exports = Transform;

},{"../objects/group":33,"../objects/path":35,"../objects/point":36,"../util/bezier":42,"../util/math":46}],40:[function(require,module,exports){
// Mixin for Path and Group

'use strict';

var Point = require('../objects/point');
var Transform = require('../objects/transform');

var Transformable = {
    translate: function (position) {
        if (!position) { position = Point.ZERO; }
        var t = new Transform().translate(position.x, position.y);
        return t.transformShape(this);
    },

    scale: function (scale, origin) {
        if (!origin) { origin = Point.ZERO; }
        var sx, sy;
        if (typeof scale === 'number') {
            sx = scale;
            sy = scale;
        } else {
            sx = scale.x;
            sy = scale.y;
        }
        var t = new Transform();
        t = t.translate(origin.x, origin.y);
        t = t.scale(sx, sy);
        t = t.translate(-origin.x, -origin.y);
        return t.transformShape(this);
    },

    rotate: function (angle, origin) {
        if (!origin) { origin = Point.ZERO; }
        var t = new Transform();
        t = t.translate(origin.x, origin.y);
        t = t.rotate(angle);
        t = t.translate(-origin.x, -origin.y);
        return t.transformShape(this);
    },

    skew: function (skew, origin) {
        if (!origin) { origin = Point.ZERO; }
        var t = new Transform();
        t = t.translate(origin.x, origin.y);
        t = t.skew(skew.x, skew.y);
        t = t.translate(-origin.x, -origin.y);
        return t.transformShape(this);
    }
};

module.exports = Transformable;

},{"../objects/point":36,"../objects/transform":39}],41:[function(require,module,exports){
//// VECTORS AND MATRICES ///////////////////////////////////////////////

'use strict';

var Vec3 = function (x, y, z) {
    this.x = x === undefined ? 0 : x;
    this.y = y === undefined ? 0 : y;
    this.z = z === undefined ? 0 : z;
};

// Generate the zero vector.
Vec3.ZERO = new Vec3(0, 0, 0);

Vec3.up = function () {
    return new Vec3(0, 1.0, 0);
};

// Generate the dot product of two vectors.
Vec3.dot = function (a, b) {
    return (a.x * b.x + a.y * b.y + a.z * b.z);
};

// Generate the cross product of two vectors.
Vec3.cross = function (a, b) {
    return new Vec3(
        a.y * b.z - a.z * b.y,
        a.z * b.x - a.x * b.z,
        a.x * b.y - a.y * b.x
    );
};

// Convert this vector to a string representation.
Vec3.prototype.toString = function () {
    return '[' + this.x + ', ' + this.y + ', ' + this.z + ']';
};

// Convert this vector to an array.
Vec3.prototype.toArray = function () {
    var array = [];
    array.push(this.x);
    array.push(this.y);
    array.push(this.z);
    return array;
};

// Calculate the length of this vector.
Vec3.prototype.getLength = function () {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
};

// Create a new vector that is this vector, normalized.
Vec3.prototype.normalize = function () {
    var len, c;
    len = this.getLength();
    if (len === 0) {
        return this;
    }
    c = 1.0 / len;
    return new Vec3(this.x * c, this.y * c, this.z * c);
};

// Create a new vector that is the addition of this vector and the given vector.
Vec3.prototype.add = function (o) {
    return new Vec3(this.x + o.x, this.y + o.y, this.z + o.z);
};

// Create a new vector that is the subtraction of this vector and the given vector.
Vec3.prototype.subtract = function (o) {
    return new Vec3(this.x - o.x, this.y - o.y, this.z - o.z);
};

// Transform the vector according to the matrix and return the result.
// A new vector is created, nothing is modified.
Vec3.prototype.transform = function (matrix4) {
    var x, y, z, w, matrix;

    matrix = matrix4;
    x = (this.x * matrix.m[0]) + (this.y * matrix.m[4]) + (this.z * matrix.m[8]) + matrix.m[12];
    y = (this.x * matrix.m[1]) + (this.y * matrix.m[5]) + (this.z * matrix.m[9]) + matrix.m[13];
    z = (this.x * matrix.m[2]) + (this.y * matrix.m[6]) + (this.z * matrix.m[10]) + matrix.m[14];
    w = (this.x * matrix.m[3]) + (this.y * matrix.m[7]) + (this.z * matrix.m[11]) + matrix.m[15];

    return new Vec3(x / w, y / w, z / w);
};

module.exports = Vec3;
},{}],42:[function(require,module,exports){
// Bézier Math
// Thanks to Prof. F. De Smedt at the Vrije Universiteit Brussel, 2006.

'use strict';

var math = require('../util/math');

var Point = require('../objects/point');
var Rect = require('../objects/rect');

var bezier = {};

var MOVETO = bezier.MOVETO = 'M';
var LINETO = bezier.LINETO = 'L';
bezier.QUADTO = 'Q';
var CURVETO = bezier.CURVETO = 'C';
var CLOSE = bezier.CLOSE = 'Z';

// BEZIER MATH:

// Returns coordinates for the point at t (0.0-1.0) on the line.
bezier.linePoint = function (t, x0, y0, x1, y1) {
    var x = x0 + t * (x1 - x0),
        y = y0 + t * (y1 - y0);
    return { type: LINETO, x: x, y: y };
};

// Returns the length of the line.
bezier.lineLength = function (x0, y0, x1, y1) {
    var a = Math.pow(Math.abs(x0 - x1), 2),
        b = Math.pow(Math.abs(y0 - y1), 2);
    return Math.sqrt(a + b);
};

// Returns coordinates for the point at t (0.0-1.0) on the curve
// (de Casteljau interpolation algorithm).
bezier.curvePoint = function (t, x0, y0, x1, y1, x2, y2, x3, y3) {
    var dt = 1 - t,
        x01 = x0 * dt + x1 * t,
        y01 = y0 * dt + y1 * t,
        x12 = x1 * dt + x2 * t,
        y12 = y1 * dt + y2 * t,
        x23 = x2 * dt + x3 * t,
        y23 = y2 * dt + y3 * t,

        h1x = x01 * dt + x12 * t,
        h1y = y01 * dt + y12 * t,
        h2x = x12 * dt + x23 * t,
        h2y = y12 * dt + y23 * t,
        x = h1x * dt + h2x * t,
        y = h1y * dt + h2y * t;
    return { type: CURVETO, x1: h1x, y1: h1y, x2: h2x, y2: h2y, x: x, y: y };
};

// Returns the length of the curve.
// Integrates the estimated length of the cubic bezier spline defined by x0, y0, ... x3, y3,
// by adding up the length of n linear lines along the curve.
bezier.curveLength = function (x0, y0, x1, y1, x2, y2, x3, y3, n) {
    if (n === undefined) { n = 20; }
    var i, t, cmd,
        length = 0,
        xi = x0,
        yi = y0;
    for (i = 0; i < n; i += 1) {
        t = (i + 1) / n;
        cmd = bezier.curvePoint(t, x0, y0, x1, y1, x2, y2, x3, y3);
        length += Math.sqrt(
            Math.pow(Math.abs(xi - cmd.x), 2) +
                Math.pow(Math.abs(yi - cmd.y), 2)
        );
        xi = cmd.x;
        yi = cmd.y;
    }
    return length;
};

// BEZIER PATH LENGTH:

// Returns an array with the length of each command in the path.
// With relative=true, the total length of all commands is 1.0.
bezier.segmentLengths = function (commands, relative, n) {
    relative = relative !== undefined ? relative : false;
    if (n === undefined) { n = 20; }
    var i, cmd, type, closeX, closeY, x0, y0, s, lengths, ll;
    lengths = [];
    for (i = 0; i < commands.length; i += 1) {
        cmd = commands[i];
        type = cmd.type;

        if (i === 0) {
            closeX = cmd.x;
            closeY = cmd.y;
        } else if (type === MOVETO) {
            closeX = cmd.x;
            closeY = cmd.y;
            lengths.push(0.0);
        } else if (type === CLOSE) {
            lengths.push(bezier.lineLength(x0, y0, closeX, closeY));
        } else if (type === LINETO) {
            lengths.push(bezier.lineLength(x0, y0, cmd.x, cmd.y));
        } else if (type === CURVETO) {
            lengths.push(bezier.curveLength(x0, y0, cmd.x1, cmd.y1, cmd.x2, cmd.y2, cmd.x, cmd.y, n));
        }
        if (type !== CLOSE) {
            x0 = cmd.x;
            y0 = cmd.y;
        }
    }
    if (relative === true) {
        s = math.sum(lengths);
        ll = [];
        ll.length = lengths.length;
        if (s > 0) {
            for (i = 0; i < lengths.length; i += 1) {
                ll[i] = lengths[i] / s;
            }
        } else {
            for (i = 0; i < lengths.length; i += 1) {
                ll[i] = 0.0;
            }
        }
        return ll;
    }
    return lengths;
};

// Returns the approximate length of the path.
// Calculates the length of each curve in the path using n linear samples.
bezier.length = function (path, n) {
    n = n || 20;
    return math.sum(bezier.segmentLengths(path.commands, false, n));
};

// BEZIER PATH POINT:

// For a given relative t on the path (0.0-1.0), returns an array [index, t, PathElement],
// with the index of the PathElement before t, the absolute position on this segment,
// the last MOVETO or any subsequent CLOSE commands after i.
// Note: during iteration, supplying segment lengths yourself is 30x faster.
bezier._locate = function (path, t, segmentLengths) {
    var i, cmd, closeTo;
    if (segmentLengths === undefined) {
        segmentLengths = bezier.segmentLengths(path.commands, true);
    }
    for (i = 0; i < path.commands.length; i += 1) {
        cmd = path.commands[i];
        if (i === 0 || cmd.type === MOVETO) {
            closeTo =  new Point(cmd.x, cmd.y);
        }
        if (t <= segmentLengths[i] || i === segmentLengths.length - 1) {
            break;
        }
        t -= segmentLengths[i];
    }
    if (segmentLengths[i] !== 0) { t /= segmentLengths[i]; }
    if (i === segmentLengths.length - 1 && segmentLengths[i] === 0) { i -= 1; }
    return [i, t, closeTo];
};

// Returns the DynamicPathElement at time t on the path.
// Note: in PathElement, ctrl1 is how the curve started, and ctrl2 how it arrives in this point.
// Here, ctrl1 is how the curve arrives, and ctrl2 how it continues to the next point.
bezier.point = function (path, t, segmentLengths) {
    var loc, i, closeTo, x0, y0, cmd;
    loc = bezier._locate(path, t, segmentLengths);
    i = loc[0];
    t = loc[1];
    closeTo = loc[2];
    x0 = path.commands[i].x;
    y0 = path.commands[i].y;
    cmd = path.commands[i + 1];
    if (cmd.type === LINETO || cmd.type === CLOSE) {
        cmd = (cmd.type === CLOSE) ?
                 bezier.linePoint(t, x0, y0, closeTo.x, closeTo.y) :
                 bezier.linePoint(t, x0, y0, cmd.x, cmd.y);
    } else if (cmd.type === CURVETO) {
        cmd = bezier.curvePoint(t, x0, y0, cmd.x1, cmd.y1, cmd.x2, cmd.y2, cmd.x, cmd.y);
    }
    return cmd;
};

function fuzzyCompare(p1, p2) {
    return Math.abs(p1 - p2) <= (0.000000000001 * Math.min(Math.abs(p1), Math.abs(p2)));
}

function coefficients(t) {
    var mT, a, b, c, d;
    mT = 1 - t;
    b = mT * mT;
    c = t * t;
    d = c * t;
    a = b * mT;
    b *= (3.0 * t);
    c *= (3.0 * mT);
    return [a, b, c, d];
}

function pointAt(x1, y1, x2, y2, x3, y3, x4, y4, t) {
    var a, b, c, d, coeff;
    coeff = coefficients(t);
    a = coeff[0];
    b = coeff[1];
    c = coeff[2];
    d = coeff[3];
    return {x: a * x1 + b * x2 + c * x3 + d * x4,
            y: a * y1 + b * y2 + c * y3 + d * y4};
}

bezier.extrema = function (x1, y1, x2, y2, x3, y3, x4, y4) {
    var minX, maxX, minY, maxY,
        ax, bx, cx, ay, by, cy,
        temp, rcp, tx, ty;

    function bezierCheck(t) {
        if (t >= 0 && t <= 1) {
            var p = pointAt(x1, y1, x2, y2, x3, y3, x4, y4, t);
            if (p.x < minX) {
                minX = p.x;
            } else if (p.x > maxX) {
                maxX = p.x;
            }
            if (p.y < minY) {
                minY = p.y;
            } else if (p.y > maxY) {
                maxY = p.y;
            }
        }
    }

    if (x1 < x4) {
        minX = x1;
        maxX = x4;
    } else {
        minX = x4;
        maxX = x1;
    }
    if (y1 < y4) {
        minY = y1;
        maxY = y4;
    } else {
        minY = y4;
        maxY = y1;
    }

    ax = 3 * (-x1 + 3 * x2 - 3 * x3 + x4);
    bx = 6 * (x1 - 2 * x2 + x3);
    cx = 3 * (-x1 + x2);

    if (fuzzyCompare(ax + 1, 1)) {
        if (!fuzzyCompare(bx + 1, 1)) {
            bezierCheck(-cx / bx);
        }
    } else {
        tx = bx * bx - 4 * ax * cx;
        if (tx >= 0) {
            temp = Math.sqrt(tx);
            rcp = 1 / (2 * ax);
            bezierCheck((-bx + temp) * rcp);
            bezierCheck((-bx - temp) * rcp);
        }
    }

    ay = 3 * (-y1 + 3 * y2 - 3 * y3 + y4);
    by = 6 * (y1 - 2 * y2 + y3);
    cy = 3 * (-y1 + y2);

    if (fuzzyCompare(ay + 1, 1)) {
        if (!fuzzyCompare(by + 1, 1)) {
            bezierCheck(-cy / by);
        }
    } else {
        ty = by * by - 4 * ay * cy;
        if (ty > 0) {
            temp = Math.sqrt(ty);
            rcp = 1 / (2 * ay);
            bezierCheck((-by + temp) * rcp);
            bezierCheck((-by - temp) * rcp);
        }
    }

    return new Rect(minX, minY, maxX - minX, maxY - minY);
};

module.exports = bezier;

},{"../objects/point":36,"../objects/rect":37,"../util/math":46}],43:[function(require,module,exports){
// Color conversion functions

'use strict';

var color = {};

color.namedColors = {
    'lightpink'            : [1.00, 0.71, 0.76],
    'pink'                 : [1.00, 0.75, 0.80],
    'crimson'              : [0.86, 0.08, 0.24],
    'lavenderblush'        : [1.00, 0.94, 0.96],
    'palevioletred'        : [0.86, 0.44, 0.58],
    'hotpink'              : [1.00, 0.41, 0.71],
    'deeppink'             : [1.00, 0.08, 0.58],
    'mediumvioletred'      : [0.78, 0.08, 0.52],
    'orchid'               : [0.85, 0.44, 0.84],
    'thistle'              : [0.85, 0.75, 0.85],
    'plum'                 : [0.87, 0.63, 0.87],
    'violet'               : [0.93, 0.51, 0.93],
    'fuchsia'              : [1.00, 0.00, 1.00],
    'darkmagenta'          : [0.55, 0.00, 0.55],
    'purple'               : [0.50, 0.00, 0.50],
    'mediumorchid'         : [0.73, 0.33, 0.83],
    'darkviolet'           : [0.58, 0.00, 0.83],
    'darkorchid'           : [0.60, 0.20, 0.80],
    'indigo'               : [0.29, 0.00, 0.51],
    'blueviolet'           : [0.54, 0.17, 0.89],
    'mediumpurple'         : [0.58, 0.44, 0.86],
    'mediumslateblue'      : [0.48, 0.41, 0.93],
    'slateblue'            : [0.42, 0.35, 0.80],
    'darkslateblue'        : [0.28, 0.24, 0.55],
    'ghostwhite'           : [0.97, 0.97, 1.00],
    'lavender'             : [0.90, 0.90, 0.98],
    'blue'                 : [0.00, 0.00, 1.00],
    'mediumblue'           : [0.00, 0.00, 0.80],
    'darkblue'             : [0.00, 0.00, 0.55],
    'navy'                 : [0.00, 0.00, 0.50],
    'midnightblue'         : [0.10, 0.10, 0.44],
    'royalblue'            : [0.25, 0.41, 0.88],
    'cornflowerblue'       : [0.39, 0.58, 0.93],
    'lightsteelblue'       : [0.69, 0.77, 0.87],
    'lightslategray'       : [0.47, 0.53, 0.60],
    'slategray'            : [0.44, 0.50, 0.56],
    'dodgerblue'           : [0.12, 0.56, 1.00],
    'aliceblue'            : [0.94, 0.97, 1.00],
    'steelblue'            : [0.27, 0.51, 0.71],
    'lightskyblue'         : [0.53, 0.81, 0.98],
    'skyblue'              : [0.53, 0.81, 0.92],
    'deepskyblue'          : [0.00, 0.75, 1.00],
    'lightblue'            : [0.68, 0.85, 0.90],
    'powderblue'           : [0.69, 0.88, 0.90],
    'cadetblue'            : [0.37, 0.62, 0.63],
    'darkturquoise'        : [0.00, 0.81, 0.82],
    'azure'                : [0.94, 1.00, 1.00],
    'lightcyan'            : [0.88, 1.00, 1.00],
    'paleturquoise'        : [0.69, 0.93, 0.93],
    'aqua'                 : [0.00, 1.00, 1.00],
    'darkcyan'             : [0.00, 0.55, 0.55],
    'teal'                 : [0.00, 0.50, 0.50],
    'darkslategray'        : [0.18, 0.31, 0.31],
    'mediumturquoise'      : [0.28, 0.82, 0.80],
    'lightseagreen'        : [0.13, 0.70, 0.67],
    'turquoise'            : [0.25, 0.88, 0.82],
    'aquamarine'           : [0.50, 1.00, 0.83],
    'mediumaquamarine'     : [0.40, 0.80, 0.67],
    'mediumspringgreen'    : [0.00, 0.98, 0.60],
    'mintcream'            : [0.96, 1.00, 0.98],
    'springgreen'          : [0.00, 1.00, 0.50],
    'mediumseagreen'       : [0.24, 0.70, 0.44],
    'seagreen'             : [0.18, 0.55, 0.34],
    'honeydew'             : [0.94, 1.00, 0.94],
    'darkseagreen'         : [0.56, 0.74, 0.56],
    'palegreen'            : [0.60, 0.98, 0.60],
    'lightgreen'           : [0.56, 0.93, 0.56],
    'limegreen'            : [0.20, 0.80, 0.20],
    'lime'                 : [0.00, 1.00, 0.00],
    'forestgreen'          : [0.13, 0.55, 0.13],
    'green'                : [0.00, 0.50, 0.00],
    'darkgreen'            : [0.00, 0.39, 0.00],
    'lawngreen'            : [0.49, 0.99, 0.00],
    'chartreuse'           : [0.50, 1.00, 0.00],
    'greenyellow'          : [0.68, 1.00, 0.18],
    'darkolivegreen'       : [0.33, 0.42, 0.18],
    'yellowgreen'          : [0.60, 0.80, 0.20],
    'olivedrab'            : [0.42, 0.56, 0.14],
    'ivory'                : [1.00, 1.00, 0.94],
    'beige'                : [0.96, 0.96, 0.86],
    'lightyellow'          : [1.00, 1.00, 0.88],
    'lightgoldenrodyellow' : [0.98, 0.98, 0.82],
    'yellow'               : [1.00, 1.00, 0.00],
    'olive'                : [0.50, 0.50, 0.00],
    'darkkhaki'            : [0.74, 0.72, 0.42],
    'palegoldenrod'        : [0.93, 0.91, 0.67],
    'lemonchiffon'         : [1.00, 0.98, 0.80],
    'khaki'                : [0.94, 0.90, 0.55],
    'gold'                 : [1.00, 0.84, 0.00],
    'cornsilk'             : [1.00, 0.97, 0.86],
    'goldenrod'            : [0.85, 0.65, 0.13],
    'darkgoldenrod'        : [0.72, 0.53, 0.04],
    'floralwhite'          : [1.00, 0.98, 0.94],
    'oldlace'              : [0.99, 0.96, 0.90],
    'wheat'                : [0.96, 0.87, 0.07],
    'orange'               : [1.00, 0.65, 0.00],
    'moccasin'             : [1.00, 0.89, 0.71],
    'papayawhip'           : [1.00, 0.94, 0.84],
    'blanchedalmond'       : [1.00, 0.92, 0.80],
    'navajowhite'          : [1.00, 0.87, 0.68],
    'antiquewhite'         : [0.98, 0.92, 0.84],
    'tan'                  : [0.82, 0.71, 0.55],
    'burlywood'            : [0.87, 0.72, 0.53],
    'darkorange'           : [1.00, 0.55, 0.00],
    'bisque'               : [1.00, 0.89, 0.77],
    'linen'                : [0.98, 0.94, 0.90],
    'peru'                 : [0.80, 0.52, 0.25],
    'peachpuff'            : [1.00, 0.85, 0.73],
    'sandybrown'           : [0.96, 0.64, 0.38],
    'chocolate'            : [0.82, 0.41, 0.12],
    'saddlebrown'          : [0.55, 0.27, 0.07],
    'seashell'             : [1.00, 0.96, 0.93],
    'sienna'               : [0.63, 0.32, 0.18],
    'lightsalmon'          : [1.00, 0.63, 0.48],
    'coral'                : [1.00, 0.50, 0.31],
    'orangered'            : [1.00, 0.27, 0.00],
    'darksalmon'           : [0.91, 0.59, 0.48],
    'tomato'               : [1.00, 0.39, 0.28],
    'salmon'               : [0.98, 0.50, 0.45],
    'mistyrose'            : [1.00, 0.89, 0.88],
    'lightcoral'           : [0.94, 0.50, 0.50],
    'snow'                 : [1.00, 0.98, 0.98],
    'rosybrown'            : [0.74, 0.56, 0.56],
    'indianred'            : [0.80, 0.36, 0.36],
    'red'                  : [1.00, 0.00, 0.00],
    'brown'                : [0.65, 0.16, 0.16],
    'firebrick'            : [0.70, 0.13, 0.13],
    'darkred'              : [0.55, 0.00, 0.00],
    'maroon'               : [0.50, 0.00, 0.00],
    'white'                : [1.00, 1.00, 1.00],
    'whitesmoke'           : [0.96, 0.96, 0.96],
    'gainsboro'            : [0.86, 0.86, 0.86],
    'lightgrey'            : [0.83, 0.83, 0.83],
    'silver'               : [0.75, 0.75, 0.75],
    'darkgray'             : [0.66, 0.66, 0.66],
    'gray'                 : [0.50, 0.50, 0.50],
    'grey'                 : [0.50, 0.50, 0.50],
    'dimgray'              : [0.41, 0.41, 0.41],
    'dimgrey'              : [0.41, 0.41, 0.41],
    'black'                : [0.00, 0.00, 0.00],
    'cyan'                 : [0.00, 0.68, 0.94],

    'transparent'          : [0.00, 0.00, 0.00, 0.00],
    'bark'                 : [0.25, 0.19, 0.13]
};

function toHex(i) {
    var s;
    if (i === 0) {
        return '00';
    } else {
        s = i.toString(16).toUpperCase();
        if (s.length < 2) {
            s = '0' + s;
        }
        return s;
    }
}

// Converts the given R,G,B values to a hexadecimal color string.
color.rgb2hex = function (r, g, b) {
    return '#' +
        toHex(Math.round(r * 255)) +
        toHex(Math.round(g * 255)) +
        toHex(Math.round(b * 255));
};

// Converts the given R,G,B,A values to a hexadecimal color string.
color.rgba2hex = function (r, g, b, a) {
    return '#' +
        toHex(Math.round(r * 255)) +
        toHex(Math.round(g * 255)) +
        toHex(Math.round(b * 255)) +
        toHex(Math.round(a * 255));
};

// Converts the given hexadecimal color string to R,G,B (between 0.0-1.0).
color.hex2rgb = function (hex) {
    var r, g, b;
    hex = hex.replace(/^#/, '');
    if ((hex.length !== 3 && hex.length !== 6) || !(/^[0-9a-fA-F]*$/.test(hex))) {
        throw new Error('Invalid hex value: #' + hex);
    }
    if (hex.length === 3) {
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    r = parseInt(hex.substr(0, 2), 16) / 255;
    g = parseInt(hex.substr(2, 2), 16) / 255;
    b = parseInt(hex.substr(4, 2), 16) / 255;
    return [r, g, b];
};

// Converts the given R,G,B values to H,S,B (between 0.0-1.0).
color.rgb2hsb = function (r, g, b) {
    var h = 0,
        s = 0,
        v = Math.max(r, g, b),
        d = v - Math.min(r, g, b);
    if (v !== 0) {
        s = d / v;
    }
    if (s !== 0) {
        if (r === v) {
            h = 0 + (g - b) / d;
        } else if (g === v) {
            h = 2 + (b - r) / d;
        } else {
            h = 4 + (r - g) / d;
        }
    }
    h = h * (60 / 360);
    if (h < 0) {
        h += 1.0;
    }
    return [h, s, v];
};

// Converts the given H,S,B color values to R,G,B (between 0.0-1.0).
color.hsb2rgb = function (h, s, v) {
    if (s === 0) {
        return [v, v, v];
    }
    h = h % 1 * 6.0;
    var i = Math.floor(h),
        f = h - i,
        x = v * (1 - s),
        y = v * (1 - s * f),
        z = v * (1 - s * (1 - f));
    if (i > 4) {
        return [v, x, y];
    }
    return [[v, z, x], [y, v, x], [x, v, z], [x, y, v], [z, x, v]][parseInt(i, 10)];
};

// Converts the given R,G,B values to H,S,L (between 0.0-1.0).
// Code adapted from http://github.com/mattdesl/float-rgb2hsl
color.rgb2hsl = function (r, g, b) {
    var min = Math.min(r, g, b),
        max = Math.max(r, g, b),
        delta = max - min,
        h, s, l;

    if (max === min) {
        h = 0;
    } else if (r === max) {
        h = (g - b) / delta;
    } else if (g === max) {
        h = 2 + (b - r) / delta;
    } else if (b === max) {
        h = 4 + (r - g) / delta;
    }

    h = Math.min(h * 60, 360);

    if (h < 0) {
        h += 360;
    }

    l = (min + max) / 2;

    if (max === min) {
        s = 0;
    } else if (l <= 0.5) {
        s = delta / (max + min);
    } else {
        s = delta / (2 - max - min);
    }

    return [h / 360, s, l];
};

// Converts the given H,S,L color values to R,G,B (between 0.0-1.0).
// Code adapted from http://github.com/mattdesl/float-hsl2rgb
color.hsl2rgb = function (h, s, l) {
    var t1, t2, t3, rgb, val;

    if (s === 0) {
        val = l;
        return [val, val, val];
    }

    if (l < 0.5) {
        t2 = l * (1 + s);
    } else {
        t2 = l + s - l * s;
    }
    t1 = 2 * l - t2;

    rgb = [0, 0, 0];
    for (var i = 0; i < 3; i++) {
        t3 = h + 1 / 3 * -(i - 1);
        if (t3 < 0) {
            t3 += 1;
        }
        if (t3 > 1) {
            t3 -= 1;
        }

        if (6 * t3 < 1) {
            val = t1 + (t2 - t1) * 6 * t3;
        } else if (2 * t3 < 1) {
            val = t2;
        } else if (3 * t3 < 2) {
            val = t1 + (t2 - t1) * (2 / 3 - t3) * 6;
        } else {
            val = t1;
        }

        rgb[i] = val;
    }

    return rgb;
};

module.exports = color;

},{}],44:[function(require,module,exports){
// Geometry

'use strict';

var math = require('../util/math');

var Point = require('../objects/point');

var geo = {};

// Returns the angle between two points.
geo.angle = function (x0, y0, x1, y1) {
    return math.degrees(Math.atan2(y1 - y0, x1 - x0));
};

// Returns the distance between two points.
geo.distance = function (x0, y0, x1, y1) {
    return Math.sqrt(Math.pow(x1 - x0, 2) + Math.pow(y1 - y0, 2));
};

// Returns the location of a point by rotating around origin (x0,y0).
geo.coordinates = function (x0, y0, angle, distance) {
    var x = x0 + Math.cos(math.radians(angle)) * distance,
        y = y0 + Math.sin(math.radians(angle)) * distance;
    return new Point(x, y);
};


// Determines if the given point is within the polygon, given as a list of points.

// This function uses a ray casting algorithm to determine how many times
// a horizontal ray starting from the point intersects with the sides of the polygon.
// If it is an even number of times, the point is outside, if odd, inside.
// The algorithm does not always report correctly when the point is very close to the boundary.
// The polygon is passed as an array of Points.
//
// Based on: W. Randolph Franklin, 1970, http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html
geo.pointInPolygon = function (points, x, y) {
    var i, j, x0, y0, x1, y1,
        odd = false,
        n = points.length;

    for (i = 0; i < n; i += 1) {
        j = (i < n - 1) ? i + 1 : 0;
        x0 = points[i].x;
        y0 = points[i].y;
        x1 = points[j].x;
        y1 = points[j].y;
        if ((y0 < y && y1 >= y) || (y1 < y && y0 >= y)) {
            if (x0 + (y - y0) / (y1 - y0) * (x1 - x0) < x) {
                odd = !odd;
            }
        }
    }
    return odd;
};

module.exports = geo;

},{"../objects/point":36,"../util/math":46}],45:[function(require,module,exports){
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

},{}],46:[function(require,module,exports){
// Math Utility functions

'use strict';

var math = {};

math.sum = function (values) {
    var i,
        n = values.length,
        total = 0;
    for (i = 0; i < n; i += 1) {
        total += values[i];
    }
    return total;
};

math.round = function (x, decimals) {
    return (!decimals) ?
            Math.round(x) :
            Math.round(x * Math.pow(10, decimals)) / Math.pow(10, decimals);
};

math.sign = function (x) {
    if (x < 0) { return -1; }
    if (x > 0) { return +1; }
    return 0;
};

math.degrees = function (radians) {
    return radians * 180 / Math.PI;
};

math.radians = function (degrees) {
    return degrees / 180 * Math.PI;
};

math.clamp = function (v, min, max) {
    if (min < max) {
        return v < min ? min : v > max ? max : v;
    } else {
        return v < max ? max : v > min ? min : v;
    }
};

// Snaps a value to a virtual grid. Distance defines the spacing between grid lines.
// Strength defines how strongly the values move to the grid. If 1, the values will always
// be on the grid lines, if 0, the value is unchanged.
math.snap = function (v, distance, strength) {
    strength = strength !== undefined ? strength : 1;
    return (v * (1.0 - strength)) + (strength * Math.round(v / distance) * distance);
};

math.dot = function (a, b) {
    var m = Math.min(a.length, b.length),
        n = 0,
        i;
    for (i = 0; i < m; i += 1) {
        n += a[i] * b[i];
    }
    return n;
};

// Linearly interpolate between from and to for t=0-1.
// If clamp=true, values outside of 0-1 will be clamped.
var _lerp = math.mix = math.lerp = function (from, to, t, clamp) {
    if (clamp) {
        if (t < 0) { return from; }
        if (t > 1) { return to; }
    }
    return from + (to - from) * t;
};

// Compute fade curve for point t.
function _fade(t) {
    return t * t * t * (t * (t * 6 - 15) + 10);
}

// Convert low 4 bits of hash code into 12 gradient directions.
function _grad(hash, x, y, z) {
    var h, u, v;
    h = hash & 15;
    u = h < 8 ? x : y;
    v = h < 4 ? y : h === 12 || h === 14 ? x : z;
    return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
}

function _scale(n) {
    return (1 + n) / 2;
}

var _permutation = (function () {
    var permutation, p, i;
    permutation = [ 151, 160, 137, 91, 90, 15,
        131, 13, 201, 95, 96, 53, 194, 233, 7, 225, 140, 36, 103, 30, 69, 142, 8, 99, 37, 240, 21, 10, 23,
        190, 6, 148, 247, 120, 234, 75, 0, 26, 197, 62, 94, 252, 219, 203, 117, 35, 11, 32, 57, 177, 33,
        88, 237, 149, 56, 87, 174, 20, 125, 136, 171, 168, 68, 175, 74, 165, 71, 134, 139, 48, 27, 166,
        77, 146, 158, 231, 83, 111, 229, 122, 60, 211, 133, 230, 220, 105, 92, 41, 55, 46, 245, 40, 244,
        102, 143, 54, 65, 25, 63, 161, 1, 216, 80, 73, 209, 76, 132, 187, 208, 89, 18, 169, 200, 196,
        135, 130, 116, 188, 159, 86, 164, 100, 109, 198, 173, 186, 3, 64, 52, 217, 226, 250, 124, 123,
        5, 202, 38, 147, 118, 126, 255, 82, 85, 212, 207, 206, 59, 227, 47, 16, 58, 17, 182, 189, 28, 42,
        223, 183, 170, 213, 119, 248, 152, 2, 44, 154, 163, 70, 221, 153, 101, 155, 167, 43, 172, 9,
        129, 22, 39, 253, 19, 98, 108, 110, 79, 113, 224, 232, 178, 185, 112, 104, 218, 246, 97, 228,
        251, 34, 242, 193, 238, 210, 144, 12, 191, 179, 162, 241, 81, 51, 145, 235, 249, 14, 239, 107,
        49, 192, 214, 31, 181, 199, 106, 157, 184, 84, 204, 176, 115, 121, 50, 45, 127, 4, 150, 254,
        138, 236, 205, 93, 222, 114, 67, 29, 24, 72, 243, 141, 128, 195, 78, 66, 215, 61, 156, 180];

    p = new Uint8Array(512);
    for (i = 0; i < 256; i += 1) {
        p[256 + i] = p[i] = permutation[i];
    }
    return p;
}());

// Calculate Perlin noise
math.noise = function (x, y, z) {
    var p = _permutation;

    // Find unit cube that contains the point.
    var X = Math.floor(x) & 255;
    var Y = Math.floor(y) & 255;
    var Z = Math.floor(z) & 255;
    // Find relative x, y, z point in the cube.
    x -= Math.floor(x);
    y -= Math.floor(y);
    z -= Math.floor(z);
    // Compute fade curves for each x, y, z.
    var u = _fade(x);
    var v = _fade(y);
    var w = _fade(z);

    // Hash coordinates of the 8 cube corners.
    var A = p[X] + Y;
    var AA = p[A] + Z;
    var AB = p[A + 1] + Z;
    var B = p[X + 1] + Y;
    var BA = p[B] + Z;
    var BB = p[B + 1] + Z;

    // Add blended results from 8 corners of the cube.
    return _scale(_lerp(_lerp(_lerp(_grad(p[AA], x, y, z),
        _grad(p[BA], x - 1, y, z), u),
        _lerp(_grad(p[AB], x, y - 1, z),
             _grad(p[BB], x - 1, y - 1, z), u), v),
        _lerp(_lerp(_grad(p[AA + 1], x, y, z - 1),
            _grad(p[BA + 1], x - 1, y, z - 1), u),
            _lerp(_grad(p[AB + 1], x, y - 1, z - 1),
                _grad(p[BB + 1], x - 1, y - 1, z - 1), u), v), w));
};

module.exports = math;

},{}],47:[function(require,module,exports){
// Pseudo-random generator

'use strict';

// Generate a random function that is seeded with the given value.
function generator(seed) {
    // Note: the generator didn't work with negative seed values, so here we
    // transform our original seed into a new (positive) seed value with which we
    // create a new generator.
    if (seed < 0) {
        var gen = generator(Math.abs(seed));
        for (var i = 0; i < 23; i += 1) {
            gen();
        }
        return generator(gen(0, 10000));
    }

    // Based on random number generator from
    // http://indiegamr.com/generate-repeatable-random-numbers-in-js/
    return function (min, max) {
        min = min || 0;
        max = max || 1;
        seed = (seed * 9301 + 49297) % 233280;
        var v = seed / 233280;
        return min + v * (max - min);
    };
}

exports.generator = generator;

},{}],48:[function(require,module,exports){
// SVG Parser

// The SVG engine uses code from the following libraries:
// - for parsing the main svg tree: two.js - http://jonobr1.github.io/two.js/
// - for constructing individual paths: canvg - https://code.google.com/p/canvg/
// - for constructing arcs: fabric.js - http://fabricjs.com

'use strict';

var xmldom = require('xmldom');

var Color = require('../objects/color');
var Group = require('../objects/group');
var Path = require('../objects/path');
var Point = require('../objects/point');
var Transform = require('../objects/transform');

// var getReflection = function (a, b, relative) {
//     var theta,
//         d = geo.distance(a.x, a.y, b.x, b.y);

//     if (d <= 0.0001) {
//         return relative ? Point.ZERO : a;
//     }
//     theta = geo.angle(a.x, a.y, b.x, b.y);
//     return new Point(
//         d * Math.cos(theta) + (relative ? 0 : a.x),
//         d * Math.sin(theta) + (relative ? 0 : a.y)
//     );
// };

var trim = function (s) {
    return s.replace(/^\s+|\s+$/g, '');
};

var compressSpaces = function (s) {
    return s.replace(/[\s\r\t\n]+/gm, ' ');
};

var toNumberArray = function (s) {
    var i,
        a = trim(compressSpaces((s || '').replace(/,/g, ' '))).split(' ');
    for (i = 0; i < a.length; i += 1) {
        a[i] = parseFloat(a[i]);
    }
    return a;
};

var readSvgAttributes = function (node, parentAttributes) {
    var fill, fillOpacity, stroke, strokeOpacity, strokeWidth, opacity, color, transforms, types, transform, i, attributes;

    if (parentAttributes) {
        attributes = Object.create(parentAttributes);
    } else {
        attributes = {};
    }

    transforms = [];
    types = {};

    types.translate = function (s) {
        var a = toNumberArray(s),
            tx = a[0],
            ty = a[1] || 0;
        return new Transform().translate(tx, ty);
    };

    types.scale = function (s) {
        var a = toNumberArray(s),
            sx = a[0],
            sy = a[1] || sx;
        return new Transform().scale(sx, sy);
    };

    types.rotate = function (s) {
        var t,
            a = toNumberArray(s),
            r = a[0],
            tx = a[1] || 0,
            ty = a[2] || 0;
        t = new Transform();
        t = t.translate(tx, ty);
        t = t.rotate(r);
        t = t.translate(-tx, -ty);
        return t;
    };

    types.matrix = function (s) {
        var m = toNumberArray(s);
        return new Transform([m[0], m[1], 0, m[2], m[3], 0, m[4], m[5], 1]);
    };

    var v, data, type, s, d, elems, el;
    for (var j = 0; j < node.attributes.length; j += 1) {
        v = node.attributes[j];
        switch (v.nodeName) {
        case 'transform':
            data = trim(compressSpaces(v.nodeValue)).replace(/\)(\s?,\s?)/g, ') ').split(/\s(?=[a-z])/);
            for (i = 0; i < data.length; i += 1) {
                type = trim(data[i].split('(')[0]);
                s = data[i].split('(')[1].replace(')', '');
                transform = types[type](s);
                transforms.push(transform);
            }
            break;
        case 'visibility':
//          elem.visible = !!v.nodeValue;
            break;
        case 'stroke-linecap':
//          elem.cap = v.nodeValue;
            break;
        case 'stroke-linejoin':
//          elem.join = v.nodeValue;
            break;
        case 'stroke-miterlimit':
//          elem.miter = v.nodeValue;
            break;
        case 'stroke-width':
            strokeWidth = parseFloat(v.nodeValue);
            break;
        case 'stroke-opacity':
            strokeOpacity = parseFloat(v.nodeValue);
            break;
        case 'fill-opacity':
            fillOpacity = parseFloat(v.nodeValue);
            break;
        case 'fill':
            fill = v.nodeValue;
            break;
        case 'stroke':
            stroke = v.nodeValue;
            break;
        case 'opacity':
            opacity = parseFloat(v.nodeValue);
            break;
        case 'color':
            color = v.nodeValue;
            break;
        case 'style':
            d = {};
            elems = v.nodeValue.split(';');
            for (i = 0; i < elems.length; i += 1) {
                el = elems[i].split(':');
                d[el[0].trim()] = el[1];
            }
            if (d.fill) {
                fill = d.fill;
            }
            if (d.stroke) {
                stroke = d.stroke;
            }
            if (d['stroke-width'] !== undefined) {
                strokeWidth = parseFloat(d['stroke-width']);
            }
            if (d['stroke-opacity'] !== undefined) {
                strokeOpacity = parseFloat(d['stroke-opacity']);
            }
            if (d['fill-opacity'] !== undefined) {
                fillOpacity = parseFloat(d['fill-opacity']);
            }
            if (d.opacity !== undefined) {
                opacity = parseFloat(d.opacity);
            }
            if (d.color) {
                color = d.color;
            }
            break;
        }
    }

    if (fill !== undefined) {
        attributes.fill = fill;
    }
    if (stroke !== undefined) {
        attributes.stroke = stroke;
    }
    if (fillOpacity !== undefined) {
        attributes.fillOpacity = fillOpacity;
    }
    if (strokeOpacity !== undefined) {
        attributes.strokeOpacity = strokeOpacity;
    }
    if (strokeWidth !== undefined) {
        attributes.strokeWidth = strokeWidth;
    }
    if (opacity !== undefined) {
        attributes.opacity = opacity;
    }
    if (color !== undefined && color !== 'currentColor') {
        attributes.color = color;
    }
    if (transforms.length > 0) {
        transform = new Transform();
        for (i = 0; i < transforms.length; i += 1) {
            transform = transform.append(transforms[i]);
        }
        if (!transform.isIdentity()) {
            if (attributes.transform) {
                attributes.transform = attributes.transform.append(transform);
            } else {
                attributes.transform = transform;
            }
        }
    }
    return attributes;
};

var applySvgAttributes = function (shape, attributes) {
    var fill = attributes.fill;
    if (shape.commands && shape.commands.length > 0 && fill === undefined) {
        fill = 'black';
    }
    var fillOpacity = attributes.fillOpacity;
    var stroke = attributes.stroke;
    var strokeOpacity = attributes.strokeOpacity;
    var opacity = attributes.opacity;
    var strokeWidth = attributes.strokeWidth;
    var transform = attributes.transform;
    var color = attributes.color;

    if (fill === 'currentColor') {
        fill = color === undefined ? 'black' : color;
    }
    if (fill !== undefined) {
        fill = Color.parse(fill);
        if (fillOpacity !== undefined) {
            fill.a *= fillOpacity;
        }
        if (opacity !== undefined) {
            fill.a *= opacity;
        }
    }

    if (stroke === 'currentColor') {
        stroke = color === undefined ? 'black' : color;
    }
    if (stroke !== undefined) {
        stroke = Color.parse(stroke);
        if (strokeOpacity !== undefined) {
            stroke.a *= strokeOpacity;
        }
        if (opacity !== undefined) {
            stroke.a *= opacity;
        }
    }

    var commands;
    if (transform) {
        commands = transform.transformShape(shape).commands;
    } else {
        commands = shape.commands;
    }
    var f = (fill === undefined) ? shape.fill : fill,
        s = (stroke === undefined) ? shape.stroke : stroke,
        sw = (strokeWidth === undefined) ? shape.strokeWidth : strokeWidth;
    if (sw !== undefined && transform !== undefined) {
        sw *= transform.m[0];
    }
    return new Path(commands, f, s, sw);
};

var arcToSegments = function (x, y, rx, ry, large, sweep, rotateX, ox, oy) {
/*    argsString = _join.call(arguments);
    if (arcToSegmentsCache[argsString]) {
      return arcToSegmentsCache[argsString];
    } */
    var th, sinTh, cosTh, px, py, pl,
        a00, a01, a10, a11, x0, y0, x1, y1,
        d, sFactorSq, sFactor, xc, yc,
        th0, th1, thArc,
        segments, result, th2, th3, i;

    th = rotateX * (Math.PI / 180);
    sinTh = Math.sin(th);
    cosTh = Math.cos(th);
    rx = Math.abs(rx);
    ry = Math.abs(ry);
    px = cosTh * (ox - x) * 0.5 + sinTh * (oy - y) * 0.5;
    py = cosTh * (oy - y) * 0.5 - sinTh * (ox - x) * 0.5;
    pl = (px * px) / (rx * rx) + (py * py) / (ry * ry);
    if (pl > 1) {
        pl = Math.sqrt(pl);
        rx *= pl;
        ry *= pl;
    }

    a00 = cosTh / rx;
    a01 = sinTh / rx;
    a10 = (-sinTh) / ry;
    a11 = cosTh / ry;
    x0 = a00 * ox + a01 * oy;
    y0 = a10 * ox + a11 * oy;
    x1 = a00 * x + a01 * y;
    y1 = a10 * x + a11 * y;

    d = (x1 - x0) * (x1 - x0) + (y1 - y0) * (y1 - y0);
    sFactorSq = 1 / d - 0.25;
    if (sFactorSq < 0) { sFactorSq = 0; }
    sFactor = Math.sqrt(sFactorSq);
    if (sweep === large) { sFactor = -sFactor; }
    xc = 0.5 * (x0 + x1) - sFactor * (y1 - y0);
    yc = 0.5 * (y0 + y1) + sFactor * (x1 - x0);

    th0 = Math.atan2(y0 - yc, x0 - xc);
    th1 = Math.atan2(y1 - yc, x1 - xc);

    thArc = th1 - th0;
    if (thArc < 0 && sweep === 1) {
        thArc += 2 * Math.PI;
    } else if (thArc > 0 && sweep === 0) {
        thArc -= 2 * Math.PI;
    }

    segments = Math.ceil(Math.abs(thArc / (Math.PI * 0.5 + 0.001)));
    result = [];
    for (i = 0; i < segments; i += 1) {
        th2 = th0 + i * thArc / segments;
        th3 = th0 + (i + 1) * thArc / segments;
        result[i] = [xc, yc, th2, th3, rx, ry, sinTh, cosTh];
    }

//    arcToSegmentsCache[argsString] = result;
    return result;
};

var segmentToBezier = function (cx, cy, th0, th1, rx, ry, sinTh, cosTh) {
//    argsString = _join.call(arguments);
//    if (segmentToBezierCache[argsString]) {
//      return segmentToBezierCache[argsString];
//    }

    var a00 = cosTh * rx,
        a01 = -sinTh * ry,
        a10 = sinTh * rx,
        a11 = cosTh * ry,

        thHalf = 0.5 * (th1 - th0),
        t = (8 / 3) * Math.sin(thHalf * 0.5) * Math.sin(thHalf * 0.5) / Math.sin(thHalf),
        x1 = cx + Math.cos(th0) - t * Math.sin(th0),
        y1 = cy + Math.sin(th0) + t * Math.cos(th0),
        x3 = cx + Math.cos(th1),
        y3 = cy + Math.sin(th1),
        x2 = x3 + t * Math.sin(th1),
        y2 = y3 - t * Math.cos(th1);

//    segmentToBezierCache[argsString] = [
    return [
        a00 * x1 + a01 * y1, a10 * x1 + a11 * y1,
        a00 * x2 + a01 * y2,      a10 * x2 + a11 * y2,
        a00 * x3 + a01 * y3,      a10 * x3 + a11 * y3
    ];

//    return segmentToBezierCache[argsString];
};

var read = {

    svg: function () {
        return read.g.apply(this, arguments);
    },

    g: function (node, parentAttributes) {
        var shapes = [];
        var attributes = readSvgAttributes(node, parentAttributes);
        var n, tag, tagName, o;
        for (var i = 0; i < node.childNodes.length; i += 1) {
            n = node.childNodes[i];
            tag = n.nodeName;
            if (!tag) { return; }
            tagName = tag.replace(/svg\:/ig, '').toLowerCase();
            if (read[tagName] !== undefined) {
                o = read[tagName].call(this, n, attributes);
                shapes.push(o);
            }
        }
        return new Group(shapes);
    },

    _polyline: function (node) {
        var points = node.getAttribute('points');
        var p = new Path();
        points.replace(/([\d\.?]+),([\d\.?]+)/g, function (match, p1, p2) {
            var x = parseFloat(p1);
            var y = parseFloat(p2);
            if (p.commands.length === 0) {
                p.moveTo(x, y);
            } else {
                p.lineTo(x, y);
            }
        });
        return p;
    },

    polygon: function (node, parentAttributes) {
        var attributes = readSvgAttributes(node, parentAttributes);
        var p = read._polyline(node);
        p.close();
        return applySvgAttributes(p, attributes);
    },

    polyline: function (node, parentAttributes) {
        var attributes = readSvgAttributes(node, parentAttributes);
        var p = read._polyline(node);
        return applySvgAttributes(p, attributes);
    },

    rect: function (node, parentAttributes) {
        var attributes = readSvgAttributes(node, parentAttributes);
        var x = parseFloat(node.getAttribute('x'));
        var y = parseFloat(node.getAttribute('y'));
        if (!x) { x = 0; }
        if (!y) { y = 0; }
        var width = parseFloat(node.getAttribute('width'));
        var height = parseFloat(node.getAttribute('height'));
        if (!width) { width = 0; }
        if (!height) { height = 0; }
        if (width < 0) {
            console.error('Error: invalid negative value for <rect> attribute width="' + width + '"');
            width = 0;
        }
        if (height < 0) {
            console.error('Error: invalid negative value for <rect> attribute height="' + height + '"');
            height = 0;
        }
        var rx = parseFloat(node.getAttribute('rx'));
        var ry = parseFloat(node.getAttribute('ry'));
        if (!rx) { rx = 0; }
        if (!ry) { ry = 0; }
        if (rx < 0) {
            console.error('Error: invalid negative value for <rect> attribute rx="' + rx + '"');
            rx = 0;
        }
        if (ry < 0) {
            console.error('Error: invalid negative value for <rect> attribute ry="' + ry + '"');
            ry = 0;
        }
        if (!rx || !ry) {
            rx = ry = Math.max(rx, ry);
        }
        if (rx > width / 2) { rx = width / 2; }
        if (ry > height / 2) { ry = height / 2; }
        var p = new Path();
        if (rx && ry) {
            p.addRoundedRect(x, y, width, height, rx, ry);
        } else {
            p.addRect(x, y, width, height);
        }
        return applySvgAttributes(p, attributes);
    },

    ellipse: function (node, parentAttributes) {
        var attributes = readSvgAttributes(node, parentAttributes);
        var cx = parseFloat(node.getAttribute('cx'));
        var cy = parseFloat(node.getAttribute('cy'));
        if (!cx) { cx = 0; }
        if (!cy) { cy = 0; }
        var rx = parseFloat(node.getAttribute('rx'));
        var ry = parseFloat(node.getAttribute('ry'));
        if (!rx) { rx = 0; }
        if (!ry) { ry = 0; }
        if (rx < 0) {
            console.error('Error: invalid negative value for <ellipse> attribute rx="' + rx + '"');
            rx = 0;
        }
        if (ry < 0) {
            console.error('Error: invalid negative value for <ellipse> attribute ry="' + ry + '"');
            ry = 0;
        }
        var p = new Path();
        p.addEllipse(cx - rx, cy - ry, rx * 2, ry * 2);
        return applySvgAttributes(p, attributes);
    },

    circle: function (node, parentAttributes) {
        var attributes = readSvgAttributes(node, parentAttributes);
        var cx = parseFloat(node.getAttribute('cx'));
        var cy = parseFloat(node.getAttribute('cy'));
        if (!cx) { cx = 0; }
        if (!cy) { cy = 0; }
        var r = parseFloat(node.getAttribute('r'));
        if (!r) { r = 0; }
        if (r < 0) {
            console.error('Error: invalid negative value for <circle> attribute r="' + r + '"');
            r = 0;
        }
        var p = new Path();
        p.addEllipse(cx - r, cy - r, r * 2, r * 2);
        return applySvgAttributes(p, attributes);
    },

    line: function (node, parentAttributes) {
        var attributes = readSvgAttributes(node, parentAttributes);
        var x1 = parseFloat(node.getAttribute('x1'));
        var y1 = parseFloat(node.getAttribute('y1'));
        var x2 = parseFloat(node.getAttribute('x2'));
        var y2 = parseFloat(node.getAttribute('y2'));
        if (!x1) { x1 = 0; }
        if (!y1) { y1 = 0; }
        if (!x2) { x2 = 0; }
        if (!y2) { y2 = 0; }
        var p = new Path();
        p.addLine(x1, y1, x2, y2);
        return applySvgAttributes(p, attributes);
    },

    path: function (node, parentAttributes) {
        var attributes = readSvgAttributes(node, parentAttributes);
        var d, PathParser, pp,
            pt, newP, curr, p1, cntrl, cp, cp1x, cp1y, cp2x, cp2y,
            rx, ry, rot, large, sweep, ex, ey, segs, i, bez;
        // TODO: convert to real lexer based on http://www.w3.org/TR/SVG11/paths.html#PathDataBNF
        d = node.getAttribute('d');
        d = d.replace(/,/gm, ' '); // get rid of all commas
        d = d.replace(/([MmZzLlHhVvCcSsQqTtAa])([MmZzLlHhVvCcSsQqTtAa])/gm, '$1 $2'); // separate commands from commands
        d = d.replace(/([MmZzLlHhVvCcSsQqTtAa])([MmZzLlHhVvCcSsQqTtAa])/gm, '$1 $2'); // separate commands from commands
        d = d.replace(/([MmZzLlHhVvCcSsQqTtAa])([^\s])/gm, '$1 $2'); // separate commands from points
        d = d.replace(/([^\s])([MmZzLlHhVvCcSsQqTtAa])/gm, '$1 $2'); // separate commands from points
        d = d.replace(/([0-9])([+\-])/gm, '$1 $2'); // separate digits when no comma
        d = d.replace(/(\.[0-9]*)(\.)/gm, '$1 $2'); // separate digits when no comma
        d = d.replace(/([Aa](\s+[0-9]+){3})\s+([01])\s*([01])/gm, '$1 $3 $4 '); // shorthand elliptical arc path syntax
        d = compressSpaces(d); // compress multiple spaces
        d = trim(d);

        PathParser = function (d) {
            this.tokens = d.split(' ');

            this.reset = function () {
                this.i = -1;
                this.command = '';
                this.previousCommand = '';
                this.start = new Point(0, 0);
                this.control = new Point(0, 0);
                this.current = new Point(0, 0);
                this.points = [];
                this.angles = [];
            };

            this.isEnd = function () {
                return this.i >= this.tokens.length - 1;
            };

            this.isCommandOrEnd = function () {
                if (this.isEnd()) { return true; }
                return this.tokens[this.i + 1].match(/^[A-Za-z]$/) !== null;
            };

            this.isRelativeCommand = function () {
                switch (this.command) {
                case 'm':
                case 'l':
                case 'h':
                case 'v':
                case 'c':
                case 's':
                case 'q':
                case 't':
                case 'a':
                case 'z':
                    return true;
                }
                return false;
            };

            this.getToken = function () {
                this.i += 1;
                return this.tokens[this.i];
            };

            this.getScalar = function () {
                return parseFloat(this.getToken());
            };

            this.nextCommand = function () {
                this.previousCommand = this.command;
                this.command = this.getToken();
            };

            this.getPoint = function () {
                var pt = new Point(this.getScalar(), this.getScalar());
                return this.makeAbsolute(pt);
            };

            this.getAsControlPoint = function () {
                var pt = this.getPoint();
                this.control = pt;
                return pt;
            };

            this.getAsCurrentPoint = function () {
                var pt = this.getPoint();
                this.current = pt;
                return pt;
            };

            this.getReflectedControlPoint = function () {
                if (this.previousCommand.toLowerCase() !== 'c' &&
                        this.previousCommand.toLowerCase() !== 's' &&
                        this.previousCommand.toLowerCase() !== 'q' &&
                        this.previousCommand.toLowerCase() !== 't') {
                    return this.current;
                }

                // reflect point
                var pt = new Point(2 * this.current.x - this.control.x, 2 * this.current.y - this.control.y);
                return pt;
            };

            this.makeAbsolute = function (pt) {
                if (this.isRelativeCommand()) {
                    return new Point(pt.x + this.current.x, pt.y + this.current.y);
                }
                return pt;
            };
        };

        var p = new Path();

        pp = new PathParser(d);
        pp.reset();

        while (!pp.isEnd()) {
            pp.nextCommand();
            switch (pp.command) {
            case 'M':
            case 'm':
                pt = pp.getAsCurrentPoint();
                p.moveTo(pt.x, pt.y);
                pp.start = pp.current;
                while (!pp.isCommandOrEnd()) {
                    pt = pp.getAsCurrentPoint();
                    p.lineTo(pt.x, pt.y);
                }
                break;
            case 'L':
            case 'l':
                while (!pp.isCommandOrEnd()) {
                    pt = pp.getAsCurrentPoint();
                    p.lineTo(pt.x, pt.y);
                }
                break;
            case 'H':
            case 'h':
                while (!pp.isCommandOrEnd()) {
                    newP = new Point((pp.isRelativeCommand() ? pp.current.x : 0) + pp.getScalar(), pp.current.y);
                    pp.current = newP;
                    p.lineTo(pp.current.x, pp.current.y);
                }
                break;
            case 'V':
            case 'v':
                while (!pp.isCommandOrEnd()) {
                    newP = new Point(pp.current.x, (pp.isRelativeCommand() ? pp.current.y : 0) + pp.getScalar());
                    pp.current = newP;
                    p.lineTo(pp.current.x, pp.current.y);
                }
                break;
            case 'C':
            case 'c':
                while (!pp.isCommandOrEnd()) {
                    curr = pp.current;
                    p1 = pp.getPoint();
                    cntrl = pp.getAsControlPoint();
                    cp = pp.getAsCurrentPoint();
                    p.curveTo(p1.x, p1.y, cntrl.x, cntrl.y, cp.x, cp.y);
                }
                break;
            case 'S':
            case 's':
                while (!pp.isCommandOrEnd()) {
                    curr = pp.current;
                    p1 = pp.getReflectedControlPoint();
                    cntrl = pp.getAsControlPoint();
                    cp = pp.getAsCurrentPoint();
                    p.curveTo(p1.x, p1.y, cntrl.x, cntrl.y, cp.x, cp.y);
                }
                break;
            case 'Q':
            case 'q':
                while (!pp.isCommandOrEnd()) {
                    curr = pp.current;
                    cntrl = pp.getAsControlPoint();
                    cp = pp.getAsCurrentPoint();
                    cp1x = curr.x + 2 / 3 * (cntrl.x - curr.x); // CP1 = QP0 + 2 / 3 *(QP1-QP0)
                    cp1y = curr.y + 2 / 3 * (cntrl.y - curr.y); // CP1 = QP0 + 2 / 3 *(QP1-QP0)
                    cp2x = cp1x + 1 / 3 * (cp.x - curr.x); // CP2 = CP1 + 1 / 3 *(QP2-QP0)
                    cp2y = cp1y + 1 / 3 * (cp.y - curr.y); // CP2 = CP1 + 1 / 3 *(QP2-QP0)
                    p.curveTo(cp1x, cp1y, cp2x, cp2y, cp.x, cp.y);
                }
                break;
            case 'T':
            case 't':
                while (!pp.isCommandOrEnd()) {
                    curr = pp.current;
                    cntrl = pp.getReflectedControlPoint();
                    pp.control = cntrl;
                    cp = pp.getAsCurrentPoint();
                    cp1x = curr.x + 2 / 3 * (cntrl.x - curr.x); // CP1 = QP0 + 2 / 3 *(QP1-QP0)
                    cp1y = curr.y + 2 / 3 * (cntrl.y - curr.y); // CP1 = QP0 + 2 / 3 *(QP1-QP0)
                    cp2x = cp1x + 1 / 3 * (cp.x - curr.x); // CP2 = CP1 + 1 / 3 *(QP2-QP0)
                    cp2y = cp1y + 1 / 3 * (cp.y - curr.y); // CP2 = CP1 + 1 / 3 *(QP2-QP0)
                    p.curveTo(cp1x, cp1y, cp2x, cp2y, cp.x, cp.y);
                }
                break;
            case 'A':
            case 'a':
                while (!pp.isCommandOrEnd()) {
                    curr = pp.current;
                    rx = pp.getScalar();
                    ry = pp.getScalar();
                    rot = pp.getScalar();// * (Math.PI / 180.0);
                    large = pp.getScalar();
                    sweep = pp.getScalar();
                    cp = pp.getAsCurrentPoint();
                    ex = cp.x;
                    ey = cp.y;
                    segs = arcToSegments(ex, ey, rx, ry, large, sweep, rot, curr.x, curr.y);
                    for (i = 0; i < segs.length; i += 1) {
                        bez = segmentToBezier.apply(this, segs[i]);
                        p.curveTo.apply(p, bez);
                    }
                }
                break;
            case 'Z':
            case 'z':
                p.close();
                pp.current = pp.start;
                break;
            }
        }
        return applySvgAttributes(p, attributes);
    }
};

exports.interpret = function (svgNode) {
    var node,
        tag = svgNode.tagName.toLowerCase();
    if (read[tag] === undefined) {
        return null;
    }

    node = read[tag].call(this, svgNode);
    return node;
};

exports.parseString = function (s) {
    var doc = new xmldom.DOMParser({errorHandler:
        function (key, msg) {
            throw new Error('Could not parse string \"' + String(s) + '\": ' + msg);
        }
    }).parseFromString(s);
    if (doc) {
        return exports.interpret(doc.documentElement);
    } else {
        return null;
    }
};

},{"../objects/color":32,"../objects/group":33,"../objects/path":35,"../objects/point":36,"../objects/transform":39,"xmldom":10}],49:[function(require,module,exports){
// vg.js
// JavaScript library for vector graphics
// https://github.com/nodebox/vg.js
// (c) 2014 EMRG
// vg.js may be freely distributed under the MIT license.
// Based on: canvas.js, https://github.com/clips/pattern/blob/master/pattern/canvas.js (BSD)
// De Smedt T. & Daelemans W. (2012). Pattern for Python. Journal of Machine Learning Research.

'use strict';

var assignIn = require('lodash.assignin');

var vg = {};

// Utility functions
vg.bezier = require('./util/bezier');
vg.color = require('./util/color');
vg.geo = require('./util/geo');
vg.math = require('./util/math');
vg.random = require('./util/random');
vg.svg = require('./util/svg');

// Objects
vg.Color = require('./objects/color');
vg.Group = require('./objects/group');
vg.Matrix4 = require('./objects/matrix4');
vg.Path = require('./objects/path');
vg.Point = vg.Vec2 = require('./objects/point');
vg.Rect = require('./objects/rect');
vg.Text = require('./objects/text');
vg.Transform = vg.Matrix3 = require('./objects/transform');
vg.Vec3 = require('./objects/vec3');

// Commands
function importCommands(module) {
    for (var k in module) {
        vg[k] = module[k];
    }
}

var Transformable = require('./objects/transformable');
assignIn(vg.Point.prototype, Transformable);
assignIn(vg.Path.prototype, Transformable);
assignIn(vg.Group.prototype, Transformable);
assignIn(vg.Text.prototype, Transformable);

importCommands(require('./commands/draw'));
importCommands(require('./commands/filters'));
importCommands(require('./commands/shapes'));

module.exports = vg;
},{"./commands/draw":29,"./commands/filters":30,"./commands/shapes":31,"./objects/color":32,"./objects/group":33,"./objects/matrix4":34,"./objects/path":35,"./objects/point":36,"./objects/rect":37,"./objects/text":38,"./objects/transform":39,"./objects/transformable":40,"./objects/vec3":41,"./util/bezier":42,"./util/color":43,"./util/geo":44,"./util/math":46,"./util/random":47,"./util/svg":48,"lodash.assignin":2}],50:[function(require,module,exports){
// rev 482
/********************************************************************************
 *                                                                              *
 * Author    :  Angus Johnson                                                   *
 * Version   :  6.2.1                                                          *
 * Date      :  31 October 2014                                                 *
 * Website   :  http://www.angusj.com                                           *
 * Copyright :  Angus Johnson 2010-2014                                         *
 *                                                                              *
 * License:                                                                     *
 * Use, modification & distribution is subject to Boost Software License Ver 1. *
 * http://www.boost.org/LICENSE_1_0.txt                                         *
 *                                                                              *
 * Attributions:                                                                *
 * The code in this library is an extension of Bala Vatti's clipping algorithm: *
 * "A generic solution to polygon clipping"                                     *
 * Communications of the ACM, Vol 35, Issue 7 (July 1992) pp 56-63.             *
 * http://portal.acm.org/citation.cfm?id=129906                                 *
 *                                                                              *
 * Computer graphics and geometric modeling: implementation and algorithms      *
 * By Max K. Agoston                                                            *
 * Springer; 1 edition (January 4, 2005)                                        *
 * http://books.google.com/books?q=vatti+clipping+agoston                       *
 *                                                                              *
 * See also:                                                                    *
 * "Polygon Offsetting by Computing Winding Numbers"                            *
 * Paper no. DETC2005-85513 pp. 565-575                                         *
 * ASME 2005 International Design Engineering Technical Conferences             *
 * and Computers and Information in Engineering Conference (IDETC/CIE2005)      *
 * September 24-28, 2005 , Long Beach, California, USA                          *
 * http://www.me.berkeley.edu/~mcmains/pubs/DAC05OffsetPolygon.pdf              *
 *                                                                              *
 *******************************************************************************/
/*******************************************************************************
 *                                                                              *
 * Author    :  Timo                                                            *
 * Version   :  6.2.1.2                                                         *
 * Date      :  27 November 2016                                                 *
 *                                                                              *
 * This is a translation of the C# Clipper library to Javascript.               *
 * Int128 struct of C# is implemented using JSBN of Tom Wu.                     *
 * Because Javascript lacks support for 64-bit integers, the space              *
 * is a little more restricted than in C# version.                              *
 *                                                                              *
 * C# version has support for coordinate space:                                 *
 * +-4611686018427387903 ( sqrt(2^127 -1)/2 )                                   *
 * while Javascript version has support for space:                              *
 * +-4503599627370495 ( sqrt(2^106 -1)/2 )                                      *
 *                                                                              *
 * Tom Wu's JSBN proved to be the fastest big integer library:                  *
 * http://jsperf.com/big-integer-library-test                                   *
 *                                                                              *
 * This class can be made simpler when (if ever) 64-bit integer support comes.  *
 *                                                                              *
 *******************************************************************************/
/*******************************************************************************
 *                                                                              *
 * Basic JavaScript BN library - subset useful for RSA encryption.              *
 * http://www-cs-students.stanford.edu/~tjw/jsbn/                               *
 * Copyright (c) 2005  Tom Wu                                                   *
 * All Rights Reserved.                                                         *
 * See "LICENSE" for details:                                                   *
 * http://www-cs-students.stanford.edu/~tjw/jsbn/LICENSE                        *
 *                                                                              *
 *******************************************************************************/
(function ()
{
  "use strict";
  var ClipperLib = {};

  //UseLines: Enables open path clipping. Adds a very minor cost to performance.
  ClipperLib.use_lines = true;

  //ClipperLib.use_xyz: adds a Z member to IntPoint. Adds a minor cost to performance.
  ClipperLib.use_xyz = false;

  var isNode = false;
  if (typeof module !== 'undefined' && module.exports)
  {
    module.exports = ClipperLib;
    isNode = true;
  }
  else
  {
    if (typeof (document) !== "undefined") window.ClipperLib = ClipperLib;
    else self['ClipperLib'] = ClipperLib;
  }
  var navigator_appName;
  if (!isNode)
  {
    var nav = navigator.userAgent.toString().toLowerCase();
    navigator_appName = navigator.appName;
  }
  else
  {
    var nav = "chrome"; // Node.js uses Chrome's V8 engine
    navigator_appName = "Netscape"; // Firefox, Chrome and Safari returns "Netscape", so Node.js should also
  }
  // Browser test to speedup performance critical functions
  var browser = {};
  if (nav.indexOf("chrome") != -1 && nav.indexOf("chromium") == -1) browser.chrome = 1;
  else browser.chrome = 0;
  if (nav.indexOf("chromium") != -1) browser.chromium = 1;
  else browser.chromium = 0;
  if (nav.indexOf("safari") != -1 && nav.indexOf("chrome") == -1 && nav.indexOf("chromium") == -1) browser.safari = 1;
  else browser.safari = 0;
  if (nav.indexOf("firefox") != -1) browser.firefox = 1;
  else browser.firefox = 0;
  if (nav.indexOf("firefox/17") != -1) browser.firefox17 = 1;
  else browser.firefox17 = 0;
  if (nav.indexOf("firefox/15") != -1) browser.firefox15 = 1;
  else browser.firefox15 = 0;
  if (nav.indexOf("firefox/3") != -1) browser.firefox3 = 1;
  else browser.firefox3 = 0;
  if (nav.indexOf("opera") != -1) browser.opera = 1;
  else browser.opera = 0;
  if (nav.indexOf("msie 10") != -1) browser.msie10 = 1;
  else browser.msie10 = 0;
  if (nav.indexOf("msie 9") != -1) browser.msie9 = 1;
  else browser.msie9 = 0;
  if (nav.indexOf("msie 8") != -1) browser.msie8 = 1;
  else browser.msie8 = 0;
  if (nav.indexOf("msie 7") != -1) browser.msie7 = 1;
  else browser.msie7 = 0;
  if (nav.indexOf("msie ") != -1) browser.msie = 1;
  else browser.msie = 0;
  ClipperLib.biginteger_used = null;

  // Copyright (c) 2005  Tom Wu
  // All Rights Reserved.
  // See "LICENSE" for details.
  // Basic JavaScript BN library - subset useful for RSA encryption.
  // Bits per digit
  var dbits;
  // JavaScript engine analysis
  var canary = 0xdeadbeefcafe;
  var j_lm = ((canary & 0xffffff) == 0xefcafe);
  // (public) Constructor
  function BigInteger(a, b, c)
  {
    // This test variable can be removed,
    // but at least for performance tests it is useful piece of knowledge
    // This is the only ClipperLib related variable in BigInteger library
    ClipperLib.biginteger_used = 1;
    if (a != null)
      if ("number" == typeof a && "undefined" == typeof (b)) this.fromInt(a); // faster conversion
      else if ("number" == typeof a) this.fromNumber(a, b, c);
    else if (b == null && "string" != typeof a) this.fromString(a, 256);
    else this.fromString(a, b);
  }
  // return new, unset BigInteger
  function nbi()
  {
    return new BigInteger(null,undefined,undefined);
  }
  // am: Compute w_j += (x*this_i), propagate carries,
  // c is initial carry, returns final carry.
  // c < 3*dvalue, x < 2*dvalue, this_i < dvalue
  // We need to select the fastest one that works in this environment.
  // am1: use a single mult and divide to get the high bits,
  // max digit bits should be 26 because
  // max internal value = 2*dvalue^2-2*dvalue (< 2^53)
  function am1(i, x, w, j, c, n)
  {
    while (--n >= 0)
    {
      var v = x * this[i++] + w[j] + c;
      c = Math.floor(v / 0x4000000);
      w[j++] = v & 0x3ffffff;
    }
    return c;
  }
  // am2 avoids a big mult-and-extract completely.
  // Max digit bits should be <= 30 because we do bitwise ops
  // on values up to 2*hdvalue^2-hdvalue-1 (< 2^31)
  function am2(i, x, w, j, c, n)
  {
    var xl = x & 0x7fff,
      xh = x >> 15;
    while (--n >= 0)
    {
      var l = this[i] & 0x7fff;
      var h = this[i++] >> 15;
      var m = xh * l + h * xl;
      l = xl * l + ((m & 0x7fff) << 15) + w[j] + (c & 0x3fffffff);
      c = (l >>> 30) + (m >>> 15) + xh * h + (c >>> 30);
      w[j++] = l & 0x3fffffff;
    }
    return c;
  }
  // Alternately, set max digit bits to 28 since some
  // browsers slow down when dealing with 32-bit numbers.
  function am3(i, x, w, j, c, n)
  {
    var xl = x & 0x3fff,
      xh = x >> 14;
    while (--n >= 0)
    {
      var l = this[i] & 0x3fff;
      var h = this[i++] >> 14;
      var m = xh * l + h * xl;
      l = xl * l + ((m & 0x3fff) << 14) + w[j] + c;
      c = (l >> 28) + (m >> 14) + xh * h;
      w[j++] = l & 0xfffffff;
    }
    return c;
  }
  if (j_lm && (navigator_appName == "Microsoft Internet Explorer"))
  {
    BigInteger.prototype.am = am2;
    dbits = 30;
  }
  else if (j_lm && (navigator_appName != "Netscape"))
  {
    BigInteger.prototype.am = am1;
    dbits = 26;
  }
  else
  { // Mozilla/Netscape seems to prefer am3
    BigInteger.prototype.am = am3;
    dbits = 28;
  }
  BigInteger.prototype.DB = dbits;
  BigInteger.prototype.DM = ((1 << dbits) - 1);
  BigInteger.prototype.DV = (1 << dbits);
  var BI_FP = 52;
  BigInteger.prototype.FV = Math.pow(2, BI_FP);
  BigInteger.prototype.F1 = BI_FP - dbits;
  BigInteger.prototype.F2 = 2 * dbits - BI_FP;
  // Digit conversions
  var BI_RM = "0123456789abcdefghijklmnopqrstuvwxyz";
  var BI_RC = new Array();
  var rr, vv;
  rr = "0".charCodeAt(0);
  for (vv = 0; vv <= 9; ++vv) BI_RC[rr++] = vv;
  rr = "a".charCodeAt(0);
  for (vv = 10; vv < 36; ++vv) BI_RC[rr++] = vv;
  rr = "A".charCodeAt(0);
  for (vv = 10; vv < 36; ++vv) BI_RC[rr++] = vv;

  function int2char(n)
  {
    return BI_RM.charAt(n);
  }

  function intAt(s, i)
  {
    var c = BI_RC[s.charCodeAt(i)];
    return (c == null) ? -1 : c;
  }
  // (protected) copy this to r
  function bnpCopyTo(r)
  {
    for (var i = this.t - 1; i >= 0; --i) r[i] = this[i];
    r.t = this.t;
    r.s = this.s;
  }
  // (protected) set from integer value x, -DV <= x < DV
  function bnpFromInt(x)
  {
    this.t = 1;
    this.s = (x < 0) ? -1 : 0;
    if (x > 0) this[0] = x;
    else if (x < -1) this[0] = x + this.DV;
    else this.t = 0;
  }
  // return bigint initialized to value
  function nbv(i)
  {
    var r = nbi();
    r.fromInt(i);
    return r;
  }
  // (protected) set from string and radix
  function bnpFromString(s, b)
  {
    var k;
    if (b == 16) k = 4;
    else if (b == 8) k = 3;
    else if (b == 256) k = 8; // byte array
    else if (b == 2) k = 1;
    else if (b == 32) k = 5;
    else if (b == 4) k = 2;
    else
    {
      this.fromRadix(s, b);
      return;
    }
    this.t = 0;
    this.s = 0;
    var i = s.length,
      mi = false,
      sh = 0;
    while (--i >= 0)
    {
      var x = (k == 8) ? s[i] & 0xff : intAt(s, i);
      if (x < 0)
      {
        if (s.charAt(i) == "-") mi = true;
        continue;
      }
      mi = false;
      if (sh == 0)
        this[this.t++] = x;
      else if (sh + k > this.DB)
      {
        this[this.t - 1] |= (x & ((1 << (this.DB - sh)) - 1)) << sh;
        this[this.t++] = (x >> (this.DB - sh));
      }
      else
        this[this.t - 1] |= x << sh;
      sh += k;
      if (sh >= this.DB) sh -= this.DB;
    }
    if (k == 8 && (s[0] & 0x80) != 0)
    {
      this.s = -1;
      if (sh > 0) this[this.t - 1] |= ((1 << (this.DB - sh)) - 1) << sh;
    }
    this.clamp();
    if (mi) BigInteger.ZERO.subTo(this, this);
  }
  // (protected) clamp off excess high words
  function bnpClamp()
  {
    var c = this.s & this.DM;
    while (this.t > 0 && this[this.t - 1] == c)--this.t;
  }
  // (public) return string representation in given radix
  function bnToString(b)
  {
    if (this.s < 0) return "-" + this.negate().toString(b);
    var k;
    if (b == 16) k = 4;
    else if (b == 8) k = 3;
    else if (b == 2) k = 1;
    else if (b == 32) k = 5;
    else if (b == 4) k = 2;
    else return this.toRadix(b);
    var km = (1 << k) - 1,
      d, m = false,
      r = "",
      i = this.t;
    var p = this.DB - (i * this.DB) % k;
    if (i-- > 0)
    {
      if (p < this.DB && (d = this[i] >> p) > 0)
      {
        m = true;
        r = int2char(d);
      }
      while (i >= 0)
      {
        if (p < k)
        {
          d = (this[i] & ((1 << p) - 1)) << (k - p);
          d |= this[--i] >> (p += this.DB - k);
        }
        else
        {
          d = (this[i] >> (p -= k)) & km;
          if (p <= 0)
          {
            p += this.DB;
            --i;
          }
        }
        if (d > 0) m = true;
        if (m) r += int2char(d);
      }
    }
    return m ? r : "0";
  }
  // (public) -this
  function bnNegate()
  {
    var r = nbi();
    BigInteger.ZERO.subTo(this, r);
    return r;
  }
  // (public) |this|
  function bnAbs()
  {
    return (this.s < 0) ? this.negate() : this;
  }
  // (public) return + if this > a, - if this < a, 0 if equal
  function bnCompareTo(a)
  {
    var r = this.s - a.s;
    if (r != 0) return r;
    var i = this.t;
    r = i - a.t;
    if (r != 0) return (this.s < 0) ? -r : r;
    while (--i >= 0)
      if ((r = this[i] - a[i]) != 0) return r;
    return 0;
  }
  // returns bit length of the integer x
  function nbits(x)
  {
    var r = 1,
      t;
    if ((t = x >>> 16) != 0)
    {
      x = t;
      r += 16;
    }
    if ((t = x >> 8) != 0)
    {
      x = t;
      r += 8;
    }
    if ((t = x >> 4) != 0)
    {
      x = t;
      r += 4;
    }
    if ((t = x >> 2) != 0)
    {
      x = t;
      r += 2;
    }
    if ((t = x >> 1) != 0)
    {
      x = t;
      r += 1;
    }
    return r;
  }
  // (public) return the number of bits in "this"
  function bnBitLength()
  {
    if (this.t <= 0) return 0;
    return this.DB * (this.t - 1) + nbits(this[this.t - 1] ^ (this.s & this.DM));
  }
  // (protected) r = this << n*DB
  function bnpDLShiftTo(n, r)
  {
    var i;
    for (i = this.t - 1; i >= 0; --i) r[i + n] = this[i];
    for (i = n - 1; i >= 0; --i) r[i] = 0;
    r.t = this.t + n;
    r.s = this.s;
  }
  // (protected) r = this >> n*DB
  function bnpDRShiftTo(n, r)
  {
    for (var i = n; i < this.t; ++i) r[i - n] = this[i];
    r.t = Math.max(this.t - n, 0);
    r.s = this.s;
  }
  // (protected) r = this << n
  function bnpLShiftTo(n, r)
  {
    var bs = n % this.DB;
    var cbs = this.DB - bs;
    var bm = (1 << cbs) - 1;
    var ds = Math.floor(n / this.DB),
      c = (this.s << bs) & this.DM,
      i;
    for (i = this.t - 1; i >= 0; --i)
    {
      r[i + ds + 1] = (this[i] >> cbs) | c;
      c = (this[i] & bm) << bs;
    }
    for (i = ds - 1; i >= 0; --i) r[i] = 0;
    r[ds] = c;
    r.t = this.t + ds + 1;
    r.s = this.s;
    r.clamp();
  }
  // (protected) r = this >> n
  function bnpRShiftTo(n, r)
  {
    r.s = this.s;
    var ds = Math.floor(n / this.DB);
    if (ds >= this.t)
    {
      r.t = 0;
      return;
    }
    var bs = n % this.DB;
    var cbs = this.DB - bs;
    var bm = (1 << bs) - 1;
    r[0] = this[ds] >> bs;
    for (var i = ds + 1; i < this.t; ++i)
    {
      r[i - ds - 1] |= (this[i] & bm) << cbs;
      r[i - ds] = this[i] >> bs;
    }
    if (bs > 0) r[this.t - ds - 1] |= (this.s & bm) << cbs;
    r.t = this.t - ds;
    r.clamp();
  }
  // (protected) r = this - a
  function bnpSubTo(a, r)
  {
    var i = 0,
      c = 0,
      m = Math.min(a.t, this.t);
    while (i < m)
    {
      c += this[i] - a[i];
      r[i++] = c & this.DM;
      c >>= this.DB;
    }
    if (a.t < this.t)
    {
      c -= a.s;
      while (i < this.t)
      {
        c += this[i];
        r[i++] = c & this.DM;
        c >>= this.DB;
      }
      c += this.s;
    }
    else
    {
      c += this.s;
      while (i < a.t)
      {
        c -= a[i];
        r[i++] = c & this.DM;
        c >>= this.DB;
      }
      c -= a.s;
    }
    r.s = (c < 0) ? -1 : 0;
    if (c < -1) r[i++] = this.DV + c;
    else if (c > 0) r[i++] = c;
    r.t = i;
    r.clamp();
  }
  // (protected) r = this * a, r != this,a (HAC 14.12)
  // "this" should be the larger one if appropriate.
  function bnpMultiplyTo(a, r)
  {
    var x = this.abs(),
      y = a.abs();
    var i = x.t;
    r.t = i + y.t;
    while (--i >= 0) r[i] = 0;
    for (i = 0; i < y.t; ++i) r[i + x.t] = x.am(0, y[i], r, i, 0, x.t);
    r.s = 0;
    r.clamp();
    if (this.s != a.s) BigInteger.ZERO.subTo(r, r);
  }
  // (protected) r = this^2, r != this (HAC 14.16)
  function bnpSquareTo(r)
  {
    var x = this.abs();
    var i = r.t = 2 * x.t;
    while (--i >= 0) r[i] = 0;
    for (i = 0; i < x.t - 1; ++i)
    {
      var c = x.am(i, x[i], r, 2 * i, 0, 1);
      if ((r[i + x.t] += x.am(i + 1, 2 * x[i], r, 2 * i + 1, c, x.t - i - 1)) >= x.DV)
      {
        r[i + x.t] -= x.DV;
        r[i + x.t + 1] = 1;
      }
    }
    if (r.t > 0) r[r.t - 1] += x.am(i, x[i], r, 2 * i, 0, 1);
    r.s = 0;
    r.clamp();
  }
  // (protected) divide this by m, quotient and remainder to q, r (HAC 14.20)
  // r != q, this != m.  q or r may be null.
  function bnpDivRemTo(m, q, r)
  {
    var pm = m.abs();
    if (pm.t <= 0) return;
    var pt = this.abs();
    if (pt.t < pm.t)
    {
      if (q != null) q.fromInt(0);
      if (r != null) this.copyTo(r);
      return;
    }
    if (r == null) r = nbi();
    var y = nbi(),
      ts = this.s,
      ms = m.s;
    var nsh = this.DB - nbits(pm[pm.t - 1]); // normalize modulus
    if (nsh > 0)
    {
      pm.lShiftTo(nsh, y);
      pt.lShiftTo(nsh, r);
    }
    else
    {
      pm.copyTo(y);
      pt.copyTo(r);
    }
    var ys = y.t;
    var y0 = y[ys - 1];
    if (y0 == 0) return;
    var yt = y0 * (1 << this.F1) + ((ys > 1) ? y[ys - 2] >> this.F2 : 0);
    var d1 = this.FV / yt,
      d2 = (1 << this.F1) / yt,
      e = 1 << this.F2;
    var i = r.t,
      j = i - ys,
      t = (q == null) ? nbi() : q;
    y.dlShiftTo(j, t);
    if (r.compareTo(t) >= 0)
    {
      r[r.t++] = 1;
      r.subTo(t, r);
    }
    BigInteger.ONE.dlShiftTo(ys, t);
    t.subTo(y, y); // "negative" y so we can replace sub with am later
    while (y.t < ys) y[y.t++] = 0;
    while (--j >= 0)
    {
      // Estimate quotient digit
      var qd = (r[--i] == y0) ? this.DM : Math.floor(r[i] * d1 + (r[i - 1] + e) * d2);
      if ((r[i] += y.am(0, qd, r, j, 0, ys)) < qd)
      { // Try it out
        y.dlShiftTo(j, t);
        r.subTo(t, r);
        while (r[i] < --qd) r.subTo(t, r);
      }
    }
    if (q != null)
    {
      r.drShiftTo(ys, q);
      if (ts != ms) BigInteger.ZERO.subTo(q, q);
    }
    r.t = ys;
    r.clamp();
    if (nsh > 0) r.rShiftTo(nsh, r); // Denormalize remainder
    if (ts < 0) BigInteger.ZERO.subTo(r, r);
  }
  // (public) this mod a
  function bnMod(a)
  {
    var r = nbi();
    this.abs().divRemTo(a, null, r);
    if (this.s < 0 && r.compareTo(BigInteger.ZERO) > 0) a.subTo(r, r);
    return r;
  }
  // Modular reduction using "classic" algorithm
  function Classic(m)
  {
    this.m = m;
  }

  function cConvert(x)
  {
    if (x.s < 0 || x.compareTo(this.m) >= 0) return x.mod(this.m);
    else return x;
  }

  function cRevert(x)
  {
    return x;
  }

  function cReduce(x)
  {
    x.divRemTo(this.m, null, x);
  }

  function cMulTo(x, y, r)
  {
    x.multiplyTo(y, r);
    this.reduce(r);
  }

  function cSqrTo(x, r)
  {
    x.squareTo(r);
    this.reduce(r);
  }
  Classic.prototype.convert = cConvert;
  Classic.prototype.revert = cRevert;
  Classic.prototype.reduce = cReduce;
  Classic.prototype.mulTo = cMulTo;
  Classic.prototype.sqrTo = cSqrTo;
  // (protected) return "-1/this % 2^DB"; useful for Mont. reduction
  // justification:
  //         xy == 1 (mod m)
  //         xy =  1+km
  //   xy(2-xy) = (1+km)(1-km)
  // x[y(2-xy)] = 1-k^2m^2
  // x[y(2-xy)] == 1 (mod m^2)
  // if y is 1/x mod m, then y(2-xy) is 1/x mod m^2
  // should reduce x and y(2-xy) by m^2 at each step to keep size bounded.
  // JS multiply "overflows" differently from C/C++, so care is needed here.
  function bnpInvDigit()
  {
    if (this.t < 1) return 0;
    var x = this[0];
    if ((x & 1) == 0) return 0;
    var y = x & 3; // y == 1/x mod 2^2
    y = (y * (2 - (x & 0xf) * y)) & 0xf; // y == 1/x mod 2^4
    y = (y * (2 - (x & 0xff) * y)) & 0xff; // y == 1/x mod 2^8
    y = (y * (2 - (((x & 0xffff) * y) & 0xffff))) & 0xffff; // y == 1/x mod 2^16
    // last step - calculate inverse mod DV directly;
    // assumes 16 < DB <= 32 and assumes ability to handle 48-bit ints
    y = (y * (2 - x * y % this.DV)) % this.DV; // y == 1/x mod 2^dbits
    // we really want the negative inverse, and -DV < y < DV
    return (y > 0) ? this.DV - y : -y;
  }
  // Montgomery reduction
  function Montgomery(m)
  {
    this.m = m;
    this.mp = m.invDigit();
    this.mpl = this.mp & 0x7fff;
    this.mph = this.mp >> 15;
    this.um = (1 << (m.DB - 15)) - 1;
    this.mt2 = 2 * m.t;
  }
  // xR mod m
  function montConvert(x)
  {
    var r = nbi();
    x.abs().dlShiftTo(this.m.t, r);
    r.divRemTo(this.m, null, r);
    if (x.s < 0 && r.compareTo(BigInteger.ZERO) > 0) this.m.subTo(r, r);
    return r;
  }
  // x/R mod m
  function montRevert(x)
  {
    var r = nbi();
    x.copyTo(r);
    this.reduce(r);
    return r;
  }
  // x = x/R mod m (HAC 14.32)
  function montReduce(x)
  {
    while (x.t <= this.mt2) // pad x so am has enough room later
      x[x.t++] = 0;
    for (var i = 0; i < this.m.t; ++i)
    {
      // faster way of calculating u0 = x[i]*mp mod DV
      var j = x[i] & 0x7fff;
      var u0 = (j * this.mpl + (((j * this.mph + (x[i] >> 15) * this.mpl) & this.um) << 15)) & x.DM;
      // use am to combine the multiply-shift-add into one call
      j = i + this.m.t;
      x[j] += this.m.am(0, u0, x, i, 0, this.m.t);
      // propagate carry
      while (x[j] >= x.DV)
      {
        x[j] -= x.DV;
        x[++j]++;
      }
    }
    x.clamp();
    x.drShiftTo(this.m.t, x);
    if (x.compareTo(this.m) >= 0) x.subTo(this.m, x);
  }
  // r = "x^2/R mod m"; x != r
  function montSqrTo(x, r)
  {
    x.squareTo(r);
    this.reduce(r);
  }
  // r = "xy/R mod m"; x,y != r
  function montMulTo(x, y, r)
  {
    x.multiplyTo(y, r);
    this.reduce(r);
  }
  Montgomery.prototype.convert = montConvert;
  Montgomery.prototype.revert = montRevert;
  Montgomery.prototype.reduce = montReduce;
  Montgomery.prototype.mulTo = montMulTo;
  Montgomery.prototype.sqrTo = montSqrTo;
  // (protected) true iff this is even
  function bnpIsEven()
  {
    return ((this.t > 0) ? (this[0] & 1) : this.s) == 0;
  }
  // (protected) this^e, e < 2^32, doing sqr and mul with "r" (HAC 14.79)
  function bnpExp(e, z)
  {
    if (e > 0xffffffff || e < 1) return BigInteger.ONE;
    var r = nbi(),
      r2 = nbi(),
      g = z.convert(this),
      i = nbits(e) - 1;
    g.copyTo(r);
    while (--i >= 0)
    {
      z.sqrTo(r, r2);
      if ((e & (1 << i)) > 0) z.mulTo(r2, g, r);
      else
      {
        var t = r;
        r = r2;
        r2 = t;
      }
    }
    return z.revert(r);
  }
  // (public) this^e % m, 0 <= e < 2^32
  function bnModPowInt(e, m)
  {
    var z;
    if (e < 256 || m.isEven()) z = new Classic(m);
    else z = new Montgomery(m);
    return this.exp(e, z);
  }
  // protected
  BigInteger.prototype.copyTo = bnpCopyTo;
  BigInteger.prototype.fromInt = bnpFromInt;
  BigInteger.prototype.fromString = bnpFromString;
  BigInteger.prototype.clamp = bnpClamp;
  BigInteger.prototype.dlShiftTo = bnpDLShiftTo;
  BigInteger.prototype.drShiftTo = bnpDRShiftTo;
  BigInteger.prototype.lShiftTo = bnpLShiftTo;
  BigInteger.prototype.rShiftTo = bnpRShiftTo;
  BigInteger.prototype.subTo = bnpSubTo;
  BigInteger.prototype.multiplyTo = bnpMultiplyTo;
  BigInteger.prototype.squareTo = bnpSquareTo;
  BigInteger.prototype.divRemTo = bnpDivRemTo;
  BigInteger.prototype.invDigit = bnpInvDigit;
  BigInteger.prototype.isEven = bnpIsEven;
  BigInteger.prototype.exp = bnpExp;
  // public
  BigInteger.prototype.toString = bnToString;
  BigInteger.prototype.negate = bnNegate;
  BigInteger.prototype.abs = bnAbs;
  BigInteger.prototype.compareTo = bnCompareTo;
  BigInteger.prototype.bitLength = bnBitLength;
  BigInteger.prototype.mod = bnMod;
  BigInteger.prototype.modPowInt = bnModPowInt;
  // "constants"
  BigInteger.ZERO = nbv(0);
  BigInteger.ONE = nbv(1);
  // Copyright (c) 2005-2009  Tom Wu
  // All Rights Reserved.
  // See "LICENSE" for details.
  // Extended JavaScript BN functions, required for RSA private ops.
  // Version 1.1: new BigInteger("0", 10) returns "proper" zero
  // Version 1.2: square() API, isProbablePrime fix
  // (public)
  function bnClone()
  {
    var r = nbi();
    this.copyTo(r);
    return r;
  }
  // (public) return value as integer
  function bnIntValue()
  {
    if (this.s < 0)
    {
      if (this.t == 1) return this[0] - this.DV;
      else if (this.t == 0) return -1;
    }
    else if (this.t == 1) return this[0];
    else if (this.t == 0) return 0;
    // assumes 16 < DB < 32
    return ((this[1] & ((1 << (32 - this.DB)) - 1)) << this.DB) | this[0];
  }
  // (public) return value as byte
  function bnByteValue()
  {
    return (this.t == 0) ? this.s : (this[0] << 24) >> 24;
  }
  // (public) return value as short (assumes DB>=16)
  function bnShortValue()
  {
    return (this.t == 0) ? this.s : (this[0] << 16) >> 16;
  }
  // (protected) return x s.t. r^x < DV
  function bnpChunkSize(r)
  {
    return Math.floor(Math.LN2 * this.DB / Math.log(r));
  }
  // (public) 0 if this == 0, 1 if this > 0
  function bnSigNum()
  {
    if (this.s < 0) return -1;
    else if (this.t <= 0 || (this.t == 1 && this[0] <= 0)) return 0;
    else return 1;
  }
  // (protected) convert to radix string
  function bnpToRadix(b)
  {
    if (b == null) b = 10;
    if (this.signum() == 0 || b < 2 || b > 36) return "0";
    var cs = this.chunkSize(b);
    var a = Math.pow(b, cs);
    var d = nbv(a),
      y = nbi(),
      z = nbi(),
      r = "";
    this.divRemTo(d, y, z);
    while (y.signum() > 0)
    {
      r = (a + z.intValue()).toString(b).substr(1) + r;
      y.divRemTo(d, y, z);
    }
    return z.intValue().toString(b) + r;
  }
  // (protected) convert from radix string
  function bnpFromRadix(s, b)
  {
    this.fromInt(0);
    if (b == null) b = 10;
    var cs = this.chunkSize(b);
    var d = Math.pow(b, cs),
      mi = false,
      j = 0,
      w = 0;
    for (var i = 0; i < s.length; ++i)
    {
      var x = intAt(s, i);
      if (x < 0)
      {
        if (s.charAt(i) == "-" && this.signum() == 0) mi = true;
        continue;
      }
      w = b * w + x;
      if (++j >= cs)
      {
        this.dMultiply(d);
        this.dAddOffset(w, 0);
        j = 0;
        w = 0;
      }
    }
    if (j > 0)
    {
      this.dMultiply(Math.pow(b, j));
      this.dAddOffset(w, 0);
    }
    if (mi) BigInteger.ZERO.subTo(this, this);
  }
  // (protected) alternate constructor
  function bnpFromNumber(a, b, c)
  {
    if ("number" == typeof b)
    {
      // new BigInteger(int,int,RNG)
      if (a < 2) this.fromInt(1);
      else
      {
        this.fromNumber(a, c);
        if (!this.testBit(a - 1)) // force MSB set
          this.bitwiseTo(BigInteger.ONE.shiftLeft(a - 1), op_or, this);
        if (this.isEven()) this.dAddOffset(1, 0); // force odd
        while (!this.isProbablePrime(b))
        {
          this.dAddOffset(2, 0);
          if (this.bitLength() > a) this.subTo(BigInteger.ONE.shiftLeft(a - 1), this);
        }
      }
    }
    else
    {
      // new BigInteger(int,RNG)
      var x = new Array(),
        t = a & 7;
      x.length = (a >> 3) + 1;
      b.nextBytes(x);
      if (t > 0) x[0] &= ((1 << t) - 1);
      else x[0] = 0;
      this.fromString(x, 256);
    }
  }
  // (public) convert to bigendian byte array
  function bnToByteArray()
  {
    var i = this.t,
      r = new Array();
    r[0] = this.s;
    var p = this.DB - (i * this.DB) % 8,
      d, k = 0;
    if (i-- > 0)
    {
      if (p < this.DB && (d = this[i] >> p) != (this.s & this.DM) >> p)
        r[k++] = d | (this.s << (this.DB - p));
      while (i >= 0)
      {
        if (p < 8)
        {
          d = (this[i] & ((1 << p) - 1)) << (8 - p);
          d |= this[--i] >> (p += this.DB - 8);
        }
        else
        {
          d = (this[i] >> (p -= 8)) & 0xff;
          if (p <= 0)
          {
            p += this.DB;
            --i;
          }
        }
        if ((d & 0x80) != 0) d |= -256;
        if (k == 0 && (this.s & 0x80) != (d & 0x80))++k;
        if (k > 0 || d != this.s) r[k++] = d;
      }
    }
    return r;
  }

  function bnEquals(a)
  {
    return (this.compareTo(a) == 0);
  }

  function bnMin(a)
  {
    return (this.compareTo(a) < 0) ? this : a;
  }

  function bnMax(a)
  {
    return (this.compareTo(a) > 0) ? this : a;
  }
  // (protected) r = this op a (bitwise)
  function bnpBitwiseTo(a, op, r)
  {
    var i, f, m = Math.min(a.t, this.t);
    for (i = 0; i < m; ++i) r[i] = op(this[i], a[i]);
    if (a.t < this.t)
    {
      f = a.s & this.DM;
      for (i = m; i < this.t; ++i) r[i] = op(this[i], f);
      r.t = this.t;
    }
    else
    {
      f = this.s & this.DM;
      for (i = m; i < a.t; ++i) r[i] = op(f, a[i]);
      r.t = a.t;
    }
    r.s = op(this.s, a.s);
    r.clamp();
  }
  // (public) this & a
  function op_and(x, y)
  {
    return x & y;
  }

  function bnAnd(a)
  {
    var r = nbi();
    this.bitwiseTo(a, op_and, r);
    return r;
  }
  // (public) this | a
  function op_or(x, y)
  {
    return x | y;
  }

  function bnOr(a)
  {
    var r = nbi();
    this.bitwiseTo(a, op_or, r);
    return r;
  }
  // (public) this ^ a
  function op_xor(x, y)
  {
    return x ^ y;
  }

  function bnXor(a)
  {
    var r = nbi();
    this.bitwiseTo(a, op_xor, r);
    return r;
  }
  // (public) this & ~a
  function op_andnot(x, y)
  {
    return x & ~y;
  }

  function bnAndNot(a)
  {
    var r = nbi();
    this.bitwiseTo(a, op_andnot, r);
    return r;
  }
  // (public) ~this
  function bnNot()
  {
    var r = nbi();
    for (var i = 0; i < this.t; ++i) r[i] = this.DM & ~this[i];
    r.t = this.t;
    r.s = ~this.s;
    return r;
  }
  // (public) this << n
  function bnShiftLeft(n)
  {
    var r = nbi();
    if (n < 0) this.rShiftTo(-n, r);
    else this.lShiftTo(n, r);
    return r;
  }
  // (public) this >> n
  function bnShiftRight(n)
  {
    var r = nbi();
    if (n < 0) this.lShiftTo(-n, r);
    else this.rShiftTo(n, r);
    return r;
  }
  // return index of lowest 1-bit in x, x < 2^31
  function lbit(x)
  {
    if (x == 0) return -1;
    var r = 0;
    if ((x & 0xffff) == 0)
    {
      x >>= 16;
      r += 16;
    }
    if ((x & 0xff) == 0)
    {
      x >>= 8;
      r += 8;
    }
    if ((x & 0xf) == 0)
    {
      x >>= 4;
      r += 4;
    }
    if ((x & 3) == 0)
    {
      x >>= 2;
      r += 2;
    }
    if ((x & 1) == 0)++r;
    return r;
  }
  // (public) returns index of lowest 1-bit (or -1 if none)
  function bnGetLowestSetBit()
  {
    for (var i = 0; i < this.t; ++i)
      if (this[i] != 0) return i * this.DB + lbit(this[i]);
    if (this.s < 0) return this.t * this.DB;
    return -1;
  }
  // return number of 1 bits in x
  function cbit(x)
  {
    var r = 0;
    while (x != 0)
    {
      x &= x - 1;
      ++r;
    }
    return r;
  }
  // (public) return number of set bits
  function bnBitCount()
  {
    var r = 0,
      x = this.s & this.DM;
    for (var i = 0; i < this.t; ++i) r += cbit(this[i] ^ x);
    return r;
  }
  // (public) true iff nth bit is set
  function bnTestBit(n)
  {
    var j = Math.floor(n / this.DB);
    if (j >= this.t) return (this.s != 0);
    return ((this[j] & (1 << (n % this.DB))) != 0);
  }
  // (protected) this op (1<<n)
  function bnpChangeBit(n, op)
  {
    var r = BigInteger.ONE.shiftLeft(n);
    this.bitwiseTo(r, op, r);
    return r;
  }
  // (public) this | (1<<n)
  function bnSetBit(n)
  {
    return this.changeBit(n, op_or);
  }
  // (public) this & ~(1<<n)
  function bnClearBit(n)
  {
    return this.changeBit(n, op_andnot);
  }
  // (public) this ^ (1<<n)
  function bnFlipBit(n)
  {
    return this.changeBit(n, op_xor);
  }
  // (protected) r = this + a
  function bnpAddTo(a, r)
  {
    var i = 0,
      c = 0,
      m = Math.min(a.t, this.t);
    while (i < m)
    {
      c += this[i] + a[i];
      r[i++] = c & this.DM;
      c >>= this.DB;
    }
    if (a.t < this.t)
    {
      c += a.s;
      while (i < this.t)
      {
        c += this[i];
        r[i++] = c & this.DM;
        c >>= this.DB;
      }
      c += this.s;
    }
    else
    {
      c += this.s;
      while (i < a.t)
      {
        c += a[i];
        r[i++] = c & this.DM;
        c >>= this.DB;
      }
      c += a.s;
    }
    r.s = (c < 0) ? -1 : 0;
    if (c > 0) r[i++] = c;
    else if (c < -1) r[i++] = this.DV + c;
    r.t = i;
    r.clamp();
  }
  // (public) this + a
  function bnAdd(a)
  {
    var r = nbi();
    this.addTo(a, r);
    return r;
  }
  // (public) this - a
  function bnSubtract(a)
  {
    var r = nbi();
    this.subTo(a, r);
    return r;
  }
  // (public) this * a
  function bnMultiply(a)
  {
    var r = nbi();
    this.multiplyTo(a, r);
    return r;
  }
  // (public) this^2
  function bnSquare()
  {
    var r = nbi();
    this.squareTo(r);
    return r;
  }
  // (public) this / a
  function bnDivide(a)
  {
    var r = nbi();
    this.divRemTo(a, r, null);
    return r;
  }
  // (public) this % a
  function bnRemainder(a)
  {
    var r = nbi();
    this.divRemTo(a, null, r);
    return r;
  }
  // (public) [this/a,this%a]
  function bnDivideAndRemainder(a)
  {
    var q = nbi(),
      r = nbi();
    this.divRemTo(a, q, r);
    return new Array(q, r);
  }
  // (protected) this *= n, this >= 0, 1 < n < DV
  function bnpDMultiply(n)
  {
    this[this.t] = this.am(0, n - 1, this, 0, 0, this.t);
    ++this.t;
    this.clamp();
  }
  // (protected) this += n << w words, this >= 0
  function bnpDAddOffset(n, w)
  {
    if (n == 0) return;
    while (this.t <= w) this[this.t++] = 0;
    this[w] += n;
    while (this[w] >= this.DV)
    {
      this[w] -= this.DV;
      if (++w >= this.t) this[this.t++] = 0;
      ++this[w];
    }
  }
  // A "null" reducer
  function NullExp()
  {}

  function nNop(x)
  {
    return x;
  }

  function nMulTo(x, y, r)
  {
    x.multiplyTo(y, r);
  }

  function nSqrTo(x, r)
  {
    x.squareTo(r);
  }
  NullExp.prototype.convert = nNop;
  NullExp.prototype.revert = nNop;
  NullExp.prototype.mulTo = nMulTo;
  NullExp.prototype.sqrTo = nSqrTo;
  // (public) this^e
  function bnPow(e)
  {
    return this.exp(e, new NullExp());
  }
  // (protected) r = lower n words of "this * a", a.t <= n
  // "this" should be the larger one if appropriate.
  function bnpMultiplyLowerTo(a, n, r)
  {
    var i = Math.min(this.t + a.t, n);
    r.s = 0; // assumes a,this >= 0
    r.t = i;
    while (i > 0) r[--i] = 0;
    var j;
    for (j = r.t - this.t; i < j; ++i) r[i + this.t] = this.am(0, a[i], r, i, 0, this.t);
    for (j = Math.min(a.t, n); i < j; ++i) this.am(0, a[i], r, i, 0, n - i);
    r.clamp();
  }
  // (protected) r = "this * a" without lower n words, n > 0
  // "this" should be the larger one if appropriate.
  function bnpMultiplyUpperTo(a, n, r)
  {
    --n;
    var i = r.t = this.t + a.t - n;
    r.s = 0; // assumes a,this >= 0
    while (--i >= 0) r[i] = 0;
    for (i = Math.max(n - this.t, 0); i < a.t; ++i)
      r[this.t + i - n] = this.am(n - i, a[i], r, 0, 0, this.t + i - n);
    r.clamp();
    r.drShiftTo(1, r);
  }
  // Barrett modular reduction
  function Barrett(m)
  {
    // setup Barrett
    this.r2 = nbi();
    this.q3 = nbi();
    BigInteger.ONE.dlShiftTo(2 * m.t, this.r2);
    this.mu = this.r2.divide(m);
    this.m = m;
  }

  function barrettConvert(x)
  {
    if (x.s < 0 || x.t > 2 * this.m.t) return x.mod(this.m);
    else if (x.compareTo(this.m) < 0) return x;
    else
    {
      var r = nbi();
      x.copyTo(r);
      this.reduce(r);
      return r;
    }
  }

  function barrettRevert(x)
  {
    return x;
  }
  // x = x mod m (HAC 14.42)
  function barrettReduce(x)
  {
    x.drShiftTo(this.m.t - 1, this.r2);
    if (x.t > this.m.t + 1)
    {
      x.t = this.m.t + 1;
      x.clamp();
    }
    this.mu.multiplyUpperTo(this.r2, this.m.t + 1, this.q3);
    this.m.multiplyLowerTo(this.q3, this.m.t + 1, this.r2);
    while (x.compareTo(this.r2) < 0) x.dAddOffset(1, this.m.t + 1);
    x.subTo(this.r2, x);
    while (x.compareTo(this.m) >= 0) x.subTo(this.m, x);
  }
  // r = x^2 mod m; x != r
  function barrettSqrTo(x, r)
  {
    x.squareTo(r);
    this.reduce(r);
  }
  // r = x*y mod m; x,y != r
  function barrettMulTo(x, y, r)
  {
    x.multiplyTo(y, r);
    this.reduce(r);
  }
  Barrett.prototype.convert = barrettConvert;
  Barrett.prototype.revert = barrettRevert;
  Barrett.prototype.reduce = barrettReduce;
  Barrett.prototype.mulTo = barrettMulTo;
  Barrett.prototype.sqrTo = barrettSqrTo;
  // (public) this^e % m (HAC 14.85)
  function bnModPow(e, m)
  {
    var i = e.bitLength(),
      k, r = nbv(1),
      z;
    if (i <= 0) return r;
    else if (i < 18) k = 1;
    else if (i < 48) k = 3;
    else if (i < 144) k = 4;
    else if (i < 768) k = 5;
    else k = 6;
    if (i < 8)
      z = new Classic(m);
    else if (m.isEven())
      z = new Barrett(m);
    else
      z = new Montgomery(m);
    // precomputation
    var g = new Array(),
      n = 3,
      k1 = k - 1,
      km = (1 << k) - 1;
    g[1] = z.convert(this);
    if (k > 1)
    {
      var g2 = nbi();
      z.sqrTo(g[1], g2);
      while (n <= km)
      {
        g[n] = nbi();
        z.mulTo(g2, g[n - 2], g[n]);
        n += 2;
      }
    }
    var j = e.t - 1,
      w, is1 = true,
      r2 = nbi(),
      t;
    i = nbits(e[j]) - 1;
    while (j >= 0)
    {
      if (i >= k1) w = (e[j] >> (i - k1)) & km;
      else
      {
        w = (e[j] & ((1 << (i + 1)) - 1)) << (k1 - i);
        if (j > 0) w |= e[j - 1] >> (this.DB + i - k1);
      }
      n = k;
      while ((w & 1) == 0)
      {
        w >>= 1;
        --n;
      }
      if ((i -= n) < 0)
      {
        i += this.DB;
        --j;
      }
      if (is1)
      { // ret == 1, don't bother squaring or multiplying it
        g[w].copyTo(r);
        is1 = false;
      }
      else
      {
        while (n > 1)
        {
          z.sqrTo(r, r2);
          z.sqrTo(r2, r);
          n -= 2;
        }
        if (n > 0) z.sqrTo(r, r2);
        else
        {
          t = r;
          r = r2;
          r2 = t;
        }
        z.mulTo(r2, g[w], r);
      }
      while (j >= 0 && (e[j] & (1 << i)) == 0)
      {
        z.sqrTo(r, r2);
        t = r;
        r = r2;
        r2 = t;
        if (--i < 0)
        {
          i = this.DB - 1;
          --j;
        }
      }
    }
    return z.revert(r);
  }
  // (public) gcd(this,a) (HAC 14.54)
  function bnGCD(a)
  {
    var x = (this.s < 0) ? this.negate() : this.clone();
    var y = (a.s < 0) ? a.negate() : a.clone();
    if (x.compareTo(y) < 0)
    {
      var t = x;
      x = y;
      y = t;
    }
    var i = x.getLowestSetBit(),
      g = y.getLowestSetBit();
    if (g < 0) return x;
    if (i < g) g = i;
    if (g > 0)
    {
      x.rShiftTo(g, x);
      y.rShiftTo(g, y);
    }
    while (x.signum() > 0)
    {
      if ((i = x.getLowestSetBit()) > 0) x.rShiftTo(i, x);
      if ((i = y.getLowestSetBit()) > 0) y.rShiftTo(i, y);
      if (x.compareTo(y) >= 0)
      {
        x.subTo(y, x);
        x.rShiftTo(1, x);
      }
      else
      {
        y.subTo(x, y);
        y.rShiftTo(1, y);
      }
    }
    if (g > 0) y.lShiftTo(g, y);
    return y;
  }
  // (protected) this % n, n < 2^26
  function bnpModInt(n)
  {
    if (n <= 0) return 0;
    var d = this.DV % n,
      r = (this.s < 0) ? n - 1 : 0;
    if (this.t > 0)
      if (d == 0) r = this[0] % n;
      else
        for (var i = this.t - 1; i >= 0; --i) r = (d * r + this[i]) % n;
    return r;
  }
  // (public) 1/this % m (HAC 14.61)
  function bnModInverse(m)
  {
    var ac = m.isEven();
    if ((this.isEven() && ac) || m.signum() == 0) return BigInteger.ZERO;
    var u = m.clone(),
      v = this.clone();
    var a = nbv(1),
      b = nbv(0),
      c = nbv(0),
      d = nbv(1);
    while (u.signum() != 0)
    {
      while (u.isEven())
      {
        u.rShiftTo(1, u);
        if (ac)
        {
          if (!a.isEven() || !b.isEven())
          {
            a.addTo(this, a);
            b.subTo(m, b);
          }
          a.rShiftTo(1, a);
        }
        else if (!b.isEven()) b.subTo(m, b);
        b.rShiftTo(1, b);
      }
      while (v.isEven())
      {
        v.rShiftTo(1, v);
        if (ac)
        {
          if (!c.isEven() || !d.isEven())
          {
            c.addTo(this, c);
            d.subTo(m, d);
          }
          c.rShiftTo(1, c);
        }
        else if (!d.isEven()) d.subTo(m, d);
        d.rShiftTo(1, d);
      }
      if (u.compareTo(v) >= 0)
      {
        u.subTo(v, u);
        if (ac) a.subTo(c, a);
        b.subTo(d, b);
      }
      else
      {
        v.subTo(u, v);
        if (ac) c.subTo(a, c);
        d.subTo(b, d);
      }
    }
    if (v.compareTo(BigInteger.ONE) != 0) return BigInteger.ZERO;
    if (d.compareTo(m) >= 0) return d.subtract(m);
    if (d.signum() < 0) d.addTo(m, d);
    else return d;
    if (d.signum() < 0) return d.add(m);
    else return d;
  }
  var lowprimes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97, 101, 103, 107, 109, 113, 127, 131, 137, 139, 149, 151, 157, 163, 167, 173, 179, 181, 191, 193, 197, 199, 211, 223, 227, 229, 233, 239, 241, 251, 257, 263, 269, 271, 277, 281, 283, 293, 307, 311, 313, 317, 331, 337, 347, 349, 353, 359, 367, 373, 379, 383, 389, 397, 401, 409, 419, 421, 431, 433, 439, 443, 449, 457, 461, 463, 467, 479, 487, 491, 499, 503, 509, 521, 523, 541, 547, 557, 563, 569, 571, 577, 587, 593, 599, 601, 607, 613, 617, 619, 631, 641, 643, 647, 653, 659, 661, 673, 677, 683, 691, 701, 709, 719, 727, 733, 739, 743, 751, 757, 761, 769, 773, 787, 797, 809, 811, 821, 823, 827, 829, 839, 853, 857, 859, 863, 877, 881, 883, 887, 907, 911, 919, 929, 937, 941, 947, 953, 967, 971, 977, 983, 991, 997];
  var lplim = (1 << 26) / lowprimes[lowprimes.length - 1];
  // (public) test primality with certainty >= 1-.5^t
  function bnIsProbablePrime(t)
  {
    var i, x = this.abs();
    if (x.t == 1 && x[0] <= lowprimes[lowprimes.length - 1])
    {
      for (i = 0; i < lowprimes.length; ++i)
        if (x[0] == lowprimes[i]) return true;
      return false;
    }
    if (x.isEven()) return false;
    i = 1;
    while (i < lowprimes.length)
    {
      var m = lowprimes[i],
        j = i + 1;
      while (j < lowprimes.length && m < lplim) m *= lowprimes[j++];
      m = x.modInt(m);
      while (i < j)
        if (m % lowprimes[i++] == 0) return false;
    }
    return x.millerRabin(t);
  }
  // (protected) true if probably prime (HAC 4.24, Miller-Rabin)
  function bnpMillerRabin(t)
  {
    var n1 = this.subtract(BigInteger.ONE);
    var k = n1.getLowestSetBit();
    if (k <= 0) return false;
    var r = n1.shiftRight(k);
    t = (t + 1) >> 1;
    if (t > lowprimes.length) t = lowprimes.length;
    var a = nbi();
    for (var i = 0; i < t; ++i)
    {
      //Pick bases at random, instead of starting at 2
      a.fromInt(lowprimes[Math.floor(Math.random() * lowprimes.length)]);
      var y = a.modPow(r, this);
      if (y.compareTo(BigInteger.ONE) != 0 && y.compareTo(n1) != 0)
      {
        var j = 1;
        while (j++ < k && y.compareTo(n1) != 0)
        {
          y = y.modPowInt(2, this);
          if (y.compareTo(BigInteger.ONE) == 0) return false;
        }
        if (y.compareTo(n1) != 0) return false;
      }
    }
    return true;
  }
  // protected
  BigInteger.prototype.chunkSize = bnpChunkSize;
  BigInteger.prototype.toRadix = bnpToRadix;
  BigInteger.prototype.fromRadix = bnpFromRadix;
  BigInteger.prototype.fromNumber = bnpFromNumber;
  BigInteger.prototype.bitwiseTo = bnpBitwiseTo;
  BigInteger.prototype.changeBit = bnpChangeBit;
  BigInteger.prototype.addTo = bnpAddTo;
  BigInteger.prototype.dMultiply = bnpDMultiply;
  BigInteger.prototype.dAddOffset = bnpDAddOffset;
  BigInteger.prototype.multiplyLowerTo = bnpMultiplyLowerTo;
  BigInteger.prototype.multiplyUpperTo = bnpMultiplyUpperTo;
  BigInteger.prototype.modInt = bnpModInt;
  BigInteger.prototype.millerRabin = bnpMillerRabin;
  // public
  BigInteger.prototype.clone = bnClone;
  BigInteger.prototype.intValue = bnIntValue;
  BigInteger.prototype.byteValue = bnByteValue;
  BigInteger.prototype.shortValue = bnShortValue;
  BigInteger.prototype.signum = bnSigNum;
  BigInteger.prototype.toByteArray = bnToByteArray;
  BigInteger.prototype.equals = bnEquals;
  BigInteger.prototype.min = bnMin;
  BigInteger.prototype.max = bnMax;
  BigInteger.prototype.and = bnAnd;
  BigInteger.prototype.or = bnOr;
  BigInteger.prototype.xor = bnXor;
  BigInteger.prototype.andNot = bnAndNot;
  BigInteger.prototype.not = bnNot;
  BigInteger.prototype.shiftLeft = bnShiftLeft;
  BigInteger.prototype.shiftRight = bnShiftRight;
  BigInteger.prototype.getLowestSetBit = bnGetLowestSetBit;
  BigInteger.prototype.bitCount = bnBitCount;
  BigInteger.prototype.testBit = bnTestBit;
  BigInteger.prototype.setBit = bnSetBit;
  BigInteger.prototype.clearBit = bnClearBit;
  BigInteger.prototype.flipBit = bnFlipBit;
  BigInteger.prototype.add = bnAdd;
  BigInteger.prototype.subtract = bnSubtract;
  BigInteger.prototype.multiply = bnMultiply;
  BigInteger.prototype.divide = bnDivide;
  BigInteger.prototype.remainder = bnRemainder;
  BigInteger.prototype.divideAndRemainder = bnDivideAndRemainder;
  BigInteger.prototype.modPow = bnModPow;
  BigInteger.prototype.modInverse = bnModInverse;
  BigInteger.prototype.pow = bnPow;
  BigInteger.prototype.gcd = bnGCD;
  BigInteger.prototype.isProbablePrime = bnIsProbablePrime;
  // JSBN-specific extension
  BigInteger.prototype.square = bnSquare;
  var Int128 = BigInteger;
  // BigInteger interfaces not implemented in jsbn:
  // BigInteger(int signum, byte[] magnitude)
  // double doubleValue()
  // float floatValue()
  // int hashCode()
  // long longValue()
  // static BigInteger valueOf(long val)
  // Helper functions to make BigInteger functions callable with two parameters
  // as in original C# Clipper
  Int128.prototype.IsNegative = function ()
  {
    if (this.compareTo(Int128.ZERO) == -1) return true;
    else return false;
  };
  Int128.op_Equality = function (val1, val2)
  {
    if (val1.compareTo(val2) == 0) return true;
    else return false;
  };
  Int128.op_Inequality = function (val1, val2)
  {
    if (val1.compareTo(val2) != 0) return true;
    else return false;
  };
  Int128.op_GreaterThan = function (val1, val2)
  {
    if (val1.compareTo(val2) > 0) return true;
    else return false;
  };
  Int128.op_LessThan = function (val1, val2)
  {
    if (val1.compareTo(val2) < 0) return true;
    else return false;
  };
  Int128.op_Addition = function (lhs, rhs)
  {
    return new Int128(lhs).add(new Int128(rhs));
  };
  Int128.op_Subtraction = function (lhs, rhs)
  {
    return new Int128(lhs).subtract(new Int128(rhs));
  };
  Int128.Int128Mul = function (lhs, rhs)
  {
    return new Int128(lhs).multiply(new Int128(rhs));
  };
  Int128.op_Division = function (lhs, rhs)
  {
    return lhs.divide(rhs);
  };
  Int128.prototype.ToDouble = function ()
  {
    return parseFloat(this.toString()); // This could be something faster
  };
  // end of Int128 section
  /*
  // Uncomment the following two lines if you want to use Int128 outside ClipperLib
  if (typeof(document) !== "undefined") window.Int128 = Int128;
  else self.Int128 = Int128;
  */


  // ---------------------------------------------
  // Here starts the actual Clipper library:
  // Helper function to support Inheritance in Javascript
	var Inherit = function (ce, ce2)
	{
		var p;
		if (typeof (Object.getOwnPropertyNames) == 'undefined')
		{
			for (p in ce2.prototype)
				if (typeof (ce.prototype[p]) == 'undefined' || ce.prototype[p] == Object.prototype[p]) ce.prototype[p] = ce2.prototype[p];
			for (p in ce2)
				if (typeof (ce[p]) == 'undefined') ce[p] = ce2[p];
			ce.$baseCtor = ce2;
		}
		else
		{
			var props = Object.getOwnPropertyNames(ce2.prototype);
			for (var i = 0; i < props.length; i++)
				if (typeof (Object.getOwnPropertyDescriptor(ce.prototype, props[i])) == 'undefined') Object.defineProperty(ce.prototype, props[i], Object.getOwnPropertyDescriptor(ce2.prototype, props[i]));
			for (p in ce2)
				if (typeof (ce[p]) == 'undefined') ce[p] = ce2[p];
			ce.$baseCtor = ce2;
		}
	};
  ClipperLib.Path = function ()
  {
    return [];
  };
  ClipperLib.Paths = function ()
  {
    return []; // Was previously [[]], but caused problems when pushed
  };
  // Preserves the calling way of original C# Clipper
  // Is essential due to compatibility, because DoublePoint is public class in original C# version
  ClipperLib.DoublePoint = function ()
  {
    var a = arguments;
    this.X = 0;
    this.Y = 0;
    // public DoublePoint(DoublePoint dp)
    // public DoublePoint(IntPoint ip)
    if (a.length == 1)
    {
      this.X = a[0].X;
      this.Y = a[0].Y;
    }
    else if (a.length == 2)
    {
      this.X = a[0];
      this.Y = a[1];
    }
  }; // This is internal faster function when called without arguments
  ClipperLib.DoublePoint0 = function ()
  {
    this.X = 0;
    this.Y = 0;
  };
  // This is internal faster function when called with 1 argument (dp or ip)
  ClipperLib.DoublePoint1 = function (dp)
  {
    this.X = dp.X;
    this.Y = dp.Y;
  };
  // This is internal faster function when called with 2 arguments (x and y)
  ClipperLib.DoublePoint2 = function (x, y)
  {
    this.X = x;
    this.Y = y;
  };
  // PolyTree & PolyNode start
  // -------------------------------
  ClipperLib.PolyNode = function ()
  {
    this.m_Parent = null;
    this.m_polygon = new ClipperLib.Path();
    this.m_Index = 0;
    this.m_jointype = 0;
    this.m_endtype = 0;
    this.m_Childs = [];
    this.IsOpen = false;
  };
  ClipperLib.PolyNode.prototype.IsHoleNode = function ()
  {
    var result = true;
    var node = this.m_Parent;
    while (node !== null)
    {
      result = !result;
      node = node.m_Parent;
    }
    return result;
  };
  ClipperLib.PolyNode.prototype.ChildCount = function ()
  {
    return this.m_Childs.length;
  };
  ClipperLib.PolyNode.prototype.Contour = function ()
  {
    return this.m_polygon;
  };
  ClipperLib.PolyNode.prototype.AddChild = function (Child)
  {
    var cnt = this.m_Childs.length;
    this.m_Childs.push(Child);
    Child.m_Parent = this;
    Child.m_Index = cnt;
  };
  ClipperLib.PolyNode.prototype.GetNext = function ()
  {
    if (this.m_Childs.length > 0)
      return this.m_Childs[0];
    else
      return this.GetNextSiblingUp();
  };
  ClipperLib.PolyNode.prototype.GetNextSiblingUp = function ()
  {
    if (this.m_Parent === null)
      return null;
    else if (this.m_Index == this.m_Parent.m_Childs.length - 1)
      return this.m_Parent.GetNextSiblingUp();
    else
      return this.m_Parent.m_Childs[this.m_Index + 1];
  };
  ClipperLib.PolyNode.prototype.Childs = function ()
  {
    return this.m_Childs;
  };
  ClipperLib.PolyNode.prototype.Parent = function ()
  {
    return this.m_Parent;
  };
  ClipperLib.PolyNode.prototype.IsHole = function ()
  {
    return this.IsHoleNode();
  };
  // PolyTree : PolyNode
  ClipperLib.PolyTree = function ()
  {
    this.m_AllPolys = [];
    ClipperLib.PolyNode.call(this);
  };
  ClipperLib.PolyTree.prototype.Clear = function ()
  {
    for (var i = 0, ilen = this.m_AllPolys.length; i < ilen; i++)
      this.m_AllPolys[i] = null;
    this.m_AllPolys.length = 0;
    this.m_Childs.length = 0;
  };
  ClipperLib.PolyTree.prototype.GetFirst = function ()
  {
    if (this.m_Childs.length > 0)
      return this.m_Childs[0];
    else
      return null;
  };
  ClipperLib.PolyTree.prototype.Total = function ()
  {
		var result = this.m_AllPolys.length;
		//with negative offsets, ignore the hidden outer polygon ...
		if (result > 0 && this.m_Childs[0] != this.m_AllPolys[0]) result--;
		return result;
  };
  Inherit(ClipperLib.PolyTree, ClipperLib.PolyNode);
  // -------------------------------
  // PolyTree & PolyNode end
  ClipperLib.Math_Abs_Int64 = ClipperLib.Math_Abs_Int32 = ClipperLib.Math_Abs_Double = function (a)
  {
    return Math.abs(a);
  };
  ClipperLib.Math_Max_Int32_Int32 = function (a, b)
  {
    return Math.max(a, b);
  };
  /*
  -----------------------------------
  cast_32 speedtest: http://jsperf.com/truncate-float-to-integer/2
  -----------------------------------
  */
  if (browser.msie || browser.opera || browser.safari) ClipperLib.Cast_Int32 = function (a)
  {
    return a | 0;
  };
  else ClipperLib.Cast_Int32 = function (a)
  { // eg. browser.chrome || browser.chromium || browser.firefox
    return~~ a;
  };
  /*
  --------------------------
  cast_64 speedtests: http://jsperf.com/truncate-float-to-integer
  Chrome: bitwise_not_floor
  Firefox17: toInteger (typeof test)
  IE9: bitwise_or_floor
  IE7 and IE8: to_parseint
  Chromium: to_floor_or_ceil
  Firefox3: to_floor_or_ceil
  Firefox15: to_floor_or_ceil
  Opera: to_floor_or_ceil
  Safari: to_floor_or_ceil
  --------------------------
  */
  if (browser.chrome) ClipperLib.Cast_Int64 = function (a)
  {
    if (a < -2147483648 || a > 2147483647)
      return a < 0 ? Math.ceil(a) : Math.floor(a);
    else return~~ a;
  };
  else if (browser.firefox && typeof (Number.toInteger) == "function") ClipperLib.Cast_Int64 = function (a)
  {
    return Number.toInteger(a);
  };
  else if (browser.msie7 || browser.msie8) ClipperLib.Cast_Int64 = function (a)
  {
    return parseInt(a, 10);
  };
  else if (browser.msie) ClipperLib.Cast_Int64 = function (a)
  {
    if (a < -2147483648 || a > 2147483647)
      return a < 0 ? Math.ceil(a) : Math.floor(a);
    return a | 0;
  };
  // eg. browser.chromium || browser.firefox || browser.opera || browser.safari
  else ClipperLib.Cast_Int64 = function (a)
  {
    return a < 0 ? Math.ceil(a) : Math.floor(a);
  };
  ClipperLib.Clear = function (a)
  {
    a.length = 0;
  };
  //ClipperLib.MaxSteps = 64; // How many steps at maximum in arc in BuildArc() function
  ClipperLib.PI = 3.141592653589793;
  ClipperLib.PI2 = 2 * 3.141592653589793;
  ClipperLib.IntPoint = function ()
  {
    var a = arguments,
      alen = a.length;
    this.X = 0;
    this.Y = 0;
    if (ClipperLib.use_xyz)
    {
      this.Z = 0;
      if (alen == 3) // public IntPoint(cInt x, cInt y, cInt z = 0)
      {
        this.X = a[0];
        this.Y = a[1];
        this.Z = a[2];
      }
      else if (alen == 2) // public IntPoint(cInt x, cInt y)
      {
        this.X = a[0];
        this.Y = a[1];
        this.Z = 0;
      }
      else if (alen == 1)
      {
        if (a[0] instanceof ClipperLib.DoublePoint) // public IntPoint(DoublePoint dp)
        {
          var dp = a[0];
          this.X = ClipperLib.Clipper.Round(dp.X);
          this.Y = ClipperLib.Clipper.Round(dp.Y);
          this.Z = 0;
        }
        else // public IntPoint(IntPoint pt)
        {
          var pt = a[0];
          if (typeof (pt.Z) == "undefined") pt.Z = 0;
          this.X = pt.X;
          this.Y = pt.Y;
          this.Z = pt.Z;
        }
      }
      else // public IntPoint()
      {
        this.X = 0;
        this.Y = 0;
        this.Z = 0;
      }
    }
    else // if (!ClipperLib.use_xyz)
    {
      if (alen == 2) // public IntPoint(cInt X, cInt Y)
      {
        this.X = a[0];
        this.Y = a[1];
      }
      else if (alen == 1)
      {
        if (a[0] instanceof ClipperLib.DoublePoint) // public IntPoint(DoublePoint dp)
        {
          var dp = a[0];
          this.X = ClipperLib.Clipper.Round(dp.X);
          this.Y = ClipperLib.Clipper.Round(dp.Y);
        }
        else // public IntPoint(IntPoint pt)
        {
          var pt = a[0];
          this.X = pt.X;
          this.Y = pt.Y;
        }
      }
      else // public IntPoint(IntPoint pt)
      {
        this.X = 0;
        this.Y = 0;
      }
    }
  };
  ClipperLib.IntPoint.op_Equality = function (a, b)
  {
    //return a == b;
    return a.X == b.X && a.Y == b.Y;
  };
  ClipperLib.IntPoint.op_Inequality = function (a, b)
  {
    //return a != b;
    return a.X != b.X || a.Y != b.Y;
  };
  /*
  ClipperLib.IntPoint.prototype.Equals = function (obj)
  {
    if (obj === null)
        return false;
    if (obj instanceof ClipperLib.IntPoint)
    {
        var a = Cast(obj, ClipperLib.IntPoint);
        return (this.X == a.X) && (this.Y == a.Y);
    }
    else
        return false;
  };
*/
  if (ClipperLib.use_xyz)
  {
    ClipperLib.IntPoint0 = function ()
    {
      this.X = 0;
      this.Y = 0;
      this.Z = 0;
    };
    ClipperLib.IntPoint1 = function (pt)
    {
      this.X = pt.X;
      this.Y = pt.Y;
      this.Z = pt.Z;
    };
    ClipperLib.IntPoint1dp = function (dp)
    {
      this.X = ClipperLib.Clipper.Round(dp.X);
      this.Y = ClipperLib.Clipper.Round(dp.Y);
      this.Z = 0;
    };
    ClipperLib.IntPoint2 = function (x, y)
    {
      this.X = x;
      this.Y = y;
      this.Z = 0;
    };
    ClipperLib.IntPoint3 = function (x, y, z)
    {
      this.X = x;
      this.Y = y;
      this.Z = z;
    };
  }
  else // if (!ClipperLib.use_xyz)
  {
    ClipperLib.IntPoint0 = function ()
    {
      this.X = 0;
      this.Y = 0;
    };
    ClipperLib.IntPoint1 = function (pt)
    {
      this.X = pt.X;
      this.Y = pt.Y;
    };
    ClipperLib.IntPoint1dp = function (dp)
    {
      this.X = ClipperLib.Clipper.Round(dp.X);
      this.Y = ClipperLib.Clipper.Round(dp.Y);
    };
    ClipperLib.IntPoint2 = function (x, y)
    {
      this.X = x;
      this.Y = y;
    };
  }
  ClipperLib.IntRect = function ()
  {
    var a = arguments,
      alen = a.length;
    if (alen == 4) // function (l, t, r, b)
    {
      this.left = a[0];
      this.top = a[1];
      this.right = a[2];
      this.bottom = a[3];
    }
    else if (alen == 1) // function (ir)
    {
      this.left = ir.left;
      this.top = ir.top;
      this.right = ir.right;
      this.bottom = ir.bottom;
    }
    else // function ()
    {
      this.left = 0;
      this.top = 0;
      this.right = 0;
      this.bottom = 0;
    }
  };
  ClipperLib.IntRect0 = function ()
  {
    this.left = 0;
    this.top = 0;
    this.right = 0;
    this.bottom = 0;
  };
  ClipperLib.IntRect1 = function (ir)
  {
    this.left = ir.left;
    this.top = ir.top;
    this.right = ir.right;
    this.bottom = ir.bottom;
  };
  ClipperLib.IntRect4 = function (l, t, r, b)
  {
    this.left = l;
    this.top = t;
    this.right = r;
    this.bottom = b;
  };
  ClipperLib.ClipType = {
    ctIntersection: 0,
    ctUnion: 1,
    ctDifference: 2,
    ctXor: 3
  };
  ClipperLib.PolyType = {
    ptSubject: 0,
    ptClip: 1
  };
  ClipperLib.PolyFillType = {
    pftEvenOdd: 0,
    pftNonZero: 1,
    pftPositive: 2,
    pftNegative: 3
  };
  ClipperLib.JoinType = {
    jtSquare: 0,
    jtRound: 1,
    jtMiter: 2
  };
  ClipperLib.EndType = {
    etOpenSquare: 0,
    etOpenRound: 1,
    etOpenButt: 2,
    etClosedLine: 3,
    etClosedPolygon: 4
  };
  ClipperLib.EdgeSide = {
    esLeft: 0,
    esRight: 1
  };
  ClipperLib.Direction = {
    dRightToLeft: 0,
    dLeftToRight: 1
  };
  ClipperLib.TEdge = function ()
  {
    this.Bot = new ClipperLib.IntPoint();
    this.Curr = new ClipperLib.IntPoint();
    this.Top = new ClipperLib.IntPoint();
    this.Delta = new ClipperLib.IntPoint();
    this.Dx = 0;
    this.PolyTyp = ClipperLib.PolyType.ptSubject;
    this.Side = ClipperLib.EdgeSide.esLeft;
    this.WindDelta = 0;
    this.WindCnt = 0;
    this.WindCnt2 = 0;
    this.OutIdx = 0;
    this.Next = null;
    this.Prev = null;
    this.NextInLML = null;
    this.NextInAEL = null;
    this.PrevInAEL = null;
    this.NextInSEL = null;
    this.PrevInSEL = null;
  };
  ClipperLib.IntersectNode = function ()
  {
    this.Edge1 = null;
    this.Edge2 = null;
    this.Pt = new ClipperLib.IntPoint();
  };
  ClipperLib.MyIntersectNodeSort = function () {};
  ClipperLib.MyIntersectNodeSort.Compare = function (node1, node2)
  {
    var i = node2.Pt.Y - node1.Pt.Y;
    if (i > 0) return 1;
    else if (i < 0) return -1;
    else return 0;
  };

  ClipperLib.LocalMinima = function ()
  {
    this.Y = 0;
    this.LeftBound = null;
    this.RightBound = null;
    this.Next = null;
  };
  ClipperLib.Scanbeam = function ()
  {
    this.Y = 0;
    this.Next = null;
  };
  ClipperLib.OutRec = function ()
  {
    this.Idx = 0;
    this.IsHole = false;
    this.IsOpen = false;
    this.FirstLeft = null;
    this.Pts = null;
    this.BottomPt = null;
    this.PolyNode = null;
  };
  ClipperLib.OutPt = function ()
  {
    this.Idx = 0;
    this.Pt = new ClipperLib.IntPoint();
    this.Next = null;
    this.Prev = null;
  };
  ClipperLib.Join = function ()
  {
    this.OutPt1 = null;
    this.OutPt2 = null;
    this.OffPt = new ClipperLib.IntPoint();
  };
  ClipperLib.ClipperBase = function ()
  {
    this.m_MinimaList = null;
    this.m_CurrentLM = null;
    this.m_edges = new Array();
    this.m_UseFullRange = false;
    this.m_HasOpenPaths = false;
    this.PreserveCollinear = false;
    this.m_MinimaList = null;
    this.m_CurrentLM = null;
    this.m_UseFullRange = false;
    this.m_HasOpenPaths = false;
  };
  // Ranges are in original C# too high for Javascript (in current state 2013 september):
  // protected const double horizontal = -3.4E+38;
  // internal const cInt loRange = 0x3FFFFFFF; // = 1073741823 = sqrt(2^63 -1)/2
  // internal const cInt hiRange = 0x3FFFFFFFFFFFFFFFL; // = 4611686018427387903 = sqrt(2^127 -1)/2
  // So had to adjust them to more suitable for Javascript.
  // If JS some day supports truly 64-bit integers, then these ranges can be as in C#
  // and biginteger library can be more simpler (as then 128bit can be represented as two 64bit numbers)
  ClipperLib.ClipperBase.horizontal = -9007199254740992; //-2^53
  ClipperLib.ClipperBase.Skip = -2;
  ClipperLib.ClipperBase.Unassigned = -1;
  ClipperLib.ClipperBase.tolerance = 1E-20;
	ClipperLib.ClipperBase.loRange = 47453132; // sqrt(2^53 -1)/2
	ClipperLib.ClipperBase.hiRange = 4503599627370495; // sqrt(2^106 -1)/2

  ClipperLib.ClipperBase.near_zero = function (val)
  {
    return (val > -ClipperLib.ClipperBase.tolerance) && (val < ClipperLib.ClipperBase.tolerance);
  };
  ClipperLib.ClipperBase.IsHorizontal = function (e)
  {
    return e.Delta.Y === 0;
  };
  ClipperLib.ClipperBase.prototype.PointIsVertex = function (pt, pp)
  {
    var pp2 = pp;
    do {
      if (ClipperLib.IntPoint.op_Equality(pp2.Pt, pt))
        return true;
      pp2 = pp2.Next;
    }
    while (pp2 != pp)
    return false;
  };
  ClipperLib.ClipperBase.prototype.PointOnLineSegment = function (pt, linePt1, linePt2, UseFullRange)
  {
    if (UseFullRange)
      return ((pt.X == linePt1.X) && (pt.Y == linePt1.Y)) ||
        ((pt.X == linePt2.X) && (pt.Y == linePt2.Y)) ||
        (((pt.X > linePt1.X) == (pt.X < linePt2.X)) &&
        ((pt.Y > linePt1.Y) == (pt.Y < linePt2.Y)) &&
        (Int128.op_Equality(Int128.Int128Mul((pt.X - linePt1.X), (linePt2.Y - linePt1.Y)),
          Int128.Int128Mul((linePt2.X - linePt1.X), (pt.Y - linePt1.Y)))));
    else
      return ((pt.X == linePt1.X) && (pt.Y == linePt1.Y)) || ((pt.X == linePt2.X) && (pt.Y == linePt2.Y)) || (((pt.X > linePt1.X) == (pt.X < linePt2.X)) && ((pt.Y > linePt1.Y) == (pt.Y < linePt2.Y)) && ((pt.X - linePt1.X) * (linePt2.Y - linePt1.Y) == (linePt2.X - linePt1.X) * (pt.Y - linePt1.Y)));
  };
  ClipperLib.ClipperBase.prototype.PointOnPolygon = function (pt, pp, UseFullRange)
  {
    var pp2 = pp;
    while (true)
    {
      if (this.PointOnLineSegment(pt, pp2.Pt, pp2.Next.Pt, UseFullRange))
        return true;
      pp2 = pp2.Next;
      if (pp2 == pp)
        break;
    }
    return false;
  };
  ClipperLib.ClipperBase.prototype.SlopesEqual = ClipperLib.ClipperBase.SlopesEqual = function ()
  {
    var a = arguments,
      alen = a.length;
    var e1, e2, pt1, pt2, pt3, pt4, UseFullRange;
    if (alen == 3) // function (e1, e2, UseFullRange)
    {
      e1 = a[0];
      e2 = a[1];
      UseFullRange = a[2];
      if (UseFullRange)
        return Int128.op_Equality(Int128.Int128Mul(e1.Delta.Y, e2.Delta.X), Int128.Int128Mul(e1.Delta.X, e2.Delta.Y));
      else
        return ClipperLib.Cast_Int64((e1.Delta.Y) * (e2.Delta.X)) == ClipperLib.Cast_Int64((e1.Delta.X) * (e2.Delta.Y));
    }
    else if (alen == 4) // function (pt1, pt2, pt3, UseFullRange)
    {
      pt1 = a[0];
      pt2 = a[1];
      pt3 = a[2];
      UseFullRange = a[3];
      if (UseFullRange)
        return Int128.op_Equality(Int128.Int128Mul(pt1.Y - pt2.Y, pt2.X - pt3.X), Int128.Int128Mul(pt1.X - pt2.X, pt2.Y - pt3.Y));
      else
        return ClipperLib.Cast_Int64((pt1.Y - pt2.Y) * (pt2.X - pt3.X)) - ClipperLib.Cast_Int64((pt1.X - pt2.X) * (pt2.Y - pt3.Y)) === 0;
    }
    else // function (pt1, pt2, pt3, pt4, UseFullRange)
    {
      pt1 = a[0];
      pt2 = a[1];
      pt3 = a[2];
      pt4 = a[3];
      UseFullRange = a[4];
      if (UseFullRange)
        return Int128.op_Equality(Int128.Int128Mul(pt1.Y - pt2.Y, pt3.X - pt4.X), Int128.Int128Mul(pt1.X - pt2.X, pt3.Y - pt4.Y));
      else
        return ClipperLib.Cast_Int64((pt1.Y - pt2.Y) * (pt3.X - pt4.X)) - ClipperLib.Cast_Int64((pt1.X - pt2.X) * (pt3.Y - pt4.Y)) === 0;
    }
  };
  ClipperLib.ClipperBase.SlopesEqual3 = function (e1, e2, UseFullRange)
  {
    if (UseFullRange)
      return Int128.op_Equality(Int128.Int128Mul(e1.Delta.Y, e2.Delta.X), Int128.Int128Mul(e1.Delta.X, e2.Delta.Y));
    else
      return ClipperLib.Cast_Int64((e1.Delta.Y) * (e2.Delta.X)) == ClipperLib.Cast_Int64((e1.Delta.X) * (e2.Delta.Y));
  };
  ClipperLib.ClipperBase.SlopesEqual4 = function (pt1, pt2, pt3, UseFullRange)
  {
    if (UseFullRange)
      return Int128.op_Equality(Int128.Int128Mul(pt1.Y - pt2.Y, pt2.X - pt3.X), Int128.Int128Mul(pt1.X - pt2.X, pt2.Y - pt3.Y));
    else
      return ClipperLib.Cast_Int64((pt1.Y - pt2.Y) * (pt2.X - pt3.X)) - ClipperLib.Cast_Int64((pt1.X - pt2.X) * (pt2.Y - pt3.Y)) === 0;
  };
  ClipperLib.ClipperBase.SlopesEqual5 = function (pt1, pt2, pt3, pt4, UseFullRange)
  {
    if (UseFullRange)
      return Int128.op_Equality(Int128.Int128Mul(pt1.Y - pt2.Y, pt3.X - pt4.X), Int128.Int128Mul(pt1.X - pt2.X, pt3.Y - pt4.Y));
    else
      return ClipperLib.Cast_Int64((pt1.Y - pt2.Y) * (pt3.X - pt4.X)) - ClipperLib.Cast_Int64((pt1.X - pt2.X) * (pt3.Y - pt4.Y)) === 0;
  };
  ClipperLib.ClipperBase.prototype.Clear = function ()
  {
    this.DisposeLocalMinimaList();
    for (var i = 0, ilen = this.m_edges.length; i < ilen; ++i)
    {
      for (var j = 0, jlen = this.m_edges[i].length; j < jlen; ++j)
        this.m_edges[i][j] = null;
      ClipperLib.Clear(this.m_edges[i]);
    }
    ClipperLib.Clear(this.m_edges);
    this.m_UseFullRange = false;
    this.m_HasOpenPaths = false;
  };
  ClipperLib.ClipperBase.prototype.DisposeLocalMinimaList = function ()
  {
    while (this.m_MinimaList !== null)
    {
      var tmpLm = this.m_MinimaList.Next;
      this.m_MinimaList = null;
      this.m_MinimaList = tmpLm;
    }
    this.m_CurrentLM = null;
  };
  ClipperLib.ClipperBase.prototype.RangeTest = function (Pt, useFullRange)
  {
    if (useFullRange.Value)
    {
      if (Pt.X > ClipperLib.ClipperBase.hiRange || Pt.Y > ClipperLib.ClipperBase.hiRange || -Pt.X > ClipperLib.ClipperBase.hiRange || -Pt.Y > ClipperLib.ClipperBase.hiRange)
        ClipperLib.Error("Coordinate outside allowed range in RangeTest().");
    }
    else if (Pt.X > ClipperLib.ClipperBase.loRange || Pt.Y > ClipperLib.ClipperBase.loRange || -Pt.X > ClipperLib.ClipperBase.loRange || -Pt.Y > ClipperLib.ClipperBase.loRange)
    {
      useFullRange.Value = true;
      this.RangeTest(Pt, useFullRange);
    }
  };
  ClipperLib.ClipperBase.prototype.InitEdge = function (e, eNext, ePrev, pt)
  {
    e.Next = eNext;
    e.Prev = ePrev;
    //e.Curr = pt;
    e.Curr.X = pt.X;
    e.Curr.Y = pt.Y;
    if(ClipperLib.use_xyz) e.Curr.Z = pt.Z;
    e.OutIdx = -1;
  };
  ClipperLib.ClipperBase.prototype.InitEdge2 = function (e, polyType)
  {
    if (e.Curr.Y >= e.Next.Curr.Y)
    {
      //e.Bot = e.Curr;
      e.Bot.X = e.Curr.X;
      e.Bot.Y = e.Curr.Y;
    	if(ClipperLib.use_xyz) e.Bot.Z = e.Curr.Z;
      //e.Top = e.Next.Curr;
      e.Top.X = e.Next.Curr.X;
      e.Top.Y = e.Next.Curr.Y;
      if(ClipperLib.use_xyz) e.Top.Z = e.Next.Curr.Z;
    }
    else
    {
      //e.Top = e.Curr;
      e.Top.X = e.Curr.X;
      e.Top.Y = e.Curr.Y;
    	if(ClipperLib.use_xyz) e.Top.Z = e.Curr.Z;
      //e.Bot = e.Next.Curr;
      e.Bot.X = e.Next.Curr.X;
      e.Bot.Y = e.Next.Curr.Y;
    	if(ClipperLib.use_xyz) e.Bot.Z = e.Next.Curr.Z;
    }
    this.SetDx(e);
    e.PolyTyp = polyType;
  };
  ClipperLib.ClipperBase.prototype.FindNextLocMin = function (E)
  {
    var E2;
    for (;;)
    {
      while (ClipperLib.IntPoint.op_Inequality(E.Bot, E.Prev.Bot) || ClipperLib.IntPoint.op_Equality(E.Curr, E.Top))
        E = E.Next;
      if (E.Dx != ClipperLib.ClipperBase.horizontal && E.Prev.Dx != ClipperLib.ClipperBase.horizontal)
        break;
      while (E.Prev.Dx == ClipperLib.ClipperBase.horizontal)
        E = E.Prev;
      E2 = E;
      while (E.Dx == ClipperLib.ClipperBase.horizontal)
        E = E.Next;
      if (E.Top.Y == E.Prev.Bot.Y)
        continue;
      //ie just an intermediate horz.
      if (E2.Prev.Bot.X < E.Bot.X)
        E = E2;
      break;
    }
    return E;
  };
  ClipperLib.ClipperBase.prototype.ProcessBound = function (E, LeftBoundIsForward)
  {
    var EStart;
    var Result = E;
    var Horz;

      if (Result.OutIdx == ClipperLib.ClipperBase.Skip)
      {
        //check if there are edges beyond the skip edge in the bound and if so
        //create another LocMin and calling ProcessBound once more ...
        E = Result;
        if (LeftBoundIsForward)
        {
          while (E.Top.Y == E.Next.Bot.Y) E = E.Next;
          while (E != Result && E.Dx == ClipperLib.ClipperBase.horizontal) E = E.Prev;
        }
        else
        {
          while (E.Top.Y == E.Prev.Bot.Y) E = E.Prev;
          while (E != Result && E.Dx == ClipperLib.ClipperBase.horizontal) E = E.Next;
        }
        if (E == Result)
        {
          if (LeftBoundIsForward) Result = E.Next;
          else Result = E.Prev;
        }
        else
        {
          //there are more edges in the bound beyond result starting with E
          if (LeftBoundIsForward)
            E = Result.Next;
          else
            E = Result.Prev;
          var locMin = new ClipperLib.LocalMinima();
          locMin.Next = null;
          locMin.Y = E.Bot.Y;
          locMin.LeftBound = null;
          locMin.RightBound = E;
          E.WindDelta = 0;
          Result = this.ProcessBound(E, LeftBoundIsForward);
          this.InsertLocalMinima(locMin);
        }
        return Result;
      }

      if (E.Dx == ClipperLib.ClipperBase.horizontal)
      {
        //We need to be careful with open paths because this may not be a
        //true local minima (ie E may be following a skip edge).
        //Also, consecutive horz. edges may start heading left before going right.
        if (LeftBoundIsForward) EStart = E.Prev;
        else EStart = E.Next;
        if (EStart.OutIdx != ClipperLib.ClipperBase.Skip)
        {
          if (EStart.Dx == ClipperLib.ClipperBase.horizontal) //ie an adjoining horizontal skip edge
          {
            if (EStart.Bot.X != E.Bot.X && EStart.Top.X != E.Bot.X)
              this.ReverseHorizontal(E);
          }
          else if (EStart.Bot.X != E.Bot.X)
            this.ReverseHorizontal(E);
        }
      }

      EStart = E;
      if (LeftBoundIsForward)
      {
        while (Result.Top.Y == Result.Next.Bot.Y && Result.Next.OutIdx != ClipperLib.ClipperBase.Skip)
          Result = Result.Next;
        if (Result.Dx == ClipperLib.ClipperBase.horizontal && Result.Next.OutIdx != ClipperLib.ClipperBase.Skip)
        {
          //nb: at the top of a bound, horizontals are added to the bound
          //only when the preceding edge attaches to the horizontal's left vertex
          //unless a Skip edge is encountered when that becomes the top divide
          Horz = Result;
          while (Horz.Prev.Dx == ClipperLib.ClipperBase.horizontal)
            Horz = Horz.Prev;
          if (Horz.Prev.Top.X == Result.Next.Top.X)
          {
            if (!LeftBoundIsForward)
              Result = Horz.Prev;
          }
          else if (Horz.Prev.Top.X > Result.Next.Top.X)
            Result = Horz.Prev;
        }
        while (E != Result)
        {
          E.NextInLML = E.Next;
          if (E.Dx == ClipperLib.ClipperBase.horizontal && E != EStart && E.Bot.X != E.Prev.Top.X)
            this.ReverseHorizontal(E);
          E = E.Next;
        }
        if (E.Dx == ClipperLib.ClipperBase.horizontal && E != EStart && E.Bot.X != E.Prev.Top.X)
          this.ReverseHorizontal(E);
        Result = Result.Next;
        //move to the edge just beyond current bound
      }
      else
      {
        while (Result.Top.Y == Result.Prev.Bot.Y && Result.Prev.OutIdx != ClipperLib.ClipperBase.Skip)
          Result = Result.Prev;
        if (Result.Dx == ClipperLib.ClipperBase.horizontal && Result.Prev.OutIdx != ClipperLib.ClipperBase.Skip)
        {
          Horz = Result;
          while (Horz.Next.Dx == ClipperLib.ClipperBase.horizontal)
            Horz = Horz.Next;
          if (Horz.Next.Top.X == Result.Prev.Top.X)
          {
            if (!LeftBoundIsForward)
              Result = Horz.Next;
          }
          else if (Horz.Next.Top.X > Result.Prev.Top.X)
            Result = Horz.Next;
        }
        while (E != Result)
        {
          E.NextInLML = E.Prev;
          if (E.Dx == ClipperLib.ClipperBase.horizontal && E != EStart && E.Bot.X != E.Next.Top.X)
            this.ReverseHorizontal(E);
          E = E.Prev;
        }
        if (E.Dx == ClipperLib.ClipperBase.horizontal && E != EStart && E.Bot.X != E.Next.Top.X)
          this.ReverseHorizontal(E);
        Result = Result.Prev;
        //move to the edge just beyond current bound
      }

    return Result;
  };

  ClipperLib.ClipperBase.prototype.AddPath = function (pg, polyType, Closed)
  {
    if (ClipperLib.use_lines)
    {
      if (!Closed && polyType == ClipperLib.PolyType.ptClip)
        ClipperLib.Error("AddPath: Open paths must be subject.");
    }
    else
    {
      if (!Closed)
        ClipperLib.Error("AddPath: Open paths have been disabled.");
    }
    var highI = pg.length - 1;
    if (Closed)
      while (highI > 0 && (ClipperLib.IntPoint.op_Equality(pg[highI], pg[0])))
    --highI;
    while (highI > 0 && (ClipperLib.IntPoint.op_Equality(pg[highI], pg[highI - 1])))
    --highI;
    if ((Closed && highI < 2) || (!Closed && highI < 1))
      return false;
    //create a new edge array ...
    var edges = new Array();
    for (var i = 0; i <= highI; i++)
      edges.push(new ClipperLib.TEdge());
    var IsFlat = true;
    //1. Basic (first) edge initialization ...

    //edges[1].Curr = pg[1];
    edges[1].Curr.X = pg[1].X;
    edges[1].Curr.Y = pg[1].Y;
    if(ClipperLib.use_xyz) edges[1].Curr.Z = pg[1].Z;

    var $1 = {Value: this.m_UseFullRange};
    this.RangeTest(pg[0], $1);
    this.m_UseFullRange = $1.Value;

    $1.Value = this.m_UseFullRange;
    this.RangeTest(pg[highI], $1);
    this.m_UseFullRange = $1.Value;

    this.InitEdge(edges[0], edges[1], edges[highI], pg[0]);
    this.InitEdge(edges[highI], edges[0], edges[highI - 1], pg[highI]);
    for (var i = highI - 1; i >= 1; --i)
    {
      $1.Value = this.m_UseFullRange;
      this.RangeTest(pg[i], $1);
      this.m_UseFullRange = $1.Value;

      this.InitEdge(edges[i], edges[i + 1], edges[i - 1], pg[i]);
    }

    var eStart = edges[0];
    //2. Remove duplicate vertices, and (when closed) collinear edges ...
    var E = eStart,
      eLoopStop = eStart;
    for (;;)
    {
    //console.log(E.Next, eStart);
    	//nb: allows matching start and end points when not Closed ...
      if (E.Curr == E.Next.Curr && (Closed || E.Next != eStart))
      {
        if (E == E.Next)
          break;
        if (E == eStart)
          eStart = E.Next;
        E = this.RemoveEdge(E);
        eLoopStop = E;
        continue;
      }
      if (E.Prev == E.Next)
        break;
      else if (Closed && ClipperLib.ClipperBase.SlopesEqual(E.Prev.Curr, E.Curr, E.Next.Curr, this.m_UseFullRange) && (!this.PreserveCollinear || !this.Pt2IsBetweenPt1AndPt3(E.Prev.Curr, E.Curr, E.Next.Curr)))
      {
        //Collinear edges are allowed for open paths but in closed paths
        //the default is to merge adjacent collinear edges into a single edge.
        //However, if the PreserveCollinear property is enabled, only overlapping
        //collinear edges (ie spikes) will be removed from closed paths.
        if (E == eStart)
          eStart = E.Next;
        E = this.RemoveEdge(E);
        E = E.Prev;
        eLoopStop = E;
        continue;
      }
      E = E.Next;
      if ((E == eLoopStop) || (!Closed && E.Next == eStart)) break;
    }
    if ((!Closed && (E == E.Next)) || (Closed && (E.Prev == E.Next)))
      return false;
    if (!Closed)
    {
      this.m_HasOpenPaths = true;
      eStart.Prev.OutIdx = ClipperLib.ClipperBase.Skip;
    }
    //3. Do second stage of edge initialization ...
    E = eStart;
    do {
      this.InitEdge2(E, polyType);
      E = E.Next;
      if (IsFlat && E.Curr.Y != eStart.Curr.Y)
        IsFlat = false;
    }
    while (E != eStart)
    //4. Finally, add edge bounds to LocalMinima list ...
    //Totally flat paths must be handled differently when adding them
    //to LocalMinima list to avoid endless loops etc ...
    if (IsFlat)
    {
      if (Closed)
        return false;
      E.Prev.OutIdx = ClipperLib.ClipperBase.Skip;
      if (E.Prev.Bot.X < E.Prev.Top.X)
        this.ReverseHorizontal(E.Prev);
      var locMin = new ClipperLib.LocalMinima();
      locMin.Next = null;
      locMin.Y = E.Bot.Y;
      locMin.LeftBound = null;
      locMin.RightBound = E;
      locMin.RightBound.Side = ClipperLib.EdgeSide.esRight;
      locMin.RightBound.WindDelta = 0;
      while (E.Next.OutIdx != ClipperLib.ClipperBase.Skip)
      {
        E.NextInLML = E.Next;
        if (E.Bot.X != E.Prev.Top.X)
          this.ReverseHorizontal(E);
        E = E.Next;
      }
      this.InsertLocalMinima(locMin);
      this.m_edges.push(edges);
      return true;
    }
    this.m_edges.push(edges);
    var leftBoundIsForward;
    var EMin = null;

		//workaround to avoid an endless loop in the while loop below when
    //open paths have matching start and end points ...
    if(ClipperLib.IntPoint.op_Equality(E.Prev.Bot, E.Prev.Top))
    	E = E.Next;

    for (;;)
    {
      E = this.FindNextLocMin(E);
      if (E == EMin)
        break;
      else if (EMin == null)
        EMin = E;
      //E and E.Prev now share a local minima (left aligned if horizontal).
      //Compare their slopes to find which starts which bound ...
      var locMin = new ClipperLib.LocalMinima();
      locMin.Next = null;
      locMin.Y = E.Bot.Y;
      if (E.Dx < E.Prev.Dx)
      {
        locMin.LeftBound = E.Prev;
        locMin.RightBound = E;
        leftBoundIsForward = false;
        //Q.nextInLML = Q.prev
      }
      else
      {
        locMin.LeftBound = E;
        locMin.RightBound = E.Prev;
        leftBoundIsForward = true;
        //Q.nextInLML = Q.next
      }
      locMin.LeftBound.Side = ClipperLib.EdgeSide.esLeft;
      locMin.RightBound.Side = ClipperLib.EdgeSide.esRight;
      if (!Closed)
        locMin.LeftBound.WindDelta = 0;
      else if (locMin.LeftBound.Next == locMin.RightBound)
        locMin.LeftBound.WindDelta = -1;
      else
        locMin.LeftBound.WindDelta = 1;
      locMin.RightBound.WindDelta = -locMin.LeftBound.WindDelta;
      E = this.ProcessBound(locMin.LeftBound, leftBoundIsForward);
      if (E.OutIdx == ClipperLib.ClipperBase.Skip)
      	E = this.ProcessBound(E, leftBoundIsForward);
      var E2 = this.ProcessBound(locMin.RightBound, !leftBoundIsForward);
      if (E2.OutIdx == ClipperLib.ClipperBase.Skip) E2 = this.ProcessBound(E2, !leftBoundIsForward);
      if (locMin.LeftBound.OutIdx == ClipperLib.ClipperBase.Skip)
        locMin.LeftBound = null;
      else if (locMin.RightBound.OutIdx == ClipperLib.ClipperBase.Skip)
        locMin.RightBound = null;
      this.InsertLocalMinima(locMin);
      if (!leftBoundIsForward)
        E = E2;
    }
    return true;
  };
  ClipperLib.ClipperBase.prototype.AddPaths = function (ppg, polyType, closed)
  {
    //  console.log("-------------------------------------------");
    //  console.log(JSON.stringify(ppg));
    var result = false;
    for (var i = 0, ilen = ppg.length; i < ilen; ++i)
      if (this.AddPath(ppg[i], polyType, closed))
        result = true;
    return result;
  };
  //------------------------------------------------------------------------------
  ClipperLib.ClipperBase.prototype.Pt2IsBetweenPt1AndPt3 = function (pt1, pt2, pt3)
  {
    if ((ClipperLib.IntPoint.op_Equality(pt1, pt3)) || (ClipperLib.IntPoint.op_Equality(pt1, pt2)) ||       (ClipperLib.IntPoint.op_Equality(pt3, pt2)))

   //if ((pt1 == pt3) || (pt1 == pt2) || (pt3 == pt2))
   return false;

    else if (pt1.X != pt3.X)
      return (pt2.X > pt1.X) == (pt2.X < pt3.X);
    else
      return (pt2.Y > pt1.Y) == (pt2.Y < pt3.Y);
  };
  ClipperLib.ClipperBase.prototype.RemoveEdge = function (e)
  {
    //removes e from double_linked_list (but without removing from memory)
    e.Prev.Next = e.Next;
    e.Next.Prev = e.Prev;
    var result = e.Next;
    e.Prev = null; //flag as removed (see ClipperBase.Clear)
    return result;
  };
  ClipperLib.ClipperBase.prototype.SetDx = function (e)
  {
    e.Delta.X = (e.Top.X - e.Bot.X);
    e.Delta.Y = (e.Top.Y - e.Bot.Y);
    if (e.Delta.Y === 0) e.Dx = ClipperLib.ClipperBase.horizontal;
    else e.Dx = (e.Delta.X) / (e.Delta.Y);
  };
  ClipperLib.ClipperBase.prototype.InsertLocalMinima = function (newLm)
  {
    if (this.m_MinimaList === null)
    {
      this.m_MinimaList = newLm;
    }
    else if (newLm.Y >= this.m_MinimaList.Y)
    {
      newLm.Next = this.m_MinimaList;
      this.m_MinimaList = newLm;
    }
    else
    {
      var tmpLm = this.m_MinimaList;
      while (tmpLm.Next !== null && (newLm.Y < tmpLm.Next.Y))
        tmpLm = tmpLm.Next;
      newLm.Next = tmpLm.Next;
      tmpLm.Next = newLm;
    }
  };
  ClipperLib.ClipperBase.prototype.PopLocalMinima = function ()
  {
    if (this.m_CurrentLM === null)
      return;
    this.m_CurrentLM = this.m_CurrentLM.Next;
  };
  ClipperLib.ClipperBase.prototype.ReverseHorizontal = function (e)
  {
    //swap horizontal edges' top and bottom x's so they follow the natural
    //progression of the bounds - ie so their xbots will align with the
    //adjoining lower edge. [Helpful in the ProcessHorizontal() method.]
    var tmp = e.Top.X;
    e.Top.X = e.Bot.X;
    e.Bot.X = tmp;
    if (ClipperLib.use_xyz)
    {
      tmp = e.Top.Z;
      e.Top.Z = e.Bot.Z;
      e.Bot.Z = tmp;
    }
  };
  ClipperLib.ClipperBase.prototype.Reset = function ()
  {
    this.m_CurrentLM = this.m_MinimaList;
    if (this.m_CurrentLM == null)
      return;
    //ie nothing to process
    //reset all edges ...
    var lm = this.m_MinimaList;
    while (lm != null)
    {
      var e = lm.LeftBound;
      if (e != null)
      {
        //e.Curr = e.Bot;
        e.Curr.X = e.Bot.X;
        e.Curr.Y = e.Bot.Y;
        if(ClipperLib.use_xyz) e.Curr.Z = e.Bot.Z;
        e.Side = ClipperLib.EdgeSide.esLeft;
        e.OutIdx = ClipperLib.ClipperBase.Unassigned;
      }
      e = lm.RightBound;
      if (e != null)
      {
        //e.Curr = e.Bot;
        e.Curr.X = e.Bot.X;
        e.Curr.Y = e.Bot.Y;
        if(ClipperLib.use_xyz) e.Curr.Z = e.Bot.Z;
        e.Side = ClipperLib.EdgeSide.esRight;
        e.OutIdx = ClipperLib.ClipperBase.Unassigned;
      }
      lm = lm.Next;
    }
  };
  ClipperLib.Clipper = function (InitOptions) // public Clipper(int InitOptions = 0)
  {
    if (typeof (InitOptions) == "undefined") InitOptions = 0;
    this.m_PolyOuts = null;
    this.m_ClipType = ClipperLib.ClipType.ctIntersection;
    this.m_Scanbeam = null;
    this.m_ActiveEdges = null;
    this.m_SortedEdges = null;
    this.m_IntersectList = null;
    this.m_IntersectNodeComparer = null;
    this.m_ExecuteLocked = false;
    this.m_ClipFillType = ClipperLib.PolyFillType.pftEvenOdd;
    this.m_SubjFillType = ClipperLib.PolyFillType.pftEvenOdd;
    this.m_Joins = null;
    this.m_GhostJoins = null;
    this.m_UsingPolyTree = false;
    this.ReverseSolution = false;
    this.StrictlySimple = false;
    ClipperLib.ClipperBase.call(this);
    this.m_Scanbeam = null;
    this.m_ActiveEdges = null;
    this.m_SortedEdges = null;
    this.m_IntersectList = new Array();
    this.m_IntersectNodeComparer = ClipperLib.MyIntersectNodeSort.Compare;
    this.m_ExecuteLocked = false;
    this.m_UsingPolyTree = false;
    this.m_PolyOuts = new Array();
    this.m_Joins = new Array();
    this.m_GhostJoins = new Array();
    this.ReverseSolution = (1 & InitOptions) !== 0;
    this.StrictlySimple = (2 & InitOptions) !== 0;
    this.PreserveCollinear = (4 & InitOptions) !== 0;
    if (ClipperLib.use_xyz)
    {
      this.ZFillFunction = null; // function (IntPoint vert1, IntPoint vert2, ref IntPoint intersectPt);
    }
  };
  ClipperLib.Clipper.ioReverseSolution = 1;
  ClipperLib.Clipper.ioStrictlySimple = 2;
  ClipperLib.Clipper.ioPreserveCollinear = 4;

  ClipperLib.Clipper.prototype.Clear = function ()
  {
    if (this.m_edges.length === 0)
      return;
    //avoids problems with ClipperBase destructor
    this.DisposeAllPolyPts();
    ClipperLib.ClipperBase.prototype.Clear.call(this);
  };

  ClipperLib.Clipper.prototype.DisposeScanbeamList = function ()
  {
    while (this.m_Scanbeam !== null)
    {
      var sb2 = this.m_Scanbeam.Next;
      this.m_Scanbeam = null;
      this.m_Scanbeam = sb2;
    }
  };
  ClipperLib.Clipper.prototype.Reset = function ()
  {
    ClipperLib.ClipperBase.prototype.Reset.call(this);
    this.m_Scanbeam = null;
    this.m_ActiveEdges = null;
    this.m_SortedEdges = null;

    var lm = this.m_MinimaList;
    while (lm !== null)
    {
      this.InsertScanbeam(lm.Y);
      lm = lm.Next;
    }
  };
  ClipperLib.Clipper.prototype.InsertScanbeam = function (Y)
  {
    if (this.m_Scanbeam === null)
    {
      this.m_Scanbeam = new ClipperLib.Scanbeam();
      this.m_Scanbeam.Next = null;
      this.m_Scanbeam.Y = Y;
    }
    else if (Y > this.m_Scanbeam.Y)
    {
      var newSb = new ClipperLib.Scanbeam();
      newSb.Y = Y;
      newSb.Next = this.m_Scanbeam;
      this.m_Scanbeam = newSb;
    }
    else
    {
      var sb2 = this.m_Scanbeam;
      while (sb2.Next !== null && (Y <= sb2.Next.Y))
        sb2 = sb2.Next;
      if (Y == sb2.Y)
        return;
      //ie ignores duplicates
      var newSb = new ClipperLib.Scanbeam();
      newSb.Y = Y;
      newSb.Next = sb2.Next;
      sb2.Next = newSb;
    }
  };
  // ************************************
  ClipperLib.Clipper.prototype.Execute = function ()
  {
    var a = arguments,
      alen = a.length,
      ispolytree = a[1] instanceof ClipperLib.PolyTree;
    if (alen == 4 && !ispolytree) // function (clipType, solution, subjFillType, clipFillType)
    {
      var clipType = a[0],
        solution = a[1],
        subjFillType = a[2],
        clipFillType = a[3];
      if (this.m_ExecuteLocked)
        return false;
      if (this.m_HasOpenPaths)
        ClipperLib.Error("Error: PolyTree struct is need for open path clipping.");
      this.m_ExecuteLocked = true;
      ClipperLib.Clear(solution);
      this.m_SubjFillType = subjFillType;
      this.m_ClipFillType = clipFillType;
      this.m_ClipType = clipType;
      this.m_UsingPolyTree = false;
      try
      {
        var succeeded = this.ExecuteInternal();
        //build the return polygons ...
        if (succeeded) this.BuildResult(solution);
      }
      finally
      {
        this.DisposeAllPolyPts();
        this.m_ExecuteLocked = false;
      }
      return succeeded;
    }
    else if (alen == 4 && ispolytree) // function (clipType, polytree, subjFillType, clipFillType)
    {
      var clipType = a[0],
        polytree = a[1],
        subjFillType = a[2],
        clipFillType = a[3];
      if (this.m_ExecuteLocked)
        return false;
      this.m_ExecuteLocked = true;
      this.m_SubjFillType = subjFillType;
      this.m_ClipFillType = clipFillType;
      this.m_ClipType = clipType;
      this.m_UsingPolyTree = true;
      try
      {
        var succeeded = this.ExecuteInternal();
        //build the return polygons ...
        if (succeeded) this.BuildResult2(polytree);
      }
      finally
      {
        this.DisposeAllPolyPts();
        this.m_ExecuteLocked = false;
      }
      return succeeded;
    }
    else if (alen == 2 && !ispolytree) // function (clipType, solution)
    {
      var clipType = a[0],
        solution = a[1];
      return this.Execute(clipType, solution, ClipperLib.PolyFillType.pftEvenOdd, ClipperLib.PolyFillType.pftEvenOdd);
    }
    else if (alen == 2 && ispolytree) // function (clipType, polytree)
    {
      var clipType = a[0],
        polytree = a[1];
      return this.Execute(clipType, polytree, ClipperLib.PolyFillType.pftEvenOdd, ClipperLib.PolyFillType.pftEvenOdd);
    }
  };
  ClipperLib.Clipper.prototype.FixHoleLinkage = function (outRec)
  {
    //skip if an outermost polygon or
    //already already points to the correct FirstLeft ...
    if (outRec.FirstLeft === null || (outRec.IsHole != outRec.FirstLeft.IsHole && outRec.FirstLeft.Pts !== null))
      return;
    var orfl = outRec.FirstLeft;
    while (orfl !== null && ((orfl.IsHole == outRec.IsHole) || orfl.Pts === null))
      orfl = orfl.FirstLeft;
    outRec.FirstLeft = orfl;
  };
  ClipperLib.Clipper.prototype.ExecuteInternal = function ()
  {
    try
    {
      this.Reset();
      if (this.m_CurrentLM === null)
        return false;
      var botY = this.PopScanbeam();
      do {
        this.InsertLocalMinimaIntoAEL(botY);
        ClipperLib.Clear(this.m_GhostJoins);
        this.ProcessHorizontals(false);
        if (this.m_Scanbeam === null)
          break;
        var topY = this.PopScanbeam();
        if (!this.ProcessIntersections(topY)) return false;

        this.ProcessEdgesAtTopOfScanbeam(topY);
        botY = topY;
      }
      while (this.m_Scanbeam !== null || this.m_CurrentLM !== null)
      //fix orientations ...
      for (var i = 0, ilen = this.m_PolyOuts.length; i < ilen; i++)
      {
        var outRec = this.m_PolyOuts[i];
        if (outRec.Pts === null || outRec.IsOpen)
          continue;
        if ((outRec.IsHole ^ this.ReverseSolution) == (this.Area(outRec) > 0))
          this.ReversePolyPtLinks(outRec.Pts);
      }
      this.JoinCommonEdges();
      for (var i = 0, ilen = this.m_PolyOuts.length; i < ilen; i++)
      {
        var outRec = this.m_PolyOuts[i];
        if (outRec.Pts !== null && !outRec.IsOpen)
          this.FixupOutPolygon(outRec);
      }
      if (this.StrictlySimple)
        this.DoSimplePolygons();
      return true;
    }
    finally
    {
      ClipperLib.Clear(this.m_Joins);
      ClipperLib.Clear(this.m_GhostJoins);
    }
  };
  ClipperLib.Clipper.prototype.PopScanbeam = function ()
  {
    var Y = this.m_Scanbeam.Y;
    this.m_Scanbeam = this.m_Scanbeam.Next;
    return Y;
  };

  ClipperLib.Clipper.prototype.DisposeAllPolyPts = function ()
  {
    for (var i = 0, ilen = this.m_PolyOuts.length; i < ilen; ++i)
      this.DisposeOutRec(i);
    ClipperLib.Clear(this.m_PolyOuts);
  };
  ClipperLib.Clipper.prototype.DisposeOutRec = function (index)
  {
    var outRec = this.m_PolyOuts[index];
    outRec.Pts = null;
    outRec = null;
    this.m_PolyOuts[index] = null;
  };

  ClipperLib.Clipper.prototype.AddJoin = function (Op1, Op2, OffPt)
  {
    var j = new ClipperLib.Join();
    j.OutPt1 = Op1;
    j.OutPt2 = Op2;
    //j.OffPt = OffPt;
    j.OffPt.X = OffPt.X;
    j.OffPt.Y = OffPt.Y;
		if(ClipperLib.use_xyz) j.OffPt.Z = OffPt.Z;
    this.m_Joins.push(j);
  };
  ClipperLib.Clipper.prototype.AddGhostJoin = function (Op, OffPt)
  {
    var j = new ClipperLib.Join();
    j.OutPt1 = Op;
    //j.OffPt = OffPt;
    j.OffPt.X = OffPt.X;
    j.OffPt.Y = OffPt.Y;
		if(ClipperLib.use_xyz) j.OffPt.Z = OffPt.Z;
    this.m_GhostJoins.push(j);
  };
  //if (ClipperLib.use_xyz)
  //{
    ClipperLib.Clipper.prototype.SetZ = function (pt, e1, e2)
    {
      if (this.ZFillFunction !== null)
      {
        if (pt.Z != 0 || this.ZFillFunction === null) return;
        else if (ClipperLib.IntPoint.op_Equality(pt, e1.Bot)) pt.Z = e1.Bot.Z;
        else if (ClipperLib.IntPoint.op_Equality(pt, e1.Top)) pt.Z = e1.Top.Z;
        else if (ClipperLib.IntPoint.op_Equality(pt, e2.Bot)) pt.Z = e2.Bot.Z;
        else if (ClipperLib.IntPoint.op_Equality(pt, e2.Top)) pt.Z = e2.Top.Z;
        else this.ZFillFunction(e1.Bot, e1.Top, e2.Bot, e2.Top, pt);
      }
    };

    //------------------------------------------------------------------------------
  //}

  ClipperLib.Clipper.prototype.InsertLocalMinimaIntoAEL = function (botY)
  {
    while (this.m_CurrentLM !== null && (this.m_CurrentLM.Y == botY))
    {
      var lb = this.m_CurrentLM.LeftBound;
      var rb = this.m_CurrentLM.RightBound;
      this.PopLocalMinima();
      var Op1 = null;
      if (lb === null)
      {
        this.InsertEdgeIntoAEL(rb, null);
        this.SetWindingCount(rb);
        if (this.IsContributing(rb))
          Op1 = this.AddOutPt(rb, rb.Bot);
      }
      else if (rb == null)
      {
        this.InsertEdgeIntoAEL(lb, null);
        this.SetWindingCount(lb);
        if (this.IsContributing(lb))
          Op1 = this.AddOutPt(lb, lb.Bot);
        this.InsertScanbeam(lb.Top.Y);
      }
      else
      {
        this.InsertEdgeIntoAEL(lb, null);
        this.InsertEdgeIntoAEL(rb, lb);
        this.SetWindingCount(lb);
        rb.WindCnt = lb.WindCnt;
        rb.WindCnt2 = lb.WindCnt2;
        if (this.IsContributing(lb))
          Op1 = this.AddLocalMinPoly(lb, rb, lb.Bot);
        this.InsertScanbeam(lb.Top.Y);
      }
      if (rb != null)
      {
        if (ClipperLib.ClipperBase.IsHorizontal(rb))
          this.AddEdgeToSEL(rb);
        else
          this.InsertScanbeam(rb.Top.Y);
      }
      if (lb == null || rb == null) continue;
      //if output polygons share an Edge with a horizontal rb, they'll need joining later ...
      if (Op1 !== null && ClipperLib.ClipperBase.IsHorizontal(rb) && this.m_GhostJoins.length > 0 && rb.WindDelta !== 0)
      {
        for (var i = 0, ilen = this.m_GhostJoins.length; i < ilen; i++)
        {
          //if the horizontal Rb and a 'ghost' horizontal overlap, then convert
          //the 'ghost' join to a real join ready for later ...
          var j = this.m_GhostJoins[i];

					if (this.HorzSegmentsOverlap(j.OutPt1.Pt.X, j.OffPt.X, rb.Bot.X, rb.Top.X))
            this.AddJoin(j.OutPt1, Op1, j.OffPt);
        }
      }
      if (lb.OutIdx >= 0 && lb.PrevInAEL !== null &&
        lb.PrevInAEL.Curr.X == lb.Bot.X &&
        lb.PrevInAEL.OutIdx >= 0 &&
        ClipperLib.ClipperBase.SlopesEqual(lb.PrevInAEL, lb, this.m_UseFullRange) &&
        lb.WindDelta !== 0 && lb.PrevInAEL.WindDelta !== 0)
      {
        var Op2 = this.AddOutPt(lb.PrevInAEL, lb.Bot);
        this.AddJoin(Op1, Op2, lb.Top);
      }
      if (lb.NextInAEL != rb)
      {
        if (rb.OutIdx >= 0 && rb.PrevInAEL.OutIdx >= 0 &&
          ClipperLib.ClipperBase.SlopesEqual(rb.PrevInAEL, rb, this.m_UseFullRange) &&
          rb.WindDelta !== 0 && rb.PrevInAEL.WindDelta !== 0)
        {
          var Op2 = this.AddOutPt(rb.PrevInAEL, rb.Bot);
          this.AddJoin(Op1, Op2, rb.Top);
        }
        var e = lb.NextInAEL;
        if (e !== null)
          while (e != rb)
          {
            //nb: For calculating winding counts etc, IntersectEdges() assumes
            //that param1 will be to the right of param2 ABOVE the intersection ...
            this.IntersectEdges(rb, e, lb.Curr, false);
            //order important here
            e = e.NextInAEL;
          }
      }
    }
  };
  ClipperLib.Clipper.prototype.InsertEdgeIntoAEL = function (edge, startEdge)
  {
    if (this.m_ActiveEdges === null)
    {
      edge.PrevInAEL = null;
      edge.NextInAEL = null;
      this.m_ActiveEdges = edge;
    }
    else if (startEdge === null && this.E2InsertsBeforeE1(this.m_ActiveEdges, edge))
    {
      edge.PrevInAEL = null;
      edge.NextInAEL = this.m_ActiveEdges;
      this.m_ActiveEdges.PrevInAEL = edge;
      this.m_ActiveEdges = edge;
    }
    else
    {
      if (startEdge === null)
        startEdge = this.m_ActiveEdges;
      while (startEdge.NextInAEL !== null && !this.E2InsertsBeforeE1(startEdge.NextInAEL, edge))
        startEdge = startEdge.NextInAEL;
      edge.NextInAEL = startEdge.NextInAEL;
      if (startEdge.NextInAEL !== null)
        startEdge.NextInAEL.PrevInAEL = edge;
      edge.PrevInAEL = startEdge;
      startEdge.NextInAEL = edge;
    }
  };
  ClipperLib.Clipper.prototype.E2InsertsBeforeE1 = function (e1, e2)
  {
    if (e2.Curr.X == e1.Curr.X)
    {
      if (e2.Top.Y > e1.Top.Y)
        return e2.Top.X < ClipperLib.Clipper.TopX(e1, e2.Top.Y);
      else
        return e1.Top.X > ClipperLib.Clipper.TopX(e2, e1.Top.Y);
    }
    else
      return e2.Curr.X < e1.Curr.X;
  };
  ClipperLib.Clipper.prototype.IsEvenOddFillType = function (edge)
  {
    if (edge.PolyTyp == ClipperLib.PolyType.ptSubject)
      return this.m_SubjFillType == ClipperLib.PolyFillType.pftEvenOdd;
    else
      return this.m_ClipFillType == ClipperLib.PolyFillType.pftEvenOdd;
  };
  ClipperLib.Clipper.prototype.IsEvenOddAltFillType = function (edge)
  {
    if (edge.PolyTyp == ClipperLib.PolyType.ptSubject)
      return this.m_ClipFillType == ClipperLib.PolyFillType.pftEvenOdd;
    else
      return this.m_SubjFillType == ClipperLib.PolyFillType.pftEvenOdd;
  };
  ClipperLib.Clipper.prototype.IsContributing = function (edge)
  {
    var pft, pft2;
    if (edge.PolyTyp == ClipperLib.PolyType.ptSubject)
    {
      pft = this.m_SubjFillType;
      pft2 = this.m_ClipFillType;
    }
    else
    {
      pft = this.m_ClipFillType;
      pft2 = this.m_SubjFillType;
    }
    switch (pft)
    {
    case ClipperLib.PolyFillType.pftEvenOdd:
      if (edge.WindDelta === 0 && edge.WindCnt != 1)
        return false;
      break;
    case ClipperLib.PolyFillType.pftNonZero:
      if (Math.abs(edge.WindCnt) != 1)
        return false;
      break;
    case ClipperLib.PolyFillType.pftPositive:
      if (edge.WindCnt != 1)
        return false;
      break;
    default:
      if (edge.WindCnt != -1)
        return false;
      break;
    }
    switch (this.m_ClipType)
    {
    case ClipperLib.ClipType.ctIntersection:
      switch (pft2)
      {
      case ClipperLib.PolyFillType.pftEvenOdd:
      case ClipperLib.PolyFillType.pftNonZero:
        return (edge.WindCnt2 !== 0);
      case ClipperLib.PolyFillType.pftPositive:
        return (edge.WindCnt2 > 0);
      default:
        return (edge.WindCnt2 < 0);
      }
    case ClipperLib.ClipType.ctUnion:
      switch (pft2)
      {
      case ClipperLib.PolyFillType.pftEvenOdd:
      case ClipperLib.PolyFillType.pftNonZero:
        return (edge.WindCnt2 === 0);
      case ClipperLib.PolyFillType.pftPositive:
        return (edge.WindCnt2 <= 0);
      default:
        return (edge.WindCnt2 >= 0);
      }
    case ClipperLib.ClipType.ctDifference:
      if (edge.PolyTyp == ClipperLib.PolyType.ptSubject)
        switch (pft2)
        {
        case ClipperLib.PolyFillType.pftEvenOdd:
        case ClipperLib.PolyFillType.pftNonZero:
          return (edge.WindCnt2 === 0);
        case ClipperLib.PolyFillType.pftPositive:
          return (edge.WindCnt2 <= 0);
        default:
          return (edge.WindCnt2 >= 0);
        }
      else
        switch (pft2)
        {
        case ClipperLib.PolyFillType.pftEvenOdd:
        case ClipperLib.PolyFillType.pftNonZero:
          return (edge.WindCnt2 !== 0);
        case ClipperLib.PolyFillType.pftPositive:
          return (edge.WindCnt2 > 0);
        default:
          return (edge.WindCnt2 < 0);
        }
    case ClipperLib.ClipType.ctXor:
      if (edge.WindDelta === 0)
        switch (pft2)
        {
        case ClipperLib.PolyFillType.pftEvenOdd:
        case ClipperLib.PolyFillType.pftNonZero:
          return (edge.WindCnt2 === 0);
        case ClipperLib.PolyFillType.pftPositive:
          return (edge.WindCnt2 <= 0);
        default:
          return (edge.WindCnt2 >= 0);
        }
      else
        return true;
    }
    return true;
  };
  ClipperLib.Clipper.prototype.SetWindingCount = function (edge)
  {
    var e = edge.PrevInAEL;
    //find the edge of the same polytype that immediately preceeds 'edge' in AEL
    while (e !== null && ((e.PolyTyp != edge.PolyTyp) || (e.WindDelta === 0)))
      e = e.PrevInAEL;
    if (e === null)
    {
      edge.WindCnt = (edge.WindDelta === 0 ? 1 : edge.WindDelta);
      edge.WindCnt2 = 0;
      e = this.m_ActiveEdges;
      //ie get ready to calc WindCnt2
    }
    else if (edge.WindDelta === 0 && this.m_ClipType != ClipperLib.ClipType.ctUnion)
    {
      edge.WindCnt = 1;
      edge.WindCnt2 = e.WindCnt2;
      e = e.NextInAEL;
      //ie get ready to calc WindCnt2
    }
    else if (this.IsEvenOddFillType(edge))
    {
      //EvenOdd filling ...
      if (edge.WindDelta === 0)
      {
        //are we inside a subj polygon ...
        var Inside = true;
        var e2 = e.PrevInAEL;
        while (e2 !== null)
        {
          if (e2.PolyTyp == e.PolyTyp && e2.WindDelta !== 0)
            Inside = !Inside;
          e2 = e2.PrevInAEL;
        }
        edge.WindCnt = (Inside ? 0 : 1);
      }
      else
      {
        edge.WindCnt = edge.WindDelta;
      }
      edge.WindCnt2 = e.WindCnt2;
      e = e.NextInAEL;
      //ie get ready to calc WindCnt2
    }
    else
    {
      //nonZero, Positive or Negative filling ...
      if (e.WindCnt * e.WindDelta < 0)
      {
        //prev edge is 'decreasing' WindCount (WC) toward zero
        //so we're outside the previous polygon ...
        if (Math.abs(e.WindCnt) > 1)
        {
          //outside prev poly but still inside another.
          //when reversing direction of prev poly use the same WC
          if (e.WindDelta * edge.WindDelta < 0)
            edge.WindCnt = e.WindCnt;
          else
            edge.WindCnt = e.WindCnt + edge.WindDelta;
        }
        else
          edge.WindCnt = (edge.WindDelta === 0 ? 1 : edge.WindDelta);
      }
      else
      {
        //prev edge is 'increasing' WindCount (WC) away from zero
        //so we're inside the previous polygon ...
        if (edge.WindDelta === 0)
          edge.WindCnt = (e.WindCnt < 0 ? e.WindCnt - 1 : e.WindCnt + 1);
        else if (e.WindDelta * edge.WindDelta < 0)
          edge.WindCnt = e.WindCnt;
        else
          edge.WindCnt = e.WindCnt + edge.WindDelta;
      }
      edge.WindCnt2 = e.WindCnt2;
      e = e.NextInAEL;
      //ie get ready to calc WindCnt2
    }
    //update WindCnt2 ...
    if (this.IsEvenOddAltFillType(edge))
    {
      //EvenOdd filling ...
      while (e != edge)
      {
        if (e.WindDelta !== 0)
          edge.WindCnt2 = (edge.WindCnt2 === 0 ? 1 : 0);
        e = e.NextInAEL;
      }
    }
    else
    {
      //nonZero, Positive or Negative filling ...
      while (e != edge)
      {
        edge.WindCnt2 += e.WindDelta;
        e = e.NextInAEL;
      }
    }
  };
  ClipperLib.Clipper.prototype.AddEdgeToSEL = function (edge)
  {
    //SEL pointers in PEdge are reused to build a list of horizontal edges.
    //However, we don't need to worry about order with horizontal edge processing.
    if (this.m_SortedEdges === null)
    {
      this.m_SortedEdges = edge;
      edge.PrevInSEL = null;
      edge.NextInSEL = null;
    }
    else
    {
      edge.NextInSEL = this.m_SortedEdges;
      edge.PrevInSEL = null;
      this.m_SortedEdges.PrevInSEL = edge;
      this.m_SortedEdges = edge;
    }
  };
  ClipperLib.Clipper.prototype.CopyAELToSEL = function ()
  {
    var e = this.m_ActiveEdges;
    this.m_SortedEdges = e;
    while (e !== null)
    {
      e.PrevInSEL = e.PrevInAEL;
      e.NextInSEL = e.NextInAEL;
      e = e.NextInAEL;
    }
  };
  ClipperLib.Clipper.prototype.SwapPositionsInAEL = function (edge1, edge2)
  {
    //check that one or other edge hasn't already been removed from AEL ...
    if (edge1.NextInAEL == edge1.PrevInAEL || edge2.NextInAEL == edge2.PrevInAEL)
      return;
    if (edge1.NextInAEL == edge2)
    {
      var next = edge2.NextInAEL;
      if (next !== null)
        next.PrevInAEL = edge1;
      var prev = edge1.PrevInAEL;
      if (prev !== null)
        prev.NextInAEL = edge2;
      edge2.PrevInAEL = prev;
      edge2.NextInAEL = edge1;
      edge1.PrevInAEL = edge2;
      edge1.NextInAEL = next;
    }
    else if (edge2.NextInAEL == edge1)
    {
      var next = edge1.NextInAEL;
      if (next !== null)
        next.PrevInAEL = edge2;
      var prev = edge2.PrevInAEL;
      if (prev !== null)
        prev.NextInAEL = edge1;
      edge1.PrevInAEL = prev;
      edge1.NextInAEL = edge2;
      edge2.PrevInAEL = edge1;
      edge2.NextInAEL = next;
    }
    else
    {
      var next = edge1.NextInAEL;
      var prev = edge1.PrevInAEL;
      edge1.NextInAEL = edge2.NextInAEL;
      if (edge1.NextInAEL !== null)
        edge1.NextInAEL.PrevInAEL = edge1;
      edge1.PrevInAEL = edge2.PrevInAEL;
      if (edge1.PrevInAEL !== null)
        edge1.PrevInAEL.NextInAEL = edge1;
      edge2.NextInAEL = next;
      if (edge2.NextInAEL !== null)
        edge2.NextInAEL.PrevInAEL = edge2;
      edge2.PrevInAEL = prev;
      if (edge2.PrevInAEL !== null)
        edge2.PrevInAEL.NextInAEL = edge2;
    }
    if (edge1.PrevInAEL === null)
      this.m_ActiveEdges = edge1;
    else if (edge2.PrevInAEL === null)
      this.m_ActiveEdges = edge2;
  };
  ClipperLib.Clipper.prototype.SwapPositionsInSEL = function (edge1, edge2)
  {
    if (edge1.NextInSEL === null && edge1.PrevInSEL === null)
      return;
    if (edge2.NextInSEL === null && edge2.PrevInSEL === null)
      return;
    if (edge1.NextInSEL == edge2)
    {
      var next = edge2.NextInSEL;
      if (next !== null)
        next.PrevInSEL = edge1;
      var prev = edge1.PrevInSEL;
      if (prev !== null)
        prev.NextInSEL = edge2;
      edge2.PrevInSEL = prev;
      edge2.NextInSEL = edge1;
      edge1.PrevInSEL = edge2;
      edge1.NextInSEL = next;
    }
    else if (edge2.NextInSEL == edge1)
    {
      var next = edge1.NextInSEL;
      if (next !== null)
        next.PrevInSEL = edge2;
      var prev = edge2.PrevInSEL;
      if (prev !== null)
        prev.NextInSEL = edge1;
      edge1.PrevInSEL = prev;
      edge1.NextInSEL = edge2;
      edge2.PrevInSEL = edge1;
      edge2.NextInSEL = next;
    }
    else
    {
      var next = edge1.NextInSEL;
      var prev = edge1.PrevInSEL;
      edge1.NextInSEL = edge2.NextInSEL;
      if (edge1.NextInSEL !== null)
        edge1.NextInSEL.PrevInSEL = edge1;
      edge1.PrevInSEL = edge2.PrevInSEL;
      if (edge1.PrevInSEL !== null)
        edge1.PrevInSEL.NextInSEL = edge1;
      edge2.NextInSEL = next;
      if (edge2.NextInSEL !== null)
        edge2.NextInSEL.PrevInSEL = edge2;
      edge2.PrevInSEL = prev;
      if (edge2.PrevInSEL !== null)
        edge2.PrevInSEL.NextInSEL = edge2;
    }
    if (edge1.PrevInSEL === null)
      this.m_SortedEdges = edge1;
    else if (edge2.PrevInSEL === null)
      this.m_SortedEdges = edge2;
  };
  ClipperLib.Clipper.prototype.AddLocalMaxPoly = function (e1, e2, pt)
  {
    this.AddOutPt(e1, pt);
    if (e2.WindDelta == 0) this.AddOutPt(e2, pt);
    if (e1.OutIdx == e2.OutIdx)
    {
      e1.OutIdx = -1;
      e2.OutIdx = -1;
    }
    else if (e1.OutIdx < e2.OutIdx)
      this.AppendPolygon(e1, e2);
    else
      this.AppendPolygon(e2, e1);
  };
  ClipperLib.Clipper.prototype.AddLocalMinPoly = function (e1, e2, pt)
  {
    var result;
    var e, prevE;
    if (ClipperLib.ClipperBase.IsHorizontal(e2) || (e1.Dx > e2.Dx))
    {
      result = this.AddOutPt(e1, pt);
      e2.OutIdx = e1.OutIdx;
      e1.Side = ClipperLib.EdgeSide.esLeft;
      e2.Side = ClipperLib.EdgeSide.esRight;
      e = e1;
      if (e.PrevInAEL == e2)
        prevE = e2.PrevInAEL;
      else
        prevE = e.PrevInAEL;
    }
    else
    {
      result = this.AddOutPt(e2, pt);
      e1.OutIdx = e2.OutIdx;
      e1.Side = ClipperLib.EdgeSide.esRight;
      e2.Side = ClipperLib.EdgeSide.esLeft;
      e = e2;
      if (e.PrevInAEL == e1)
        prevE = e1.PrevInAEL;
      else
        prevE = e.PrevInAEL;
    }
    if (prevE !== null && prevE.OutIdx >= 0 && (ClipperLib.Clipper.TopX(prevE, pt.Y) == ClipperLib.Clipper.TopX(e, pt.Y)) && ClipperLib.ClipperBase.SlopesEqual(e, prevE, this.m_UseFullRange) && (e.WindDelta !== 0) && (prevE.WindDelta !== 0))
    {
      var outPt = this.AddOutPt(prevE, pt);
      this.AddJoin(result, outPt, e.Top);
    }
    return result;
  };
  ClipperLib.Clipper.prototype.CreateOutRec = function ()
  {
    var result = new ClipperLib.OutRec();
    result.Idx = -1;
    result.IsHole = false;
    result.IsOpen = false;
    result.FirstLeft = null;
    result.Pts = null;
    result.BottomPt = null;
    result.PolyNode = null;
    this.m_PolyOuts.push(result);
    result.Idx = this.m_PolyOuts.length - 1;
    return result;
  };
  ClipperLib.Clipper.prototype.AddOutPt = function (e, pt)
  {
    var ToFront = (e.Side == ClipperLib.EdgeSide.esLeft);
    if (e.OutIdx < 0)
    {
      var outRec = this.CreateOutRec();
      outRec.IsOpen = (e.WindDelta === 0);
      var newOp = new ClipperLib.OutPt();
      outRec.Pts = newOp;
      newOp.Idx = outRec.Idx;
      //newOp.Pt = pt;
      newOp.Pt.X = pt.X;
      newOp.Pt.Y = pt.Y;
			if(ClipperLib.use_xyz) newOp.Pt.Z = pt.Z;
      newOp.Next = newOp;
      newOp.Prev = newOp;
      if (!outRec.IsOpen)
        this.SetHoleState(e, outRec);
      e.OutIdx = outRec.Idx;
      //nb: do this after SetZ !
      return newOp;
    }
    else
    {
      var outRec = this.m_PolyOuts[e.OutIdx];
      //OutRec.Pts is the 'Left-most' point & OutRec.Pts.Prev is the 'Right-most'
      var op = outRec.Pts;
      if (ToFront && ClipperLib.IntPoint.op_Equality(pt, op.Pt))
        return op;
      else if (!ToFront && ClipperLib.IntPoint.op_Equality(pt, op.Prev.Pt))
        return op.Prev;
      var newOp = new ClipperLib.OutPt();
      newOp.Idx = outRec.Idx;
      //newOp.Pt = pt;
      newOp.Pt.X = pt.X;
      newOp.Pt.Y = pt.Y;
      if(ClipperLib.use_xyz) newOp.Pt.Z = pt.Z;
      newOp.Next = op;
      newOp.Prev = op.Prev;
      newOp.Prev.Next = newOp;
      op.Prev = newOp;
      if (ToFront)
        outRec.Pts = newOp;
      return newOp;
    }
  };
  ClipperLib.Clipper.prototype.SwapPoints = function (pt1, pt2)
  {
    var tmp = new ClipperLib.IntPoint(pt1.Value);
    //pt1.Value = pt2.Value;
    pt1.Value.X = pt2.Value.X;
    pt1.Value.Y = pt2.Value.Y;
    if(ClipperLib.use_xyz) pt1.Value.Z = pt2.Value.Z;
    //pt2.Value = tmp;
    pt2.Value.X = tmp.X;
    pt2.Value.Y = tmp.Y;
		if(ClipperLib.use_xyz) pt2.Value.Z = tmp.Z;
  };
  ClipperLib.Clipper.prototype.HorzSegmentsOverlap = function (seg1a, seg1b, seg2a, seg2b)
	{
		var tmp;
		if (seg1a > seg1b)
		{
			tmp = seg1a;
			seg1a = seg1b;
			seg1b = tmp;
		}
		if (seg2a > seg2b)
		{
			tmp = seg2a;
			seg2a = seg2b;
			seg2b = tmp;
		}
		return (seg1a < seg2b) && (seg2a < seg1b);
	}

  ClipperLib.Clipper.prototype.SetHoleState = function (e, outRec)
  {
    var isHole = false;
    var e2 = e.PrevInAEL;
    while (e2 !== null)
    {
      if (e2.OutIdx >= 0 && e2.WindDelta != 0)
      {
        isHole = !isHole;
        if (outRec.FirstLeft === null)
          outRec.FirstLeft = this.m_PolyOuts[e2.OutIdx];
      }
      e2 = e2.PrevInAEL;
    }
    if (isHole)
      outRec.IsHole = true;
  };
  ClipperLib.Clipper.prototype.GetDx = function (pt1, pt2)
  {
    if (pt1.Y == pt2.Y)
      return ClipperLib.ClipperBase.horizontal;
    else
      return (pt2.X - pt1.X) / (pt2.Y - pt1.Y);
  };
  ClipperLib.Clipper.prototype.FirstIsBottomPt = function (btmPt1, btmPt2)
  {
    var p = btmPt1.Prev;
    while ((ClipperLib.IntPoint.op_Equality(p.Pt, btmPt1.Pt)) && (p != btmPt1))
      p = p.Prev;
    var dx1p = Math.abs(this.GetDx(btmPt1.Pt, p.Pt));
    p = btmPt1.Next;
    while ((ClipperLib.IntPoint.op_Equality(p.Pt, btmPt1.Pt)) && (p != btmPt1))
      p = p.Next;
    var dx1n = Math.abs(this.GetDx(btmPt1.Pt, p.Pt));
    p = btmPt2.Prev;
    while ((ClipperLib.IntPoint.op_Equality(p.Pt, btmPt2.Pt)) && (p != btmPt2))
      p = p.Prev;
    var dx2p = Math.abs(this.GetDx(btmPt2.Pt, p.Pt));
    p = btmPt2.Next;
    while ((ClipperLib.IntPoint.op_Equality(p.Pt, btmPt2.Pt)) && (p != btmPt2))
      p = p.Next;
    var dx2n = Math.abs(this.GetDx(btmPt2.Pt, p.Pt));
    return (dx1p >= dx2p && dx1p >= dx2n) || (dx1n >= dx2p && dx1n >= dx2n);
  };
  ClipperLib.Clipper.prototype.GetBottomPt = function (pp)
  {
    var dups = null;
    var p = pp.Next;
    while (p != pp)
    {
      if (p.Pt.Y > pp.Pt.Y)
      {
        pp = p;
        dups = null;
      }
      else if (p.Pt.Y == pp.Pt.Y && p.Pt.X <= pp.Pt.X)
      {
        if (p.Pt.X < pp.Pt.X)
        {
          dups = null;
          pp = p;
        }
        else
        {
          if (p.Next != pp && p.Prev != pp)
            dups = p;
        }
      }
      p = p.Next;
    }
    if (dups !== null)
    {
      //there appears to be at least 2 vertices at bottomPt so ...
      while (dups != p)
      {
        if (!this.FirstIsBottomPt(p, dups))
          pp = dups;
        dups = dups.Next;
        while (ClipperLib.IntPoint.op_Inequality(dups.Pt, pp.Pt))
          dups = dups.Next;
      }
    }
    return pp;
  };
  ClipperLib.Clipper.prototype.GetLowermostRec = function (outRec1, outRec2)
  {
    //work out which polygon fragment has the correct hole state ...
    if (outRec1.BottomPt === null)
      outRec1.BottomPt = this.GetBottomPt(outRec1.Pts);
    if (outRec2.BottomPt === null)
      outRec2.BottomPt = this.GetBottomPt(outRec2.Pts);
    var bPt1 = outRec1.BottomPt;
    var bPt2 = outRec2.BottomPt;
    if (bPt1.Pt.Y > bPt2.Pt.Y)
      return outRec1;
    else if (bPt1.Pt.Y < bPt2.Pt.Y)
      return outRec2;
    else if (bPt1.Pt.X < bPt2.Pt.X)
      return outRec1;
    else if (bPt1.Pt.X > bPt2.Pt.X)
      return outRec2;
    else if (bPt1.Next == bPt1)
      return outRec2;
    else if (bPt2.Next == bPt2)
      return outRec1;
    else if (this.FirstIsBottomPt(bPt1, bPt2))
      return outRec1;
    else
      return outRec2;
  };
  ClipperLib.Clipper.prototype.Param1RightOfParam2 = function (outRec1, outRec2)
  {
    do {
      outRec1 = outRec1.FirstLeft;
      if (outRec1 == outRec2)
        return true;
    }
    while (outRec1 !== null)
    return false;
  };
  ClipperLib.Clipper.prototype.GetOutRec = function (idx)
  {
    var outrec = this.m_PolyOuts[idx];
    while (outrec != this.m_PolyOuts[outrec.Idx])
      outrec = this.m_PolyOuts[outrec.Idx];
    return outrec;
  };
  ClipperLib.Clipper.prototype.AppendPolygon = function (e1, e2)
  {
    //get the start and ends of both output polygons ...
    var outRec1 = this.m_PolyOuts[e1.OutIdx];
    var outRec2 = this.m_PolyOuts[e2.OutIdx];
    var holeStateRec;
    if (this.Param1RightOfParam2(outRec1, outRec2))
      holeStateRec = outRec2;
    else if (this.Param1RightOfParam2(outRec2, outRec1))
      holeStateRec = outRec1;
    else
      holeStateRec = this.GetLowermostRec(outRec1, outRec2);
    var p1_lft = outRec1.Pts;
    var p1_rt = p1_lft.Prev;
    var p2_lft = outRec2.Pts;
    var p2_rt = p2_lft.Prev;
    var side;
    //join e2 poly onto e1 poly and delete pointers to e2 ...
    if (e1.Side == ClipperLib.EdgeSide.esLeft)
    {
      if (e2.Side == ClipperLib.EdgeSide.esLeft)
      {
        //z y x a b c
        this.ReversePolyPtLinks(p2_lft);
        p2_lft.Next = p1_lft;
        p1_lft.Prev = p2_lft;
        p1_rt.Next = p2_rt;
        p2_rt.Prev = p1_rt;
        outRec1.Pts = p2_rt;
      }
      else
      {
        //x y z a b c
        p2_rt.Next = p1_lft;
        p1_lft.Prev = p2_rt;
        p2_lft.Prev = p1_rt;
        p1_rt.Next = p2_lft;
        outRec1.Pts = p2_lft;
      }
      side = ClipperLib.EdgeSide.esLeft;
    }
    else
    {
      if (e2.Side == ClipperLib.EdgeSide.esRight)
      {
        //a b c z y x
        this.ReversePolyPtLinks(p2_lft);
        p1_rt.Next = p2_rt;
        p2_rt.Prev = p1_rt;
        p2_lft.Next = p1_lft;
        p1_lft.Prev = p2_lft;
      }
      else
      {
        //a b c x y z
        p1_rt.Next = p2_lft;
        p2_lft.Prev = p1_rt;
        p1_lft.Prev = p2_rt;
        p2_rt.Next = p1_lft;
      }
      side = ClipperLib.EdgeSide.esRight;
    }
    outRec1.BottomPt = null;
    if (holeStateRec == outRec2)
    {
      if (outRec2.FirstLeft != outRec1)
        outRec1.FirstLeft = outRec2.FirstLeft;
      outRec1.IsHole = outRec2.IsHole;
    }
    outRec2.Pts = null;
    outRec2.BottomPt = null;
    outRec2.FirstLeft = outRec1;
    var OKIdx = e1.OutIdx;
    var ObsoleteIdx = e2.OutIdx;
    e1.OutIdx = -1;
    //nb: safe because we only get here via AddLocalMaxPoly
    e2.OutIdx = -1;
    var e = this.m_ActiveEdges;
    while (e !== null)
    {
      if (e.OutIdx == ObsoleteIdx)
      {
        e.OutIdx = OKIdx;
        e.Side = side;
        break;
      }
      e = e.NextInAEL;
    }
    outRec2.Idx = outRec1.Idx;
  };
  ClipperLib.Clipper.prototype.ReversePolyPtLinks = function (pp)
  {
    if (pp === null)
      return;
    var pp1;
    var pp2;
    pp1 = pp;
    do {
      pp2 = pp1.Next;
      pp1.Next = pp1.Prev;
      pp1.Prev = pp2;
      pp1 = pp2;
    }
    while (pp1 != pp)
  };
  ClipperLib.Clipper.SwapSides = function (edge1, edge2)
  {
    var side = edge1.Side;
    edge1.Side = edge2.Side;
    edge2.Side = side;
  };
  ClipperLib.Clipper.SwapPolyIndexes = function (edge1, edge2)
  {
    var outIdx = edge1.OutIdx;
    edge1.OutIdx = edge2.OutIdx;
    edge2.OutIdx = outIdx;
  };
  ClipperLib.Clipper.prototype.IntersectEdges = function (e1, e2, pt)
  {
    //e1 will be to the left of e2 BELOW the intersection. Therefore e1 is before
    //e2 in AEL except when e1 is being inserted at the intersection point ...
    var e1Contributing = (e1.OutIdx >= 0);
    var e2Contributing = (e2.OutIdx >= 0);

    if (ClipperLib.use_xyz)
    	this.SetZ(pt, e1, e2);

    if (ClipperLib.use_lines)
    {
      //if either edge is on an OPEN path ...
      if (e1.WindDelta === 0 || e2.WindDelta === 0)
      {
        //ignore subject-subject open path intersections UNLESS they
        //are both open paths, AND they are both 'contributing maximas' ...
				if (e1.WindDelta == 0 && e2.WindDelta == 0) return;
        //if intersecting a subj line with a subj poly ...
        else if (e1.PolyTyp == e2.PolyTyp &&
          e1.WindDelta != e2.WindDelta && this.m_ClipType == ClipperLib.ClipType.ctUnion)
        {
          if (e1.WindDelta === 0)
          {
            if (e2Contributing)
            {
              this.AddOutPt(e1, pt);
              if (e1Contributing)
                e1.OutIdx = -1;
            }
          }
          else
          {
            if (e1Contributing)
            {
              this.AddOutPt(e2, pt);
              if (e2Contributing)
                e2.OutIdx = -1;
            }
          }
        }
        else if (e1.PolyTyp != e2.PolyTyp)
        {
          if ((e1.WindDelta === 0) && Math.abs(e2.WindCnt) == 1 &&
            (this.m_ClipType != ClipperLib.ClipType.ctUnion || e2.WindCnt2 === 0))
          {
            this.AddOutPt(e1, pt);
            if (e1Contributing)
              e1.OutIdx = -1;
          }
          else if ((e2.WindDelta === 0) && (Math.abs(e1.WindCnt) == 1) &&
            (this.m_ClipType != ClipperLib.ClipType.ctUnion || e1.WindCnt2 === 0))
          {
            this.AddOutPt(e2, pt);
            if (e2Contributing)
              e2.OutIdx = -1;
          }
        }
        return;
      }
    }
    //update winding counts...
    //assumes that e1 will be to the Right of e2 ABOVE the intersection
    if (e1.PolyTyp == e2.PolyTyp)
    {
      if (this.IsEvenOddFillType(e1))
      {
        var oldE1WindCnt = e1.WindCnt;
        e1.WindCnt = e2.WindCnt;
        e2.WindCnt = oldE1WindCnt;
      }
      else
      {
        if (e1.WindCnt + e2.WindDelta === 0)
          e1.WindCnt = -e1.WindCnt;
        else
          e1.WindCnt += e2.WindDelta;
        if (e2.WindCnt - e1.WindDelta === 0)
          e2.WindCnt = -e2.WindCnt;
        else
          e2.WindCnt -= e1.WindDelta;
      }
    }
    else
    {
      if (!this.IsEvenOddFillType(e2))
        e1.WindCnt2 += e2.WindDelta;
      else
        e1.WindCnt2 = (e1.WindCnt2 === 0) ? 1 : 0;
      if (!this.IsEvenOddFillType(e1))
        e2.WindCnt2 -= e1.WindDelta;
      else
        e2.WindCnt2 = (e2.WindCnt2 === 0) ? 1 : 0;
    }
    var e1FillType, e2FillType, e1FillType2, e2FillType2;
    if (e1.PolyTyp == ClipperLib.PolyType.ptSubject)
    {
      e1FillType = this.m_SubjFillType;
      e1FillType2 = this.m_ClipFillType;
    }
    else
    {
      e1FillType = this.m_ClipFillType;
      e1FillType2 = this.m_SubjFillType;
    }
    if (e2.PolyTyp == ClipperLib.PolyType.ptSubject)
    {
      e2FillType = this.m_SubjFillType;
      e2FillType2 = this.m_ClipFillType;
    }
    else
    {
      e2FillType = this.m_ClipFillType;
      e2FillType2 = this.m_SubjFillType;
    }
    var e1Wc, e2Wc;
    switch (e1FillType)
    {
    case ClipperLib.PolyFillType.pftPositive:
      e1Wc = e1.WindCnt;
      break;
    case ClipperLib.PolyFillType.pftNegative:
      e1Wc = -e1.WindCnt;
      break;
    default:
      e1Wc = Math.abs(e1.WindCnt);
      break;
    }
    switch (e2FillType)
    {
    case ClipperLib.PolyFillType.pftPositive:
      e2Wc = e2.WindCnt;
      break;
    case ClipperLib.PolyFillType.pftNegative:
      e2Wc = -e2.WindCnt;
      break;
    default:
      e2Wc = Math.abs(e2.WindCnt);
      break;
    }
    if (e1Contributing && e2Contributing)
    {
			if ((e1Wc != 0 && e1Wc != 1) || (e2Wc != 0 && e2Wc != 1) ||
			(e1.PolyTyp != e2.PolyTyp && this.m_ClipType != ClipperLib.ClipType.ctXor))
			{
				this.AddLocalMaxPoly(e1, e2, pt);
			}
      else
      {
        this.AddOutPt(e1, pt);
        this.AddOutPt(e2, pt);
        ClipperLib.Clipper.SwapSides(e1, e2);
        ClipperLib.Clipper.SwapPolyIndexes(e1, e2);
      }
    }
    else if (e1Contributing)
    {
      if (e2Wc === 0 || e2Wc == 1)
      {
        this.AddOutPt(e1, pt);
        ClipperLib.Clipper.SwapSides(e1, e2);
        ClipperLib.Clipper.SwapPolyIndexes(e1, e2);
      }
    }
    else if (e2Contributing)
    {
      if (e1Wc === 0 || e1Wc == 1)
      {
        this.AddOutPt(e2, pt);
        ClipperLib.Clipper.SwapSides(e1, e2);
        ClipperLib.Clipper.SwapPolyIndexes(e1, e2);
      }
    }
		else if ( (e1Wc == 0 || e1Wc == 1) && (e2Wc == 0 || e2Wc == 1))
    {
      //neither edge is currently contributing ...
      var e1Wc2, e2Wc2;
      switch (e1FillType2)
      {
      case ClipperLib.PolyFillType.pftPositive:
        e1Wc2 = e1.WindCnt2;
        break;
      case ClipperLib.PolyFillType.pftNegative:
        e1Wc2 = -e1.WindCnt2;
        break;
      default:
        e1Wc2 = Math.abs(e1.WindCnt2);
        break;
      }
      switch (e2FillType2)
      {
      case ClipperLib.PolyFillType.pftPositive:
        e2Wc2 = e2.WindCnt2;
        break;
      case ClipperLib.PolyFillType.pftNegative:
        e2Wc2 = -e2.WindCnt2;
        break;
      default:
        e2Wc2 = Math.abs(e2.WindCnt2);
        break;
      }
      if (e1.PolyTyp != e2.PolyTyp)
      {
        this.AddLocalMinPoly(e1, e2, pt);
      }
      else if (e1Wc == 1 && e2Wc == 1)
        switch (this.m_ClipType)
        {
        case ClipperLib.ClipType.ctIntersection:
          if (e1Wc2 > 0 && e2Wc2 > 0)
            this.AddLocalMinPoly(e1, e2, pt);
          break;
        case ClipperLib.ClipType.ctUnion:
          if (e1Wc2 <= 0 && e2Wc2 <= 0)
            this.AddLocalMinPoly(e1, e2, pt);
          break;
        case ClipperLib.ClipType.ctDifference:
          if (((e1.PolyTyp == ClipperLib.PolyType.ptClip) && (e1Wc2 > 0) && (e2Wc2 > 0)) ||
            ((e1.PolyTyp == ClipperLib.PolyType.ptSubject) && (e1Wc2 <= 0) && (e2Wc2 <= 0)))
            this.AddLocalMinPoly(e1, e2, pt);
          break;
        case ClipperLib.ClipType.ctXor:
          this.AddLocalMinPoly(e1, e2, pt);
          break;
        }
      else
        ClipperLib.Clipper.SwapSides(e1, e2);
    }
  };
  ClipperLib.Clipper.prototype.DeleteFromAEL = function (e)
  {
    var AelPrev = e.PrevInAEL;
    var AelNext = e.NextInAEL;
    if (AelPrev === null && AelNext === null && (e != this.m_ActiveEdges))
      return;
    //already deleted
    if (AelPrev !== null)
      AelPrev.NextInAEL = AelNext;
    else
      this.m_ActiveEdges = AelNext;
    if (AelNext !== null)
      AelNext.PrevInAEL = AelPrev;
    e.NextInAEL = null;
    e.PrevInAEL = null;
  };
  ClipperLib.Clipper.prototype.DeleteFromSEL = function (e)
  {
    var SelPrev = e.PrevInSEL;
    var SelNext = e.NextInSEL;
    if (SelPrev === null && SelNext === null && (e != this.m_SortedEdges))
      return;
    //already deleted
    if (SelPrev !== null)
      SelPrev.NextInSEL = SelNext;
    else
      this.m_SortedEdges = SelNext;
    if (SelNext !== null)
      SelNext.PrevInSEL = SelPrev;
    e.NextInSEL = null;
    e.PrevInSEL = null;
  };
  ClipperLib.Clipper.prototype.UpdateEdgeIntoAEL = function (e)
  {
    if (e.NextInLML === null)
      ClipperLib.Error("UpdateEdgeIntoAEL: invalid call");
    var AelPrev = e.PrevInAEL;
    var AelNext = e.NextInAEL;
    e.NextInLML.OutIdx = e.OutIdx;
    if (AelPrev !== null)
      AelPrev.NextInAEL = e.NextInLML;
    else
      this.m_ActiveEdges = e.NextInLML;
    if (AelNext !== null)
      AelNext.PrevInAEL = e.NextInLML;
    e.NextInLML.Side = e.Side;
    e.NextInLML.WindDelta = e.WindDelta;
    e.NextInLML.WindCnt = e.WindCnt;
    e.NextInLML.WindCnt2 = e.WindCnt2;
    e = e.NextInLML;
    //    e.Curr = e.Bot;
    e.Curr.X = e.Bot.X;
    e.Curr.Y = e.Bot.Y;
		if(ClipperLib.use_xyz) e.Curr.Z = e.Bot.Z;
    e.PrevInAEL = AelPrev;
    e.NextInAEL = AelNext;
    if (!ClipperLib.ClipperBase.IsHorizontal(e))
      this.InsertScanbeam(e.Top.Y);
    return e;
  };
  ClipperLib.Clipper.prototype.ProcessHorizontals = function (isTopOfScanbeam)
  {
    var horzEdge = this.m_SortedEdges;
    while (horzEdge !== null)
    {
      this.DeleteFromSEL(horzEdge);
      this.ProcessHorizontal(horzEdge, isTopOfScanbeam);
      horzEdge = this.m_SortedEdges;
    }
  };
  ClipperLib.Clipper.prototype.GetHorzDirection = function (HorzEdge, $var)
  {
    if (HorzEdge.Bot.X < HorzEdge.Top.X)
    {
        $var.Left = HorzEdge.Bot.X;
        $var.Right = HorzEdge.Top.X;
        $var.Dir = ClipperLib.Direction.dLeftToRight;
    }
    else
    {
        $var.Left = HorzEdge.Top.X;
        $var.Right = HorzEdge.Bot.X;
        $var.Dir = ClipperLib.Direction.dRightToLeft;
    }
  };
  ClipperLib.Clipper.prototype.ProcessHorizontal = function (horzEdge, isTopOfScanbeam)
  {
    var $var = {Dir: null, Left: null, Right: null};
    this.GetHorzDirection(horzEdge, $var);
    var dir = $var.Dir;
    var horzLeft = $var.Left;
    var horzRight = $var.Right;

    var eLastHorz = horzEdge,
      eMaxPair = null;
    while (eLastHorz.NextInLML !== null && ClipperLib.ClipperBase.IsHorizontal(eLastHorz.NextInLML))
      eLastHorz = eLastHorz.NextInLML;
    if (eLastHorz.NextInLML === null)
      eMaxPair = this.GetMaximaPair(eLastHorz);
    for (;;)
    {
      var IsLastHorz = (horzEdge == eLastHorz);
      var e = this.GetNextInAEL(horzEdge, dir);
      while (e !== null)
      {
        //Break if we've got to the end of an intermediate horizontal edge ...
        //nb: Smaller Dx's are to the right of larger Dx's ABOVE the horizontal.
        if (e.Curr.X == horzEdge.Top.X && horzEdge.NextInLML !== null && e.Dx < horzEdge.NextInLML.Dx)
          break;
        var eNext = this.GetNextInAEL(e, dir);
        //saves eNext for later
        if ((dir == ClipperLib.Direction.dLeftToRight && e.Curr.X <= horzRight) || (dir == ClipperLib.Direction.dRightToLeft && e.Curr.X >= horzLeft))
        {
          //so far we're still in range of the horizontal Edge  but make sure
          //we're at the last of consec. horizontals when matching with eMaxPair
          if (e == eMaxPair && IsLastHorz)
          {
						if (horzEdge.OutIdx >= 0)
						{
							var op1 = this.AddOutPt(horzEdge, horzEdge.Top);
							var eNextHorz = this.m_SortedEdges;
							while (eNextHorz !== null)
							{
								if (eNextHorz.OutIdx >= 0 &&
									this.HorzSegmentsOverlap(horzEdge.Bot.X,
									horzEdge.Top.X, eNextHorz.Bot.X, eNextHorz.Top.X))
								{
									var op2 = this.AddOutPt(eNextHorz, eNextHorz.Bot);
									this.AddJoin(op2, op1, eNextHorz.Top);
								}
								eNextHorz = eNextHorz.NextInSEL;
							}
							this.AddGhostJoin(op1, horzEdge.Bot);
							this.AddLocalMaxPoly(horzEdge, eMaxPair, horzEdge.Top);
						}
						this.DeleteFromAEL(horzEdge);
						this.DeleteFromAEL(eMaxPair);
            return;
          }
          else if (dir == ClipperLib.Direction.dLeftToRight)
          {
            var Pt = new ClipperLib.IntPoint(e.Curr.X, horzEdge.Curr.Y);
            this.IntersectEdges(horzEdge, e, Pt);
          }
          else
          {
            var Pt = new ClipperLib.IntPoint(e.Curr.X, horzEdge.Curr.Y);
            this.IntersectEdges(e, horzEdge, Pt);
          }
          this.SwapPositionsInAEL(horzEdge, e);
        }
        else if ((dir == ClipperLib.Direction.dLeftToRight && e.Curr.X >= horzRight) || (dir == ClipperLib.Direction.dRightToLeft && e.Curr.X <= horzLeft))
          break;
        e = eNext;
      }
      //end while
      if (horzEdge.NextInLML !== null && ClipperLib.ClipperBase.IsHorizontal(horzEdge.NextInLML))
      {
        horzEdge = this.UpdateEdgeIntoAEL(horzEdge);
        if (horzEdge.OutIdx >= 0)
          this.AddOutPt(horzEdge, horzEdge.Bot);

          var $var = {Dir: dir, Left: horzLeft, Right: horzRight};
          this.GetHorzDirection(horzEdge, $var);
          dir = $var.Dir;
          horzLeft = $var.Left;
          horzRight = $var.Right;
      }
      else
        break;
    }
    //end for (;;)
    if (horzEdge.NextInLML !== null)
    {
      if (horzEdge.OutIdx >= 0)
      {
        var op1 = this.AddOutPt(horzEdge, horzEdge.Top);
				if (isTopOfScanbeam) this.AddGhostJoin(op1, horzEdge.Bot);
        horzEdge = this.UpdateEdgeIntoAEL(horzEdge);
        if (horzEdge.WindDelta === 0)
          return;
        //nb: HorzEdge is no longer horizontal here
        var ePrev = horzEdge.PrevInAEL;
        var eNext = horzEdge.NextInAEL;
        if (ePrev !== null && ePrev.Curr.X == horzEdge.Bot.X &&
          ePrev.Curr.Y == horzEdge.Bot.Y && ePrev.WindDelta !== 0 &&
          (ePrev.OutIdx >= 0 && ePrev.Curr.Y > ePrev.Top.Y &&
            ClipperLib.ClipperBase.SlopesEqual(horzEdge, ePrev, this.m_UseFullRange)))
        {
          var op2 = this.AddOutPt(ePrev, horzEdge.Bot);
          this.AddJoin(op1, op2, horzEdge.Top);
        }
        else if (eNext !== null && eNext.Curr.X == horzEdge.Bot.X &&
          eNext.Curr.Y == horzEdge.Bot.Y && eNext.WindDelta !== 0 &&
          eNext.OutIdx >= 0 && eNext.Curr.Y > eNext.Top.Y &&
          ClipperLib.ClipperBase.SlopesEqual(horzEdge, eNext, this.m_UseFullRange))
        {
          var op2 = this.AddOutPt(eNext, horzEdge.Bot);
          this.AddJoin(op1, op2, horzEdge.Top);
        }
      }
      else horzEdge = this.UpdateEdgeIntoAEL(horzEdge);
    }
  	else
    {
      if (horzEdge.OutIdx >= 0)
        this.AddOutPt(horzEdge, horzEdge.Top);
      this.DeleteFromAEL(horzEdge);
    }
  };
  ClipperLib.Clipper.prototype.GetNextInAEL = function (e, Direction)
  {
    return Direction == ClipperLib.Direction.dLeftToRight ? e.NextInAEL : e.PrevInAEL;
  };
  ClipperLib.Clipper.prototype.IsMinima = function (e)
  {
    return e !== null && (e.Prev.NextInLML != e) && (e.Next.NextInLML != e);
  };
  ClipperLib.Clipper.prototype.IsMaxima = function (e, Y)
  {
    return (e !== null && e.Top.Y == Y && e.NextInLML === null);
  };
  ClipperLib.Clipper.prototype.IsIntermediate = function (e, Y)
  {
    return (e.Top.Y == Y && e.NextInLML !== null);
  };
  ClipperLib.Clipper.prototype.GetMaximaPair = function (e)
  {
    var result = null;
    if ((ClipperLib.IntPoint.op_Equality(e.Next.Top, e.Top)) && e.Next.NextInLML === null)
      result = e.Next;
    else if ((ClipperLib.IntPoint.op_Equality(e.Prev.Top, e.Top)) && e.Prev.NextInLML === null)
      result = e.Prev;
    if (result !== null && (result.OutIdx == -2 || (result.NextInAEL == result.PrevInAEL && !ClipperLib.ClipperBase.IsHorizontal(result))))
      return null;
    return result;
  };

  ClipperLib.Clipper.prototype.ProcessIntersections = function (topY)
  {
    if (this.m_ActiveEdges == null)
      return true;
    try
    {
      this.BuildIntersectList(topY);
      if (this.m_IntersectList.length == 0)
        return true;
      if (this.m_IntersectList.length == 1 || this.FixupIntersectionOrder())
        this.ProcessIntersectList();
      else
        return false;
    }
    catch ($$e2)
    {
      this.m_SortedEdges = null;
      this.m_IntersectList.length = 0;
      ClipperLib.Error("ProcessIntersections error");
    }
    this.m_SortedEdges = null;
    return true;
  };
  ClipperLib.Clipper.prototype.BuildIntersectList = function (topY)
  {
    if (this.m_ActiveEdges === null)
      return;
    //prepare for sorting ...
    var e = this.m_ActiveEdges;
    //console.log(JSON.stringify(JSON.decycle( e )));
    this.m_SortedEdges = e;
    while (e !== null)
    {
      e.PrevInSEL = e.PrevInAEL;
      e.NextInSEL = e.NextInAEL;
      e.Curr.X = ClipperLib.Clipper.TopX(e, topY);
      e = e.NextInAEL;
    }
    //bubblesort ...
    var isModified = true;
    while (isModified && this.m_SortedEdges !== null)
    {
      isModified = false;
      e = this.m_SortedEdges;
      while (e.NextInSEL !== null)
      {
        var eNext = e.NextInSEL;
        var pt = new ClipperLib.IntPoint();
        //console.log("e.Curr.X: " + e.Curr.X + " eNext.Curr.X" + eNext.Curr.X);
        if (e.Curr.X > eNext.Curr.X)
        {
					this.IntersectPoint(e, eNext, pt);
          var newNode = new ClipperLib.IntersectNode();
          newNode.Edge1 = e;
          newNode.Edge2 = eNext;
          //newNode.Pt = pt;
          newNode.Pt.X = pt.X;
          newNode.Pt.Y = pt.Y;
          if(ClipperLib.use_xyz) newNode.Pt.Z = pt.Z;
          this.m_IntersectList.push(newNode);
          this.SwapPositionsInSEL(e, eNext);
          isModified = true;
        }
        else
          e = eNext;
      }
      if (e.PrevInSEL !== null)
        e.PrevInSEL.NextInSEL = null;
      else
        break;
    }
    this.m_SortedEdges = null;
  };
  ClipperLib.Clipper.prototype.EdgesAdjacent = function (inode)
  {
    return (inode.Edge1.NextInSEL == inode.Edge2) || (inode.Edge1.PrevInSEL == inode.Edge2);
  };
  ClipperLib.Clipper.IntersectNodeSort = function (node1, node2)
  {
    //the following typecast is safe because the differences in Pt.Y will
    //be limited to the height of the scanbeam.
    return (node2.Pt.Y - node1.Pt.Y);
  };
  ClipperLib.Clipper.prototype.FixupIntersectionOrder = function ()
  {
    //pre-condition: intersections are sorted bottom-most first.
    //Now it's crucial that intersections are made only between adjacent edges,
    //so to ensure this the order of intersections may need adjusting ...
    this.m_IntersectList.sort(this.m_IntersectNodeComparer);
    this.CopyAELToSEL();
    var cnt = this.m_IntersectList.length;
    for (var i = 0; i < cnt; i++)
    {
      if (!this.EdgesAdjacent(this.m_IntersectList[i]))
      {
        var j = i + 1;
        while (j < cnt && !this.EdgesAdjacent(this.m_IntersectList[j]))
          j++;
        if (j == cnt)
          return false;
        var tmp = this.m_IntersectList[i];
        this.m_IntersectList[i] = this.m_IntersectList[j];
        this.m_IntersectList[j] = tmp;
      }
      this.SwapPositionsInSEL(this.m_IntersectList[i].Edge1, this.m_IntersectList[i].Edge2);
    }
    return true;
  };
  ClipperLib.Clipper.prototype.ProcessIntersectList = function ()
  {
    for (var i = 0, ilen = this.m_IntersectList.length; i < ilen; i++)
    {
      var iNode = this.m_IntersectList[i];
      this.IntersectEdges(iNode.Edge1, iNode.Edge2, iNode.Pt);
      this.SwapPositionsInAEL(iNode.Edge1, iNode.Edge2);
    }
    this.m_IntersectList.length = 0;
  };
  /*
  --------------------------------
  Round speedtest: http://jsperf.com/fastest-round
  --------------------------------
  */
  var R1 = function (a)
  {
    return a < 0 ? Math.ceil(a - 0.5) : Math.round(a)
  };
  var R2 = function (a)
  {
    return a < 0 ? Math.ceil(a - 0.5) : Math.floor(a + 0.5)
  };
  var R3 = function (a)
  {
    return a < 0 ? -Math.round(Math.abs(a)) : Math.round(a)
  };
  var R4 = function (a)
  {
    if (a < 0)
    {
      a -= 0.5;
      return a < -2147483648 ? Math.ceil(a) : a | 0;
    }
    else
    {
      a += 0.5;
      return a > 2147483647 ? Math.floor(a) : a | 0;
    }
  };
  if (browser.msie) ClipperLib.Clipper.Round = R1;
  else if (browser.chromium) ClipperLib.Clipper.Round = R3;
  else if (browser.safari) ClipperLib.Clipper.Round = R4;
  else ClipperLib.Clipper.Round = R2; // eg. browser.chrome || browser.firefox || browser.opera
  ClipperLib.Clipper.TopX = function (edge, currentY)
  {
    //if (edge.Bot == edge.Curr) alert ("edge.Bot = edge.Curr");
    //if (edge.Bot == edge.Top) alert ("edge.Bot = edge.Top");
    if (currentY == edge.Top.Y)
      return edge.Top.X;
    return edge.Bot.X + ClipperLib.Clipper.Round(edge.Dx * (currentY - edge.Bot.Y));
  };
  ClipperLib.Clipper.prototype.IntersectPoint = function (edge1, edge2, ip)
  {
    ip.X = 0;
    ip.Y = 0;
    var b1, b2;
    //nb: with very large coordinate values, it's possible for SlopesEqual() to
    //return false but for the edge.Dx value be equal due to double precision rounding.
    if (edge1.Dx == edge2.Dx)
		{
			ip.Y = edge1.Curr.Y;
			ip.X = ClipperLib.Clipper.TopX(edge1, ip.Y);
			return;
    }
    if (edge1.Delta.X === 0)
    {
      ip.X = edge1.Bot.X;
      if (ClipperLib.ClipperBase.IsHorizontal(edge2))
      {
        ip.Y = edge2.Bot.Y;
      }
      else
      {
        b2 = edge2.Bot.Y - (edge2.Bot.X / edge2.Dx);
        ip.Y = ClipperLib.Clipper.Round(ip.X / edge2.Dx + b2);
      }
    }
    else if (edge2.Delta.X === 0)
    {
      ip.X = edge2.Bot.X;
      if (ClipperLib.ClipperBase.IsHorizontal(edge1))
      {
        ip.Y = edge1.Bot.Y;
      }
      else
      {
        b1 = edge1.Bot.Y - (edge1.Bot.X / edge1.Dx);
        ip.Y = ClipperLib.Clipper.Round(ip.X / edge1.Dx + b1);
      }
    }
    else
    {
      b1 = edge1.Bot.X - edge1.Bot.Y * edge1.Dx;
      b2 = edge2.Bot.X - edge2.Bot.Y * edge2.Dx;
      var q = (b2 - b1) / (edge1.Dx - edge2.Dx);
      ip.Y = ClipperLib.Clipper.Round(q);
      if (Math.abs(edge1.Dx) < Math.abs(edge2.Dx))
        ip.X = ClipperLib.Clipper.Round(edge1.Dx * q + b1);
      else
        ip.X = ClipperLib.Clipper.Round(edge2.Dx * q + b2);
    }
    if (ip.Y < edge1.Top.Y || ip.Y < edge2.Top.Y)
    {
      if (edge1.Top.Y > edge2.Top.Y)
      {
        ip.Y = edge1.Top.Y;
        ip.X = ClipperLib.Clipper.TopX(edge2, edge1.Top.Y);
        return ip.X < edge1.Top.X;
      }
      else
        ip.Y = edge2.Top.Y;
      if (Math.abs(edge1.Dx) < Math.abs(edge2.Dx))
        ip.X = ClipperLib.Clipper.TopX(edge1, ip.Y);
      else
        ip.X = ClipperLib.Clipper.TopX(edge2, ip.Y);
    }
		//finally, don't allow 'ip' to be BELOW curr.Y (ie bottom of scanbeam) ...
		if (ip.Y > edge1.Curr.Y)
		{
			ip.Y = edge1.Curr.Y;
			//better to use the more vertical edge to derive X ...
			if (Math.abs(edge1.Dx) > Math.abs(edge2.Dx))
				ip.X = ClipperLib.Clipper.TopX(edge2, ip.Y);
			else
				ip.X = ClipperLib.Clipper.TopX(edge1, ip.Y);
		}
  };

  ClipperLib.Clipper.prototype.ProcessEdgesAtTopOfScanbeam = function (topY)
  {
    var e = this.m_ActiveEdges;
    while (e !== null)
    {
      //1. process maxima, treating them as if they're 'bent' horizontal edges,
      //   but exclude maxima with horizontal edges. nb: e can't be a horizontal.
      var IsMaximaEdge = this.IsMaxima(e, topY);
      if (IsMaximaEdge)
      {
        var eMaxPair = this.GetMaximaPair(e);
        IsMaximaEdge = (eMaxPair === null || !ClipperLib.ClipperBase.IsHorizontal(eMaxPair));
      }
      if (IsMaximaEdge)
      {
        var ePrev = e.PrevInAEL;
        this.DoMaxima(e);
        if (ePrev === null)
          e = this.m_ActiveEdges;
        else
          e = ePrev.NextInAEL;
      }
      else
      {
        //2. promote horizontal edges, otherwise update Curr.X and Curr.Y ...
        if (this.IsIntermediate(e, topY) && ClipperLib.ClipperBase.IsHorizontal(e.NextInLML))
        {
          e = this.UpdateEdgeIntoAEL(e);
          if (e.OutIdx >= 0)
            this.AddOutPt(e, e.Bot);
          this.AddEdgeToSEL(e);
        }
        else
        {
          e.Curr.X = ClipperLib.Clipper.TopX(e, topY);
          e.Curr.Y = topY;
        }
        if (this.StrictlySimple)
        {
          var ePrev = e.PrevInAEL;
          if ((e.OutIdx >= 0) && (e.WindDelta !== 0) && ePrev !== null &&
            (ePrev.OutIdx >= 0) && (ePrev.Curr.X == e.Curr.X) &&
            (ePrev.WindDelta !== 0))
          {
           	var ip = new ClipperLib.IntPoint(e.Curr);

						if(ClipperLib.use_xyz)
						{
							this.SetZ(ip, ePrev, e);
						}

            var op = this.AddOutPt(ePrev, ip);
            var op2 = this.AddOutPt(e, ip);
            this.AddJoin(op, op2, ip);
            //StrictlySimple (type-3) join
          }
        }
        e = e.NextInAEL;
      }
    }
    //3. Process horizontals at the Top of the scanbeam ...
    this.ProcessHorizontals(true);
    //4. Promote intermediate vertices ...
    e = this.m_ActiveEdges;
    while (e !== null)
    {
      if (this.IsIntermediate(e, topY))
      {
        var op = null;
        if (e.OutIdx >= 0)
          op = this.AddOutPt(e, e.Top);
        e = this.UpdateEdgeIntoAEL(e);
        //if output polygons share an edge, they'll need joining later ...
        var ePrev = e.PrevInAEL;
        var eNext = e.NextInAEL;
        if (ePrev !== null && ePrev.Curr.X == e.Bot.X &&
          ePrev.Curr.Y == e.Bot.Y && op !== null &&
          ePrev.OutIdx >= 0 && ePrev.Curr.Y > ePrev.Top.Y &&
          ClipperLib.ClipperBase.SlopesEqual(e, ePrev, this.m_UseFullRange) &&
          (e.WindDelta !== 0) && (ePrev.WindDelta !== 0))
        {
          var op2 = this.AddOutPt(ePrev, e.Bot);
          this.AddJoin(op, op2, e.Top);
        }
        else if (eNext !== null && eNext.Curr.X == e.Bot.X &&
          eNext.Curr.Y == e.Bot.Y && op !== null &&
          eNext.OutIdx >= 0 && eNext.Curr.Y > eNext.Top.Y &&
          ClipperLib.ClipperBase.SlopesEqual(e, eNext, this.m_UseFullRange) &&
          (e.WindDelta !== 0) && (eNext.WindDelta !== 0))
        {
          var op2 = this.AddOutPt(eNext, e.Bot);
          this.AddJoin(op, op2, e.Top);
        }
      }
      e = e.NextInAEL;
    }
  };
  ClipperLib.Clipper.prototype.DoMaxima = function (e)
  {
    var eMaxPair = this.GetMaximaPair(e);
    if (eMaxPair === null)
    {
      if (e.OutIdx >= 0)
        this.AddOutPt(e, e.Top);
      this.DeleteFromAEL(e);
      return;
    }
    var eNext = e.NextInAEL;
    while (eNext !== null && eNext != eMaxPair)
    {
      this.IntersectEdges(e, eNext, e.Top);
      this.SwapPositionsInAEL(e, eNext);
      eNext = e.NextInAEL;
    }
    if (e.OutIdx == -1 && eMaxPair.OutIdx == -1)
    {
      this.DeleteFromAEL(e);
      this.DeleteFromAEL(eMaxPair);
    }
    else if (e.OutIdx >= 0 && eMaxPair.OutIdx >= 0)
    {
    	if (e.OutIdx >= 0) this.AddLocalMaxPoly(e, eMaxPair, e.Top);
      this.DeleteFromAEL(e);
      this.DeleteFromAEL(eMaxPair);
    }
    else if (ClipperLib.use_lines && e.WindDelta === 0)
    {
      if (e.OutIdx >= 0)
      {
        this.AddOutPt(e, e.Top);
        e.OutIdx = -1;
      }
      this.DeleteFromAEL(e);
      if (eMaxPair.OutIdx >= 0)
      {
        this.AddOutPt(eMaxPair, e.Top);
        eMaxPair.OutIdx = -1;
      }
      this.DeleteFromAEL(eMaxPair);
    }
    else
      ClipperLib.Error("DoMaxima error");
  };
  ClipperLib.Clipper.ReversePaths = function (polys)
  {
    for (var i = 0, len = polys.length; i < len; i++)
      polys[i].reverse();
  };
  ClipperLib.Clipper.Orientation = function (poly)
  {
    return ClipperLib.Clipper.Area(poly) >= 0;
  };
  ClipperLib.Clipper.prototype.PointCount = function (pts)
  {
    if (pts === null)
      return 0;
    var result = 0;
    var p = pts;
    do {
      result++;
      p = p.Next;
    }
    while (p != pts)
    return result;
  };
  ClipperLib.Clipper.prototype.BuildResult = function (polyg)
  {
    ClipperLib.Clear(polyg);
    for (var i = 0, ilen = this.m_PolyOuts.length; i < ilen; i++)
    {
      var outRec = this.m_PolyOuts[i];
      if (outRec.Pts === null)
        continue;
      var p = outRec.Pts.Prev;
      var cnt = this.PointCount(p);
      if (cnt < 2)
        continue;
      var pg = new Array(cnt);
      for (var j = 0; j < cnt; j++)
      {
        pg[j] = p.Pt;
        p = p.Prev;
      }
      polyg.push(pg);
    }
  };
  ClipperLib.Clipper.prototype.BuildResult2 = function (polytree)
  {
    polytree.Clear();
    //add each output polygon/contour to polytree ...
    //polytree.m_AllPolys.set_Capacity(this.m_PolyOuts.length);
    for (var i = 0, ilen = this.m_PolyOuts.length; i < ilen; i++)
    {
      var outRec = this.m_PolyOuts[i];
      var cnt = this.PointCount(outRec.Pts);
      if ((outRec.IsOpen && cnt < 2) || (!outRec.IsOpen && cnt < 3))
        continue;
      this.FixHoleLinkage(outRec);
      var pn = new ClipperLib.PolyNode();
      polytree.m_AllPolys.push(pn);
      outRec.PolyNode = pn;
      pn.m_polygon.length = cnt;
      var op = outRec.Pts.Prev;
      for (var j = 0; j < cnt; j++)
      {
        pn.m_polygon[j] = op.Pt;
        op = op.Prev;
      }
    }
    //fixup PolyNode links etc ...
    //polytree.m_Childs.set_Capacity(this.m_PolyOuts.length);
    for (var i = 0, ilen = this.m_PolyOuts.length; i < ilen; i++)
    {
      var outRec = this.m_PolyOuts[i];
      if (outRec.PolyNode === null)
        continue;
      else if (outRec.IsOpen)
      {
        outRec.PolyNode.IsOpen = true;
        polytree.AddChild(outRec.PolyNode);
      }
      else if (outRec.FirstLeft !== null && outRec.FirstLeft.PolyNode != null)
        outRec.FirstLeft.PolyNode.AddChild(outRec.PolyNode);
      else
        polytree.AddChild(outRec.PolyNode);
    }
  };
  ClipperLib.Clipper.prototype.FixupOutPolygon = function (outRec)
  {
    //FixupOutPolygon() - removes duplicate points and simplifies consecutive
    //parallel edges by removing the middle vertex.
    var lastOK = null;
    outRec.BottomPt = null;
    var pp = outRec.Pts;
    for (;;)
    {
      if (pp.Prev == pp || pp.Prev == pp.Next)
      {
        outRec.Pts = null;
        return;
      }
      //test for duplicate points and collinear edges ...
      if ((ClipperLib.IntPoint.op_Equality(pp.Pt, pp.Next.Pt)) || (ClipperLib.IntPoint.op_Equality(pp.Pt, pp.Prev.Pt)) ||
        (ClipperLib.ClipperBase.SlopesEqual(pp.Prev.Pt, pp.Pt, pp.Next.Pt, this.m_UseFullRange) &&
          (!this.PreserveCollinear || !this.Pt2IsBetweenPt1AndPt3(pp.Prev.Pt, pp.Pt, pp.Next.Pt))))
      {
        lastOK = null;
        pp.Prev.Next = pp.Next;
        pp.Next.Prev = pp.Prev;
        pp = pp.Prev;
      }
      else if (pp == lastOK)
        break;
      else
      {
        if (lastOK === null)
          lastOK = pp;
        pp = pp.Next;
      }
    }
    outRec.Pts = pp;
  };
  ClipperLib.Clipper.prototype.DupOutPt = function (outPt, InsertAfter)
  {
    var result = new ClipperLib.OutPt();
    //result.Pt = outPt.Pt;
    result.Pt.X = outPt.Pt.X;
    result.Pt.Y = outPt.Pt.Y;
		if(ClipperLib.use_xyz) result.Pt.Z = outPt.Pt.Z;
    result.Idx = outPt.Idx;
    if (InsertAfter)
    {
      result.Next = outPt.Next;
      result.Prev = outPt;
      outPt.Next.Prev = result;
      outPt.Next = result;
    }
    else
    {
      result.Prev = outPt.Prev;
      result.Next = outPt;
      outPt.Prev.Next = result;
      outPt.Prev = result;
    }
    return result;
  };
  ClipperLib.Clipper.prototype.GetOverlap = function (a1, a2, b1, b2, $val)
  {
    if (a1 < a2)
    {
      if (b1 < b2)
      {
        $val.Left = Math.max(a1, b1);
        $val.Right = Math.min(a2, b2);
      }
      else
      {
        $val.Left = Math.max(a1, b2);
        $val.Right = Math.min(a2, b1);
      }
    }
    else
    {
      if (b1 < b2)
      {
        $val.Left = Math.max(a2, b1);
        $val.Right = Math.min(a1, b2);
      }
      else
      {
        $val.Left = Math.max(a2, b2);
        $val.Right = Math.min(a1, b1);
      }
    }
    return $val.Left < $val.Right;
  };
  ClipperLib.Clipper.prototype.JoinHorz = function (op1, op1b, op2, op2b, Pt, DiscardLeft)
  {
    var Dir1 = (op1.Pt.X > op1b.Pt.X ? ClipperLib.Direction.dRightToLeft : ClipperLib.Direction.dLeftToRight);
    var Dir2 = (op2.Pt.X > op2b.Pt.X ? ClipperLib.Direction.dRightToLeft : ClipperLib.Direction.dLeftToRight);
    if (Dir1 == Dir2)
      return false;
    //When DiscardLeft, we want Op1b to be on the Left of Op1, otherwise we
    //want Op1b to be on the Right. (And likewise with Op2 and Op2b.)
    //So, to facilitate this while inserting Op1b and Op2b ...
    //when DiscardLeft, make sure we're AT or RIGHT of Pt before adding Op1b,
    //otherwise make sure we're AT or LEFT of Pt. (Likewise with Op2b.)
    if (Dir1 == ClipperLib.Direction.dLeftToRight)
    {
      while (op1.Next.Pt.X <= Pt.X &&
        op1.Next.Pt.X >= op1.Pt.X && op1.Next.Pt.Y == Pt.Y)
        op1 = op1.Next;
      if (DiscardLeft && (op1.Pt.X != Pt.X))
        op1 = op1.Next;
      op1b = this.DupOutPt(op1, !DiscardLeft);
      if (ClipperLib.IntPoint.op_Inequality(op1b.Pt, Pt))
      {
        op1 = op1b;
        //op1.Pt = Pt;
        op1.Pt.X = Pt.X;
        op1.Pt.Y = Pt.Y;
        if(ClipperLib.use_xyz) op1.Pt.Z = Pt.Z;
        op1b = this.DupOutPt(op1, !DiscardLeft);
      }
    }
    else
    {
      while (op1.Next.Pt.X >= Pt.X &&
        op1.Next.Pt.X <= op1.Pt.X && op1.Next.Pt.Y == Pt.Y)
        op1 = op1.Next;
      if (!DiscardLeft && (op1.Pt.X != Pt.X))
        op1 = op1.Next;
      op1b = this.DupOutPt(op1, DiscardLeft);
      if (ClipperLib.IntPoint.op_Inequality(op1b.Pt, Pt))
      {
        op1 = op1b;
        //op1.Pt = Pt;
        op1.Pt.X = Pt.X;
        op1.Pt.Y = Pt.Y;
				if(ClipperLib.use_xyz) op1.Pt.Z = Pt.Z;
        op1b = this.DupOutPt(op1, DiscardLeft);
      }
    }
    if (Dir2 == ClipperLib.Direction.dLeftToRight)
    {
      while (op2.Next.Pt.X <= Pt.X &&
        op2.Next.Pt.X >= op2.Pt.X && op2.Next.Pt.Y == Pt.Y)
        op2 = op2.Next;
      if (DiscardLeft && (op2.Pt.X != Pt.X))
        op2 = op2.Next;
      op2b = this.DupOutPt(op2, !DiscardLeft);
      if (ClipperLib.IntPoint.op_Inequality(op2b.Pt, Pt))
      {
        op2 = op2b;
        //op2.Pt = Pt;
        op2.Pt.X = Pt.X;
        op2.Pt.Y = Pt.Y;
				if(ClipperLib.use_xyz) op2.Pt.Z = Pt.Z;
        op2b = this.DupOutPt(op2, !DiscardLeft);
      }
    }
    else
    {
      while (op2.Next.Pt.X >= Pt.X &&
        op2.Next.Pt.X <= op2.Pt.X && op2.Next.Pt.Y == Pt.Y)
        op2 = op2.Next;
      if (!DiscardLeft && (op2.Pt.X != Pt.X))
        op2 = op2.Next;
      op2b = this.DupOutPt(op2, DiscardLeft);
      if (ClipperLib.IntPoint.op_Inequality(op2b.Pt, Pt))
      {
        op2 = op2b;
        //op2.Pt = Pt;
        op2.Pt.X = Pt.X;
        op2.Pt.Y = Pt.Y;
				if(ClipperLib.use_xyz) op2.Pt.Z = Pt.Z;
        op2b = this.DupOutPt(op2, DiscardLeft);
      }
    }
    if ((Dir1 == ClipperLib.Direction.dLeftToRight) == DiscardLeft)
    {
      op1.Prev = op2;
      op2.Next = op1;
      op1b.Next = op2b;
      op2b.Prev = op1b;
    }
    else
    {
      op1.Next = op2;
      op2.Prev = op1;
      op1b.Prev = op2b;
      op2b.Next = op1b;
    }
    return true;
  };
  ClipperLib.Clipper.prototype.JoinPoints = function (j, outRec1, outRec2)
  {
    var op1 = j.OutPt1,
      op1b = new ClipperLib.OutPt();
    var op2 = j.OutPt2,
      op2b = new ClipperLib.OutPt();
    //There are 3 kinds of joins for output polygons ...
    //1. Horizontal joins where Join.OutPt1 & Join.OutPt2 are a vertices anywhere
    //along (horizontal) collinear edges (& Join.OffPt is on the same horizontal).
    //2. Non-horizontal joins where Join.OutPt1 & Join.OutPt2 are at the same
    //location at the Bottom of the overlapping segment (& Join.OffPt is above).
    //3. StrictlySimple joins where edges touch but are not collinear and where
    //Join.OutPt1, Join.OutPt2 & Join.OffPt all share the same point.
    var isHorizontal = (j.OutPt1.Pt.Y == j.OffPt.Y);
    if (isHorizontal && (ClipperLib.IntPoint.op_Equality(j.OffPt, j.OutPt1.Pt)) && (ClipperLib.IntPoint.op_Equality(j.OffPt, j.OutPt2.Pt)))
    {
      //Strictly Simple join ...
			if (outRec1 != outRec2) return false;

      op1b = j.OutPt1.Next;
      while (op1b != op1 && (ClipperLib.IntPoint.op_Equality(op1b.Pt, j.OffPt)))
        op1b = op1b.Next;
      var reverse1 = (op1b.Pt.Y > j.OffPt.Y);
      op2b = j.OutPt2.Next;
      while (op2b != op2 && (ClipperLib.IntPoint.op_Equality(op2b.Pt, j.OffPt)))
        op2b = op2b.Next;
      var reverse2 = (op2b.Pt.Y > j.OffPt.Y);
      if (reverse1 == reverse2)
        return false;
      if (reverse1)
      {
        op1b = this.DupOutPt(op1, false);
        op2b = this.DupOutPt(op2, true);
        op1.Prev = op2;
        op2.Next = op1;
        op1b.Next = op2b;
        op2b.Prev = op1b;
        j.OutPt1 = op1;
        j.OutPt2 = op1b;
        return true;
      }
      else
      {
        op1b = this.DupOutPt(op1, true);
        op2b = this.DupOutPt(op2, false);
        op1.Next = op2;
        op2.Prev = op1;
        op1b.Prev = op2b;
        op2b.Next = op1b;
        j.OutPt1 = op1;
        j.OutPt2 = op1b;
        return true;
      }
    }
    else if (isHorizontal)
    {
      //treat horizontal joins differently to non-horizontal joins since with
      //them we're not yet sure where the overlapping is. OutPt1.Pt & OutPt2.Pt
      //may be anywhere along the horizontal edge.
      op1b = op1;
      while (op1.Prev.Pt.Y == op1.Pt.Y && op1.Prev != op1b && op1.Prev != op2)
        op1 = op1.Prev;
      while (op1b.Next.Pt.Y == op1b.Pt.Y && op1b.Next != op1 && op1b.Next != op2)
        op1b = op1b.Next;
      if (op1b.Next == op1 || op1b.Next == op2)
        return false;
      //a flat 'polygon'
      op2b = op2;
      while (op2.Prev.Pt.Y == op2.Pt.Y && op2.Prev != op2b && op2.Prev != op1b)
        op2 = op2.Prev;
      while (op2b.Next.Pt.Y == op2b.Pt.Y && op2b.Next != op2 && op2b.Next != op1)
        op2b = op2b.Next;
      if (op2b.Next == op2 || op2b.Next == op1)
        return false;
      //a flat 'polygon'
      //Op1 -. Op1b & Op2 -. Op2b are the extremites of the horizontal edges

      var $val = {Left: null, Right: null};
      if (!this.GetOverlap(op1.Pt.X, op1b.Pt.X, op2.Pt.X, op2b.Pt.X, $val))
        return false;
      var Left = $val.Left;
      var Right = $val.Right;

      //DiscardLeftSide: when overlapping edges are joined, a spike will created
      //which needs to be cleaned up. However, we don't want Op1 or Op2 caught up
      //on the discard Side as either may still be needed for other joins ...
      var Pt = new ClipperLib.IntPoint();
      var DiscardLeftSide;
      if (op1.Pt.X >= Left && op1.Pt.X <= Right)
      {
        //Pt = op1.Pt;
        Pt.X = op1.Pt.X;
        Pt.Y = op1.Pt.Y;
        if(ClipperLib.use_xyz) Pt.Z = op1.Pt.Z;
        DiscardLeftSide = (op1.Pt.X > op1b.Pt.X);
      }
      else if (op2.Pt.X >= Left && op2.Pt.X <= Right)
      {
        //Pt = op2.Pt;
        Pt.X = op2.Pt.X;
        Pt.Y = op2.Pt.Y;
				if(ClipperLib.use_xyz) Pt.Z = op2.Pt.Z;
        DiscardLeftSide = (op2.Pt.X > op2b.Pt.X);
      }
      else if (op1b.Pt.X >= Left && op1b.Pt.X <= Right)
      {
        //Pt = op1b.Pt;
        Pt.X = op1b.Pt.X;
        Pt.Y = op1b.Pt.Y;
        if(ClipperLib.use_xyz) Pt.Z = op1b.Pt.Z;
        DiscardLeftSide = op1b.Pt.X > op1.Pt.X;
      }
      else
      {
        //Pt = op2b.Pt;
        Pt.X = op2b.Pt.X;
        Pt.Y = op2b.Pt.Y;
				if(ClipperLib.use_xyz) Pt.Z = op2b.Pt.Z;
        DiscardLeftSide = (op2b.Pt.X > op2.Pt.X);
      }
      j.OutPt1 = op1;
      j.OutPt2 = op2;
      return this.JoinHorz(op1, op1b, op2, op2b, Pt, DiscardLeftSide);
    }
    else
    {
      //nb: For non-horizontal joins ...
      //    1. Jr.OutPt1.Pt.Y == Jr.OutPt2.Pt.Y
      //    2. Jr.OutPt1.Pt > Jr.OffPt.Y
      //make sure the polygons are correctly oriented ...
      op1b = op1.Next;
      while ((ClipperLib.IntPoint.op_Equality(op1b.Pt, op1.Pt)) && (op1b != op1))
        op1b = op1b.Next;
      var Reverse1 = ((op1b.Pt.Y > op1.Pt.Y) || !ClipperLib.ClipperBase.SlopesEqual(op1.Pt, op1b.Pt, j.OffPt, this.m_UseFullRange));
      if (Reverse1)
      {
        op1b = op1.Prev;
        while ((ClipperLib.IntPoint.op_Equality(op1b.Pt, op1.Pt)) && (op1b != op1))
          op1b = op1b.Prev;
        if ((op1b.Pt.Y > op1.Pt.Y) || !ClipperLib.ClipperBase.SlopesEqual(op1.Pt, op1b.Pt, j.OffPt, this.m_UseFullRange))
          return false;
      }
      op2b = op2.Next;
      while ((ClipperLib.IntPoint.op_Equality(op2b.Pt, op2.Pt)) && (op2b != op2))
        op2b = op2b.Next;
      var Reverse2 = ((op2b.Pt.Y > op2.Pt.Y) || !ClipperLib.ClipperBase.SlopesEqual(op2.Pt, op2b.Pt, j.OffPt, this.m_UseFullRange));
      if (Reverse2)
      {
        op2b = op2.Prev;
        while ((ClipperLib.IntPoint.op_Equality(op2b.Pt, op2.Pt)) && (op2b != op2))
          op2b = op2b.Prev;
        if ((op2b.Pt.Y > op2.Pt.Y) || !ClipperLib.ClipperBase.SlopesEqual(op2.Pt, op2b.Pt, j.OffPt, this.m_UseFullRange))
          return false;
      }
      if ((op1b == op1) || (op2b == op2) || (op1b == op2b) ||
        ((outRec1 == outRec2) && (Reverse1 == Reverse2)))
        return false;
      if (Reverse1)
      {
        op1b = this.DupOutPt(op1, false);
        op2b = this.DupOutPt(op2, true);
        op1.Prev = op2;
        op2.Next = op1;
        op1b.Next = op2b;
        op2b.Prev = op1b;
        j.OutPt1 = op1;
        j.OutPt2 = op1b;
        return true;
      }
      else
      {
        op1b = this.DupOutPt(op1, true);
        op2b = this.DupOutPt(op2, false);
        op1.Next = op2;
        op2.Prev = op1;
        op1b.Prev = op2b;
        op2b.Next = op1b;
        j.OutPt1 = op1;
        j.OutPt2 = op1b;
        return true;
      }
    }
  };
  ClipperLib.Clipper.GetBounds = function (paths)
  {
    var i = 0,
      cnt = paths.length;
    while (i < cnt && paths[i].length == 0) i++;
    if (i == cnt) return new ClipperLib.IntRect(0, 0, 0, 0);
    var result = new ClipperLib.IntRect();
    result.left = paths[i][0].X;
    result.right = result.left;
    result.top = paths[i][0].Y;
    result.bottom = result.top;
    for (; i < cnt; i++)
      for (var j = 0, jlen = paths[i].length; j < jlen; j++)
      {
        if (paths[i][j].X < result.left) result.left = paths[i][j].X;
        else if (paths[i][j].X > result.right) result.right = paths[i][j].X;
        if (paths[i][j].Y < result.top) result.top = paths[i][j].Y;
        else if (paths[i][j].Y > result.bottom) result.bottom = paths[i][j].Y;
      }
    return result;
  }
  ClipperLib.Clipper.prototype.GetBounds2 = function (ops)
  {
    var opStart = ops;
    var result = new ClipperLib.IntRect();
    result.left = ops.Pt.X;
    result.right = ops.Pt.X;
    result.top = ops.Pt.Y;
    result.bottom = ops.Pt.Y;
    ops = ops.Next;
    while (ops != opStart)
    {
      if (ops.Pt.X < result.left)
        result.left = ops.Pt.X;
      if (ops.Pt.X > result.right)
        result.right = ops.Pt.X;
      if (ops.Pt.Y < result.top)
        result.top = ops.Pt.Y;
      if (ops.Pt.Y > result.bottom)
        result.bottom = ops.Pt.Y;
      ops = ops.Next;
    }
    return result;
  };

  ClipperLib.Clipper.PointInPolygon = function (pt, path)
  {
    //returns 0 if false, +1 if true, -1 if pt ON polygon boundary
		//See "The Point in Polygon Problem for Arbitrary Polygons" by Hormann & Agathos
    //http://citeseerx.ist.psu.edu/viewdoc/download?doi=10.1.1.88.5498&rep=rep1&type=pdf
    var result = 0,
      cnt = path.length;
    if (cnt < 3)
      return 0;
    var ip = path[0];
    for (var i = 1; i <= cnt; ++i)
    {
      var ipNext = (i == cnt ? path[0] : path[i]);
      if (ipNext.Y == pt.Y)
      {
        if ((ipNext.X == pt.X) || (ip.Y == pt.Y && ((ipNext.X > pt.X) == (ip.X < pt.X))))
          return -1;
      }
      if ((ip.Y < pt.Y) != (ipNext.Y < pt.Y))
      {
        if (ip.X >= pt.X)
        {
          if (ipNext.X > pt.X)
            result = 1 - result;
          else
          {
            var d = (ip.X - pt.X) * (ipNext.Y - pt.Y) - (ipNext.X - pt.X) * (ip.Y - pt.Y);
            if (d == 0)
              return -1;
            else if ((d > 0) == (ipNext.Y > ip.Y))
              result = 1 - result;
          }
        }
        else
        {
          if (ipNext.X > pt.X)
          {
            var d = (ip.X - pt.X) * (ipNext.Y - pt.Y) - (ipNext.X - pt.X) * (ip.Y - pt.Y);
            if (d == 0)
              return -1;
            else if ((d > 0) == (ipNext.Y > ip.Y))
              result = 1 - result;
          }
        }
      }
      ip = ipNext;
    }
    return result;
  };

  ClipperLib.Clipper.prototype.PointInPolygon = function (pt, op)
  {
    //returns 0 if false, +1 if true, -1 if pt ON polygon boundary
		//See "The Point in Polygon Problem for Arbitrary Polygons" by Hormann & Agathos
    //http://citeseerx.ist.psu.edu/viewdoc/download?doi=10.1.1.88.5498&rep=rep1&type=pdf
    var result = 0;
    var startOp = op;
		var ptx = pt.X, pty = pt.Y;
    var poly0x = op.Pt.X, poly0y = op.Pt.Y;
    do
    {
			op = op.Next;
			var poly1x = op.Pt.X, poly1y = op.Pt.Y;
      if (poly1y == pty)
      {
        if ((poly1x == ptx) || (poly0y == pty && ((poly1x > ptx) == (poly0x < ptx))))
          return -1;
      }
      if ((poly0y < pty) != (poly1y < pty))
      {
        if (poly0x >= ptx)
        {
          if (poly1x > ptx)
            result = 1 - result;
          else
          {
            var d = (poly0x - ptx) * (poly1y - pty) - (poly1x - ptx) * (poly0y - pty);
            if (d == 0)
              return -1;
            if ((d > 0) == (poly1y > poly0y))
              result = 1 - result;
          }
        }
        else
        {
          if (poly1x > ptx)
          {
            var d = (poly0x - ptx) * (poly1y - pty) - (poly1x - ptx) * (poly0y - pty);
            if (d == 0)
              return -1;
            if ((d > 0) == (poly1y > poly0y))
              result = 1 - result;
          }
        }
      }
      poly0x = poly1x;
      poly0y = poly1y;
    } while (startOp != op);

    return result;
  };

  ClipperLib.Clipper.prototype.Poly2ContainsPoly1 = function (outPt1, outPt2)
  {
    var op = outPt1;
    do
    {
			//nb: PointInPolygon returns 0 if false, +1 if true, -1 if pt on polygon
      var res = this.PointInPolygon(op.Pt, outPt2);
      if (res >= 0)
        return res > 0;
      op = op.Next;
    }
    while (op != outPt1)
    return true;
  };
  ClipperLib.Clipper.prototype.FixupFirstLefts1 = function (OldOutRec, NewOutRec)
  {
    for (var i = 0, ilen = this.m_PolyOuts.length; i < ilen; i++)
    {
			var outRec = this.m_PolyOuts[i];
			if (outRec.Pts == null || outRec.FirstLeft == null)
				continue;
			var firstLeft = this.ParseFirstLeft(outRec.FirstLeft);
			if (firstLeft == OldOutRec)
			{
        if (this.Poly2ContainsPoly1(outRec.Pts, NewOutRec.Pts))
          outRec.FirstLeft = NewOutRec;
      }
    }
  };
  ClipperLib.Clipper.prototype.FixupFirstLefts2 = function (OldOutRec, NewOutRec)
  {
    for (var $i2 = 0, $t2 = this.m_PolyOuts, $l2 = $t2.length, outRec = $t2[$i2]; $i2 < $l2; $i2++, outRec = $t2[$i2])
      if (outRec.FirstLeft == OldOutRec)
        outRec.FirstLeft = NewOutRec;
  };
  ClipperLib.Clipper.ParseFirstLeft = function (FirstLeft)
  {
    while (FirstLeft != null && FirstLeft.Pts == null)
      FirstLeft = FirstLeft.FirstLeft;
    return FirstLeft;
  };
  ClipperLib.Clipper.prototype.JoinCommonEdges = function ()
  {
    for (var i = 0, ilen = this.m_Joins.length; i < ilen; i++)
    {
      var join = this.m_Joins[i];
      var outRec1 = this.GetOutRec(join.OutPt1.Idx);
      var outRec2 = this.GetOutRec(join.OutPt2.Idx);
      if (outRec1.Pts == null || outRec2.Pts == null)
        continue;
      //get the polygon fragment with the correct hole state (FirstLeft)
      //before calling JoinPoints() ...
      var holeStateRec;
      if (outRec1 == outRec2)
        holeStateRec = outRec1;
      else if (this.Param1RightOfParam2(outRec1, outRec2))
        holeStateRec = outRec2;
      else if (this.Param1RightOfParam2(outRec2, outRec1))
        holeStateRec = outRec1;
      else
        holeStateRec = this.GetLowermostRec(outRec1, outRec2);

      if (!this.JoinPoints(join, outRec1, outRec2)) continue;

      if (outRec1 == outRec2)
      {
        //instead of joining two polygons, we've just created a new one by
        //splitting one polygon into two.
        outRec1.Pts = join.OutPt1;
        outRec1.BottomPt = null;
        outRec2 = this.CreateOutRec();
        outRec2.Pts = join.OutPt2;
        //update all OutRec2.Pts Idx's ...
        this.UpdateOutPtIdxs(outRec2);
        //We now need to check every OutRec.FirstLeft pointer. If it points
        //to OutRec1 it may need to point to OutRec2 instead ...
        if (this.m_UsingPolyTree)
          for (var j = 0, jlen = this.m_PolyOuts.length; j < jlen - 1; j++)
          {
            var oRec = this.m_PolyOuts[j];
            if (oRec.Pts == null || ClipperLib.Clipper.ParseFirstLeft(oRec.FirstLeft) != outRec1 || oRec.IsHole == outRec1.IsHole)
              continue;
            if (this.Poly2ContainsPoly1(oRec.Pts, join.OutPt2))
              oRec.FirstLeft = outRec2;
          }
        if (this.Poly2ContainsPoly1(outRec2.Pts, outRec1.Pts))
        {
          //outRec2 is contained by outRec1 ...
          outRec2.IsHole = !outRec1.IsHole;
          outRec2.FirstLeft = outRec1;
          //fixup FirstLeft pointers that may need reassigning to OutRec1
          if (this.m_UsingPolyTree)
            this.FixupFirstLefts2(outRec2, outRec1);
          if ((outRec2.IsHole ^ this.ReverseSolution) == (this.Area(outRec2) > 0))
            this.ReversePolyPtLinks(outRec2.Pts);
        }
        else if (this.Poly2ContainsPoly1(outRec1.Pts, outRec2.Pts))
        {
          //outRec1 is contained by outRec2 ...
          outRec2.IsHole = outRec1.IsHole;
          outRec1.IsHole = !outRec2.IsHole;
          outRec2.FirstLeft = outRec1.FirstLeft;
          outRec1.FirstLeft = outRec2;
          //fixup FirstLeft pointers that may need reassigning to OutRec1
          if (this.m_UsingPolyTree)
            this.FixupFirstLefts2(outRec1, outRec2);
          if ((outRec1.IsHole ^ this.ReverseSolution) == (this.Area(outRec1) > 0))
            this.ReversePolyPtLinks(outRec1.Pts);
        }
        else
        {
          //the 2 polygons are completely separate ...
          outRec2.IsHole = outRec1.IsHole;
          outRec2.FirstLeft = outRec1.FirstLeft;
          //fixup FirstLeft pointers that may need reassigning to OutRec2
          if (this.m_UsingPolyTree)
            this.FixupFirstLefts1(outRec1, outRec2);
        }
      }
      else
      {
        //joined 2 polygons together ...
        outRec2.Pts = null;
        outRec2.BottomPt = null;
        outRec2.Idx = outRec1.Idx;
        outRec1.IsHole = holeStateRec.IsHole;
        if (holeStateRec == outRec2)
          outRec1.FirstLeft = outRec2.FirstLeft;
        outRec2.FirstLeft = outRec1;
        //fixup FirstLeft pointers that may need reassigning to OutRec1
        if (this.m_UsingPolyTree)
          this.FixupFirstLefts2(outRec2, outRec1);
      }
    }
  };
  ClipperLib.Clipper.prototype.UpdateOutPtIdxs = function (outrec)
  {
    var op = outrec.Pts;
    do {
      op.Idx = outrec.Idx;
      op = op.Prev;
    }
    while (op != outrec.Pts)
  };
  ClipperLib.Clipper.prototype.DoSimplePolygons = function ()
  {
    var i = 0;
    while (i < this.m_PolyOuts.length)
    {
      var outrec = this.m_PolyOuts[i++];
      var op = outrec.Pts;
			if (op == null || outrec.IsOpen)
				continue;
      do //for each Pt in Polygon until duplicate found do ...
      {
        var op2 = op.Next;
        while (op2 != outrec.Pts)
        {
          if ((ClipperLib.IntPoint.op_Equality(op.Pt, op2.Pt)) && op2.Next != op && op2.Prev != op)
          {
            //split the polygon into two ...
            var op3 = op.Prev;
            var op4 = op2.Prev;
            op.Prev = op4;
            op4.Next = op;
            op2.Prev = op3;
            op3.Next = op2;
            outrec.Pts = op;
            var outrec2 = this.CreateOutRec();
            outrec2.Pts = op2;
            this.UpdateOutPtIdxs(outrec2);
            if (this.Poly2ContainsPoly1(outrec2.Pts, outrec.Pts))
            {
              //OutRec2 is contained by OutRec1 ...
              outrec2.IsHole = !outrec.IsHole;
              outrec2.FirstLeft = outrec;
							if (this.m_UsingPolyTree) this.FixupFirstLefts2(outrec2, outrec);

            }
            else if (this.Poly2ContainsPoly1(outrec.Pts, outrec2.Pts))
            {
              //OutRec1 is contained by OutRec2 ...
              outrec2.IsHole = outrec.IsHole;
              outrec.IsHole = !outrec2.IsHole;
              outrec2.FirstLeft = outrec.FirstLeft;
              outrec.FirstLeft = outrec2;
              if (this.m_UsingPolyTree) this.FixupFirstLefts2(outrec, outrec2);
            }
            else
            {
              //the 2 polygons are separate ...
              outrec2.IsHole = outrec.IsHole;
              outrec2.FirstLeft = outrec.FirstLeft;
							if (this.m_UsingPolyTree) this.FixupFirstLefts1(outrec, outrec2);
            }
            op2 = op;
            //ie get ready for the next iteration
          }
          op2 = op2.Next;
        }
        op = op.Next;
      }
      while (op != outrec.Pts)
    }
  };
  ClipperLib.Clipper.Area = function (poly)
  {
    var cnt = poly.length;
    if (cnt < 3)
      return 0;
    var a = 0;
    for (var i = 0, j = cnt - 1; i < cnt; ++i)
    {
      a += (poly[j].X + poly[i].X) * (poly[j].Y - poly[i].Y);
      j = i;
    }
    return -a * 0.5;
  };
  ClipperLib.Clipper.prototype.Area = function (outRec)
  {
    var op = outRec.Pts;
    if (op == null)
      return 0;
    var a = 0;
    do {
      a = a + (op.Prev.Pt.X + op.Pt.X) * (op.Prev.Pt.Y - op.Pt.Y);
      op = op.Next;
    }
    while (op != outRec.Pts)
    return a * 0.5;
  };
  ClipperLib.Clipper.SimplifyPolygon = function (poly, fillType)
  {
    var result = new Array();
    var c = new ClipperLib.Clipper(0);
    c.StrictlySimple = true;
    c.AddPath(poly, ClipperLib.PolyType.ptSubject, true);
    c.Execute(ClipperLib.ClipType.ctUnion, result, fillType, fillType);
    return result;
  };
  ClipperLib.Clipper.SimplifyPolygons = function (polys, fillType)
  {
    if (typeof (fillType) == "undefined") fillType = ClipperLib.PolyFillType.pftEvenOdd;
    var result = new Array();
    var c = new ClipperLib.Clipper(0);
    c.StrictlySimple = true;
    c.AddPaths(polys, ClipperLib.PolyType.ptSubject, true);
    c.Execute(ClipperLib.ClipType.ctUnion, result, fillType, fillType);
    return result;
  };
  ClipperLib.Clipper.DistanceSqrd = function (pt1, pt2)
  {
    var dx = (pt1.X - pt2.X);
    var dy = (pt1.Y - pt2.Y);
    return (dx * dx + dy * dy);
  };
  ClipperLib.Clipper.DistanceFromLineSqrd = function (pt, ln1, ln2)
  {
    //The equation of a line in general form (Ax + By + C = 0)
    //given 2 points (x¹,y¹) & (x²,y²) is ...
    //(y¹ - y²)x + (x² - x¹)y + (y² - y¹)x¹ - (x² - x¹)y¹ = 0
    //A = (y¹ - y²); B = (x² - x¹); C = (y² - y¹)x¹ - (x² - x¹)y¹
    //perpendicular distance of point (x³,y³) = (Ax³ + By³ + C)/Sqrt(A² + B²)
    //see http://en.wikipedia.org/wiki/Perpendicular_distance
    var A = ln1.Y - ln2.Y;
    var B = ln2.X - ln1.X;
    var C = A * ln1.X + B * ln1.Y;
    C = A * pt.X + B * pt.Y - C;
    return (C * C) / (A * A + B * B);
  };

	ClipperLib.Clipper.SlopesNearCollinear = function(pt1, pt2, pt3, distSqrd)
	{
		//this function is more accurate when the point that's GEOMETRICALLY
		//between the other 2 points is the one that's tested for distance.
		//nb: with 'spikes', either pt1 or pt3 is geometrically between the other pts
		if (Math.abs(pt1.X - pt2.X) > Math.abs(pt1.Y - pt2.Y))
		{
		if ((pt1.X > pt2.X) == (pt1.X < pt3.X))
			return ClipperLib.Clipper.DistanceFromLineSqrd(pt1, pt2, pt3) < distSqrd;
		else if ((pt2.X > pt1.X) == (pt2.X < pt3.X))
			return ClipperLib.Clipper.DistanceFromLineSqrd(pt2, pt1, pt3) < distSqrd;
				else
				return ClipperLib.Clipper.DistanceFromLineSqrd(pt3, pt1, pt2) < distSqrd;
		}
		else
		{
		if ((pt1.Y > pt2.Y) == (pt1.Y < pt3.Y))
			return ClipperLib.Clipper.DistanceFromLineSqrd(pt1, pt2, pt3) < distSqrd;
		else if ((pt2.Y > pt1.Y) == (pt2.Y < pt3.Y))
			return ClipperLib.Clipper.DistanceFromLineSqrd(pt2, pt1, pt3) < distSqrd;
				else
			return ClipperLib.Clipper.DistanceFromLineSqrd(pt3, pt1, pt2) < distSqrd;
		}
	}

  ClipperLib.Clipper.PointsAreClose = function (pt1, pt2, distSqrd)
  {
    var dx = pt1.X - pt2.X;
    var dy = pt1.Y - pt2.Y;
    return ((dx * dx) + (dy * dy) <= distSqrd);
  };
  //------------------------------------------------------------------------------
  ClipperLib.Clipper.ExcludeOp = function (op)
  {
    var result = op.Prev;
    result.Next = op.Next;
    op.Next.Prev = result;
    result.Idx = 0;
    return result;
  };
  ClipperLib.Clipper.CleanPolygon = function (path, distance)
  {
    if (typeof (distance) == "undefined") distance = 1.415;
    //distance = proximity in units/pixels below which vertices will be stripped.
    //Default ~= sqrt(2) so when adjacent vertices or semi-adjacent vertices have
    //both x & y coords within 1 unit, then the second vertex will be stripped.
    var cnt = path.length;
    if (cnt == 0)
      return new Array();
    var outPts = new Array(cnt);
    for (var i = 0; i < cnt; ++i)
      outPts[i] = new ClipperLib.OutPt();
    for (var i = 0; i < cnt; ++i)
    {
      outPts[i].Pt = path[i];
      outPts[i].Next = outPts[(i + 1) % cnt];
      outPts[i].Next.Prev = outPts[i];
      outPts[i].Idx = 0;
    }
    var distSqrd = distance * distance;
    var op = outPts[0];
    while (op.Idx == 0 && op.Next != op.Prev)
    {
      if (ClipperLib.Clipper.PointsAreClose(op.Pt, op.Prev.Pt, distSqrd))
      {
        op = ClipperLib.Clipper.ExcludeOp(op);
        cnt--;
      }
      else if (ClipperLib.Clipper.PointsAreClose(op.Prev.Pt, op.Next.Pt, distSqrd))
      {
        ClipperLib.Clipper.ExcludeOp(op.Next);
        op = ClipperLib.Clipper.ExcludeOp(op);
        cnt -= 2;
      }
      else if (ClipperLib.Clipper.SlopesNearCollinear(op.Prev.Pt, op.Pt, op.Next.Pt, distSqrd))
      {
        op = ClipperLib.Clipper.ExcludeOp(op);
        cnt--;
      }
      else
      {
        op.Idx = 1;
        op = op.Next;
      }
    }
    if (cnt < 3)
      cnt = 0;
    var result = new Array(cnt);
    for (var i = 0; i < cnt; ++i)
    {
      result[i] = new ClipperLib.IntPoint(op.Pt);
      op = op.Next;
    }
    outPts = null;
    return result;
  };
  ClipperLib.Clipper.CleanPolygons = function (polys, distance)
  {
    var result = new Array(polys.length);
    for (var i = 0, ilen = polys.length; i < ilen; i++)
      result[i] = ClipperLib.Clipper.CleanPolygon(polys[i], distance);
    return result;
  };
  ClipperLib.Clipper.Minkowski = function (pattern, path, IsSum, IsClosed)
  {
    var delta = (IsClosed ? 1 : 0);
    var polyCnt = pattern.length;
    var pathCnt = path.length;
    var result = new Array();
    if (IsSum)
      for (var i = 0; i < pathCnt; i++)
      {
        var p = new Array(polyCnt);
        for (var j = 0, jlen = pattern.length, ip = pattern[j]; j < jlen; j++, ip = pattern[j])
          p[j] = new ClipperLib.IntPoint(path[i].X + ip.X, path[i].Y + ip.Y);
        result.push(p);
      }
    else
      for (var i = 0; i < pathCnt; i++)
      {
        var p = new Array(polyCnt);
        for (var j = 0, jlen = pattern.length, ip = pattern[j]; j < jlen; j++, ip = pattern[j])
          p[j] = new ClipperLib.IntPoint(path[i].X - ip.X, path[i].Y - ip.Y);
        result.push(p);
      }
    var quads = new Array();
    for (var i = 0; i < pathCnt - 1 + delta; i++)
      for (var j = 0; j < polyCnt; j++)
      {
        var quad = new Array();
        quad.push(result[i % pathCnt][j % polyCnt]);
        quad.push(result[(i + 1) % pathCnt][j % polyCnt]);
        quad.push(result[(i + 1) % pathCnt][(j + 1) % polyCnt]);
        quad.push(result[i % pathCnt][(j + 1) % polyCnt]);
        if (!ClipperLib.Clipper.Orientation(quad))
          quad.reverse();
        quads.push(quad);
      }
			return quads;
  };

	ClipperLib.Clipper.MinkowskiSum = function(pattern, path_or_paths, pathIsClosed)
	{
		if(!(path_or_paths[0] instanceof Array))
		{
			var path = path_or_paths;
			var paths = ClipperLib.Clipper.Minkowski(pattern, path, true, pathIsClosed);
			var c = new ClipperLib.Clipper();
			c.AddPaths(paths, ClipperLib.PolyType.ptSubject, true);
			c.Execute(ClipperLib.ClipType.ctUnion, paths, ClipperLib.PolyFillType.pftNonZero, ClipperLib.PolyFillType.pftNonZero);
			return paths;
		}
		else
		{
 			var paths = path_or_paths;
			var solution = new ClipperLib.Paths();
			var c = new ClipperLib.Clipper();
			for (var i = 0; i < paths.length; ++i)
			{
				var tmp = ClipperLib.Clipper.Minkowski(pattern, paths[i], true, pathIsClosed);
				c.AddPaths(tmp, ClipperLib.PolyType.ptSubject, true);
				if (pathIsClosed)
				{
					var path = ClipperLib.Clipper.TranslatePath(paths[i], pattern[0]);
					c.AddPath(path, ClipperLib.PolyType.ptClip, true);
				}
			}
			c.Execute(ClipperLib.ClipType.ctUnion, solution,
				ClipperLib.PolyFillType.pftNonZero, ClipperLib.PolyFillType.pftNonZero);
			return solution;
		}
	}
	//------------------------------------------------------------------------------

	ClipperLib.Clipper.TranslatePath = function (path, delta)
	{
		var outPath = new ClipperLib.Path();
		for (var i = 0; i < path.length; i++)
			outPath.push(new ClipperLib.IntPoint(path[i].X + delta.X, path[i].Y + delta.Y));
		return outPath;
	}
	//------------------------------------------------------------------------------

	ClipperLib.Clipper.MinkowskiDiff = function (poly1, poly2)
	{
		var paths = ClipperLib.Clipper.Minkowski(poly1, poly2, false, true);
		var c = new ClipperLib.Clipper();
		c.AddPaths(paths, ClipperLib.PolyType.ptSubject, true);
		c.Execute(ClipperLib.ClipType.ctUnion, paths, ClipperLib.PolyFillType.pftNonZero, ClipperLib.PolyFillType.pftNonZero);
		return paths;
	}

  ClipperLib.Clipper.PolyTreeToPaths = function (polytree)
  {
    var result = new Array();
    //result.set_Capacity(polytree.get_Total());
    ClipperLib.Clipper.AddPolyNodeToPaths(polytree, ClipperLib.Clipper.NodeType.ntAny, result);
    return result;
  };
  ClipperLib.Clipper.AddPolyNodeToPaths = function (polynode, nt, paths)
  {
    var match = true;
    switch (nt)
    {
    case ClipperLib.Clipper.NodeType.ntOpen:
      return;
    case ClipperLib.Clipper.NodeType.ntClosed:
      match = !polynode.IsOpen;
      break;
    default:
      break;
    }
    if (polynode.m_polygon.length > 0 && match)
      paths.push(polynode.m_polygon);
    for (var $i3 = 0, $t3 = polynode.Childs(), $l3 = $t3.length, pn = $t3[$i3]; $i3 < $l3; $i3++, pn = $t3[$i3])
      ClipperLib.Clipper.AddPolyNodeToPaths(pn, nt, paths);
  };
  ClipperLib.Clipper.OpenPathsFromPolyTree = function (polytree)
  {
    var result = new ClipperLib.Paths();
    //result.set_Capacity(polytree.ChildCount());
    for (var i = 0, ilen = polytree.ChildCount(); i < ilen; i++)
      if (polytree.Childs()[i].IsOpen)
        result.push(polytree.Childs()[i].m_polygon);
    return result;
  };
  ClipperLib.Clipper.ClosedPathsFromPolyTree = function (polytree)
  {
    var result = new ClipperLib.Paths();
    //result.set_Capacity(polytree.Total());
    ClipperLib.Clipper.AddPolyNodeToPaths(polytree, ClipperLib.Clipper.NodeType.ntClosed, result);
    return result;
  };
  Inherit(ClipperLib.Clipper, ClipperLib.ClipperBase);
  ClipperLib.Clipper.NodeType = {
    ntAny: 0,
    ntOpen: 1,
    ntClosed: 2
  };
  ClipperLib.ClipperOffset = function (miterLimit, arcTolerance)
  {
    if (typeof (miterLimit) == "undefined") miterLimit = 2;
    if (typeof (arcTolerance) == "undefined") arcTolerance = ClipperLib.ClipperOffset.def_arc_tolerance;
    this.m_destPolys = new ClipperLib.Paths();
    this.m_srcPoly = new ClipperLib.Path();
    this.m_destPoly = new ClipperLib.Path();
    this.m_normals = new Array();
    this.m_delta = 0;
    this.m_sinA = 0;
    this.m_sin = 0;
    this.m_cos = 0;
    this.m_miterLim = 0;
    this.m_StepsPerRad = 0;
    this.m_lowest = new ClipperLib.IntPoint();
    this.m_polyNodes = new ClipperLib.PolyNode();
    this.MiterLimit = miterLimit;
    this.ArcTolerance = arcTolerance;
    this.m_lowest.X = -1;
  };
  ClipperLib.ClipperOffset.two_pi = 6.28318530717959;
  ClipperLib.ClipperOffset.def_arc_tolerance = 0.25;
  ClipperLib.ClipperOffset.prototype.Clear = function ()
  {
    ClipperLib.Clear(this.m_polyNodes.Childs());
    this.m_lowest.X = -1;
  };
  ClipperLib.ClipperOffset.Round = ClipperLib.Clipper.Round;
  ClipperLib.ClipperOffset.prototype.AddPath = function (path, joinType, endType)
  {
    var highI = path.length - 1;
    if (highI < 0)
      return;
    var newNode = new ClipperLib.PolyNode();
    newNode.m_jointype = joinType;
    newNode.m_endtype = endType;
    //strip duplicate points from path and also get index to the lowest point ...
    if (endType == ClipperLib.EndType.etClosedLine || endType == ClipperLib.EndType.etClosedPolygon)
      while (highI > 0 && ClipperLib.IntPoint.op_Equality(path[0], path[highI]))
        highI--;
    //newNode.m_polygon.set_Capacity(highI + 1);
    newNode.m_polygon.push(path[0]);
    var j = 0,
      k = 0;
    for (var i = 1; i <= highI; i++)
      if (ClipperLib.IntPoint.op_Inequality(newNode.m_polygon[j], path[i]))
      {
        j++;
        newNode.m_polygon.push(path[i]);
        if (path[i].Y > newNode.m_polygon[k].Y || (path[i].Y == newNode.m_polygon[k].Y && path[i].X < newNode.m_polygon[k].X))
          k = j;
      }
    if (endType == ClipperLib.EndType.etClosedPolygon && j < 2) return;

    this.m_polyNodes.AddChild(newNode);
    //if this path's lowest pt is lower than all the others then update m_lowest
    if (endType != ClipperLib.EndType.etClosedPolygon)
      return;
    if (this.m_lowest.X < 0)
      this.m_lowest = new ClipperLib.IntPoint(this.m_polyNodes.ChildCount() - 1, k);
    else
    {
      var ip = this.m_polyNodes.Childs()[this.m_lowest.X].m_polygon[this.m_lowest.Y];
      if (newNode.m_polygon[k].Y > ip.Y || (newNode.m_polygon[k].Y == ip.Y && newNode.m_polygon[k].X < ip.X))
        this.m_lowest = new ClipperLib.IntPoint(this.m_polyNodes.ChildCount() - 1, k);
    }
  };
  ClipperLib.ClipperOffset.prototype.AddPaths = function (paths, joinType, endType)
  {
    for (var i = 0, ilen = paths.length; i < ilen; i++)
      this.AddPath(paths[i], joinType, endType);
  };
  ClipperLib.ClipperOffset.prototype.FixOrientations = function ()
  {
    //fixup orientations of all closed paths if the orientation of the
    //closed path with the lowermost vertex is wrong ...
    if (this.m_lowest.X >= 0 && !ClipperLib.Clipper.Orientation(this.m_polyNodes.Childs()[this.m_lowest.X].m_polygon))
    {
      for (var i = 0; i < this.m_polyNodes.ChildCount(); i++)
      {
        var node = this.m_polyNodes.Childs()[i];
        if (node.m_endtype == ClipperLib.EndType.etClosedPolygon || (node.m_endtype == ClipperLib.EndType.etClosedLine && ClipperLib.Clipper.Orientation(node.m_polygon)))
          node.m_polygon.reverse();
      }
    }
    else
    {
      for (var i = 0; i < this.m_polyNodes.ChildCount(); i++)
      {
        var node = this.m_polyNodes.Childs()[i];
        if (node.m_endtype == ClipperLib.EndType.etClosedLine && !ClipperLib.Clipper.Orientation(node.m_polygon))
          node.m_polygon.reverse();
      }
    }
  };
  ClipperLib.ClipperOffset.GetUnitNormal = function (pt1, pt2)
  {
    var dx = (pt2.X - pt1.X);
    var dy = (pt2.Y - pt1.Y);
    if ((dx == 0) && (dy == 0))
      return new ClipperLib.DoublePoint(0, 0);
    var f = 1 / Math.sqrt(dx * dx + dy * dy);
    dx *= f;
    dy *= f;
    return new ClipperLib.DoublePoint(dy, -dx);
  };
  ClipperLib.ClipperOffset.prototype.DoOffset = function (delta)
  {
    this.m_destPolys = new Array();
    this.m_delta = delta;
    //if Zero offset, just copy any CLOSED polygons to m_p and return ...
    if (ClipperLib.ClipperBase.near_zero(delta))
    {
      //this.m_destPolys.set_Capacity(this.m_polyNodes.ChildCount);
      for (var i = 0; i < this.m_polyNodes.ChildCount(); i++)
      {
        var node = this.m_polyNodes.Childs()[i];
        if (node.m_endtype == ClipperLib.EndType.etClosedPolygon)
          this.m_destPolys.push(node.m_polygon);
      }
      return;
    }
    //see offset_triginometry3.svg in the documentation folder ...
    if (this.MiterLimit > 2)
      this.m_miterLim = 2 / (this.MiterLimit * this.MiterLimit);
    else
      this.m_miterLim = 0.5;
    var y;
    if (this.ArcTolerance <= 0)
      y = ClipperLib.ClipperOffset.def_arc_tolerance;
    else if (this.ArcTolerance > Math.abs(delta) * ClipperLib.ClipperOffset.def_arc_tolerance)
      y = Math.abs(delta) * ClipperLib.ClipperOffset.def_arc_tolerance;
    else
      y = this.ArcTolerance;
    //see offset_triginometry2.svg in the documentation folder ...
    var steps = 3.14159265358979 / Math.acos(1 - y / Math.abs(delta));
    this.m_sin = Math.sin(ClipperLib.ClipperOffset.two_pi / steps);
    this.m_cos = Math.cos(ClipperLib.ClipperOffset.two_pi / steps);
    this.m_StepsPerRad = steps / ClipperLib.ClipperOffset.two_pi;
    if (delta < 0)
      this.m_sin = -this.m_sin;
    //this.m_destPolys.set_Capacity(this.m_polyNodes.ChildCount * 2);
    for (var i = 0; i < this.m_polyNodes.ChildCount(); i++)
    {
      var node = this.m_polyNodes.Childs()[i];
      this.m_srcPoly = node.m_polygon;
      var len = this.m_srcPoly.length;
      if (len == 0 || (delta <= 0 && (len < 3 || node.m_endtype != ClipperLib.EndType.etClosedPolygon)))
        continue;
      this.m_destPoly = new Array();
      if (len == 1)
      {
        if (node.m_jointype == ClipperLib.JoinType.jtRound)
        {
          var X = 1,
            Y = 0;
          for (var j = 1; j <= steps; j++)
          {
            this.m_destPoly.push(new ClipperLib.IntPoint(ClipperLib.ClipperOffset.Round(this.m_srcPoly[0].X + X * delta), ClipperLib.ClipperOffset.Round(this.m_srcPoly[0].Y + Y * delta)));
            var X2 = X;
            X = X * this.m_cos - this.m_sin * Y;
            Y = X2 * this.m_sin + Y * this.m_cos;
          }
        }
        else
        {
          var X = -1,
            Y = -1;
          for (var j = 0; j < 4; ++j)
          {
            this.m_destPoly.push(new ClipperLib.IntPoint(ClipperLib.ClipperOffset.Round(this.m_srcPoly[0].X + X * delta), ClipperLib.ClipperOffset.Round(this.m_srcPoly[0].Y + Y * delta)));
            if (X < 0)
              X = 1;
            else if (Y < 0)
              Y = 1;
            else
              X = -1;
          }
        }
        this.m_destPolys.push(this.m_destPoly);
        continue;
      }
      //build m_normals ...
      this.m_normals.length = 0;
      //this.m_normals.set_Capacity(len);
      for (var j = 0; j < len - 1; j++)
        this.m_normals.push(ClipperLib.ClipperOffset.GetUnitNormal(this.m_srcPoly[j], this.m_srcPoly[j + 1]));
      if (node.m_endtype == ClipperLib.EndType.etClosedLine || node.m_endtype == ClipperLib.EndType.etClosedPolygon)
        this.m_normals.push(ClipperLib.ClipperOffset.GetUnitNormal(this.m_srcPoly[len - 1], this.m_srcPoly[0]));
      else
        this.m_normals.push(new ClipperLib.DoublePoint(this.m_normals[len - 2]));
      if (node.m_endtype == ClipperLib.EndType.etClosedPolygon)
      {
        var k = len - 1;
        for (var j = 0; j < len; j++)
          k = this.OffsetPoint(j, k, node.m_jointype);
        this.m_destPolys.push(this.m_destPoly);
      }
      else if (node.m_endtype == ClipperLib.EndType.etClosedLine)
      {
        var k = len - 1;
        for (var j = 0; j < len; j++)
          k = this.OffsetPoint(j, k, node.m_jointype);
        this.m_destPolys.push(this.m_destPoly);
        this.m_destPoly = new Array();
        //re-build m_normals ...
        var n = this.m_normals[len - 1];
        for (var j = len - 1; j > 0; j--)
          this.m_normals[j] = new ClipperLib.DoublePoint(-this.m_normals[j - 1].X, -this.m_normals[j - 1].Y);
        this.m_normals[0] = new ClipperLib.DoublePoint(-n.X, -n.Y);
        k = 0;
        for (var j = len - 1; j >= 0; j--)
          k = this.OffsetPoint(j, k, node.m_jointype);
        this.m_destPolys.push(this.m_destPoly);
      }
      else
      {
        var k = 0;
        for (var j = 1; j < len - 1; ++j)
          k = this.OffsetPoint(j, k, node.m_jointype);
        var pt1;
        if (node.m_endtype == ClipperLib.EndType.etOpenButt)
        {
          var j = len - 1;
          pt1 = new ClipperLib.IntPoint(ClipperLib.ClipperOffset.Round(this.m_srcPoly[j].X + this.m_normals[j].X * delta), ClipperLib.ClipperOffset.Round(this.m_srcPoly[j].Y + this.m_normals[j].Y * delta));
          this.m_destPoly.push(pt1);
          pt1 = new ClipperLib.IntPoint(ClipperLib.ClipperOffset.Round(this.m_srcPoly[j].X - this.m_normals[j].X * delta), ClipperLib.ClipperOffset.Round(this.m_srcPoly[j].Y - this.m_normals[j].Y * delta));
          this.m_destPoly.push(pt1);
        }
        else
        {
          var j = len - 1;
          k = len - 2;
          this.m_sinA = 0;
          this.m_normals[j] = new ClipperLib.DoublePoint(-this.m_normals[j].X, -this.m_normals[j].Y);
          if (node.m_endtype == ClipperLib.EndType.etOpenSquare)
            this.DoSquare(j, k);
          else
            this.DoRound(j, k);
        }
        //re-build m_normals ...
        for (var j = len - 1; j > 0; j--)
          this.m_normals[j] = new ClipperLib.DoublePoint(-this.m_normals[j - 1].X, -this.m_normals[j - 1].Y);
        this.m_normals[0] = new ClipperLib.DoublePoint(-this.m_normals[1].X, -this.m_normals[1].Y);
        k = len - 1;
        for (var j = k - 1; j > 0; --j)
          k = this.OffsetPoint(j, k, node.m_jointype);
        if (node.m_endtype == ClipperLib.EndType.etOpenButt)
        {
          pt1 = new ClipperLib.IntPoint(ClipperLib.ClipperOffset.Round(this.m_srcPoly[0].X - this.m_normals[0].X * delta), ClipperLib.ClipperOffset.Round(this.m_srcPoly[0].Y - this.m_normals[0].Y * delta));
          this.m_destPoly.push(pt1);
          pt1 = new ClipperLib.IntPoint(ClipperLib.ClipperOffset.Round(this.m_srcPoly[0].X + this.m_normals[0].X * delta), ClipperLib.ClipperOffset.Round(this.m_srcPoly[0].Y + this.m_normals[0].Y * delta));
          this.m_destPoly.push(pt1);
        }
        else
        {
          k = 1;
          this.m_sinA = 0;
          if (node.m_endtype == ClipperLib.EndType.etOpenSquare)
            this.DoSquare(0, 1);
          else
            this.DoRound(0, 1);
        }
        this.m_destPolys.push(this.m_destPoly);
      }
    }
  };
  ClipperLib.ClipperOffset.prototype.Execute = function ()
  {
    var a = arguments,
      ispolytree = a[0] instanceof ClipperLib.PolyTree;
    if (!ispolytree) // function (solution, delta)
    {
      var solution = a[0],
        delta = a[1];
      ClipperLib.Clear(solution);
      this.FixOrientations();
      this.DoOffset(delta);
      //now clean up 'corners' ...
      var clpr = new ClipperLib.Clipper(0);
      clpr.AddPaths(this.m_destPolys, ClipperLib.PolyType.ptSubject, true);
      if (delta > 0)
      {
        clpr.Execute(ClipperLib.ClipType.ctUnion, solution, ClipperLib.PolyFillType.pftPositive, ClipperLib.PolyFillType.pftPositive);
      }
      else
      {
        var r = ClipperLib.Clipper.GetBounds(this.m_destPolys);
        var outer = new ClipperLib.Path();
        outer.push(new ClipperLib.IntPoint(r.left - 10, r.bottom + 10));
        outer.push(new ClipperLib.IntPoint(r.right + 10, r.bottom + 10));
        outer.push(new ClipperLib.IntPoint(r.right + 10, r.top - 10));
        outer.push(new ClipperLib.IntPoint(r.left - 10, r.top - 10));
        clpr.AddPath(outer, ClipperLib.PolyType.ptSubject, true);
        clpr.ReverseSolution = true;
        clpr.Execute(ClipperLib.ClipType.ctUnion, solution, ClipperLib.PolyFillType.pftNegative, ClipperLib.PolyFillType.pftNegative);
        if (solution.length > 0)
          solution.splice(0, 1);
      }
      //console.log(JSON.stringify(solution));
    }
    else // function (polytree, delta)
    {
      var solution = a[0],
        delta = a[1];
      solution.Clear();
      this.FixOrientations();
      this.DoOffset(delta);
      //now clean up 'corners' ...
      var clpr = new ClipperLib.Clipper(0);
      clpr.AddPaths(this.m_destPolys, ClipperLib.PolyType.ptSubject, true);
      if (delta > 0)
      {
        clpr.Execute(ClipperLib.ClipType.ctUnion, solution, ClipperLib.PolyFillType.pftPositive, ClipperLib.PolyFillType.pftPositive);
      }
      else
      {
        var r = ClipperLib.Clipper.GetBounds(this.m_destPolys);
        var outer = new ClipperLib.Path();
        outer.push(new ClipperLib.IntPoint(r.left - 10, r.bottom + 10));
        outer.push(new ClipperLib.IntPoint(r.right + 10, r.bottom + 10));
        outer.push(new ClipperLib.IntPoint(r.right + 10, r.top - 10));
        outer.push(new ClipperLib.IntPoint(r.left - 10, r.top - 10));
        clpr.AddPath(outer, ClipperLib.PolyType.ptSubject, true);
        clpr.ReverseSolution = true;
        clpr.Execute(ClipperLib.ClipType.ctUnion, solution, ClipperLib.PolyFillType.pftNegative, ClipperLib.PolyFillType.pftNegative);
        //remove the outer PolyNode rectangle ...
        if (solution.ChildCount() == 1 && solution.Childs()[0].ChildCount() > 0)
        {
          var outerNode = solution.Childs()[0];
          //solution.Childs.set_Capacity(outerNode.ChildCount);
          solution.Childs()[0] = outerNode.Childs()[0];
          solution.Childs()[0].m_Parent = solution;
          for (var i = 1; i < outerNode.ChildCount(); i++)
            solution.AddChild(outerNode.Childs()[i]);
        }
        else
          solution.Clear();
      }
    }
  };
  ClipperLib.ClipperOffset.prototype.OffsetPoint = function (j, k, jointype)
  {
		//cross product ...
		this.m_sinA = (this.m_normals[k].X * this.m_normals[j].Y - this.m_normals[j].X * this.m_normals[k].Y);

		if (Math.abs(this.m_sinA * this.m_delta) < 1.0)
		{
			//dot product ...
			var cosA = (this.m_normals[k].X * this.m_normals[j].X + this.m_normals[j].Y * this.m_normals[k].Y);
			if (cosA > 0) // angle ==> 0 degrees
			{
				this.m_destPoly.push(new ClipperLib.IntPoint(ClipperLib.ClipperOffset.Round(this.m_srcPoly[j].X + this.m_normals[k].X * this.m_delta),
					ClipperLib.ClipperOffset.Round(this.m_srcPoly[j].Y + this.m_normals[k].Y * this.m_delta)));
				return k;
			}
			//else angle ==> 180 degrees
		}
    else if (this.m_sinA > 1)
      this.m_sinA = 1.0;
    else if (this.m_sinA < -1)
      this.m_sinA = -1.0;
    if (this.m_sinA * this.m_delta < 0)
    {
      this.m_destPoly.push(new ClipperLib.IntPoint(ClipperLib.ClipperOffset.Round(this.m_srcPoly[j].X + this.m_normals[k].X * this.m_delta),
        ClipperLib.ClipperOffset.Round(this.m_srcPoly[j].Y + this.m_normals[k].Y * this.m_delta)));
      this.m_destPoly.push(new ClipperLib.IntPoint(this.m_srcPoly[j]));
      this.m_destPoly.push(new ClipperLib.IntPoint(ClipperLib.ClipperOffset.Round(this.m_srcPoly[j].X + this.m_normals[j].X * this.m_delta),
        ClipperLib.ClipperOffset.Round(this.m_srcPoly[j].Y + this.m_normals[j].Y * this.m_delta)));
    }
    else
      switch (jointype)
      {
      case ClipperLib.JoinType.jtMiter:
        {
          var r = 1 + (this.m_normals[j].X * this.m_normals[k].X + this.m_normals[j].Y * this.m_normals[k].Y);
          if (r >= this.m_miterLim)
            this.DoMiter(j, k, r);
          else
            this.DoSquare(j, k);
          break;
        }
      case ClipperLib.JoinType.jtSquare:
        this.DoSquare(j, k);
        break;
      case ClipperLib.JoinType.jtRound:
        this.DoRound(j, k);
        break;
      }
    k = j;
    return k;
  };
  ClipperLib.ClipperOffset.prototype.DoSquare = function (j, k)
  {
    var dx = Math.tan(Math.atan2(this.m_sinA,
      this.m_normals[k].X * this.m_normals[j].X + this.m_normals[k].Y * this.m_normals[j].Y) / 4);
    this.m_destPoly.push(new ClipperLib.IntPoint(
      ClipperLib.ClipperOffset.Round(this.m_srcPoly[j].X + this.m_delta * (this.m_normals[k].X - this.m_normals[k].Y * dx)),
      ClipperLib.ClipperOffset.Round(this.m_srcPoly[j].Y + this.m_delta * (this.m_normals[k].Y + this.m_normals[k].X * dx))));
    this.m_destPoly.push(new ClipperLib.IntPoint(
      ClipperLib.ClipperOffset.Round(this.m_srcPoly[j].X + this.m_delta * (this.m_normals[j].X + this.m_normals[j].Y * dx)),
      ClipperLib.ClipperOffset.Round(this.m_srcPoly[j].Y + this.m_delta * (this.m_normals[j].Y - this.m_normals[j].X * dx))));
  };
  ClipperLib.ClipperOffset.prototype.DoMiter = function (j, k, r)
  {
    var q = this.m_delta / r;
    this.m_destPoly.push(new ClipperLib.IntPoint(
      ClipperLib.ClipperOffset.Round(this.m_srcPoly[j].X + (this.m_normals[k].X + this.m_normals[j].X) * q),
      ClipperLib.ClipperOffset.Round(this.m_srcPoly[j].Y + (this.m_normals[k].Y + this.m_normals[j].Y) * q)));
  };
  ClipperLib.ClipperOffset.prototype.DoRound = function (j, k)
  {
    var a = Math.atan2(this.m_sinA,
      this.m_normals[k].X * this.m_normals[j].X + this.m_normals[k].Y * this.m_normals[j].Y);

    	var steps = Math.max(ClipperLib.Cast_Int32(ClipperLib.ClipperOffset.Round(this.m_StepsPerRad * Math.abs(a))), 1);

    var X = this.m_normals[k].X,
      Y = this.m_normals[k].Y,
      X2;
    for (var i = 0; i < steps; ++i)
    {
      this.m_destPoly.push(new ClipperLib.IntPoint(
        ClipperLib.ClipperOffset.Round(this.m_srcPoly[j].X + X * this.m_delta),
        ClipperLib.ClipperOffset.Round(this.m_srcPoly[j].Y + Y * this.m_delta)));
      X2 = X;
      X = X * this.m_cos - this.m_sin * Y;
      Y = X2 * this.m_sin + Y * this.m_cos;
    }
    this.m_destPoly.push(new ClipperLib.IntPoint(
      ClipperLib.ClipperOffset.Round(this.m_srcPoly[j].X + this.m_normals[j].X * this.m_delta),
      ClipperLib.ClipperOffset.Round(this.m_srcPoly[j].Y + this.m_normals[j].Y * this.m_delta)));
  };
  ClipperLib.Error = function (message)
  {
    throw new Error(message);
  };
  // ---------------------------------
  // JS extension by Timo 2013
  ClipperLib.JS = {};
  ClipperLib.JS.AreaOfPolygon = function (poly, scale)
  {
    if (!scale) scale = 1;
    return ClipperLib.Clipper.Area(poly) / (scale * scale);
  };
  ClipperLib.JS.AreaOfPolygons = function (poly, scale)
  {
    if (!scale) scale = 1;
    var area = 0;
    for (var i = 0; i < poly.length; i++)
    {
      area += ClipperLib.Clipper.Area(poly[i]);
    }
    return area / (scale * scale);
  };
  ClipperLib.JS.BoundsOfPath = function (path, scale)
  {
    return ClipperLib.JS.BoundsOfPaths([path], scale);
  };
  ClipperLib.JS.BoundsOfPaths = function (paths, scale)
  {
    if (!scale) scale = 1;
    var bounds = ClipperLib.Clipper.GetBounds(paths);
    bounds.left /= scale;
    bounds.bottom /= scale;
    bounds.right /= scale;
    bounds.top /= scale;
    return bounds;
  };
  // Clean() joins vertices that are too near each other
  // and causes distortion to offsetted polygons without cleaning
  ClipperLib.JS.Clean = function (polygon, delta)
  {
    if (!(polygon instanceof Array)) return [];
    var isPolygons = polygon[0] instanceof Array;
    var polygon = ClipperLib.JS.Clone(polygon);
    if (typeof delta != "number" || delta === null)
    {
      ClipperLib.Error("Delta is not a number in Clean().");
      return polygon;
    }
    if (polygon.length === 0 || (polygon.length == 1 && polygon[0].length === 0) || delta < 0) return polygon;
    if (!isPolygons) polygon = [polygon];
    var k_length = polygon.length;
    var len, poly, result, d, p, j, i;
    var results = [];
    for (var k = 0; k < k_length; k++)
    {
      poly = polygon[k];
      len = poly.length;
      if (len === 0) continue;
      else if (len < 3)
      {
        result = poly;
        results.push(result);
        continue;
      }
      result = poly;
      d = delta * delta;
      //d = Math.floor(c_delta * c_delta);
      p = poly[0];
      j = 1;
      for (i = 1; i < len; i++)
      {
        if ((poly[i].X - p.X) * (poly[i].X - p.X) +
          (poly[i].Y - p.Y) * (poly[i].Y - p.Y) <= d)
          continue;
        result[j] = poly[i];
        p = poly[i];
        j++;
      }
      p = poly[j - 1];
      if ((poly[0].X - p.X) * (poly[0].X - p.X) +
        (poly[0].Y - p.Y) * (poly[0].Y - p.Y) <= d)
        j--;
      if (j < len)
        result.splice(j, len - j);
      if (result.length) results.push(result);
    }
    if (!isPolygons && results.length) results = results[0];
    else if (!isPolygons && results.length === 0) results = [];
    else if (isPolygons && results.length === 0) results = [
      []
    ];
    return results;
  }
  // Make deep copy of Polygons or Polygon
  // so that also IntPoint objects are cloned and not only referenced
  // This should be the fastest way
  ClipperLib.JS.Clone = function (polygon)
  {
    if (!(polygon instanceof Array)) return [];
    if (polygon.length === 0) return [];
    else if (polygon.length == 1 && polygon[0].length === 0) return [[]];
    var isPolygons = polygon[0] instanceof Array;
    if (!isPolygons) polygon = [polygon];
    var len = polygon.length,
      plen, i, j, result;
    var results = new Array(len);
    for (i = 0; i < len; i++)
    {
      plen = polygon[i].length;
      result = new Array(plen);
      for (j = 0; j < plen; j++)
      {
        result[j] = {
          X: polygon[i][j].X,
          Y: polygon[i][j].Y
        };
      }
      results[i] = result;
    }
    if (!isPolygons) results = results[0];
    return results;
  };
  // Removes points that doesn't affect much to the visual appearance.
  // If middle point is at or under certain distance (tolerance) of the line segment between
  // start and end point, the middle point is removed.
  ClipperLib.JS.Lighten = function (polygon, tolerance)
  {
    if (!(polygon instanceof Array)) return [];
    if (typeof tolerance != "number" || tolerance === null)
    {
      ClipperLib.Error("Tolerance is not a number in Lighten().")
      return ClipperLib.JS.Clone(polygon);
    }
    if (polygon.length === 0 || (polygon.length == 1 && polygon[0].length === 0) || tolerance < 0)
    {
      return ClipperLib.JS.Clone(polygon);
    }
    if (!(polygon[0] instanceof Array)) polygon = [polygon];
    var i, j, poly, k, poly2, plen, A, B, P, d, rem, addlast;
    var bxax, byay, l, ax, ay;
    var len = polygon.length;
    var toleranceSq = tolerance * tolerance;
    var results = [];
    for (i = 0; i < len; i++)
    {
      poly = polygon[i];
      plen = poly.length;
      if (plen == 0) continue;
      for (k = 0; k < 1000000; k++) // could be forever loop, but wiser to restrict max repeat count
      {
        poly2 = [];
        plen = poly.length;
        // the first have to added to the end, if first and last are not the same
        // this way we ensure that also the actual last point can be removed if needed
        if (poly[plen - 1].X != poly[0].X || poly[plen - 1].Y != poly[0].Y)
        {
          addlast = 1;
          poly.push(
          {
            X: poly[0].X,
            Y: poly[0].Y
          });
          plen = poly.length;
        }
        else addlast = 0;
        rem = []; // Indexes of removed points
        for (j = 0; j < plen - 2; j++)
        {
          A = poly[j]; // Start point of line segment
          P = poly[j + 1]; // Middle point. This is the one to be removed.
          B = poly[j + 2]; // End point of line segment
          ax = A.X;
          ay = A.Y;
          bxax = B.X - ax;
          byay = B.Y - ay;
          if (bxax !== 0 || byay !== 0) // To avoid Nan, when A==P && P==B. And to avoid peaks (A==B && A!=P), which have lenght, but not area.
          {
            l = ((P.X - ax) * bxax + (P.Y - ay) * byay) / (bxax * bxax + byay * byay);
            if (l > 1)
            {
              ax = B.X;
              ay = B.Y;
            }
            else if (l > 0)
            {
              ax += bxax * l;
              ay += byay * l;
            }
          }
          bxax = P.X - ax;
          byay = P.Y - ay;
          d = bxax * bxax + byay * byay;
          if (d <= toleranceSq)
          {
            rem[j + 1] = 1;
            j++; // when removed, transfer the pointer to the next one
          }
        }
        // add all unremoved points to poly2
        poly2.push(
        {
          X: poly[0].X,
          Y: poly[0].Y
        });
        for (j = 1; j < plen - 1; j++)
          if (!rem[j]) poly2.push(
          {
            X: poly[j].X,
            Y: poly[j].Y
          });
        poly2.push(
        {
          X: poly[plen - 1].X,
          Y: poly[plen - 1].Y
        });
        // if the first point was added to the end, remove it
        if (addlast) poly.pop();
        // break, if there was not anymore removed points
        if (!rem.length) break;
        // else continue looping using poly2, to check if there are points to remove
        else poly = poly2;
      }
      plen = poly2.length;
      // remove duplicate from end, if needed
      if (poly2[plen - 1].X == poly2[0].X && poly2[plen - 1].Y == poly2[0].Y)
      {
        poly2.pop();
      }
      if (poly2.length > 2) // to avoid two-point-polygons
        results.push(poly2);
    }
    if (!(polygon[0] instanceof Array)) results = results[0];
    if (typeof (results) == "undefined") results = [
      []
    ];
    return results;
  }
  ClipperLib.JS.PerimeterOfPath = function (path, closed, scale)
  {
    if (typeof (path) == "undefined") return 0;
    var sqrt = Math.sqrt;
    var perimeter = 0.0;
    var p1, p2, p1x = 0.0,
      p1y = 0.0,
      p2x = 0.0,
      p2y = 0.0;
    var j = path.length;
    if (j < 2) return 0;
    if (closed)
    {
      path[j] = path[0];
      j++;
    }
    while (--j)
    {
      p1 = path[j];
      p1x = p1.X;
      p1y = p1.Y;
      p2 = path[j - 1];
      p2x = p2.X;
      p2y = p2.Y;
      perimeter += sqrt((p1x - p2x) * (p1x - p2x) + (p1y - p2y) * (p1y - p2y));
    }
    if (closed) path.pop();
    return perimeter / scale;
  };
  ClipperLib.JS.PerimeterOfPaths = function (paths, closed, scale)
  {
    if (!scale) scale = 1;
    var perimeter = 0;
    for (var i = 0; i < paths.length; i++)
    {
      perimeter += ClipperLib.JS.PerimeterOfPath(paths[i], closed, scale);
    }
    return perimeter;
  };
  ClipperLib.JS.ScaleDownPath = function (path, scale)
  {
    var i, p;
    if (!scale) scale = 1;
    i = path.length;
    while (i--)
    {
      p = path[i];
      p.X = p.X / scale;
      p.Y = p.Y / scale;
    }
  };
  ClipperLib.JS.ScaleDownPaths = function (paths, scale)
  {
    var i, j, p;
    if (!scale) scale = 1;
    i = paths.length;
    while (i--)
    {
      j = paths[i].length;
      while (j--)
      {
        p = paths[i][j];
        p.X = p.X / scale;
        p.Y = p.Y / scale;
      }
    }
  };
  ClipperLib.JS.ScaleUpPath = function (path, scale)
  {
    var i, p, round = Math.round;
    if (!scale) scale = 1;
    i = path.length;
    while (i--)
    {
      p = path[i];
      p.X = round(p.X * scale);
      p.Y = round(p.Y * scale);
    }
  };
  ClipperLib.JS.ScaleUpPaths = function (paths, scale)
  {
    var i, j, p, round = Math.round;
    if (!scale) scale = 1;
    i = paths.length;
    while (i--)
    {
      j = paths[i].length;
      while (j--)
      {
        p = paths[i][j];
        p.X = round(p.X * scale);
        p.Y = round(p.Y * scale);
      }
    }
  };
  ClipperLib.ExPolygons = function ()
  {
    return [];
  }
  ClipperLib.ExPolygon = function ()
  {
    this.outer = null;
    this.holes = null;
  };
  ClipperLib.JS.AddOuterPolyNodeToExPolygons = function (polynode, expolygons)
  {
    var ep = new ClipperLib.ExPolygon();
    ep.outer = polynode.Contour();
    var childs = polynode.Childs();
    var ilen = childs.length;
    ep.holes = new Array(ilen);
    var node, n, i, j, childs2, jlen;
    for (i = 0; i < ilen; i++)
    {
      node = childs[i];
      ep.holes[i] = node.Contour();
      //Add outer polygons contained by (nested within) holes ...
      for (j = 0, childs2 = node.Childs(), jlen = childs2.length; j < jlen; j++)
      {
        n = childs2[j];
        ClipperLib.JS.AddOuterPolyNodeToExPolygons(n, expolygons);
      }
    }
    expolygons.push(ep);
  };
  ClipperLib.JS.ExPolygonsToPaths = function (expolygons)
  {
    var a, i, alen, ilen;
    var paths = new ClipperLib.Paths();
    for (a = 0, alen = expolygons.length; a < alen; a++)
    {
      paths.push(expolygons[a].outer);
      for (i = 0, ilen = expolygons[a].holes.length; i < ilen; i++)
      {
        paths.push(expolygons[a].holes[i]);
      }
    }
    return paths;
  }
  ClipperLib.JS.PolyTreeToExPolygons = function (polytree)
  {
    var expolygons = new ClipperLib.ExPolygons();
    var node, i, childs, ilen;
    for (i = 0, childs = polytree.Childs(), ilen = childs.length; i < ilen; i++)
    {
      node = childs[i];
      ClipperLib.JS.AddOuterPolyNodeToExPolygons(node, expolygons);
    }
    return expolygons;
  };
})();

},{}]},{},[13])(13)
});