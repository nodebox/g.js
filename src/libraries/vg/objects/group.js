// Shape group object

import Path from "../objects/path";
import Rect from "../objects/rect";
import Color from "../objects/color";

export default class Group {
  constructor(shapes) {
    if (!shapes) {
      this.shapes = [];
    } else if (shapes.shapes || shapes.commands) {
      this.shapes = [shapes];
    } else if (shapes) {
      this.shapes = shapes;
    }
  }
  add(shape) {
    this.shapes.push(shape);
  }
  clone() {
    var newShapes = [],
      n = this.shapes.length,
      i;
    newShapes.length = n;
    for (i = 0; i < n; i += 1) {
      newShapes[i] = this.shapes[i].clone();
    }
    return new Group(newShapes);
  }
  colorize(options) {
    var args = arguments;
    if (typeof options !== "object" || options instanceof Color) {
      options = {};
      if (args[0] !== undefined) {
        options.fill = args[0];
      }
      if (args[1] !== undefined) {
        options.stroke = args[1];
      }
      if (args[2] !== undefined) {
        options.strokeWidth = args[2];
      }
    }
    var shapes = [];
    shapes.length = this.shapes.length;
    for (var i = 0; i < this.shapes.length; i += 1) {
      shapes[i] = this.shapes[i].colorize(options);
    }
    return new Group(shapes);
  }
  desaturate(options) {
    var shapes = [];
    shapes.length = this.shapes.length;
    for (var i = 0; i < this.shapes.length; i += 1) {
      shapes[i] = this.shapes[i].desaturate(options);
    }
    return new Group(shapes);
  }
  invert() {
    var shapes = [];
    shapes.length = this.shapes.length;
    for (var i = 0; i < this.shapes.length; i += 1) {
      shapes[i] = this.shapes[i].invert();
    }
    return new Group(shapes);
  }
  bounds() {
    if (this.shapes.length === 0) {
      return new Rect(0, 0, 0, 0);
    }
    var i,
      r,
      shape,
      shapes = this.shapes;
    for (i = 0; i < shapes.length; i += 1) {
      shape = shapes[i];
      if (r === undefined) {
        r = shape.bounds();
      }
      if (
        (shape.shapes && shape.shapes.length !== 0) ||
        (shape.commands && shape.commands.length !== 0)
      ) {
        r = r.unite(shape.bounds());
      }
    }
    return r !== undefined ? r : new Rect(0, 0, 0, 0);
  }
  // Returns true when point (x,y) falls within the contours of the group.
  contains(x, y, precision) {
    if (precision === undefined) {
      precision = 100;
    }
    var i,
      shapes = this.shapes;
    for (i = 0; i < shapes.length; i += 1) {
      if (shapes[i].contains(x, y, precision)) {
        return true;
      }
    }
    return false;
  }
  length(precision) {
    if (precision === undefined) {
      precision = 10;
    }
    var sum = 0;
    var shapes = this.shapes;
    for (var i = 0; i < shapes.length; i += 1) {
      sum += shapes[i].length(precision);
    }
    return sum;
  }
  resampleByAmount(points, perContour) {
    var path;
    if (!perContour) {
      path = new Path.combine(this);
      return path.resampleByAmount(points, perContour);
    }
    var shapes = [];
    shapes.length = this.shapes.length;
    for (var i = 0; i < this.shapes.length; i += 1) {
      shapes[i] = this.shapes[i].resampleByAmount(points, perContour);
    }
    return new Group(shapes);
  }
  resampleByLength(length) {
    var shapes = [];
    shapes.length = this.shapes.length;
    for (var i = 0; i < this.shapes.length; i += 1) {
      shapes[i] = this.shapes[i].resampleByLength(length);
    }
    return new Group(shapes);
  }
  toSVG() {
    var l = [];
    l.length = this.shapes.length;
    for (var i = 0; i < this.shapes.length; i += 1) {
      l[i] = this.shapes[i].toSVG();
    }
    return "<g>" + l.join("") + "</g>";
  }
  // Draw the group to a 2D context.
  draw(ctx) {
    var i,
      shapes = this.shapes,
      nShapes = shapes.length;
    for (i = 0; i < nShapes; i += 1) {
      shapes[i].draw(ctx);
    }
  }
}
