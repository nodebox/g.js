---
layout: ref
title: colorAdjust
tags: [color, image, vector]
---
Increase or decrease indiviual color values.

    var i = grob.import('butterfly.jpg');
    grob.colorAdjust(i, {hue: 10, brightness: -5});

## Parameters
- `v`: The input object: an image, path, group or color.
- `options`: One or many of `saturation`, `hue`, `brightness`, `red`, `green`, `blue` or `alpha`.
