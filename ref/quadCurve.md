---
layout: ref
title: quadCurve
tags: vector
---
Create a quadratic curve with one off-curve point.

    grob.quadCurve({x: -100, y: 0}, {x: 100, y: 0}, 50, -100);

## Parameters
- `point1`: The starting point of the curve.
- `point2`: The ending point of the curve.
- `t`: The position of the off-curve point (0 - 100).
- `distance`: The offset of the curve from a straight line.
