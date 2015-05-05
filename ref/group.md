---
layout: ref
title: group
tags: vector
---
Combine multiple shapes together.

    var r = grob.rect({x: -75, y: 0}, 100, 100);
    var e = grob.ellipse({x: 75, y: 0}, 100, 100);
    grob.group([r, e]);

This is useful when aligning a group.

## Parameters
- `shapes`: The list of shapes to group.
