'use strict';

var assert = require('assert');
var mocha = require('mocha');
var describe = mocha.describe;
var it = mocha.it;

var g = require('../src/g');

describe('The interleave function', function () {

    it('works', function () {
        assert.deepEqual(g.interleave(null), []);
        assert.deepEqual(g.interleave(null, null), []);
        assert.deepEqual(g.interleave(null, [1, 2, 3], [11, 22]), [1, 11, 2, 22, 3]);
        assert.deepEqual(g.interleave(), []);
        assert.deepEqual(g.interleave([1]), [1]);
        assert.deepEqual(g.interleave([1], [2]), [1, 2]);
        assert.deepEqual(g.interleave([1, 3], [2]), [1, 2, 3]);
        assert.deepEqual(g.interleave([1], [2, 99]), [1, 2]);
        assert.deepEqual(g.interleave([1, 4], [2, 5], [3]), [1, 2, 3, 4, 5]);
    });

});


describe('The repeat function', function () {

    it('works with simple items', function () {
        assert.deepEqual(g.repeat(42, -1), []);
        assert.deepEqual(g.repeat(42, 0), []);
        assert.deepEqual(g.repeat(42, 1), [42]);
        assert.deepEqual(g.repeat(42, 3), [42, 42, 42]);
    });

    it('works with list items', function () {
        assert.deepEqual(g.repeat([1, 8], 3), [1, 8, 1, 8, 1, 8]);
        assert.deepEqual(g.repeat([], 3), []);
    });

    it('works per-item', function () {
        assert.deepEqual(g.repeat([1, 8], 3, true), [1, 1, 1, 8, 8, 8]);
        assert.deepEqual(g.repeat([], 3, true), []);
    });

});
