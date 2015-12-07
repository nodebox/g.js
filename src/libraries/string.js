'use strict';

var g = {};

g.characterAt = function (s, index) {
    if (!s || s.length === 0) { return null; }
    s = String(s);
    index = index % s.length;
    return s.charAt(index);
};

g.concatenate = function () {
    var result = '';
    for (var i = 0; i < arguments.length; i++) {
        var s = arguments[i];
        s = s !== undefined ? String(s) : '';
        result += s;
    }
    return result;
};

g.endsWith = function (s, value) {
    if (!s || !value) { return false; }
    s = String(s);
    return s.indexOf(value, s.length - value.length) !== -1;
};

g.reverse = function (l) {
    return l.slice().reverse();
};

g.startsWith = function (s, value) {
    if (!s || !value) { return false; }
    s = String(s);
    return s.indexOf(value) === 0;
};

g.string = String;

g.stringContains = function (s, sub) {
    if (!s || !sub) { return false; }
    s = String(s);
    return s.indexOf(sub) !== -1;
};

g.stringEquals = function (string1, string2, ignoreCase) {
    string1 = String(string1);
    string2 = String(string2);
    if (!string1 || !string2) {
        return false;
    }
    if (ignoreCase) {
        return string1.toLowerCase() === string2.toLowerCase();
    } else {
        return string1 === string2;
    }
};

g.stringLength = function (s) {
    if (!s) { return 0; }
    s = String(s);
    return s.length;
};

g.stringReplace = function (s, old, new_) {
    s = String(s);
    return s.replace(new RegExp(old, 'g'), new_);
};

g.stringSplit = function (s, separator) {
    if (!s) { return []; }
    if (!separator || separator.length === 0) {
        separator = '';
    }
    s = String(s);
    return s.split(separator);
};

g.stringTrim = function (s) {
    if (!s) { return null; }
    s = String(s);
    return s.trim();
};

g.substring = function (s, start, end, endOffset) {
    if (!s) { return null; }
    s = String(s);
    start = start % s.length;

    if (end !== undefined) {
        if (endOffset) {
            end = (end % s.length) + 1;
        } else {
            end = end % (s.length + 1);
        }
    }
    return s.substring(start, end);
};

g.toCharacterCodes = function(s) {
    if (!s) return [];
    var codes = [];
    codes.length = s.length;
    for (var i = 0; i < s.length; i += 1) {
        codes[i] = s.charCodeAt(i);
    }
    return codes;
};

g.toCharacters = function (s) {
    if (!s) { return []; }
    s = String(s);
    return s.split('');
};

g.toLowerCase = function (s) {
    s = String(s);
    return s.toLowerCase();
};

g.toTitleCase = function (s) {
    var c, result = '';
    s = String(s);
    for (var i = 0; i < s.length; i += 1) {
        c = s[i];
        if (result.length === 0 || result[result.length - 1] === ' ') {
            result += c.toUpperCase();
        } else {
            result += c;
        }
    }
    return result;
};

g.toUpperCase = function (s) {
    s = String(s);
    return s.toUpperCase();
};

g.wordCount = function (s) {
    if (!s) { return 0; }
    s = String(s);
    var split = s.split(new RegExp('\\w+'));
    return split.length - 1;
};

g.toWords = function (s) {
    var l = s.split(/\W+/);
    if (l[l.length - 1] === '') {
        l.pop();
    }
    return l;
};


module.exports = g;
