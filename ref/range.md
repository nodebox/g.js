---
layout: ref
title: range
description: Generate a list of numbers between a minimum and maximum.
categories: [ref]
---
Generate a list of numbers between a minimum and maximum.

This function takes a minimum, maximum and step value. The maximum value is not included:

    g.range(45, 100, 5);

If you don't specify the last value, a step of 1 is assumed.

    g.range(0, 10);

If this function would return an infinite list, it returns an empty list.

    g.range(0, 100, -1);

## See Also
- [sample](sample.html): Generate numbers within the given bounds.

## Related Guides
- [Math](../guide/math.html)
