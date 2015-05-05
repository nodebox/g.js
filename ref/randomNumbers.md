---
layout: ref
title: randomNumbers
tags: math
---
Create a list of random numbers.

Four random numbers between 10 and 20:

    grob.randomNumbers(4, 10, 20);

Just four random numbers between 0 and 1:

    grob.randomNumbers(4);

## Parameters
- `amount`: The amount of numbers to generate.
- `min`: The minimum value of the numbers (default = 0).
- `max`: The maximum value of the numbers (default = 1).
- `seed`: The random variation. Each seed will give a different result. Read about [randomness](/guide/randomness.html).
