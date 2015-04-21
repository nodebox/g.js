'use strict';

var vg = require('vg.js');

for (var k in vg) {
    exports[k] = vg[k];
}
