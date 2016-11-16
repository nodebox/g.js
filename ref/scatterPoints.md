---
layout: ref
title: scatterPoints
description: Generate random points within the boundaries of a shape.
categories: [ref]
---
Generate random points within the boundaries of a shape.

    var e = g.ellipse({x: 0, y: 0}, 100, 100);
    g.scatterPoints(e, 100, 0);

## Parameters
- `shape`: The input shape.
- `amount`: The amount of output points to generate.
- `seed`: The random variation.

## Related Guides
- [Vector Graphics](../guide/vector.html)
