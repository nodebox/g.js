---
layout: ref
title: stack
description: Arrange shapes in a horizontal or vertical layout.
categories: [ref]
---
Arrange shapes in a horizontal or vertical layout.

    var r1 = g.rect({x: 0, y: 0}, 20, 20);
    var r2 = g.rect({x: 0, y: 0}, 30, 30);
    g.stack([r1, r2], 's', 10);

Note that the first shape stays at its original position. Subsequent shapes will be placed adjacent to each other.

## Parameters
- `shapes`: A list of input shapes.
- `direction`: The layout direction, either north (`n`), south (`s`), east (`e`) or west (`w`).
- `margin`: The spacing between each of the shapes.

## Related Guides
- [Vector Graphics](/guide/vector.html)
