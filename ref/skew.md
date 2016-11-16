---
layout: ref
title: skew
description: Skew the shape.
categories: [ref]
---
Skew the shape.

    var r = g.rect({x: 0, y: 0}, 100, 100);
    g.skew(r, {x: 45, y: 0}, {x: 0, y: 0});

## Parameters
- `shape`: The shape that needs to be scaled.
- `skew`: The skew factor, as a point.
- `origin`: The point around which to skew (default = 0,0).

## Related Guides
- [Vector Graphics](../guide/vector.html)
