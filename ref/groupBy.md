---
layout: ref
title: groupBy
description: Group the data based on key/value.
categories: [ref]
---
Group the data based on key/value.

    var alice = {name: 'Alice', grade: 'A'};
    var bob = {name: 'Bob', grade: 'C'};
    var claude = {name: 'Claude', grade: 'A'};
    var data = [alice, bob, claude];
    g.groupBy(data, 'grade');

## Parameters
- `data`: The input data, as a list of objects.
- `key`: The key to group by.

## Related Guides
- [Data Processing](/guide/data.html)

