---
layout: ref
title: bounds
tags: geometry
---
Call for the bounds of a shape.

    grob.bounds(grob.ellipse({x:0, y:0}, 50, 50))

This returns a `Rect` object containing `x`, `y`, `width` and `height`. You can retrieve width / height using [lookup](/ref/lookup.html).

## Parameters
- `shape`: The input shape.

## See Also
- [centroid](/ref/centroid.html): Get the geometric center of a shape.
