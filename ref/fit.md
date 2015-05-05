---
layout: ref
title: fit
tags: [image, vector]
---
Fit a shape within bounds.

    var e = g.ellipse({x: 0, y: 0}, 100, 100);
    grob.fit(e, {x: 0, y: 0}, 100, 100);

## Parameters
- `shape`: The input shape.
- `position`: The target center point of the shape.
- `width`: The maximum target width of the shape.
- `height`: The maximum target height of the shape.
- `stretch`: If `true`, will squash or stretch the shape to fit the target size.
