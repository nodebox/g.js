---
layout: ref
title: pick
tags: list
---
Select items from a list in random order.

    grob.pick([1, 2, 3, 4, 5, 6], 3, 48)

With a different seed:

    grob.pick([1, 2, 3, 4, 5, 6], 3, 99)

Unlike [randomSample](/ref/randomSample.html), items can be selected more than once:

    grob.pick([1, 2], 5, 1)

## Parameters
- `l`: The list of items.
- `n`: The number of items to pick.
- `seed`: The random variation.  Each seed will give a different result.
- `method`: Either `shuffle` or `grab`. The default is `shuffle`.

## See Also
- [shuffle](/ref/shuffle.html): Randomly reorganise items in the list.
- [randomSample](/ref/randomSample.html): Take a random sample of the list.
