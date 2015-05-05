---
layout: ref
title: cull
tags: list
---
Keep only items from the list where the corresponding boolean is `true`.

    grob.cull([1, "a", 360, 42], [true, false, false, true])

If the input and boolean list have a different size, the boolean list will wrap around:

    grob.cull([1, 2, 3, 4], [false, true])

## Parameters
- `l`: The list of items.
- `booleans`: A list of `true` or `false` values.
