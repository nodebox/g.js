---
layout: ref
title: compound
description: Add, subtract or intersect geometry.
categories: [ref]
---
Add, subtract or intersect geometry.

    var e1 = g.ellipse({x: -20, y: -20}, 100, 100);
    var e2 = g.ellipse({x: 30, y: 20}, 100, 100);
    g.compound(e1, e2, 'union')

Using the 'difference' method:

    var e1 = g.ellipse({x: -20, y: -20}, 100, 100);
    var e2 = g.ellipse({x: 30, y: 20}, 100, 100);
    g.compound(e1, e2, 'difference')

Using the 'intersection' method:

    var e1 = g.ellipse({x: -20, y: -20}, 100, 100);
    var e2 = g.ellipse({x: 30, y: 20}, 100, 100);
    g.compound(e1, e2, 'intersection')

Using the 'xor' method:

    var e1 = g.ellipse({x: -20, y: -20}, 100, 100);
    var e2 = g.ellipse({x: 30, y: 20}, 100, 100);
    g.compound(e1, e2, 'xor')

## Parameters
- `shape1`: The first shape.
- `shape2`: The second shape.
- `method`: The compounding method, one of 'union', 'difference', 'intersection' or 'xor'.

## Related Guides
- [Vector Graphics](../guide/vector.html)
