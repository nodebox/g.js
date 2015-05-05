---
layout: ref
title: pinch
tags: image
---
Apply pinch distortion to an image.

    var i = grob.import('butterfly.jpg');
    grob.pinch(i, {x: 0, y: 0}, 75);

## Parameters
- `image`: The input image.
- `position`: The center point of the distortion on the image.
- `zoom`: The amount of bulge (negative values down to -100) or pinch (positive values up to 100)
