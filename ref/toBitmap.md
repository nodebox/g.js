---
layout: ref
title: toBitmap
description: Convert a vector shape to a bitmap.
categories: [ref]
---
Convert a vector shape to a bitmap.

    var shape = g.polygon({x: 0, y: 0}, 50, 6);
    var bounds = g.rect({x: 0, y: 0}, 240, 160);
    g.toBitmap(shape, bounds);

Once it's an image, you can apply image effects:

    var shape = g.polygon({x: 0, y: 0}, 50, 6);
    var bounds = g.rect({x: 0, y: 0}, 240, 160);
    var i = g.toBitmap(shape, bounds);
    g.lightTunnel(i, {x: 0, y: 0}, 46);

## Parameters
- `shape`: The input shape.
- `bounding`: The bounding rectangle of the area around the shape which should be copied into a bitmap. If left out, it uses the bounding box of the shape.

## Related Guides
- [Imaging](/guide/image.html)
