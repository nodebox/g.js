---
layout: ref
title: zipMap
tags: list
---
Combine a list of keys and values together in a map.

    grob.zipMap(['a', 'b', 'c'], [1, 2, 3]);

If the key and value lists are not the same size, the smallest one is used:

    grob.zipMap(['a', 'b'], [1, 2, 3, 4, 5]);

## Parameters
- `keys`: The list of keys.
- `values`: The list of values.
