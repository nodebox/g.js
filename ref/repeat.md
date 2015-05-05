---
layout: ref
title: repeat
tags: list
---
Repeat the items in the list a given number of times.

    grob.repeat([1, 2, 3], 3)

If `perItem` is `true`, repeat each item after itself:

    grob.repeat([1, 2, 3], 3, true)

## Parameters
- `l`: The list of items.
- `n`: The number of repetitions.
- `perItem`: If true, group all copies of item 1, then of item 2, etc. (default = `false`)
