---
layout: ref
title: resampleByAmount
description: Distribute points along a shape by amount.
categories: [ref]
---
Distribute points along a shape by amount.

    var e = g.ellipse({x: 0, y: 0}, 100, 100);
    g.resampleByAmount(e, 14);

This function recalculates new line segments along the outline of the original shape. This can be used to change the points afterwards:

    var e = g.ellipse({x: 0, y: 0}, 100, 100);
    var r = g.resampleByAmount(e, 100);
    g.wigglePoints(r, 5, 0);

With this function we always know exactly how many points we will generate. However, if you're more concerned with controlling the length of the individual segments, use [resampleByLength](/ref/resampleByLength.html).

## Parameters
- `shape`: The input shape.
- `amount`: The amount of points to generate.
- `perContour`: If `true`, the given amount is per contour, not for the whole path.

## Related Guides
- [Vector Graphics](/guide/vector.html)
