---
layout: ref
title: scale
description: Resize the shape by scaling it.
categories: [ref]
---
Resize the shape by scaling it.

    var r = g.rect({x: 0, y: 0}, 100, 100);
    g.scale(r, {x: 0.1, y: 0.5}, {x: 0, y: 0});

Note that scale values are in fractions, so a scale of `0.2` is 20% of the original shape:

    var r = g.rect({x: 0, y: 0}, 100, 100);
    g.scale(r, 0.2);

## Parameters
- `shape`: The input shape.
- `scale`: The scale factor, as a number or point.
- `origin`: The point around which to scale (default = 0,0).

## Related Guides
- [Vector Graphics](../guide/vector.html)
