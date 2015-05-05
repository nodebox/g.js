---
layout: ref
title: shapeOnPath
tags: path
---
Copies shapes on a target path.

    var src = grob.ellipse({x: 0, y: 0}, 5, 5);
    var template = grob.ellipse({x: 0, y: 0}, 100, 100);
    grob.shapeOnPath([src], template, 10, 'trailing', 20, 0, 0);

## Parameters
- `shapes`: The shape(s) to copy. This has to be a list.
- `path`: The path on which to copy the shape(s).
- `amount`: The amount of copies.
- `alignment`: The way to lay out the shapes horizontally (`trailing` or `distributed`).
- `spacing`: The spacing between the shapes.
- `margin`: Empty space before and/or after the shapes.
- `baselineOffset`: The vertical offset of the shapes from the baseline.
