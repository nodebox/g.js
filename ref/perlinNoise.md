---
layout: ref
title: noise
tags: math
---
Compute Perlin noise.

[Perlin noise](https://en.wikipedia.org/wiki/Perlin_noise) can be used to simulate natural, flowing gradients such as terrain, water or smoke.

The input to the Perlin noise function is a three-dimensional point that "travels" across the noise landscape. Here we are in the center:

    grob.noise(0, 0, 0);

A bit further on the X axis the value increases slightly:

    grob.noise(0.1, 0, 0);

## Parameters
- `x`: The X value.
- `y`: The Y value (default = `0.0`).
- `z`: The Z value (default = `0.0`).
