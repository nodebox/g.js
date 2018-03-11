'use strict';

var assert = require('assert');
var mocha = require('mocha');
var describe = mocha.describe;
var it = mocha.it;

var g = require('../src/g');

describe('The pathLength function', function () {

    it('works', function () {
        const p = g.rect(0, 0, 100, 30);
        const l = g.pathLength(p);
        assert.equal(l, 260);
    });

    it('can handle null values', function () {
        const l = g.pathLength(null);
        assert.equal(l, 0);
    });

});
