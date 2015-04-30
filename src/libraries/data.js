'use strict';

var _ = require("lodash");

var grob = {};

// Return a tuple showing the beginning and end values of the domain.
// Note that this function does not order the domain list, so the values
// might not be the largest and smallest values.
function domainExtent(domain) {
    var begin = domain[0],
        end = domain[domain.length - 1];
    if (begin < end) {
        return [begin, end];
    } else {
        return [end, begin];
    }
}

// Convert values from the input domain to the output range
grob.convert = function(scale, v) {
    var extent = domainExtent(scale.domain),
        inMin = extent[0],
        inMax = extent[1];
    // Convert value to 0.0-1.0 range.
    try {
        v = (v - inMin) / (inMax - inMin);
    } catch (e) {
        v = inMin;
    }
    // Convert value to target range.
    return scale.outMin + v * (scale.outMax - scale.outMin);
};

grob.filterData = function (data, key, op, value) {
    if (value === null || value === undefined) {
        return data;
    }
    var results = [];
    for (var i = 0; i < data.length; i += 1) {
        var row = data[i];
        var obj = row[key];
        if (op === '==' && obj == value) {
            results.push(row);
        } else if (op === '!=' && obj != value) {
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

grob.groupBy = function (data, key) {
    return _.values(_.groupBy(data, key));
};

// Draw a legend.
grob.legend = function (scale, position, direction, nTicks) {
    var ticks = grob.ticks(scale, nTicks),
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
        v = grob.convert(scale, ticks[i]);
        p.moveTo(v, position.y);
        p.lineTo(v, position.y + 5);
        t = new g.Text('' + ticks[i], v, position.y + 15, textOptions);
        group.add(t);
    }
    return group;
};

grob.lookup = function (table, key) {
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
grob.dataScale = function (domain, outMin, outMax) {
    return {domain: domain, outMin: outMin, outMax: outMax};
};


// Lookup the table given a list of keys and values.
grob.tableLookup = function (key, keys, values, delimiter) {
    delimiter = delimiter || ',';
    var i, m = {};
    if(_.isString(keys)) {
        keys = keys.split(delimiter);
    }
    if(_.isString(values)) {
        values = values.split(delimiter);
    }
    if (_.isArray(keys) && _.isArray(values) && keys.length === values.length) {
        for (i = 0; i < keys.length; i += 1) {
            m[keys[i].trim()] = values[i].trim();
        }
        return m[key];
    } else {
        return null;
    }
};

// Generate about n values for the given scale.
grob.ticks = function (scale, n) {
    n = n !== undefined ? n : 10;

    var extent = domainExtent(scale.domain),
        min = extent[0],
        max = extent[1],
        span = max - min,
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

module.exports = grob;