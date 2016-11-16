---
layout: ref
title: hslAdjust
description: Adjust hue, saturation and lightness of a shape.
categories: [ref]
---
Adjust hue, saturation and lightness of a shape.

    var logo = g.import('logo.svg');
    logo = g.fit(logo, {x: 0, y: 0}, 130, 130);
    logo = g.colorize(logo, 'pink', 'lime', 4);
    g.hslAdjust(logo, 0, 0.4, 0.5, 1)

## Parameters
- `v`: The input shape.
- `hue`: The hue adjusment.
- `saturation`: The saturation adjusment.
- `lightness`: The lightness adjustment.
- `alpha`: The lightness adjustment (optional).

## Related Guides
- [Vector Graphics](../guide/vector.html)
- [Working with Color](../guide/color.html)
