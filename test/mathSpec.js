'use strict';

var assert = require('assert');
var mocha = require('mocha');
var describe = mocha.describe;
var it = mocha.it;

var grob = require('../src/grob');

function assertAlmostEqual(actual, expected) {
    assert(Math.abs(actual - expected) < 0.00001, 'Expected ' + expected + ', got ' + actual);
}

describe('The accumulate function', function () {

    it('accumulates', function () {
        assert.deepEqual(grob.accumulate([21, 14, 13, 3, 21]), [0, 21, 35, 48, 51]);
        assert.deepEqual(grob.accumulate([]), [0]);
        assert.deepEqual(grob.accumulate([42]), [0]);
        assert.deepEqual(grob.accumulate(10, 12, 9, 4), [0, 10, 22, 31]);
        assert.deepEqual(grob.accumulate(), [0]);
        assert.deepEqual(grob.accumulate(42), [0]);
    });

});

describe('The add function', function () {

    it('does addition', function () {
        assert.equal(grob.add(), 0);
        assert.equal(grob.add(4), 4);
        assert.equal(grob.add(4, 20), 24);
        assert.equal(grob.add(4, 20, 16, 9, 12), 61);
    });

});

describe('The average function', function () {

    it('returns the average', function () {
        assert.equal(grob.average(), 0);
        assert.equal(grob.average(0), 0);
        assert.equal(grob.average(5), 5);
        assert.equal(grob.average(2, 12), 7);
        assert.equal(grob.average(1, 2, 3, 4), 2.5);
        assert.equal(grob.average([]), 0);
        assert.equal(grob.average([0]), 0);
        assert.equal(grob.average([1, 2, 3, 4, 5]), 3);
    });

});

describe('The divide function', function () {

    it('does division', function () {
        assert.equal(grob.divide(5), 0.2);
        assert.equal(grob.divide(12, 3), 4);
        assert.equal(grob.divide(21, 7, 6), 0.5);
        assert.equal(grob.divide(100, 2, 2, 5, 5), 1);
    });

});

describe('The sample function', function () {

    it('returns linear values', function () {
        var s1 = grob.sample(5, 0, 8);
        assert.deepEqual(s1, [0, 2, 4, 6, 8]);
    });

    it('returns circular values', function () {
        var s1 = grob.sample(5, 0, 10, true);
        assert.deepEqual(s1, [0, 2, 4, 6, 8]);
    });

});

describe('The wave functions', function () {

    it('returns a valid sine wave', function () {
        assertAlmostEqual(grob.sineWave(0), 0);
        assertAlmostEqual(grob.sineWave(0.25), 1);
        assertAlmostEqual(grob.sineWave(0.5), 0);
        assertAlmostEqual(grob.sineWave(0.75), -1);
        assertAlmostEqual(grob.sineWave(1), 0);

        assertAlmostEqual(grob.sineWave(0, 100, 200), 150);
        assertAlmostEqual(grob.sineWave(0.25, 100, 200), 200);
        assertAlmostEqual(grob.sineWave(0.5, 100, 200), 150);
        assertAlmostEqual(grob.sineWave(0.75, 100, 200), 100);
        assertAlmostEqual(grob.sineWave(1, 100, 200), 150);

        assertAlmostEqual(grob.sineWave(0, -1, 1, 100), 0);
        assertAlmostEqual(grob.sineWave(25, -1, 1, 100), 1);
        assertAlmostEqual(grob.sineWave(50, -1, 1, 100), 0);
        assertAlmostEqual(grob.sineWave(75, -1, 1, 100), -1);
        assertAlmostEqual(grob.sineWave(100, -1, 1, 100), 0);

        assertAlmostEqual(grob.sineWave(-0.2, -1, 1, 1, 0.2), 0);
    });
    
    it('returns a valid square wave', function () {
        assert.equal(grob.squareWave(0), 1);
        assert.equal(grob.squareWave(0.499), 1);
        assert.equal(grob.squareWave(0.5), -1);
        assert.equal(grob.squareWave(0.501), -1);
        assert.equal(grob.squareWave(1), 1);
    });

    it('returns a valid triangle wave', function () {
        assert.equal(grob.triangleWave(0), 0);
        assert.equal(grob.triangleWave(0.25), 1);
        assert.equal(grob.triangleWave(0.5), 0);
        assert.equal(grob.triangleWave(0.75), -1);
        assert.equal(grob.triangleWave(1), 0);
    });
});
