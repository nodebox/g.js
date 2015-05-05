---
layout: ref
title: align
tags: [image, vector]
---
Align a shape in relation to the origin.

    var e = g.ellipse({x: 0, y: 0}, 50, 50);
    grob.align(e, {x: 0, y: 0}, 'left', 'top');

## Parameters
- `shape`: The input shape.
- `position`: The alignment point.
- `hAlign`: The horizontal alignment (options are `left`, `right` and `center`).
- `vAlign`: The vertical alignment (options are `top`, `bottom` and `middle`).
