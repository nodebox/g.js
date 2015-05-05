---
layout: ref
title: compound
tags: shape
---
Add, subtract or intersect geometry.

    var e1 = grob.ellipse({x: -20, y: -20}, 100, 100);
    var e2 = grob.ellipse({x: 30, y: 20}, 100, 100);
    grob.compound(e1, e2, 'union')

## Parameters

- `shape1`: The first shape.
- `shape2`: The second shape.
- `method`: The compounding method, one of 'union', 'difference', 'intersection' or 'xor'.

Using the 'difference' method:

    var e1 = grob.ellipse({x: -20, y: -20}, 100, 100);
    var e2 = grob.ellipse({x: 30, y: 20}, 100, 100);
    grob.compound(e1, e2, 'difference')

Using the 'intersection' method:

    var e1 = grob.ellipse({x: -20, y: -20}, 100, 100);
    var e2 = grob.ellipse({x: 30, y: 20}, 100, 100);
    grob.compound(e1, e2, 'intersection')

Using the 'xor' method:

    var e1 = grob.ellipse({x: -20, y: -20}, 100, 100);
    var e2 = grob.ellipse({x: 30, y: 20}, 100, 100);
    grob.compound(e1, e2, 'xor')
