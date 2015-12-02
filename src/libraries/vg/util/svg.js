// SVG Parser

// The SVG engine uses code from the following libraries:
// - for parsing the main svg tree: two.js - http://jonobr1.github.io/two.js/
// - for constructing individual paths: canvg - https://code.google.com/p/canvg/
// - for constructing arcs: fabric.js - http://fabricjs.com

'use strict';

var _ = require('lodash');
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

    _.each(node.attributes, function (v) {
        var property, data, type, s, d;
        property = v.nodeName;

        switch (property) {
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
            _.each(v.nodeValue.split(';'), function (s) {
                var el = s.split(':');
                d[el[0].trim()] = el[1];
            });
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
    });

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

        _.each(node.childNodes, function (n) {

            var tag, tagName, o;
            tag = n.nodeName;
            if (!tag) { return; }
            tagName = tag.replace(/svg\:/ig, '').toLowerCase();
            if (read[tagName] !== undefined) {
                o = read[tagName].call(this, n, attributes);
                shapes.push(o);
            }
        });

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
    var doc = new xmldom.DOMParser().parseFromString(s);
    if (doc) {
        return exports.interpret(doc.documentElement);
    }
};
