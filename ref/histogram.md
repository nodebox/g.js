---
layout: ref
title: histogram
description: Show the statistical distribution of color channel values inside an image.
categories: [ref]
---
Show the statistical distribution of color channel values inside an image.

    var i = g.import('leaf.jpg');
    g.histogram(i, 'lum');

## Parameters
- `image`: The input image.
- `channel`: The channel to get the values from, either of 'lum' (luminance of the pixel), 'red', 'green', 'blue' and 'alpha' values.
- `relative`: When true, divide the numbers in the list so that their sum total becomes 1, otherwise just return the number of occurrences.

## Related Guides
- [Imaging](../guide/image.html)
