'use strict';

var assert = require('assert');
var mocha = require('mocha');
var describe = mocha.describe;
var it = mocha.it;

var g = require('../src/g');

describe('The pathLength function', function () {

    it('works', function () {
        const p = g.rect(0, 0, 100, 30);
        const l = g.pathLength(p);
        assert.equal(l, 260);
    });

    it('can handle null values', function () {
        const l = g.pathLength(null);
        assert.equal(l, 0);
    });

});

describe('The pointOnPath function', function () {

    it('works', function () {
        const p = g.line(0, 0, 100, 300);
        const pt = g.pointOnPath(p, 0.5);
        assert.deepEqual(pt, {x: 50, y: 150});
    });

    it('can handle null values', function () {
        const pt = g.pointOnPath(null, 0.5);
        assert.deepEqual(pt, {x: 0, y: 0});
    });

});
