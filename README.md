g.js
====
g.js is a JavaScript library for working with graphical objects. It provides a unified API for working with vector graphics (rectangles, paths, and text) and images.

Installation
------------

### CDN

[Download the latest ZIP](https://github.com/nodebox/g.js/archive/master.zip) and grab the files in the `dist` folder.
These are compiled.

### Using Browserify

    npm install --save g.js

Development
-----------
We use a set of [npm scripts](https://www.npmjs.org/doc/misc/npm-scripts.html) to build releases:

### During development

Running `npm run watchify` will automatically create new builds in the `build` directory whenever the source changes.

### Updating the dist

Running `npm run dist` will build a complete and minified version of g.js in the `dist` folder. You can also run
`npm run browserify` and `npm run uglify` separately.

### Publishing a release

1. Update the version number in `package.json`.
2. Run `npm run dist` to update the files in the `dist` folder.
3. Commit (`git commit -a`) and create a tag (e.g. `git tag 1.2.1`). Push and push tags (`git push && git push --tags`).
4. Run `npm publish` to publish the package to npm.

Credits
-------

* Stefan Gabriëls <stefan@emrg.be>
* Frederik De Bleser <frederik@emrg.be>
