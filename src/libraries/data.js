import values from "lodash.values";
import _groupBy from "lodash.groupby";

import { distinct } from "./list";

// Convert values from one range to another
export function convert(v, inMin, inMax, outMin, outMax) {
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
}

export function filterData(data, key, op, value) {
  if (!data) return [];
  var i, l, row, obj;
  if (value === null || value === undefined) {
    return data;
  }
  var results = [];
  if (op === "==") {
    for (i = 0, l = data.length; i < l; i++) {
      row = data[i];
      obj = row[key];
      if (obj == value) {
        // jshint ignore:line
        results.push(row);
      }
    }
  } else if (op === "!=") {
    for (i = 0, l = data.length; i < l; i++) {
      row = data[i];
      obj = row[key];
      if (obj != value) {
        // jshint ignore:line
        results.push(row);
      }
    }
  } else if (op === ">") {
    for (i = 0, l = data.length; i < l; i++) {
      row = data[i];
      obj = row[key];
      if (obj > value) {
        results.push(row);
      }
    }
  } else if (op === ">=") {
    for (i = 0, l = data.length; i < l; i++) {
      row = data[i];
      obj = row[key];
      if (obj >= value) {
        results.push(row);
      }
    }
  } else if (op === "<") {
    for (i = 0, l = data.length; i < l; i++) {
      row = data[i];
      obj = row[key];
      if (obj < value) {
        results.push(row);
      }
    }
  } else if (op === "<=") {
    for (i = 0, l = data.length; i < l; i++) {
      row = data[i];
      obj = row[key];
      if (obj <= value) {
        results.push(row);
      }
    }
  } else {
    throw new Error("Invalid op " + op);
  }
  return results;
}

export function groupBy(data, key) {
  return values(_groupBy(data, key));
}

/* // Draw a legend. ==> rename to axis?
export function legend  (scale, position, direction, nTicks) {
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

export function keys(data) {
  var allKeys = [];
  for (var i = 0; i < data.length; i++) {
    allKeys = allKeys.concat(Object.keys(data[i]));
  }
  return distinct(allKeys);
}

export function lookup(table, key) {
  var obj, v;
  obj = table;
  // First try to lookup the key as-is.
  v = obj[key];
  if (v !== undefined) {
    if (typeof v === "function") {
      v = v.call(obj);
    }
    return v;
  }
  var token,
    tokens = key.split(".");
  for (var i = 0; i < tokens.length; i += 1) {
    token = tokens[i];
    if (!obj) {
      continue;
    }
    if (typeof obj[token] === "function") {
      v = obj[token];
      obj = v.call(obj);
    } else {
      obj = obj[token];
    }
  }
  return obj;
}

// Create a scale that maps values from the input domain to the output range.
export function dataScale(domain, outMin, outMax) {
  return { domain: domain, outMin: outMin, outMax: outMax };
}

// Generate about n values for the given scale.
export function ticks(min, max, n) {
  n = n !== undefined ? n : 10;

  var span = max - min,
    step = Math.pow(10, Math.floor(Math.log(span / n) / Math.LN10)),
    err = (n / span) * step,
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
  max = Math.floor(max / step) * step + step * 0.5;

  for (i = min; i < max; i += step) {
    ticks.push(i);
  }

  return ticks;
}
