"use strict";

import * as blend from "./blend";
import process from "./process";
import { transform } from "./util";

// Dictionary of blend modes that the client browser does or does not support.
var nativeBlendModes = blend.getNativeModes();

function createImageData(ctx, width, height) {
  if (ctx.createImageData) {
    return ctx.createImageData(width, height);
  } else {
    return ctx.getImageData(0, 0, width, height);
  }
}

// RENDERING.

// The Layer and ImageCanvas objects don't do any actual pixel operations themselves,
// they only contain information about the operations. The actual rendering is done
// by a Renderer object. Currently there is only one kind available, the CanvasRenderer,
// which uses the HTML Canvas object (containing the pixel data) and a 2D context that
// acts on this canvas object. In the future, a webgl renderer might be added as well.

const CanvasRenderer = {};

// Renders a html canvas as an html Image. Currently unused.
CanvasRenderer.toImage = function (canvas) {
  var img = new Image();
  img.width = canvas.width;
  img.height = canvas.height;
  img.src = canvas.toDataURL();
  return img;
};

// 'LOADING' OF LAYERS.

// Returns a html canvas dependent on the type of the layer provided.
CanvasRenderer.load = function (iCanvas, layer) {
  if (layer.isFill()) {
    return CanvasRenderer.generateColor(iCanvas, layer);
  } else if (layer.isGradient()) {
    return CanvasRenderer.generateGradient(iCanvas, layer);
  } else if (layer.isHtmlCanvas()) {
    return CanvasRenderer.loadHtmlCanvas(layer.data);
  } else if (layer.isImage()) {
    return CanvasRenderer.loadImage(layer.data);
  } else if (layer.isImageCanvas()) {
    return CanvasRenderer.loadImageCanvas(layer.data);
  }
};

// Passes a html canvas.
CanvasRenderer.loadHtmlCanvas = function (canvas) {
  return canvas;
};

// Returns a html canvas from rendering an ImageCanvas.
CanvasRenderer.loadImageCanvas = function (iCanvas) {
  return iCanvas.render();
};

// Returns a html canvas from rendering a stored Image file.
CanvasRenderer.loadImage = function (img) {
  var canvas = document.createElement("canvas");
  var ctx = canvas.getContext("2d");
  canvas.width = img.width;
  canvas.height = img.height;
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  return canvas;
};

// Returns a html canvas with a solid fill color.
CanvasRenderer.generateColor = function (iCanvas, layer) {
  var width = layer.width !== undefined ? layer.width : iCanvas.width;
  var height = layer.height !== undefined ? layer.height : iCanvas.height;
  var canvas = document.createElement("canvas");
  var ctx = canvas.getContext("2d");

  canvas.width = width;
  canvas.height = height;
  ctx.fillStyle = layer.data;
  ctx.fillRect(0, 0, width, height);
  return canvas;
};

// Returns a html canvas with a gradient.
CanvasRenderer.generateGradient = function (iCanvas, layer) {
  var grd, x1, y1, x2, y2;
  var width = layer.width !== undefined ? layer.width : iCanvas.width;
  var height = layer.height !== undefined ? layer.height : iCanvas.height;
  var cx = width / 2;
  var cy = height / 2;
  var canvas = document.createElement("canvas");
  var ctx = canvas.getContext("2d");
  var data = layer.data;
  var type = data.type || "linear";
  var rotateDegrees = data.rotation || 0;

  if (type === "radial") {
    grd = ctx.createRadialGradient(
      cx,
      cy,
      0,
      cx,
      cy,
      Math.min(width, height) / 2
    );
  } else {
    // Rotation code taken from html5-canvas-gradient-creator:
    // Website: http://victorblog.com/html5-canvas-gradient-creator/
    // Code: https://github.com/evictor/html5-canvas-gradient-creator/blob/master/js/src/directive/previewCanvas.coffee
    if (rotateDegrees < 0) {
      rotateDegrees += 360;
    }
    if (0 <= rotateDegrees && rotateDegrees < 45) {
      x1 = 0;
      y1 = ((height / 2) * (45 - rotateDegrees)) / 45;
      x2 = width;
      y2 = height - y1;
    } else if (45 <= rotateDegrees && rotateDegrees < 135) {
      x1 = (width * (rotateDegrees - 45)) / (135 - 45);
      y1 = 0;
      x2 = width - x1;
      y2 = height;
    } else if (135 <= rotateDegrees && rotateDegrees < 225) {
      x1 = width;
      y1 = (height * (rotateDegrees - 135)) / (225 - 135);
      x2 = 0;
      y2 = height - y1;
    } else if (225 <= rotateDegrees && rotateDegrees < 315) {
      x1 = width * (1 - (rotateDegrees - 225) / (315 - 225));
      y1 = height;
      x2 = width - x1;
      y2 = 0;
    } else if (315 <= rotateDegrees) {
      x1 = 0;
      y1 = height - ((height / 2) * (rotateDegrees - 315)) / (360 - 315);
      x2 = width;
      y2 = height - y1;
    }
    grd = ctx.createLinearGradient(x1, y1, x2, y2);
  }
  grd.addColorStop(data.spread || 0, data.startColor);
  grd.addColorStop(1, data.endColor);

  canvas.width = width;
  canvas.height = height;
  ctx.fillStyle = grd;
  ctx.fillRect(0, 0, width, height);
  return canvas;
};

// PROCESSING OF LAYERS.

// Performs a number of filtering operations on an html image.
CanvasRenderer.processImage = function (canvas, filters) {
  if (filters.length === 0) {
    return canvas;
  }
  var filter, tmpData;
  var ctx = canvas.getContext("2d");
  var width = canvas.width;
  var height = canvas.height;
  var inData = ctx.getImageData(0, 0, width, height);
  var outData = createImageData(ctx, width, height);

  for (var i = 0; i < filters.length; i += 1) {
    if (i > 0) {
      tmpData = inData;
      inData = outData;
      outData = tmpData;
    }
    filter = filters[i];
    process[filter.name](
      inData.data,
      outData.data,
      width,
      height,
      filter.options
    );
  }

  ctx.putImageData(outData, 0, 0);
  return canvas;
};

// Renders the layer mask and applies it to the layer that it is supposed to mask.
CanvasRenderer.processMask = function (canvas, mask) {
  if (mask.layers.length === 0) {
    return canvas;
  }
  mask.width = canvas.width;
  mask.height = canvas.height;
  // First, make a black and white version of the masking canvas and pass
  // the result to the masking operation.
  var c = CanvasRenderer.renderBW(mask);
  var data = c.getContext("2d").getImageData(0, 0, c.width, c.height).data;
  var maskFilter = {
    name: "mask",
    options: { data: data, x: 0, y: 0, width: c.width, height: c.height },
  };
  return CanvasRenderer.processImage(canvas, [maskFilter]);
};

// Processes a single layer. First the layer image is loaded, then a mask (if applicable) is applied to it,
// and finally the filters (if any) are applied to it.
CanvasRenderer.processLayer = function (iCanvas, layer) {
  var layerImage = CanvasRenderer.load(iCanvas, layer);
  var maskedImage = CanvasRenderer.processMask(layerImage, layer.mask);
  return CanvasRenderer.processImage(maskedImage, layer.filters);
};

// LAYER TRANFORMATIONS.

// Transforms the 2d context that acts upon this layer's image. Utility function. -> Rename this?
function transformLayer(ctx, iCanvas, layer) {
  var m = layer.transform.matrix();

  ctx.translate(iCanvas.width / 2, iCanvas.height / 2);
  ctx.transform(m[0], m[1], m[3], m[4], m[6], m[7]);
  if (layer.flip_h || layer.flip_v) {
    ctx.scale(layer.flip_h ? -1 : 1, layer.flip_v ? -1 : 1);
  }
  ctx.translate(-layer.img.width / 2, -layer.img.height / 2);
}

// Transforms the bounds of a layer (the bounding rectangle) and returns the bounding rectangle
// that encloses this transformed rectangle.
function transformRect(iCanvas, layer) {
  var pt, minx, miny, maxx, maxy;
  var width = layer.img.width;
  var height = layer.img.height;
  var p1 = { x: 0, y: 0 };
  var p2 = { x: width, y: 0 };
  var p3 = { x: 0, y: height };
  var p4 = { x: width, y: height };
  var points = [p1, p2, p3, p4];

  var t = transform();
  t = t.translate(iCanvas.width / 2, iCanvas.height / 2);
  t = t.append(layer.transform);
  t = t.translate(-layer.img.width / 2, -layer.img.height / 2);

  for (var i = 0; i < 4; i += 1) {
    pt = t.transformPoint(points[i]);
    if (i === 0) {
      minx = maxx = pt.x;
      miny = maxy = pt.y;
    } else {
      if (pt.x < minx) {
        minx = pt.x;
      }
      if (pt.x > maxx) {
        maxx = pt.x;
      }
      if (pt.y < miny) {
        miny = pt.y;
      }
      if (pt.y > maxy) {
        maxy = pt.y;
      }
    }
  }
  return { x: minx, y: miny, width: maxx - minx, height: maxy - miny };
}

// Calculates the intersecting rectangle of two input rectangles.
function rectIntersect(r1, r2) {
  var right1 = r1.x + r1.width;
  var bottom1 = r1.y + r1.height;
  var right2 = r2.x + r2.width;
  var bottom2 = r2.y + r2.height;

  var x = Math.max(r1.x, r2.x);
  var y = Math.max(r1.y, r2.y);
  var w = Math.max(Math.min(right1, right2) - x, 0);
  var h = Math.max(Math.min(bottom1, bottom2) - y, 0);
  return { x: x, y: y, width: w, height: h };
}

// Calculates the mimimal area that a transformed layer needs so that it
// can still be drawn on the canvas. Returns a rectangle.
function calcLayerRect(iCanvas, layer) {
  var rect = transformRect(iCanvas, layer);
  rect = rectIntersect(rect, {
    x: 0,
    y: 0,
    width: iCanvas.width,
    height: iCanvas.height,
  });
  return {
    x: Math.round(rect.x),
    y: Math.round(rect.y),
    width: Math.ceil(rect.width),
    height: Math.ceil(rect.height),
  };
}

// Transforms a layer and returns the resulting pixel data.
function getTransformedLayerData(iCanvas, layer, rect) {
  var canvas = document.createElement("canvas");
  var ctx = canvas.getContext("2d");
  canvas.width = rect.width;
  canvas.height = rect.height;
  ctx.translate(-rect.x, -rect.y);
  transformLayer(ctx, iCanvas, layer);
  ctx.drawImage(layer.img, 0, 0);
  return ctx.getImageData(0, 0, rect.width, rect.height);
}

// LAYER BLENDING.

// Blends the subsequent layer images with the base layer and returns a single image.
// This method is used when web workers aren't available for use on this system.
CanvasRenderer.mergeManualBlend = function (iCanvas, layerData) {
  return function (canvas) {
    var layer, blendMode, blendData, tmpData, layerOptions, rect;
    var ctx = canvas.getContext("2d");
    var width = iCanvas.width;
    var height = iCanvas.height;
    var baseData = ctx.getImageData(0, 0, width, height);
    var outData = createImageData(ctx, width, height);
    for (var i = 0; i < layerData.length; i += 1) {
      layer = layerData[i];
      rect = calcLayerRect(iCanvas, layer);
      if (rect.width > 0 && rect.height > 0) {
        if (i > 0) {
          tmpData = baseData;
          baseData = outData;
          outData = tmpData;
        }
        blendData = getTransformedLayerData(iCanvas, layer, rect);
        layerOptions = {
          data: blendData.data,
          width: rect.width,
          height: rect.height,
          opacity: layer.opacity,
          dx: rect.x,
          dy: rect.y,
        };
        if (blend[layer.blendmode] === undefined) {
          throw new Error("No blend mode named '" + layer.blendmode + "'");
        }
        blendMode = blend.realBlendMode(layer.blendmode);
        blend[blendMode](
          baseData.data,
          outData.data,
          width,
          height,
          layerOptions
        );
      }
    }
    ctx.putImageData(outData, 0, 0);
    return canvas;
  };
};

// Renders a single layer. This is useful when there's only one layer available (and no blending is needed)
// or to render the base layer on which subsequent layers are blended.
CanvasRenderer.singleLayerWithOpacity = function (iCanvas, layer) {
  var canvas = document.createElement("canvas");
  var ctx = canvas.getContext("2d");

  canvas.width = iCanvas.width;
  canvas.height = iCanvas.height;

  ctx.save();
  transformLayer(ctx, iCanvas, layer);
  if (layer.opacity !== 1) {
    ctx.globalAlpha = layer.opacity;
  }
  ctx.drawImage(layer.img, 0, 0);
  ctx.restore();
  return canvas;
};

// Blends the subsequent layer images with the base layer and returns the resulting image.
// This method is used when the system supports the requested blending mode(s).
CanvasRenderer.mergeNativeBlend = function (iCanvas, layerData) {
  return function (canvas) {
    var ctx = canvas.getContext("2d");
    var layer;
    for (var i = 0; i < layerData.length; i += 1) {
      layer = layerData[i];
      ctx.save();
      transformLayer(ctx, iCanvas, layer);
      if (layer.opacity !== 1) {
        ctx.globalAlpha = layer.opacity;
      }
      if (layer.blendmode !== "source-over") {
        ctx.globalCompositeOperation = blend.realBlendMode(layer.blendmode);
      }
      ctx.drawImage(layer.img, 0, 0);
      ctx.restore();
    }
    return canvas;
  };
};

CanvasRenderer.createRenderPipe = function (Renderer, iCanvas, layerData) {
  var mode, useNative, currentList, layer;
  var renderPipe = [];

  function pushList() {
    if (useNative !== undefined) {
      var fn = useNative
        ? Renderer.mergeNativeBlend
        : Renderer.mergeManualBlend;
      renderPipe.push(fn(iCanvas, currentList));
    }
  }

  for (var i = 1; i < layerData.length; i += 1) {
    layer = layerData[i];
    mode = layer.blendmode;
    // todo: handle blendmode aliases.
    if (useNative === undefined || useNative !== nativeBlendModes[mode]) {
      pushList();
      currentList = [];
    }
    currentList.push(layer);
    useNative = nativeBlendModes[mode];
    if (i === layerData.length - 1) {
      pushList();
    }
  }
  return renderPipe;
};

// Merges the different canvas layers together in a single image and returns this as a html canvas.
CanvasRenderer.merge = function (iCanvas, layerData) {
  var renderPipe = CanvasRenderer.createRenderPipe(
    CanvasRenderer,
    iCanvas,
    layerData
  );
  var canvas = CanvasRenderer.singleLayerWithOpacity(iCanvas, layerData[0]);
  for (var i = 0; i < renderPipe.length; i += 1) {
    canvas = renderPipe[i](canvas);
  }
  return canvas;
};

CanvasRenderer.composite = function (iCanvas, layerData) {
  if (!layerData || layerData.length === 0) {
    return null;
  }
  if (layerData.length === 1) {
    return CanvasRenderer.singleLayerWithOpacity(iCanvas, layerData[0]);
  }

  return CanvasRenderer.merge(iCanvas, layerData);
};

// Returns an object with additional layer information as well as the input images
// to be passed to the different processing functions.
CanvasRenderer.getLayerData = function (iCanvas, layerImages) {
  var d, layer, layerImg;
  var layerData = [];
  for (var i = 0; i < layerImages.length; i += 1) {
    layer = iCanvas.layers[i];
    layerImg = layerImages[i];
    d = {
      img: layerImg,
      opacity: layer.opacity,
      blendmode: layer.blendmode,
      transform: layer.transform,
      flip_h: layer.flip_h,
      flip_v: layer.flip_v,
    };
    layerData.push(d);
  }
  return layerData;
};

// Renders the image canvas. Top level.
CanvasRenderer.render = function (iCanvas) {
  var layerImages = [];
  for (var i = 0; i < iCanvas.layers.length; i += 1) {
    layerImages.push(CanvasRenderer.processLayer(iCanvas, iCanvas.layers[i]));
  }
  return CanvasRenderer.composite(
    iCanvas,
    CanvasRenderer.getLayerData(iCanvas, layerImages)
  );
};

// Renders the image canvas and turns it into a black and white image. Useful for rendering a layer mask.
CanvasRenderer.renderBW = function (iCanvas) {
  var canvas = CanvasRenderer.render(iCanvas);
  var data = canvas
    .getContext("2d")
    .getImageData(0, 0, canvas.width, canvas.height).data;
  var bwFilter = { name: "desaturate", options: { method: "ITU-R BT.709" } };
  return CanvasRenderer.processImage(canvas, [bwFilter]);
};

export default CanvasRenderer;
