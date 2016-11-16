---
layout: ref
title: frame
description: Get the current frame number.
categories: [ref]
---
Get the current frame number.

    g.frame();

This number can be used to create expression-based animations. It is often used in conjunction with `math.sin` to create wavy animations, altough `anim.wave` also works.

This number is dependent on how fast your computer can display the scene. Use [elapsedSeconds](/ref/elapsedSeconds.html) if you want a value independent of your frame rate. 

## See also
- [elapsedSeconds](/ref/elapsedSeconds.html): Get the number of seconds since the start of the animation.
- [sineWave](/ref/sineWave.html): Smoothly interpolate between values.

## Related Guides
- [Animation](/guide/animation.html)
