---
layout: ref
title: wiggle
tags: vector
---
Shift elements of a shape by a random amount.

Here, wiggle shifts the points of a path:

    var e = grob.star({x: 0, y: 0}, 5, 100, 20);
    grob.wiggle(e, 'points', {x: 5, y: 5}, 0);

It can also shift the individual elements of a group:

    var r1 = grob.rect({x: -50, y: 0}, 20, 20);
    var r2 = grob.rect({x:  0, y: 0}, 20, 20);
    var r3 = grob.rect({x: 50, y: 0}, 20, 20);
    var group = grob.group([r1, r2, r3]);
    grob.wiggle(group, 'paths', {x: 0, y: 20}, 1);

`wiggle` is often used in combination with [resample](/ref/resample.html) to make shapes look hand-drawn:

    var e = grob.ellipse({x: 0, y: 0}, 100, 100);
    var r = grob.resample(e, 'amount', null, 100, false);
    grob.wiggle(r, 'points', {x: 2, y: 2}, 0);

## Parameters
- `shape`: The input shape.
- `scope`: The type of objects to wiggle: `points`, `paths` or `contours`.
- `offset`: The maximum amount of translation.
- `seed`: The random variation.
