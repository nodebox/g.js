---
layout: ref
title: snap
tags: vector
---
Snap geometry to a grid.

    var e = g.ellipse({x: 0, y: 0}, 100, 100);
    grob.snap(e, 50, 75, {x: 0, y: 0});

## Parameters
- `shape`: The input shape.
- `distance`: The size of the grid cells.
- `strength`: The strength of attraction to the grid (0 = no influence, 100 = all points are strictly on the grid).
- `position`: The position of the grid (default = [0, 0]).
