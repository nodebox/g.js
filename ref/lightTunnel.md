---
layout: ref
title: lightTunnel
tags: image
---
Apply a light tunnel distortion to an image.

    var i = grob.import('butterfly.jpg');
    grob.lightTunnel(i, {x: 0, y: 0}, 80);

## Parameters
- `image`: The input image.
- `position`: The center point of the distortion on the image.
- `radius`: The radius of the unaffected area in pixels.
