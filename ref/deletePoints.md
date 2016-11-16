---
layout: ref
title: deletePoints
description: Delete points based on a bounding path.
categories: [ref]
---
Delete points based on a bounding path.

This can delete points from a list of points:

      var points = g.grid(25, 25, 5, 5);
      var bounding = g.ellipse({x: 0, y: 0}, 100, 100);
      g.deletePoints(points, bounding);

Or it can delete points from a path:

      var path = g.textPath('Hello', {x: 0, y: 0}, 'default-font', 72);
      path = g.resampleByLength(path, 2);
      var bounding = g.ellipse({x: 0, y: 0}, 120, 100);
      g.deletePoints(path, bounding);

## Parameters
- `shape`: The shapes or points to delete items from.
- `bounding`: The shape used to take a selection
- `invert`: Turn the selection around: delete the shapes/points that are not part of the selection.

## Related Guides
- [Vector Graphics](../guide/vector.html)
