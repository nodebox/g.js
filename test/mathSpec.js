'use strict';

var assert = require('assert');
var mocha = require('mocha');
var describe = mocha.describe;
var it = mocha.it;

var grob = require('../src/grob');

function assertAlmostEqual(actual, expected) {
    assert(Math.abs(actual - expected) < 0.00001, 'Expected ' + expected + ', got ' + actual);
}

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
});
