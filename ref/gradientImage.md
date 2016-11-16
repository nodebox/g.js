---
layout: ref
title: gradientImage
description: Create a gradient image.
categories: [ref]
---
Create a gradient image.

    g.gradientImage(150, 150, 'red', 'yellow')

## Parameters
- `width`: The width of the resulting image.
- `height`: The height of the resulting image.
- `startColor`: The color at the start of the gradient.
- `endColor`: The color at the end of the gradient.
- `type`: The gradient can either be 'linear' or 'radial'. When not specified, the type 'linear' is assumed.
- `angle`: The angle (in degrees) at which to rotate the gradient. This is not applicable for radial gradients.
- `spread`: controls the distribution of the gradient (0-100%).

Example of a radial gradient:

    g.gradientImage(150, 150, 'lightgreen', 'black', 'radial', 0, 50)

## Related Guides
- [Imaging](../guide/image.html)
