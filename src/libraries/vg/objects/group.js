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
