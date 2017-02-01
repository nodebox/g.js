// Bézier path object

'use strict';

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

function flatten(arr) {
    return arr.reduce(function (flat, toFlatten) {
        return flat.concat(Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten);
    }, []);
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
