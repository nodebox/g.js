---
layout: ref
title: distinct
tags: list
---
Remove all duplicate items from a list.

    grob.distinct(['a', 'b', 'a', 'c', 'd'])

Note that we use *deep equality* checking, which means that using `distinct` with objects (or points or colors) does what you expect:

    grob.distinct([{a: 1, b: 1}, {a: 2, b: 2}, {a: 1, b: 1}])

## Parameters
- `l`: The list of items.

