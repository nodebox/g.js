---
layout: ref
title: reflect
tags: vector
---
Mirror the geometry around an invisible axis.

    var e = grob.ellipse({x: -75, y: 0}, 100, 100);
    grob.mirror(e, {x: 0, y:0}, 90, true);

## Parameters
- `shape`: The input shape.
- `position`: The center point of the mirror operation.
- `angle`: The angle, in degrees, at which to mirror the shape.
- `keepOriginal`: If `true`, also keeps the original geometry.
