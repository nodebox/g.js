---
layout: ref
title: sawtoothWave
description: Calculate a value based on a sawtooth wave.
categories: [ref]
---
Calculate a value based on a sawtooth wave.

    g.sawtoothWave(0.5);

A sawtooth wave looks like this:

    g.sample(100, 0, 2, true).map(function(v) {
        return {x: v * 60, y: g.sawtoothWave(v) * 60};
    });

The sawtooth wave can take a *minimum* and *maximum*:

    g.sawtoothWave(0.5, 100, 500);

It can also take a *period*, the unit size. If you would connect this to [elapsedSeconds](elapsedSeconds.html), the wave would oscillate from minimum to maximum in one second:

    g.sawtoothWave(0.5, 100, 500, 2);

Finally, it takes a *phase offset* which shifts the wave. It compensates the first parameter:

    g.sawtoothWave(0.7, 100, 500, 1, -0.2);

## Parameters
- `v`: The input value.
- `min`: The minimum value of the wave.
- `max`: The maximum value of the wave.
- `period`: The size of one "revolution" of the wave.
- `offset`: The phase offset of the wave.

## See Also
- [sineWave](sineWave.html)
- [squareWave](squareWave.html)
- [triangleWave](triangleWave.html)

## Related Guides
- [Math](../guide/math.html)
