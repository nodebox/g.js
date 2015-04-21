'use strict';

var assert = require('assert');
var mocha = require('mocha');
var describe = mocha.describe;
var it = mocha.it;

var grob = require('../src/grob');

describe('Vector graphics', function () {

    it('can be imported', function () {
        assert(grob.Rect !== undefined);
        assert(grob.translate !== undefined);
    });

});
