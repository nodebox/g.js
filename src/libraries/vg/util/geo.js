// Geometry

import { radians, degrees } from "./math";
import Point from "../objects/point";

// Returns the angle between two points.
export function angle(x0, y0, x1, y1) {
  return degrees(Math.atan2(y1 - y0, x1 - x0));
}

// Returns the distance between two points.
export function distance(x0, y0, x1, y1) {
  return Math.sqrt(Math.pow(x1 - x0, 2) + Math.pow(y1 - y0, 2));
}

// Returns the location of a point by rotating around origin (x0,y0).
export function coordinates(x0, y0, angle, distance) {
  var x = x0 + Math.cos(radians(angle)) * distance,
    y = y0 + Math.sin(radians(angle)) * distance;
  return new Point(x, y);
}

// Determines if the given point is within the polygon, given as a list of points.

// This function uses a ray casting algorithm to determine how many times
// a horizontal ray starting from the point intersects with the sides of the polygon.
// If it is an even number of times, the point is outside, if odd, inside.
// The algorithm does not always report correctly when the point is very close to the boundary.
// The polygon is passed as an array of Points.
//
// Based on: W. Randolph Franklin, 1970, http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html
export function pointInPolygon(points, x, y) {
  var i,
    j,
    x0,
    y0,
    x1,
    y1,
    odd = false,
    n = points.length;

  for (i = 0; i < n; i += 1) {
    j = i < n - 1 ? i + 1 : 0;
    x0 = points[i].x;
    y0 = points[i].y;
    x1 = points[j].x;
    y1 = points[j].y;
    if ((y0 < y && y1 >= y) || (y1 < y && y0 >= y)) {
      if (x0 + ((y - y0) / (y1 - y0)) * (x1 - x0) < x) {
        odd = !odd;
      }
    }
  }
  return odd;
}
