'use strict';

var assert = require('assert');
var mocha = require('mocha');
var describe = mocha.describe;
var it = mocha.it;

var g = require('../src/g');

describe('The interleave function', function () {

    it('works', function () {
        assert.deepEqual(g.interleave(), []);
        assert.deepEqual(g.interleave([1]), [1]);
        assert.deepEqual(g.interleave([1], [2]), [1, 2]);
        assert.deepEqual(g.interleave([1, 3], [2]), [1, 2, 3]);
        assert.deepEqual(g.interleave([1], [2, 99]), [1, 2]);
        assert.deepEqual(g.interleave([1, 4], [2, 5], [3]), [1, 2, 3, 4, 5]);
    });

});
