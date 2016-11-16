---
layout: ref
title: toPoints
description: Convert the shape to points that make up the shape.
categories: [ref]
---
Convert the shape to points that make up the shape.

    var r = g.star({x: 0, y: 0}, 5, 100, 40);
    g.toPoints(r);

`toPoints` is often used to generate a set of "template points". We can place new shapes on this template.

Note that executing this directly on certain paths (e.g. text paths) gives weird results:

    var p = g.textPath('Hello', {x: 0, y: 0}, 'default-font', 72);
    g.toPoints(p);

That's why this function is often used in combination with [resampleByLength](resampleByLength) or [resampleByAmount](ref:g.resampleByAmount.html) to create a better distribution of points.

    var p = g.textPath('Hello', {x: 0, y: 0}, 'default-font', 72);
    var r = g.resampleByLength(p, 5);
    g.toPoints(r);

## Related Guides
- [Vector Graphics](../guide/vector.html)
