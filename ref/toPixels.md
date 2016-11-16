---
layout: ref
title: toPixels
description: Convert an image to a list of pixels.
categories: [ref]
---
Convert an image to a list of pixels.

    var i = g.import('leaf.jpg');
    g.toPixels(i, 10);

Afterwards, use [lookup](/ref/lookup.html) to retrieve the `color` value.

## Parameters
- `image`: The image to convert.
- `step`: The "step size", or size between each pixel. Smaller step sizes are slower. A step size of "1" will show all pixels. 
