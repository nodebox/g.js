---
layout: ref
title: characterAt
description: Output the character at a given index.
categories: [ref]
---
Output the character at a given index.

    var text = 'Hello';
    g.characterAt(text, 0);
    
Character indices start at zero, and wrap around:

    var text = 'Hello';
    g.characterAt(text, 5);

## Parameters
- `s`: The input string.
- `index`: The index of the character.

## Related Guides
- [String Manipulation](/guide/string.html)
