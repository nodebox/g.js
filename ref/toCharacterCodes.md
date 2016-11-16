---
layout: ref
title: toCharacterCodes
description: Convert a string into a list of character codes.
categories: [ref]
---
Convert a string into a list of character codes.

    g.toCharacterCodes('Hello');

The character codes are [Unicode character codes](http://unicode-table.com/en/). Each character (letter, number, punctuation, emoji) has a unique value.

    g.toCharacterCodes('☁→☂');

## Parameters
- `s`: The input string.

## Related Guides
- [Working with Strings](/guide/string.html)
