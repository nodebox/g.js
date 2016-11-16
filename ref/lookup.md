---
layout: ref
title: lookup
description: Look up a value in a table or object.
categories: [ref]
---
Look up a value in a table or object.

Imagine you have this data, using [import](/ref/import.html):

    g.import('people.csv');

Using `lookup` we can extract the value of one column:

    var data = g.import('people.csv');
    var row = data[0];
    g.lookup(row, 'name');

## Related Guides
- [Data Processing](/guide/data.html)
