---
layout: ref
title: link
description: Generate a visual link between two shapes.
categories: [ref]
---
Generate a visual link between two shapes.

    var r1 = g.rect({x: -75, y: -50}, 1, 20);
    var r2 = g.rect({x: 75, y: 30}, 1, 80);
    g.link(r1, r2, 'horizontal');

Note that the original shapes are not included: they just serve as reference templates for creating the link shape. Use [combine](/ref/combine.html) if you want to merge everything together:

    var r1 = g.rect({x: -75, y: -50}, 5, 20);
    r1 = g.colorize(r1, 'red');
    var r2 = g.rect({x: 75, y: 30}, 5, 80);
    r2 = g.colorize(r2, 'blue');
    var l = g.link(r1, r2, 'horizontal');
    g.combine(r1, r2, l);
    

## Parameters
- `shape1`: The first bounding volume of the link shape.
- `shape2`: The second bounding volume of the link.
- `orientation`: The direction of the link shape, either `horizontal` or `vertical`.

## Related Guides
- [Vector Graphics](/guide/vector.html)
