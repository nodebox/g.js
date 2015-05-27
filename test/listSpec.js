'use strict';

var assert = require('assert');
var mocha = require('mocha');
var describe = mocha.describe;
var it = mocha.it;

var grob = require('../src/grob');

describe('The interleave function', function () {

    it('works', function () {
        assert.deepEqual(grob.interleave(), []);
        assert.deepEqual(grob.interleave([1]), [1]);
        assert.deepEqual(grob.interleave([1], [2]), [1, 2]);
        assert.deepEqual(grob.interleave([1, 3], [2]), [1, 2, 3]);
        assert.deepEqual(grob.interleave([1], [2, 99]), [1, 2]);
        assert.deepEqual(grob.interleave([1, 4], [2, 5], [3]), [1, 2, 3, 4, 5]);
    });

});
