---
layout: ref
title: skew
tags: vector
---
Skew the shape.

    var r = grob.rect({x: 0, y: 0}, 100, 100);
    grob.skew(r, {x: 45, y: 0}, {x: 0, y: 0});

## Parameters
- `shape`: The input shape.
- `skew`: The skew factor, as a point.
- `origin`: The point around which to skew (default = 0,0).
