---
layout: ref
title: ungroup
description: Decompose the input group into a list of paths.
categories: [ref]
---
Decompose the input group into a list of paths.

    var r = g.rect({x: -75, y: 0}, 100, 100);
    var e = g.ellipse({x: 75, y: 0}, 100, 100);
    var group = g.group(r, e);
    g.ungroup(group);

## Parameters
- `shapes`: The shape or list of shapes to ungroup.

## See Also
- [group](/ref/group.html): Combine multiple shapes together.

## Related Guides
- [Vector Graphics](/guide/vector.html)
