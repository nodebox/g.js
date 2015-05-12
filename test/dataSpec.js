'use strict';

var assert = require('assert');
var mocha = require('mocha');
var describe = mocha.describe;
var it = mocha.it;

var grob = require('../src/grob');

describe('The filterData function', function () {

    it('works with strings', function () {
        var data = [{name: 'Alice', age: 42}, {name: 'Bob', age: 33}];
        var filtered = grob.filterData(data, 'name', '==', 'Alice');
        assert.equal(filtered.length, 1);
        assert.deepEqual(filtered[0], {name: 'Alice', age: 42});
    });

    it('converts numbers', function () {
        var data = [{name: 'Alice', age: 42}, {name: 'Bob', age: 33}];
        var filtered = grob.filterData(data, 'age', '==', '33');
        assert.equal(filtered.length, 1);
        assert.deepEqual(filtered[0], {name: 'Bob', age: 33});
    });

});
