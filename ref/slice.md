---
layout: ref
title: slice
tags: list
---
Take a portion of the list.

    grob.slice([1, 2, 3, 4, 5, 6], 1, 3);

The amount can be larger than the actual list:

    grob.slice([1, 2, 3], 0, 999);

To take the opposite items, set the fourth (optional) to `true`:

    grob.slice([1, 2, 3, 4, 5, 6], 1, 3, true);

## Parameters
- `l`: The list of items.
- `startIndex`: The first index to use. (Indices start at zero)
- `size`: The number of items.
- `invert`: When `true`, return the rejected part of the list.
