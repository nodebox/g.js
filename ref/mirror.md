---
layout: ref
title: mirror
description: Mirror the geometry around an invisible axis.
categories: [ref]
---
Mirror the geometry around an invisible axis.

    var e = g.ellipse({x: -75, y: 0}, 100, 100);
    g.mirror(e, 90, {x: 0, y: 0}, true);

## Parameters
- `shape`: The input shape.
- `angle`: The angle, in degrees, at which to mirror the shape.
- `position`: The center point of the mirror operation.
- `keepOriginal`: If `true`, also keeps the original geometry.

## See Also
- [flip](flip.html): Flip the input shape or image.

## Related Guides
- [Vector Graphics](../guide/vector.html)
