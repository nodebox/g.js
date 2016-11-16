---
layout: ref
title: stringEquals
description: Determine if the string equals a given string.
categories: [ref]
---
Determine if the string equals a given string.

    g.stringEquals('foo', 'foo');

An optional parameter — `ignoreCase` — ignores differences in upper- and lowercase letters:

    g.stringEquals('foo', 'FOO', true);

## Parameters
- `s1`: The first input string.
- `s2`: The second input string.
- `ignoreCase`: If true, ignores differences between upper- and lowercase.

## Related Guides
- [String Manipulation](../guide/string.html)
