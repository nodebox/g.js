---
layout: ref
title: dent
tags: image
---
Apply dent distortion to an image.

    var i = grob.import('butterfly.jpg');
    grob.dent(i, {x: 0, y: 0}, 130, 60);

## Parameters
- `image`: The input image.
- `position`: The center point of the distortion on the image.
- `radius`: The radius over which to apply the distortion.
- `zoom`: The amount of denting (0-100).
