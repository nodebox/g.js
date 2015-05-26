'use strict';

var grob = {};

grob.characterAt = function (s, index) {
    if (!s || s.length === 0) { return null; }
    s = String(s);
    index = index % s.length;
    return s.charAt(index);
};

grob.concatenate = function () {
    var result = '';
    for (var i = 0; i < arguments.length; i++) {
        var s = arguments[i];
        s = s !== undefined ? String(s) : '';
        result += s;
    }
    return result;
};

grob.endsWith = function (s, value) {
    if (!s || !value) { return false; }
    s = String(s);
    return s.indexOf(value, s.length - value.length) !== -1;
};

grob.reverse = function (l) {
    return l.slice().reverse();
};

grob.startsWith = function (s, value) {
    if (!s || !value) { return false; }
    s = String(s);
    return s.indexOf(value) === 0;
};

grob.string = String;

grob.stringContains = function (s, sub) {
    if (!s || !sub) { return false; }
    s = String(s);
    return s.indexOf(sub) !== -1;
};

grob.stringEquals = function (string1, string2, ignoreCase) {
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

grob.stringLength = function (s) {
    if (!s) { return 0; }
    s = String(s);
    return s.length;
};

grob.stringReplace = function (s, old, new_) {
    s = String(s);
    return s.replace(new RegExp(old, 'g'), new_);
};

grob.stringSplit = function (s, separator) {
    if (!s) { return []; }
    if (!separator || separator.length === 0) {
        separator = '';
    }
    s = String(s);
    return s.split(separator);
};

grob.stringTrim = function (s) {
    if (!s) { return null; }
    s = String(s);
    return s.trim();
};

grob.substring = function (s, start, end, endOffset) {
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

grob.toCharacterCodes = function(s) {
    if (!s) return [];
    var codes = [];
    codes.length = s.length;
    for (var i = 0; i < s.length; i += 1) {
        codes[i] = s.charCodeAt(i);
    }
    return codes;
};

grob.toCharacters = function (s) {
    if (!s) { return []; }
    s = String(s);
    return s.split('');
};

grob.toLowerCase = function (s) {
    s = String(s);
    return s.toLowerCase();
};

grob.toTitleCase = function (s) {
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

grob.toUpperCase = function (s) {
    s = String(s);
    return s.toUpperCase();
};

grob.wordCount = function (s) {
    if (!s) { return 0; }
    s = String(s);
    var split = s.split(new RegExp('\\w+'));
    return split.length - 1;
};

grob.toWords = function (s) {
    var l = s.split(/\W+/);
    if (l[l.length - 1] === '') {
        l.pop();
    }
    return l;
};


module.exports = grob;
