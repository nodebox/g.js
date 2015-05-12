'use strict';

var assert = require('assert');
var mocha = require('mocha');
var describe = mocha.describe;
var it = mocha.it;

var grob = require('../src/grob');

describe('The library', function () {

    it('can be imported', function () {
        assert(grob.Rect !== undefined);
        assert(grob.translate !== undefined);
    });

});

describe('Import function', function () {

    it('can import an empty SVG', function () {
        var group = grob.importSVG('<svg></svg>');
        assert.equal(group.shapes.length, 0);
    });

    it('can import a simple path', function () {
        var group = grob.importSVG('<svg><path d="M0,0L10,20L30,40Z"/></svg>');
        assert.equal(group.shapes.length, 1);
        var path = group.shapes[0];
        assert.equal(path.commands.length, 4);
    });

});
