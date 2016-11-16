// Convert NodeBox Live's /data/core/g/project.json to a list of reference documentation.
// Execute:
//    node scripts/nbl-to-ref.js <path to nodebox live>

'use strict';

var fs = require('fs');

var nblPath = process.argv[2];
console.assert(nblPath);
var projectFile = nblPath + '/data/core/g/project.json';

console.assert(fs.existsSync('ref'), 'Execute this script in the g.js project directory.');

var project = JSON.parse(fs.readFileSync(projectFile));
console.log(project.id);

for (var i = 0; i < project.functions.length; i++) {
    var fn = project.functions[i];
    console.log(fn.name);
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
    fs.writeFileSync(functionFile, md);
}

