---
layout: ref
title: keys
description: Get the keys from a table.
categories: [ref]
---
Get the keys from a table.

Imagine you have this data file, using [import](/ref/import.html):

    g.import('people.csv');

The `keys` function will give you the column headers:

    var data = g.import('people.csv');
    g.keys(data);

## Related Guides
- [Data Processing](/guide/data.html)
- [List Operations](/guide/list.html)
