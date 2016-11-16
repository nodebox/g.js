---
layout: ref
title: translate
description: Move the shape, changing its position.
categories: [ref]
---
Move the shape, changing its position.

    var r = g.rect({x: 0, y: 0}, 50, 50);
    g.translate(r, {x: 80, y: 30});

Translate can also be used to move points:

    var points = g.grid(5, 5, 20, 20);
    g.translate(points, {x: 20, y: 20});

## Parameters
- `shape`: The input shape.
- `translate`: The amount of translation, as a point.

## Related Guides
- [Vector Graphics](../guide/vector.html)
