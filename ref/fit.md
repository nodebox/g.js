---
layout: ref
title: fit
description: Fit a shape within bounds.
categories: [ref]
---
Fit a shape within bounds.

    var e = g.ellipse({x: 0, y: 0}, 100, 100);
    g.fit(e, {x: 0, y: 0}, 100, 100);

## Stretch

If `stretch` is `true`, the proportions of the input shape are discarded:

    var e = g.ellipse({x: 0, y: 0}, 100, 100);
    g.fit(e, {x: 0, y: 0}, 50, 120, true);

## Parameters
- `shape`: The input shape.
- `position`: The target center point of the shape.
- `width`: The maximum target width of the shape.
- `height`: The maximum target height of the shape.
- `stretch`: If `true`, stretches the shape to fit in the given width/height.

## See Also
- [fitTo](/ref/fitTo.html): Fit a shape to another shape.

## Related Guides
- [Vector Graphics](/guide/vector.html)
