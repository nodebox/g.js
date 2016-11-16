---
layout: ref
title: align
description: Align a shape in relation to the origin.
categories: [ref]
---
Align a shape in relation to the origin.

    var e = g.ellipse(0, 0, 50, 50);
    g.align(e, g.Point.ZERO, 'left', 'top');

## Parameters
- `shape`: The input shape.
- `position`: The alignment point.
- `hAlign`: The horizontal alignment (options are `left`, `right` and `center`).
- `vAlign`: The vertical alignment (options are `top`, `bottom` and `middle`).

## Related Guides
- [Vector Graphics](../guide/vector.html)
