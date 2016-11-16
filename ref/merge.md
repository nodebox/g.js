---
layout: ref
title: merge
description: Combine different shapes into one.
categories: [ref]
---
Combine different shapes into one.

    var r = g.rect({x: -75, y: 0}, 100, 100);
    var e = g.ellipse({x: 75, y: 0}, 100, 100);
    g.merge(r, e);

## Parameters

- `shape1`: First input shape.
- `shape2`: Second input shape.
- `shape3`: Third input shape.
- `...`

You don't have to use all of the parameters, so you can use this function to combine just 3 shapes as well.


## Related Guides
- [Vector Graphics](../guide/vector.html)
