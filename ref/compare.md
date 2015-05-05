---
layout: ref
title: compare
tags: math
---
Compare two values and return `true` or `false`.

Check if the first number is bigger:

    grob.compare(10, 20, '>');

Check if the first number is smaller:

    grob.compare(10, 20, '<');

Check for equality:

    grob.compare(42, 42.0, '==');

## Parameters
- `x`: The first number.
- `y`: The second number.
- `comparator`: One of `>`, `<`, `>=`, `<=`,  `=` or `!=`.
