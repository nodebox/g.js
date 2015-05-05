---
layout: ref
title: histogram
tags: image
---
Show the statistical distribution of color channel values inside an image.

    var i = grob.import('leaf.jpg');
    grob.histogram(i, 'lum');

## Parameters
- `image`: The input image.
- `channel`: The channel to get the values from, either of 'lum' (luminance of the pixel), 'red', 'green', 'blue' and 'alpha' values.
- `relative`: If `true`, divide the numbers in the list so that their sum total becomes 1, otherwise just return the number of occurrences.
