---
layout: ref
title: scale
tags: [image, vector]
---
Resize the shape by scaling it.

    var r = grob.rect({x: 0, y: 0}, 100, 100);
    grob.scale(r, {x: 10, y: 50}, {x: 0, y: 0});

Note that scale values are in percentages, so a scale of `20` is 20% of the original shape:

    var r = grob.rect({x: 0, y: 0}, 100, 100);
    grob.scale(r, 20);

## Parameters
- `shape`: The input shape.
- `scale`: The scale factor, as a point.
- `origin`: The point around which to scale (default = 0,0).

## See Also
- [translate](/ref/translate.html): Move the shape.
- [rotate](/ref/rotate.html): Rotate the shape.
