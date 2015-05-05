---
layout: ref
title: translate
tags: [image, vector]
---
Move the shape, changing its position.

    var r = grob.rect({x: 0, y: 0}, 50, 50);
    grob.translate(r, {x: 80, y: 30});

## Parameters
- `shape`: The input shape.
- `translate`: The amount of translation, as a point.

## See Also
- [rotate](/ref/rotate.html): Rotate the shape.
- [scale](/ref/scale.html): Scale the shape.
