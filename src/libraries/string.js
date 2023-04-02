export function characterAt(s, index) {
  if (!s || s.length === 0) {
    return "";
  }
  s = String(s);
  if (index < 0) {
    index = s.length + index;
  }
  return s.charAt(index);
}

export function concatenate() {
  var result = "";
  for (var i = 0; i < arguments.length; i++) {
    var s = arguments[i];
    s = s !== undefined ? String(s) : "";
    result += s;
  }
  return result;
}

export function endsWith(s, value) {
  if (!s || !value) {
    return false;
  }
  s = String(s);
  return s.indexOf(value, s.length - value.length) !== -1;
}

export function reverse(l) {
  return l.slice().reverse();
}

export function startsWith(s, value) {
  if (!s || !value) {
    return false;
  }
  s = String(s);
  return s.indexOf(value) === 0;
}

export const string = String;

export function stringContains(s, sub) {
  if (!s || !sub) {
    return false;
  }
  s = String(s);
  return s.indexOf(sub) !== -1;
}

export function stringEquals(string1, string2, ignoreCase) {
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
}

export function stringLength(s) {
  if (!s) {
    return 0;
  }
  s = String(s);
  return s.length;
}

export function stringReplace(s, old, new_) {
  s = String(s);
  return s.replace(new RegExp(old, "g"), new_);
}

export function stringSplit(s, separator) {
  if (!s) {
    return [];
  }
  if (!separator || separator.length === 0) {
    separator = "";
  }
  s = String(s);
  return s.split(separator);
}

export function stringTrim(s) {
  if (!s) {
    return null;
  }
  s = String(s);
  return s.trim();
}

export function substring(s, start, end, endOffset) {
  if (!s) {
    return "";
  }
  if (end < start) {
    return "";
  }
  s = String(s);

  if (start < 0 && end < 0) {
    start = s.length + start;
    end = s.length + end;
  }

  if (end !== undefined) {
    if (endOffset) {
      end += 1;
    }
  }
  return s.substring(start, end);
}

export function toCharacterCodes(s) {
  if (!s) return [];
  var codes = [];
  codes.length = s.length;
  for (var i = 0; i < s.length; i += 1) {
    codes[i] = s.charCodeAt(i);
  }
  return codes;
}

export function toCharacters(s) {
  if (!s) {
    return [];
  }
  s = String(s);
  return s.split("");
}

export function toLowerCase(s) {
  s = String(s);
  return s.toLowerCase();
}

export function toTitleCase(s) {
  var c,
    result = "";
  s = String(s);
  for (var i = 0; i < s.length; i += 1) {
    c = s[i];
    if (result.length === 0 || result[result.length - 1] === " ") {
      result += c.toUpperCase();
    } else {
      result += c;
    }
  }
  return result;
}

export function toUpperCase(s) {
  s = String(s);
  return s.toUpperCase();
}

export function wordCount(s) {
  if (!s) {
    return 0;
  }
  s = String(s);
  var split = s.split(new RegExp("\\w+"));
  return split.length - 1;
}

export function toWords(s) {
  var l = s.split(/\W+/);
  if (l[l.length - 1] === "") {
    l.pop();
  }
  return l;
}
