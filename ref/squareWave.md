---
layout: ref
title: squareWave
description: Calculate a value based on a square wave.
categories: [ref]
---
Calculate a value based on a square wave.

    g.squareWave(0.5);

A square wave looks like this:

    g.sample(100, 0, 2, true).map(function(v) {
        return {x: v * 60, y: g.squareWave(v) * 60};
    });

The square wave can take a *minimum* and *maximum*:

    g.squareWave(0.5, 100, 500);

It can also take a *period*, the unit size. If you would connect this to [elapsedSeconds](elapsedSeconds.html), the wave would oscillate from minimum to maximum in one second:

    g.squareWave(0.5, 100, 500, 2);

Finally, it takes a *phase offset* which shifts the wave. It compensates the first parameter:

    g.squareWave(0.7, 100, 500, 1, -0.2);

## Parameters
- `v`: The input value.
- `min`: The minimum value of the wave.
- `max`: The maximum value of the wave.
- `period`: The size of one "revolution" of the wave.
- `offset`: The phase offset of the wave.

## See Also
- [sineWave](sineWave.html)
- [sawtoothWave](sawtoothWave.html)
- [triangleWave](triangleWave.html)

## Related Guides
- [Math](../guide/math.html)
