'use strict';

var _ = require("lodash");
var vg = require('vg.js');
var img = require('img.js');

var grob = {};

for (var k in vg) {
    grob[k] = vg[k];
}

for (var k in img) {
    grob[k] = img[k];
}

grob.merge = function () {
    var objects = _.flatten(arguments, true);
    if (Array.isArray(objects) && objects.length > 0) {
        var o = objects[0];
        if (o && (o.commands || o.shapes)) {
            return vg.merge(objects);
        } else if (o instanceof img.Img) {
            return img.merge(objects);
        }
    }
    return null;
};

module.exports = grob;