'use strict';

var assert = require('assert');
var mocha = require('mocha');
var describe = mocha.describe;
var it = mocha.it;

var vg = require('../src/libraries/vg/vg');

function assertAlmostEqual(v1, v2, delta) {
    delta = delta !== undefined ? delta : 0.0001;
    assert(Math.abs(v1 - v2) < delta);
}

function assertRectsAlmostEqual(r1, r2) {
    assertAlmostEqual(r1.x, r2.x);
    assertAlmostEqual(r1.y, r2.y);
    assertAlmostEqual(r1.width, r2.width);
    assertAlmostEqual(r1.height, r2.height);
}

function assertXYEqual(pt, x, y) {
    assert.equal(pt.x, x);
    assert.equal(pt.y, y);
}

describe('The math module', function () {

    it('can sum numbers', function () {
        assert.equal(vg.math.sum([]), 0);
        assert.equal(vg.math.sum([1]), 1);
        assert.equal(vg.math.sum([1, 2, 3]), 6);
    });

    it('can round numbers', function () {
        assert.equal(vg.math.round(0.1), 0);
        assert.equal(vg.math.round(0.9), 1);
        assert.equal(vg.math.round(1.234, 1), 1.2);
        assert.equal(vg.math.round(1.289, 1), 1.3);
        assert.equal(vg.math.round(123, -1), 120);
        assert.equal(vg.math.round(123, -2), 100);
    });

    it('can clamp numbers', function () {
        assert.equal(vg.math.clamp(5, -10, 10), 5);
        assert.equal(vg.math.clamp(-100, -10, 10), -10);
        assert.equal(vg.math.clamp(100, -10, 10), 10);
        assert.equal(vg.math.clamp(42, 0, 0), 0);
        // You can switch min / max
        assert.equal(vg.math.clamp(-100, -10, 10), -10);
        assert.equal(vg.math.clamp(-100, 10, -10), -10);
    });

    it('can interpolate two numbers', function () {
        assert.equal(vg.math.mix(0, 100, 0), 0);
        assert.equal(vg.math.mix(0, 100, 1), 100);
        assert.equal(vg.math.mix(0, 100, -1), -100);
        assert.equal(vg.math.mix(0, 100, 2), 200);
        assert.equal(vg.math.mix(0, 100, -1, true), 0);
        assert.equal(vg.math.mix(0, 100, 2, true), 100);
    });

    it('can snap numbers', function () {
        assert.equal(vg.math.snap(0, 100), 0);
        assert.equal(vg.math.snap(49, 100), 0);
        assert.equal(vg.math.snap(50, 100), 100);

        assert.equal(vg.math.snap(50, 100, 0), 50);
        assert.equal(vg.math.snap(50, 100, 0.5), 75);
        assert.equal(vg.math.snap(50, 100, 1), 100);
    });

    it('can generate noise', function () {
        assert.equal(vg.math.noise(0, 0, 0), 0.5);
        assert.equal(vg.math.round(vg.math.noise(0.1, 0.2, 0.3), 3), 0.676);
    });

});

describe('The bezier module', function () {

    it('can calculate line lengths', function () {
        assert.equal(vg.bezier.lineLength(0, 0, 100, 0), 100);
        assert.equal(vg.bezier.lineLength(100, 0, 0, 0), 100);
        assert.equal(Math.round(vg.bezier.lineLength(0, 0, 50, 50)), 71);
    });

    it('can calculate segment lengths', function () {
        var p = new vg.Path();
        p.moveTo(0, 0);
        p.lineTo(100, 0);
        p.lineTo(100, 50);
        p.close();
        var segmentLengths = vg.bezier.segmentLengths(p.commands);
        assert.equal(segmentLengths.length, p.commands.length - 1);
        assert.equal(segmentLengths[0], 100);
        assert.equal(segmentLengths[1], 50);
        assert.equal(Math.round(segmentLengths[2]), 112);
    });

});

describe('A point', function () {

    it('has a sane constructor', function () {
        assert.deepEqual(new vg.Point().xy, [0, 0]);
        assert.deepEqual(new vg.Point(3, 5).xy, [3, 5]);
    });

});

describe('A path', function () {

    it('can render itself to SVG', function () {
        var p;
        p = new vg.Path();
        p.moveTo(10, 20);
        p.lineTo(30, 40);
        p.close();
        assert.equal(p.toSVG(), '<path d="M10 20L30 40Z"/>');
    });

    it('can clone itself', function () {
        var p, newP;
        p = new vg.Path();
        p.fill = 'red';
        p.stroke = 'green';
        p.strokeWidth = 5;
        p.moveTo(33, 66);
        newP = p.clone();
        assert.deepEqual(newP.commands, [
            {type: 'M', x: 33, y: 66}
        ]);
        assert.equal(newP.fill, 'red');
        assert.equal(newP.stroke, 'green');
    });

    it('has bounds', function () {
        var p = new vg.Path();
        assert.deepEqual(p.bounds(), new vg.Rect(0, 0, 0, 0));
        p.addRect(10, 20, 30, 40);
        assert.deepEqual(p.bounds(), new vg.Rect(10, 20, 30, 40));
        p.addRect(70, -10, 60, 45);
        assert.deepEqual(p.bounds(), new vg.Rect(10, -10, 120, 70));
    });

    it('has a length', function () {
        var p1 = new vg.Path();
        assert.equal(p1.length(), 0);
        p1.addLine(50, -15, 50, 80);
        assertAlmostEqual(p1.length(), 95);
        var p2 = new vg.Path();
        p2.addLine(0, 0, 50, 50);
        assertAlmostEqual(p2.length(), 70.7107);
        var p3 = new vg.Path();
        p3.addEllipse(0, 0, 100, 100);
        assertAlmostEqual(p3.length(), 314.159, 0.05);
    });

    it('can be resampled', function () {
        var p = new vg.Path(),
            newPath;
        p.addRect(10, 20, 30, 40);
        newPath = p.resampleByAmount(100);
        assert.equal(newPath.commands.length, 101); // 100 lines + 1 close command
        newPath = p.resampleByLength(1);
        assert.equal(newPath.commands.length, 141); // 140 lines + 1 close command
        newPath = p.resampleByLength(2);
        assert.equal(newPath.commands.length, 71); // 70 lines + 1 close command
    });

    it('can resample open shapes', function () {
        var p = new vg.Path();
        p.addLine(10, 20, 30, 40);
        var newPath = p.resampleByAmount(100);
        assert.equal(newPath.commands.length, 100);
        newPath = p.resampleByLength(1);
        assert.equal(newPath.commands.length, 29);
        newPath = p.resampleByLength(2);
        assert.equal(newPath.commands.length, 15);
    });

    it('can be colorized', function () {
        function f(p, fill, stroke, strokeWidth) {
            assert.equal(p.fill, fill);
            assert.equal(p.stroke, stroke);
            assert.equal(p.strokeWidth, strokeWidth);
        }
        var p = new vg.Path();
        f(p, 'black', null, 1);
        p = p.colorize('red');
        f(p, 'red', null, 1);
        p = p.colorize({stroke: 'green'});
        f(p, 'red', 'green', 1);
        p = p.colorize({fill: 'pink', strokeWidth: 3});
        f(p, 'pink', 'green', 3);
    });
});

describe('A group', function () {

    it('can render itself to SVG', function () {
        var group, p;
        group = new vg.Group();
        assert.equal(group.toSVG(), '<g></g>');
        p = new vg.Path();
        p.moveTo(10, 20);
        p.lineTo(30, 40);
        p.close();
        group = vg.group([p]);
        assert.equal(group.toSVG(), '<g><path d="M10 20L30 40Z"/></g>');
    });

    it('can clone itself', function () {
        var group, newGroup;
        group = new vg.Group();
        group.add(vg.demoRect());
        newGroup = group.clone();
        assert.equal(newGroup.shapes.length, 1);
    });

    it('has bounds', function () {
        var group, p1, p2;
        group = new vg.Group();
        assert.deepEqual(group.bounds(), new vg.Rect(0, 0, 0, 0));
        p1 = new vg.Path();
        p1.addRect(10, 20, 30, 40);
        group = vg.group([p1]);
        assert.deepEqual(group.bounds(), new vg.Rect(10, 20, 30, 40));
        p2 = new vg.Path();
        p2.addRect(100, 200, 10, 10);
        group = vg.group([p1, p2]);
        assert.deepEqual(group.bounds(), new vg.Rect(10, 20, 100, 190));
    });

    it('has a length', function () {
        var group, p1, p2;
        group = new vg.Group();
        assert.equal(group.length(), 0);
        p1 = new vg.Path();
        p1.addRect(10, 20, 30, 40);
        group = vg.group([p1]);
        assert.equal(group.length(), 140);
        p2 = new vg.Path();
        p2.addRect(100, 200, 10, 10);
        group = vg.group([p1, p2]);
        assert.equal(group.length(), 180);
    });

    it('can merge shapes together', function () {
        var group;

        group = vg.merge(vg.demoRect());
        assert.equal(group.shapes.length, 1);

        // Skip nulls and undefineds
        group = vg.merge(null, vg.demoRect(), undefined, vg.demoRect());
        assert.equal(group.shapes.length, 2);

        // Flatten lists (this is important for Maak)
        group = vg.merge([vg.demoRect(), vg.demoRect()], vg.demoRect());
        assert.equal(group.shapes.length, 3);
    });

    it('can be colorized', function () {
        function f(p, fill, stroke, strokeWidth) {
            assert.equal(p.fill, fill);
            assert.equal(p.stroke, stroke);
            assert.equal(p.strokeWidth, strokeWidth);
        }
        var p1 = new vg.Path();
        p1 = p1.colorize('red', 'yellow', 1);
        var p2 = new vg.Path();
        p2 = p2.colorize('brown', 'purple', 2);
        var group = new vg.Group([p1, p2]);
        f(group.shapes[0], 'red', 'yellow', 1);
        f(group.shapes[1], 'brown', 'purple', 2);
        group = group.colorize('pink');
        f(group.shapes[0], 'pink', 'yellow', 1);
        f(group.shapes[1], 'pink', 'purple', 2);
        group = group.colorize({stroke: 'orange'});
        f(group.shapes[0], 'pink', 'orange', 1);
        f(group.shapes[1], 'pink', 'orange', 2);
        group = group.colorize({fill: 'white', strokeWidth: 3});
        f(group.shapes[0], 'white', 'orange', 3);
        f(group.shapes[1], 'white', 'orange', 3);
    });

});

describe('A text object', function () {

    function testArgs(t) {
        assert.equal(t.text, 'Hello');
        assert.equal(t.x, 10);
        assert.equal(t.y, 20);
        assert.equal(t.fontFamily, 'Helvetica');
        assert.equal(t.fontSize, 12);
        assert.equal(t.textAlign, 'right');
    }

    function testDefaultArgs(t) {
        assert.equal(t.text, 'Hello');
        assert.equal(t.x, 0);
        assert.equal(t.y, 0);
        assert.equal(t.fontFamily, 'sans-serif');
        assert.equal(t.fontSize, 24);
        assert.equal(t.textAlign, 'left');
    }

    it('has many constructor options', function () {
        testArgs(new vg.Text('Hello', 10, 20, 'Helvetica', 12, 'right'));
        testArgs(new vg.Text('Hello', [10, 20], 'Helvetica', 12, 'right'));
        testArgs(new vg.Text('Hello', {x: 10, y: 20}, 'Helvetica', 12, 'right'));
        testArgs(new vg.Text('Hello', 10, 20, {fontFamily: 'Helvetica', fontSize: 12, textAlign: 'right'}));
        testArgs(new vg.Text('Hello', [10, 20], {fontFamily: 'Helvetica', fontSize: 12, textAlign: 'right'}));
        testArgs(new vg.Text('Hello', [10, 20], {fontFamily: 'Helvetica', fontSize: 12, textAlign: 'right'}));
        testArgs(new vg.Text('Hello', {x: 10, y: 20, fontFamily: 'Helvetica', fontSize: 12, textAlign: 'right'}));

        testDefaultArgs(new vg.Text('Hello'));
        testDefaultArgs(new vg.Text('Hello', 0, 0));
        testDefaultArgs(new vg.Text('Hello', [0, 0]));
        testDefaultArgs(new vg.Text('Hello', {x: 0, y: 0}));
        testDefaultArgs(new vg.Text('Hello', 0, 0, 'sans-serif'));
        testDefaultArgs(new vg.Text('Hello', {x: 0, y: 0}, 'sans-serif'));
        testDefaultArgs(new vg.Text('Hello', {fontFamily: 'sans-serif'}));
    });

    it('has a corresponding function', function () {
        testArgs(vg.text('Hello', 10, 20, 'Helvetica', 12, 'right'));
        testArgs(vg.text('Hello', [10, 20], {fontFamily: 'Helvetica', fontSize: 12, textAlign: 'right'}));
        testDefaultArgs(vg.text('Hello'));
        testDefaultArgs(vg.text('Hello', [0, 0], 'sans-serif'));
    });

    it('can take options', function () {
        // `font` and `fontName` are aliases of `fontFamily`.
        var t = new vg.Text('Hello', 20, 20, {fontSize: 18, font: 'Arial'});
        assert.equal(t.fontSize, 18);
        assert.equal(t.fontFamily, 'Arial');
    });

    it('is drawable', function () {
        var t = new vg.Text('Hello', 20, 20);
        assert(vg.isDrawable(t));
        t.bounds();
    });

    it('has bounds', function () {
        var text = 'Hello',
            fontSize = 24,
            t = new vg.Text('Hello', 20, 20, {fontSize: fontSize}),
            bounds = vg.bounds(t);
        assert.equal(bounds.x, 20);
        assert.equal(bounds.y, -4);
        // Because node.js doesn't have access to the canvas, we fake the width
        // measurement by taking the text.length and multiplying it by the font size,
        // then multiplying it by 0.6, which is the average character width across all
        // letters and font sizes.
        assert.equal(bounds.width, text.length * fontSize * 0.6);
        // The line height is hard-coded.
        assert.equal(bounds.height, 24 * 1.2);
    });

    it('supports alignment', function () {
        var tLeft = new vg.Text('Hello', 0, 0, {textAlign: 'left'}),
            tRight = new vg.Text('Hello', 0, 0, {textAlign: 'right'}),
            tCenter = new vg.Text('Hello', 0, 0, {textAlign: 'center'});
        assert.equal(tLeft.bounds().x, 0);
        assert.equal(tRight.bounds().x, -(tRight.text.length * tRight.fontSize * 0.6));
        assert.equal(tCenter.bounds().x, -(tCenter.text.length * tRight.fontSize * 0.6) / 2);
    });

});

describe('A color', function () {

    it('has a default constructor', function () {
        var c = new vg.Color();
        assert.deepEqual(c.rgba, [0, 0, 0, 1]);
    });

    it('can be constructed using numbers', function () {
        var c;
        c = new vg.Color(0.1, 0.2, 0.3);
        assert.deepEqual(c.rgba, [0.1, 0.2, 0.3, 1]);
        c = new vg.Color(0.1, 0.2, 0.3, 0.4);
        assert.deepEqual(c.rgba, [0.1, 0.2, 0.3, 0.4]);
    });

    it('can take a value range', function () {
        var c;
        c = new vg.Color(10, 20, 30, {range: 100});
        assert.deepEqual(c.rgba, [0.1, 0.2, 0.3, 1]);
        c = new vg.Color(10, 20, 30, 40, {range: 100});
        assert.deepEqual(c.rgba, [0.1, 0.2, 0.3, 0.4]);
    });

    it('can be constructed using an array', function () {
        var c;
        c = new vg.Color([0.1, 0.2, 0.3, 0.4]);
        assert.deepEqual(c.rgba, [0.1, 0.2, 0.3, 0.4]);
        c = new vg.Color([0, 0, 0, 0]);
        assert.deepEqual(c.rgba, [0, 0, 0, 0]);
        c = new vg.Color([10, 20, 30], {range: 100});
        assert.deepEqual(c.rgba, [0.1, 0.2, 0.3, 1]);
        c = new vg.Color([10, 20, 30, 40], {range: 100});
        assert.deepEqual(c.rgba, [0.1, 0.2, 0.3, 0.4]);
    });

    it('can be constructed using a Color object', function () {
        var c;
        c = new vg.Color({r: 0.1, g: 0.2, b: 0.3});
        assert.deepEqual(c.rgba, [0.1, 0.2, 0.3, 1.0]);
        c = new vg.Color({r: 0.1, g: 0.2, b: 0.3, a: 0.4});
        assert.deepEqual(c.rgba, [0.1, 0.2, 0.3, 0.4]);
    });

    it('can be constructed using a string', function () {
        var c;
        c = new vg.Color('#ff3366');
        assert.deepEqual(c.rgba, [1, 0.2, 0.4, 1]);
    });

    it('can be constructed using a grayscale value', function () {
        var c;
        c = new vg.Color(0.3);
        assert.deepEqual(c.rgba, [0.3, 0.3, 0.3, 1]);
        c = new vg.Color(30, {range: 100});
        assert.deepEqual(c.rgba, [0.3, 0.3, 0.3, 1]);
        c = new vg.Color(0.3, 0.5);
        assert.deepEqual(c.rgba, [0.3, 0.3, 0.3, 0.5]);
        c = new vg.Color(30, 50, {range: 100});
        assert.deepEqual(c.rgba, [0.3, 0.3, 0.3, 0.5]);
    });

    it('can be parsed', function () {
        assert.deepEqual(vg.Color.parse(null).rgba, [0.0, 0.0, 0.0, 0.0]);
        assert.deepEqual(vg.Color.parse(undefined).rgba, [0.0, 0.0, 0.0, 0.0]);
        assert.deepEqual(vg.Color.parse('cornflowerblue').rgba, [0.39, 0.58, 0.93, 1.0]);
        assert.deepEqual(vg.Color.parse('none').rgba, [0.0, 0.0, 0.0, 0.0]);
        assert.deepEqual(vg.Color.parse(new vg.Color(0.1, 0.2, 0.3, 0.4)).rgba, [0.1, 0.2, 0.3, 0.4]);
        assert.throws(function() { vg.Color.parse(true); });
    });

    it('can be converted to a hexadecimal value', function () {
        assert.equal(new vg.Color(0, 0, 0).toHex(), '#000000');
        assert.equal(new vg.Color(0.01, 0.01, 0.01).toHex(), '#030303');
        assert.equal(new vg.Color(0.1, 0.5, 0.9).toHex(), '#1A80E6');
        assert.equal(new vg.Color(0.99, 0.99, 0.99).toHex(), '#FCFCFC');
        assert.equal(new vg.Color(1, 1, 1).toHex(), '#FFFFFF');
        assert.equal(new vg.Color(1, 1, 1, 0.5).toHex(), '#FFFFFF80');
    });

    it('has aliased properties', function () {
        var c = new vg.Color(0.1, 0.2, 0.3, 0.4);
        assert.equal(c.red, c.r);
        assert.equal(c.green, c.g);
        assert.equal(c.blue, c.b);
        assert.equal(c.alpha, c.a);
        assert.deepEqual(c.rgb, [c.r, c.g, c.b]);
        assert.deepEqual(c.rgba, [c.r, c.g, c.b, c.a]);

        var hsl = vg.color.rgb2hsl(c.r, c.g, c.b);
        assert.equal(c.h, hsl[0]);
        assert.equal(c.hue, hsl[0]);
        assert.equal(c.s, hsl[1]);
        assert.equal(c.saturation, hsl[1]);
        assert.equal(c.l, hsl[2]);
        assert.equal(c.lightness, hsl[2]);
    });

    it('can be converted to CSS', function () {
        var c = new vg.Color(0.1, 0.2, 0.3, 0.4);
        assert.equal(vg.Color.toCSS(), 'black', 'Empty color is black');
        assert.equal(vg.Color.toCSS(null), 'none', 'null is none, meaning no color');
        assert.equal(vg.Color.toCSS('red'), 'red', 'strings are kept as-is');
        assert.equal(vg.Color.toCSS(c), 'rgba(26, 51, 77, 0.4)', 'color objects are converted');
        assert.throws(function() { vg.Color.toCSS(new vg.Point()); });
    });

});

describe('Color utilities', function () {

    it('can convert a color to a hexadecimal value', function () {
        assert.equal(vg.color.rgb2hex(0, 0, 0), '#000000');
        assert.equal(vg.color.rgb2hex(0.01, 0.01, 0.01), '#030303');
        assert.equal(vg.color.rgb2hex(0.1, 0.5, 0.9), '#1A80E6');
        assert.equal(vg.color.rgb2hex(0.99, 0.99, 0.99), '#FCFCFC');
        assert.equal(vg.color.rgb2hex(1, 1, 1), '#FFFFFF');
    });

});


describe('Drawables', function () {

    it('can discover if something is drawable', function () {
        assert(vg.isDrawable(vg.demoRect()));
        assert(vg.isDrawable(new vg.Point()));
        assert(vg.isDrawable(new vg.Color(1, 0, 0)));
        assert(vg.isDrawable(new vg.Text('Hello', 10, 10)));

        assert(!vg.isDrawable(null));
        assert(!vg.isDrawable(0));
        assert(!vg.isDrawable([]));
        assert(!vg.isDrawable([0]));
    });

    it('can get the bounds', function () {
        assert.deepEqual(vg.bounds(vg.rect(10, 20, 30, 40)).xywh, [-5, 0, 30, 40]);
        assert.deepEqual(vg.bounds([new vg.Point(10, 20), new vg.Point(30, 40)]).xywh, [10, 20, 20, 20]);

        assert.deepEqual(vg.bounds([]).xywh, [0, 0, 0, 0]);
        assert.deepEqual(vg.bounds(42).xywh, [0, 0, 0, 0]);
    });

});

describe('The grid generator', function () {

    it('generates grids', function () {
        var grid = vg.grid(3, 3, 100, 100);
        assert.equal(grid.length, 3 * 3);
        assert.deepEqual(vg.bounds(grid), {x: -100, y: -100, width: 200, height: 200});
    });

});

describe('The polygon command', function () {

    it('generates polygons', function () {
        var p3 = vg.polygon(vg.Point.ZERO, 100, 3);
        assert.equal(p3.commands.length, 3 + 1); // Extra close command
        var p5 = vg.polygon(vg.Point.ZERO, 100, 5);
        assert.equal(p5.commands.length, 5 + 1);
    });

});

describe('The colorize filter', function () {

    it('works on paths', function () {
        var p = new vg.Path(),
            p2;
        p.addRect(10, 20, 30, 40);
        p2 = vg.colorize(p, 'blue', 'red', 5);
        assert.equal(p2.fill, 'blue');
        assert.equal(p2.stroke, 'red');
        assert.equal(p2.strokeWidth, 5);
    });

    it('works on groups', function () {
        var g1 = vg.group(vg.demoRect()),
            g2,
            p1,
            p2;
        g2 = vg.colorize(g1, 'blue', 'red', 5);
        p1 = g1.shapes[0];
        p2 = g2.shapes[0];
        assert.equal(p1.fill, 'black');
        assert(p1.stroke === null);
        assert.equal(p1.strokeWidth, 1);
        assert.equal(p2.fill, 'blue');
        assert.equal(p2.stroke, 'red');
        assert.equal(p2.strokeWidth, 5);
    });

});

describe('The centerPoint filter', function () {
    it ('works on paths', function () {
        var r = vg.rect(vg.Point.ZERO, 100, 100);
        assert.deepEqual(vg.centerPoint(r).xy, [0, 0]);
        var e = vg.ellipse(vg.Point.ZERO, 100, 100);
        assert.deepEqual(vg.centerPoint(e).xy, [0, 0]);
    });
});

describe('The mirror filter', function () {
    it('works on paths', function () {
        var r = vg.rect(50, 0, 100, 100);
        var rr = vg.mirror(r, 90, vg.Point.ZERO);
        assertRectsAlmostEqual(rr.bounds(), new vg.Rect(-100, -50, 100, 100));
    });
});

describe('The snap filter', function () {
    it('works on paths', function () {
        var p1 = vg.ellipse(0, 0, 100, 100);
        var p2 = vg.snap(p1, 50);
        assert.equal(p2.commands.length, p1.commands.length);
        assertXYEqual(p2.commands[0], -50, 0);
        assertXYEqual(p2.commands[1], 0, -50);
        assertXYEqual(p2.commands[2], 50, 0);
        assertXYEqual(p2.commands[3], 0, 50);
        assertXYEqual(p2.commands[4], -50, 0);
    });
});

describe('The SVG module', function () {
    it('can parse rects', function () {
        var r = vg.svg.parseString('<rect x="10" y="20" width="30" height="40" fill="blue"/>');
        assert.deepEqual(r.bounds().xywh, [10, 20, 30, 40]);
        assert.deepEqual(r.fill.rgba, [0, 0, 1, 1]);
        assert.equal(r.commands.length, 5);
    });

    it('can parse rounded rects', function () {
        var r = vg.svg.parseString('<rect x="10" y="20" width="30" height="40" rx="15" ry="15" fill="blue"/>');
        assert.deepEqual(r.bounds().xywh, [10, 20, 30, 40]);
        assert.deepEqual(r.fill.rgba, [0, 0, 1, 1]);
        assert.equal(r.commands.length, 8);
    });

    it('can parse paths', function () {
        var p = vg.svg.parseString('<path d="M10,20 L30,40 L100,0 Z" fill="red"/>');
        assert.deepEqual(p.commands[0], {type: vg.bezier.MOVETO, x: 10, y: 20});
        assert.deepEqual(p.commands[1], {type: vg.bezier.LINETO, x: 30, y: 40});
        assert.deepEqual(p.commands[2], {type: vg.bezier.LINETO, x: 100, y: 0});
        assert.deepEqual(p.commands[3], {type: vg.bezier.CLOSE});
        assert.deepEqual(p.fill.rgba, [1, 0, 0, 1]);
    });

    it('can parse groups', function () {
        var g = vg.svg.parseString('<g><rect x="10" y="20" width="30" height="40" fill="blue"/></g>');
        assert.equal(g.shapes.length, 1);
        var r = g.shapes[0];
        assert.deepEqual(r.fill.rgba, [0, 0, 1, 1]);
    });

    it('can parse colors and widths', function () {
        var p = vg.svg.parseString('<path d="Z" fill="red" stroke="blue" stroke-width="1.234"/>');
        assert.equal(p.commands.length, 1);
        assert.deepEqual(p.fill.rgba, [1, 0, 0, 1]);
        assert.deepEqual(p.stroke.rgba, [0, 0, 1, 1]);
        assert.equal(p.strokeWidth, 1.234);
    });

    it('can parse fill and stroke opacity', function () {
        var r = vg.svg.parseString('<rect x="10" y="20" width="30" height="40" fill="blue" stroke="red" fill-opacity="0.5" stroke-opacity="0.6"/>');
        assert.deepEqual(r.fill.rgba, [0, 0, 1, 0.5]);
        assert.deepEqual(r.stroke.rgba, [1, 0, 0, 0.6]);
    });

    it('can parse inline styles', function () {
        var p = vg.svg.parseString('<path d="M10,20 L30,40 L100,0 Z" style="fill:orange;stroke:blue;stroke-width:2.5;fill-opacity:0.7;stroke-opacity:0.2"/>');
        assert.deepEqual(p.fill.rgba, [1, 0.65, 0, 0.7]);
        assert.deepEqual(p.stroke.rgba, [0, 0, 1, 0.2]);
        assert.equal(p.strokeWidth, 2.5);
    });

    it('does correct inheritance of style properties', function () {
        var g = vg.svg.parseString('<g stroke-width="2.5" fill="#00FF00"><g style="fill:orange;stroke-width:1.5" fill-opacity="0.6"><path d="M10,20 L30,40 L100,0 Z"/><path d="M50,20 L30,80 L100,0 Z" style="fill-opacity:0.3"/></g><path d="M80,20 L30,100 L100,0 Z"/></g>');
        var p1 = g.shapes[0].shapes[0];
        assert.deepEqual(p1.fill.rgba, [1, 0.65, 0, 0.6]);
        assert.equal(p1.strokeWidth, 1.5);
        var p2 = g.shapes[0].shapes[1];
        assert.deepEqual(p2.fill.rgba, [1, 0.65, 0, 0.3]);
        assert.equal(p2.strokeWidth, 1.5);
        var p3 = g.shapes[1];
        assert.deepEqual(p3.fill.rgba, [0, 1, 0, 1]);
        assert.equal(p3.strokeWidth, 2.5);
    });

    it('can handle the currentColor value', function () {
        var g = vg.svg.parseString('<g color="orange"><rect x="10" y="20" width="30" height="40" fill="currentColor"/><rect x="10" y="20" width="30" height="40" style="fill:currentColor;color:blue"/></g>');
        assert.deepEqual(g.shapes[0].fill.rgba, [1, 0.65, 0, 1]);
        assert.deepEqual(g.shapes[1].fill.rgba, [0, 0, 1, 1]);
        var r = vg.svg.parseString('<rect x="10" y="20" width="30" height="40" fill="currentColor" stroke="currentColor" stroke-opacity="0.5"/>');
        assert.deepEqual(r.fill.rgba, [0, 0, 0, 1]);
        assert.deepEqual(r.stroke.rgba, [0, 0, 0, 0.5]);
        r = vg.svg.parseString('<rect x="10" y="20" width="30" height="40" fill="currentColor" style="color:yellow"/>');
        assert.deepEqual(r.fill.rgba, [1, 1, 0, 1]);
        assert.equal(r.stroke, null);
    });
});
