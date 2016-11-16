---
layout: ref
title: fitTo
description: Fit a shape to another shape.
categories: [ref]
---
Fit a shape to another shape.

    var e = g.ellipse({x: 0, y: 0}, 5, 5);
    var r = g.rect({x: 0, y: 0}, 130, 130);
    g.fitTo(e, r);

## Stretch

If `stretch` is `true`, the proportions of the input shape are discarded:

    var e = g.ellipse({x: 0, y: 0}, 100, 100);
    var r = g.rect({x: 0, y: 0}, 50, 130);
    g.fitTo(e, r, true);

## Parameters
- `shape`: The input shape.
- `bounding`: The bounding shape.
- `stretch`: If `true`, stretches the shape to fit in the bounding box.

## See Also
- [fit](fit.html): Fit a shape within bounds.

## Related Guides
- [Vector Graphics](../guide/vector.html)
