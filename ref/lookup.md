---
layout: ref
title: lookup
tags: data
---
Look up a value in a table or object.

    var person = {name: 'Bob', age: 36};
    grob.lookup(person, 'age');

Lookups can be nested:

    var person = {name: 'Bob', address: {street: '5th Ave'}};
    grob.lookup(person, 'address.street');

## Parameters
- `data`: The input data.
- `key`: The lookup key.
