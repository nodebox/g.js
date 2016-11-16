---
layout: ref
title: twirl
description: Apply twirl distortion to an image.
categories: [ref]
---
Apply twirl distortion to an image.

    var i = g.import('butterfly.jpg');
    g.twirl(i, {x: 0, y: 0}, 70, 300);

## Parameters
- `image`: The input image.
- `position`: The center point of the distortion on the image.
- `radius`: The radius over which to apply the distortion.
- `angle`: The amount of rotation.

## Related Guides
- [Imaging](../guide/image.html)
