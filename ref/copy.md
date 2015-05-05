---
layout: ref
title: copy
tags: [image, vector]
---
Create multiple copies of a shape.

    var e = grob.ellipse({x: 0, y: 0}, 10, 10);
    grob.copy(e, 6, 'trs', {x: 10, y: 10}, 0, {x: 0, y: 0});

## Parameters
- `shape`: The input shape.
- `copies`: The amount of copies.
- `order`: The order in which to perform translation (`t`), rotation (`r`) and scale (`s`).
- `translate`: The amount to move each copy, as a point delta.
- `rotate`: The angle in degrees to rotate each copy.
- `scale` The amount to scale each copy, as a point delta.

## Examples
By combining translate, rotate and scale you can get some wildly different results:

    grob.copy(grob.ellipse({x: 0, y: 0}, 3, 3), 300, 'rst', {x: 0.2, y: 0}, 23, {x: 0.01, y: 0.01})
---
    var e = grob.ellipse({x: 0, y: 0}, 1, 1);
    e = grob.colorize(e, 'rgba(0, 0, 0, 0.04)');
    grob.copy(e, 50, 'rst', {x: 0, y: 0}, 8, {x: 2, y: 3})
