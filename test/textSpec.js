'use strict';

var assert = require('assert');
var mocha = require('mocha');
var describe = mocha.describe;
var it = mocha.it;

var g = require('../src/g');

describe('The text object', function () {

    it('generates text', function () {
        var t = new g.Text('Hello');
        assert.equal(t.text, 'Hello');
        assert.equal(t.fontFamily, 'sans-serif');
        assert.equal(t.fontSize, 24);
        assert.deepEqual(t.transform.m, [1, 0, 0, 1, 0, 0]);
        assert.equal(t.toSVG(), '<text x="0" y="0" font-family="sans-serif" font-size="24" text-anchor="start">Hello</text>');
    });

    it('can transform text', function () {
        var t = new g.Text('Hello');
        t.transform = t.transform.translate(10, 20);
        assert.deepEqual(t.transform.m, [1, 0, 0, 1, 10, 20]);
        assert.equal(t.toSVG(), '<text x="0" y="0" font-family="sans-serif" font-size="24" text-anchor="start" transform="matrix(1,0,0,1,10,20)">Hello</text>');
    });

    it('specifies SVG colors compatible with Illustrator', function () {
        var t = new g.Text('Hello');
        t.fill = new g.Color(1, 0, 0, 0.5);
        assert.equal(t.toSVG(), '<text x="0" y="0" font-family="sans-serif" font-size="24" text-anchor="start" fill="#FF0000" opacity="0.5">Hello</text>');
    });

});
