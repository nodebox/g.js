---
layout: ref
title: curve
description: Create a quadratic curve with one off-curve point.
categories: [ref]
---
Create a quadratic curve with one off-curve point.

    g.curve({x: -100, y: 0}, {x: 100, y: 0}, 0.5, -100);

## Parameters
- `point1`: The starting point of the curve.
- `point2`: The ending point of the curve.
- `t`: The position of the off-curve point [0 - 1].
- `distance`: The offset of the curve from a straight line.

## Related Guides
- [Vector Graphics](/guide/vector.html)
