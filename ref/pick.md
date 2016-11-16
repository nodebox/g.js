---
layout: ref
title: pick
description: Take random items from a list.
categories: [ref]
---
Take random items from a list.

    g.pick([1, 2, 3, 4, 5, 6], 3, 44);

With a different seed:

    g.pick([1, 2, 3, 4, 5, 6], 3, 99);

Unlike [randomSample](randomSample.html), `pick` can return *more* values than the original:

    g.pick([1, 2, 3], 10, 42);

## Parameters
- `l`: The input list.
- `amount`: The amount of items to pick.
- `seed`: The random variation.

## See Also
- [shuffle](shuffle.html): Randomly reorganise items in the list.
- [randomSample](randomSample.html): Take a random sample from a list.

## Related Guides
- [List Operations](../guide/list.html)
