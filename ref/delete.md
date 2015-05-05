---
layout: ref
title: delete
tags: vector
---
Delete points or paths based on a bounding path.

      var points = grob.grid(10, 10, 100, 100, {x: 0, y: 0});
      var bounding = grob.ellipse({x: 0, y: 0}, 100, 100);
      grob.delete(points, bounding, 'points', true);

<br>

      var points = grob.grid(10, 10, 100, 100, {x: 0, y: 0});
      var shapes = grob.ellipse(points, 15, 15);
      var bounding = grob.ellipse({x: 0, y: 0}, 50, 50);
      grob.delete(shapes, bounding, 'paths', true);

## Parameters
- `shape`: The input shape or points.
- `bounding`: The shape used to take a selection
- `deleteSelected`: Delete the selected of unselected shapes/points.
