'use strict';

var assert = require('assert');
var mocha = require('mocha');
var describe = mocha.describe;
var it = mocha.it;

var grob = require('../src/grob');

describe('The stack function', function () {

    it('returns valid bounds', function () {
        var r1 = grob.rect(0, 0, 100, 100);
        var r2 = grob.rect(0, 0, 100, 100);
        var g = grob.stack([r1, r2], 'e', 10);
        var bounds = grob.bounds(g);
        assert.deepEqual(bounds, {x: -50, y: -50, width: 210, height: 100});
    });

});
