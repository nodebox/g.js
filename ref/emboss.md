---
layout: ref
title: emboss
tags: image
---
Apply an embossing filter to an image to give it a 3D shadow effect.

    var i = grob.import('butterfly.jpg');
    grob.emboss(i, 120);

## Parameters
- `image`: The input image.
- `amount`: The amount of embossing.
- `angle`: The embossing angle.
