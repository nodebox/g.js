---
layout: ref
title: glow
tags: image
---
Apply a glow to an image.

    var i = grob.import('butterfly.jpg');
    grob.glow(i, 150, 3);

## Parameters
- `image`: The input image.
- `amount`: The amount of glowing to apply.
- `kernelSize`: kernel size of the filter.
