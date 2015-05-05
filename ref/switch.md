---
layout: ref
title: switch
tags: list
---
Select one of multiple inputs based on an index.

    grob.switch(0, [1, 2], [3, 4], [5, 6])

If the index value is bigger than the number of inputs, it wraps around:

    grob.switch(4, ['a'], ['b'], ['c'])

The index can also be negative, in which case it will start at the end:

    grob.switch(-1, ['a'], ['b'], ['c'])

## Parameters
- `index`: The item to pick.
- `l1`: The first list.
- `l2`: The second list.
- `...`
