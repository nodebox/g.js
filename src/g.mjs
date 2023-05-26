import * as vg from "./libraries/vg/index.mjs";
// import * as img from "./libraries/img";
import * as util from "./libraries/util.mjs";

import * as mathCommands from "./libraries/math.mjs";
import * as stringCommands from "./libraries/string.mjs";
import * as listCommands from "./libraries/list.mjs";
import * as dataCommands from "./libraries/data.mjs";
// import * as imageCommands from "./libraries/image";
import * as graphicsCommands from "./libraries/graphics.mjs";
import * as easingCommands from "./libraries/easing.mjs";

function importSVG(svgString) {
  return g.svg.parseString(svgString);
}

function importImage(image) {
  var layer = g.Layer.fromImage(image);
  return new g.Img(layer.toCanvas());
}

function importText(string) {
  return string ? String(string) : "";
}

// Split the row, taking quotes into account.
function splitRow(s, delimiter) {
  var row = [],
    c,
    col = "",
    i,
    inString = false;
  s = s.trim();
  for (i = 0; i < s.length; i += 1) {
    c = s[i];
    if (c === '"') {
      if (s[i + 1] === '"') {
        col += '"';
        i += 1;
      } else {
        inString = !inString;
      }
    } else if (c === delimiter) {
      if (!inString) {
        row.push(col);
        col = "";
      } else {
        col += c;
      }
    } else {
      col += c;
    }
  }
  row.push(col);
  return row;
}

function importCSV(csvString, delimiter) {
  var csvRows, header;
  delimiter = delimiter || ",";

  if (!csvString) return null;
  csvRows = csvString.split(/\r\n|\r|\n/g);
  header = splitRow(csvRows[0], delimiter);
  csvRows = csvRows.slice(1);

  var row,
    rows = [];
  var m, sr, col, index;
  for (var i = 0; i < csvRows.length; i += 1) {
    row = csvRows[i];
    if (!!row) {
      m = {};
      sr = splitRow(row, delimiter);
      for (index = 0; index < sr.length; index += 1) {
        col = sr[index];
        m[header[index]] = isNaN(col) ? col : parseFloat(col);
      }
      rows.push(m);
    }
  }
  return rows;
}

function merge() {
  var args = util.flatten(arguments);
  if (Array.isArray(args)) {
    var objects = [];
    for (var i = 0; i < args.length; i += 1) {
      if (!!args[i]) {
        objects.push(args[i]);
      }
    }
    if (objects.length > 0) {
      var o = objects[0];
      if (o && (o.commands || o.shapes || o.fontFamily)) {
        return vg.merge(objects);
      } else if (o instanceof img.Img) {
        return img.merge(objects);
      }
    }
  }
  return null;
}

function mix(a, b, t) {
  t = t !== undefined ? t : 0.5;
  if (typeof a === "number") {
    return a * (1 - t) + b * t;
  } else if (a instanceof g.Color && b instanceof g.Color) {
    return new g.Color(
      g.mix(a.r, b.r, t),
      g.mix(a.g, b.g, t),
      g.mix(a.b, b.b, t),
      g.mix(a.a, b.a, t)
    );
  } else if (typeof a === "object") {
    var result = {};
    var keys = Object.keys(a);
    for (var i = 0, n = keys.length; i < n; i += 1) {
      var k = keys[i];
      var va = a[k];
      var vb = b[k];
      if (va !== undefined && vb !== undefined) {
        result[k] = g.mix(va, vb, t);
      }
    }
    return result;
  } else {
    return 0;
  }
}

const g = {
  ...vg,
  ...img,
  ...util,
  ...mathCommands,
  ...stringCommands,
  ...listCommands,
  ...dataCommands,
  ...imageCommands,
  ...graphicsCommands,
  ...easingCommands,
  importSvg,
  importImage,
  importText,
  importCSV,
  merge,
  mix,
};
export default g;
