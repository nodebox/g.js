---
layout: ref
title: blend
tags: image
---
Blend two images together using a blending method.

    var i1 = grob.import('leaf.jpg');
    var i2 = grob.import('cat-sunbeam.jpg');
    [i1, i2, g.blend(i1, i2, 'luminosity')];

## Parameters
- `image1`: The destination image.
- `image2`: The source image (will be drawn on top of image1).
- `mode`: The blending mode.

## Available blending modes

* source-over
* darken
* multiply
* color-burn
* linear-burn
* darker-color
* lighten
* screen
* color-dodge
* linear-dodge
* lighter-color
* overlay
* soft-light
* hard-light
* vivid-light
* linear-light
* pin-light
* hard-mix
* difference
* exclusion
* subtract
* divide
* hue
* saturation
* color
* luminosity
