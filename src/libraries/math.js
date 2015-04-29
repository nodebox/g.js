'use strict';

var vg = require('vg.js');

var grob = {};

grob.abs = Math.abs;

grob.add = function (a, b) {
    return a + b;
};

grob.angle = function (point1, point2) {
    return grob.degrees(Math.atan2(point2.y - point1.y, point2.x - point1.x));
};

grob.average = function (values) {
    if (values.length === 0) { return 0; }
    var i, sum = 0;
    for (i = 0; i < values.length; i += 1) {
        sum += values[i];
    }
    return sum / values.length;
};

grob.boolean = function (v) {
    return !!v;
};

grob.ceil = Math.ceil;

grob.compare = function (v1, v2, comparator) {
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
    throw new Error("Unknown comparison operation " + comparator);
};

grob.coordinates = function (point1, distance, angle) {
    return vg.geo.coordinates(point1.x, point1.y, distance, angle);
};

grob.cos = Math.cos;

grob.degrees = function (radians) {
    return radians * 180 / Math.PI;
};

grob.distance = function (point1, point2) {
    return Math.sqrt(Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2));
};

grob.divide = function (a, b) {
    return a / b;
};

grob.e = function () {
    return Math.E;
};

grob.even = function (v) {
    return v % 2 === 0;
};

grob.floor = Math.floor;

grob.integer = function (v) {
    return v | 0;
};

grob.log = function (v) {
    return v > 0 ? Math.log(v) : -Math.log(-v);
};

grob.logical = function (bool1, bool2, comparator) {
    if (comparator === 'or') {
        return bool1 || bool2;
    } else if (comparator === 'and') {
        return bool1 && bool2;
    } else if (comparator === 'xor') {
        return !!(bool1 ^ bool2);
    }
    throw new Error("Unknown logical operation " + comparator);
};

grob.makeNumbers = function (s, separator) {
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

grob.max = function (values) {
    return Math.max.apply(null, values);
};

grob.min = function (values) {
    return Math.min.apply(null, values);
};

grob.mod = function (a, b) {
    return a % b;
};

grob.multiply = function (a, b) {
    return a * b;
};

grob.negate = function (v) {
    return -v;
};

// Compute Perlin noise
grob.noise = function (x, y, z) {
    // Call optimized internal noise function.
    return vg.math.noise(x, y, z);
};

grob.number = function (v) {
    return v;
};

grob.odd = function (v) {
    return v % 2 !== 0;
};

grob.pi = function () {
    return Math.PI;
};

grob.pow = Math.pow;

grob.radians = function (degrees) {
    return degrees * Math.PI / 180;
};

grob.range = function (min, max, step) {
    step = step || 1;
    if (step > 0 && min > max) return [];
    if (step < 0 && min < max) return [];
    if (step === 0) return [];
    var values = [];
    for (var i = min; i < max; i += step) {
        values.push(i);
    }
    return values;
};

grob.round = Math.round;

grob.runningTotal = function (values) {
    if (!values) { return [0.0]; }
    var i, b = [],
        currentTotal = 0;
    for (i = 0; i < values.length; i++) {
        b.push(currentTotal);
        currentTotal += values[i];
    }
    return b;
};

grob.sin = Math.sin;

grob.sqrt = Math.sqrt;

grob.subtract = function (a, b) {
    return a - b;
};

grob.sum = function (values) {
    if (values.length === 0) { return 0; }
    var i, sum = 0;
    for (i = 0; i < values.length; i += 1) {
        sum += values[i];
    }
    return sum;
};

module.exports = grob;
