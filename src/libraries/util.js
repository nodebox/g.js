export function flatten(arg) {
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
}
