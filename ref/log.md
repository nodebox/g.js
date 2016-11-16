---
layout: ref
title: log
description: Calculate the natural logarithm.
categories: [ref]
---
Calculate the natural logarithm.

    g.log(10);

Because the logarithm drastically reduces the magnitude of numbers it can be used in cases where a linear scale doesn't work, for example differences in population per country.

Here are the population sizes of Belgium and China, in millions. Applying the log function drastically reduce the differences:

    [g.log(11.14), g.log(1351)]

Theoretically, a negative log is infinitely large, producing unusable numbers. We've changed this behaviour so that negative inputs return negative outputs:

    g.log(-10);

## Related Guides
- [Math](../guide/math.html)
