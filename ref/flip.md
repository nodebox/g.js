---
layout: ref
title: flip
description: Flip a shape or image.
categories: [ref]
---
Flip a shape or image.

    var e = g.polygon({x: 0, y: 0}, 50, 3);
    g.flip(e, 'vertical');
---
    var i = g.import('butterfly.jpg');
    [i,
     g.flip(i, 'horizontal'),
     g.flip(i, 'vertical'),
     g.flip(i, 'both')];

## Parameters
- `image`: The input image.
- `flip`: How the image should be flipped: 'horizontal', 'vertical' or 'both'.

## Related Guides
- [Vector Graphics](/guide/vector.html)
- [Imaging](/guide/image.html)
