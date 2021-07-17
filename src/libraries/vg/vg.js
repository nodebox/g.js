// vg.js
// JavaScript library for vector graphics
// https://github.com/nodebox/vg.js
// (c) 2014 EMRG
// vg.js may be freely distributed under the MIT license.
// Based on: canvas.js, https://github.com/clips/pattern/blob/master/pattern/canvas.js (BSD)
// De Smedt T. & Daelemans W. (2012). Pattern for Python. Journal of Machine Learning Research.

'use strict';

var vg = {};

// Utility functions
vg.bezier = require('./util/bezier');
vg.color = require('./util/color');
vg.geo = require('./util/geo');
vg.math = require('./util/math');
vg.random = require('./util/random');
vg.svg = require('./util/svg');

// Objects
vg.Color = require('./objects/color');
vg.Group = require('./objects/group');
vg.Matrix4 = require('./objects/matrix4');
vg.Path = require('./objects/path');
vg.Point = vg.Vec2 = require('./objects/point');
vg.Rect = require('./objects/rect');
vg.Text = require('./objects/text');
vg.Transform = vg.Matrix3 = require('./objects/transform');
vg.Vec3 = require('./objects/vec3');

// Commands
function importCommands(module) {
    for (var k in module) {
        vg[k] = module[k];
    }
}

var Transformable = require('./objects/transformable');
Object.assign(vg.Point.prototype, Transformable);
Object.assign(vg.Path.prototype, Transformable);
Object.assign(vg.Group.prototype, Transformable);
Object.assign(vg.Text.prototype, Transformable);

importCommands(require('./commands/draw'));
importCommands(require('./commands/filters'));
importCommands(require('./commands/shapes'));

module.exports = vg;