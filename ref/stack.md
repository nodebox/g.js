---
layout: ref
title: stack
tags: [image, vector]
---
Arrange shapes in a horizontal or vertical layout.

    var r1 = grob.rect({x: 0, y: 0}, 20, 20);
    var r2 = grob.rect({x: 0, y: 0}, 30, 30);
    grob.stack([r1, r2], 's', 10);

Note that the first element is always moved to the center point (0,0).

## Parameters
- `shapes`: A list of input shapes.
- `direction`: The layout direction, either north (`n`), south (`s`), east (`e`) or west (`w`).
- `margin`: The spacing between each of the shapes.
