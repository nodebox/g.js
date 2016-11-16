---
layout: ref
title: substring
description: Take a portion of a string.
categories: [ref]
---
Take a portion of a string.

    g.substring('Hello', 1, 3);

If we only specify the start, the substring runs to the end of the string:

    g.substring('Hello', 1);

## Parameters
- `s`: The input string.
- `start`: The start index of the string.
- `end`: The end index of the string.
- `endOffset`: If set, use the end index as a size instead of index.

## Related Guides
- [String Manipulation](/guide/string.html)
