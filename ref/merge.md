---
layout: ref
title: merge
tags: vector
---
Combine different shapes into one.

    var r = grob.rect({x: -75, y: 0}, 100, 100);
    var e = grob.ellipse({x: 75, y: 0}, 100, 100);
    grob.merge(r, e);

## Parameters

- `shape1`: First input shape.
- `shape2`: Second input shape.
- `shape3`: Third input shape.
- `...`

You don't have to use all of the parameters, so you can use this function to combine just 3 shapes as well.

Merge only works on shapes; if you'd like to combine multiple colors, numbers or lists use `g.combine`.
