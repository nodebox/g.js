---
layout: ref
title: sample
description: Generate numbers within the given bounds.
categories: [ref]
---
Generate numbers within the given bounds.

    g.sample(5, 0, 100);

This function is related to `math.range` which has a fixed *step size*:

    g.range(0, 100, 25);

An optional last argument, `circular` can be used if the last value should be skipped. This is useful when generating numbers for a circle. Without `circular`, the first and last values (0 and 360) would overlap:

    g.sample(10, 0, 360);

With `circular` set to `true`, the last value is not included:

    g.sample(10, 0, 360, true);

## Parameters
- `amount`: The amount of numbers to generate.
- `min`: The minimum value of the numbers.
- `max`: The maximum value of the numbers.
- `circular`: When `true`, don't include the last value.

## See Also
- [range](/ref/range.html): Generate a list of numbers from a start to an end value.

## Related Guides
- [Math](/guide/math.html)
