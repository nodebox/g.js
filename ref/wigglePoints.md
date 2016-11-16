---
layout: ref
title: wigglePoints
description: Shift points of the shape by a random amount.
categories: [ref]
---
Shift points of the shape by a random amount.

    var e = g.star({x: 0, y: 0}, 5, 100, 20);
    g.wigglePoints(e, 5, 42);


`g.wiggle` is often used in combination with `g.resample` to make shapes look hand-drawn:

    var e = g.ellipse(0, 0, 100, 100);
    var r = g.resampleByLength(e, 3);
    g.wigglePoints(r, 2, 42);

## Parameters
- `shape`: The input shape.
- `offset`: The maximum amount of translation.
- `seed`: The random variation.

## See Also
- [wiggleContours](/ref/wiggleContours.html): Randomly shift the contours of the path.
- [wigglePaths](/ref/wigglePaths.html): Randomly shift the paths in a group.

## Related Guides
- [Vector Graphics](/guide/vector.html)