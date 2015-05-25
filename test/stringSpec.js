'use strict';

var assert = require('assert');
var mocha = require('mocha');
var describe = mocha.describe;
var it = mocha.it;

var grob = require('../src/grob');

describe('The concatenate function', function () {

    it('works with undefined values', function () {
        var s1 = 'foo';
        var s2 = 'bar';
        assert.equal(grob.concatenate(), '');
        assert.equal(grob.concatenate(s1), 'foo');
        assert.equal(grob.concatenate(s1, s2), 'foobar');
        assert.equal(grob.concatenate(s1, s2, s1, s2, s1, s2), 'foobarfoobarfoobar');
    });

});
