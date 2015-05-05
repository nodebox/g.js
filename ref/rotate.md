---
layout: ref
title: rotate
tags: [image, vector]
---
Rotate the shape according to the given angle.

    var r = grob.rect({x: 0, y: 0}, 100, 100);
    grob.rotate(r, 45, {x: 0, y: 0});

## Parameters
- `shape`: The input shape.
- `angle`: The rotation angle (in degrees).
- `origin`: The point around which to rotate (default = 0,0).

## See Also
- [translate](/ref/translate.html): Move the shape.
- [scale](/ref/scale.html): Scale the shape.
