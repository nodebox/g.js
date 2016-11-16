---
layout: ref
title: stringSplit
description: Split a string into a list of strings.
categories: [ref]
---
Split a string into a list of strings.

    g.stringSplit('one,two,three', ',');

The string split using a `delimiter`. This can be one or more characters:

    g.stringSplit('one<->two<->three', '<->');

Note that whitespace are significant. Not including the whitespace will add it to the string:

    g.stringSplit('A, B, C', ',');

## Parameters
- `s`: The input string.
- `delimiter`: The delimiter, or "splitting character"

## Related Guides
- [String Manipulation](/guide/string.html)
