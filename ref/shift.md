---
layout: ref
title: shift
description: Move items from the beginning of a list to the end of the list.
categories: [ref]
---
Move items from the beginning of a list to the end of the list.

    g.shift([1, 2, 3, 4], 1)

The shift value can also be negative:

    g.shift([1, 2, 3, 4], -1)

If the shift value is larger than the number of items, it wraps around:

    g.shift([1, 2, 3, 4], 6)

## Parameters
- `l`: The list of items.
- `amount`: The number of places to shift. Can also be negative to shift in the opposite direction.

## Related Guides
- [List Operations](../guide/list.html)

