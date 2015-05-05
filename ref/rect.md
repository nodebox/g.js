---
layout: ref
title: rect
tags: vector
---
Create a rectangle or square.

    grob.rect({x: 0, y: 0}, 100, 100);

An optional fourth parameter specifies the corner roundness:

    grob.rect({x: 0, y: 0}, 100, 100, 10);

## Parameters
- `position`: The center point of the rectangle.
- `width`: The width of the rectangle.
- `height`: The height of the ellipse.
- `roundness`: The roundness of the rectangle. This can be a number or a point.
