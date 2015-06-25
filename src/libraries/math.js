'use strict';

var _ = require('lodash');

var util = require('./util');
var vg = require('vg.js');

var grob = {};

var TWO_PI = Math.PI * 2;

grob.abs = Math.abs;

grob.accumulate = function (values) {
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

grob.add = function (a, b) {
    if (arguments.length === 2) { return a + b; }
    return _.reduce(arguments, function(total, n) {
        return total + n;
    }, 0);
};

grob.and = function (bool1, bool2) {
    var argLength = arguments.length;
    if (argLength === 2) {
        return bool1 && bool2;
    } else if (argLength === 1) {
        return !!bool1;
    } else if (argLength === 0) {
        throw new Error('Wrong number of arguments');
    }
    return _.reduce(arguments, function(b1, b2) {
        return b1 && b2;
    }, true);
};

grob.average = function (values) {
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
    throw new Error('Unknown comparison operation ' + comparator);
};

grob.cos = Math.cos;

grob.degrees = function (radians) {
    return radians * 180 / Math.PI;
};

grob.divide = function (a, b) {
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
    return _.reduce([].slice.call(arguments, 1), function(total, n) {
        checkIfZero(n);
        return total / n;
    }, arguments[0]);
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

grob.max = function () {
    var values = arguments;
    if (arguments.length === 1 && Array.isArray(arguments[0])) {
        values = arguments[0];
    }
    if (values.length === 0) {
        throw new Error('Wrong number of arguments');
    }
    return Math.max.apply(null, values);
};

grob.min = function () {
    var values = arguments;
    if (arguments.length === 1 && Array.isArray(arguments[0])) {
        values = arguments[0];
    }
    if (values.length === 0) {
        throw new Error('Wrong number of arguments');
    }
    return Math.min.apply(null, values);
};

grob.mod = function (a, b) {
    return a % b;
};

grob.multiply = function (a, b) {
    var argLength = arguments.length;
    if (argLength === 2) { return a * b; }
    else if (argLength === 1) { return a; }
    return _.reduce(arguments, function(total, n) {
        return total * n;
    }, 1);
};

grob.negate = function (v) {
    return -v;
};

grob.not = function (bool) {
    return !bool;
};

grob.number = function (v) {
    return v;
};

grob.odd = function (v) {
    return v % 2 !== 0;
};

grob.or = function (bool1, bool2) {
    var argLength = arguments.length;
    if (argLength === 2) {
        return bool1 || bool2;
    } else if (argLength === 1) {
        return !!bool1;
    } else if (argLength === 0) {
        throw new Error('Wrong number of arguments');
    }
    return _.reduce(arguments, function(b1, b2) {
        return b1 || b2;
    }, false);
};

// Compute Perlin noise
grob.perlinNoise = function (x, y, z) {
    // Call optimized internal noise function.
    return vg.math.noise(x, y, z);
};

grob.pi = function () {
    return Math.PI;
};

grob.pow = Math.pow;

grob.radians = function (degrees) {
    return degrees * Math.PI / 180;
};

grob.randomNumbers = function (amount, min, max, seed) {
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

grob.range = function (min, max, step, includeMax) {
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

grob.round = function (v, a) {
    a = a | 0;
    if (!a) {
        return Math.round(v);
    }
    return Math.round(v / a) * a;
};

grob.sample = function (amount, min, max, circular) {
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

grob.sineWave = function (v, min, max, period, offset) {
    if (min === undefined) min = -1;
    if (max === undefined) max = 1;
    if (period === undefined) period = 1;
    if (offset === undefined) offset = 0;
    var amplitude = (max - min) / 2;
    return (min + amplitude) + Math.sin((offset + v) * TWO_PI / period) * amplitude;
};

grob.squareWave = function (v, min, max, period, offset) {
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

grob.triangleWave = function (v, min, max, period, offset) {
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

grob.sawtoothWave = function (v, min, max, period, offset) {
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

grob.sign = function (v) {
    if (v > 0) {
        return 1;
    } else if (v === 0) {
        return 0;
    } else {
        return -1;
    }
};

grob.sin = Math.sin;

grob.sqrt = Math.sqrt;

grob.subtract = function (a, b) {
    var argLength = arguments.length;
    if (argLength === 2) { return a - b; }
    else if (argLength === 1) { return -a; }
    else if (argLength === 0) { throw new Error('Wrong number of arguments'); }
    return _.reduce([].slice.call(arguments, 1), function(total, n) {
        return total - n;
    }, arguments[0]);
};

grob.tan = Math.tan;

grob.total = function (values) {
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

grob.xor = function (bool1, bool2) {
    var argLength = arguments.length;
    if (argLength === 2) {
        return !!(bool1 ^ bool2);
    } else {
        throw new Error('Wrong number of arguments');
    }
};

module.exports = grob;
