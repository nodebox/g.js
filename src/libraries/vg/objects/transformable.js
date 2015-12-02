// Mixin for Path and Group

'use strict';

var Point = require('../objects/point');
var Transform = require('../objects/transform');

var Transformable = {
    translate: function (position) {
        if (!position) { position = Point.ZERO; }
        var t = new Transform().translate(position.x, position.y);
        return t.transformShape(this);
    },

    scale: function (scale, origin) {
        if (!origin) { origin = Point.ZERO; }
        var sx, sy;
        if (typeof scale === 'number') {
            sx = scale;
            sy = scale;
        } else {
            sx = scale.x;
            sy = scale.y;
        }
        var t = new Transform();
        t = t.translate(origin.x, origin.y);
        t = t.scale(sx, sy);
        t = t.translate(-origin.x, -origin.y);
        return t.transformShape(this);
    },

    rotate: function (angle, origin) {
        if (!origin) { origin = Point.ZERO; }
        var t = new Transform();
        t = t.translate(origin.x, origin.y);
        t = t.rotate(angle);
        t = t.translate(-origin.x, -origin.y);
        return t.transformShape(this);
    },

    skew: function (skew, origin) {
        if (!origin) { origin = Point.ZERO; }
        var t = new Transform();
        t = t.translate(origin.x, origin.y);
        t = t.skew(skew.x, skew.y);
        t = t.translate(-origin.x, -origin.y);
        return t.transformShape(this);
    }
};

module.exports = Transformable;
