---
layout: guide
title: Quick Start
image: quick-start
---
Let's write a quick demo in g.js! By the end of this, you'll be able to use the library and now where to find more help.

## Getting the Library

Download the library, or include a link using cdnjs:

```
<script src="https://cdn.rawgit.com/nodebox/g.js/master/dist/g.min.js"></script>
```

More detailed instruction are in the [installation guide](installation.html).

## Using the library

Here's a simple example, using the path object to draw a circle:

```
<!DOCTYPE html>
<html>
<head>
  <meta charset=utf-8>
  <title>g.js</title>
  <style>
    html, body { width: 100%; height: 100%; overflow: hidden; }
  </style>
</head>
<body>
  <canvas id="c"></canvas>
  <script src="https://cdn.rawgit.com/nodebox/g.js/master/dist/g.min.js"></script>
  <script>
    var c = document.getElementById('c');
    c.width = window.innerWidth; c.height = window.innerHeight;
    var ctx = c.getContext('2d');
    ctx.translate(c.width / 2, c.height / 2);
    var path = g.ellipse(0, 0, 100, 100);
    path.draw(ctx);
  </script>
</body>
</html>
```

And here's what it looks like:

<canvas id="c1"></canvas>

<script src="https://cdn.rawgit.com/nodebox/g.js/master/dist/g.min.js"></script>
<script>
  var c = document.getElementById('c1');
  var ctx = c.getContext('2d');
  ctx.translate(c.width / 2, c.height / 2);
  var path = g.ellipse(0, 0, 100, 100);
  path = g.colorize(path, 'teal');
  path.draw(ctx);
</script>

Let's see what this code does. First we select the canvas element on the page, identified by the id "c", and store it in the variable c.

    var c = document.getElementById('c');

Then we set the size of the canvas element to the size of the window. Note that this is *different* from changing the style of the canvas element to `width: 100%; height: 100%`. Changing this only in CSS will stretch the canvas from its original resolution (300 &times; 150) to the desired size.

    c.width = window.innerWidth; c.height = window.innerHeight;

To draw on a Canvas context, we need to get the context. We use the "2d" context (there's also a WebGL context. Use libraries like [THREE.js](https://threejs.org/) for that.)

    var ctx = c.getContext('2d');

g.js works best if we start working from the middle of elements (altough this is not required). Here we translate to the center of the page. Everything we draw after that will start in the center.

    ctx.translate(c.width / 2, c.height / 2);

We're all set up now. The code above is what we should do, even if we don't use g.js. Now, let's create a path object, in this case an ellipse. The four parameters define x / y / width / height of the ellipse:

    var path = g.ellipse(0, 0, 100, 100);

We've now created an object that we can manipulate, but we didn't draw it yet. The power of g.js comes from the fact that we have a set of objects that we can freely manipulate in memory, and draw when we see fit. Here, let's modify the object by changing its color:

    var path = g.colorize(path, 'teal');

Note that the orginal path remains unchanged. Functions in g.js don't change the original object: instead, they return a new (efficient) copy with the changes. Also note that the method is on `g`: that means it can work on paths, groups of paths, and texts as well.

Finally, we draw the path to the canvas:

    path.draw(ctx);

## Integration with JavaScript

g.js is just a JavaScript library. Apart from the `g` global, it doesn't add or change anything on the page. So you're free to use it with other libraries.

## Further documentation

We have a number of [guides]({{ site.baseurl }}/) on using g.js, for example for using it for [vector graphics](vector.html), [images](image.html), or general operations like [working with color](color.html).

There's also a [function reference]({{ site.baseurl }}/ref/) containing all of the functions in g.js.

