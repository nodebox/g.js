---
layout: ref
title: integer
description: Create an integer value that can be used as a variable.
categories: [ref]
---
Create an integer value that can be used as a variable.

    g.integer(1);

Using float point numbers truncates the number:

    g.integer(3.9);

It works the same way with negative numbers:

    g.integer(-4.5);

## Parameters
- `v`: The input number.

## Related Guides
- [Math](../guide/math.html)
