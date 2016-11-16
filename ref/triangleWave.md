---
layout: ref
title: triangleWave
description: Calculate a value based on a triangle wave.
categories: [ref]
---
Calculate a value based on a triangle wave.

    g.triangleWave(0.5);

A triangle wave looks like this:

    g.sample(100, 0, 2).map(function(v) {
        return {x: v * 60, y: g.triangleWave(v) * 60};
    });

The triangle wave can take a *minimum* and *maximum*:

    g.triangleWave(0.5, 100, 500);

It can also take a *period*, the unit size. If you would connect this to [elapsedSeconds](elapsedSeconds.html), the wave would oscillate from minimum to maximum in one second:

    g.triangleWave(0.5, 100, 500, 2);

Finally, it takes a *phase offset* which shifts the wave. It compensates the first parameter:

    g.triangleWave(0.7, 100, 500, 1, -0.2);

## Parameters
- `v`: The input value.
- `min`: The minimum value of the wave.
- `max`: The maximum value of the wave.
- `period`: The size of one "revolution" of the wave.
- `offset`: The phase offset of the wave.

## See Also
- [sineWave](sineWave.html)
- [squareWave](squareWave.html)
- [sawtoothWave](sawtoothWave.html)

## Related Guides
- [Math](../guide/math.html)
