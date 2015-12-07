'use strict';

var vg = require('./vg/vg');
var img = require('./img/img');

var Img = img.Img;
var Layer = img.Layer;
var ImageCanvas = img.ImageCanvas;
var g = {};

g.blend = function (image1, image2, mode) {
    var b1 = image1.bounds();
    var b2 = image2.bounds();

    var b = new vg.Rect(b1.x, b1.y, b1.width, b1.height).unite(b2);
    var width = Math.ceil(b.width);
    var height = Math.ceil(b.height);
    var dx = width / 2 + b.x;
    var dy = height / 2 + b.y;

    var canvas = new ImageCanvas(width, height);
    var l1 = canvas.addLayer(image1.toLayer());
    l1.translate(-dx, -dy);
    var l2 = canvas.addLayer(image2.toLayer());
    l2.translate(-dx, -dy);
    l2.blendmode = mode;
    return new Img(canvas.render(), dx, dy);
};

g.blur = function (image, radius) {
    var layer = image.toLayer(false);
    layer.addFilter('blur', {radius: radius});
    return image.withCanvas(layer.toCanvas());
};

g.brighten = function (image, brightness, contrast) {
    var layer = image.toLayer(false);
    layer.addFilter('brightness', {brightness: brightness / 100, contrast: contrast / 100});
    return image.withCanvas(layer.toCanvas());
};

g.bump = function (image, position, radius, zoom) {
    var layer = image.toLayer(false);
    layer.addFilter('bump', {dx: position.x, dy: position.y, radius: radius, zoom: zoom / 100});
    return image.withCanvas(layer.toCanvas());
};

g.colorImage = function (width, height, color) {
    var layer = Layer.fromColor(color);
    layer.width = width;
    layer.height = height;
    return new Img(layer.toCanvas());
};

g.crop = function (image, bounding) {
    return image.crop(bounding);
};

g.crossEdges = function (image, strength) {
    var layer = image.toLayer(false);
    layer.addFilter('crossedges', {strength: strength / 100});
    return image.withCanvas(layer.toCanvas());
};

g.dent = function (image, position, radius, zoom) {
    var layer = image.toLayer(false);
    layer.addFilter('dent', {dx: position.x, dy: position.y, radius: radius, zoom: zoom / 100});
    return image.withCanvas(layer.toCanvas());
};

g.emboss = function (image, amount, angle) {
    var layer = image.toLayer(false);
    layer.addFilter('emboss', {amount: amount / 100, angle: angle});
    return image.withCanvas(layer.toCanvas());
};

g.equalize = function (image) {
    var layer = image.toLayer(false);
    layer.addFilter('equalize');
    return image.withCanvas(layer.toCanvas());
};

g.findEdges = function (image) {
    var layer = image.toLayer(false);
    layer.addFilter('findedges');
    return image.withCanvas(layer.toCanvas());
};

g.glow = function (image, amount, kernelSize) {
    var layer = image.toLayer(false);
    layer.addFilter('glow', {amount: amount / 100, kernelSize: kernelSize});
    return image.withCanvas(layer.toCanvas());
};

g.gradientImage = function (width, height, startColor, endColor, type, angle, spread) {
    var layer = Layer.fromGradient(startColor, endColor, type, angle, spread / 100);
    layer.width = width;
    layer.height = height;
    return new Img(layer.toCanvas());
};

g.histogram = function (image, channel, relative) {
    var pixels = image.getPixels();
    var vals = new Array(256);
    var i, c, pixel, comp;
    for (i = 0; i < vals.length; i += 1) { vals[i] = 0; }
    if (channel === 'lum') {
        for (i = 0; i < pixels.width * pixels.height; i += 1) {
            pixel = pixels.get(i);
            comp = pixel[0] * 0.2125 + pixel[1] * 0.7154 + pixel[2] * 0.0721;
            vals[Math.round(comp)] += 1;
        }
    } else {
        if (channel === 'red') { c = 0; }
        if (channel === 'green') { c = 1; }
        if (channel === 'blue') { c = 2; }
        if (channel === 'alpha') { c = 3; }
        for (i = 0; i < pixels.width * pixels.height; i += 1) {
            pixel = pixels.get(i);
            comp = pixel[c];
            vals[comp] += 1;
        }
    }
    if (relative) {
        for (i = 0; i < vals.length; i += 1) {
            vals[i] /= (pixels.width * pixels.height);
        }
    }
    return vals;
};

g.lightTunnel = function (image, position, radius) {
    var layer = image.toLayer(false);
    layer.addFilter('splash', {dx: position.x, dy: position.y, radius: radius});
    return image.withCanvas(layer.toCanvas());
};

g.luminanceBW = function (image) {
    var layer = image.toLayer(false);
    layer.addFilter('luminancebw');
    return image.withCanvas(layer.toCanvas());
};

g.mask = function (image, mask) {
    image = image.transformed();
    mask = mask.transformed();

    var layer = image.toLayer(false);
    var maskLayer = mask.toLayer();

    var b1 = image.bounds();
    var b2 = mask.bounds();

    var b = new vg.Rect(b1.x, b1.y, b1.width, b1.height).unite(b2);
    var width = Math.ceil(b.width);
    var height = Math.ceil(b.height);
    var dx = width / 2 + b.x;
    var dy = height / 2 + b.y;
    maskLayer.translate(-dx, -dy);

    var l = layer.mask.addLayer('white');
    l.width = layer.width;
    l.height = layer.height;
    layer.mask.addLayer(maskLayer);
    return image.withCanvas(layer.toCanvas());
};

g.mosaic = function (image, blockSize) {
    var layer = image.toLayer(false);
    layer.addFilter('mosaic', {blockSize: blockSize});
    return image.withCanvas(layer.toCanvas());
};

g.pinch = function (image, position, zoom) {
    var layer = image.toLayer(false);
    layer.addFilter('pinch', {dx: position.x, dy: position.y, zoom: zoom / 100});
    return image.withCanvas(layer.toCanvas());
};

g.posterize = function (image, levels) {
    var layer = image.toLayer(false);
    layer.addFilter('posterize', {levels: levels});
    return image.withCanvas(layer.toCanvas());
};

g.removeNoise = function (image) {
    var layer = image.toLayer(false);
    layer.addFilter('removenoise');
    return image.withCanvas(layer.toCanvas());
};

g.solarize = function (image) {
    var layer = image.toLayer(false);
    layer.addFilter('solarize');
    return image.withCanvas(layer.toCanvas());
};

g.toBitmap = function (shape, bounding) {
    var canvas = document.createElement('canvas');
    var bounds;
    if (bounding) {
        bounds = bounding.bounds();
    } else {
        bounds = shape.bounds();
    }
    var x = bounds.x;
    var y = bounds.y;
    var width = canvas.width = Math.ceil(bounds.width);
    var height = canvas.height = Math.ceil(bounds.height);
    var ctx = canvas.getContext('2d');
    ctx.translate(-x, -y);
    shape.draw(ctx);
    return new Img(canvas, width / 2 + x, height / 2 + y);
};

g.toPixels = function (image, step) {
    step = step > 1 ? step : 1;
    var canvas = image.canvas;
    var imgWidth = canvas.width;
    var imgHeight = canvas.height;
    var ctx = canvas.getContext('2d');
    var data = ctx.getImageData(0, 0, canvas.width, canvas.height);
    var pixels = data.data;
    var stride = canvas.width * 4;

    var outPixels = [];
    for (var y = 0; y < imgHeight; y += step) {
        for (var x = 0; x < imgWidth; x += step) {
            var offset = y * stride + x * 4;
            var pr = pixels[offset];
            var pg = pixels[offset + 1];
            var pb = pixels[offset + 2];
            var pa = pixels[offset + 3];
            outPixels.push({
                x: x - imgWidth / 2,
                y: y - imgHeight / 2,
                r: pr,
                g: pg,
                b: pb,
                a: pa,
                color: new vg.Color(pr / 255, pg / 255, pb / 255, pa / 255)
            });
        }
    }
    return outPixels;
};

g.twirl = function (image, position, radius, angle) {
    var layer = image.toLayer(false);
    layer.addFilter('twirl', {dx: position.x, dy: position.y, radius: radius, angle: angle});
    return image.withCanvas(layer.toCanvas());
};

module.exports = g;
