---
layout: ref
title: resampleByLength
description: Distribute points along a shape by segment length.
categories: [ref]
---
Distribute points along a shape by segment length.

    var e = g.ellipse({x: 0, y: 0}, 100, 100);
    g.resampleByLength(e, 30);


The second parameter defines the *maximum* length for each segment. Segments can be shorter, e.g. for the last segment.

This function recalculates new line segments along the outline of the original shape. This can be used to change the points afterwards:

    var e = g.ellipse({x: 0, y: 0}, 100, 100);
    var r = g.resampleByLength(e, 100);
    g.wigglePoints(r, 5, 0);


Unlike [resampleByAmount](/ref/resampleByAmount.html), we don't know how many points this function will generate. This is useful for shapes that dynamically change size.

## Parameters
- `shape`: The input shape.
- `maxLength`: The maximum length of a segment.

## Related Guides
- [Vector Graphics](/guide/vector.html)
