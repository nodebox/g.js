---
layout: ref
title: crop
description: Crop an image.
categories: [ref]
---
Crop an image.

    var i = g.import('butterfly.jpg');
    g.crop(i, g.rect({x: 4, y: 0}, 170, 100));

## Parameters
- `image`: The input image.
- `bounding`: The bounding rectangle of the cropped area.

## Related Guides
- [Imaging](/guide/image.html)
