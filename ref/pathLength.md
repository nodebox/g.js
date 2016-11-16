---
layout: ref
title: pathLength
description: Get the contour length of the path.
categories: [ref]
---
Get the contour length of the path.

    var r = g.rect(0, 0, 100, 100);
    // Four corners = 100 + 100 + 100 + 100
    g.pathLength(r);

For circles and curves, an *approximation* of the length is used. This is almost always accurate enough.

    var e = g.ellipse(0, 0, 100, 100);
    g.pathLength(e);

If you really need to, you can control the precision using an optional parameter (the default is `20`):

    var e = g.ellipse(0, 0, 100, 100);
    g.pathLength(e, {precision: 1000});

## Parameters
- `shape`: The input shape.

## See Also
- [pointOnPath](/ref/pointOnPath.html): Calculate a point along the path.


## Related Guides
- [Vector Graphics](/guide/vector.html)
