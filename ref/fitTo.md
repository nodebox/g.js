---
layout: ref
title: fitTo
tags: [image, vector]
---
Fit a shape to another shape.

    var e = grob.ellipse({x: 0, y: 0}, 100, 100);
    var r = grob.rect({x: 0, y: 0}, 200, 150);
    grob.fitTo(e, r);

## Parameters
- `shape`: The input shape.
- `bounding`: The bounding shape to take position, width and height from.
- `stretch`: If `true`, will squash or stretch the shape to fit the target size.
