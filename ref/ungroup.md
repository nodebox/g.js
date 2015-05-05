---
layout: ref
title: ungroup
tags: vector
---
Decompose the input group into a list of paths.

    var r = g.rect({x: -75, y: 0}, 100, 100);
    var e = g.ellipse({x: 75, y: 0}, 100, 100);
    var group = g.group([r, e]);
    grob.ungroup(group);

## Parameters
- `shapes`: The input shapes or list of shapes.
