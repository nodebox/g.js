---
layout: ref
title: posterize
tags: image
---
Posterize an image.

    var i = grob.import('butterfly.jpg');
    grob.posterize(i, 4);

Posterization selects the most dominant `levels` colors from the red, green and blue channel.

## Parameters
- `image`: The input image.
- `levels`: The number of levels in each RGB channel (minimum = 2).
