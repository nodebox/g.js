/*!
 * Image processing based on Pixastic library:
 *
 * Pixastic - JavaScript Image Processing
 * http://pixastic.com/
 * Copyright 2012, Jacob Seidelin
 *
 * Dual licensed under the MPL 1.1 or GPLv3 licenses.
 * http://pixastic.com/license-mpl.txt
 * http://pixastic.com/license-gpl-3.0.txt
 *
 */

import stackblur from "stackblur";
import { radians, distance, transform, clamp } from "./util.mjs";

var LUMINOSITY_ITU_R_BT601 = "ITU-R BT.601";
var LUMINOSITY_ITU_R_BT709 = "ITU-R BT.709";

function defaultOptions(options, defaults) {
  if (!options) {
    return defaults;
  }
  var opt,
    o = {};
  for (opt in defaults) {
    if (defaults.hasOwnProperty(opt)) {
      if (typeof options[opt] === "undefined") {
        o[opt] = defaults[opt];
      } else {
        o[opt] = options[opt];
      }
    }
  }
  return o;
}

function smoothstep(a, b, x) {
  /* Returns a smooth transition between 0.0 and 1.0 using Hermite interpolation (cubic spline),
   * where x is a number between a and b. The return value will ease (slow down) as x nears a or b.
   * For x smaller than a, returns 0.0. For x bigger than b, returns 1.0.
   */
  if (x < a) {
    return 0.0;
  }
  if (x >= b) {
    return 1.0;
  }
  x = (x - a) / (b - a);
  return x * x * (3 - 2 * x);
}

function noise() {
  return Math.random() * 0.5 + 0.5;
}

function colorDistance(scale, dest, src) {
  return clamp(scale * dest + (1 - scale) * src, 0, 255);
}

function convolve3x3(
  inData,
  outData,
  width,
  height,
  kernel,
  alpha,
  invert,
  mono
) {
  var x,
    y,
    n = width * height * 4,
    idx,
    r,
    g,
    b,
    a,
    pyc,
    pyp,
    pyn,
    pxc,
    pxp,
    pxn,
    k00 = kernel[0][0],
    k01 = kernel[0][1],
    k02 = kernel[0][2],
    k10 = kernel[1][0],
    k11 = kernel[1][1],
    k12 = kernel[1][2],
    k20 = kernel[2][0],
    k21 = kernel[2][1],
    k22 = kernel[2][2],
    p00,
    p01,
    p02,
    p10,
    p11,
    p12,
    p20,
    p21,
    p22;

  for (y = 0; y < height; y += 1) {
    pyc = y * width * 4;
    pyp = pyc - width * 4;
    pyn = pyc + width * 4;

    if (y < 1) {
      pyp = pyc;
    }
    if (y >= width - 1) {
      pyn = pyc;
    }

    for (x = 0; x < width; x += 1) {
      idx = (y * width + x) * 4;

      pxc = x * 4;
      pxp = pxc - 4;
      pxn = pxc + 4;

      if (x < 1) {
        pxp = pxc;
      }
      if (x >= width - 1) {
        pxn = pxc;
      }

      p00 = pyp + pxp;
      p01 = pyp + pxc;
      p02 = pyp + pxn;
      p10 = pyc + pxp;
      p11 = pyc + pxc;
      p12 = pyc + pxn;
      p20 = pyn + pxp;
      p21 = pyn + pxc;
      p22 = pyn + pxn;

      r =
        inData[p00] * k00 +
        inData[p01] * k01 +
        inData[p02] * k02 +
        inData[p10] * k10 +
        inData[p11] * k11 +
        inData[p12] * k12 +
        inData[p20] * k20 +
        inData[p21] * k21 +
        inData[p22] * k22;

      g =
        inData[p00 + 1] * k00 +
        inData[p01 + 1] * k01 +
        inData[p02 + 1] * k02 +
        inData[p10 + 1] * k10 +
        inData[p11 + 1] * k11 +
        inData[p12 + 1] * k12 +
        inData[p20 + 1] * k20 +
        inData[p21 + 1] * k21 +
        inData[p22 + 1] * k22;

      b =
        inData[p00 + 2] * k00 +
        inData[p01 + 2] * k01 +
        inData[p02 + 2] * k02 +
        inData[p10 + 2] * k10 +
        inData[p11 + 2] * k11 +
        inData[p12 + 2] * k12 +
        inData[p20 + 2] * k20 +
        inData[p21 + 2] * k21 +
        inData[p22 + 2] * k22;

      if (alpha) {
        a =
          inData[p00 + 3] * k00 +
          inData[p01 + 3] * k01 +
          inData[p02 + 3] * k02 +
          inData[p10 + 3] * k10 +
          inData[p11 + 3] * k11 +
          inData[p12 + 3] * k12 +
          inData[p20 + 3] * k20 +
          inData[p21 + 3] * k21 +
          inData[p22 + 3] * k22;
      } else {
        a = inData[idx + 3];
      }

      if (mono) {
        r = g = b = (r + g + b) / 3;
      }
      if (invert) {
        r = 255 - r;
        g = 255 - g;
        b = 255 - b;
      }

      outData[idx] = r;
      outData[idx + 1] = g;
      outData[idx + 2] = b;
      outData[idx + 3] = a;
    }
  }
}

function convolve5x5(
  inData,
  outData,
  width,
  height,
  kernel,
  alpha,
  invert,
  mono
) {
  var x,
    y,
    n = width * height * 4,
    idx,
    r,
    g,
    b,
    a,
    pyc,
    pyp,
    pyn,
    pypp,
    pynn,
    pxc,
    pxp,
    pxn,
    pxpp,
    pxnn,
    k00 = kernel[0][0],
    k01 = kernel[0][1],
    k02 = kernel[0][2],
    k03 = kernel[0][3],
    k04 = kernel[0][4],
    k10 = kernel[1][0],
    k11 = kernel[1][1],
    k12 = kernel[1][2],
    k13 = kernel[1][3],
    k14 = kernel[1][4],
    k20 = kernel[2][0],
    k21 = kernel[2][1],
    k22 = kernel[2][2],
    k23 = kernel[2][3],
    k24 = kernel[2][4],
    k30 = kernel[3][0],
    k31 = kernel[3][1],
    k32 = kernel[3][2],
    k33 = kernel[3][3],
    k34 = kernel[3][4],
    k40 = kernel[4][0],
    k41 = kernel[4][1],
    k42 = kernel[4][2],
    k43 = kernel[4][3],
    k44 = kernel[4][4],
    p00,
    p01,
    p02,
    p03,
    p04,
    p10,
    p11,
    p12,
    p13,
    p14,
    p20,
    p21,
    p22,
    p23,
    p24,
    p30,
    p31,
    p32,
    p33,
    p34,
    p40,
    p41,
    p42,
    p43,
    p44;

  for (y = 0; y < height; y += 1) {
    pyc = y * width * 4;
    pyp = pyc - width * 4;
    pypp = pyc - width * 4 * 2;
    pyn = pyc + width * 4;
    pynn = pyc + width * 4 * 2;

    if (y < 1) {
      pyp = pyc;
    }
    if (y >= width - 1) {
      pyn = pyc;
    }
    if (y < 2) {
      pypp = pyp;
    }
    if (y >= width - 2) {
      pynn = pyn;
    }

    for (x = 0; x < width; x += 1) {
      idx = (y * width + x) * 4;

      pxc = x * 4;
      pxp = pxc - 4;
      pxn = pxc + 4;
      pxpp = pxc - 8;
      pxnn = pxc + 8;

      if (x < 1) {
        pxp = pxc;
      }
      if (x >= width - 1) {
        pxn = pxc;
      }
      if (x < 2) {
        pxpp = pxp;
      }
      if (x >= width - 2) {
        pxnn = pxn;
      }

      p00 = pypp + pxpp;
      p01 = pypp + pxp;
      p02 = pypp + pxc;
      p03 = pypp + pxn;
      p04 = pypp + pxnn;
      p10 = pyp + pxpp;
      p11 = pyp + pxp;
      p12 = pyp + pxc;
      p13 = pyp + pxn;
      p14 = pyp + pxnn;
      p20 = pyc + pxpp;
      p21 = pyc + pxp;
      p22 = pyc + pxc;
      p23 = pyc + pxn;
      p24 = pyc + pxnn;
      p30 = pyn + pxpp;
      p31 = pyn + pxp;
      p32 = pyn + pxc;
      p33 = pyn + pxn;
      p34 = pyn + pxnn;
      p40 = pynn + pxpp;
      p41 = pynn + pxp;
      p42 = pynn + pxc;
      p43 = pynn + pxn;
      p44 = pynn + pxnn;

      r =
        inData[p00] * k00 +
        inData[p01] * k01 +
        inData[p02] * k02 +
        inData[p03] * k04 +
        inData[p02] * k04 +
        inData[p10] * k10 +
        inData[p11] * k11 +
        inData[p12] * k12 +
        inData[p13] * k14 +
        inData[p12] * k14 +
        inData[p20] * k20 +
        inData[p21] * k21 +
        inData[p22] * k22 +
        inData[p23] * k24 +
        inData[p22] * k24 +
        inData[p30] * k30 +
        inData[p31] * k31 +
        inData[p32] * k32 +
        inData[p33] * k34 +
        inData[p32] * k34 +
        inData[p40] * k40 +
        inData[p41] * k41 +
        inData[p42] * k42 +
        inData[p43] * k44 +
        inData[p42] * k44;

      g =
        inData[p00 + 1] * k00 +
        inData[p01 + 1] * k01 +
        inData[p02 + 1] * k02 +
        inData[p03 + 1] * k04 +
        inData[p02 + 1] * k04 +
        inData[p10 + 1] * k10 +
        inData[p11 + 1] * k11 +
        inData[p12 + 1] * k12 +
        inData[p13 + 1] * k14 +
        inData[p12 + 1] * k14 +
        inData[p20 + 1] * k20 +
        inData[p21 + 1] * k21 +
        inData[p22 + 1] * k22 +
        inData[p23 + 1] * k24 +
        inData[p22 + 1] * k24 +
        inData[p30 + 1] * k30 +
        inData[p31 + 1] * k31 +
        inData[p32 + 1] * k32 +
        inData[p33 + 1] * k34 +
        inData[p32 + 1] * k34 +
        inData[p40 + 1] * k40 +
        inData[p41 + 1] * k41 +
        inData[p42 + 1] * k42 +
        inData[p43 + 1] * k44 +
        inData[p42 + 1] * k44;

      b =
        inData[p00 + 2] * k00 +
        inData[p01 + 2] * k01 +
        inData[p02 + 2] * k02 +
        inData[p03 + 2] * k04 +
        inData[p02 + 2] * k04 +
        inData[p10 + 2] * k10 +
        inData[p11 + 2] * k11 +
        inData[p12 + 2] * k12 +
        inData[p13 + 2] * k14 +
        inData[p12 + 2] * k14 +
        inData[p20 + 2] * k20 +
        inData[p21 + 2] * k21 +
        inData[p22 + 2] * k22 +
        inData[p23 + 2] * k24 +
        inData[p22 + 2] * k24 +
        inData[p30 + 2] * k30 +
        inData[p31 + 2] * k31 +
        inData[p32 + 2] * k32 +
        inData[p33 + 2] * k34 +
        inData[p32 + 2] * k34 +
        inData[p40 + 2] * k40 +
        inData[p41 + 2] * k41 +
        inData[p42 + 2] * k42 +
        inData[p43 + 2] * k44 +
        inData[p42 + 2] * k44;

      if (alpha) {
        a =
          inData[p00 + 3] * k00 +
          inData[p01 + 3] * k01 +
          inData[p02 + 3] * k02 +
          inData[p03 + 3] * k04 +
          inData[p02 + 3] * k04 +
          inData[p10 + 3] * k10 +
          inData[p11 + 3] * k11 +
          inData[p12 + 3] * k12 +
          inData[p13 + 3] * k14 +
          inData[p12 + 3] * k14 +
          inData[p20 + 3] * k20 +
          inData[p21 + 3] * k21 +
          inData[p22 + 3] * k22 +
          inData[p23 + 3] * k24 +
          inData[p22 + 3] * k24 +
          inData[p30 + 3] * k30 +
          inData[p31 + 3] * k31 +
          inData[p32 + 3] * k32 +
          inData[p33 + 3] * k34 +
          inData[p32 + 3] * k34 +
          inData[p40 + 3] * k40 +
          inData[p41 + 3] * k41 +
          inData[p42 + 3] * k42 +
          inData[p43 + 3] * k44 +
          inData[p42 + 3] * k44;
      } else {
        a = inData[idx + 3];
      }

      if (mono) {
        r = g = b = (r + g + b) / 3;
      }

      if (invert) {
        r = 255 - r;
        g = 255 - g;
        b = 255 - b;
      }

      outData[idx] = r;
      outData[idx + 1] = g;
      outData[idx + 2] = b;
      outData[idx + 3] = a;
    }
  }
}

function gaussian(inData, outData, width, height, kernelSize) {
  var x,
    y,
    i,
    j,
    n = width * height * 4,
    r,
    g,
    b,
    a,
    idx,
    inx,
    iny,
    w,
    tmpData = [],
    maxKernelSize = 13,
    k1,
    k2,
    weights,
    kernels = [[1]];

  kernelSize = clamp(kernelSize, 3, maxKernelSize);
  k1 = -kernelSize / 2 + (kernelSize % 2 ? 0.5 : 0);
  k2 = kernelSize + k1;

  for (i = 1; i < maxKernelSize; i += 1) {
    kernels[0][i] = 0;
  }

  for (i = 1; i < maxKernelSize; i += 1) {
    kernels[i] = [1];
    for (j = 1; j < maxKernelSize; j += 1) {
      kernels[i][j] = kernels[i - 1][j] + kernels[i - 1][j - 1];
    }
  }

  weights = kernels[kernelSize - 1];

  for (i = 0, w = 0; i < kernelSize; i += 1) {
    w += weights[i];
  }
  for (i = 0; i < kernelSize; i += 1) {
    weights[i] /= w;
  }

  // pass 1
  for (y = 0; y < height; y += 1) {
    for (x = 0; x < width; x += 1) {
      r = g = b = a = 0;

      for (i = k1; i < k2; i += 1) {
        inx = x + i;
        iny = y;
        w = weights[i - k1];

        if (inx < 0) {
          inx = 0;
        }
        if (inx >= width) {
          inx = width - 1;
        }

        idx = (iny * width + inx) * 4;

        r += inData[idx] * w;
        g += inData[idx + 1] * w;
        b += inData[idx + 2] * w;
        a += inData[idx + 3] * w;
      }

      idx = (y * width + x) * 4;

      tmpData[idx] = r;
      tmpData[idx + 1] = g;
      tmpData[idx + 2] = b;
      tmpData[idx + 3] = a;
    }
  }

  // pass 2
  for (y = 0; y < height; y += 1) {
    for (x = 0; x < width; x += 1) {
      r = g = b = a = 0;

      for (i = k1; i < k2; i += 1) {
        inx = x;
        iny = y + i;
        w = weights[i - k1];

        if (iny < 0) {
          iny = 0;
        }
        if (iny >= height) {
          iny = height - 1;
        }

        idx = (iny * width + inx) * 4;

        r += tmpData[idx] * w;
        g += tmpData[idx + 1] * w;
        b += tmpData[idx + 2] * w;
        a += tmpData[idx + 3] * w;
      }

      idx = (y * width + x) * 4;

      outData[idx] = r;
      outData[idx + 1] = g;
      outData[idx + 2] = b;
      outData[idx + 3] = a;
    }
  }
}

function getPixel(v, i) {
  i *= 4;
  return [v[i + 0], v[i + 1], v[i + 2], v[i + 3]];
}

function setPixel(v, i, rgba) {
  i *= 4;
  v[i + 0] = rgba[0];
  v[i + 1] = rgba[1];
  v[i + 2] = rgba[2];
  v[i + 3] = rgba[3];
}

// Polar filters (distortion filters) are from canvas.js: https://github.com/clips/pattern/blob/master/pattern/canvas.js (BSD)
// De Smedt T. & Daelemans W. (2012). Pattern for Python. Journal of Machine Learning Research.
// Based on: L. Spagnolini, 2007

function polar(inData, outData, x0, y0, width, height, callback) {
  /* Sets image data based on a polar coordinates filter.
   * The given callback is a function(distance, angle) that returns new [distance, angle].
   */
  x0 = width / 2 + (x0 || 0);
  y0 = height / 2 + (y0 || 0);
  var y1, x1, x, y, d, a, v;
  for (y1 = 0; y1 < height; y1 += 1) {
    for (x1 = 0; x1 < width; x1 += 1) {
      x = x1 - x0;
      y = y1 - y0;
      d = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
      a = Math.atan2(y, x);
      v = callback(d, a);
      d = v[0];
      a = v[1];
      setPixel(
        outData,
        x1 + y1 * width,
        getPixel(
          inData,
          Math.round(x0 + Math.cos(a) * d) +
            Math.round(y0 + Math.sin(a) * d) * width
        )
      );
    }
  }
}

const process = {
  invert: function (inData, outData, width, height) {
    var i,
      n = width * height * 4;

    for (i = 0; i < n; i += 4) {
      outData[i] = 255 - inData[i];
      outData[i + 1] = 255 - inData[i + 1];
      outData[i + 2] = 255 - inData[i + 2];
      outData[i + 3] = inData[i + 3];
    }
  },

  sepia: function (inData, outData, width, height) {
    var i,
      n = width * height * 4,
      r,
      g,
      b;

    for (i = 0; i < n; i += 4) {
      r = inData[i];
      g = inData[i + 1];
      b = inData[i + 2];
      outData[i] = r * 0.393 + g * 0.769 + b * 0.189;
      outData[i + 1] = r * 0.349 + g * 0.686 + b * 0.168;
      outData[i + 2] = r * 0.272 + g * 0.534 + b * 0.131;
      outData[i + 3] = inData[i + 3];
    }
  },

  solarize: function (inData, outData, width, height) {
    var i,
      n = width * height * 4,
      r,
      g,
      b;

    for (i = 0; i < n; i += 4) {
      r = inData[i];
      g = inData[i + 1];
      b = inData[i + 2];

      outData[i] = r > 127 ? 255 - r : r;
      outData[i + 1] = g > 127 ? 255 - g : g;
      outData[i + 2] = b > 127 ? 255 - b : b;
      outData[i + 3] = inData[i + 3];
    }
  },

  brightness: function (inData, outData, width, height, options) {
    options = defaultOptions(options, {
      brightness: 1,
      contrast: 0,
    });

    var i,
      n = width * height * 4,
      r,
      g,
      b,
      contrast = clamp(options.contrast, -1, 1) / 2,
      brightness = 1 + clamp(options.brightness, -1, 1),
      brightMul = brightness < 0 ? -brightness : brightness,
      brightAdd = brightness < 0 ? 0 : brightness,
      contrastAdd;

    contrast = 0.5 * Math.tan(((contrast + 1) * Math.PI) / 4);
    contrastAdd = -(contrast - 0.5) * 255;

    for (i = 0; i < n; i += 4) {
      r = inData[i];
      g = inData[i + 1];
      b = inData[i + 2];

      r = (r + r * brightMul + brightAdd) * contrast + contrastAdd;
      g = (g + g * brightMul + brightAdd) * contrast + contrastAdd;
      b = (b + b * brightMul + brightAdd) * contrast + contrastAdd;

      outData[i] = r;
      outData[i + 1] = g;
      outData[i + 2] = b;
      outData[i + 3] = inData[i + 3];
    }
  },

  desaturate: function (inData, outData, width, height, options) {
    options = defaultOptions(options, { method: LUMINOSITY_ITU_R_BT601 });
    var i,
      n = width * height * 4,
      level,
      rCoeff,
      gCoeff,
      bCoeff;

    if (options.method === LUMINOSITY_ITU_R_BT601) {
      rCoeff = 0.3;
      gCoeff = 0.59;
      bCoeff = 0.11;
    } else if (options.method === LUMINOSITY_ITU_R_BT709) {
      rCoeff = 0.2125;
      gCoeff = 0.7154;
      bCoeff = 0.0721;
    }

    for (i = 0; i < n; i += 4) {
      level =
        inData[i] * rCoeff + inData[i + 1] * gCoeff + inData[i + 2] * bCoeff;
      outData[i] = level;
      outData[i + 1] = level;
      outData[i + 2] = level;
      outData[i + 3] = inData[i + 3];
    }
  },

  lighten: function (inData, outData, width, height, options) {
    options = defaultOptions(options, { amount: 0.25 });
    var i,
      n = width * height * 4,
      mul = 1 + clamp(options.amount, 0, 1);

    for (i = 0; i < n; i += 4) {
      outData[i] = inData[i] * mul;
      outData[i + 1] = inData[i + 1] * mul;
      outData[i + 2] = inData[i + 2] * mul;
      outData[i + 3] = inData[i + 3];
    }
  },

  noise: function (inData, outData, width, height, options) {
    options = defaultOptions(options, {
      amount: 0.5,
      strength: 0.5,
      mono: false,
    });
    var i,
      n = width * height * 4,
      rnd,
      r,
      g,
      b,
      amount = clamp(options.amount, 0, 1),
      strength = clamp(options.strength, 0, 1),
      mono = !!options.mono,
      random = Math.random;

    for (i = 0; i < n; i += 4) {
      r = inData[i];
      g = inData[i + 1];
      b = inData[i + 2];

      rnd = random();

      if (rnd < amount) {
        if (mono) {
          rnd = strength * ((rnd / amount) * 2 - 1) * 255;
          r += rnd;
          g += rnd;
          b += rnd;
        } else {
          r += strength * random() * 255;
          g += strength * random() * 255;
          b += strength * random() * 255;
        }
      }

      outData[i] = r;
      outData[i + 1] = g;
      outData[i + 2] = b;
      outData[i + 3] = inData[i + 3];
    }
  },

  flipv: function (inData, outData, width, height) {
    var x,
      y,
      n = width * height * 4,
      inPix,
      outPix;

    for (y = 0; y < height; y += 1) {
      for (x = 0; x < width; x += 1) {
        inPix = (y * width + x) * 4;
        outPix = (y * width + (width - x - 1)) * 4;

        outData[outPix] = inData[inPix];
        outData[outPix + 1] = inData[inPix + 1];
        outData[outPix + 2] = inData[inPix + 2];
        outData[outPix + 3] = inData[inPix + 3];
      }
    }
  },

  fliph: function (inData, outData, width, height) {
    var x,
      y,
      n = width * height * 4,
      inPix,
      outPix;

    for (y = 0; y < height; y += 1) {
      for (x = 0; x < width; x += 1) {
        inPix = (y * width + x) * 4;
        outPix = ((height - y - 1) * width + x) * 4;

        outData[outPix] = inData[inPix];
        outData[outPix + 1] = inData[inPix + 1];
        outData[outPix + 2] = inData[inPix + 2];
        outData[outPix + 3] = inData[inPix + 3];
      }
    }
  },

  // Uses fast stackblur algorithm from http://www.quasimondo.com/StackBlurForCanvas
  blur: function (inData, outData, width, height, options) {
    options = defaultOptions(options, { radius: 10 });
    for (var i = 0; i < inData.length; i += 1) {
      outData[i] = inData[i];
    }
    stackblur(outData, width, height, options.radius);
  },

  glow: function (inData, outData, width, height, options) {
    options = defaultOptions(options, { amount: 0.75, kernelSize: 5 });
    var i,
      n = width * height * 4,
      r,
      g,
      b,
      amount = options.amount,
      tmpData = [];

    gaussian(inData, tmpData, width, height, options.kernelSize);

    for (i = 0; i < n; i += 4) {
      r = inData[i] + tmpData[i] * amount;
      g = inData[i + 1] + tmpData[i + 1] * amount;
      b = inData[i + 2] + tmpData[i + 2] * amount;
      if (r > 255) {
        r = 255;
      }
      if (g > 255) {
        g = 255;
      }
      if (b > 255) {
        b = 255;
      }
      outData[i] = r;
      outData[i + 1] = g;
      outData[i + 2] = b;
      outData[i + 3] = inData[i + 3];
    }
  },

  convolve3x3: function (inData, outData, width, height, options) {
    convolve3x3(inData, outData, width, height, options.kernel);
  },

  convolve5x5: function (inData, outData, width, height, options) {
    convolve5x5(inData, outData, width, height, options.kernel);
  },

  // A 3x3 high-pass filter
  sharpen3x3: function (inData, outData, width, height, options) {
    options = defaultOptions(options, { strength: 1 });
    var a = -clamp(options.strength, 0, 1);
    convolve3x3(inData, outData, width, height, [
      [a, a, a],
      [a, 1 - a * 8, a],
      [a, a, a],
    ]);
  },

  // A 5x5 high-pass filter
  sharpen5x5: function (inData, outData, width, height, options) {
    options = defaultOptions(options, { strength: 1 });
    var a = -clamp(options.strength, 0, 1);
    convolve5x5(inData, outData, width, height, [
      [a, a, a, a, a],
      [a, a, a, a, a],
      [a, a, 1 - a * 24, a, a],
      [a, a, a, a, a],
      [a, a, a, a, a],
    ]);
  },

  // A 3x3 low-pass mean filter
  soften3x3: function (inData, outData, width, height) {
    var c = 1 / 9;
    convolve3x3(inData, outData, width, height, [
      [c, c, c],
      [c, c, c],
      [c, c, c],
    ]);
  },

  // A 5x5 low-pass mean filter
  soften5x5: function (inData, outData, width, height) {
    var c = 1 / 25;
    convolve5x5(inData, outData, width, height, [
      [c, c, c, c, c],
      [c, c, c, c, c],
      [c, c, c, c, c],
      [c, c, c, c, c],
      [c, c, c, c, c],
    ]);
  },

  // A 3x3 Cross edge-detect
  crossedges: function (inData, outData, width, height, options) {
    options = defaultOptions(options, { strength: 1 });
    var a = clamp(options.strength, 0, 1) * 5;
    convolve3x3(
      inData,
      outData,
      width,
      height,
      [
        [0, -a, 0],
        [-a, 0, a],
        [0, a, 0],
      ],
      false,
      true
    );
  },

  // 3x3 directional emboss
  emboss: function (inData, outData, width, height, options) {
    options = defaultOptions(options, { amount: 1, angle: 0 });
    var i,
      n = width * height * 4,
      amount = options.amount,
      angle = options.angle,
      x = Math.cos(-angle) * amount,
      y = Math.sin(-angle) * amount,
      a00 = -x - y,
      a10 = -x,
      a20 = y - x,
      a01 = -y,
      a21 = y,
      a02 = -y + x,
      a12 = x,
      a22 = y + x,
      tmpData = [];

    convolve3x3(inData, tmpData, width, height, [
      [a00, a01, a02],
      [a10, 0, a12],
      [a20, a21, a22],
    ]);

    for (i = 0; i < n; i += 4) {
      outData[i] = 128 + tmpData[i];
      outData[i + 1] = 128 + tmpData[i + 1];
      outData[i + 2] = 128 + tmpData[i + 2];
      outData[i + 3] = inData[i + 3];
    }
  },

  // A 3x3 Sobel edge detect (similar to Photoshop's)
  findedges: function (inData, outData, width, height) {
    var i,
      n = width * height * 4,
      gr1,
      gr2,
      gg1,
      gg2,
      gb1,
      gb2,
      data1 = [],
      data2 = [];

    convolve3x3(inData, data1, width, height, [
      [-1, 0, 1],
      [-2, 0, 2],
      [-1, 0, 1],
    ]);

    convolve3x3(inData, data2, width, height, [
      [-1, -2, -1],
      [0, 0, 0],
      [1, 2, 1],
    ]);

    for (i = 0; i < n; i += 4) {
      gr1 = data1[i];
      gr2 = data2[i];
      gg1 = data1[i + 1];
      gg2 = data2[i + 1];
      gb1 = data1[i + 2];
      gb2 = data2[i + 2];

      if (gr1 < 0) {
        gr1 = -gr1;
      }
      if (gr2 < 0) {
        gr2 = -gr2;
      }
      if (gg1 < 0) {
        gg1 = -gg1;
      }
      if (gg2 < 0) {
        gg2 = -gg2;
      }
      if (gb1 < 0) {
        gb1 = -gb1;
      }
      if (gb2 < 0) {
        gb2 = -gb2;
      }

      outData[i] = 255 - (gr1 + gr2) * 0.8;
      outData[i + 1] = 255 - (gg1 + gg2) * 0.8;
      outData[i + 2] = 255 - (gb1 + gb2) * 0.8;
      outData[i + 3] = inData[i + 3];
    }
  },

  // A 3x3 edge enhance
  edgeenhance3x3: function (inData, outData, width, height) {
    var c = -1 / 9;
    convolve3x3(inData, outData, width, height, [
      [c, c, c],
      [c, 17 / 9, c],
      [c, c, c],
    ]);
  },

  // A 5x5 edge enhance
  edgeenhance5x5: function (inData, outData, width, height) {
    var c = -1 / 25;
    convolve5x5(inData, outData, width, height, [
      [c, c, c, c, c],
      [c, c, c, c, c],
      [c, c, 49 / 25, c, c],
      [c, c, c, c, c],
      [c, c, c, c, c],
    ]);
  },

  // A 3x3 Laplacian edge-detect
  laplace3x3: function (inData, outData, width, height) {
    convolve3x3(
      inData,
      outData,
      width,
      height,
      [
        [-1, -1, -1],
        [-1, 8, -1],
        [-1, -1, -1],
      ],
      false,
      true,
      true
    );
  },

  // A 5x5 Laplacian edge-detect
  laplace5x5: function (inData, outData, width, height) {
    convolve5x5(
      inData,
      outData,
      width,
      height,
      [
        [-1, -1, -1, -1, -1],
        [-1, -1, -1, -1, -1],
        [-1, -1, 24, -1, -1],
        [-1, -1, -1, -1, -1],
        [-1, -1, -1, -1, -1],
      ],
      false,
      true,
      true
    );
  },

  rgbAdjust: function (inData, outData, width, height, options) {
    options = defaultOptions(options, { r: 0, g: 0, b: 0, a: 0 });
    var i,
      n = width * height * 4,
      r,
      g,
      b,
      a,
      ar = clamp(options.r, -1, 1) * 255,
      ag = clamp(options.g, -1, 1) * 255,
      ab = clamp(options.b, -1, 1) * 255,
      aa = clamp(options.a, -1, 1) * 255;

    for (i = 0; i < n; i += 4) {
      r = inData[i] + ar;
      g = inData[i + 1] + ag;
      b = inData[i + 2] + ab;
      a = inData[i + 3] + aa;
      if (r < 0) {
        r = 0;
      }
      if (g < 0) {
        g = 0;
      }
      if (b < 0) {
        b = 0;
      }
      if (a < 0) {
        a = 0;
      }
      if (r > 255) {
        r = 255;
      }
      if (g > 255) {
        g = 255;
      }
      if (b > 255) {
        b = 255;
      }
      if (a > 255) {
        a = 255;
      }
      outData[i] = r;
      outData[i + 1] = g;
      outData[i + 2] = b;
      outData[i + 3] = a;
    }
  },

  colorfilter: function (inData, outData, width, height, options) {
    options = defaultOptions(options, {
      luminosity: false,
      r: 1,
      g: 0.5,
      b: 0,
    });
    var i,
      n = width * height * 4,
      r,
      g,
      b,
      luminosity = !!options.luminosity,
      min,
      max,
      h,
      l,
      h1,
      chroma,
      tmp,
      m,
      ar = clamp(options.r, 0, 1),
      ag = clamp(options.g, 0, 1),
      ab = clamp(options.b, 0, 1);

    for (i = 0; i < n; i += 4) {
      r = inData[i] / 255;
      g = inData[i + 1] / 255;
      b = inData[i + 2] / 255;

      l = r * 0.3 + g * 0.59 + b * 0.11;

      r = (r + r * ar) / 2;
      g = (g + g * ag) / 2;
      b = (b + b * ab) / 2;

      if (luminosity) {
        min = max = r;
        if (g > max) {
          max = g;
        }
        if (b > max) {
          max = b;
        }
        if (g < min) {
          min = g;
        }
        if (b < min) {
          min = b;
        }
        chroma = max - min;

        if (r === max) {
          h = ((g - b) / chroma) % 6;
        } else if (g === max) {
          h = (b - r) / chroma + 2;
        } else {
          h = (r - g) / chroma + 4;
        }

        h1 = h >> 0;
        tmp = chroma * (h - h1);
        r = g = b = l - (r * 0.3 + g * 0.59 + b * 0.11);

        if (h1 === 0) {
          r += chroma;
          g += tmp;
        } else if (h1 === 1) {
          r += chroma - tmp;
          g += chroma;
        } else if (h1 === 2) {
          g += chroma;
          b += tmp;
        } else if (h1 === 3) {
          g += chroma - tmp;
          b += chroma;
        } else if (h1 === 4) {
          r += tmp;
          b += chroma;
        } else if (h1 === 5) {
          r += chroma;
          b += chroma - tmp;
        }
      }

      outData[i] = r * 255;
      outData[i + 1] = g * 255;
      outData[i + 2] = b * 255;
      outData[i + 3] = inData[i + 3];
    }
  },

  hslAdjust: function (inData, outData, width, height, options) {
    options = defaultOptions(options, { h: 0.5, s: 0.3, l: 0.1, a: 0 });
    var i,
      n = width * height * 4,
      r,
      g,
      b,
      a,
      hue = clamp(options.h, -1, 1),
      saturation = clamp(options.s, -1, 1),
      lightness = clamp(options.l, -1, 1),
      aa = clamp(options.a, -1, 1) * 255,
      satMul = 1 + saturation * (saturation < 0 ? 1 : 2),
      lightMul = lightness < 0 ? 1 + lightness : 1 - lightness,
      lightAdd = lightness < 0 ? 0 : lightness * 255,
      vs,
      ms,
      vm,
      h,
      s,
      l,
      v,
      m,
      vmh,
      sextant;

    hue = (hue * 6) % 6;

    for (i = 0; i < n; i += 4) {
      r = inData[i];
      g = inData[i + 1];
      b = inData[i + 2];
      a = inData[i + 3] + aa;

      if (hue !== 0 || saturation !== 0) {
        // ok, here comes rgb to hsl + adjust + hsl to rgb, all in one jumbled mess.
        // It's not so pretty, but it's been optimized to get somewhat decent performance.
        // The transforms were originally adapted from the ones found in Graphics Gems, but have been heavily modified.
        vs = r;
        if (g > vs) {
          vs = g;
        }
        if (b > vs) {
          vs = b;
        }
        ms = r;
        if (g < ms) {
          ms = g;
        }
        if (b < ms) {
          ms = b;
        }
        vm = vs - ms;
        l = (ms + vs) / 510;

        if (l > 0 && vm > 0) {
          if (l <= 0.5) {
            s = (vm / (vs + ms)) * satMul;
            if (s > 1) {
              s = 1;
            }
            v = l * (1 + s);
          } else {
            s = (vm / (510 - vs - ms)) * satMul;
            if (s > 1) {
              s = 1;
            }
            v = l + s - l * s;
          }
          if (r === vs) {
            if (g === ms) {
              h = 5 + (vs - b) / vm + hue;
            } else {
              h = 1 - (vs - g) / vm + hue;
            }
          } else if (g === vs) {
            if (b === ms) {
              h = 1 + (vs - r) / vm + hue;
            } else {
              h = 3 - (vs - b) / vm + hue;
            }
          } else {
            if (r === ms) {
              h = 3 + (vs - g) / vm + hue;
            } else {
              h = 5 - (vs - r) / vm + hue;
            }
          }
          if (h < 0) {
            h += 6;
          }
          if (h >= 6) {
            h -= 6;
          }
          m = l + l - v;
          sextant = h >> 0;
          vmh = (v - m) * (h - sextant);
          if (sextant === 0) {
            r = v;
            g = m + vmh;
            b = m;
          } else if (sextant === 1) {
            r = v - vmh;
            g = v;
            b = m;
          } else if (sextant === 2) {
            r = m;
            g = v;
            b = m + vmh;
          } else if (sextant === 3) {
            r = m;
            g = v - vmh;
            b = v;
          } else if (sextant === 4) {
            r = m + vmh;
            g = m;
            b = v;
          } else if (sextant === 5) {
            r = v;
            g = m;
            b = v - vmh;
          }

          r *= 255;
          g *= 255;
          b *= 255;
        }
      }

      r = r * lightMul + lightAdd;
      g = g * lightMul + lightAdd;
      b = b * lightMul + lightAdd;

      if (r < 0) {
        r = 0;
      }
      if (g < 0) {
        g = 0;
      }
      if (b < 0) {
        b = 0;
      }
      if (a < 0) {
        a = 0;
      }
      if (r > 255) {
        r = 255;
      }
      if (g > 255) {
        g = 255;
      }
      if (b > 255) {
        b = 255;
      }
      if (a > 255) {
        a = 255;
      }

      outData[i] = r;
      outData[i + 1] = g;
      outData[i + 2] = b;
      outData[i + 3] = a;
    }
  },

  posterize: function (inData, outData, width, height, options) {
    options = defaultOptions(options, { levels: 5 });
    var i,
      n = width * height * 4,
      r,
      g,
      b,
      numLevels = clamp(options.levels, 2, 256),
      numAreas = 256 / numLevels,
      numValues = 256 / (numLevels - 1);

    for (i = 0; i < n; i += 4) {
      outData[i] = numValues * ((inData[i] / numAreas) >> 0);
      outData[i + 1] = numValues * ((inData[i + 1] / numAreas) >> 0);
      outData[i + 2] = numValues * ((inData[i + 2] / numAreas) >> 0);
      outData[i + 3] = inData[i + 3];
    }
  },

  removenoise: function (inData, outData, width, height) {
    var x,
      y,
      n = width * height * 4,
      r,
      g,
      b,
      c,
      idx,
      pyc,
      pyp,
      pyn,
      pxc,
      pxp,
      pxn,
      minR,
      minG,
      minB,
      maxR,
      maxG,
      maxB;

    for (y = 0; y < height; y += 1) {
      pyc = y * width * 4;
      pyp = pyc - width * 4;
      pyn = pyc + width * 4;

      if (y < 1) {
        pyp = pyc;
      }
      if (y >= width - 1) {
        pyn = pyc;
      }

      for (x = 0; x < width; x += 1) {
        idx = (y * width + x) * 4;

        pxc = x * 4;
        pxp = pxc - 4;
        pxn = pxc + 4;

        if (x < 1) {
          pxp = pxc;
        }
        if (x >= width - 1) {
          pxn = pxc;
        }

        minR = maxR = inData[pyc + pxp];
        c = inData[pyc + pxn];
        if (c < minR) {
          minR = c;
        }
        if (c > maxR) {
          maxR = c;
        }
        c = inData[pyp + pxc];
        if (c < minR) {
          minR = c;
        }
        if (c > maxR) {
          maxR = c;
        }
        c = inData[pyn + pxc];
        if (c < minR) {
          minR = c;
        }
        if (c > maxR) {
          maxR = c;
        }

        minG = inData[pyc + pxp + 1];
        c = inData[pyc + pxn + 1];
        if (c < minG) {
          minG = c;
        }
        c = inData[pyp + pxc + 1];
        if (c < minG) {
          minG = c;
        }
        c = inData[pyn + pxc + 1];
        if (c < minG) {
          minG = c;
        }

        minB = inData[pyc + pxp + 2];
        c = inData[pyc + pxn + 2];
        if (c < minB) {
          minB = c;
        }
        c = inData[pyp + pxc + 2];
        if (c < minB) {
          minB = c;
        }
        c = inData[pyn + pxc + 2];
        if (c < minB) {
          minB = c;
        }

        r = inData[idx];
        g = inData[idx + 1];
        b = inData[idx + 2];

        if (r < minR) {
          r = minR;
        }
        if (r > maxR) {
          r = maxR;
        }
        if (g < minG) {
          g = minG;
        }
        if (g > maxG) {
          g = maxG;
        }
        if (b < minB) {
          b = minB;
        }
        if (b > maxB) {
          b = maxB;
        }

        outData[idx] = r;
        outData[idx + 1] = g;
        outData[idx + 2] = b;
        outData[idx + 3] = inData[idx + 3];
      }
    }
  },

  mosaic: function (inData, outData, width, height, options) {
    options = defaultOptions(options, { blockSize: 8 });
    var blockSize = clamp(options.blockSize, 1, Math.max(width, height)),
      yBlocks = Math.ceil(height / blockSize),
      xBlocks = Math.ceil(width / blockSize),
      y0,
      y1,
      x0,
      x1,
      idx,
      pidx,
      i,
      j,
      bidx,
      r,
      g,
      b,
      bi,
      bj,
      n = yBlocks * xBlocks,
      prog,
      lastProg = 0;

    y0 = 0;
    bidx = 0;
    for (i = 0; i < yBlocks; i += 1) {
      y1 = clamp(y0 + blockSize, 0, height);
      x0 = 0;
      for (j = 0; j < xBlocks; j += 1) {
        x1 = clamp(x0 + blockSize, 0, width);

        idx = (y0 * width + x0) << 2;
        r = inData[idx];
        g = inData[idx + 1];
        b = inData[idx + 2];

        for (bi = y0; bi < y1; bi += 1) {
          for (bj = x0; bj < x1; bj += 1) {
            pidx = (bi * width + bj) << 2;
            outData[pidx] = r;
            outData[pidx + 1] = g;
            outData[pidx + 2] = b;
            outData[pidx + 3] = inData[pidx + 3];
          }
        }
        x0 = x1;
        bidx += 1;
      }
      y0 = y1;
    }
  },

  equalize: function (inData, outData, width, height, options) {
    var n = width * height,
      p,
      i,
      level,
      ratio,
      prog,
      lastProg;
    var round = Math.round;
    // build histogram
    var pdf = new Array(256);
    for (i = 0; i < 256; i += 1) {
      pdf[i] = 0;
    }

    for (i = 0; i < n; i += 1) {
      p = i * 4;
      level = clamp(
        round(inData[p] * 0.3 + inData[p + 1] * 0.59 + inData[p + 2] * 0.11),
        0,
        255
      );
      outData[p + 3] = level;
      pdf[level] += 1;
    }

    // build cdf
    var cdf = new Array(256);
    cdf[0] = pdf[0];
    for (i = 1; i < 256; i += 1) {
      cdf[i] = cdf[i - 1] + pdf[i];
    }

    // normalize cdf
    for (i = 0; i < 256; i += 1) {
      cdf[i] = (cdf[i] / n) * 255.0;
    }

    // map the pixel values
    for (i = 0; i < n; i += 1) {
      p = i * 4;
      level = outData[p + 3];
      ratio = cdf[level] / (level || 1);
      outData[p] = clamp(round(inData[p] * ratio), 0, 255);
      outData[p + 1] = clamp(round(inData[p + 1] * ratio), 0, 255);
      outData[p + 2] = clamp(round(inData[p + 2] * ratio), 0, 255);
      outData[p + 3] = inData[p + 3];
    }
  },

  mask: function (inData, outData, width, height, options) {
    var i,
      n = width * height * 4,
      data = options.data;

    // todo: consider the masking image's dimensions and position.

    for (i = 0; i < n; i += 4) {
      outData[i] = inData[i];
      outData[i + 1] = inData[i + 1];
      outData[i + 2] = inData[i + 2];
      outData[i + 3] = (((inData[i + 3] * data[i]) / 255) * data[i + 3]) / 255;
    }
  },

  // Distortion filters

  bump: function (inData, outData, width, height, options) {
    /* options:
     *  - dx: horizontal offset (in pixels) of the effect.
     *  - dy: vertical offset (in pixels) of the effect.
     *  - radius: the radius of the effect in pixels.
     *  - zoom: the amount of bulge (0.0-1.0).
     */
    options = defaultOptions(options, { dx: 0, dy: 0, radius: 0, zoom: 0 });
    var m1 = options.radius;
    var m2 = clamp(options.zoom, 0, 1);
    return polar(
      inData,
      outData,
      options.dx,
      options.dy,
      width,
      height,
      function (d, a) {
        return [d * smoothstep(0, m2, d / m1), a];
      }
    );
  },

  dent: function (inData, outData, width, height, options) {
    /* options:
     *  - dx: horizontal offset (in pixels) of the effect.
     *  - dy: vertical offset (in pixels) of the effect.
     *  - radius: the radius of the effect in pixels.
     *  - zoom: the amount of pinch (0.0-1.0).
     */
    options = defaultOptions(options, { dx: 0, dy: 0, radius: 0, zoom: 0 });
    var m1 = options.radius;
    var m2 = clamp(options.zoom, 0, 1);
    return polar(
      inData,
      outData,
      options.dx,
      options.dy,
      width,
      height,
      function (d, a) {
        return [2 * d - d * smoothstep(0, m2, d / m1), a];
      }
    );
  },

  pinch: function (inData, outData, width, height, options) {
    /* options:
     *  - dx: horizontal offset (in pixels) of the effect.
     *  - dy: vertical offset (in pixels) of the effect.
     *  - zoom: the amount of bulge or pinch (-1.0-1.0):
     */
    options = defaultOptions(options, { dx: 0, dy: 0, zoom: 0 });
    var m1 = distance(0, 0, width, height);
    var m2 = clamp(options.zoom * 0.75, -0.75, 0.75);
    return polar(
      inData,
      outData,
      options.dx,
      options.dy,
      width,
      height,
      function (d, a) {
        return [d * Math.pow(m1 / d, m2) * (1 - m2), a];
      }
    );
  },

  splash: function (inData, outData, width, height, options) {
    /* options:
     *  - dx: horizontal offset (in pixels) of the effect.
     *  - dy: vertical offset (in pixels) of the effect.
     *  - radius: the radius of the unaffected area in pixels.
     */
    options = defaultOptions(options, { dx: 0, dy: 0, radius: 0 });
    var m = options.radius;
    return polar(
      inData,
      outData,
      options.dx,
      options.dy,
      width,
      height,
      function (d, a) {
        return [d > m ? m : d, a];
      }
    );
  },

  twirl: function (inData, outData, width, height, options) {
    /* options:
     *  - dx: horizontal offset (in pixels) of the effect.
     *  - dy: vertical offset (in pixels) of the effect.
     *  - radius: the radius of the effect in pixels.
     *  - angle: the amount of rotation in degrees.
     */
    options = defaultOptions(options, { dx: 0, dy: 0, radius: 0, angle: 0 });
    var m1 = radians(options.angle);
    var m2 = options.radius;
    return polar(
      inData,
      outData,
      options.dx,
      options.dy,
      width,
      height,
      function (d, a) {
        return [d, a + (1 - smoothstep(-m2, m2, d)) * m1];
      }
    );
  },
};

// MODULE SUPPORT ///////////////////////////////////////////////////////

export default process;
