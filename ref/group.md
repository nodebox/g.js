---
layout: ref
title: group
description: Combine multiple shapes together.
categories: [ref]
---
Combine multiple shapes together.

    var r = g.rect({x: -75, y: 0}, 100, 100);
    var e = g.ellipse({x: 75, y: 0}, 100, 100);
    g.group(r, e);

This is often used with [align](/ref/align.html) to position shapes as a whole.

## Parameters
- `shapes`: The list of shapes to group.

## See Also
- [ungroup](/ref/ungroup.html): Decompose the input group into a list of paths.

## Related Guides
- [Vector Graphics](/guide/vector.html)
