// vg.js
// JavaScript library for vector graphics
// https://github.com/nodebox/vg.js
// (c) 2014 EMRG
// vg.js may be freely distributed under the MIT license.
// Based on: canvas.js, https://github.com/clips/pattern/blob/master/pattern/canvas.js (BSD)
// De Smedt T. & Daelemans W. (2012). Pattern for Python. Journal of Machine Learning Research.

// Utility functions
export * from "./util/bezier.mjs";
export * from "./util/color.mjs";
export * from "./util/geo.mjs";
export * from "./util/math.mjs";
export * from "./util/svg.mjs";

// Objects
import Color from "./objects/color.mjs";
import Group from "./objects/group.mjs";
import Matrix4 from "./objects/matrix4.mjs";
import Path from "./objects/path.mjs";
import Point from "./objects/point.mjs";
import Rect from "./objects/rect.mjs";
import Text from "./objects/text.mjs";
import Transform from "./objects/transform.mjs";
import Vec3 from "./objects/vec3.mjs";
import Transformable from "./objects/transformable.mjs";
Object.assign(Point.prototype, Transformable);
Object.assign(Path.prototype, Transformable);
Object.assign(Group.prototype, Transformable);
Object.assign(Text.prototype, Transformable);
export { Color, Group, Matrix4, Path, Point, Rect, Text, Transform, Vec3 };

// Commands

export * from "./commands/draw.mjs";
export * from "./commands/filters.mjs";
export * from "./commands/shapes.mjs";
