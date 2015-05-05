---
layout: ref
title: link
tags: vector
---
Generate a visual link between two shapes.

    var r1 = grob.rect({x: -75, y: -50}, 1, 20);
    var r2 = grob.rect({x: 75, y: 30}, 1, 80);
    grob.link(r1, r2, 'horizontal');

Note that the original shapes are not included: they just serve as reference templates for creating the link shape. Use `g.merge` if you want to combine everything together:

    var r1 = grob.rect({x: -75, y: -50}, 5, 20);
    r1 = g.colorize(r1, 'red');
    var r2 = grob.rect({x: 75, y: 30}, 5, 80);
    r2 = grob.colorize(r2, 'blue');
    var l = grob.link(r1, r2, 'horizontal');
    grob.merge(r1, r2, l);

## Parameters
- `shape1`: The first bounding volume of the link shape.
- `shape2`: The second bounding volume of the link.
- `orientation`: The direction of the link shape, either `horizontal` or `vertical`.
