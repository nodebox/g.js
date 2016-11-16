---
layout: ref
title: pinch
description: Apply pinch distortion to an image.
categories: [ref]
---
Apply pinch distortion to an image.

    var i = g.import('butterfly.jpg');
    g.pinch(i, {x: 0, y: 0}, 75);

## Parameters
- `image`: The input image.
- `position`: The center point of the distortion on the image.
- `zoom`: The amount of bulge (negative values down to -100) or pinch (positive values up to 100)

## Related Guides
- [Imaging](../guide/image.html)
