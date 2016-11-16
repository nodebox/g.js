// Convert NodeBox Live's /data/core/g/project.json to a list of reference documentation.
// Execute:
//    node scripts/nbl-to-ref.js <path to nodebox live>
//
// Use --overwrite to overwrite existing reference files. Otherwise they will be left alone.

'use strict';

var fs = require('fs');

var projectFile = process.argv[2];
console.assert(projectFile, 'Usage: node scripts/nbl-to-ref.js <path-to-project.json>');
console.assert(fs.existsSync(projectFile), 'File project.json does not exist.');

var overwrite = process.length == 4 && process.argv[3] === '--overwrite';

console.assert(fs.existsSync('ref'), 'Execute this script in the g.js project directory.');

var project = JSON.parse(fs.readFileSync(projectFile));

for (var i = 0; i < project.functions.length; i++) {
    var fn = project.functions[i];
    var ref = fn.ref;
    ref = ref.replace(/\(guide:vector-graphics\)/, '(/guide/vector.html)');
    ref = ref.replace(/\(guide:(.*)\)/g, '(/guide/$1.html)');
    ref = ref.replace(/\(ref:g\.(.*)\)/g, '(/ref/$1.html)');
    var description = ref.substring(0, ref.indexOf('\n'));
    var md = '---\n';
    md += 'layout: ref\n';
    md += 'title: ' + fn.name + '\n';
    md += 'description: ' + description + '\n';
    md += 'categories: [ref]\n';
    md += '---\n'
    md += ref;
    var functionFile = 'ref/' + fn.name + '.md';
    if ((!fs.existsSync(functionFile)) || overwrite) {
        console.log(fn.name);
        fs.writeFileSync(functionFile, md);
    }
}

