---
layout: ref
title: snap
description: Snap geometry to a grid.
categories: [ref]
---
Snap geometry to a grid.

    var e = g.ellipse({x: 0, y: 0}, 100, 100);
    g.snap(e, 50, 0.75);

## Parameters
- `shape`: The input shape.
- `distance`: The size of the grid cells.
- `strength`: The strength of attraction to the grid (0 = no influence, 1 = all points are strictly on the grid).
- `position`: The position of the grid (default = 0,0).

## Related Guides
- [Vector Graphics](../guide/vector.html)
