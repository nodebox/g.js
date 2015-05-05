---
layout: ref
title: shift
tags: list
---
Move items from the beginning of a list to the end of the list.

    grob.shift([1, 2, 3, 4], 1);

The shift value can also be negative:

    grob.shift([1, 2, 3, 4], -1);

If the shift value is larger than the number of items, the list wraps around:

    grob.shift([1, 2, 3, 4], 6);

## Parameters
- `l`: The list of items.
- `amount`: The number of places to shift. Can also be negative to shift in the opposite direction.
