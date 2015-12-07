'use strict';

var assert = require('assert');
var mocha = require('mocha');
var describe = mocha.describe;
var it = mocha.it;

var g = require('../src/g');

function assertAlmostEqual(actual, expected) {
    assert(Math.abs(actual - expected) < 0.00001, 'Expected ' + expected + ', got ' + actual);
}

describe('The angle function', function () {

    it('returns the angle between two points', function () {
        assert.equal(g.angle(0, 0, 100, 100), 45);
        assert.equal(g.angle(0, 0, 0, 120), 90);
        assert.equal(g.angle({x: 100, y: 100}, {x: 0, y: 0}), -135);
        assert.equal(g.angle([150, 0], [0, 150]), 135);
        assertAlmostEqual(g.angle([50, 0], {x: -100, y: 259.8076}), 120);
    });

});

describe('The coordinates function', function () {

    it('calculates the point based on angle and distance', function () {
        var p = g.coordinates(0, 0, 37, 27);
        assertAlmostEqual(p.x, 21.56316);
        assertAlmostEqual(p.y, 16.249);
        p = g.coordinates({x: 0, y: 0}, 90, 70);
        assertAlmostEqual(p.x, 0);
        assertAlmostEqual(p.y, 70);
        p = g.coordinates([0, 10], 180, 25);
        assertAlmostEqual(p.x, -25);
        assertAlmostEqual(p.y, 10);
    });

});

describe('The distance function', function () {

    it('returns the distance between two points', function () {
        assertAlmostEqual(g.distance(0, 0, 21.56316, 16.249), 27);
        assert.equal(g.distance({x: 0, y: 0}, {x: 0, y: 70}), 70);
        assert.equal(g.distance([0, 10], [-25, 10]), 25);
    });

});

describe('The stack function', function () {

    it('returns valid bounds', function () {
        var r1 = g.rect(0, 0, 100, 100);
        var r2 = g.rect(0, 0, 100, 100);
        var stacked = g.stack([r1, r2], 'e', 10);
        var bounds = g.bounds(stacked);
        assert.deepEqual(bounds, {x: -50, y: -50, width: 210, height: 100});
    });

});
