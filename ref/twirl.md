---
layout: ref
title: twirl
tags: image
---
Apply twirl distortion to an image.

    var i = grob.import('butterfly.jpg');
    grob.twirl(i, {x: 0, y: 0}, 70, 300);

## Parameters
- `image`: The input image.
- `position`: The center point of the distortion on the image.
- `radius`: The radius over which to apply the distortion.
- `angle`: The amount of rotation.
