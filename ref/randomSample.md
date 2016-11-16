---
layout: ref
title: randomSample
description: Take a random sample from a list.
categories: [ref]
---
Take a random sample from a list.

    g.randomSample([1, 2, 3, 4, 5, 6], 3, 48);

With a different seed:

    g.randomSample([1, 2, 3, 4, 5, 6], 3, 11);

Unlike [pick](pick.html), `randomSample` will never return more than the original amount:

    g.randomSample([1, 2, 3], 10, 44);

## Parameters
- `l`: The input list.
- `amount`: The amount of items to take.
- `seed`: The random variation.

## See Also
- [pick](pick.html): Take random items from a list.
- [shuffle](shuffle.html): Randomly reorganise items in the list.

## Related Guides
- [List Operations](../guide/list.html)
