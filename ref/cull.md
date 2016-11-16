---
layout: ref
title: cull
description: Keep only items from the list where the corresponding boolean is `true`.
categories: [ref]
---
Keep only items from the list where the corresponding boolean is `true`.

    g.cull([1, 2, 3, 4], [true, false, false, true]);

If the input and boolean list have a different size, the boolean list will wrap around:

    g.cull([1, 2, 3, 4], [false, true])

## Parameters
- `l`: The list of items.
- `booleans`: A list of `true` or `false` values.

## Related Guides
- [List Operations](../guide/list.html)
