---
layout: ref
title: wiggleContours
description: Shift elements of a shape by a random amount.
categories: [ref]
---
Shift elements of a shape by a random amount.

Here, wiggle shifts the points of a path:

    
    var font = '/static/fonts/FiraSans-Regular.otf';
    var p = g.textPath('Hello', {x: 0, y: 0}, font, 90);
    g.wiggleContours(p, 4, 42);

## Parameters
- `shape`: The input shape.
- `offset`: The maximum amount of translation, either a point or number.
- `seed`: The random variation.

## See Also
- [wigglePaths](/ref/wigglePaths.html): Randomly shift the paths in a group.
- [wigglePoints](/ref/wigglePoints.html): Randomly shift the points of the path.

## Related Guides
- [Vector Graphics](/guide/vector.html)
