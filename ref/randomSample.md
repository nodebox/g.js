---
layout: ref
title: randomSample
tags: list
---
Take a random sample of the list.

    grob.randomSample([1, 2, 3, 4, 5, 6], 3, 48)

With a different seed:

    grob.pick([1, 2, 3, 4, 5, 6], 3, 99)

Without a size, give a random permutation of the list (like [shuffle](ref/shuffle.html):

    grob.randomSample([1, 2, 3, 4, 5, 6])

Unlike [pick](/ref/pick.html), randomSample will never return more items than the size of the list.

## Parameters
- `l`: The list of items.
- `n`: The number of items to pick. If unspecified, randomSample works like [shuffle](/ref/shuffle.html).
- `seed`: The random variation.  Each seed will give a different result.

## See Also
- [shuffle](/ref/shuffle.html): Randomly reorganise items in the list.
- [pick](/ref/pick.html): Randomly select items from the list.
