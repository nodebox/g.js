---
layout: ref
title: polygon
tags: vector
---
Create a multi-sided polygon.

A triangle:

    grob.polygon({x: 0, y: 0}, 50, 3, true);

An octagon:

    grob.polygon({x: 0, y: 0}, 50, 8, true);

## Parameters
- `position`: The center point.
- `radius`: The size / 2.
- `sides`: The number of sides.
- `align`: If `true`, aligns the polygon to the horizontal axis.
