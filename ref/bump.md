---
layout: ref
title: bump
tags: image
---
Apply bump distortion to an image.

    var i = grob.import('butterfly.jpg');
    grob.bump(i, {x: 0, y: 0}, 150, 55);

## Parameters
- `image`: The input image.
- `position`: The center point of the distortion on the image.
- `radius`: The radius over which to apply the distortion.
- `zoom`: The amount of bumping (0-100).
