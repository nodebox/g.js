---
layout: ref
title: ungroup
tags: vector
---
Decompose the input group into a list of paths.

    var r = grob.rect({x: -75, y: 0}, 100, 100);
    var e = grob.ellipse({x: 75, y: 0}, 100, 100);
    var group = grob.group([r, e]);
    grob.ungroup(group);

## Parameters
- `shapes`: The input shapes or list of shapes.
