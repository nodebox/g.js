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
