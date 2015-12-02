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
    } else if (o.x !== undefined && o.y !== undefined) {
        return true;
    } else if (o.r !== undefined && o.g !== undefined && o.b !== undefined) {
        return true;
    } else {
        return false;
    }
};

vg.drawPoints = function (ctx, points) {
    var pt, i;
    ctx.fillStyle = 'blue';
    ctx.beginPath();
    for (i = 0; i < points.length; i += 1) {
        pt = points[i];
        ctx.moveTo(pt.x, pt.y);
        ctx.arc(pt.x, pt.y, 2, 0, Math.PI * 2, false);
    }
    ctx.fill();
};

vg.drawColoredPoints = function (ctx, points) {
    for (var i = 0, n = points.length; i < n; i += 1) {
        var pt = points[i];
        ctx.fillStyle = Color.toCSS(pt);
        ctx.fillRect(pt.x - 2, pt.y - 2, 4, 4);
    }
};

vg.drawRectangles = function (ctx, rectangles) {
    var i, r;
    ctx.save();
    for (i = 0; i < rectangles.length; i += 1) {
        r = rectangles[i];
        ctx.strokeStyle = 'black';
        ctx.strokeWidth = 1;
        ctx.rect(r.x, r.y, r.width, r.height);
        ctx.stroke();
    }
    ctx.restore();
};

vg.drawColors = function (ctx, colors) {
    var i, c;
    ctx.save();
    for (i = 0; i < colors.length; i += 1) {
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
        } else if (k.x !== undefined && k.y !== undefined) {
            if (k.r !== undefined && k.g !== undefined && k.b !== undefined) {
                vg.drawColoredPoints(ctx, isArray ? o : [o]);
            } else if (k.width !== undefined && k.height !== undefined) {
                vg.drawRectangles(ctx, isArray ? o : [o]);
            } else {
                vg.drawPoints(ctx, isArray ? o : [o]);
            }
        } else if (k.r !== undefined && k.g !== undefined && k.b !== undefined) {
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
