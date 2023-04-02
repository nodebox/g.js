// Object creation / manipulation commands

import { flatten } from "../../util";

import { MOVETO, LINETO, QUADTO, CURVETO, CLOSE } from "../util/bezier";
import { pointInPolygon, angle, distance, coordinates } from "../util/geo";
import { degrees, snap } from "../util/math";
import randomGenerator from "../../random";

import Color from "../objects/color";
import Group from "../objects/group";
import Path from "../objects/path";
import Point from "../objects/point";
import Rect from "../objects/rect";
import Transform from "../objects/transform";
import Transformable from "../objects/transformable";
import ClipperLib from "js-clipper";
// var ClipperLib = require("../../../../third_party/clipper");

function _cloneCommand(cmd) {
  var newCmd = { type: cmd.type };
  if (newCmd.type !== CLOSE) {
    newCmd.x = cmd.x;
    newCmd.y = cmd.y;
  }
  if (newCmd.type === QUADTO) {
    newCmd.x1 = cmd.x1;
    newCmd.y1 = cmd.y1;
  } else if (newCmd.type === CURVETO) {
    newCmd.x1 = cmd.x1;
    newCmd.y1 = cmd.y1;
    newCmd.x2 = cmd.x2;
    newCmd.y2 = cmd.y2;
  }
  return newCmd;
}

export const HORIZONTAL = "horizontal";
export const VERTICAL = "vertical";

export const EAST = "e";
export const WEST = "w";
export const NORTH = "n";
export const SOUTH = "s";

export function bounds(o) {
  var r, i, n;
  if (!o) {
    return new Rect();
  } else if (typeof o.bounds === "function") {
    return o.bounds();
  } else if (o.x !== undefined && o.y !== undefined) {
    if (o.width !== undefined && o.height !== undefined) {
      return new Rect(o.x, o.y, o.width, o.height);
    } else {
      return new Rect(o.x, o.y, 0, 0);
    }
  } else if (o.r !== undefined && o.g !== undefined && o.b !== undefined) {
    return new vg.Rect(0, 0, 30, 30);
  } else if (Array.isArray(o)) {
    r = null;
    n = o.length;
    // A color array is special since the colors have no inherent position.
    if (
      n > 0 &&
      o[0].r !== undefined &&
      o[0].g !== undefined &&
      o[0].b !== undefined
    ) {
      return new Rect(0, 0, o.length * 30, 30);
    }
    for (i = 0; i < n; i += 1) {
      if (!r) {
        r = vg.bounds(o[i]);
      } else {
        r = r.unite(vg.bounds(o[i]));
      }
    }
    return r || new Rect();
  } else {
    return new Rect();
  }
}

export function makeCenteredRect(cx, cy, width, height) {
  var x = cx - width / 2,
    y = cy - height / 2;
  return new Rect(x, y, width, height);
}

export function makePoint(x, y) {
  return new Point(x, y);
}

export function makeRect(x, y, width, height) {
  return new Rect(x, y, width, height);
}

// Combine all given shape arguments into a new group.
// This function works like makeGroup, except that this can take any number
// of arguments.
export function merge() {
  var args = flatten(arguments);
  var shapes = [];
  for (var i = 0; i < args.length; i += 1) {
    if (args[i] && args[i].length !== 0) {
      shapes.push(args[i]);
    }
  }
  return new Group(shapes);
}

export function combinePaths(shape) {
  return Path.combine(shape);
}

export function toPoints(shape) {
  if (!shape) {
    return [];
  }
  var i;
  if (shape.commands) {
    var cmd,
      commands = [];
    for (i = 0; i < shape.commands.length; i += 1) {
      cmd = shape.commands[i];
      if (cmd.x !== undefined) {
        commands.push(new Point(cmd.x, cmd.y));
      }
    }
    return commands;
  }
  var points = [];
  for (i = 0; i < shape.shapes.length; i += 1) {
    points = points.concat(vg.shapePoints(shape.shapes[i]));
  }
  return points;
}
export const shapePoints = toPoints;

// FILTERS //////////////////////////////////////////////////////////////

export function colorize(shape, fill, stroke, strokeWidth) {
  if (!shape) return null;
  return shape.colorize(fill, stroke, strokeWidth);
}

export function translate(shape, position) {
  if (!shape) return null;
  if (shape.translate) {
    return shape.translate(position);
  }
  return Transformable.translate.apply(shape, [position]);
}

export function scale(shape, scale, origin) {
  if (!shape) return null;
  if (shape.scale) {
    return shape.scale(scale, origin);
  }
  return Transformable.scale.apply(shape, [scale, origin]);
}

export function rotate(shape, angle, origin) {
  if (!shape) return null;
  if (shape.rotate) {
    return shape.rotate(angle, origin);
  }
  return Transformable.rotate.apply(shape, [angle, origin]);
}

export function skew(shape, skew, origin) {
  if (!shape) return null;
  if (shape.skew) {
    return shape.skew(skew, origin);
  }
  return Transformable.skew.apply(shape, [skew, origin]);
}

export function copy(shape, copies, order, translate, rotate, scale) {
  var i,
    t,
    j,
    op,
    shapes = [],
    tx = 0,
    ty = 0,
    r = 0,
    sx = 1.0,
    sy = 1.0;
  for (i = 0; i < copies; i += 1) {
    t = new Transform();
    for (j = 0; j < order.length; j += 1) {
      op = order[j];
      if (op === "t") {
        t = t.translate(tx, ty);
      } else if (op === "r") {
        t = t.rotate(r);
      } else if (op === "s") {
        t = t.scale(sx, sy);
      }
    }
    if (
      Array.isArray(shape) &&
      shape.length > 0 &&
      shape[0].x !== undefined &&
      shape[0].y !== undefined
    ) {
      shapes = shapes.concat(t.transformShape(shape));
    } else {
      shapes.push(t.transformShape(shape));
    }

    tx += translate.x;
    ty += translate.y;
    r += rotate;
    sx += scale.x;
    sy += scale.y;
  }
  return shapes;
}

export function fit(shape, position, width, height, stretch) {
  if (!shape) return null;
  stretch = stretch !== undefined ? stretch : false;
  var t,
    sx,
    sy,
    bounds = vg.bounds(shape),
    bx = bounds.x,
    by = bounds.y,
    bw = bounds.width,
    bh = bounds.height;

  // Make sure bw and bh aren't infinitely small numbers.
  // This will lead to incorrect transformations with for examples lines.
  bw = bw > 0.000000000001 ? bw : 0;
  bh = bh > 0.000000000001 ? bh : 0;

  t = new Transform();
  t = t.translate(position.x, position.y);

  if (!stretch) {
    // don't scale widths or heights that are equal to zero.
    sx = bw > 0 ? width / bw : Number.MAX_VALUE;
    sy = bh > 0 ? height / bh : Number.MAX_VALUE;
    sx = sy = Math.min(sx, sy);
  } else {
    sx = bw > 0 ? width / bw : 1;
    sy = bh > 0 ? height / bh : 1;
  }

  t = t.scale(sx, sy);
  t = t.translate(-bw / 2 - bx, -bh / 2 - by);

  return t.transformShape(shape);
}

// Fit the given shape to the bounding shape.
// If stretch = true, proportions will be distorted.
export function fitTo(shape, bounding, stretch) {
  if (!shape) return null;
  if (!bounding) return shape;

  var bounds = vg.bounds(bounding),
    bx = bounds.x,
    by = bounds.y,
    bw = bounds.width,
    bh = bounds.height;

  return vg.fit(shape, { x: bx + bw / 2, y: by + bh / 2 }, bw, bh, stretch);
}

export function mirror(shape, angle, origin, keepOriginal) {
  if (!shape) return null;
  var t = new Transform();
  t = t.translate(origin.x, origin.y);
  t = t.rotate(angle * 2 - 180);
  t = t.scale(-1, 1);
  t = t.translate(-origin.x, -origin.y);
  var newShape = t.transformShape(shape);

  if (keepOriginal) {
    if (Array.isArray(shape) && shape.length > 0) {
      return shape.concat(newShape);
    }
    return new Group([shape, newShape]);
  } else {
    return newShape;
  }
}

export function pathLength(shape, options) {
  if (!shape) return 0;
  var precision = 20;
  if (options && options.precision) {
    precision = options.precision;
  }
  return shape.length(precision);
}

export function resampleByLength(shape, maxLength) {
  if (!shape) return null;
  return shape.resampleByLength(maxLength);
}

export function resampleByAmount(shape, amount, perContour) {
  if (!shape) return null;
  return shape.resampleByAmount(amount, perContour);
}

export function _wigglePoints(shape, offset, rand) {
  var i, dx, dy;
  if (shape.commands) {
    var p = new Path([], shape.fill, shape.stroke, shape.strokeWidth);
    for (i = 0; i < shape.commands.length; i += 1) {
      dx = (rand(0, 1) - 0.5) * offset.x * 2;
      dy = (rand(0, 1) - 0.5) * offset.y * 2;
      var cmd = shape.commands[i];
      if (cmd.type === MOVETO) {
        p.moveTo(cmd.x + dx, cmd.y + dy);
      } else if (cmd.type === LINETO) {
        p.lineTo(cmd.x + dx, cmd.y + dy);
      } else if (cmd.type === CURVETO) {
        p.curveTo(cmd.x1, cmd.y1, cmd.x2, cmd.y2, cmd.x + dx, cmd.y + dy);
      } else if (cmd.type === CLOSE) {
        p.close();
      }
    }
    return p;
  } else if (shape.shapes) {
    var wShapes = [];
    wShapes.length = shape.shapes.length;
    for (i = 0; i < shape.shapes.length; i += 1) {
      wShapes[i] = vg._wigglePoints(shape.shapes[i], offset, rand);
    }
    return new Group(wShapes);
  } else if (
    Array.isArray(shape) &&
    shape.length > 0 &&
    shape[0].x !== undefined &&
    shape[0].y !== undefined
  ) {
    var wPoints = [];
    wPoints.length = shape.length;
    for (i = 0; i < shape.length; i += 1) {
      dx = (rand(0, 1) - 0.5) * offset.x * 2;
      dy = (rand(0, 1) - 0.5) * offset.y * 2;
      wPoints[i] = new Point(shape[i].x + dx, shape[i].y + dy);
    }
    return wPoints;
  } else {
    var w = [];
    w.length = shape.length;
    for (i = 0; i < shape.length; i += 1) {
      w[i] = vg._wigglePoints(shape[i], offset, rand);
    }
    return w;
  }
}

export function wigglePoints(shape, offset, seed) {
  if (!shape) return null;
  seed = seed !== undefined ? seed : Math.random();
  var rand = randomGenerator(seed);
  if (offset === undefined) {
    offset = { x: 10, y: 10 };
  } else if (typeof offset === "number") {
    offset = { x: offset, y: offset };
  }
  return vg._wigglePoints(shape, offset, rand);
}

export function _wiggleContours(shape, offset, rand) {
  var i;
  if (shape.commands) {
    var dx,
      dy,
      t,
      subPaths = shape.contours(),
      commands = [];
    for (i = 0; i < subPaths.length; i += 1) {
      dx = (rand(0, 1) - 0.5) * offset.x * 2;
      dy = (rand(0, 1) - 0.5) * offset.y * 2;
      t = new Transform().translate(dx, dy);
      commands = commands.concat(
        t.transformShape(new Path(subPaths[i])).commands
      );
    }
    return new Path(commands, shape.fill, shape.stroke, shape.strokeWidth);
  } else if (shape.shapes) {
    var wShapes = [];
    wShapes.length = shape.shapes.length;
    for (i = 0; i < shape.shapes.length; i += 1) {
      wShapes[i] = vg._wiggleContours(shape.shapes[i], offset, rand);
    }
    return new Group(wShapes);
  } else {
    var w = [];
    w.length = shape.length;
    for (i = 0; i < shape.length; i += 1) {
      w[i] = vg._wiggleContours(shape[i], offset, rand);
    }
    return w;
  }
}

export function wiggleContours(shape, offset, seed) {
  if (!shape) return null;
  seed = seed !== undefined ? seed : Math.random();
  var rand = randomGenerator(seed);
  if (offset === undefined) {
    offset = { x: 10, y: 10 };
  } else if (typeof offset === "number") {
    offset = { x: offset, y: offset };
  }
  return vg._wiggleContours(shape, offset, rand);
}

export function _wigglePaths(shape, offset, rand) {
  if (shape.commands) {
    return shape;
  } else if (shape.shapes) {
    return new Group(vg._wigglePaths(shape.shapes, offset, rand));
  } else if (Array.isArray(shape)) {
    var subShape,
      dx,
      dy,
      t,
      newShapes = [];
    for (var i = 0; i < shape.length; i += 1) {
      subShape = shape[i];
      if (subShape.commands) {
        dx = (rand(0, 1) - 0.5) * offset.x * 2;
        dy = (rand(0, 1) - 0.5) * offset.y * 2;
        t = new Transform().translate(dx, dy);
        newShapes.push(t.transformShape(subShape));
      } else if (subShape.shapes) {
        newShapes.push(vg._wigglePaths(subShape, offset, rand));
      }
    }
    return newShapes;
  }
}

export function wigglePaths(shape, offset, seed) {
  if (!shape) return null;
  seed = seed !== undefined ? seed : Math.random();
  var rand = randomGenerator(seed);
  if (offset === undefined) {
    offset = { x: 10, y: 10 };
  } else if (typeof offset === "number") {
    offset = { x: offset, y: offset };
  }
  return vg._wigglePaths(shape, offset, rand);
}

// Generate points within the boundaries of a shape.
export function scatterPoints(shape, amount, seed) {
  if (!shape) return [];
  seed = seed !== undefined ? seed : Math.random();
  var i,
    j,
    contourPath,
    nrKeypoints,
    tries,
    inContourCount,
    x,
    y,
    rand = randomGenerator(seed),
    bounds = shape.bounds(),
    bx = bounds.x,
    by = bounds.y,
    bw = bounds.width,
    bh = bounds.height,
    contours = shape.contours(),
    paths = [],
    points = [],
    POINTS_PER_SEGMENT = 5;

  for (i = 0; i < contours.length; i++) {
    contourPath = new Path(contours[i]);
    nrKeypoints = contourPath.commands.length;
    paths.push(
      contourPath.points(nrKeypoints * POINTS_PER_SEGMENT, { closed: true })
    );
  }

  for (i = 0; i < amount; i += 1) {
    tries = 100;
    while (tries > 0) {
      inContourCount = 0;
      x = bx + rand(0, 1) * bw;
      y = by + rand(0, 1) * bh;
      for (j = 0; j < paths.length; j++) {
        if (pointInPolygon(paths[j], x, y)) {
          inContourCount += 1;
        }
      }
      if (inContourCount % 2) {
        points.push(new Point(x, y));
        break;
      }
      tries -= 1;
    }
  }
  return points;
}

export function connectPoints(points, closed) {
  if (!points) return null;
  var pt,
    p = new Path();
  for (var i = 0; i < points.length; i += 1) {
    pt = points[i];
    if (i === 0) {
      p.moveTo(pt.x, pt.y);
    } else {
      p.lineTo(pt.x, pt.y);
    }
  }
  if (closed) {
    p.close();
  }
  p.fill = null;
  p.stroke = Color.BLACK;
  return p;
}

export function align(shape, position, hAlign, vAlign) {
  if (!shape) return null;
  var dx,
    dy,
    t,
    x = position.x,
    y = position.y,
    bounds = vg.bounds(shape);
  if (hAlign === "left") {
    dx = x - bounds.x;
  } else if (hAlign === "right") {
    dx = x - bounds.x - bounds.width;
  } else if (hAlign === "center") {
    dx = x - bounds.x - bounds.width / 2;
  } else {
    dx = 0;
  }
  if (vAlign === "top") {
    dy = y - bounds.y;
  } else if (vAlign === "bottom") {
    dy = y - bounds.y - bounds.height;
  } else if (vAlign === "middle") {
    dy = y - bounds.y - bounds.height / 2;
  } else {
    dy = 0;
  }

  t = new Transform().translate(dx, dy);
  return t.transformShape(shape);
}

// Snap geometry to a grid.
export function snapShape(shape, distance, strength, center) {
  if (!shape) return null;
  strength = strength !== undefined ? strength : 1;
  center = center || Point.ZERO;

  var i, x, y;
  if (shape.commands) {
    var p = new Path([], shape.fill, shape.stroke, shape.strokeWidth);
    var cmd, x1, y1, x2, y2;
    for (i = 0; i < shape.commands.length; i += 1) {
      cmd = shape.commands[i];
      if (cmd.type === MOVETO || cmd.type === LINETO || cmd.type === CURVETO) {
        x = snap(cmd.x + center.x, distance, strength) - center.x;
        y = snap(cmd.y + center.y, distance, strength) - center.y;
        if (cmd.type === MOVETO) {
          p.moveTo(x, y);
        } else if (cmd.type === LINETO) {
          p.lineTo(x, y);
        } else if (cmd.type === CURVETO) {
          x1 = snap(cmd.x1 + center.x, distance, strength) - center.x;
          y1 = snap(cmd.y1 + center.y, distance, strength) - center.y;
          x2 = snap(cmd.x2 + center.x, distance, strength) - center.x;
          y2 = snap(cmd.y2 + center.y, distance, strength) - center.y;
          p.curveTo(x1, y1, x2, y2, x, y);
        }
      } else if (cmd.type === CLOSE) {
        p.close();
      } else {
        throw new Error("Invalid path command " + cmd);
      }
    }
    return p;
  } else if (shape.shapes) {
    var sShapes = [];
    sShapes.length = shape.shapes.length;
    for (i = 0; i < shape.shapes.length; i += 1) {
      sShapes[i] = vg.snap(shape.shapes[i], distance, strength, center);
    }
    return new Group(sShapes);
  } else if (
    Array.isArray(shape) &&
    shape.length > 0 &&
    shape[0].x !== undefined &&
    shape[0].y !== undefined
  ) {
    var point,
      sPoints = [];
    sPoints.length = shape.length;
    for (i = 0; i < shape.length; i += 1) {
      point = shape[i];
      x = snap(point.x + center.x, distance, strength) - center.x;
      y = snap(point.y + center.y, distance, strength) - center.y;
      sPoints[i] = new Point(x, y);
    }
    return sPoints;
  } else {
    var s = [];
    s.length = shape.length;
    for (i = 0; i < shape.length; i += 1) {
      s[i] = vg.snap(shape[i], distance, strength, center);
    }
    return s;
  }
}

export function deletePoints(shape, bounding, invert) {
  if (!shape) return null;
  if (!bounding) return shape;
  var i,
    cmd,
    commands = [];
  var pt,
    points = [];
  if (shape.commands) {
    var newCurve = true;
    for (i = 0; i < shape.commands.length; i += 1) {
      cmd = _cloneCommand(shape.commands[i]);
      if (
        cmd.x === undefined ||
        (invert && bounding.contains(cmd.x, cmd.y)) ||
        (!invert && !bounding.contains(cmd.x, cmd.y))
      ) {
        if (newCurve && cmd.type !== MOVETO) {
          cmd.type = MOVETO;
        }
        commands.push(cmd);
        if (cmd.type === MOVETO) {
          newCurve = false;
        } else if (cmd.type === CLOSE) {
          newCurve = true;
        }
      }
    }
    return new Path(commands, shape.fill, shape.stroke, shape.strokeWidth);
  } else if (shape.shapes) {
    var dShapes = [];
    dShapes.length = shape.shapes.length;
    for (i = 0; i < shape.shapes.length; i += 1) {
      dShapes[i] = vg.deletePoints(shape.shapes[i], bounding, invert);
    }
    return new Group(dShapes);
  } else if (
    Array.isArray(shape) &&
    shape.length > 0 &&
    shape[0].x !== undefined &&
    shape[0].y !== undefined
  ) {
    for (i = 0; i < shape.length; i += 1) {
      pt = shape[i];
      if (
        (invert && bounding.contains(pt.x, pt.y)) ||
        (!invert && !bounding.contains(pt.x, pt.y))
      ) {
        points.push(_cloneCommand(pt));
      }
    }
    return points;
  } else {
    var d = [];
    d.length = shape.length;
    for (i = 0; i < shape.length; i += 1) {
      d[i] = vg.deletePoints(shape[i], bounding, invert);
    }
    return d;
  }
}

export function deletePaths(shape, bounding, invert) {
  if (!shape || shape.commands) {
    return null;
  } else if (shape.shapes) {
    return new Group(vg.deletePaths(shape.shapes, bounding, invert));
  } else if (Array.isArray(shape)) {
    if (!bounding) return shape;
    var j,
      s,
      selected,
      cmd,
      subShapes,
      newShapes = [];
    var shapes = shape;
    for (var i = 0; i < shapes.length; i += 1) {
      s = shapes[i];
      if (s.commands) {
        selected = false;
        for (j = 0; j < s.commands.length; j += 1) {
          cmd = s.commands[j];
          if (cmd.x !== undefined && bounding.contains(cmd.x, cmd.y)) {
            selected = true;
            break;
          }
        }
        if (!((invert && !selected) || (selected && !invert))) {
          newShapes.push(s);
        }
      } else if (s.shapes) {
        subShapes = vg.deletePaths(s, bounding, invert);
        if (subShapes.length !== 0) {
          newShapes.push(subShapes);
        }
      }
    }
    return newShapes;
  }
}

export function delete_(shape, bounding, scope, invert) {
  if (shape === null || bounding === null) {
    return null;
  }
  if (scope === "points") {
    return vg.deletePoints(shape, bounding, invert);
  }
  if (scope === "paths") {
    return vg.deletePaths(shape, bounding, invert);
  }
  throw new Error("Invalid scope.");
}

export function pointOnPath(shape, t) {
  if (!shape) return Point.ZERO;
  if (shape.shapes) {
    shape = new Path(vg.combinePaths(shape));
  }
  t = t % 1;
  if (t < 0) {
    t = 1 + t;
  }
  var pt = shape.point(t);
  return new Point(pt.x, pt.y);
}

export function shapeOnPath(
  shapes,
  path,
  amount,
  alignment,
  spacing,
  margin,
  baselineOffset
) {
  if (!shapes) {
    return [];
  }
  if (path === null) {
    return [];
  }

  if (alignment === "trailing") {
    shapes = shapes.slice();
    shapes.reverse();
  }

  var i,
    pos,
    p1,
    p2,
    a,
    t,
    length = path.length() - margin,
    m = margin / path.length(),
    c = 0,
    newShapes = [];

  function putOnPath(shape) {
    if (alignment === "distributed") {
      var p = length / (amount * shapes.length - 1);
      pos = (c * p) / length;
      pos = m + pos * (1 - 2 * m);
    } else {
      pos = ((c * spacing) % length) / length;
      pos = m + pos * (1 - m);

      if (alignment === "trailing") {
        pos = 1 - pos;
      }
    }

    p1 = path.point(pos);
    p2 = path.point(pos + 0.0000001);
    a = geo.angle(p1.x, p1.y, p2.x, p2.y);
    if (baselineOffset) {
      p1 = geo.coordinates(p1.x, p1.y, a - 90, baselineOffset);
    }
    t = new Transform();
    t = t.translate(p1.x, p1.y);
    t = t.rotate(a);
    newShapes.push(t.transformShape(shape));
    c += 1;
  }

  for (i = 0; i < amount; i += 1) {
    _.each(shapes, putOnPath);
  }
  return newShapes;
}

export function _x(shape) {
  if (shape.x !== undefined) {
    return shape.x;
  } else {
    return shape.bounds().x;
  }
}

export function _y(shape) {
  if (shape.y !== undefined) {
    return shape.y;
  } else {
    return shape.bounds().y;
  }
}

export function _angleToPoint(point) {
  return function (shape) {
    if (shape.x !== undefined && shape.y !== undefined) {
      return angle(shape.x, shape.y, point.x, point.y);
    } else {
      var centerPoint = shape.bounds().centerPoint();
      return angle(centerPoint.x, centerPoint.y, point.x, point.y);
    }
  };
}

export function _distanceToPoint(point) {
  return function (shape) {
    if (shape.x !== undefined && shape.y !== undefined) {
      return distance(shape.x, shape.y, point.x, point.y);
    } else {
      var centerPoint = shape.bounds().centerPoint();
      return distance(centerPoint.x, centerPoint.y, point.x, point.y);
    }
  };
}

export function shapeSort(shapes, method, origin) {
  if (!shapes) return null;
  origin = origin || Point.ZERO;

  var methods = {
    x: vg._x,
    y: vg._y,
    angle: vg._angleToPoint(origin),
    distance: vg._distanceToPoint(origin),
  };
  method = methods[method];
  if (method === undefined) {
    return shapes;
  }
  var newShapes = shapes.slice(0);
  newShapes.sort(function (a, b) {
    var _a = method(a),
      _b = method(b);
    if (_a < _b) {
      return -1;
    }
    if (_a > _b) {
      return 1;
    }
    return 0;
  });
  return newShapes;
}

export function group() {
  return new Group(flatten(arguments));
}

export function ungroup(shape) {
  if (!shape) {
    return [];
  } else if (shape.shapes) {
    var i,
      s,
      shapes = [];
    for (i = 0; i < shape.shapes.length; i += 1) {
      s = shape.shapes[i];
      if (s.commands) {
        shapes.push(s);
      } else if (s.shapes) {
        shapes = shapes.concat(vg.ungroup(s));
      }
    }
    return shapes;
  } else if (shape.commands) {
    return [shape];
  } else {
    return [];
  }
}

export function centerPoint(shape) {
  if (!shape) return Point.ZERO;
  var r = vg.bounds(shape);
  return new Point(r.x + r.width / 2, r.y + r.height / 2);
}

export function link(shape1, shape2, orientation) {
  if (!shape1 || !shape2) return null;
  var p = new Path();
  var a = shape1.bounds();
  var b = shape2.bounds();
  if (orientation === vg.HORIZONTAL) {
    var hw = (b.x - (a.x + a.width)) / 2;
    p.moveTo(a.x + a.width, a.y);
    p.curveTo(a.x + a.width + hw, a.y, b.x - hw, b.y, b.x, b.y);
    p.lineTo(b.x, b.y + b.height);
    p.curveTo(
      b.x - hw,
      b.y + b.height,
      a.x + a.width + hw,
      a.y + a.height,
      a.x + a.width,
      a.y + a.height
    );
    p.close();
  } else {
    var hh = (b.y - (a.y + a.height)) / 2;
    p.moveTo(a.x, a.y + a.height);
    p.curveTo(a.x, a.y + a.height + hh, b.x, b.y - hh, b.x, b.y);
    p.lineTo(b.x + b.width, b.y);
    p.curveTo(
      b.x + b.width,
      b.y - hh,
      a.x + a.width,
      a.y + a.height + hh,
      a.x + a.width,
      a.y + a.height
    );
    p.close();
  }
  return p;
}

var compoundMethods = {
  union: ClipperLib.ClipType.ctUnion,
  difference: ClipperLib.ClipType.ctDifference,
  intersection: ClipperLib.ClipType.ctIntersection,
  xor: ClipperLib.ClipType.ctXor,
};

export function _compoundToPoints(shape) {
  var l1 = [];
  var i, l, s, j, pt;
  for (i = 0; i < shape.length; i += 1) {
    l = [];
    s = shape[i];
    for (j = 0; j < s.length; j += 1) {
      pt = s[j];
      if (pt.type !== CLOSE) {
        l.push({ X: pt.x, Y: pt.y });
      }
    }
    l1.push(l);
  }
  return l1;
}

function cmdToPathKit(cmd) {
  if (!window.PathKit) {
    throw new Error("PathKit module not found.");
  }
  var PathKit = window.PathKit;
  if (cmd.type === MOVETO) {
    return [PathKit.MOVE_VERB, cmd.x, cmd.y];
  } else if (cmd.type === LINETO) {
    return [PathKit.LINE_VERB, cmd.x, cmd.y];
  } else if (cmd.type === CURVETO) {
    return [PathKit.CUBIC_VERB, cmd.x1, cmd.y1, cmd.x2, cmd.y2, cmd.x, cmd.y];
  } else if (cmd.type === CLOSE) {
    return [PathKit.CLOSE_VERB];
  }
}

var compoundOpsPathKit;

export function _compoundPathKit(shape1, shape2, method) {
  if (!window.PathKit) {
    throw new Error("PathKit module not found.");
  }
  var PathKit = window.PathKit;
  if (!compoundOpsPathKit) {
    compoundOpsPathKit = {
      union: PathKit.PathOp.UNION,
      difference: PathKit.PathOp.DIFFERENCE,
      intersection: PathKit.PathOp.INTERSECT,
      xor: PathKit.PathOp.XOR,
    };
  }

  var cmds1 = shape1.commands.map(cmdToPathKit);
  var cmds2 = shape2.commands.map(cmdToPathKit);
  var p1 = PathKit.FromCmds(cmds1);
  var p2 = PathKit.FromCmds(cmds2);
  p1.op(p2, compoundOpsPathKit[method]);
  var cmds = p1.toCmds();
  var path = new Path();
  cmds.forEach(function (cmd) {
    if (cmd[0] === PathKit.MOVE_VERB) {
      path.moveTo(cmd[1], cmd[2]);
    } else if (cmd[0] === PathKit.LINE_VERB) {
      path.lineTo(cmd[1], cmd[2]);
    } else if (cmd[0] === PathKit.CUBIC_VERB) {
      path.curveTo(cmd[1], cmd[2], cmd[3], cmd[4], cmd[5], cmd[6]);
    } else if (cmd[0] === PathKit.CLOSE_VERB) {
      path.closePath();
    }
  });
  p1.delete();
  p2.delete();
  return path;
}

export function compound(shape1, shape2, method) {
  if (!shape1.commands) {
    shape1 = Path.combine(shape1);
  }
  if (!shape2.commands) {
    shape2 = Path.combine(shape2);
  }

  // With curved input, try returning smooth curves instead of line segmented shapes.
  // For this to work, the Skia PathKit webassembly needs to be included into the page and the page served through http or https.
  // See https://skia.org/user/modules/pathkit

  if (
    typeof window !== "undefined" &&
    window.PathKit &&
    window.PathKit.NewPath
  ) {
    return vg._compoundPathKit(shape1, shape2, method);
  }
  var contours1 = shape1.resampleByLength(1).contours();
  var contours2 = shape2.resampleByLength(1).contours();

  var subjPaths = vg._compoundToPoints(contours1);
  var clipPaths = vg._compoundToPoints(contours2);
  var scale = 100;
  ClipperLib.JS.ScaleUpPaths(subjPaths, scale);
  ClipperLib.JS.ScaleUpPaths(clipPaths, scale);

  var cpr = new ClipperLib.Clipper();
  cpr.AddPaths(subjPaths, ClipperLib.PolyType.ptSubject, shape1.isClosed());
  cpr.AddPaths(clipPaths, ClipperLib.PolyType.ptClip, shape2.isClosed());

  var solutionPaths = new ClipperLib.Paths();
  cpr.Execute(
    compoundMethods[method],
    solutionPaths,
    ClipperLib.PolyFillType.pftNonZero,
    ClipperLib.PolyFillType.pftNonZero
  );
  solutionPaths = ClipperLib.JS.Clean(solutionPaths, 0.1 * scale);
  ClipperLib.JS.ScaleDownPaths(solutionPaths, scale);
  var path = new Path();
  var i, j, s;
  for (i = 0; i < solutionPaths.length; i += 1) {
    s = solutionPaths[i];
    for (j = 0; j < s.length; j += 1) {
      if (j === 0) {
        path.moveTo(s[j].X, s[j].Y);
      } else {
        path.lineTo(s[j].X, s[j].Y);
      }
    }
    if (s[0].X !== s[s.length - 1].X || s[0].Y !== s[s.length - 1].Y) {
      path.closePath();
    }
  }
  return path;
}

function constructPath(points, closed) {
  const segments = [];
  let d = {};
  let i = 0;
  points.forEach((pt) => {
    if (i === 0) {
      d._in = pt;
    } else if (i === 1) {
      d._pt = pt;
    } else if (i === 2) {
      d._out = pt;
    }
    i += 1;
    if (i === 3) {
      segments.push(d);
      i = 0;
      d = {};
    }
  });
  const commands = [];
  let length = segments.length;
  if (closed) {
    length += 1;
  }
  for (i = 0; i < length; i += 1) {
    let seg = segments[i % segments.length];
    if (i === 0) {
      commands.push({ cmd: "moveto", pt: seg._pt });
    } else {
      d = {
        cmd: "curveto",
        pt: seg._pt,
        ctrl1: segments[i - 1]._out,
        ctrl2: seg._in,
      };
      commands.push(d);
    }
  }
  const path = new Path();
  commands.forEach((el) => {
    if (el.cmd === "moveto") {
      path.moveTo(el.pt.x, el.pt.y);
    } else if (el.cmd === "curveto") {
      path.curveTo(
        el.ctrl1.x,
        el.ctrl1.y,
        el.ctrl2.x,
        el.ctrl2.y,
        el.pt.x,
        el.pt.y
      );
    }
  });
  return path;
}

export function roundedSegments(shape, d) {
  if (!d || d.length === 0) {
    return shape;
  }
  const points = vg.toPoints(shape);
  const newPoints = [];
  for (let i = 0; i < points.length; i += 1) {
    let pt = points[i];
    let prev;
    if (i === 0) {
      prev = points[points.length - 1];
    } else {
      prev = points[i - 1];
    }
    let next = points[(i + 1) % points.length];
    let a = degrees(Math.atan2(next.y - prev.y, next.x - prev.x));
    let c1 = coordinates(pt.x, pt.y, a, -d[i % d.length]);
    let c2 = coordinates(pt.x, pt.y, a, d[i % d.length]);
    newPoints.push(c1);
    newPoints.push(pt);
    newPoints.push(c2);
  }
  let path = constructPath(newPoints, shape.isClosed());
  path.fill = shape.fill;
  path.stroke = shape.stroke;
  path.strokeWidth = shape.strokeWidth;
  return path;
}
