---
layout: ref
title: scatter
tags: vector
---
Generate random points within the boundaries of a shape.

    var e = grob.ellipse({x: 0, y: 0}, 100, 100);
    grob.scatter(e, 100, 0);

## Parameters
- `shape`: The input shape.
- `amount`: The amount of output points to generate.
- `seed`: The [random variation](/guide/randomness.html).
