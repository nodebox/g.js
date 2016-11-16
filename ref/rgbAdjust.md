---
layout: ref
title: rgbAdjust
description: Adjust red, green, blue and alpha values of an input object.
categories: [ref]
---
Adjust red, green, blue and alpha values of an input object.

    var logo = g.import('logo.svg');
    logo = g.fit(logo, {x: 0, y: 0}, 130, 130);
    logo = g.colorize(logo, 'lightblue', 'purple', 4);
    g.rgbAdjust(logo, 0, 0, -0.5);

## Parameters
- `v`: The input object: an image, path, group or color.
- `red`: The red adjustment.
- `green`: The green adjustment.
- `blue`: The blue adjustment.
- `alpha`: The alpha adjustment (optional).


## Related Guides
- [Working with Color](/guide/color.html)
- [Vector Graphics](/guide/vector.html)
