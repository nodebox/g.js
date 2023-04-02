"use strict";

import randomGenerator from "./random";
import { noise } from "./vg";

const TWO_PI = Math.PI * 2;

export const abs = Math.abs;

function _checkIfFirstArgIsArray(args) {
  if (args.length === 1 && Array.isArray(args[0])) {
    args = args[0];
  }
  return args;
}

export function accumulate(...args) {
  args = _checkIfFirstArgIsArray(args);
  const result = [];
  let sum = 0;
  for (let i = 0; i < args.length; i++) {
    sum += args[i];
    result.push(sum);
  }
  return result;
}

export function add(...args) {
  if (args.length === 2) {
    return args[0] + args[1];
  }
  return args.reduce((a, b) => a + b);
}

export function and(...args) {
  var argLength = args.length;
  if (argLength === 2) {
    return args[0] && args[1];
  } else if (argLength === 1) {
    return !!args[0];
  } else if (argLength === 0) {
    throw new Error("Wrong number of arguments");
  }
  return args.reduce((a, b) => a && b, true);
}

export function average(...args) {
  args = _checkIfFirstArgIsArray(args);
  if (args.length === 0) {
    return 0;
  }
  return args.reduce((a, b) => a + b, 0) / args.length;
}

export function boolean(v) {
  return !!v;
}

export const ceil = Math.ceil;

export function clamp(v, min, max) {
  min = typeof min === "number" ? min : 0;
  max = typeof max === "number" ? max : 1;
  return v < min ? min : v > max ? max : v;
}

export function compare(v1, v2, comparator) {
  if (comparator === "<") {
    return v1 < v2;
  } else if (comparator === ">") {
    return v1 > v2;
  } else if (comparator === "<=") {
    return v1 <= v2;
  } else if (comparator === ">=") {
    return v1 >= v2;
  } else if (comparator === "==") {
    return v1 === v2;
  } else if (comparator === "!=") {
    return v1 !== v2;
  }
  throw new Error("Unknown comparison operation " + comparator);
}

export const cos = Math.cos;

export function degrees(radians) {
  return (radians * 180) / Math.PI;
}

export function divide(...args) {
  var argLength = args.length;
  function checkIfZero(arg) {
    if (arg === 0) {
      throw new Error("Divide by zero");
    }
  }
  if (args === 2) {
    checkIfZero(args[1]);
    return a / args[1];
  } else if (argLength === 1) {
    return a;
  } else if (argLength === 0) {
    throw new Error("Wrong number of arguments");
  }
  return args.reduce((a, b) => {
    checkIfZero(b);
    return a / b;
  });
}

export function e() {
  return Math.E;
}

export function even(v) {
  return v % 2 === 0;
}

export const floor = Math.floor;

export function integer(v) {
  return v | 0;
}

export function log(v) {
  return v > 0 ? Math.log(v) : -Math.log(-v);
}

export function makeNumbers(s, separator) {
  if (!s) {
    return [];
  }
  if (!separator) {
    separator = "";
  }
  var i,
    num,
    numbers = [],
    strings = s.split(separator);
  for (i = 0; i < strings.length; i += 1) {
    num = parseFloat(strings[i]);
    if (num === 0 || num) {
      numbers.push(num);
    }
  }
  return numbers;
}

export function max(...args) {
  args = _checkIfFirstArgIsArray(args);
  if (args.length === 0) {
    return 0;
  }
  return Math.max.apply(null, args);
}

export function min(...args) {
  args = _checkIfFirstArgIsArray(args);
  if (args.length === 0) {
    return 0;
  }
  return Math.min.apply(null, args);
}

export function mod(a, b) {
  return a % b;
}

export function multiply(...args) {
  var argLength = args.length;
  if (argLength === 2) {
    return args[0] * args[1];
  } else if (argLength === 1) {
    return args[0];
  }
  return args.reduce((a, b) => a * b, 1);
}

export function negate(v) {
  return -v;
}

export function not(bool) {
  return !bool;
}

export function number(v) {
  return v;
}

export function odd(v) {
  return v % 2 !== 0;
}

export function or(...args) {
  var argLength = args.length;
  if (argLength === 2) {
    return args[0] || args[1];
  } else if (argLength === 1) {
    return !!args[0];
  } else if (argLength === 0) {
    throw new Error("Wrong number of arguments");
  }
  return args.reduce((a, b) => a || b, false);
}

// Compute Perlin noise
export function perlinNoise(x, y, z) {
  // Call optimized internal noise function.
  return noise(x, y, z);
}

export function pi() {
  return Math.PI;
}

export const pow = Math.pow;

export function radians(degrees) {
  return (degrees * Math.PI) / 180;
}

export function randomNumbers(amount, min, max, seed) {
  var argLength = arguments.length;
  if (argLength < 4 || (!seed && seed !== 0)) {
    seed = Math.random();
  }
  if (argLength === 3 || argLength === 4) {
    min = min || 0;
    max = max || (max === 0 ? 0 : 1);
  } else if (argLength === 2) {
    max = min || (min === 0 ? 0 : 1);
    min = 0;
  } else if (argLength === 1) {
    min = 0;
    max = 1;
  }
  if (max < min) {
    var tmp = max;
    max = min;
    min = tmp;
  }
  var v;
  var delta = max - min;
  var numbers = [];
  var rand = randomGenerator(seed || 0);
  for (var i = 0; i < amount; i += 1) {
    v = min + rand(0, 1) * delta;
    numbers.push(v);
  }
  return numbers;
}

export function range(min, max, step, includeMax) {
  if (min === max) {
    return [];
  }
  if (step !== 0) {
    step = step || (min < max ? 1 : -1);
  }
  if (step > 0 && min > max) return [];
  if (step < 0 && min < max) return [];
  if (step === 0) return [];
  var values = [];
  var i;
  if (min < max) {
    if (!!includeMax) {
      for (i = min; i <= max; i += step) {
        values.push(i);
      }
    } else {
      for (i = min; i < max; i += step) {
        values.push(i);
      }
    }
  } else {
    if (!!includeMax) {
      for (i = min; i >= max; i += step) {
        values.push(i);
      }
    } else {
      for (i = min; i > max; i += step) {
        values.push(i);
      }
    }
  }
  return values;
}

export function round(v, a) {
  a = a | 0;
  if (!a) {
    return Math.round(v);
  }
  return Math.round(v / a) * a;
}

export function sample(amount, min, max, circular) {
  var d,
    values = [],
    i;
  values.length = amount;
  if (circular) {
    d = (max - min) / amount;
  } else {
    d = (max - min) / (amount - 1);
  }
  for (i = 0; i < amount; i += 1) {
    values[i] = min + i * d;
  }
  return values;
}

export function sineWave(v, min, max, period, offset) {
  if (min === undefined) min = -1;
  if (max === undefined) max = 1;
  if (period === undefined) period = 1;
  if (offset === undefined) offset = 0;
  var amplitude = (max - min) / 2;
  return (
    min + amplitude + Math.sin(((offset + v) * TWO_PI) / period) * amplitude
  );
}

export function squareWave(v, min, max, period, offset) {
  if (min === undefined) min = -1;
  if (max === undefined) max = 1;
  if (period === undefined) period = 1;
  if (offset === undefined) offset = 0;
  var halfPeriod = period / 2;
  var d = (v + offset) % period;
  if (d < halfPeriod) {
    return max;
  } else {
    return min;
  }
}

export function triangleWave(v, min, max, period, offset) {
  if (min === undefined) min = -1;
  if (max === undefined) max = 1;
  if (period === undefined) period = 1;
  if (offset === undefined) offset = 0;
  var amplitude = (max - min) / 2,
    frequency = TWO_PI / period,
    phase = 0,
    time = v + offset + period / 4;
  if (time % period !== 0) {
    phase = (time * frequency) % TWO_PI;
  }
  if (phase < 0) {
    phase += TWO_PI;
  }
  return 2 * amplitude * (1 + -Math.abs((phase / TWO_PI) * 2 - 1)) + min;
}

export function sawtoothWave(v, min, max, period, offset) {
  if (min === undefined) min = -1;
  if (max === undefined) max = 1;
  if (period === undefined) period = 1;
  if (offset === undefined) offset = 0;
  var amplitude = (max - min) / 2,
    frequency = TWO_PI / period,
    phase = 0,
    time = v + offset;
  if (time % period !== 0) {
    phase = (time * frequency) % TWO_PI;
  }
  if (phase < 0) {
    phase += TWO_PI;
  }
  return 2 * (phase / TWO_PI) * amplitude + min;
}

export function sign(v) {
  if (v > 0) {
    return 1;
  } else if (v === 0) {
    return 0;
  } else {
    return -1;
  }
}

export const sin = Math.sin;

export const sqrt = Math.sqrt;

export function subtract(...args) {
  var argLength = args.length;
  if (argLength === 2) {
    return args[0] - args[1];
  } else if (argLength === 1) {
    return -args[0];
  } else if (argLength === 0) {
    throw new Error("Wrong number of arguments");
  }
  return args.reduce((total, n) => total - n);
}

export const tan = Math.tan;

export function total(...args) {
  args = _checkIfFirstArgIsArray(args);
  return args.reduce((a, b) => a + b, 0);
}

export function xor(bool1, bool2) {
  var argLength = arguments.length;
  if (argLength === 2) {
    return !!(bool1 ^ bool2);
  } else {
    throw new Error("Wrong number of arguments");
  }
}
