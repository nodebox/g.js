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

describe('The even function', function () {

    it('returns true if a number is even', function () {
        assert.equal(grob.even(0), true);
        assert.equal(grob.even(1), false);
        assert.equal(grob.even(99), false);
        assert.equal(grob.even(100), true);
    });

});

describe('The multiply function', function () {

    it('does multiplication', function () {
        assert.equal(grob.multiply(), 1);
        assert.equal(grob.multiply(0), 0);
        assert.equal(grob.multiply(7, 3), 21);
        assert.equal(grob.multiply(2, 9, 3, 10), 540);
    });

});

describe('The odd function', function () {

    it('returns true if a number is odd', function () {
        assert.equal(grob.odd(0), false);
        assert.equal(grob.odd(1), true);
        assert.equal(grob.odd(99), true);
        assert.equal(grob.odd(100), false);
    });

});

describe('The range function', function () {

    it('returns linear values', function () {
        var s1 = grob.range(4, 14, 2);
        assert.deepEqual(s1, [4, 6, 8, 10, 12]);
        var s2 = grob.range(4, 14, 2, true);
        assert.deepEqual(s2, [4, 6, 8, 10, 12, 14]);
        var s3 = grob.range(3, 14, 2);
        assert.deepEqual(s3, [3, 5, 7, 9, 11, 13]);
        var s4 = grob.range(3, 14, 2, true);
        assert.deepEqual(s4, [3, 5, 7, 9, 11, 13]);
        var s5 = grob.range(10, 15);
        assert.deepEqual(s5, [10, 11, 12, 13, 14]);
        var s6 = grob.range(10, 15, -1);
        assert.equal(s6.length, 0);
        var s7 = grob.range(15, 10, 1);
        assert.equal(s7.length, 0);
        var s8 = grob.range(14, 4, -2);
        assert.deepEqual(s8, [14, 12, 10, 8, 6]);
        var s9 = grob.range(14, 4, -2, true);
        assert.deepEqual(s9, [14, 12, 10, 8, 6, 4]);
        var s10 = grob.range(15, 10);
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
        var s1 = grob.randomNumbers(10, 0, 1);
        assert.equal(s1.length, 10);
        assert.ok(numbersAllInRange(s1, 0, 1));
        var s2 = grob.randomNumbers(7, 20);
        assert.equal(s2.length, 7);
        assert.ok(numbersAllInRange(s2, 0, 20));
        var s3 = grob.randomNumbers(10, -20);
        assert.ok(numbersAllInRange(s3, -20, 0));
        var s4 = grob.randomNumbers(10, -15, 15);
        assert.ok(numbersAllInRange(s4, -15, 15));
        var s5 = grob.randomNumbers(10, 15, -15);
        assert.ok(numbersAllInRange(s5, -15, 15));
    });

    it('returns the same numbers when given the same seed', function () {
        assert.deepEqual(grob.randomNumbers(10, 0, 100, 5), grob.randomNumbers(10, 0, 100, 5));
        assert.notDeepEqual(grob.randomNumbers(10, 0, 100, 5), grob.randomNumbers(10, 0, 100, 6));
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

describe('The sign function', function () {

    it('returns the sign of a number', function () {
        assert.equal(grob.sign(0), 0);
        assert.equal(grob.sign(42), 1);
        assert.equal(grob.sign(-42), -1);
    });

});

describe('The subtract function', function () {

    it('does subtraction', function () {
        assert.equal(grob.subtract(4), -4);
        assert.equal(grob.subtract(30, 6), 24);
        assert.equal(grob.subtract(99, 40, 11, 10, 5), 33);
    });

});

describe('The total function', function () {

    it('totals a list of numbers', function () {
        assert.equal(grob.total([10, 12, 9, 9]), 40);
        assert.equal(grob.total(10, 12, 9, 11), 42);
        assert.equal(grob.total(), 0);
        assert.equal(grob.total([]), 0);
        assert.equal(grob.total(20), 20);
    });

});