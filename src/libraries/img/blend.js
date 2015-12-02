'use strict';

var blend, process;

var aliases = {
    normal: 'source-over',
    'linear-dodge': 'add'
};

function addAliases(d) {
    var i, mode, alias;
    var modes = Object.keys(aliases);
    for (i = 0; i < modes.length; i += 1) {
        mode = modes[i];
        alias = aliases[mode];
        d[mode] = d[alias];
    }
}

function realBlendMode(mode) {
    if (aliases[mode] !== undefined) { return aliases[mode]; }
    return mode;
}

// Tests which blending modes are supported on the current system and returns a dictionary with the results.
// For example d['source-over'] always results in true.
function getNativeModes() {
    if (typeof document === 'undefined') {
        return {};
    }
    var i, mode, darken, ok;
    var nativeModes = {};
    var dCanvas = document.createElement('canvas');
    var ctx = dCanvas.getContext('2d');

    var native = ['source-over', 'source-in', 'source-out', 'source-atop',
            'destination-over', 'destination-in', 'destination-out',
            'destination-atop', 'lighter', 'darker', 'copy', 'xor'];

    var maybeNative = ['multiply', 'screen', 'overlay', 'soft-light', 'hard-light',
            'color-dodge', 'color-burn', 'darken', 'lighten', 'difference',
            'exclusion', 'hue', 'saturation', 'luminosity', 'color',
            'add', 'subtract', 'average', 'negation'];

    var nonNative = ['divide', 'darker-color', 'lighter-color', 'linear-burn', 'linear-light',
            'vivid-light', 'pin-light', 'hard-mix'];

    for (i = 0; i < native.length; i += 1) {
        nativeModes[native[i]] = true;
    }
    for (i = 0; i < nonNative.length; i += 1) {
        nativeModes[nonNative[i]] = false;
    }
    dCanvas.width = 1;
    dCanvas.height = 1;
    for (i = 0; i < maybeNative.length; i += 1) {
        mode = maybeNative[i];
        darken = mode === 'darken';
        ok = false;
        ctx.save();
        try {
            ctx.fillStyle = darken ? '#300' : '#a00';
            ctx.fillRect(0, 0, 1, 1);
            ctx.globalCompositeOperation = mode;
            if (ctx.globalCompositeOperation === mode) {
                ctx.fillStyle = darken ? '#a00' : '#300';
                ctx.fillRect(0, 0, 1, 1);
                ok = ctx.getImageData(0, 0, 1, 1).data[0] !== (darken ? 170 : 51);
            }
        } catch (e) {
        }
        ctx.restore();
        nativeModes[mode] = ok;
    }

    addAliases(nativeModes);

    return nativeModes;
}

process = function (inData, outData, width, height, options) {

    var blend_fn,
        sr, sg, sb, sa,
        dr, dg, db, da,
        or, og, ob, oa;
    var max = Math.max;
    var min = Math.min;
    var div_2_255 = 2 / 255;

    /*R = 0.299;
     G = 0.587;
     B = 0.114;*/

    var R = 0.2126;
    var G = 0.7152;
    var B = 0.0722;

    /** This is the formula used by Photoshop to convert a color from
     * RGB (Red, Green, Blue) to HSY (Hue, Saturation, Luminosity).
     * The hue is calculated using the exacone approximation of the saturation
     * cone.
     * @param rgb The input color RGB normalized components.
     * @param hsy The output color HSY normalized components.
     */
    function rgbToHsy(r, g, b) {
        r /= 255;
        g /= 255;
        b /= 255;
        var h, s, y;

        // For saturation equals to 0 any value of hue are valid.
        // In this case we choose 0 as a default value.

        if (r === g && g === b) {            // Limit case.
            s = 0;
            h = 0;
        } else if ((r >= g) && (g >= b)) { // Sector 0: 0° - 60°
            s = r - b;
            h = 60 * (g - b) / s;
        } else if ((g > r) && (r >= b)) {  // Sector 1: 60° - 120°
            s = g - b;
            h = 60 * (g - r) / s + 60;
        } else if ((g >= b) && (b > r)) {  // Sector 2: 120° - 180°
            s = g - r;
            h = 60 * (b - r) / s + 120;
        } else if ((b > g) && (g > r)) {   // Sector 3: 180° - 240°
            s = b - r;
            h = 60 * (b - g) / s + 180;
        } else if ((b > r) && (r >= g)) {  // Sector 4: 240° - 300°
            s = b - g;
            h = 60 * (r - g) / s + 240;
        } else {                           // Sector 5: 300° - 360°
            s = r - g;
            h = 60 * (r - b) / s + 300;
        }

        y = R * r + G * g + B * b;

        // Approximations erros can cause values to exceed bounds.

        return [h % 360,
            min(max(s, 0), 1),
            min(max(y, 0), 1)];
    }

    /**
     * This is the formula used by Photoshop to convert a color from
     * HSY (Hue, Saturation, Luminosity) to RGB (Red, Green, Blue).
     * The hue is calculated using the exacone approximation of the saturation
     * cone.
     * @param hsy The input color HSY normalized components.
     * @param rgb The output color RGB normalized components.
     */
    function hsyToRgb(h, s, y) {

        h = h % 360;
        var r, g, b, k; // Intermediate variable.

        if (h >= 0 && h < 60) {           // Sector 0: 0° - 60°
            k = s * h / 60;
            b = y - R * s - G * k;
            r = b + s;
            g = b + k;
        } else if (h >= 60 && h < 120) {  // Sector 1: 60° - 120°
            k = s * (h - 60) / 60;
            g = y + B * s + R * k;
            b = g - s;
            r = g - k;
        } else if (h >= 120 && h < 180) { // Sector 2: 120° - 180°
            k = s * (h - 120) / 60;
            r = y - G * s - B * k;
            g = r + s;
            b = r + k;
        } else if (h >= 180 && h < 240) { // Sector 3: 180° - 240°
            k = s * (h - 180) / 60;
            b = y + R * s + G * k;
            r = b - s;
            g = b - k;
        } else if (h >= 240 && h < 300) { // Sector 4: 240° - 300°
            k = s * (h - 240) / 60;
            g = y - B * s - R * k;
            b = g + s;
            r = g + k;
        } else {                          // Sector 5: 300° - 360°
            k = s * (h - 300) / 60;
            r = y + G * s + B * k;
            g = r - s;
            b = r - k;
        }

        // Approximations erros can cause values to exceed bounds.

        r = min(max(r, 0), 1) * 255;
        g = min(max(g, 0), 1) * 255;
        b = min(max(b, 0), 1) * 255;
        return [r, g, b];
    }

    function _sourceover() {
        or = sr;
        og = sg;
        ob = sb;
    }

    function _svg_sourceover() {
        or = sr + dr - dr * sa;
        og = sg + dg - dg * sa;
        ob = sb + db - db * sa;
    }

    function _multiply() {
        or = dr * sr / 255;
        og = dg * sg / 255;
        ob = db * sb / 255;
    }

    function _svg_multiply() {
        or = sr * dr + sr * (1 - da) + dr * (1 - sa);
        og = sg * dg + sg * (1 - da) + dg * (1 - sa);
        ob = sb * db + sb * (1 - da) + db * (1 - sa);
    }

    function _subtract() {
        or = max(dr - sr, 0);
        og = max(dg - sg, 0);
        ob = max(db - sb, 0);
    }

    function _svg_subtract() {
        or = max(dr * sa - sr * da, 0) + sr * (1 - da) + dr * (1 - sa);
        og = max(dg * sa - sg * da, 0) + sg * (1 - da) + dg * (1 - sa);
        ob = max(db * sa - sb * da, 0) + sb * (1 - da) + db * (1 - sa);
    }

    function _divide() {
        or = sr === 0 ? 0 : dr / sr * 255;
        og = sg === 0 ? 0 : dg / sg * 255;
        ob = sb === 0 ? 0 : db / sb * 255;
    }

    function _screen() {
        or = (255 - (((255 - dr) * (255 - sr)) >> 8));
        og = (255 - (((255 - dg) * (255 - sg)) >> 8));
        ob = (255 - (((255 - db) * (255 - sb)) >> 8));
    }

    function _svg_screen() {
        or = sr + dr - sr * dr;
        og = sg + dg - sg * dg;
        ob = sb + db - sb * db;
    }

    function _lighten() {
        or = dr > sr ? dr : sr;
        og = dg > sg ? dg : sg;
        ob = db > sb ? db : sb;
    }

    function _svg_lighten() {
        or = max(sr * da, dr * sa) + sr * (1 - da) + dr * (1 - sa);
        og = max(sg * da, dg * sa) + sg * (1 - da) + dg * (1 - sa);
        ob = max(sb * da, db * sa) + sb * (1 - da) + db * (1 - sa);
    }

    function _darken() {
        or = dr < sr ? dr : sr;
        og = dg < sg ? dg : sg;
        ob = db < sb ? db : sb;
    }

    function _svg_darken() {
        or = min(sr * da, dr * sa) + sr * (1 - da) + dr * (1 - sa);
        og = min(sg * da, dg * sa) + sg * (1 - da) + dg * (1 - sa);
        ob = min(sb * da, db * sa) + sb * (1 - da) + db * (1 - sa);
    }

    function _darkercolor() {
        if (dr * 0.3 + dg * 0.59 + db * 0.11 <= sr * 0.3 + sg * 0.59 + sb * 0.11) {
            or = dr;
            og = dg;
            ob = db;
        } else {
            or = sr;
            og = sg;
            ob = sb;
        }
    }

    function _svg_darkercolor() {
        if (dr * sa * 0.3 + dg * sa * 0.59 + db * sa * 0.11 <= sr * da * 0.3 + sg * da * 0.59 + sb * da * 0.11) {
            or = dr * sa;
            og = dg * sa;
            ob = db * sa;
        } else {
            or = sr * da;
            og = sg * da;
            ob = sb * da;
        }
        or += sr * (1 - da) + dr * (1 - sa);
        og += sg * (1 - da) + dg * (1 - sa);
        ob += sb * (1 - da) + db * (1 - sa);
    }

    function _lightercolor() {
        if (dr * 0.3 + dg * 0.59 + db * 0.11 > sr * 0.3 + sg * 0.59 + sb * 0.11) {
            or = dr;
            og = dg;
            ob = db;
        } else {
            or = sr;
            og = sg;
            ob = sb;
        }
    }

    function _svg_lightercolor() {
        if (dr * sa * 0.3 + dg * sa * 0.59 + db * sa * 0.11 > sr * da * 0.3 + sg * da * 0.59 + sb * da * 0.11) {
            or = dr * sa;
            og = dg * sa;
            ob = db * sa;
        } else {
            or = sr * da;
            og = sg * da;
            ob = sb * da;
        }
        or += sr * (1 - da) + dr * (1 - sa);
        og += sg * (1 - da) + dg * (1 - sa);
        ob += sb * (1 - da) + db * (1 - sa);
    }

    function _add() { // also known as linear dodge
        or = min(dr + sr, 255);
        og = min(dg + sg, 255);
        ob = min(db + sb, 255);
    }

    function _linearburn() {
        or = dr + sr;
        og = dg + sg;
        ob = db + sb;

        or = or < 255 ? 0 : (or - 255);
        og = og < 255 ? 0 : (og - 255);
        ob = ob < 255 ? 0 : (ob - 255);
    }

    function _difference() {
        or = dr - sr;
        og = dg - sg;
        ob = db - sb;

        or = or < 0 ? -or : or;
        og = og < 0 ? -og : og;
        ob = ob < 0 ? -ob : ob;
    }

    function _svg_difference() {
        or = sr + dr - 2 * min(sr * da, dr * sa);
        og = sg + dg - 2 * min(sg * da, dg * sa);
        ob = sb + db - 2 * min(sb * da, db * sa);
    }

    function _exclusion() {
        or = dr - (dr * div_2_255 - 1) * sr;
        og = dg - (dg * div_2_255 - 1) * sg;
        ob = db - (db * div_2_255 - 1) * sb;
    }

    function _svg_exclusion() {
        or = sr * da + dr * sa - 2 * sr * dr + sr * (1 - da) + dr * (1 - sa);
        og = sg * da + dg * sa - 2 * sg * dg + sg * (1 - da) + dg * (1 - sa);
        ob = sb * da + db * sa - 2 * sb * db + sb * (1 - da) + db * (1 - sa);
    }

    function _overlay() {
        if (dr < 128) {
            or = sr * dr * div_2_255;
        } else {
            or = 255 - (255 - sr) * (255 - dr) * div_2_255;
        }

        if (dg < 128) {
            og = sg * dg * div_2_255;
        } else {
            og = 255 - (255 - sg) * (255 - dg) * div_2_255;
        }

        if (db < 128) {
            ob = sb * db * div_2_255;
        } else {
            ob = 255 - (255 - sb) * (255 - db) * div_2_255;
        }
    }

    function _svg_overlay() {
        if (2 * dr <= da) {
            or = 2 * sr * dr + sr * (1 - da) + dr * (1 - sa);
        } else {
            or = sr * (1 + da) + dr * (1 + sa) - 2 * dr * sr - da * sa;
        }
        if (2 * dg <= da) {
            og = 2 * sg * dg + sg * (1 - da) + dg * (1 - sa);
        } else {
            og = sg * (1 + da) + dg * (1 + sa) - 2 * dg * sg - da * sa;
        }
        if (2 * db <= da) {
            ob = 2 * sb * db + sb * (1 - da) + db * (1 - sa);
        } else {
            ob = sb * (1 + da) + db * (1 + sa) - 2 * db * sb - da * sa;
        }
    }

    function _softlight() {
        if (dr < 128) {
            or = ((sr >> 1) + 64) * dr * div_2_255;
        } else {
            or = 255 - (191 - (sr >> 1)) * (255 - dr) * div_2_255;
        }

        if (dg < 128) {
            og = ((sg >> 1) + 64) * dg * div_2_255;
        } else {
            og = 255 - (191 - (sg >> 1)) * (255 - dg) * div_2_255;
        }

        if (db < 128) {
            ob = ((sb >> 1) + 64) * db * div_2_255;
        } else {
            ob = 255 - (191 - (sb >> 1)) * (255 - db) * div_2_255;
        }
    }

    function _svg_softlight() {
        var m;
        var pow = Math.pow;

        if (0.0 === da) {
            or = sr;
            og = sg;
            ob = sb;
            return;
        }

        m = dr / da;
        if (2 * sr <= sa) {
            or = dr * (sa + (2 * sr - sa) * (1 - m)) + sr * (1 - da) + dr * (1 - sa);
        } else if (2 * sr > sa && 4 * dr <= da) {
            or = da * (2 * sr - sa) * (16 * pow(m, 3) - 12 * pow(m, 2) - 3 * m) + sr - sr * da + dr;
        } else if (2 * sr > sa && 4 * dr > da) {
            or = da * (2 * sr - sa) * (pow(m, 0.5) - m) + sr - sr * da + dr;
        }

        m = dg / da;
        if (2 * sg <= sa) {
            og = dg * (sa + (2 * sg - sa) * (1 - m)) + sg * (1 - da) + dg * (1 - sa);
        } else if (2 * sg > sa && 4 * dg <= da) {
            og = da * (2 * sg - sa) * (16 * pow(m, 3) - 12 * pow(m, 2) - 3 * m) + sg - sg * da + dg;
        } else if (2 * sg > sa && 4 * dg > da) {
            og = da * (2 * sg - sa) * (pow(m, 0.5) - m) + sg - sg * da + dg;
        }

        m = db / da;
        if (2 * sb <= sa) {
            ob = db * (sa + (2 * sb - sa) * (1 - m)) + sb * (1 - da) + db * (1 - sa);
        } else if (2 * sb > sa && 4 * db <= da) {
            ob = da * (2 * sb - sa) * (16 * pow(m, 3) - 12 * pow(m, 2) - 3 * m) + sb - sb * da + db;
        } else if (2 * sb > sa && 4 * db > da) {
            ob = da * (2 * sb - sa) * (pow(m, 0.5) - m) + sb - sb * da + db;
        }
    }

    function _hardlight() {
        if (sr < 128) {
            or = dr * sr * div_2_255;
        } else {
            or = 255 - (255 - dr) * (255 - sr) * div_2_255;
        }

        if (sg < 128) {
            og = dg * sg * div_2_255;
        } else {
            og = 255 - (255 - dg) * (255 - sg) * div_2_255;
        }

        if (sb < 128) {
            ob = db * sb * div_2_255;
        } else {
            ob = 255 - (255 - db) * (255 - sb) * div_2_255;
        }
    }

    function _svg_hardlight() {
        if (2 * sr <= sa) {
            or = 2 * sr * dr + sr * (1 - da) + dr * (1 - sa);
        } else {
            or = sr * (1 + da) + dr * (1 + sa) - sa * da - 2 * sr * dr;
        }

        if (2 * sg <= sa) {
            og = 2 * sg * dg + sg * (1 - da) + dg * (1 - sa);
        } else {
            og = sg * (1 + da) + dg * (1 + sa) - sa * da - 2 * sg * dg;
        }

        if (2 * sb <= sa) {
            ob = 2 * sb * db + sb * (1 - da) + db * (1 - sa);
        } else {
            ob = sb * (1 + da) + db * (1 + sa) - sa * da - 2 * sb * db;
        }
    }

    function _colordodge() {
        var dr1 = (dr << 8) / (255 - sr);
        var dg1 = (dg << 8) / (255 - sg);
        var db1 = (db << 8) / (255 - sb);

        or = (dr1 > 255 || sr === 255) ? 255 : dr1;
        og = (dg1 > 255 || sg === 255) ? 255 : dg1;
        ob = (db1 > 255 || sb === 255) ? 255 : db1;
    }

    function _svg_colordodge() {
        if (da === 0) {
            or = sr;
            og = sg;
            ob = sb;
            return;
        }

        if (sr === sa && dr === 0) {
            or = sr * (1 - da);
        } else if (sr === sa) {
            or = sa * da + sr * (1 - da) + dr * (1 - sa);
        } else if (sr < sa) {
            or = sa * da * min(1, dr / da * sa / (sa - sr)) + sr * (1 - da) + dr * (1 - sa);
        }

        if (sg === sa && dg === 0) {
            og = sg * (1 - da);
        } else if (sr === sa) {
            og = sa * da + sg * (1 - da) + dg * (1 - sa);
        } else if (sr < sa) {
            og = sa * da * min(1, dg / da * sa / (sa - sg)) + sg * (1 - da) + dg * (1 - sa);
        }

        if (sb === sa && db === 0) {
            ob = sb * (1 - da);
        } else if (sr === sa) {
            ob = sa * da + sb * (1 - da) + db * (1 - sa);
        } else if (sr < sa) {
            ob = sa * da * min(1, db / da * sa / (sa - sb)) + sb * (1 - da) + db * (1 - sa);
        }
    }

    function _colorburn() {
        var dr1 = 255 - ((255 - dr) << 8) / sr;
        var dg1 = 255 - ((255 - dg) << 8) / sg;
        var db1 = 255 - ((255 - db) << 8) / sb;

        or = (dr1 < 0 || sr === 0) ? 0 : dr1;
        og = (dg1 < 0 || sg === 0) ? 0 : dg1;
        ob = (db1 < 0 || sb === 0) ? 0 : db1;
    }

    function _svg_colorburn() {
        if (da === 0) {
            or = sr;
            og = sg;
            ob = sb;
            return;
        }

        if (sr === 0 && dr === da) {
            or = sa * da + dr * (1 - sa);
        } else if (sr === 0) {
            or = dr * (1 - sa);
        } else if (sr > 0) {
            or = sa * da * (1 - min(1, (1 - dr / da) * sa / sr)) + sr * (1 - da) + dr * (1 - sa);
        }

        if (sg === 0 && dg === da) {
            og = sa * da + dg * (1 - sa);
        } else if (sg === 0) {
            og = dg * (1 - sa);
        } else if (sg > 0) {
            og = sa * da * (1 - min(1, (1 - dg / da) * sa / sg)) + sg * (1 - da) + dg * (1 - sa);
        }

        if (sb === 0 && db === da) {
            ob = sa * da + db * (1 - sa);
        } else if (sb === 0) {
            ob = db * (1 - sa);
        } else if (sb > 0) {
            ob = sa * da * (1 - min(1, (1 - db / da) * sa / sb)) + sb * (1 - da) + db * (1 - sa);
        }
    }

    function _linearlight() {
        var dr1 = 2 * sr + dr - 256;
        var dg1 = 2 * sg + dg - 256;
        var db1 = 2 * sb + db - 256;

        or = (dr1 < 0 || (sr < 128 && dr1 < 0)) ? 0 : (dr1 > 255 ? 255 : dr1);
        og = (dg1 < 0 || (sg < 128 && dg1 < 0)) ? 0 : (dg1 > 255 ? 255 : dg1);
        ob = (db1 < 0 || (sb < 128 && db1 < 0)) ? 0 : (db1 > 255 ? 255 : db1);
    }

    function _vividlight() {
        var a;

        if (sr < 128) {
            if (sr) {
                a = 255 - ((255 - dr) << 8) / (2 * sr);
                or = a < 0 ? 0 : a;
            } else {
                or = 0;
            }
        } else {
            a = 2 * sr - 256;
            if (a < 255) {
                a = (dr << 8) / (255 - a);
                or = a > 255 ? 255 : a;
            } else {
                or = a < 0 ? 0 : a;
            }
        }

        if (sg < 128) {
            if (sg) {
                a = 255 - ((255 - dg) << 8) / (2 * sg);
                og = a < 0 ? 0 : a;
            } else {
                og = 0;
            }
        } else {
            a = 2 * sg - 256;
            if (a < 255) {
                a = (dg << 8) / (255 - a);
                og = a > 255 ? 255 : a;
            } else {
                og = a < 0 ? 0 : a;
            }
        }

        if (sb < 128) {
            if (sb) {
                a = 255 - ((255 - db) << 8) / (2 * sb);
                ob = a < 0 ? 0 : a;
            } else {
                ob = 0;
            }
        } else {
            a = 2 * sb - 256;
            if (a < 255) {
                a = (db << 8) / (255 - a);
                ob = a > 255 ? 255 : a;
            } else {
                ob = a < 0 ? 0 : a;
            }
        }
    }

    function _pinlight() {
        var a;

        if (sr < 128) {
            a = 2 * sr;
            or = dr < a ? dr : a;
        } else {
            a = 2 * sr - 256;
            or = dr > a ? dr : a;
        }

        if (sg < 128) {
            a = 2 * sg;
            og = dg < a ? dg : a;
        } else {
            a = 2 * sg - 256;
            og = dg > a ? dg : a;
        }

        if (sb < 128) {
            a = 2 * sb;
            ob = db < a ? db : a;
        } else {
            a = 2 * sb - 256;
            ob = db > a ? db : a;
        }
    }

    function _hardmix() {
        var a;

        if (sr < 128) {
            or = (255 - ((255 - dr) << 8) / (2 * sr) < 128 || sr === 0) ? 0 : 255;
        } else {
            a = 2 * sr - 256;
            or = (a < 255 && (dr << 8) / (255 - a) < 128) ? 0 : 255;
        }

        if (sg < 128) {
            og = (255 - ((255 - dg) << 8) / (2 * sg) < 128 || sg === 0) ? 0 : 255;
        } else {
            a = 2 * sg - 256;
            og = (a < 255 && (dg << 8) / (255 - a) < 128) ? 0 : 255;
        }

        if (sb < 128) {
            ob = (255 - ((255 - db) << 8) / (2 * sb) < 128 || sb === 0) ? 0 : 255;
        } else {
            a = 2 * sb - 256;
            ob = (a < 255 && (db << 8) / (255 - a) < 128) ? 0 : 255;
        }
    }

    function _hue() {
        var hcl1 = rgbToHsy(dr, dg, db);
        var hcl2 = rgbToHsy(sr, sg, sb);
        var rgb = hsyToRgb(hcl2[0], hcl1[1], hcl1[2]);
        or = rgb[0];
        og = rgb[1];
        ob = rgb[2];
    }

    function _saturation() {
        var hcl1 = rgbToHsy(dr, dg, db);
        var hcl2 = rgbToHsy(sr, sg, sb);
        var rgb = hsyToRgb(hcl1[0], hcl2[1], hcl1[2]);
        or = rgb[0];
        og = rgb[1];
        ob = rgb[2];
    }

    function _luminosity() {
        var hcl1 = rgbToHsy(dr, dg, db);
        var hcl2 = rgbToHsy(sr, sg, sb);
        var rgb = hsyToRgb(hcl1[0], hcl1[1], hcl2[2]);
        or = rgb[0];
        og = rgb[1];
        ob = rgb[2];
    }

    function _color() {
        var hcl1 = rgbToHsy(dr, dg, db);
        var hcl2 = rgbToHsy(sr, sg, sb);
        var rgb = hsyToRgb(hcl2[0], hcl2[1], hcl1[2]);
        or = rgb[0];
        og = rgb[1];
        ob = rgb[2];
    }

    blend_fn = {
        'source-over': _svg_sourceover,
        'multiply': _svg_multiply,
        'subtract': _svg_subtract,
        'divide': _divide,
        'screen': _svg_screen,
        'lighten': _svg_lighten,
        'darken': _svg_darken,
        'darker-color': _svg_darkercolor,
        'lighter-color': _svg_lightercolor,
        'add': _add,
        'linear-burn': _linearburn,
        'difference': _svg_difference,
        'exclusion': _svg_exclusion,
        'overlay': _svg_overlay,
        'soft-light': _svg_softlight,
        'hard-light': _svg_hardlight,
        'color-dodge': _svg_colordodge,
        'color-burn': _svg_colorburn,
        'linear-light': _linearlight,
        'vivid-light': _vividlight,
        'pin-light': _pinlight,
        'hard-mix': _hardmix,
        'hue': _hue,
        'saturation': _saturation,
        'luminosity': _luminosity,
        'color': _color
    };

    function rectIntersect(r1, r2) {
        var right1 = r1.x + r1.width;
        var bottom1 = r1.y + r1.height;
        var right2 = r2.x + r2.width;
        var bottom2 = r2.y + r2.height;

        var x = max(r1.x, r2.x);
        var y = max(r1.y, r2.y);
        var w = max(min(right1, right2) - x, 0);
        var h = max(min(bottom1, bottom2) - y, 0);
        return [x, y, w, h];
    }

    (function () {
        var pix, pixIn, x, y, a, a2, da2, demultiply, fBlend;
        var data2 = options.data;
        var opacity = options.opacity === 0 ? 0 : options.opacity || 1;
        var fn = blend_fn[options.type || '_svg_normal'];
        var dx = options.dx || 0;
        var dy = options.dy || 0;
        var ri = rectIntersect({x: 0, y: 0, width: width, height: height},
             {x: dx, y: dy, width: options.width, height: options.height});
        var xi = ri[0];
        var yi = ri[1];
        var wi = ri[2];
        var hi = ri[3];

        function pBlend() {
            sa = data2[pixIn + 3] / 255 * opacity;
            da = inData[pix + 3] / 255;
            da2 = (sa + da - sa * da);
            demultiply = 255 / da2;

            sr = data2[pixIn] / 255 * sa;
            sg = data2[pixIn + 1] / 255 * sa;
            sb = data2[pixIn + 2] / 255 * sa;

            dr = inData[pix] / 255 * da;
            dg = inData[pix + 1] / 255 * da;
            db = inData[pix + 2] / 255 * da;

            fn();

            outData[pix] = or * demultiply;
            outData[pix + 1] = og * demultiply;
            outData[pix + 2] = ob * demultiply;
            outData[pix + 3] = da2 * 255;
        }

        function sBlend() {
            dr = inData[pix];
            dg = inData[pix + 1];
            db = inData[pix + 2];

            sr = data2[pixIn];
            sg = data2[pixIn + 1];
            sb = data2[pixIn + 2];

            fn();

            outData[pix] = or;
            outData[pix + 1] = og;
            outData[pix + 2] = ob;
            outData[pix + 3] = inData[pix + 3];

            a = opacity * data2[pixIn + 3] / 255;
            if (a < 1) {
                a2 = 1 - a;
                outData[pix] = (inData[pix] * a2 + outData[pix] * a);
                outData[pix + 1] = (inData[pix + 1] * a2 + outData[pix + 1] * a);
                outData[pix + 2] = (inData[pix + 2] * a2 + outData[pix + 2] * a);
            }
        }

        fBlend = fn.name.indexOf('_svg_') === 0 ? pBlend : sBlend;

        for (y = 0; y < height; y += 1) {
            for (x = 0; x < width; x += 1) {
                pix = (y * width + x) * 4;
                if (y >= yi && x >= xi && x < xi + wi && y < yi + hi) {
                    pixIn = ((y - dy) * options.width + x - dx) * 4;
                    fBlend();
                } else {
                    outData[pix] = inData[pix];
                    outData[pix + 1] = inData[pix + 1];
                    outData[pix + 2] = inData[pix + 2];
                    outData[pix + 3] = inData[pix + 3];
                }
            }
        }
    }());
};

function _blend(inData, outData, width, height, options) {
    process(inData, outData, width, height, options);
}

function _wrap(type) {
    return function (inData, outData, width, height, options) {
        options.type = type;
        _blend(inData, outData, width, height, options);
    };
}

blend = (function () {
    var mode;
    var d = { blend: _blend };
    var modes = ['source-over', 'add', 'multiply', 'subtract', 'divide', 'screen',
            'lighten', 'darken', 'darker-color', 'lighter-color', 'linear-burn',
            'difference', 'exclusion', 'overlay', 'soft-light', 'hard-light',
            'color-dodge', 'color-burn', 'linear-light', 'vivid-light', 'pin-light',
            'hard-mix', 'hue', 'saturation', 'luminosity', 'color'];
    for (var i = 0; i < modes.length; i += 1) {
        mode = modes[i];
        d[mode] = _wrap(mode);
    }
    modes = Object.keys(modes);
    for (i = 0; i < modes.length; i += 1) {

    }
    // Aliases for the blending modes
    addAliases(d);

    d.getNativeModes = getNativeModes;
    d.realBlendMode = realBlendMode;

    return d;
}());

// MODULE SUPPORT ///////////////////////////////////////////////////////

module.exports = blend;
