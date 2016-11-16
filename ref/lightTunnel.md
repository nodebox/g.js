---
layout: ref
title: lightTunnel
description: Apply a light tunnel distortion to an image.
categories: [ref]
---
Apply a light tunnel distortion to an image.

    var i = g.import('butterfly.jpg');
    g.lightTunnel(i, {x: 0, y: 0}, 80);

## Parameters
- `image`: The input image.
- `position`: The center point of the distortion on the image.
- `radius`: The radius of the unaffected area in pixels.

## Related Guides
- [Imaging](/guide/image.html)
