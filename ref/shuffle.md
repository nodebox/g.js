---
layout: ref
title: shuffle
description: Randomise the ordering of items in the list.
categories: [ref]
---
Randomise the ordering of items in the list.

    g.shuffle([1, 2, 3, 4, 5], 48)

Same list with a different seed:

    g.shuffle([1, 2, 3, 4, 5], 99)

## Parameters
- `l`: The list of items.
- `seed`: The random variation. Each seed will give a different result.

## See Also
- [pick](/ref/pick.html): Take random items from a list.
- [shuffle](/ref/shuffle.html): Randomly reorganise items in the list.

## Related Guides
- [List Operations](/guide/list.html)
