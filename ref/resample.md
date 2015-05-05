---
layout: ref
title: resample
tags: vector
---
Distribute points along a shape.

    var e = grob.ellipse({x: 0, y: 0}, 100, 100);
    grob.resample(e, 'amount', null, 14, false);

This function recalculates new line segments along the outline of the original shape. This can be used to change the points afterwards:

    var e = grob.ellipse({x: 0, y: 0}, 100, 100);
    var r = grob.resample(e, 'amount', null, 100, false);
    grob.wiggle(r, 'points', {x: 5, y: 5}, 0);

## Parameters
- `shape`: The input shape.
- `method`: The method of distribution (`length` or `amount`).
-  `length`: The maximum length of each segment.
- `points`: The amount of output points.
- `perContour`: If `true`, the given amount is per contour, not for the whole path.
