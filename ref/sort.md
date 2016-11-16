---
layout: ref
title: sort
description: Sort the items in the list.
categories: [ref]
---
Sort the items in the list.

    g.sort([8, 4, 2, 1]);

If you have a table (e.g. from [import](import).html) you can give an additional key to sort by:

    var table = g.import('people.csv');
    g.sort(table, 'age');

## Parameters
- `l`: The input list.
- `key`: The sorting key (optional).

## See Also
- [shapeShort](shapeSort.html): Sort visual shapes.

## Related Guides
- [List Operations](../guide/list.html)
- [Data Processing](../guide/data.html)
