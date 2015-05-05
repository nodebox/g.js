---
layout: ref
title: toBitmap
tags: [image, vector]
---
Convert a vector shape to a bitmap.

    var shape = grob.polygon({x: 0, y: 0}, 50, 6, true);
    shape = grob.colorize(shape, 'fuchsia', 'black', 2);
    grob.toBitmap(shape, g.rect({x: 0, y: 0}, 240, 160));

It can then be used as an image:

    var shape = grob.polygon({x: 0, y: 0}, 50, 6, true);
    shape = grob.colorize(shape, 'lightgreen', 'orange', 2);
    var i = grob.toBitmap(shape, g.rect({x: 0, y: 0}, 240, 160));
    grob.splash(i, {x: 0, y: 0}, 46);

## Parameters
- `shape`: The input shape.
- `bounding`: The bounding rectangle of the area around the shape which should be copied into a bitmap. If left out, it uses the bounding box of the shape.
