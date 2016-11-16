---
layout: ref
title: dent
description: Apply dent distortion to an image.
categories: [ref]
---
Apply dent distortion to an image.

    var i = g.import('butterfly.jpg');
    g.dent(i, {x: 0, y: 0}, 130, 60);

## Parameters
- `image`: The input image.
- `position`: The center point of the distortion on the image.
- `radius`: The radius over which to apply the distortion.
- `zoom`: The amount of denting (0-100).

## Related Guides
- [Imaging](/guide/image.html)
