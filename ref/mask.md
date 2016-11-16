---
layout: ref
title: mask
description: Use an image as a mask for another image.
categories: [ref]
---
Use an image as a mask for another image.

Given these input images:

    var i1 = g.import('butterfly.jpg');
    var i2 = g.import('butterfly-mask.jpg');
    [i1, i2];

The darker pixels in the source image (the mask) will make the pixels in the destination image become more transparent.

    var i1 = g.import('butterfly.jpg');
    var i2 = g.import('butterfly-mask.jpg');
    g.mask(i1, i2);

The reverse can be achieved by inverting the masking image:

    var i1 = g.import('butterfly.jpg');
    var i2 = g.import('butterfly-mask.jpg');
    g.mask(i1, g.invert(i2));

## Parameters
- `image`: The input image (the destination).
- `mask`: The masking image (the source).

## Related Guides
- [Imaging](../guide/image.html)
