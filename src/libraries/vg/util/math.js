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
