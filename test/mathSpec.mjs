'use strict';

var assert = require('assert');
var mocha = require('mocha');
var describe = mocha.describe;
var it = mocha.it;

var g = require('../src/g');

function assertAlmostEqual(actual, expected) {
    assert(Math.abs(actual - expected) < 0.00001, 'Expected ' + expected + ', got ' + actual);
}

describe('The accumulate function', function () {

    it('accumulates', function () {
        assert.deepEqual(g.accumulate([21, 14, 13, 3, 21]), [0, 21, 35, 48, 51]);
        assert.deepEqual(g.accumulate([]), [0]);
        assert.deepEqual(g.accumulate([42]), [0]);
        assert.deepEqual(g.accumulate(10, 12, 9, 4), [0, 10, 22, 31]);
        assert.deepEqual(g.accumulate(), [0]);
        assert.deepEqual(g.accumulate(42), [0]);
    });

});

describe('The add function', function () {

    it('does addition', function () {
        assert.equal(g.add(), 0);
        assert.equal(g.add(4), 4);
        assert.equal(g.add(4, 20), 24);
        assert.equal(g.add(4, 20, 16, 9, 12), 61);
    });

});

describe('The average function', function () {

    it('returns the average', function () {
        assert.equal(g.average(), 0);
        assert.equal(g.average(0), 0);
        assert.equal(g.average(5), 5);
        assert.equal(g.average(2, 12), 7);
        assert.equal(g.average(1, 2, 3, 4), 2.5);
        assert.equal(g.average([]), 0);
        assert.equal(g.average([0]), 0);
        assert.equal(g.average([1, 2, 3, 4, 5]), 3);
    });

});

describe('The divide function', function () {

    it('does division', function () {
        assert.equal(g.divide(5), 0.2);
        assert.equal(g.divide(12, 3), 4);
        assert.equal(g.divide(21, 7, 6), 0.5);
        assert.equal(g.divide(100, 2, 2, 5, 5), 1);
    });

});

describe('The even function', function () {

    it('returns true if a number is even', function () {
        assert.equal(g.even(0), true);
        assert.equal(g.even(1), false);
        assert.equal(g.even(99), false);
        assert.equal(g.even(100), true);
    });

});

describe('The clamp function', function () {

    it('clamps the value between min and max', function () {
        assert.equal(g.clamp(50, 0, 100), 50);
        assert.equal(g.clamp(0, 0, 100), 0);
        assert.equal(g.clamp(100, 0, 100), 100);
        assert.equal(g.clamp(-50, 0, 100), 0);
        assert.equal(g.clamp(500, 0, 100), 100);
    });

    it('clamps to 0-1 default values', function () {
        assert.equal(g.clamp(0.5), 0.5);
        assert.equal(g.clamp(0.0), 0.0);
        assert.equal(g.clamp(1.0), 1.0);
        assert.equal(g.clamp(-0.5), 0.0);
        assert.equal(g.clamp(10.0), 1.0);
    });

});

describe('The multiply function', function () {

    it('does multiplication', function () {
        assert.equal(g.multiply(), 1);
        assert.equal(g.multiply(0), 0);
        assert.equal(g.multiply(7, 3), 21);
        assert.equal(g.multiply(2, 9, 3, 10), 540);
    });

});

describe('The odd function', function () {

    it('returns true if a number is odd', function () {
        assert.equal(g.odd(0), false);
        assert.equal(g.odd(1), true);
        assert.equal(g.odd(99), true);
        assert.equal(g.odd(100), false);
    });

});

describe('The range function', function () {

    it('returns linear values', function () {
        var s1 = g.range(4, 14, 2);
        assert.deepEqual(s1, [4, 6, 8, 10, 12]);
        var s2 = g.range(4, 14, 2, true);
        assert.deepEqual(s2, [4, 6, 8, 10, 12, 14]);
        var s3 = g.range(3, 14, 2);
        assert.deepEqual(s3, [3, 5, 7, 9, 11, 13]);
        var s4 = g.range(3, 14, 2, true);
        assert.deepEqual(s4, [3, 5, 7, 9, 11, 13]);
        var s5 = g.range(10, 15);
        assert.deepEqual(s5, [10, 11, 12, 13, 14]);
        var s6 = g.range(10, 15, -1);
        assert.equal(s6.length, 0);
        var s7 = g.range(15, 10, 1);
        assert.equal(s7.length, 0);
        var s8 = g.range(14, 4, -2);
        assert.deepEqual(s8, [14, 12, 10, 8, 6]);
        var s9 = g.range(14, 4, -2, true);
        assert.deepEqual(s9, [14, 12, 10, 8, 6, 4]);
        var s10 = g.range(15, 10);
        assert.deepEqual(s10, [15, 14, 13, 12, 11]);

    });

});

describe('The randomNumbers function', function () {

    function numbersAllInRange(numbers, min, max) {
        var v;
        for (var i = 0; i < numbers.length; i += 1) {
            v = numbers[i];
            if (v < min || v > max) { return false; }
        }
        return true;
    }

    it('returns numbers within the given range', function () {
        var s1 = g.randomNumbers(10, 0, 1);
        assert.equal(s1.length, 10);
        assert.ok(numbersAllInRange(s1, 0, 1));
        var s2 = g.randomNumbers(7, 20);
        assert.equal(s2.length, 7);
        assert.ok(numbersAllInRange(s2, 0, 20));
        var s3 = g.randomNumbers(10, -20);
        assert.ok(numbersAllInRange(s3, -20, 0));
        var s4 = g.randomNumbers(10, -15, 15);
        assert.ok(numbersAllInRange(s4, -15, 15));
        var s5 = g.randomNumbers(10, 15, -15);
        assert.ok(numbersAllInRange(s5, -15, 15));
    });

    it('returns the same numbers when given the same seed', function () {
        assert.deepEqual(g.randomNumbers(10, 0, 100, 5), g.randomNumbers(10, 0, 100, 5));
        assert.notDeepEqual(g.randomNumbers(10, 0, 100, 5), g.randomNumbers(10, 0, 100, 6));
    });

});

describe('The sample function', function () {

    it('returns linear values', function () {
        var s1 = g.sample(5, 0, 8);
        assert.deepEqual(s1, [0, 2, 4, 6, 8]);
    });

    it('returns circular values', function () {
        var s1 = g.sample(5, 0, 10, true);
        assert.deepEqual(s1, [0, 2, 4, 6, 8]);
    });

});

describe('The wave functions', function () {

    it('returns a valid sine wave', function () {
        assertAlmostEqual(g.sineWave(0), 0);
        assertAlmostEqual(g.sineWave(0.25), 1);
        assertAlmostEqual(g.sineWave(0.5), 0);
        assertAlmostEqual(g.sineWave(0.75), -1);
        assertAlmostEqual(g.sineWave(1), 0);

        assertAlmostEqual(g.sineWave(0, 100, 200), 150);
        assertAlmostEqual(g.sineWave(0.25, 100, 200), 200);
        assertAlmostEqual(g.sineWave(0.5, 100, 200), 150);
        assertAlmostEqual(g.sineWave(0.75, 100, 200), 100);
        assertAlmostEqual(g.sineWave(1, 100, 200), 150);

        assertAlmostEqual(g.sineWave(0, -1, 1, 100), 0);
        assertAlmostEqual(g.sineWave(25, -1, 1, 100), 1);
        assertAlmostEqual(g.sineWave(50, -1, 1, 100), 0);
        assertAlmostEqual(g.sineWave(75, -1, 1, 100), -1);
        assertAlmostEqual(g.sineWave(100, -1, 1, 100), 0);

        assertAlmostEqual(g.sineWave(-0.2, -1, 1, 1, 0.2), 0);
    });

    it('returns a valid square wave', function () {
        assert.equal(g.squareWave(0), 1);
        assert.equal(g.squareWave(0.499), 1);
        assert.equal(g.squareWave(0.5), -1);
        assert.equal(g.squareWave(0.501), -1);
        assert.equal(g.squareWave(1), 1);
    });

    it('returns a valid triangle wave', function () {
        assert.equal(g.triangleWave(0), 0);
        assert.equal(g.triangleWave(0.25), 1);
        assert.equal(g.triangleWave(0.5), 0);
        assert.equal(g.triangleWave(0.75), -1);
        assert.equal(g.triangleWave(1), 0);
    });

});

describe('The sign function', function () {

    it('returns the sign of a number', function () {
        assert.equal(g.sign(0), 0);
        assert.equal(g.sign(42), 1);
        assert.equal(g.sign(-42), -1);
    });

});

describe('The subtract function', function () {

    it('does subtraction', function () {
        assert.equal(g.subtract(4), -4);
        assert.equal(g.subtract(30, 6), 24);
        assert.equal(g.subtract(99, 40, 11, 10, 5), 33);
    });

});

describe('The total function', function () {

    it('totals a list of numbers', function () {
        assert.equal(g.total([10, 12, 9, 9]), 40);
        assert.equal(g.total(10, 12, 9, 11), 42);
        assert.equal(g.total(), 0);
        assert.equal(g.total([]), 0);
        assert.equal(g.total(20), 20);
    });

});
