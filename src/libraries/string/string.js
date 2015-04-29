'use strict';

var grob = {};

grob.changeCase = function (s, caseMethod) {
    var i, c, result;
    caseMethod = caseMethod.toLowerCase();
    s = String(s);
    if (caseMethod === "lowercase") {
        return s.toLowerCase();
    } else if (caseMethod === "uppercase") {
        return s.toUpperCase();
    } else if (caseMethod === "titlecase") {
        result = "";
        for (i = 0; i < s.length; i += 1) {
            c = s[i];
            if (result.length === 0 || result[result.length - 1] === " ") {
                result += c.toUpperCase();
            } else {
                result += c;
            }
        }
        return result;
    } else {
        return s;
    }
};

grob.characterAt = function (s, index) {
    if (!s || s.length === 0) { return null; }
    s = String(s);
    index -= 1;
    index = index % s.length;
    return s.charAt(index);
};

grob.characters = function (s) {
    if (!s) { return []; }
    s = String(s);
    return s.split("");
};

grob.concatenate = function (s1, s2, s3, s4) {
    s1 = String(s1) || "";
    s2 = String(s2) || "";
    s3 = String(s3) || "";
    s4 = String(s4) || "";
    return s1 + s2 + s3 + s4;
};

grob.contains = function (s, value) {
    if (!s || !value) { return false; }
    s = String(s);
    return s.indexOf(value) !== -1;
};

grob.endsWith = function (s, value) {
    if (!s || !value) { return false; }
    s = String(s);
    return s.indexOf(value, s.length - value.length) !== -1;
};

grob.equal = function (s, value, caseSensitive) {
    s = String(s);
    if (!s || !value) {
        return false;
    }
    if (caseSensitive) {
        return s === value;
    } else {
        return s.toLowerCase() === value.toLowerCase();
    }
};

grob.length = function (s) {
    if (!s) { return 0; }
    s = String(s);
    return s.length;
};

grob.makeStrings = function (s, separator) {
    if (!s) { return []; }
    if (!separator || separator.length === 0) {
        separator = "";
    }
    s = String(s);
    return s.split(separator);
};

grob.replace = function (s, old, new_) {
    s = String(s);
    return s.replace(new RegExp(old, "g"), new_);
};

grob.reverse = function (l) {
    return l.slice().reverse();
};

grob.startsWith = function (s, value) {
    if (!s || !value) { return false; }
    s = String(s);
    return s.indexOf(value) === 0;
};

grob["string"] = String;

grob.subString = function (s, start, end, endOffset) {
    if (!s) { return null; }
    s = String(s);
    start -= 1;
    end -= 1;
    start = start % s.length;

    if (endOffset) {
        end = (end % s.length) + 1;
    } else {
        end = end % (s.length + 1);
    }
    return s.substring(start, end);
};

grob.toUnicode = function(s, radix, padding) {
    function format(f, val) {
        return val;
    }
    var i, j, cval, val, result,
        numberList = [];
    if (radix < 2 || !s) { return numberList; }
    s = String(s);
    if (padding) {
        if (radix === 2) { // binary
            for (i = 0; i < s.length; i += 1) {
                cval = s.charCodeAt(i);
                result = "";
                for (j = 0; j < 8; j += 1) {
                    result += (cval & 128) == 0 ? "0" : "1";
                    cval <<= 1;
                }
                numberList.push(result);
            }
        } else if (radix == 3) {
            for (i = 0; i < s.length; i += 1) {
                cval = s.charCodeAt(i);
                val = parseInt(cval, radix);
                numberList.push(format("%06d", val));
            }
        } else if (radix > 3 && radix < 7) {
            for (i = 0; i < s.length; i += 1) {
                cval = s.charCodeAt(i);
                val = parseInt(cval, radix);
                numberList.push(format("%04d", val));
            }
        } else if (radix < 15) {
            for (i = 0; i < s.length; i += 1) {
                cval = s.charCodeAt(i);
                result = parseInt(cval, radix);
                for (j = result.length; j < 3; j += 1) {
                    result = "0" + result;
                }
                numberList.push(result);
            }
        } else {
            for (i = 0; i < s.length; i += 1) {
                cval = s.charCodeAt(i);
                result = parseInt(cval, radix);
                for (j = result.length; j < 2; j += 1) {
                    result = "0" + result;
                }
                numberList.push(result);
            }
        }
    } else {
        if (radix === 2) { // binary
            for (i = 0; i < s.length; i += 1) {
                cval = s.charCodeAt(i);
                result = "";
                for (j = 0; j < 8; j += 1) {
                    result += (cval & 128) == 0 ? "0" : "1";
                    cval <<= 1;
                }
                numberList.push(result);
            }
        } else {
            for (i = 0; i < s.length; i += 1) {
                cval = s.charCodeAt(i);
                numberList.add(parseInt(cval, radix));
            }
        }
    }
    return numberList;
};

grob.wordCount = function (s) {
    if (!s) { return 0; }
    s = String(s);
    var split = s.split(new RegExp("\\w+"));
    return split.length - 1;
};

module.exports = grob;