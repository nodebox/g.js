// Text object

// Internally the object is called "GText" to avoid conflicts with the DOM Text object.
// Externally it is exposed as g.Text.

'use strict';

var Color = require('../objects/color');
var Rect = require('../objects/rect');
var Transform = require('../objects/transform');

var _dummyContext = null;

// Generates a Text object.
// The function can take many possible argument forms, either by listing them in order
// (text, x, y, fontFamily, fontSize, align, fill), or by using an options object.
// The position can be specified as x, y; using a point {x: 10, y: 20} or using an array [10, 20].
// Here are a couple of ways to generate 'Hello' at position 0, 0 in 12pt Helvetica, centered.
//
//     new g.Text('Hello', {x: 0, y: 0}, 'Helvetica', 12, 'center');
//     new g.Text('Hello', [0, 0], {fontFamily: 'Helvetica', fontSize: 12, textAlign: 'center'});
//     new g.Text('Hello', 0, 0, {fontFamily: 'Helvetica', fontSize: 12});  // align: center is the default.
//     new g.Text('Hello', {fontFamily: 'Helvetica', fontSize: 12}); // the position defaults to 0,0.
var GText = function (text) {
    var args = Array.prototype.slice.call(arguments, 1),
        secondArg = arguments[1],
        thirdArg = arguments[2],
        lastArg = arguments[arguments.length - 1],
        options;

    // The text is required and always the first argument.
    this.text = String(text);

    // Second argument is position (as object or array) or x (as number).
    if (typeof secondArg === 'number') {
        this._x = secondArg;
        this._y = thirdArg;
        args = args.slice(2);
    } else if (Array.isArray(secondArg)) {
        this._x = secondArg[0];
        this._y = secondArg[1];
        args = args.slice(1);
    } else if (typeof secondArg === 'object') {
        this._x = secondArg.x !== undefined ? secondArg.x : 0;
        this._y = secondArg.y !== undefined ? secondArg.y : 0;
        args = args.slice(1);
    } else {
        this._x = 0;
        this._y = 0;
    }

    // The options object, if provided, is always the last argument.
    if (typeof lastArg === 'object') {
        options = lastArg;
        if (secondArg !== lastArg) {
            args = args.slice(0, args.length - 1);
        }
    } else {
        options = {};
    }

    if (args.length) {
        this.fontFamily = args.shift();
    } else {
        this.fontFamily = options.fontFamily || options.fontName || options.font || 'sans-serif';
    }

    if (args.length) {
        this.fontSize = args.shift();
    } else {
        this.fontSize = options.fontSize || 24;
    }

    if (args.length) {
        this.textAlign = args.shift();
    } else {
        this.textAlign = options.align || options.textAlign || 'left';
    }

    if (args.length) {
        this.fill = args.shift();
    } else {
        this.fill = options.fill || 'black';
    }

    this.transform = new Transform();
};

GText.prototype.clone = function () {
    var t = new GText();
    t.text = this.text;
    t._x = this._x;
    t._y = this._y;
    t.fontFamily = this.fontFamily;
    t.fontSize = this.fontSize;
    t.textAlign = this.textAlign;
    t.fill = Color.clone(this.fill);
    t.transform = this.transform;
    return t;
};

// The `measureWidth` function requires a canvas, so we set up a dummy one
// that we re-use for the duration of the page.
GText._getDummyContext = function () {
    if (!_dummyContext) {
        if (typeof document !== 'undefined') {
            _dummyContext = document.createElement('canvas').getContext('2d');
        } else {
            // For node.js, use a fake context that estimates the width.
            _dummyContext = {
                font: '10px sans-serif',
                measureText: function (text) {
                    var fontSize = parseFloat(this.font);
                    // The 0.6 is the average width / fontSize ratio across all characters and font sizes.
                    return {width: text.length * fontSize * 0.6};
                }
            };
        }
    }
    return _dummyContext;
};

GText.prototype._getFont = function () {
    return this.fontSize + 'px ' + this.fontFamily;
};

GText.prototype.colorize = function (fill) {
    var t = this.clone();
    t.fill = Color.clone(fill);
    return t;
};

GText.prototype.draw = function (ctx) {
    ctx.save();
    ctx.font = this._getFont();
    ctx.textAlign = this.textAlign;
    var m = this.transform.m;
    ctx.transform(m[0], m[1], m[2], m[3], m[4], m[5]);
    ctx.fillStyle = Color.toCSS(this.fill);
    ctx.fillText(this.text, this._x, this._y);
    ctx.restore();
};

GText.prototype.bounds = function () {
    var ctx = GText._getDummyContext(),
        metrics,
        x = this._x;
    ctx.font = this._getFont();
    // FIXME: measureText returns a TextMetrics object that only contains width.
    metrics = ctx.measureText(this.text);
    if (this.textAlign === 'center') {
        x = this._x - (metrics.width / 2);
    } else if (this.textAlign === 'right') {
        x = this._x - metrics.width;
    }
    return new Rect(x, this._y - this.fontSize, metrics.width, this.fontSize * 1.2);
};

GText.prototype.toSVG = function () {
    var svg = '<text';
    svg += ' x="' + this._x + '"';
    svg += ' y="' + this._y + '"';
    svg += ' font-family="' + this.fontFamily + '"';
    svg += ' font-size="' + this.fontSize + '"';
    var textAnchor;
    if (this.textAlign === 'left') {
        textAnchor = 'start';
    } else if (this.textAlign === 'center') {
        textAnchor = 'middle';
    } else if (this.textAlign === 'right') {
        textAnchor = 'end';
    }
    svg += ' text-anchor="' + textAnchor + '"';
    if (this.fill !== 'black') {
        svg += ' fill="' + Color.toCSS(this.fill) + '"';
    }
    if (!this.transform.isIdentity()) {
        svg += ' transform="matrix(' + this.transform.m.join(',') + ')"';
    }
    svg += '>';
    svg += this.text;
    svg += '</text>';
    return svg;
};

module.exports = GText;
