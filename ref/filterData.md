---
layout: ref
title: filterData
description: Filter the input data by comparing the columns of each row with a value.
categories: [ref]
---
Filter the input data by comparing the columns of each row with a value.

    var people = [
        {name: 'Dave', age: 18},
        {name: 'Rose', age: 24},
        {name: 'Joe', age: 35}
    ];
    g.filterData(people, 'age', '>', 21)


## Parameters
- `data`: The input data.
- `key`: The name of the column.
- `op`: The compare operation (see below).
- `value`: The value to compare to.

## Compare Operations
- `==`: The two values are equal.
- `!=`: The two values are not equal.
- `>`: The input is larger than the given value.
- `>=`: The input is larger or equal than the given value.
- `<`: The input is smaller than the given value.
- `<=`: The input is smaller or equal then the given value.

## Related Guides
- [List Operations](../guide/list.html)
