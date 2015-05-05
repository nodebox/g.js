---
layout: ref
title: colorLookup
tags: [color, vector, image]
---
Lookup the RGB or HSB value of a color.


    var col = grob.hsbColor(120, 255, 255, 255, 255);
    grob.colorLookup(col, 'h');
<br>

    var col = grob.rgbColor(120, 255, 255, 255, 255);
    grob.colorLookup(col, 'b');

## Parameters
- `color`: The hue or tint of the color.
- `component`: Options are: 'r', 'g', 'b' for retrieving the red, green or blue component and 'h', 's' and 'b' for hue, saturation and brightness component. The return value is between 0 and 1.
