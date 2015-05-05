---
layout: ref
title: sort
tags: list
---
Sort elements in the list.

    grob.sort([5, 3, 6, 2, 3]);

Optionally, give a key to sort by that key:

    grob.sort([{name: 'Bob', age: 26}, {name: 'Alice', age: 34}], 'age');

## Parameters
- `l`: The list to sort.
- `key`: (Optional) the lookup key. This can also be a function, which will be invoked with one element.
