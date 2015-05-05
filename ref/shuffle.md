---
layout: ref
title: shuffle
tags: list
---
Randomise the ordering of items in the list.

    grob.shuffle([1, 2, 3, 4, 5], 48);

Same list with a different seed:

    grob.shuffle([1, 2, 3, 4, 5], 99);

## Parameters
- `l`: The list of items.
- `seed`: The random variation. Each seed will give a different result.

## See Also
- [pick](/ref/pick.html): Pick items from a list in random order.
- [randomSample](/ref/randomSample.html): Take a random sample of the list.
