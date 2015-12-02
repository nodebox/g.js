'use strict';

var assert = require('assert');
var mocha = require('mocha');
var describe = mocha.describe;
var it = mocha.it;

var img = require('../src/libraries/img/img');

describe('The library', function () {

    it('can be imported', function () {
        assert(img.Img !== undefined);
        assert(img.merge !== undefined);
    });

});
