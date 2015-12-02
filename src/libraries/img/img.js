'use strict';

var util = require('./util');
var CanvasRenderer = require('./canvasrenderer');
var AsyncRenderer = require('./asyncrenderer');

var img, ImageCanvas, Layer, Img;

var DEFAULT_WIDTH = 800;
var DEFAULT_HEIGHT = 800;

// Different layer types.
var TYPE_PATH = 'path';
var TYPE_IMAGE = 'image';
var TYPE_HTML_CANVAS = 'htmlCanvas';
var TYPE_IMAGE_CANVAS = 'iCanvas';
var TYPE_FILL = 'fill';
var TYPE_GRADIENT = 'gradient';

var IDENTITY_TRANSFORM = util.transform();
var Transform = IDENTITY_TRANSFORM;

var clamp = util.clamp;

// Named colors supported by all browsers.
// See: http://www.w3schools.com/html/html_colornames.asp
var colors = ['aliceblue', 'antiquewhite', 'aqua', 'aquamarine', 'azure', 'beige', 'bisque', 'black', 'blanchedalmond', 'blue', 'blueviolet', 'brown', 'burlywood', 'cadetblue', 'chartreuse', 'chocolate', 'coral', 'cornflowerblue', 'cornsilk', 'crimson', 'cyan', 'darkblue', 'darkcyan', 'darkgoldenrod', 'darkgray', 'darkgreen', 'darkkhaki', 'darkmagenta', 'darkolivegreen', 'darkorange', 'darkorchid', 'darkred', 'darksalmon', 'darkseagreen', 'darkslateblue', 'darkslategray', 'darkturquoise', 'darkviolet', 'deeppink', 'deepskyblue', 'dimgray', 'dimgrey', 'dodgerblue', 'firebrick', 'floralwhite', 'forestgreen', 'fuchsia', 'gainsboro', 'ghostwhite', 'gold', 'goldenrod', 'gray', 'green', 'greenyellow', 'grey', 'honeydew', 'hotpink', 'indianred', 'indigo', 'ivory', 'khaki', 'lavender', 'lavenderblush', 'lawngreen', 'lemonchiffon', 'lightblue', 'lightcoral', 'lightcyan', 'lightgoldenrodyellow', 'lightgreen', 'lightgrey', 'lightpink', 'lightsalmon', 'lightseagreen', 'lightskyblue', 'lightslategray', 'lightsteelblue', 'lightyellow', 'lime', 'limegreen', 'linen', 'maroon', 'mediumaquamarine', 'mediumblue', 'mediumorchid', 'mediumpurple', 'mediumseagreen', 'mediumslateblue', 'mediumspringgreen', 'mediumturquoise', 'mediumvioletred', 'midnightblue', 'mintcream', 'mistyrose', 'moccasin', 'navajowhite', 'navy', 'oldlace', 'olive', 'olivedrab', 'orange', 'orangered', 'orchid', 'palegoldenrod', 'palegreen', 'paleturquoise', 'palevioletred', 'papayawhip', 'peachpuff', 'peru', 'pink', 'plum', 'powderblue', 'purple', 'red', 'rosybrown', 'royalblue', 'saddlebrown', 'salmon', 'sandybrown', 'seagreen', 'seashell', 'sienna', 'silver', 'skyblue', 'slateblue', 'slategray', 'snow', 'springgreen', 'steelblue', 'tan', 'teal', 'thistle', 'tomato', 'transparent', 'turquoise', 'violet', 'wheat', 'white', 'whitesmoke', 'yellow', 'yellowgreen'];


// Converts a number of arguments to a type of color argument that the html canvas context can understand:
// a named color, a hex color or a string in the form of rgba(r, g, b, a)
function toColor(v1, v2, v3, v4, v5) {
    var _r, _g, _b, _a, R, G, B, rgb, options;
    if (v1 === undefined) {
        _r = _g = _b = 0;
        _a = 1;
    } else if (Array.isArray(v1)) {
        options = v2 || {};
        _r = v1[0] !== undefined ? v1[0] : 0;
        _g = v1[1] !== undefined ? v1[1] : 0;
        _b = v1[2] !== undefined ? v1[2] : 0;
        _a = v1[3] !== undefined ? v1[3] : options.base || 1;
    } else if (v1.r !== undefined) {
        options = v2 || {};
        _r = v1.r;
        _g = v1.g;
        _b = v1.b;
        _a = v1.a !== undefined ? v1.a : options.base || 1;
    } else if (typeof v1 === 'string') {
        if (v1.indexOf('#') === 0) {
            return v1;
        }
        if (v1.indexOf('rgb') === 0) {
            return v1;
        }
        if (colors.indexOf(v1) !== -1) {
            return v1;
        }
    } else if (typeof v1 === 'number') {
        if (arguments.length === 1) { // Grayscale value
            _r = _g = _b = v1;
            _a = 1;
        } else if (arguments.length === 2) { // Gray and alpha or options
            _r = _g = _b = v1;
            if (typeof v2 === 'number') {
                _a = v2;
            } else {
                options = v2;
                _a = options.base || 1;
            }
        } else if (arguments.length === 3) { // RGB or gray, alpha and options
            if (typeof v3 === 'number') {
                _r = v1;
                _g = v2;
                _b = v3;
                _a = 1;
            } else {
                _r = _g = _b = v1;
                _a = v2;
                options = v3;
            }
        } else if (arguments.length === 4) { // RGB and alpha or options
            _r = v1;
            _g = v2;
            _b = v3;
            if (typeof v4 === 'number') {
                _a = v4;
            } else {
                options = v4 || {};
                _a = options.base || 1;
            }
        } else { // RGBA + options
            _r = v1;
            _g = v2;
            _b = v3;
            _a = v4;
            options = v5;
        }
    }

    if (!(typeof _r === 'number' &&
        typeof _g === 'number' &&
        typeof _b === 'number' &&
        typeof _a === 'number')) {
        throw new Error('Invalid color arguments');
    }

    options = options || {};

    // The base option allows you to specify values in a different range.
    if (options.base !== undefined) {
        _r /= options.base;
        _g /= options.base;
        _b /= options.base;
        _a /= options.base;
    }
    R = Math.round(_r * 255);
    G = Math.round(_g * 255);
    B = Math.round(_b * 255);
    return 'rgba(' + R + ', ' + G + ', ' + B + ', ' + _a + ')';
}

// Converts a number of arguments into a dictionary of gradient information that is understood by the renderer.
function toGradientData(v1, v2, v3, v4, v5) {
    var startColor, endColor, type, rotation, spread, d;
    var data = {};

    if (arguments.length === 1) { // The argument is a dictionary or undefined.
        d = v1 || {};
        startColor = d.startColor;
        endColor = d.endColor;
        type = d.type;
        rotation = d.rotation;
        spread = d.spread;
    } else if (arguments.length >= 2) { // The first two arguments are a start color and an end color.
        startColor = v1;
        endColor = v2;
        type = 'linear';
        rotation = 0;
        spread = 0;
        if (arguments.length === 3) {
            if (typeof v3 === 'string') { // The type can be either linear or radial.
                type = v3;
            } else if (typeof v3 === 'number') { // The type is implicitly linear and the third argument is the rotation angle.
                rotation = v3;
            }
        } else if (arguments.length === 4) {
            if (typeof v3 === 'number') { // The type is implicitly linear and the third/forth arguments are the rotation angle and gradient spread.
                rotation = v3;
                spread = v4;
            } else if (v3 === 'linear') { // The type is explicitly linear and the forth argument is the rotation angle.
                rotation = v4;
            } else if (v3 === 'radial') { // The type is explicitly radial and the forth argument is the gradient spread.
                type = v3;
                spread = v4;
            } else {
                throw new Error('Wrong argument provided: ' + v3);
            }
        } else if (arguments.length === 5) { // Type, rotation (unused in case of radial type gradient), and gradient spread.
            type = v3;
            rotation = v4;
            spread = v5;
        }
    }

    if (!startColor && startColor !== 0) {
        throw new Error('No startColor was given.');
    }
    if (!endColor && endColor !== 0) {
        throw new Error('No endColor was given.');
    }

    try {
        data.startColor = toColor(startColor);
    } catch (e1) {
        throw new Error('startColor is not a valid color: ' + startColor);
    }

    try {
        data.endColor = toColor(endColor);
    } catch (e2) {
        throw new Error('endColor is not a valid color: ' + endColor);
    }

    if (type === undefined) {
        type = 'linear';
    }
    if (type !== 'linear' && type !== 'radial') {
        throw new Error('Unknown gradient type: ' + type);
    }

    data.type = type;

    if (spread === undefined) {
        spread = 0;
    }
    if (typeof spread !== 'number') {
        throw new Error('Spread value is not a number: ' + spread);
    }

    if (type === 'linear') {
        if (rotation === undefined) {
            rotation = 0;
        }
        if (typeof rotation !== 'number') {
            throw new Error('Rotation value is not a number: ' + rotation);
        }
        data.rotation = rotation;
    }

    data.spread = clamp(spread, 0, 0.99);

    return data;
}

function findType(data) {
    if (typeof data === 'string') {
        return TYPE_PATH;
    } else if (data instanceof Image) {
        return TYPE_IMAGE;
    } else if (data instanceof HTMLCanvasElement) {
        return TYPE_HTML_CANVAS;
    } else if (data instanceof ImageCanvas) {
        return TYPE_IMAGE_CANVAS;
    } else if (data.r !== undefined && data.g !== undefined && data.b !== undefined && data.a !== undefined) {
        return TYPE_FILL;
    } else if (data.startColor !== undefined && data.endColor !== undefined) {
        return TYPE_GRADIENT;
    }
    throw new Error('Cannot establish type for data ', data);
}


// IMAGE LAYER.

Layer = function (data, type) {
    if (!type) {
        type = findType(data);
    }
    this.data = data;
    this.type = type;

    if (type === TYPE_HTML_CANVAS || type === TYPE_IMAGE_CANVAS || type === TYPE_IMAGE) {
        this.width = data.width;
        this.height = data.height;
    }

    // Compositing.
    this.opacity = 1.0;
    this.blendmode = 'source-over';

    // Transformations.
    this.transform = IDENTITY_TRANSFORM;
    this.flip_h = false;
    this.flip_v = false;

    // An alpha mask hides parts of the masked layer where the mask is darker.
    this.mask = new ImageCanvas();

    this.filters = [];
};

Layer.Transform = Layer.IDENTITY_TRANSFORM = IDENTITY_TRANSFORM;

// Copies the layer object.
Layer.prototype.clone = function () {
    function cloneFilter(filter) {
        var key, value;
        var f = {};
        f.name = filter.name;
        if (filter.options !== undefined) {
            f.options = {};
            var optionsKeys = Object.keys(filter.options);
            for (var i = 0; i < optionsKeys.length; i += 1) {
                key = optionsKeys[i];
                value = filter.options[key];
                if (Array.isArray(value)) {
                    f.options[key] = value.slice(0);
                } else {
                    f.options[key] = value;
                }
            }
        }
        return f;
    }

    var d = Object.create(Layer.prototype);
    d.data = this.data;
    d.type = this.type;
    d.width = this.width;
    d.height = this.height;
    d.opacity = this.opacity;
    d.blendmode = this.blendmode;
    d.transform = this.transform;
    d.flip_h = this.flip_h;
    d.flip_v = this.flip_v;
    d.mask = this.mask.clone();
    d.filters = [];

    if (this.type === TYPE_IMAGE_CANVAS) {
        d.data = this.data.clone();
    } else if (this.type === TYPE_GRADIENT) {
        d.data = {
            startColor: this.data.startColor,
            endColor: this.data.endColor,
            type: this.data.type,
            rotation: this.data.rotation,
            spread: this.data.spread
        };
    }

    for (var i = 0; i < this.filters.length; i += 1) {
        d.filters.push(cloneFilter(this.filters[i]));
    }

    return d;
};

// Sets the opacity of the layer (requires a number in the range 0.0-1.0).
Layer.prototype.setOpacity = function (opacity) {
    this.opacity = clamp(opacity, 0, 1);
};

// Within an image canvas, a layer is by default positioned in the center.
// Translating moves the layer away from this center.
// Each successive call to the translate function performs an additional translation on top of the current transformation matrix.
Layer.prototype.translate = function (tx, ty) {
    ty = ty === undefined ? 0 : ty;
    var t = Transform.translate(tx, ty);
    this.transform = this.transform.prepend(t);
};

// Scaling happens relatively in a 0.0-1.0 based range where 1.0 stands for 100%.
// Each successive call to the scale function performs an additional scaling operation on top of the current transformation matrix.
// If only one parameter is supplied, the layer is scaled proportionally.
Layer.prototype.scale = function (sx, sy) {
    sy = sy === undefined ? sx : sy;
    var t = Transform.scale(sx, sy);
    this.transform = this.transform.prepend(t);
};

// The supplied parameter should be in degrees (not radians).
// Each successive call to the rotation function performs an additional rotation on top of the current transformation matrix.
Layer.prototype.rotate = function (rot) {
    var t = Transform.rotate(rot);
    this.transform = this.transform.prepend(t);
};

// Each successive call to the skew function performs an additional skewing operation on top of the current transformation matrix.
Layer.prototype.skew = function (kx, ky) {
    ky = ky === undefined ? kx : ky;
    var t = Transform.skew(kx, ky);
    this.transform = this.transform.prepend(t);
};

// Flips the layer horizontally.
Layer.prototype.flipHorizontal = function (arg) {
    if (arg !== undefined) {
        this.flip_h = arg;
    } else {
        this.flip_h = !this.flip_h;
    }
};

// Flips the layer vertically.
Layer.prototype.flipVertical = function (arg) {
    if (arg !== undefined) {
        this.flip_v = arg;
    } else {
        this.flip_v = !this.flip_v;
    }
};

Layer.prototype.addFilter = function (filter, options) {
    this.filters.push({
        name: filter,
        options: options
    });
};

// Renders the layer to a new canvas.
Layer.prototype.draw = function (ctx) {
    var width = this.width === undefined ? DEFAULT_WIDTH : this.width;
    var height = this.height === undefined ? DEFAULT_HEIGHT : this.height;
    var canvas = new ImageCanvas(width, height);
    canvas.addLayer(this);
    canvas.draw(ctx);
};

Layer.prototype.toCanvas = function () {
    var canvas = document.createElement('canvas');
    canvas.width = this.width;
    canvas.height = this.height;
    var ctx = canvas.getContext('2d');
    this.draw(ctx);
    return canvas;
};

Layer.fromFile = function (filename) {
    return new Layer(filename, TYPE_PATH);
};

Layer.fromImage = function (image) {
    return new Layer(image, TYPE_IMAGE);
};

Layer.fromCanvas = function (canvas) {
    if (canvas instanceof HTMLCanvasElement) {
        return Layer.fromHtmlCanvas(canvas);
    }
    return Layer.fromImageCanvas(canvas);
};

Layer.fromHtmlCanvas = function (canvas) {
    return new Layer(canvas, TYPE_HTML_CANVAS);
};

Layer.fromImageCanvas = function (iCanvas) {
    return new Layer(iCanvas, TYPE_IMAGE_CANVAS);
};

Layer.fromColor = function (color) {
    return new Layer(toColor(color), TYPE_FILL);
};

Layer.fromGradient = function () {
    return new Layer(toGradientData.apply(null, arguments), TYPE_GRADIENT);
};

Layer.prototype.isPath = function () {
    return this.type === TYPE_PATH;
};

Layer.prototype.isFill = function () {
    return this.type === TYPE_FILL;
};

Layer.prototype.isGradient = function () {
    return this.type === TYPE_GRADIENT;
};

Layer.prototype.isHtmlCanvas = function () {
    return this.type === TYPE_HTML_CANVAS;
};

Layer.prototype.isImage = function () {
    return this.type === TYPE_IMAGE;
};

Layer.prototype.isImageCanvas = function () {
    return this.type === TYPE_IMAGE_CANVAS;
};


// IMAGE PIXELS.

var Pixels = function (canvas) {
    this.width = canvas.width;
    this.height = canvas.height;
    var ctx = canvas.getContext('2d');
    this._data = ctx.getImageData(0, 0, this.width, this.height);
    this.array = this._data.data;
};

Pixels.prototype.get = function (i) {
    i *= 4;
    var v = this.array;
    return [v[i + 0], v[i + 1], v[i + 2], v[i + 3]];
};

Pixels.prototype.set = function (i, rgba) {
    i *= 4;
    var v = this.array;
    v[i + 0] = rgba[0];
    v[i + 1] = rgba[1];
    v[i + 2] = rgba[2];
    v[i + 3] = rgba[3];
};

Pixels.prototype.toCanvas = function () {
    var canvas = document.createElement('canvas');
    canvas.width = this.width;
    canvas.height = this.height;
    var ctx = canvas.getContext('2d');
    ctx.putImageData(this._data, 0, 0);
    return canvas;
};


// IMAGE CANVAS.

ImageCanvas = function (width, height) {
    if (!width) {
        width = DEFAULT_WIDTH;
    }
    if (!height) {
        height = DEFAULT_HEIGHT;
    }

    this.width = width;
    this.height = height;
    this.layers = [];
};

// Copies the ImageCanvas.
ImageCanvas.prototype.clone = function () {
    var c = new ImageCanvas(this.width, this.height);
    for (var i = 0; i < this.layers.length; i += 1) {
        c.layers.push(this.layers[i].clone());
    }
    return c;
};

// Creates a new layer from figuring out the given argument(s) and adds it to the canvas.
ImageCanvas.prototype.addLayer = function (arg0) {
    var layer;

    try {
        return this.addGradientLayer.apply(this, arguments);
    } catch (e1) {
    }

    try {
        return this.addColorLayer.apply(this, arguments);
    } catch (e2) {
    }

    if (arguments.length === 1) {
        if (typeof arg0 === 'string') {
            layer = new Layer(arg0, TYPE_PATH);
        } else if (arg0 instanceof Layer) {
            layer = arg0;
        } else if (arg0 instanceof HTMLCanvasElement) {
            layer = new Layer(arg0, TYPE_HTML_CANVAS);
        } else if (arg0 instanceof Image) {
            layer = new Layer(arg0, TYPE_IMAGE);
        } else if (arg0 instanceof ImageCanvas) {
            layer = new Layer(arg0, TYPE_IMAGE_CANVAS);
        }
    }

    if (!layer) {
        throw new Error('Error creating layer.');
    }

    this.layers.push(layer);
    return layer;
};

// Adds a new color layer to the canvas.
ImageCanvas.prototype.addColorLayer = function () {
    var c = toColor.apply(null, arguments);
    var layer = new Layer(c, TYPE_FILL);
    this.layers.push(layer);
    return layer;
};

// Adds a new gradient layer to the canvas.
ImageCanvas.prototype.addGradientLayer = function () {
    var c = toGradientData.apply(null, arguments);
    var layer = new Layer(c, TYPE_GRADIENT);
    this.layers.push(layer);
    return layer;
};

// Renders the canvas and passes the result (a html canvas) to the given callback function.
ImageCanvas.prototype.render = function (callback) {
    var renderer = callback ? AsyncRenderer : CanvasRenderer;
    return renderer.render(this, callback);
};

// Renders the canvas on another canvas.
ImageCanvas.prototype.draw = function (ctx, callback) {
    if (callback) {
        this.render(function (canvas) {
            ctx.drawImage(canvas, 0, 0, canvas.width, canvas.height);
        });
    } else {
        var canvas = this.render();
        ctx.drawImage(canvas, 0, 0, canvas.width, canvas.height);
    }
};


// Img

function isPoint(arg) {
    if (!arg) { return false; }
    return arg.x !== undefined && arg.y !== undefined;
}

function pointFromArray(arg) {
    var x = arg[0];
    var y = arg.length > 1 ? arg[1] : x;
    return {x: x, y: y};
}

function pointFromNumber(arg) {
    return {x: arg, y: arg};
}

function isValidArg(arg) {
    return arg !== undefined && arg !== null;
}

function convertArg(arg) {
    if (Array.isArray(arg)) {
        return pointFromArray(arg);
    } else if (typeof arg === 'number') {
        return pointFromNumber(arg);
    } else if (isPoint(arg)) {
        return arg;
    }
}

Img = function (canvas, x, y) {
    this.canvas = canvas;
    this.originalWidth = canvas ? canvas.width : 0;
    this.originalHeight = canvas ? canvas.height: 0;
    this.transform = x || y ? Transform.translate(x, y) : Layer.IDENTITY_TRANSFORM;
};

Img.prototype.clone = function () {
    var n = new Img();
    n.canvas = this.canvas;
    n.originalWidth = this.originalWidth;
    n.originalHeight = this.originalHeight;
    n.transform = this.transform;
    return n;
};

Img.prototype.withCanvas = function (canvas) {
    var n = this.clone();
    n.canvas = canvas;
    return n;
};

Img.prototype._transform = function (t) {
    var n = this.clone();
    n.transform = n.transform.prepend(t);
    return n;
};

Img.prototype.translate = function (position) {
    var t = pointFromNumber(0);
    var args = arguments;
    if (args.length === 1 && isValidArg(position)) {
        t = convertArg(position);
    } else if (args.length === 2) {
        t = {x: args[0], y: args[1]};
    }
    if (t.x === 0 && t.y === 0) { return this; }
    return this._transform(Transform.translate(t.x, t.y));
};

Img.prototype.rotate = function (angle) {
    if (!angle) { return this; }
    var o = pointFromNumber(0);
    var args = arguments;
    if (args.length === 2) {
        o = convertArg(args[1]);
    } else if (args.length === 3) {
        o = {x: args[1], y: args[2]};
    }
    return this._transform(Transform.translate(o.x, o.y).rotate(angle).translate(-o.x, -o.y));
};

Img.prototype.scale = function (scale) {
    var s = pointFromNumber(1);
    var o = pointFromNumber(0);
    var args = arguments;
    if (args.length === 1 && isValidArg(scale)) {
        s = convertArg(scale);
    } else if (args.length === 2) {
        if (typeof scale === 'number' && typeof args[1] === 'number') {
            s = {x: args[0], y: args[1]};
        } else {
            s = convertArg(scale);
            o = convertArg(args[1]);
        }
    } else if (args.length === 4) {
        s = {x: args[0], y: args[1]};
        o = {x: args[2], y: args[3]};
    }
    if (s.x === 1 && s.y === 1) { return this; }
    return this._transform(Transform.translate(o.x, o.y).scale(s.x, s.y).translate(-o.x, -o.y));
};

Img.prototype.skew = function (skew) {
    var k = pointFromNumber(0);
    var o = pointFromNumber(0);
    var args = arguments;
    if (args.length === 1 && isValidArg(skew)) {
        k = convertArg(skew);
    } else if (args.length === 2) {
        if (typeof skew === 'number' && typeof args[1] === 'number') {
            k = {x: args[0], y: args[1]};
        } else {
            k = convertArg(skew);
            o = convertArg(args[1]);
        }
    } else if (args.length === 4) {
        k = {x: args[0], y: args[1]};
        o = {x: args[2], y: args[3]};
    }
    if (k.x === 0 && k.y === 0) { return this; }
    return this._transform(Transform.translate(o.x, o.y).skew(k.x, k.y).translate(-o.x, -o.y));
};

Img.prototype.transformed = function () {
    return img.merge([this]);
};

Img.prototype.bounds = function () {
    var t = this.transform;
    var x = this.originalWidth / 2;
    var y = this.originalHeight / 2;

    var p1 = {x: -x, y: -y};
    var p2 = {x: x, y: -y};
    var p3 = {x: -x, y: y};
    var p4 = {x: x, y: y};
    var points = [p1, p2, p3, p4];
    var pt, minx, miny, maxx, maxy;

    for (var i = 0; i < 4; i += 1) {
        pt = t.transformPoint(points[i]);
        if (i === 0) {
            minx = maxx = pt.x;
            miny = maxy = pt.y;
        } else {
            if (pt.x < minx) {
                minx = pt.x;
            }
            if (pt.x > maxx) {
                maxx = pt.x;
            }
            if (pt.y < miny) {
                miny = pt.y;
            }
            if (pt.y > maxy) {
                maxy = pt.y;
            }
        }
    }
    return {x: minx, y: miny, width: maxx - minx, height: maxy - miny};
};

Img.prototype.colorize = function (color) {
    var colorLayer = Layer.fromColor(color);
    colorLayer.width = this.originalWidth;
    colorLayer.height = this.originalHeight;
    var i = new Img(colorLayer.toCanvas());
    i = i._transform(this.transform.matrix());
    return img.merge([this, i]);
};

Img.prototype.desaturate = function (options) {
    var layer = this.toLayer(false);
    layer.addFilter('desaturate', options);
    return this.withCanvas(layer.toCanvas());
};

Img.prototype.crop = function (bounding) {
    // Calculates the intersecting rectangle of two input rectangles.
    function rectIntersect(r1, r2) {
        var right1 = r1.x + r1.width,
            bottom1 = r1.y + r1.height,
            right2 = r2.x + r2.width,
            bottom2 = r2.y + r2.height,

            x = Math.max(r1.x, r2.x),
            y = Math.max(r1.y, r2.y),
            w = Math.max(Math.min(right1, right2) - x, 0),
            h = Math.max(Math.min(bottom1, bottom2) - y, 0);
        return {x: x, y: y, width: w, height: h};
    }

    var iBounds = this.bounds();
    var bounds = bounding.bounds();
    var ri = rectIntersect(iBounds, bounds);
    var width = Math.ceil(ri.width);
    var height = Math.ceil(ri.height);

    if (ri.width === 0 || ri.height === 0) {
        throw new Error('Resulting image has no dimensions');
    }

    var canvas = new img.ImageCanvas(width, height);
    var l1 = canvas.addLayer(this.toLayer());
    l1.translate(width / 2 - bounds.width - bounds.x,
        height / 2 - bounds.height - bounds.y);
    if (width < bounds.width && ri.x > iBounds.x) {
        l1.translate(bounds.width - width, 0);
    }
    if (height < bounds.height && ri.y > iBounds.y) {
        l1.translate(0, bounds.height - height);
    }

    return new Img(canvas.render(), ri.x + width / 2, ri.y + height / 2);
};

Img.prototype.draw = function (ctx) {
    ctx.save();
    var m = this.transform.matrix();
    ctx.transform(m[0], m[1], m[3], m[4], m[6], m[7]);
    ctx.translate(-this.originalWidth / 2, -this.originalHeight / 2);
    ctx.drawImage(this.canvas, 0, 0);
    ctx.restore();
};

Img.prototype.toLayer = function (copyTransformations) {
    var canvas = document.createElement('canvas');
    canvas.width = this.canvas.width;
    canvas.height = this.canvas.height;
    var ctx = canvas.getContext('2d');
    ctx.drawImage(this.canvas, 0, 0);
    var layer = img.Layer.fromHtmlCanvas(canvas);
    if (copyTransformations === undefined) {
        copyTransformations = true;
    }
    if (copyTransformations) {
        layer.transform = this.transform;
    }
    return layer;
};

Img.prototype.getPixels = function () {
    return new Pixels(this.canvas);
};

Img.prototype.toImage = function () {
    var b = this.bounds();
    var cropped = this.crop({bounds: function() { return b; }});
    var i = new Image();
    i.width = cropped.canvas.width;
    i.height = cropped.canvas.height;
    i.src = cropped.canvas.toDataURL();
    return i;
};

img = {};
img.Layer = Layer;
img.ImageCanvas = ImageCanvas;
img.Img = Img;
img.Pixels = Pixels;

// MODULE SUPPORT ///////////////////////////////////////////////////////

var async = require('async');

function loadImage(image, callback) {
    var img = new Image();
    img.onload = function () {
        callback(null, [image, this]);
    };
    img.src = image;
}

function loadImages(images, callback) {
    async.map(images,
        loadImage, function (err, loadedImages) {
            if (callback) {
                var name, image;
                var d = {};
                for (var i = 0; i < loadedImages.length; i += 1) {
                    name = loadedImages[i][0];
                    image = loadedImages[i][1];
                    d[name] = image;
                }
                callback(d);
            }
        });
}

function rectUnite(r1, r2) {
    var x = Math.min(r1.x, r2.x),
        y = Math.min(r1.y, r2.y),
        width = Math.max(r1.x + r1.width, r2.x + r2.width) - x,
        height = Math.max(r1.y + r1.height, r2.y + r2.height) - y;
    return {x: x, y: y, width: width, height: height};
}

function merge(images) {
    var i, image, b, l;
    for (i = 0; i < images.length; i += 1) {
        image = images[i];
        if (i === 0) {
            b = image.bounds();
        } else {
            b = rectUnite(b, image.bounds());
        }
    }
    var dx = b.width / 2 + b.x;
    var dy = b.height / 2 + b.y;

    var canvas = new ImageCanvas(b.width, b.height);
    for (i = 0; i < images.length; i += 1) {
        l = canvas.addLayer(images[i].toLayer());
        l.translate(-dx, -dy);
    }
    return new Img(canvas.render(), dx, dy);
}

img.loadImages = loadImages;
img.merge = merge;

module.exports = img;
