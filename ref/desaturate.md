---
layout: ref
title: desaturate
description: Desaturate a shape.
categories: [ref]
---
Desaturate a shape.

    var logo = g.import('logo.svg');
    logo = g.fit(logo, {x: 0, y: 0}, 130, 130);
    logo = g.colorize(logo, 'lightblue', 'green', 4);
    g.desaturate(logo)

## Parameters
- `v`: The input shape.

## Related Guides
- [Vector Graphics](../guide/vector.html)
- [Color](../guide/color.html)
