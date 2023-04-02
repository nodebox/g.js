// Mixin for Path and Group

import Point from "./point";
import Transform from "./transform";

const Transformable = {
  translate: function (position) {
    if (!position) {
      position = Point.ZERO;
    }
    const t = new Transform().translate(position.x, position.y);
    return t.transformShape(this);
  },

  scale: function (scale, origin) {
    if (!origin) {
      origin = Point.ZERO;
    }
    let sx, sy;
    if (typeof scale === "number") {
      sx = scale;
      sy = scale;
    } else {
      sx = scale.x;
      sy = scale.y;
    }
    let t = new Transform();
    t = t.translate(origin.x, origin.y);
    t = t.scale(sx, sy);
    t = t.translate(-origin.x, -origin.y);
    return t.transformShape(this);
  },

  rotate: function (angle, origin) {
    if (!origin) {
      origin = Point.ZERO;
    }
    let t = new Transform();
    t = t.translate(origin.x, origin.y);
    t = t.rotate(angle);
    t = t.translate(-origin.x, -origin.y);
    return t.transformShape(this);
  },

  skew: function (skew, origin) {
    if (!origin) {
      origin = Point.ZERO;
    }
    let t = new Transform();
    t = t.translate(origin.x, origin.y);
    t = t.skew(skew.x, skew.y);
    t = t.translate(-origin.x, -origin.y);
    return t.transformShape(this);
  },
};

export default Transformable;
