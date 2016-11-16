---
layout: ref
title: wigglePaths
description: Shift paths of a group by a random amount.
categories: [ref]
---
Shift paths of a group by a random amount.

    var r1 = g.rect({x: -50, y: 0}, 20, 20);
    var r2 = g.rect({x:  0, y: 0}, 20, 20);
    var r3 = g.rect({x: 50, y: 0}, 20, 20);
    var group = g.group([r1, r2, r3]);
    g.wigglePaths(group, {x: 0, y: 20}, 1);


## Parameters
- `shape`: The input group.
- `offset`: The maximum amount of translation.
- `seed`: The random variation.

## See Also
- [wiggleContours](/ref/wiggleContours.html): Randomly shift the contours of the path.
- [wigglePoints](/ref/wigglePoints.html): Randomly shift the points of the path.

## Related Guides
- [Vector Graphics](/guide/vector.html)