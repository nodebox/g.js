// Rectangle object

import Point from "./point";

export default class Rect {
  constructor(x, y, width, height) {
    this.x = x !== undefined ? x : 0;
    this.y = y !== undefined ? y : 0;
    this.width = width !== undefined ? width : 0;
    this.height = height !== undefined ? height : 0;
  }
  // Returns a new rectangle where width and height are guaranteed to be positive values.
  normalize() {
    var x = this.x,
      y = this.y,
      width = this.width,
      height = this.height;

    if (width < 0) {
      x += width;
      width = -width;
    }

    if (height < 0) {
      y += height;
      height = -height;
    }
    return new Rect(x, y, width, height);
  }
  containsPoint(x, y) {
    if (arguments.length === 1) {
      y = x.y;
      x = x.x;
    }
    return (
      x >= this.x &&
      x <= this.x + this.width &&
      y >= this.y &&
      y <= this.y + this.height
    );
  }
  containsRect(r) {
    return (
      r.x >= this.x &&
      r.x + r.width <= this.x + this.width &&
      r.y >= this.y &&
      r.y + r.height <= this.y + this.height
    );
  }
  grow(dx, dy) {
    var x = this.x - dx,
      y = this.y - dy,
      width = this.width + dx * 2,
      height = this.height + dy * 2;
    return new Rect(x, y, width, height);
  }
  unite(r) {
    var x = Math.min(this.x, r.x),
      y = Math.min(this.y, r.y),
      width = Math.max(this.x + this.width, r.x + r.width) - x,
      height = Math.max(this.y + this.height, r.y + r.height) - y;
    return new Rect(x, y, width, height);
  }
  addPoint(x, y) {
    var dx,
      dy,
      _x = this.x,
      _y = this.y,
      width = this.width,
      height = this.height;

    if (x < this.x) {
      dx = this.x - x;
      _x = x;
      width += dx;
    } else if (x > this.x + this.width) {
      dx = x - (this.x + this.width);
      width += dx;
    }
    if (y < this.y) {
      dy = this.y - y;
      _y = y;
      height += dy;
    } else if (y > this.y + this.height) {
      dy = y - (this.y + this.height);
      height += dy;
    }
    return new Rect(_x, _y, width, height);
  }
  centerPoint() {
    return new Point(this.x + this.width / 2, this.y + this.height / 2);
  }
}

Object.defineProperty(Rect.prototype, "xywh", {
  get: function () {
    return [this.x, this.y, this.width, this.height];
  },
});
