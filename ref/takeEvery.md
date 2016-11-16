---
layout: ref
title: takeEvery
description: Take every `n`th element of a list.
categories: [ref]
---
Take every `n`th element of a list.

    g.takeEvery([1, 2, 3, 4, 5, 6, 7], 3);

If `n` is 1, it will take all items:

    g.takeEvery([1, 2, 3, 4], 1);

If `n` is 2, it will take every other item:

    g.takeEvery([1, 2, 3, 4], 2);

## Parameters
- `l`: The input list.
- `n`: The "gap" number between items.

## Related Guides
- [List Operations](/guide/list.html)
