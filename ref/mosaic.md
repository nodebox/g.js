---
layout: ref
title: mosaic
tags: image
---
Pixelate the image.

    var i = grob.import('leaf.jpg');
    grob.mosaic(i, 10);

## Parameters
- `image`: The input image.
- `blockSize`: The size of a single colored block in the image.
