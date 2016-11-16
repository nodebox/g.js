---
layout: ref
title: ticks
description: Generate tick values for use in axes.
categories: [ref]
---
Generate tick values for use in axes.

    g.ticks(0, 100, 10);

Note that the number of ticks is a suggestion, not an exact value. This allows the algorithm to provide better-looking tick values:

    g.ticks(0, 5, 1);

## Parameters
- `min`: The minimum value for the axis.
- `max`: The maximum value for the axis.
- `n`: The number of ticks. Note that this number is a suggestion, not exact.
