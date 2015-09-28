'use strict';

var assert = require('assert');
var mocha = require('mocha');
var describe = mocha.describe;
var it = mocha.it;

var grob = require('../src/grob');

describe('The importCSV function', function () {

    it('works with strings', function () {
        var s = 'Name,Age,Group,Grade\nJohn,52,1A,7.5\nPete,66,3C,4.3';
        var imported = grob.importCSV(s);
        assert.equal(imported.length, 2);
        assert.deepEqual(imported[0], {Name: 'John', Age: 52, Group: '1A', Grade: 7.5});
    });

});

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
