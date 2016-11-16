---
layout: ref
title: pointOnPath
description: Calculate a point along the path.
categories: [ref]
---
Calculate a point along the path.

    var path = g.ellipse({x: 0, y: 0}, 100, 100);
    g.pointOnPath(path, 0.5);

## Parameters
- `shape`: The input shape.
- `t`: The relative position on the shape [0 - 1].

## See Also
- [pathLength](/ref/pathLength.html): Get the contour length of the path.

## Related Guides
- [Vector Graphics](/guide/vector.html)
