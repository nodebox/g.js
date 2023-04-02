// Bézier Math
// Thanks to Prof. F. De Smedt at the Vrije Universiteit Brussel, 2006.

import { sum } from "../util/math";
import Point from "../objects/point";
import Rect from "../objects/rect";

export const MOVETO = "M";
export const LINETO = "L";
export const QUADTO = "Q";
export const CURVETO = "C";
export const CLOSE = "Z";

// BEZIER MATH:

// Returns coordinates for the point at t (0.0-1.0) on the line.
export function linePoint(t, x0, y0, x1, y1) {
  var x = x0 + t * (x1 - x0),
    y = y0 + t * (y1 - y0);
  return { type: LINETO, x: x, y: y };
}

// Returns the length of the line.
export function lineLength(x0, y0, x1, y1) {
  var a = Math.pow(Math.abs(x0 - x1), 2),
    b = Math.pow(Math.abs(y0 - y1), 2);
  return Math.sqrt(a + b);
}

// Returns coordinates for the point at t (0.0-1.0) on the curve
// (de Casteljau interpolation algorithm).
export function curvePoint(t, x0, y0, x1, y1, x2, y2, x3, y3) {
  var dt = 1 - t,
    x01 = x0 * dt + x1 * t,
    y01 = y0 * dt + y1 * t,
    x12 = x1 * dt + x2 * t,
    y12 = y1 * dt + y2 * t,
    x23 = x2 * dt + x3 * t,
    y23 = y2 * dt + y3 * t,
    h1x = x01 * dt + x12 * t,
    h1y = y01 * dt + y12 * t,
    h2x = x12 * dt + x23 * t,
    h2y = y12 * dt + y23 * t,
    x = h1x * dt + h2x * t,
    y = h1y * dt + h2y * t;
  return { type: CURVETO, x1: h1x, y1: h1y, x2: h2x, y2: h2y, x: x, y: y };
}

// Returns the length of the curve.
// Integrates the estimated length of the cubic bezier spline defined by x0, y0, ... x3, y3,
// by adding up the length of n linear lines along the curve.
export function curveLength(x0, y0, x1, y1, x2, y2, x3, y3, n) {
  if (n === undefined) {
    n = 20;
  }
  var i,
    t,
    cmd,
    length = 0,
    xi = x0,
    yi = y0;
  for (i = 0; i < n; i += 1) {
    t = (i + 1) / n;
    cmd = curvePoint(t, x0, y0, x1, y1, x2, y2, x3, y3);
    length += Math.sqrt(
      Math.pow(Math.abs(xi - cmd.x), 2) + Math.pow(Math.abs(yi - cmd.y), 2)
    );
    xi = cmd.x;
    yi = cmd.y;
  }
  return length;
}

// BEZIER PATH LENGTH:

// Returns an array with the length of each command in the path.
// With relative=true, the total length of all commands is 1.0.
export function segmentLengths(commands, relative, n) {
  relative = relative !== undefined ? relative : false;
  if (n === undefined) {
    n = 20;
  }
  var i, cmd, type, closeX, closeY, x0, y0, s, lengths, ll;
  lengths = [];
  for (i = 0; i < commands.length; i += 1) {
    cmd = commands[i];
    type = cmd.type;

    if (i === 0) {
      closeX = cmd.x;
      closeY = cmd.y;
    } else if (type === MOVETO) {
      closeX = cmd.x;
      closeY = cmd.y;
      lengths.push(0.0);
    } else if (type === CLOSE) {
      lengths.push(lineLength(x0, y0, closeX, closeY));
    } else if (type === LINETO) {
      lengths.push(lineLength(x0, y0, cmd.x, cmd.y));
    } else if (type === CURVETO) {
      lengths.push(
        curveLength(x0, y0, cmd.x1, cmd.y1, cmd.x2, cmd.y2, cmd.x, cmd.y, n)
      );
    }
    if (type !== CLOSE) {
      x0 = cmd.x;
      y0 = cmd.y;
    }
  }
  if (relative === true) {
    s = sum(lengths);
    ll = [];
    ll.length = lengths.length;
    if (s > 0) {
      for (i = 0; i < lengths.length; i += 1) {
        ll[i] = lengths[i] / s;
      }
    } else {
      for (i = 0; i < lengths.length; i += 1) {
        ll[i] = 0.0;
      }
    }
    return ll;
  }
  return lengths;
}

// Returns the approximate length of the path.
// Calculates the length of each curve in the path using n linear samples.
export function length(path, n) {
  n = n || 20;
  return sum(segmentLengths(path.commands, false, n));
}

// BEZIER PATH POINT:

// For a given relative t on the path (0.0-1.0), returns an array [index, t, PathElement],
// with the index of the PathElement before t, the absolute position on this segment,
// the last MOVETO or any subsequent CLOSE commands after i.
// Note: during iteration, supplying segment lengths yourself is 30x faster.
export function _locate(path, t, segmentLengths) {
  var i, cmd, closeTo;
  if (segmentLengths === undefined) {
    segmentLengths = segmentLengths(path.commands, true);
  }
  for (i = 0; i < path.commands.length; i += 1) {
    cmd = path.commands[i];
    if (i === 0 || cmd.type === MOVETO) {
      closeTo = new Point(cmd.x, cmd.y);
    }
    if (t <= segmentLengths[i] || i === segmentLengths.length - 1) {
      break;
    }
    t -= segmentLengths[i];
  }
  if (segmentLengths[i] !== 0) {
    t /= segmentLengths[i];
  }
  if (i === segmentLengths.length - 1 && segmentLengths[i] === 0) {
    i -= 1;
  }
  return [i, t, closeTo];
}

// Returns the DynamicPathElement at time t on the path.
// Note: in PathElement, ctrl1 is how the curve started, and ctrl2 how it arrives in this point.
// Here, ctrl1 is how the curve arrives, and ctrl2 how it continues to the next point.
export function point(path, t, segmentLengths) {
  var loc, i, closeTo, x0, y0, cmd;
  loc = _locate(path, t, segmentLengths);
  i = loc[0];
  t = loc[1];
  closeTo = loc[2];
  x0 = path.commands[i].x;
  y0 = path.commands[i].y;
  cmd = path.commands[i + 1];
  if (cmd.type === LINETO || cmd.type === CLOSE) {
    cmd =
      cmd.type === CLOSE
        ? linePoint(t, x0, y0, closeTo.x, closeTo.y)
        : linePoint(t, x0, y0, cmd.x, cmd.y);
  } else if (cmd.type === CURVETO) {
    cmd = curvePoint(t, x0, y0, cmd.x1, cmd.y1, cmd.x2, cmd.y2, cmd.x, cmd.y);
  }
  return cmd;
}

function fuzzyCompare(p1, p2) {
  return (
    Math.abs(p1 - p2) <= 0.000000000001 * Math.min(Math.abs(p1), Math.abs(p2))
  );
}

function coefficients(t) {
  var mT, a, b, c, d;
  mT = 1 - t;
  b = mT * mT;
  c = t * t;
  d = c * t;
  a = b * mT;
  b *= 3.0 * t;
  c *= 3.0 * mT;
  return [a, b, c, d];
}

function pointAt(x1, y1, x2, y2, x3, y3, x4, y4, t) {
  var a, b, c, d, coeff;
  coeff = coefficients(t);
  a = coeff[0];
  b = coeff[1];
  c = coeff[2];
  d = coeff[3];
  return {
    x: a * x1 + b * x2 + c * x3 + d * x4,
    y: a * y1 + b * y2 + c * y3 + d * y4,
  };
}

export function extrema(x1, y1, x2, y2, x3, y3, x4, y4) {
  var minX, maxX, minY, maxY, ax, bx, cx, ay, by, cy, temp, rcp, tx, ty;

  function bezierCheck(t) {
    if (t >= 0 && t <= 1) {
      var p = pointAt(x1, y1, x2, y2, x3, y3, x4, y4, t);
      if (p.x < minX) {
        minX = p.x;
      } else if (p.x > maxX) {
        maxX = p.x;
      }
      if (p.y < minY) {
        minY = p.y;
      } else if (p.y > maxY) {
        maxY = p.y;
      }
    }
  }

  if (x1 < x4) {
    minX = x1;
    maxX = x4;
  } else {
    minX = x4;
    maxX = x1;
  }
  if (y1 < y4) {
    minY = y1;
    maxY = y4;
  } else {
    minY = y4;
    maxY = y1;
  }

  ax = 3 * (-x1 + 3 * x2 - 3 * x3 + x4);
  bx = 6 * (x1 - 2 * x2 + x3);
  cx = 3 * (-x1 + x2);

  if (fuzzyCompare(ax + 1, 1)) {
    if (!fuzzyCompare(bx + 1, 1)) {
      bezierCheck(-cx / bx);
    }
  } else {
    tx = bx * bx - 4 * ax * cx;
    if (tx >= 0) {
      temp = Math.sqrt(tx);
      rcp = 1 / (2 * ax);
      bezierCheck((-bx + temp) * rcp);
      bezierCheck((-bx - temp) * rcp);
    }
  }

  ay = 3 * (-y1 + 3 * y2 - 3 * y3 + y4);
  by = 6 * (y1 - 2 * y2 + y3);
  cy = 3 * (-y1 + y2);

  if (fuzzyCompare(ay + 1, 1)) {
    if (!fuzzyCompare(by + 1, 1)) {
      bezierCheck(-cy / by);
    }
  } else {
    ty = by * by - 4 * ay * cy;
    if (ty > 0) {
      temp = Math.sqrt(ty);
      rcp = 1 / (2 * ay);
      bezierCheck((-by + temp) * rcp);
      bezierCheck((-by - temp) * rcp);
    }
  }

  return new Rect(minX, minY, maxX - minX, maxY - minY);
}
