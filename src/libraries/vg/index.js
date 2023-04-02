// vg.js
// JavaScript library for vector graphics
// https://github.com/nodebox/vg.js
// (c) 2014 EMRG
// vg.js may be freely distributed under the MIT license.
// Based on: canvas.js, https://github.com/clips/pattern/blob/master/pattern/canvas.js (BSD)
// De Smedt T. & Daelemans W. (2012). Pattern for Python. Journal of Machine Learning Research.

// Utility functions
export * from "./util/bezier";
export * from "./util/color";
export * from "./util/geo";
export * from "./util/math";
export * from "./util/svg";

// Objects
import Color from "./objects/color";
import Group from "./objects/group";
import Matrix4 from "./objects/matrix4";
import Path from "./objects/path";
import Point from "./objects/point";
import Rect from "./objects/rect";
import Text from "./objects/text";
import Transform from "./objects/transform";
import Vec3 from "./objects/vec3";
import Transformable from "./objects/transformable";
Object.assign(Point.prototype, Transformable);
Object.assign(Path.prototype, Transformable);
Object.assign(Group.prototype, Transformable);
Object.assign(Text.prototype, Transformable);
export { Color, Group, Matrix4, Path, Point, Rect, Text, Transform, Vec3 };

// Commands

export * from "./commands/draw";
export * from "./commands/filters";
export * from "./commands/shapes";
