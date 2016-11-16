---
layout: ref
title: invert
description: Invert a color or the colors of a shape.
categories: [ref]
---
Invert a color or the colors of a shape.

    var p = g.rect(0, 0, 100, 100);
    p = g.colorize(p, 'green', 'yellow', 5);
    g.invert(p);

## Parameters
- `v`: The input color or shape.


## Related Guides
- [Vector Graphics](/guide/vector.html)
- [Working with Color](/guide/color.html)