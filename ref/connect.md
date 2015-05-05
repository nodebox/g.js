---
layout: ref
title: connect
tags: vector
---
Connect all points in a path.

    grob.connect([{x: -75, y: -25},{x: 75, y: 25}], true)

## Parameters
- `points`: The list of points to connect.
- `closed`: If `true`, closes the shape. The default is `false`.

## Closed vs Open
The `closed` parameter specifies if we should be added. This has an effect on drawing the path stroke, as shown below.

Closed shape:

    grob.connect([{x: 0, y: 50}, {x: 0, y: 0}, {x: 50, y: 0}], true)

Open shape:

    grob.connect([{x: 0, y: 50}, {x: 0, y: 0}, {x: 50, y: 0}], false)
