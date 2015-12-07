'use strict';

var _ = require('lodash');
var list = require('./list');

var g = {};

// Convert values from one range to another
g.convert = function (v, inMin, inMax, outMin, outMax) {
    var argLength = arguments.length;
    if (argLength === 2) {
        var d = arguments[1];
        inMin = d.inMin;
        inMax = d.inMax;
        outMin = d.outMin;
        outMax = d.outMax;
    } else if (argLength === 3) {
        inMin = arguments[1][0];
        inMax = arguments[1][1];
        outMin = arguments[2][0];
        outMax = arguments[2][1];
    }
    try {
        v = (v - inMin) / (inMax - inMin);
    } catch (e) {
        v = inMin;
    }
    // Convert value to target range.
    return outMin + v * (outMax - outMin);
};

g.filterData = function (data, key, op, value) {
    if (value === null || value === undefined) {
        return data;
    }
    var results = [];
    for (var i = 0; i < data.length; i += 1) {
        var row = data[i];
        var obj = row[key];
        if (op === '==' && obj == value) { // jshint ignore:line
            results.push(row);
        } else if (op === '!=' && obj != value) { // jshint ignore:line
            results.push(row);
        } else if (op === '>' && obj > value) {
            results.push(row);
        } else if (op === '>=' && obj >= value) {
            results.push(row);
        } else if (op === '<' && obj < value) {
            results.push(row);
        } else if (op === '<=' && obj <= value) {
            results.push(row);
        }
    }
    return results;
};

g.groupBy = function (data, key) {
    return _.values(_.groupBy(data, key));
};

/* // Draw a legend. ==> rename to axis?
g.legend = function (scale, position, direction, nTicks) {
    var ticks = g.ticks(scale, nTicks),
        group = new vg.Group(),
        p = new vg.Path(),
        textOptions = {fontSize: 9, align: 'center'},
        t,
        i,
        v;
    p.moveTo(scale.outMax, position.y);
    p.lineTo(scale.outMin, position.y);
    p.stroke = 'black';
    group.add(p);
    for (i = 0; i < ticks.length; i += 1) {
        v = g.convert(scale, ticks[i]);
        p.moveTo(v, position.y);
        p.lineTo(v, position.y + 5);
        t = new g.Text('' + ticks[i], v, position.y + 15, textOptions);
        group.add(t);
    }
    return group;
}; */

g.keys = function (data) {
    var allKeys = [];
    for (var i = 0; i < data.length; i++) {
        allKeys = allKeys.concat(_.keys(data[i]));
    }
    return list.distinct(allKeys);
};

g.lookup = function (table, key) {
    var obj, v;
    obj = table;
    // First try to lookup the key as-is.
    v = obj[key];
    if (v !== undefined) {
        if (typeof v === 'function') {
            v = v.call(obj);
        }
        return v;
    }
    _.each(key.split('.'), function (token) {
        if (!obj) return null;
        if (typeof obj[token] === 'function') {
            v = obj[token];
            obj = v.call(obj);
        } else {
            obj = obj[token];
        }
    });
    return obj;
};

// Create a scale that maps values from the input domain to the output range.
g.dataScale = function (domain, outMin, outMax) {
    return {domain: domain, outMin: outMin, outMax: outMax};
};


// Generate about n values for the given scale.
g.ticks = function (min, max, n) {
    n = n !== undefined ? n : 10;

    var span = max - min,
        step = Math.pow(10, Math.floor(Math.log(span / n) / Math.LN10)),
        err = n / span * step,
        ticks = [],
        i;

    if (err <= 0.15) {
        step *= 10;
    } else if (err <= 0.35) {
        step *= 5;
    } else if (err <= 0.75) {
        step *= 2;
    }

    min = Math.ceil(min / step) * step;
    max = Math.floor(max / step) * step + (step * 0.5);

    for (i = min; i < max; i += step) {
        ticks.push(i);
    }

    return ticks;
};

module.exports = g;
