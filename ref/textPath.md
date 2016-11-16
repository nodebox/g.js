---
layout: ref
title: textPath
description: Create a path out of text.
categories: [ref]
---
Create a path out of text.

    var font = '/static/fonts/FiraSans-Regular.otf';
    g.textPath('Hello', {x: 0, y: 0}, font, 48);

Note that the [text](text) function is generally faster. However, because these are paths you can apply any vector filter, such as [snap](ref:g.snap.html):

    var font = '/static/fonts/FiraSans-Regular.otf';
    var path = g.textPath('Hello', {x: 0, y: 0}, font, 72);
    g.snap(path, 20, 0.75);

Note that, because of browser limitations, you have to upload an `.otf` or `.ttf` file before you can use text paths.

We have some limited support for loading fonts from URLs. The textPath function will perform a request, but the result will return later, so the output might only show up the second or third time the function is run. In the future we hope to support [Google Fonts](https://www.google.com/fonts) as well.

## Parameters
- `text`: The text to display.
- `position`: The position of the text (default = 0,0).
- `font`: The `.otf` or `.ttf` font. We also support URLs, in which case the font will be loaded.
- `fontSize`: The size of the text, in pixels (default= = 24).
- `align`: The horizontal alignment (options are `left`, `right` and `center` (the default)).

## See Also
- [text](text.html): Create a text element.

## Related Guides
- [Vector Graphics](../guide/vector.html)
