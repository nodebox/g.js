---
layout: ref
title: takeEvery
tags: list
---
Take every `n`th element of a list.

    grob.takeEvery([1, 2, 3, 4, 5, 6, 7], 3)

If `n` is 1, it will take all items:

    grob.takeEvery([1, 2, 3, 4], 1)

If `n` is 2, it will take every other item:

    grob.takeEvery([1, 2, 3, 4], 2)

## Parameters
- `l`: The list of items.
- `n`: The "gap" number between items.
