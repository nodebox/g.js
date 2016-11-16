---
layout: ref
title: bump
description: Apply bump distortion to an image.
categories: [ref]
---
Apply bump distortion to an image.

    var i = g.import('butterfly.jpg');
    g.bump(i, {x: 0, y: 0}, 150, 55);

## Parameters
- `image`: The input image.
- `position`: The center point of the distortion on the image.
- `radius`: The radius over which to apply the distortion.
- `zoom`: The amount of bumping (0-100).