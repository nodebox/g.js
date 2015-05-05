---
layout: ref
title: shapeSort
tags: [image, vector]
---
Sort points or shapes using different sorting methods.

    var points = grob.grid(6, 4, 200, 100, {x: 0, y: 0});
    grob.sort(points, 'distance', {x: 0, y: 0});

Sorted points look just the same as ordinary points. It's only when you *do* something related to the ordering that you see a visible difference:

    var points = grob.grid(6, 4, 200, 100, {x: 0, y: 0});
    var sorted = grob.sort(points, 'distance', {x: 0, y: 0});
    sorted.map(function (pt, i) {
        return grob.ellipse(pt, i + 2, i + 2);
    });

## Parameters
- `shapes`: The list of shapes or points to sort.
- `orderBy`: The sort method (`x`, `y`, `distance` or `angle`).
- `position`: The center point used for `distance` or `angle` sorting.
