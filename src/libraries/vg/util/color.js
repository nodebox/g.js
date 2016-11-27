// Color conversion functions

'use strict';

var color = {};

color.namedColors = {
    'lightpink'            : [1.00, 0.71, 0.76],
    'pink'                 : [1.00, 0.75, 0.80],
    'crimson'              : [0.86, 0.08, 0.24],
    'lavenderblush'        : [1.00, 0.94, 0.96],
    'palevioletred'        : [0.86, 0.44, 0.58],
    'hotpink'              : [1.00, 0.41, 0.71],
    'deeppink'             : [1.00, 0.08, 0.58],
    'mediumvioletred'      : [0.78, 0.08, 0.52],
    'orchid'               : [0.85, 0.44, 0.84],
    'thistle'              : [0.85, 0.75, 0.85],
    'plum'                 : [0.87, 0.63, 0.87],
    'violet'               : [0.93, 0.51, 0.93],
    'fuchsia'              : [1.00, 0.00, 1.00],
    'darkmagenta'          : [0.55, 0.00, 0.55],
    'purple'               : [0.50, 0.00, 0.50],
    'mediumorchid'         : [0.73, 0.33, 0.83],
    'darkviolet'           : [0.58, 0.00, 0.83],
    'darkorchid'           : [0.60, 0.20, 0.80],
    'indigo'               : [0.29, 0.00, 0.51],
    'blueviolet'           : [0.54, 0.17, 0.89],
    'mediumpurple'         : [0.58, 0.44, 0.86],
    'mediumslateblue'      : [0.48, 0.41, 0.93],
    'slateblue'            : [0.42, 0.35, 0.80],
    'darkslateblue'        : [0.28, 0.24, 0.55],
    'ghostwhite'           : [0.97, 0.97, 1.00],
    'lavender'             : [0.90, 0.90, 0.98],
    'blue'                 : [0.00, 0.00, 1.00],
    'mediumblue'           : [0.00, 0.00, 0.80],
    'darkblue'             : [0.00, 0.00, 0.55],
    'navy'                 : [0.00, 0.00, 0.50],
    'midnightblue'         : [0.10, 0.10, 0.44],
    'royalblue'            : [0.25, 0.41, 0.88],
    'cornflowerblue'       : [0.39, 0.58, 0.93],
    'lightsteelblue'       : [0.69, 0.77, 0.87],
    'lightslategray'       : [0.47, 0.53, 0.60],
    'slategray'            : [0.44, 0.50, 0.56],
    'dodgerblue'           : [0.12, 0.56, 1.00],
    'aliceblue'            : [0.94, 0.97, 1.00],
    'steelblue'            : [0.27, 0.51, 0.71],
    'lightskyblue'         : [0.53, 0.81, 0.98],
    'skyblue'              : [0.53, 0.81, 0.92],
    'deepskyblue'          : [0.00, 0.75, 1.00],
    'lightblue'            : [0.68, 0.85, 0.90],
    'powderblue'           : [0.69, 0.88, 0.90],
    'cadetblue'            : [0.37, 0.62, 0.63],
    'darkturquoise'        : [0.00, 0.81, 0.82],
    'azure'                : [0.94, 1.00, 1.00],
    'lightcyan'            : [0.88, 1.00, 1.00],
    'paleturquoise'        : [0.69, 0.93, 0.93],
    'aqua'                 : [0.00, 1.00, 1.00],
    'darkcyan'             : [0.00, 0.55, 0.55],
    'teal'                 : [0.00, 0.50, 0.50],
    'darkslategray'        : [0.18, 0.31, 0.31],
    'mediumturquoise'      : [0.28, 0.82, 0.80],
    'lightseagreen'        : [0.13, 0.70, 0.67],
    'turquoise'            : [0.25, 0.88, 0.82],
    'aquamarine'           : [0.50, 1.00, 0.83],
    'mediumaquamarine'     : [0.40, 0.80, 0.67],
    'mediumspringgreen'    : [0.00, 0.98, 0.60],
    'mintcream'            : [0.96, 1.00, 0.98],
    'springgreen'          : [0.00, 1.00, 0.50],
    'mediumseagreen'       : [0.24, 0.70, 0.44],
    'seagreen'             : [0.18, 0.55, 0.34],
    'honeydew'             : [0.94, 1.00, 0.94],
    'darkseagreen'         : [0.56, 0.74, 0.56],
    'palegreen'            : [0.60, 0.98, 0.60],
    'lightgreen'           : [0.56, 0.93, 0.56],
    'limegreen'            : [0.20, 0.80, 0.20],
    'lime'                 : [0.00, 1.00, 0.00],
    'forestgreen'          : [0.13, 0.55, 0.13],
    'green'                : [0.00, 0.50, 0.00],
    'darkgreen'            : [0.00, 0.39, 0.00],
    'lawngreen'            : [0.49, 0.99, 0.00],
    'chartreuse'           : [0.50, 1.00, 0.00],
    'greenyellow'          : [0.68, 1.00, 0.18],
    'darkolivegreen'       : [0.33, 0.42, 0.18],
    'yellowgreen'          : [0.60, 0.80, 0.20],
    'olivedrab'            : [0.42, 0.56, 0.14],
    'ivory'                : [1.00, 1.00, 0.94],
    'beige'                : [0.96, 0.96, 0.86],
    'lightyellow'          : [1.00, 1.00, 0.88],
    'lightgoldenrodyellow' : [0.98, 0.98, 0.82],
    'yellow'               : [1.00, 1.00, 0.00],
    'olive'                : [0.50, 0.50, 0.00],
    'darkkhaki'            : [0.74, 0.72, 0.42],
    'palegoldenrod'        : [0.93, 0.91, 0.67],
    'lemonchiffon'         : [1.00, 0.98, 0.80],
    'khaki'                : [0.94, 0.90, 0.55],
    'gold'                 : [1.00, 0.84, 0.00],
    'cornsilk'             : [1.00, 0.97, 0.86],
    'goldenrod'            : [0.85, 0.65, 0.13],
    'darkgoldenrod'        : [0.72, 0.53, 0.04],
    'floralwhite'          : [1.00, 0.98, 0.94],
    'oldlace'              : [0.99, 0.96, 0.90],
    'wheat'                : [0.96, 0.87, 0.07],
    'orange'               : [1.00, 0.65, 0.00],
    'moccasin'             : [1.00, 0.89, 0.71],
    'papayawhip'           : [1.00, 0.94, 0.84],
    'blanchedalmond'       : [1.00, 0.92, 0.80],
    'navajowhite'          : [1.00, 0.87, 0.68],
    'antiquewhite'         : [0.98, 0.92, 0.84],
    'tan'                  : [0.82, 0.71, 0.55],
    'burlywood'            : [0.87, 0.72, 0.53],
    'darkorange'           : [1.00, 0.55, 0.00],
    'bisque'               : [1.00, 0.89, 0.77],
    'linen'                : [0.98, 0.94, 0.90],
    'peru'                 : [0.80, 0.52, 0.25],
    'peachpuff'            : [1.00, 0.85, 0.73],
    'sandybrown'           : [0.96, 0.64, 0.38],
    'chocolate'            : [0.82, 0.41, 0.12],
    'saddlebrown'          : [0.55, 0.27, 0.07],
    'seashell'             : [1.00, 0.96, 0.93],
    'sienna'               : [0.63, 0.32, 0.18],
    'lightsalmon'          : [1.00, 0.63, 0.48],
    'coral'                : [1.00, 0.50, 0.31],
    'orangered'            : [1.00, 0.27, 0.00],
    'darksalmon'           : [0.91, 0.59, 0.48],
    'tomato'               : [1.00, 0.39, 0.28],
    'salmon'               : [0.98, 0.50, 0.45],
    'mistyrose'            : [1.00, 0.89, 0.88],
    'lightcoral'           : [0.94, 0.50, 0.50],
    'snow'                 : [1.00, 0.98, 0.98],
    'rosybrown'            : [0.74, 0.56, 0.56],
    'indianred'            : [0.80, 0.36, 0.36],
    'red'                  : [1.00, 0.00, 0.00],
    'brown'                : [0.65, 0.16, 0.16],
    'firebrick'            : [0.70, 0.13, 0.13],
    'darkred'              : [0.55, 0.00, 0.00],
    'maroon'               : [0.50, 0.00, 0.00],
    'white'                : [1.00, 1.00, 1.00],
    'whitesmoke'           : [0.96, 0.96, 0.96],
    'gainsboro'            : [0.86, 0.86, 0.86],
    'lightgrey'            : [0.83, 0.83, 0.83],
    'silver'               : [0.75, 0.75, 0.75],
    'darkgray'             : [0.66, 0.66, 0.66],
    'gray'                 : [0.50, 0.50, 0.50],
    'grey'                 : [0.50, 0.50, 0.50],
    'dimgray'              : [0.41, 0.41, 0.41],
    'dimgrey'              : [0.41, 0.41, 0.41],
    'black'                : [0.00, 0.00, 0.00],
    'cyan'                 : [0.00, 0.68, 0.94],

    'transparent'          : [0.00, 0.00, 0.00, 0.00],
    'bark'                 : [0.25, 0.19, 0.13]
};

function toHex(i) {
    var s;
    if (i === 0) {
        return '00';
    } else {
        s = i.toString(16).toUpperCase();
        if (s.length < 2) {
            s = '0' + s;
        }
        return s;
    }
}

// Converts the given R,G,B values to a hexadecimal color string.
color.rgb2hex = function (r, g, b) {
    return '#' +
        toHex(Math.round(r * 255)) +
        toHex(Math.round(g * 255)) +
        toHex(Math.round(b * 255));
};

// Converts the given R,G,B,A values to a hexadecimal color string.
color.rgba2hex = function (r, g, b, a) {
    return '#' +
        toHex(Math.round(r * 255)) +
        toHex(Math.round(g * 255)) +
        toHex(Math.round(b * 255)) +
        toHex(Math.round(a * 255));
};

// Converts the given hexadecimal color string to R,G,B (between 0.0-1.0).
color.hex2rgb = function (hex) {
    var r, g, b;
    hex = hex.replace(/^#/, '');
    if ((hex.length !== 3 && hex.length !== 6) || !(/^[0-9a-fA-F]*$/.test(hex))) {
        throw new Error('Invalid hex value: #' + hex);
    }
    if (hex.length === 3) {
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    r = parseInt(hex.substr(0, 2), 16) / 255;
    g = parseInt(hex.substr(2, 2), 16) / 255;
    b = parseInt(hex.substr(4, 2), 16) / 255;
    return [r, g, b];
};

// Converts the given R,G,B values to H,S,B (between 0.0-1.0).
color.rgb2hsb = function (r, g, b) {
    var h = 0,
        s = 0,
        v = Math.max(r, g, b),
        d = v - Math.min(r, g, b);
    if (v !== 0) {
        s = d / v;
    }
    if (s !== 0) {
        if (r === v) {
            h = 0 + (g - b) / d;
        } else if (g === v) {
            h = 2 + (b - r) / d;
        } else {
            h = 4 + (r - g) / d;
        }
    }
    h = h * (60 / 360);
    if (h < 0) {
        h += 1.0;
    }
    return [h, s, v];
};

// Converts the given H,S,B color values to R,G,B (between 0.0-1.0).
color.hsb2rgb = function (h, s, v) {
    if (s === 0) {
        return [v, v, v];
    }
    h = h % 1 * 6.0;
    var i = Math.floor(h),
        f = h - i,
        x = v * (1 - s),
        y = v * (1 - s * f),
        z = v * (1 - s * (1 - f));
    if (i > 4) {
        return [v, x, y];
    }
    return [[v, z, x], [y, v, x], [x, v, z], [x, y, v], [z, x, v]][parseInt(i, 10)];
};

// Converts the given R,G,B values to H,S,L (between 0.0-1.0).
// Code adapted from http://github.com/mattdesl/float-rgb2hsl
color.rgb2hsl = function (r, g, b) {
    var min = Math.min(r, g, b),
        max = Math.max(r, g, b),
        delta = max - min,
        h, s, l;

    if (max === min) {
        h = 0;
    } else if (r === max) {
        h = (g - b) / delta;
    } else if (g === max) {
        h = 2 + (b - r) / delta;
    } else if (b === max) {
        h = 4 + (r - g) / delta;
    }

    h = Math.min(h * 60, 360);

    if (h < 0) {
        h += 360;
    }

    l = (min + max) / 2;

    if (max === min) {
        s = 0;
    } else if (l <= 0.5) {
        s = delta / (max + min);
    } else {
        s = delta / (2 - max - min);
    }

    return [h / 360, s, l];
};

// Converts the given H,S,L color values to R,G,B (between 0.0-1.0).
// Code adapted from http://github.com/mattdesl/float-hsl2rgb
color.hsl2rgb = function (h, s, l) {
    var t1, t2, t3, rgb, val;

    if (s === 0) {
        val = l;
        return [val, val, val];
    }

    if (l < 0.5) {
        t2 = l * (1 + s);
    } else {
        t2 = l + s - l * s;
    }
    t1 = 2 * l - t2;

    rgb = [0, 0, 0];
    for (var i = 0; i < 3; i++) {
        t3 = h + 1 / 3 * -(i - 1);
        if (t3 < 0) {
            t3 += 1;
        }
        if (t3 > 1) {
            t3 -= 1;
        }

        if (6 * t3 < 1) {
            val = t1 + (t2 - t1) * 6 * t3;
        } else if (2 * t3 < 1) {
            val = t2;
        } else if (3 * t3 < 2) {
            val = t1 + (t2 - t1) * (2 / 3 - t3) * 6;
        } else {
            val = t1;
        }

        rgb[i] = val;
    }

    return rgb;
};

module.exports = color;
