---
layout: ref
title: crop
tags: image
---
Crop an image.

    var i = grob.import('butterfly.jpg');
    grob.crop(i, g.rect({x: 4, y: 0}, 170, 100));

## Parameters
- `image`: The input image.
- `bounding`: The bounding rectangle of the cropped area.
