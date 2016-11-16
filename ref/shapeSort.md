---
layout: ref
title: shapeSort
description: Sort points or shapes using different sorting methods.
categories: [ref]
---
Sort points or shapes using different sorting methods.

    var points = g.grid(6, 4, 30, 30);
    g.shapeSort(points, 'distance');

Sorted points look just the same as ordinary points. It's only when you *do* something related to the ordering that you see a visible difference:

    var points = g.grid(6, 4, 30, 30);
    var sorted = g.shapeSort(points, 'distance');
    sorted.map(function (pt, i) {
        return g.ellipse(pt, i + 2, i + 2);
    });

## Parameters
- `shapes`: The list of shapes or points to sort.
- `orderBy`: The sort method (`x`, `y`, `distance` or `angle`).
- `position`: The center point used for `distance` or `angle` sorting.

## See Also
- [sort](sort.html): sort items in a list.

## Related Guides
- [Vector Graphics](../guide/vector.html)
