---
layout: ref
title: deletePaths
description: Delete paths based on a bounding path.
categories: [ref]
---
Delete paths based on a bounding path.

      var points = g.grid(25, 15, 8, 8);
      var shapes = points.map(function(pt) {
          return g.ellipse(pt, 5, 5);
      });
      var bounding = g.ellipse({x: 0, y: 0}, 75, 75);
      g.deletePaths(shapes, bounding, false);

## Parameters
- `shape`: The shapes or points to delete items from.
- `bounding`: The shape used to take a selection
- `invert`: Turn the selection around: delete the shapes that are not part of the selection.

## Related Guides
- [Vector Graphics](/guide/vector.html)