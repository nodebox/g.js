---
layout: ref
title: glow
description: Apply a glow to an image.
categories: [ref]
---
Apply a glow to an image.

    var i = g.import('butterfly.jpg');
    g.glow(i, 150, 3);

## Parameters
- `image`: The input image.
- `amount`: The amount of glowing to apply.
- `kernelSize`: kernel size of the filter.

## Related Guides
- [Imaging](../guide/image.html)
