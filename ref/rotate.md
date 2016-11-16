---
layout: ref
title: rotate
description: Rotate the shape according to the given angle.
categories: [ref]
---
Rotate the shape according to the given angle.

    var r = g.rect({x: 0, y: 0}, 100, 100);
    g.rotate(r, 45, {x: 0, y: 0});

Rotate can also be used to move points:

    var points = g.grid(5, 5, 20, 20);
    g.rotate(points, 45);

## Parameters
- `shape`: The shape that needs to be rotated.
- `angle`: The rotation angle (in degrees).
- `origin`: The point around which to rotate (default = 0,0).

## Related Guides
- [Vector Graphics](/guide/vector.html)
- [Geometry](/guide/geometry.html)
