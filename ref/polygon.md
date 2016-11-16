---
layout: ref
title: polygon
description: Create a multi-sided polygon.
categories: [ref]
---
Create a multi-sided polygon.

A triangle:

    g.polygon({x: 0, y: 0}, 50, 3, true);

An octagon:

    g.polygon({x: 0, y: 0}, 50, 8, true);

## Parameters
- `position`: The center point.
- `radius`: The size / 2.
- `sides`: The number of sides.
- `align`: If `true`, aligns the polygon to the horizontal axis.

## Related Guides
- [Vector Graphics](/guide/vector.html)
