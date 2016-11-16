---
layout: ref
title: distinct
description: Remove all duplicate items from a list.
categories: [ref]
---
Remove all duplicate items from a list.

    g.distinct(['a', 'b', 'a', 'c', 'd'])

Note that we use *deep equality* checking, which means that using `g.distinct` with objects (or points or colors) does what you expect:

    g.distinct([{a: 1, b: 1}, {a: 2, b: 2}, {a: 1, b: 1}])

## Parameters
- `l`: The input list.

## Related Guides
- [List Operations](../guide/list.html)
