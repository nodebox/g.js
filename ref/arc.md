---
layout: ref
title: arc
description: Create an arc, pie or wedge shape.
categories: [ref]
---
Create an arc, pie or wedge shape.

    g.arc({x: 0, y: 0}, 100, 100, 0, 150, 'pie');

## Parameters
- `position`: The center point of the arc.
- `width`: The width of the arc.
- `height`: The height of the arc.
- `startAngle`: The starting angle of the arc. Note that 0 degrees starts at 3 o’clock, not 12 o'clock.
- `degrees`: The angle of the arc, in degrees.
- `type`: The type of arc (options are `pie`, `chord` or `open`).

## Related Guides
- [Vector Graphics](../guide/vector.html)
