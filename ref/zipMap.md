---
layout: ref
title: zipMap
description: Combine a list of keys and values together in a map.
categories: [ref]
---
Combine a list of keys and values together in a map.

    g.zipMap(["a", "b", "c"], [1, 2, 3]);

The `zipMap` function is used to build a dictionary of *mappings*: for example, mapping categories to colors. You can then use [lookup](/ref/lookup.html) to get the colors for each of the categories.

If the key and value lists are not the same size, the smallest one is used:

    g.zipMap(["a", "b"], [1, 2, 3, 4, 5]);

## Parameters
- `keys`: The list of keys.
- `values`: The list of values.

## Related Guides
- [List Operations](/guide/list.html)
