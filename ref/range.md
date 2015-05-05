---
layout: ref
title: range
tags: math
---
Generate a list of numbers between a minimum and maximum.

This function takes a minimum, maximum and step value. The maximum value is not included:

    grob.range(45, 100, 5);

If you don't specify the last value, a step of 1 is assumed.

    grob.range(0, 10);

If this function would return an infinite list, it returns an empty list.

    grob.range(0, 100, -1);

## Parameters
- `min`: The minimum value.
- `max`: The maximum value.
- `step`: The step size between subsequent numbers.
- `inclueMax`: If `true`, the maximum value is included if it would be the next step.

## See Also
- [sample](/ref/sample.html): Generate numbers within the given bounds.
