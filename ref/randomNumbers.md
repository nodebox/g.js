---
layout: ref
title: randomNumbers
description: Create a list of random numbers.
categories: [ref]
---
Create a list of random numbers.

Four random numbers between 10 and 20:

    g.randomNumbers(4, 10, 20, 0);

Just four random numbers:

    g.randomNumbers(4, 0, 1);

## Parameters
- `amount`: The amount of numbers to generate.
- `min`: The minimum value of the numbers (default = 0).
- `max`: The maximum value of the numbers (default = 1).
- `seed`: The random variation. Each seed will give a different result.

## Related Guides
- [Math](../guide/math.html)
