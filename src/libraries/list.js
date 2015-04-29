'use strict';

var util = require('./util');
var grob = {};

grob.combine = function () {
    var i, l, result = [];
    for (i = 0; i < arguments.length; i++) {
        l = arguments[i];
        if (l) {
            result = result.concat(l);
        }
    }
    return result;
};

grob.count = function (l) {
    if (l && l.length) {
        return l.length;
    } else {
        return 0;
    }
};

grob.cull = function (l, booleans) {
    if (!l) { return []; }
    if (!booleans) { return l; }
    var i, keep, results = [];
    for (i = 0; i < l.length; i++) {
        // Cycle through the list of boolean values.
        keep = booleans[i % booleans.length];
        if (keep) {
            results.push(l[i]);
        }
    }
    return results;
};

grob.first = function (l) {
    if (!l || l.length === 0) { return null; }
    return l[0];
};

grob.last = function (l) {
    if (!l || l.length === 0) { return null; }
    return l[l.length - 1];
};

grob.pick = function (l, amount, seed, method) {
    if (!l || l.length === 0 || amount <= 0) {
        return [];
    }
    method = method || 'shuffle';
    if (method === 'shuffle') {
        var shuffledlist = grob.shuffle(l, seed);
        return grob.slice(shuffledlist, 0, amount);
    } else if (method === 'grab') {
        var rand = util.randomGenerator(seed || 0);
        var results = [];
        for (var i = 0; i < amount; i += 1) {
            results.push(l[Math.floor(rand(0, l.length))]);
        }
        return results;
    }
};

grob.repeat = function (l, amount, perItem) {
    if (!l) { return []; }
    if (amount <= 0) { return []; }
    var i, j, v,
        newList = [];
    if (!perItem) {
        for (i = 0; i < amount; i += 1) {
            newList.push.apply(newList, l);
        }
    } else {
        for (i = 0; i < l.length; i += 1) {
            v = l[i];
            for (j = 0; j < amount; j += 1) {
                newList.push(v);
            }
        }
    }
    return newList;
};

grob.rest = function (l) {
    if (!l) { return []; }
    return l.slice(1);
};

grob.reverse = function (l) {
    return l.slice().reverse();

};

grob.second = function (l) {
    if (!l || l.length < 2) { return null; }
    return l[1];
};

grob.shift = function (l, amount) {
    // If the amount is bigger than the number of items, wrap around.
    if (!l) { return []; }
    amount = amount % l.length;
    var head = l.slice(0, amount),
        result = l.slice(amount);
    result.push.apply(result, head);
    return result;
};

grob.shuffle = function (l, seed) {
    var i, j, tmp, r;
    r = util.randomGenerator(seed || 0);
    for (i = l.length - 1; i > 0; i--) {
        j = Math.floor(r(0, i + 1));
        tmp = l[i];
        l[i] = l[j];
        l[j] = tmp;
    }
    return l;
};

grob.slice = function (l, startIndex, size, invert) {
    if (!l) { return []; }
    var firstList, secondList;
    if (!invert) {
        return l.slice(startIndex, startIndex + size);
    } else {
        firstList = l.slice(0, startIndex);
        secondList = l.slice(startIndex + size);
        firstList.push.apply(firstList, secondList);
        return firstList;
    }
};

grob.switch = function (index) {
    var nLists = (arguments.length - 1);
    index = index % nLists;
    if (index < 0) {
        index += nLists;
    }
    return arguments[index + 1];
};

grob.takeEvery = function (l, n) {
    var i, results = [];
    for (i = 0; i < l.length; i += 1) {
        if (i % n === 0) {
            results.push(l[i]);
        }
    }
    return results;
};

grob.zipMap = function (keys, vals) {
    var i, k, v,
        m = {},
        minLength = Math.min(keys.length, vals.length);
    for (i = 0; i < minLength; i += 1) {
        k = keys[i];
        v = vals[i];
        m[k] = v;
    }
    return m;
};

module.exports = grob;