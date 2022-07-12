'use strict';

var randomGenerator = function (seed) {
    // Note: the generator didn't work with negative seed values, so here we
    // transform our original seed into a new (positive) seed value with which we
    // create a new generator.
    if (seed < 0) {
        var gen = randomGenerator(Math.abs(seed));
        for (var i = 0; i < 23; i += 1) {
            gen();
        }
        return randomGenerator(gen(0, 10000));
    }

    // Based on random number generator from
    // http://indiegamr.com/generate-repeatable-random-numbers-in-js/
    return function (min, max) {
        min = min || 0;
        max = max || 1;
        seed = (seed * 9301 + 49297) % 233280;
        var v = seed / 233280;
        return min + v * (max - min);
    };
};

var flatten = function (arg) {
	var arr = Array.prototype.slice.call(arg);
	var args = [];
	for (var i = 0; i < arr.length; i += 1) {
		var o = arr[i];
		if (Array.isArray(o)) {
			for (var j = 0; j < o.length; j += 1) {
				args.push(o[j]);
			}
		} else {
			args.push(o);
		}
	}
	return args;
};

exports.randomGenerator = randomGenerator;
exports.flatten = flatten;