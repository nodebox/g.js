---
layout: ref
title: import
description: Import data (CSV, SVG) from a file.
categories: [ref]
---
Import data (CSV, SVG) from a file.

Use `import` to import CSV data:

    g.import('people.csv');

Or SVG data:

    var logo = g.import('logo.svg');
    g.fit(logo, {x:0, y:0}, 130, 130);

## Parameters
- `file`: The file to import.

## Related Guides
- [Vector Graphics](/guide/vector.html)
- [Data Processing](/guide/data.html)
