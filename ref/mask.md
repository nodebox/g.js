---
layout: ref
title: mask
tags: image
---
Use an image as a mask for another image.

Given these input images:

    var i1 = grob.import('butterfly.jpg');
    var i2 = grob.import('butterfly-mask.jpg');
    [i1, i2];

The darker pixels in the source image (the mask) will make the pixels in the destination image become more transparent.

    var i1 = grob.import('butterfly.jpg');
    var i2 = grob.import('butterfly-mask.jpg');
    grob.mask(i1, i2);

The reverse can be achieved by inverting the masking image:

    var i1 = grob.import('butterfly.jpg');
    var i2 = grob.import('butterfly-mask.jpg');
    grob.mask(i1, g.invert(i2));

## Parameters
- `image`: The input image (the destination).
- `mask`: The masking image (the source).
