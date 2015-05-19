'use strict';

var assert = require('assert');
var mocha = require('mocha');
var describe = mocha.describe;
var it = mocha.it;

var grob = require('../src/grob');

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
