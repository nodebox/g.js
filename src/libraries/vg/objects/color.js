// Color object

import { clamp } from "../../math";
import * as color from "../util/color";
import { defineAlias, defineGetter } from "../util/js";

const RGB = "RGB";
const HSB = "HSB";
const HSL = "HSL";
const HEX = "HEX";

export default class Color {
  constructor(v1, v2, v3, v4, v5) {
    var _r, _g, _b, _a, rgb, options;
    if (v1 === undefined) {
      _r = _g = _b = 0;
      _a = 1;
    } else if (Array.isArray(v1)) {
      options = v2 || {};
      _r = v1[0] !== undefined ? v1[0] : 0;
      _g = v1[1] !== undefined ? v1[1] : 0;
      _b = v1[2] !== undefined ? v1[2] : 0;
      _a = v1[3] !== undefined ? v1[3] : options.range || 1;
    } else if (v1.r !== undefined) {
      options = v2 || {};
      _r = v1.r;
      _g = v1.g;
      _b = v1.b;
      _a = v1.a !== undefined ? v1.a : options.range || 1;
    } else if (typeof v1 === "string") {
      rgb = color.hex2rgb(v1);
      _r = rgb[0];
      _g = rgb[1];
      _b = rgb[2];
      _a = 1;
    } else if (typeof v1 === "number") {
      if (arguments.length === 1) {
        // Grayscale value
        _r = _g = _b = v1;
        _a = 1;
      } else if (arguments.length === 2) {
        // Gray and alpha or options
        _r = _g = _b = v1;
        if (typeof v2 === "number") {
          _a = v2;
        } else {
          options = v2;
          _a = options.range || 1;
        }
      } else if (arguments.length === 3) {
        // RGB or gray, alpha and options
        if (typeof v3 === "number") {
          _r = v1;
          _g = v2;
          _b = v3;
          _a = 1;
        } else {
          _r = _g = _b = v1;
          _a = v2;
          options = v3;
        }
      } else if (arguments.length === 4) {
        // RGB and alpha or options
        _r = v1;
        _g = v2;
        _b = v3;
        if (typeof v4 === "number") {
          _a = v4;
        } else {
          options = v4;
          _a = options.range || 1;
        }
      } else {
        // RGBA + options
        _r = v1;
        _g = v2;
        _b = v3;
        _a = v4;
        options = v5;
      }
    }
    options = options || {};

    // The range option allows you to specify values in a different range.
    if (options.range !== undefined) {
      _r /= options.range;
      _g /= options.range;
      _b /= options.range;
      _a /= options.range;
      if (options.mode === HSB) {
        v1 /= options.range;
        v2 /= options.range;
        v3 /= options.range;
      }
    }
    // Convert HSB colors to RGB
    if (options.mode === HSB) {
      v1 = clamp(v1, 0, 1);
      v2 = clamp(v2, 0, 1);
      v3 = clamp(v3, 0, 1);
      rgb = color.hsb2rgb(v1, v2, v3);
      _r = rgb[0];
      _g = rgb[1];
      _b = rgb[2];
      // Convert HSL colors to RGB
    } else if (options.mode === HSL) {
      v1 = clamp(v1, 0, 1);
      v2 = clamp(v2, 0, 1);
      v3 = clamp(v3, 0, 1);
      rgb = color.hsl2rgb(v1, v2, v3);
      _r = rgb[0];
      _g = rgb[1];
      _b = rgb[2];
    } else if (options.mode === HEX) {
      rgb = color.hex2rgb(v1);
      _r = rgb[0];
      _g = rgb[1];
      _b = rgb[2];
      _a = 1;
    }

    this.r = clamp(_r, 0, 1);
    this.g = clamp(_g, 0, 1);
    this.b = clamp(_b, 0, 1);
    this.a = clamp(_a, 0, 1);
  }
  static clone(c) {
    if (c === null || c === undefined) {
      return null;
    } else if (typeof c === "string") {
      return c;
    } else {
      return new Color(c.r, c.g, c.b, c.a);
    }
  }
  static toCSS(c) {
    if (c === null) {
      return "none";
    } else if (c === undefined) {
      return "black";
    } else if (typeof c === "string") {
      return c;
    } else if (c instanceof Color) {
      let r255 = Math.round(c.r * 255),
        g255 = Math.round(c.g * 255),
        b255 = Math.round(c.b * 255);
      return "rgba(" + r255 + ", " + g255 + ", " + b255 + ", " + c.a + ")";
    } else if (c.r !== undefined && c.g !== undefined && c.b !== undefined) {
      let r255 = Math.round(c.r * 255),
        g255 = Math.round(c.g * 255),
        b255 = Math.round(c.b * 255);
      if (c.a === undefined) {
        return "rgb(" + r255 + ", " + g255 + ", " + b255 + ")";
      } else {
        return "rgba(" + r255 + ", " + g255 + ", " + b255 + ", " + c.a + ")";
      }
    } else {
      throw new Error("Don't know how to convert " + c + " to CSS.");
    }
  }
  static toHex(c, ignoreAlpha) {
    return Color.parse(c, ignoreAlpha).toHex();
  }
  static make() {
    var c = Object.create(Color.prototype);
    c.constructor = Color.prototype;
    Color.apply(c, arguments);
    return c;
  }
  static parse(s) {
    function startsWith(s, value) {
      if (!s || !value) {
        return false;
      }
      s = String(s);
      return s.indexOf(value) === 0;
    }

    var m;
    if (s === undefined || s === null) {
      return new Color(0, 0, 0, 0);
    } else if (s instanceof Color) {
      return s;
    } else if (color.namedColors[s]) {
      return Color.make.apply(null, color.namedColors[s]);
    } else if (s[0] === "#") {
      return new Color(s, 0, 0, 0, { mode: HEX });
    } else if (startsWith(s, "rgba")) {
      m = s.match(
        /^rgba\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+|\d+.\d+)\s*\)$/i
      );
      if (m) {
        return new Color(
          parseInt(m[1]) / 255,
          parseInt(m[2]) / 255,
          parseInt(m[3]) / 255,
          parseFloat(m[4])
        );
      } else {
        m = s.match(
          /^rgba\s*\(\s*(\d+|\d+.\d+)%\s*,\s*(\d+|\d+.\d+)%\s*,\s*(\d+|\d+.\d+)%\s*,\s*(\d+|\d+.\d+)\s*\)$/i
        );
        if (m) {
          return new Color(
            parseFloat(m[1]) / 100,
            parseFloat(m[2]) / 100,
            parseFloat(m[3]) / 100,
            parseFloat(m[4])
          );
        }
      }
      return new Color(0, 0, 0, 0);
    } else if (startsWith(s, "rgb")) {
      m = s.match(/^rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/i);
      if (m) {
        return new Color(
          parseInt(m[1]) / 255,
          parseInt(m[2]) / 255,
          parseInt(m[3]) / 255
        );
      } else {
        m = s.match(
          /^rgb\s*\(\s*(\d+|\d+.\d+)%\s*,\s*(\d+|\d+.\d+)%\s*,\s*(\d+|\d+.\d+)%\s*\)$/i
        );
        if (m) {
          return new Color(
            parseFloat(m[1]) / 100,
            parseFloat(m[2]) / 100,
            parseFloat(m[3]) / 100
          );
        }
      }
      return new Color(0, 0, 0, 0);
    } else if (startsWith(s, "hsla")) {
      m = s.match(
        /^hsla\s*\(\s*(\d+|\d+.\d+)\s*,\s*(\d+|\d+.\d+)%\s*,\s*(\d+|\d+.\d+)%\s*,\s*(\d+|\d+.\d+)\s*\)$/i
      );
      if (m) {
        return new Color(
          parseFloat(m[1]) / 360,
          parseFloat(m[2]) / 100,
          parseFloat(m[3]) / 100,
          parseFloat(m[4])
        );
      }
      return new Color(0, 0, 0, 0);
    } else if (startsWith(s, "hsl")) {
      m = s.match(
        /^hsl\s*\(\s*(\d+|\d+.\d+)\s*,\s*(\d+|\d+.\d+)%\s*,\s*(\d+|\d+.\d+)%\s*\)$/i
      );
      if (m) {
        return new Color(
          parseFloat(m[1]) / 360,
          parseFloat(m[2]) / 100,
          parseFloat(m[3]) / 100
        );
      }
      return new Color(0, 0, 0, 0);
    } else if (s === "none" || s === "null" || startsWith(s, "url(")) {
      return new Color(0, 0, 0, 0);
    } else {
      throw new Error("Color " + s + "can not be parsed");
    }
  }
  static gray(gray, alpha, range) {
    range = Math.max(range, 1);
    return new Color(gray / range, gray / range, gray / range, alpha / range);
  }
  static rgb(red, green, blue, alpha, range) {
    range = Math.max(range, 1);
    return new Color(red / range, green / range, blue / range, alpha / range);
  }
  static hsb(hue, saturation, brightness, alpha, range) {
    range = Math.max(range, 1);
    return new Color(
      hue / range,
      saturation / range,
      brightness / range,
      alpha / range,
      { mode: HSB }
    );
  }
  static hsl(hue, saturation, lightness, alpha, range) {
    range = Math.max(range, 1);
    return new Color(
      hue / range,
      saturation / range,
      lightness / range,
      alpha / range,
      { mode: HSL }
    );
  }
  desaturate(options) {
    if (this.r === this.g && this.g === this.b) {
      return this;
    }
    var rCoeff, gCoeff, bCoeff;
    if (
      options === undefined ||
      !options.method ||
      options.method === "ITU-R BT.601"
    ) {
      rCoeff = 0.3;
      gCoeff = 0.59;
      bCoeff = 0.11;
    } else if (options.method === "ITU-R BT.709") {
      rCoeff = 0.2125;
      gCoeff = 0.7154;
      bCoeff = 0.0721;
    }
    var gray = this.r * rCoeff + this.g * gCoeff + this.b * bCoeff;
    return new Color(gray, gray, gray, this.a);
  }
  invert() {
    return new Color(1 - this.r, 1 - this.g, 1 - this.b, this.a);
  }
}

Color.BLACK = new Color(0);
Color.WHITE = new Color(1);

defineAlias(Color, "r", "red");
defineAlias(Color, "g", "green");
defineAlias(Color, "b", "blue");
defineAlias(Color, "a", "alpha");

// The hue of the color, in HSL color mode. (Although hue is the same in HSL and HSB).
defineGetter(Color, "h", function () {
  return color.rgb2hsl(this.r, this.g, this.b)[0];
});

// The saturation of the color, in HSL color mode. (Saturation is different in HSL and HSB).
defineGetter(Color, "s", function () {
  return color.rgb2hsl(this.r, this.g, this.b)[1];
});

// The lightness of the color, in HSL color mode. (Lightness in HSL is different from brightness in HSB).
defineGetter(Color, "l", function () {
  return color.rgb2hsl(this.r, this.g, this.b)[2];
});

defineAlias(Color, "h", "hue");
defineAlias(Color, "s", "saturation");
defineAlias(Color, "l", "lightness");

defineGetter(Color, "rgb", function () {
  return [this.r, this.g, this.b];
});

defineGetter(Color, "rgba", function () {
  return [this.r, this.g, this.b, this.a];
});

defineGetter(Color, "hsb", function () {
  return color.rgb2hsb(this.r, this.g, this.b);
});

defineGetter(Color, "hsba", function () {
  return color.rgb2hsb(this.r, this.g, this.b).concat([this.a]);
});

defineGetter(Color, "hsl", function () {
  return color.rgb2hsl(this.r, this.g, this.b);
});

defineGetter(Color, "hsla", function () {
  return color.rgb2hsl(this.r, this.g, this.b).concat([this.a]);
});

Color.prototype.toCSS = function () {
  return Color.toCSS(this);
};

Color.prototype.toHex = function (ignoreAlpha) {
  if (ignoreAlpha || this.a >= 1) {
    return color.rgb2hex(this.r, this.g, this.b);
  } else {
    return color.rgba2hex(this.r, this.g, this.b, this.a);
  }
};
