// 2-dimensional point object.

export default class Point {
  constructor(x, y) {
    this.x = x !== undefined ? x : 0;
    this.y = y !== undefined ? y : 0;
  }
  static read(x, y) {
    if (arguments.length === 2) {
      return new Point(x, y);
    }
    var arg = x;
    if (arg instanceof Point) {
      return arg;
    } else if (typeof arg === "number") {
      return new Point(arg, arg);
    } else if (Array.isArray(arg)) {
      if (arg.length === 0) {
        return Point.ZERO;
      }
      x = arg[0];
      y = arg.length > 1 ? arg[1] : x;
      return new Point(x, y);
    } else if (arg.x !== undefined && arg.y !== undefined) {
      return new Point(arg.x, arg.y);
    } else {
      return Point.ZERO;
    }
  }
  clone() {
    return new Point(this.x, this.y);
  }
  add(v) {
    return new Point(this.x + v.x, this.y + v.y);
  }
  sub(v) {
    return new Point(this.x - v.x, this.y - v.y);
  }
  divide(n) {
    return new Point(this.x / n, this.y / n);
  }
  multiply(n) {
    return new Point(this.x * n, this.y * n);
  }
  magnitude() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }
  magnitudeSquared() {
    return this.x * this.x + this.y * this.y;
  }
  heading() {
    return Math.atan2(this.y, this.x);
  }
  distanceTo(v) {
    var dx = this.x - v.x,
      dy = this.y - v.y;
    return Math.sqrt(dx * dx + dy * dy);
  }
  normalize() {
    var m = this.magnitude();
    if (m !== 0) {
      return this.divide(m);
    } else {
      return Point.ZERO;
    }
  }
  limit(speed) {
    if (this.magnitudeSquared() > speed * speed) {
      return this.normalize().multiply(speed);
    }
    return this;
  }
  translate(tx, ty) {
    return new Point(this.x + tx, this.y + ty);
  }
  scale(sx, sy) {
    sy = sy !== undefined ? sy : sx;
    return new Point(this.x * sx, this.y * sy);
  }
  toString() {
    return "[" + this.x + ", " + this.y + "]";
  }
}

Object.defineProperty(Point.prototype, "xy", {
  get: function () {
    return [this.x, this.y];
  },
});

Point.ZERO = new Point(0, 0);
Point.prototype.subtract = Point.prototype.sub;
