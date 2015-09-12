'use strict';

// Easing functions in javascript ported from jQuery Easing Plugin:
// https://github.com/gdsmith/jquery.easing
// t: current time, b: beginning value, c: change in value, d: duration

var grob = {};

grob.easeInQuad = function (t, b, c, d) {
    return c * (t /= d) * t + b;
};

grob.easeOutQuad = function (t, b, c, d) {
    return -c * (t /= d) * (t - 2) + b;
};

grob.easeInOutQuad = function (t, b, c, d) {
    if ((t /= d / 2) < 1) { return c / 2 * t * t + b; }
    return -c / 2 * ((--t) * (t - 2) - 1) + b;
};

grob.easeInCubic = function (t, b, c, d) {
    return c * (t /= d) * t * t + b;
};

grob.easeOutCubic = function (t, b, c, d) {
    return c * ((t = t / d - 1) * t * t + 1) + b;
};

grob.easeInOutCubic = function (t, b, c, d) {
    if ((t /= d / 2) < 1) { return c / 2 * t * t * t + b; }
    return c / 2 * ((t -= 2) * t * t + 2) + b;
};

grob.easeInQuart = function (t, b, c, d) {
    return c * (t /= d) * t * t * t + b;
};

grob.easeOutQuart = function (t, b, c, d) {
    return -c * ((t = t / d - 1) * t * t * t - 1) + b;
};

grob.easeInOutQuart = function (t, b, c, d) {
    if ((t /= d / 2) < 1) { return c / 2 * t * t * t * t + b; }
    return -c / 2 * ((t -= 2) * t * t * t - 2) + b;
};

grob.easeInQuint = function (t, b, c, d) {
    return c * (t /= d) * t * t * t * t + b;
};

grob.easeOutQuint = function (t, b, c, d) {
    return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
};

grob.easeInOutQuint = function (t, b, c, d) {
    if ((t /= d / 2) < 1) { return c / 2 * t * t * t * t * t + b; }
    return c / 2 * ((t -= 2) * t * t * t * t + 2) + b;
};

grob.easeInSine = function (t, b, c, d) {
    return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
};

grob.easeOutSine = function (t, b, c, d) {
    return c * Math.sin(t / d * (Math.PI / 2)) + b;
};

grob.easeInOutSine = function (t, b, c, d) {
    return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
};

grob.easeInExpo = function (t, b, c, d) {
    return (t === 0) ? b : c * Math.pow(2, 10 * (t / d - 1)) + b;
};

grob.easeOutExpo = function (t, b, c, d) {
    return (t === d) ? b + c : c * (-Math.pow(2, -10 * t / d) + 1) + b;
};

grob.easeInOutExpo = function (t, b, c, d) {
    if (t === 0) { return b; }
    if (t === d) { return b + c; }
    if ((t /= d / 2) < 1) { return c / 2 * Math.pow(2, 10 * (t - 1)) + b; }
    return c / 2 * (-Math.pow(2, -10 * --t) + 2) + b;
};

grob.easeInCirc = function (t, b, c, d) {
    return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b;
};

grob.easeOutCirc = function (t, b, c, d) {
    return c * Math.sqrt(1 - (t = t / d - 1) * t) + b;
};

grob.easeInOutCirc = function (t, b, c, d) {
    if ((t /= d / 2) < 1) { return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b; }
    return c / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b;
};

grob.easeInElastic = function (t, b, c, d) {
    var s = 1.70158;
    var p = 0;
    var a = c;
    if (t === 0) { return b; }
    if ((t /= d) === 1) { return b + c; }
    if (!p) p = d * 0.3;
    if (a < Math.abs(c)) {
        a = c;
        s = p / 4;
    }
    else {
        s = p / (2 * Math.PI) * Math.asin(c / a);
    }
    return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
};

grob.easeOutElastic = function (t, b, c, d) {
    var s = 1.70158;
    var p = 0;
    var a = c;
    if (t === 0) { return b; }
    if ((t /= d) === 1) { return b + c; }
    if (!p) p = d * 0.3;
    if (a < Math.abs(c)) {
        a = c;
        s = p / 4;
    }
    else {
        s = p / (2 * Math.PI) * Math.asin(c / a);
    }
    return a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b;
};

grob.easeInOutElastic = function (t, b, c, d) {
    var s = 1.70158;
    var p = 0;
    var a = c;
    if (t === 0) { return b; }
    if ((t /= d / 2) === 2) { return b + c; }
    if (!p) p = d * (0.3 * 1.5);
    if (a < Math.abs(c)) {
        a = c;
        s = p / 4;
    }
    else {
        s = p / (2 * Math.PI) * Math.asin(c / a);
    }
    if (t < 1) { return -0.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b; }
    return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p) * 0.5 + c + b;
};

grob.easeInBack = function (t, b, c, d, s) {
    if (s === undefined) {
        s = 1.70158;
    }
    return c * (t /= d) * t * ((s + 1) * t - s) + b;
};

grob.easeOutBack = function (t, b, c, d, s) {
    if (s === undefined) {
        s = 1.70158;
    }
    return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
};

grob.easeInOutBack = function (t, b, c, d, s) {
    if (s === undefined) {
        s = 1.70158;
    }
    if ((t /= d / 2) < 1) { return c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b; }
    return c / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b;
};

grob.easeInBounce = function (t, b, c, d) {
    return c - grob.easeOutBounce(d - t, 0, c, d) + b;
};

grob.easeOutBounce = function (t, b, c, d) {
    if ((t /= d) < (1 / 2.75)) {
        return c * (7.5625 * t * t) + b;
    } else if (t < (2 / 2.75)) {
        return c * (7.5625 * (t -= (1.5 / 2.75)) * t + 0.75) + b;
    } else if (t < (2.5 / 2.75)) {
        return c * (7.5625 * (t -= (2.25 / 2.75)) * t + 0.9375) + b;
    } else {
        return c * (7.5625 * (t -= (2.625 / 2.75)) * t + 0.984375) + b;
    }
};

grob.easeInOutBounce = function (t, b, c, d) {
    if (t < d / 2) { return grob.easeInBounce(t * 2, 0, c, d) * 0.5 + b; }
    return grob.easeOutBounce(t * 2 - d, 0, c, d) * 0.5 + c * 0.5 + b;
};

grob.easing = function (f) {
    var fn = grob[f];
    var args = Array.prototype.slice.call(arguments, 1);
    return fn.apply(null, args);
};

module.exports = grob;
