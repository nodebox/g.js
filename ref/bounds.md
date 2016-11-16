---
layout: ref
title: bounds
description: Get the bounds of a shape.
categories: [ref]
---
Get the bounds of a shape.
    
    g.bounds(g.ellipse({x:0, y:0}, 50, 50));

You can use [lookup](/ref/lookup.html) to retrieve a specific component, e.g. the `width`:

    var b = g.bounds(g.ellipse({x:0, y:0}, 50, 50));
    g.lookup(b, 'width');


## Parameters
- `shape`: The input shape.

## Related Guides
- [Vector Graphics](/guide/vector.html)
- [Geometry](/guide/geometry.html)