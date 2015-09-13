'use strict';

var _ = require('lodash');
var vg = require('vg.js');
var img = require('img.js');
var math = require('./math');

var grob = {};

grob.HORIZONTAL = 'horizontal';
grob.VERTICAL = 'vertical';
grob.BOTH = 'both';

grob.LEFT = 'left';
grob.RIGHT = 'right';
grob.CENTER = 'center';
grob.TOP = 'top';
grob.BOTTOM = 'bottom';
grob.MIDDLE = 'middle';

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

grob.align = function (shape, position, hAlign, vAlign) {
    if (!shape) {
        return;
    }
    var dx, dy, t,
        x = position.x,
        y = position.y,
        bounds = vg.bounds(shape);
    if (hAlign === grob.LEFT) {
        dx = x - bounds.x;
    } else if (hAlign === grob.RIGHT) {
        dx = x - bounds.x - bounds.width;
    } else if (hAlign === grob.CENTER) {
        dx = x - bounds.x - bounds.width / 2;
    } else {
        dx = 0;
    }
    if (vAlign === grob.TOP) {
        dy = y - bounds.y;
    } else if (vAlign === grob.BOTTOM) {
        dy = y - bounds.y - bounds.height;
    } else if (vAlign === grob.MIDDLE) {
        dy = y - bounds.y - bounds.height / 2;
    } else {
        dy = 0;
    }

    t = new vg.Transform().translate(dx, dy);
    return transform(shape, t);
};

grob.colorize = function (shape, options) {
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

grob.copy = function (shape, copies, order, translate, rotate, scale) {
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

grob.flip = function (shape, axis) {
    if (axis === 'none') { return shape; }
    if (shape instanceof vg.Path || shape instanceof vg.Group || shape instanceof vg.Text || (Array.isArray(shape) && shape.length > 0 && shape[0].x !== undefined && shape[0].y !== undefined)) {
        var x = axis === grob.HORIZONTAL || axis === grob.BOTH ? -1 : 1;
        var y = axis === grob.VERTICAL || axis === grob.BOTH ? -1 : 1;
        return vg.scale(shape, new vg.Point(x, y), vg.centerPoint(shape));
    } else if (shape instanceof img.Img) {
        var image = shape;
        var layer = image.toLayer(false);
        if (axis === grob.HORIZONTAL || axis === grob.BOTH) {
            layer.flipHorizontal();
        }
        if (axis === grob.VERTICAL || axis === grob.BOTH) {
            layer.flipVertical();
        }
        return image.withCanvas(layer.toCanvas());
    }
};

grob.fit = function (shape, position, width, height, stretch) {
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

grob.fitTo = function (shape, bounding, stretch) {
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

    return grob.fit(shape, {x: bx + bw / 2, y: by + bh / 2}, bw, bh, stretch);
};

grob.hslAdjust = function (v, hue, saturation, lightness, alpha) {
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

grob.rgbAdjust = function (v, red, green, blue, alpha) {
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

grob.stack = function (shapes, direction, margin) {
    if (!shapes) {
        return [];
    }
    if (shapes.length <= 1) {
        return shapes;
    }

    var tx, ty, t, bounds,
        firstBounds = shapes[0].bounds(),
        newShapes = [];
    if (direction === 'e') {
        tx = -(firstBounds.width / 2);
        _.each(shapes, function (shape) {
            bounds = shape.bounds();
            t = new vg.Transform().translate(tx - bounds.x, 0);
            newShapes.push(transform(shape, t));
            tx += bounds.width + margin;
        });
    } else if (direction === 'w') {
        tx = firstBounds.width / 2;
        _.each(shapes, function (shape) {
            bounds = shape.bounds();
            t = new vg.Transform().translate(tx + bounds.x, 0);
            newShapes.push(transform(shape, t));
            tx -= bounds.width + margin;
        });
    } else if (direction === 'n') {
        ty = firstBounds.height / 2;
        _.each(shapes, function (shape) {
            bounds = shape.bounds();
            t = new vg.Transform().translate(0, ty + bounds.y);
            newShapes.push(transform(shape, t));
            ty -= bounds.height + margin;
        });
    } else if (direction === 's') {
        ty = -(firstBounds.height / 2);
        _.each(shapes, function (shape) {
            bounds = shape.bounds();
            t = new vg.Transform().translate(0, ty - bounds.y);
            newShapes.push(transform(shape, t));
            ty += bounds.height + margin;
        });
    }
    return newShapes;
};

grob.angle = function (point1, point2) {
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

grob.coordinates = function (point, angle, distance) {
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

grob.distance = function (point1, point2) {
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

grob.grayColor = function (gray, alpha) {
    if (!alpha && alpha !== 0) { alpha = 1; }
    return vg.Color.gray(gray, alpha, 1.0);
};

grob.hexColor = function (s) {
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

grob.hslColor = function (hue, saturation, lightness, alpha) {
    if (!alpha && alpha !== 0) { alpha = 1; }
    return vg.Color.hsl(hue, saturation, lightness, alpha, 1.0);
};

grob.rgbColor = function (red, green, blue, alpha) {
    if (!alpha && alpha !== 0) { alpha = 1; }
    return vg.Color.rgb(red, green, blue, alpha, 1.0);
};

grob.desaturate = function (shape, method) {
    if (!shape) { return null; }
    return shape.desaturate({method: method});
};

grob.invert = function (shape) {
    if (!shape) { return null; }
    if (shape instanceof img.Img) {
        var image = shape;
        var layer = image.toLayer(false);
        layer.addFilter('invert');
        return image.withCanvas(layer.toCanvas());
    }
    return shape.invert();
};

module.exports = grob;
