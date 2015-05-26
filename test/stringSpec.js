'use strict';

var assert = require('assert');
var mocha = require('mocha');
var describe = mocha.describe;
var it = mocha.it;

var grob = require('../src/grob');

describe('The string module', function () {

    it('has concatenate', function () {
        var s1 = 'foo';
        var s2 = 'bar';
        assert.equal(grob.concatenate(), '');
        assert.equal(grob.concatenate(s1), 'foo');
        assert.equal(grob.concatenate(s1, s2), 'foobar');
        assert.equal(grob.concatenate(s1, s2, s1, s2, s1, s2), 'foobarfoobarfoobar');
    });

    it('has substring', function () {
        assert.equal(grob.substring('Hello', 0), 'Hello');
        assert.equal(grob.substring('Hello', 1), 'ello');
        assert.equal(grob.substring('Hello', 1, 3), 'el');
        assert.equal(grob.substring('Hello', 1, 3, true), 'ell');
    });

    it('has toCharacterCodes', function () {
        assert.deepEqual(grob.toCharacterCodes(), []);
        assert.deepEqual(grob.toCharacterCodes(''), []);
        assert.deepEqual(grob.toCharacterCodes('ABC'), [65, 66, 67]);
    });

});
