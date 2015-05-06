'use strict';

var _ = require("lodash");
var vg = require('vg.js');
var img = require('img.js');

var grob = {};

// Commands
function importCommands(module) {
    for (var k in module) {
        grob[k] = module[k];
    }
}

importCommands(require('./libraries/math'));
importCommands(require('./libraries/string'));
importCommands(require('./libraries/list'));
importCommands(require('./libraries/data'));
importCommands(require('./libraries/image'));
importCommands(require('./libraries/graphics'));

for (var k in vg) {
    if (k !== 'sort') {
        grob[k] = vg[k];
    }
}
grob.shapeSort = vg.sort;

for (var k in img) {
    grob[k] = img[k];
}

grob.importSVG = function (svgString) {
    return g.svg.parseString(svgString);
};

grob.importImage = function (image) {
    var layer = g.Layer.fromImage(image);
    return new g.Img(layer.toCanvas());
};

grob.importCSV = function (csvString, delimiter) {
    // Try to parse the string as a number.
    // Return a number or else the string, unchanged.
    function parseNumber(s) {
        var v = parseFloat(s);
        return isNaN(v) ? s : v;
    }

    // Split the row, taking quotes into account.
    function splitRow(s, delimiter) {
        var row = [], c, col = '', i, inString = false;
        s = s.trim();
        for (i = 0; i < s.length; i += 1) {
            c = s[i];
            if (c === '"') {
                if (s[i+1] === '"') {
                    col += '"';
                    i += 1;
                } else {
                    inString = !inString;
                }
            } else if (c === ',') {
                if (!inString) {
                    row.push(col);
                    col = '';
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

    var rows, header;
    delimiter = delimiter || ',';

    if (!csvString) return null;
    rows = csvString.split(/\r\n|\r|\n/g);
    header = splitRow(rows[0], delimiter);
    rows = rows.slice(1);

    rows = _.reject(rows, _.isEmpty);

    rows = _.map(rows, function (row) {
        var cols, m = {};
        cols = _.map(splitRow(row, delimiter), function (col) {
            return parseNumber(col);
        });
        _.each(cols, function (col, index) {
            m[header[index]] = col;
        });
        return m;
    });
    return rows;
};

grob.merge = function () {
    var objects = _.flatten(arguments, true);
    if (Array.isArray(objects) && objects.length > 0) {
        var o = objects[0];
        if (o && (o.commands || o.shapes)) {
            return vg.merge(objects);
        } else if (o instanceof img.Img) {
            return img.merge(objects);
        }
    }
    return null;
};

module.exports = grob;