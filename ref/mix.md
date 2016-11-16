---
layout: ref
title: mix
description: Linearly interpolate between two values.
categories: [ref]
---
Linearly interpolate between two values.

    g.mix(0, 100, 0.5)

Mix works with colors:

    var red = {r: 255, g: 0, b: 0};
    var blue = {r: 0, g: 0, b: 255};
    g.mix(red, blue, 0.2);

Also, points. Basically any kind of nested data:

    var a = {x: -100, y: -50};
    var b = {x: 100, y: 50};
    var c = g.mix(a, b, 0.5);
    [a, b, c]

The last parameter is the "position", or percentage of the mix, ranging from `0.0` (all the way to the first value) to `1.0` (all the way to the second value).

The position can also go "out of bounds" thereby resulting in values that are larger or smaller than the inputs:

    g.mix(0, 100, 1.5)

## Parameters
- `a`: The first value.
- `b`: The second value.
- `t`: The interpolation position (between `0.0` and `1.0`).

## Related Guides
- [Math](../guide/math.html)
- [Geometry](../guide/geometry.html)
- [Working with Color](../guide/color.html)
