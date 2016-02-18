// 2-dimensional transformation matrix

'use strict';

var _ = require('lodash');

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
        this.m = [1, 0, 0, 0, 1, 0, 0, 0, 1]; // Identity matrix.
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
        a[0] * b[0] + a[1] * b[3],
        a[0] * b[1] + a[1] * b[4], 0,
        a[3] * b[0] + a[4] * b[3],
        a[3] * b[1] + a[4] * b[4], 0,
        a[6] * b[0] + a[7] * b[3] + b[6],
        a[6] * b[1] + a[7] * b[4] + b[7], 1
    ]);
};

Transform.prototype.isIdentity = function () {
    var m = this.m;
    return (m[0] === 1 && m[1] === 0 && m[2] === 0 && m[3] === 0 && m[4] === 1 && m[5] === 0 && m[6] === 0 && m[7] === 0 && m[8] === 1);
};

Transform.prototype.prepend = function (matrix) {
    return Transform._mmult(this.m, matrix.m);
};

Transform.prototype.append = function (matrix) {
    return Transform._mmult(matrix.m, this.m);
};

Transform.prototype.inverse = function () {
    var m = this.m,
        d = m[0] * m[4] - m[1] * m[3];
    return new Transform([
        m[4] / d,
        -m[1] / d, 0,
        -m[3] / d,
        m[0] / d, 0,
        (m[3] * m[7] - m[4] * m[6]) / d,
        -(m[0] * m[7] - m[1] * m[6]) / d, 1
    ]);
};

Transform.prototype.scale = function (x, y) {
    if (y === undefined) { y = x; }
    return Transform._mmult([x, 0, 0, 0, y, 0, 0, 0, 1], this.m);
};

Transform.prototype.translate = function (x, y) {
    return Transform._mmult([1, 0, 0, 0, 1, 0, x, y, 1], this.m);
};

Transform.prototype.rotate = function (angle) {
    var c = Math.cos(math.radians(angle)),
        s = Math.sin(math.radians(angle));
    return Transform._mmult([c, s, 0, -s, c, 0, 0, 0, 1], this.m);
};

Transform.prototype.skew = function (x, y) {
    var kx = Math.PI * x / 180.0,
        ky = Math.PI * y / 180.0;
    return Transform._mmult([1, Math.tan(ky), 0, -Math.tan(kx), 1, 0, 0, 0, 1], this.m);
};

// Returns the new coordinates of the given point (x,y) after transformation.
Transform.prototype.transformPoint = function (point) {
    var x = point.x,
        y = point.y,
        m = this.m;
    return new Point(
        x * m[0] + y * m[3] + m[6],
        x * m[1] + y * m[4] + m[7]
    );
};

Transform.prototype.transformPoints = function (points) {
    var _this = this;
    return _.map(points, function (pt) {
        return _this.transformPoint(pt);
    });
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
                    x: cmd.x * m[0] + cmd.y * m[3] + m[6],
                    y: cmd.x * m[1] + cmd.y * m[4] + m[7]
                };
                break;
            case QUADTO:
                commands[i] = {
                    type: QUADTO,
                    x: cmd.x * m[0] + cmd.y * m[3] + m[6],
                    y: cmd.x * m[1] + cmd.y * m[4] + m[7],
                    x1: cmd.x1 * m[0] + cmd.y1 * m[3] + m[6],
                    y1: cmd.x1 * m[1] + cmd.y1 * m[4] + m[7]
                };
                break;
            case CURVETO:
                commands[i] = {
                    type: CURVETO,
                    x: cmd.x * m[0] + cmd.y * m[3] + m[6],
                    y: cmd.x * m[1] + cmd.y * m[4] + m[7],
                    x1: cmd.x1 * m[0] + cmd.y1 * m[3] + m[6],
                    y1: cmd.x1 * m[1] + cmd.y1 * m[4] + m[7],
                    x2: cmd.x2 * m[0] + cmd.y2 * m[3] + m[6],
                    y2: cmd.x2 * m[1] + cmd.y2 * m[4] + m[7]
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
    var _this = this,
        shapes = _.map(group.shapes, function (shape) {
            return _this.transformShape(shape);
        });
    return new Group(shapes);
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
