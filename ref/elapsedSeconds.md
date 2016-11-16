---
layout: ref
title: elapsedSeconds
description: Get the number of seconds since the start of the animation.
categories: [ref]
---
Get the number of seconds since the start of the animation.

    g.elapsedSeconds()

This returns a floating-point number, with milliseconds behind the comma.

The advantage over [frame](frame.html) is that `elapsedSeconds` returns even values regardless of how many frames per seconds your computer can display.

## See Also
- [frame](frame.html): Get the current frame number.
- [sineWave](sineWave.html): Smoothly interpolate between values.

## Related Guides
- [Animation](../guide/animation.html)
