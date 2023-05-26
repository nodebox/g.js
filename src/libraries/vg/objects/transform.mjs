// 2-dimensional transformation matrix

"use strict";

import { MOVETO, LINETO, QUADTO, CURVETO, CLOSE } from "../index.mjs";
import { radians } from "../util/math.mjs";
import Group from "./group.mjs";
import Path from "../objects/path.mjs";
import Point from "../objects/point.mjs";

// A geometric transformation in Euclidean space (i.e. 2D)
// that preserves collinearity and ratio of distance between points.
// Linear transformations include rotation, translation, scaling, shear.
export default class Transform {
  constructor(m) {
    if (m !== undefined) {
      this.m = m;
    } else {
      this.m = [1, 0, 0, 1, 0, 0]; // Identity matrix.
    }
  }
  static identity() {
    return new Transform();
  }
  // Returns the 3x3 matrix multiplication of A and B.
  // Note that scale(), translate(), rotate() work with premultiplication,
  // e.g. the matrix A followed by B = BA and not AB.
  static _mmult(a, b) {
    if (a.m !== undefined) {
      a = a.m;
    }
    if (b.m !== undefined) {
      b = b.m;
    }

    return new Transform([
      a[0] * b[0] + a[1] * b[2],
      a[0] * b[1] + a[1] * b[3],
      a[2] * b[0] + a[3] * b[2],
      a[2] * b[1] + a[3] * b[3],
      a[4] * b[0] + a[5] * b[2] + b[4],
      a[4] * b[1] + a[5] * b[3] + b[5],
    ]);
  }
  isIdentity() {
    var m = this.m;
    return (
      m[0] === 1 &&
      m[1] === 0 &&
      m[2] === 0 &&
      m[3] === 1 &&
      m[4] === 0 &&
      m[5] === 0
    );
  }
  prepend(matrix) {
    return Transform._mmult(this.m, matrix.m);
  }
  append(matrix) {
    return Transform._mmult(matrix.m, this.m);
  }
  inverse() {
    var m = this.m,
      d = m[0] * m[3] - m[1] * m[2];
    return new Transform([
      m[3] / d,
      -m[1] / d,
      -m[2] / d,
      m[0] / d,
      (m[2] * m[5] - m[3] * m[4]) / d,
      -(m[0] * m[5] - m[1] * m[4]) / d,
    ]);
  }
  scale(x, y) {
    if (y === undefined) {
      y = x;
    }
    return Transform._mmult([x, 0, 0, y, 0, 0], this.m);
  }
  translate(x, y) {
    return Transform._mmult([1, 0, 0, 1, x, y], this.m);
  }
  rotate(angle) {
    var c = Math.cos(radians(angle)),
      s = Math.sin(radians(angle));
    return Transform._mmult([c, s, -s, c, 0, 0], this.m);
  }
  skew(x, y) {
    var kx = (Math.PI * x) / 180.0,
      ky = (Math.PI * y) / 180.0;
    return Transform._mmult([1, Math.tan(ky), -Math.tan(kx), 1, 0, 0], this.m);
  }
  // Returns the new coordinates of the given point (x,y) after transformation.
  transformPoint(point) {
    var x = point.x,
      y = point.y,
      m = this.m;
    return new Point(x * m[0] + y * m[2] + m[4], x * m[1] + y * m[3] + m[5]);
  }
  transformPoints(points) {
    var transformedPoints = [];
    for (var i = 0; i < points.length; i += 1) {
      transformedPoints.push(this.transformPoint(points[i]));
    }
    return transformedPoints;
  }
  transformPath(path) {
    var m = this.m;
    var commands = [];
    commands.length = path.commands.length;
    for (var i = 0, l = path.commands.length; i < l; i++) {
      var cmd = path.commands[i];
      switch (cmd.type) {
        case MOVETO:
        case LINETO:
          commands[i] = {
            type: cmd.type,
            x: cmd.x * m[0] + cmd.y * m[2] + m[4],
            y: cmd.x * m[1] + cmd.y * m[3] + m[5],
          };
          break;
        case QUADTO:
          commands[i] = {
            type: QUADTO,
            x: cmd.x * m[0] + cmd.y * m[2] + m[4],
            y: cmd.x * m[1] + cmd.y * m[3] + m[5],
            x1: cmd.x1 * m[0] + cmd.y1 * m[2] + m[4],
            y1: cmd.x1 * m[1] + cmd.y1 * m[3] + m[5],
          };
          break;
        case CURVETO:
          commands[i] = {
            type: CURVETO,
            x: cmd.x * m[0] + cmd.y * m[2] + m[4],
            y: cmd.x * m[1] + cmd.y * m[3] + m[5],
            x1: cmd.x1 * m[0] + cmd.y1 * m[2] + m[4],
            y1: cmd.x1 * m[1] + cmd.y1 * m[3] + m[5],
            x2: cmd.x2 * m[0] + cmd.y2 * m[2] + m[4],
            y2: cmd.x2 * m[1] + cmd.y2 * m[3] + m[5],
          };
          break;
        case CLOSE:
          commands[i] = { type: CLOSE };
          break;
        default:
          throw new Error("Unknown command type " + cmd);
      }
    }
    return new Path(commands, path.fill, path.stroke, path.strokeWidth);
  }
  transformText(text) {
    var t = text.clone();
    t.transform = this.append(t.transform);
    return t;
  }
  transformGroup(group) {
    var transformedShapes = [];
    for (var i = 0; i < group.shapes.length; i += 1) {
      transformedShapes.push(this.transformShape(group.shapes[i]));
    }
    return new Group(transformedShapes);
  }
  transformShape(shape) {
    var fn;
    if (shape.shapes) {
      fn = this.transformGroup;
    } else if (shape.commands) {
      fn = this.transformPath;
    } else if (shape.text) {
      fn = this.transformText;
    } else if (shape.x !== undefined && shape.y !== undefined) {
      fn = this.transformPoint;
    } else if (shape._transform !== undefined) {
      return shape._transform(this.m);
    } else if (Array.isArray(shape) && shape.length > 0) {
      if (shape[0].x !== undefined && shape[0].y !== undefined) {
        fn = this.transformPoints;
      } else {
        var l = [];
        for (var i = 0; i < shape.length; i += 1) {
          l.push(this.transformShape(shape[i]));
        }
        return l;
      }
    } else {
      throw new Error("Don't know how to transform " + shape);
    }
    return fn.call(this, shape);
  }
}

Transform.IDENTITY = new Transform();
