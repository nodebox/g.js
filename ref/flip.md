---
layout: ref
title: flip
tags: [image, vector]
---
Flip a shape or image.

    var i = grob.import('butterfly.jpg');
    [i,
     grob.flip(i, 'horizontal'),
     grob.flip(i, 'vertical'),
     grob.flip(i, 'both')]


## Parameters
- `image`: The input image.
- `flip`: How the image should be flipped: `horizontal`, `vertical` or `both`.
