---
layout: ref
title: subString
tags: string
---
Take a portion of a string.

    grob.substring('hello', 0, 4);

Without a third parameter, the substring goes to the end of the string:

    grob.substring('hello', 1);

## Parameters
- `s`: The input string.
- `start`: The starting offset (starts at 0).
- `size`: The size of the substring. If left off, take the rest of the string.
