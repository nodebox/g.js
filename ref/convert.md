---
layout: ref
title: convert
description: Convert values from one range to another.
categories: [ref]
---
Convert values from one range to another.

    g.convert(0.2, 0, 1, 0, 100);

This maps a value from an *input domain* to an *output domain*.

This operation is used a lot in data visualisation. The input value are in the unit of the data. The output value is often a size, in pixels.

For example, we could map the size of a human, in meters (so between 0 and 2.5), to a radius in pixels from (between 0 and 500):

    g.convert(1.8, 0, 2.5, 0, 500);

## Parameters
- `v`: The input value.
- `inMin`: The minimum input value.
- `inMax`: The maximum input value.
- `outMin`: The minimum output value.
- `outMax`: The maximum output value.

## Related Guides
- [Math](/guide/math.html)
