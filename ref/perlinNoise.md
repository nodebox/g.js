---
layout: ref
title: perlinNoise
description: Compute Perlin noise.
categories: [ref]
---
Compute Perlin noise.

[Perlin noise](https://en.wikipedia.org/wiki/Perlin_noise) can be used to simulate natural, flowing gradients such as terrain, water or smoke.

The input to the Perlin noise function is a three-dimensional point that "travels" across the noise landscape. Here we are in the center:

    g.perlinNoise(0, 0, 0);

A bit further on the X axis the value increases slightly:

    g.perlinNoise(0.1, 0, 0);

## Related Guides
- [Math](/guide/math.html)
