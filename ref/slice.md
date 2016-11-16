---
layout: ref
title: slice
description: Take a portion of the list.
categories: [ref]
---
Take a portion of the list.

    g.slice([1, 2, 3, 4, 5, 6], 1, 3)

The amount can be larger than the actual list:

    g.slice([1, 2, 3], 0, 999)

To take the opposite items, set the fourth (optional) to `true`:

    g.slice([1, 2, 3, 4, 5, 6], 1, 3, true)

## Parameters
- `l`: The list of items.
- `startIndex`: The first index to use. (Indices start at zero)
- `size`: The number of items.
- `invert`: When `true`, return the rejected part of the list.

## See Also
- [get](get.html): Take a single item from the list.

## Related Guides
- [List Operations](../guide/list.html)
