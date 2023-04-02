"use strict";

import * as async from "async-es";
import CanvasRenderer from "./canvasrenderer";

// Utility function that passes its input (normally a html canvas) to the next function.
function passThrough(canvas, callback) {
  callback(null, canvas);
}

// RENDERING.

// The Layer and ImageCanvas objects don't do any actual pixel operations themselves,
// they only contain information about the operations. The actual rendering is done
// by a Renderer object. Currently there is only one kind available, the CanvasRenderer,
// which uses the HTML Canvas object (containing the pixel data) and a 2D context that
// acts on this canvas object. In the future, a webgl renderer might be added as well.

const AsyncRenderer = {};

// Renders a html canvas as an html Image. Currently unused.
AsyncRenderer.toImage = function () {
  return function (canvas, callback) {
    callback(null, CanvasRenderer.toImage(canvas));
  };
};

// 'LOADING' OF LAYERS.

// Returns a html canvas dependent on the type of the layer provided.
AsyncRenderer.load = function (iCanvas, layer) {
  if (layer.isPath()) {
    return AsyncRenderer.loadFile(layer.data);
  } else if (layer.isFill()) {
    return AsyncRenderer.generateColor(iCanvas, layer);
  } else if (layer.isGradient()) {
    return AsyncRenderer.generateGradient(iCanvas, layer);
  } else if (layer.isHtmlCanvas()) {
    return AsyncRenderer.loadHtmlCanvas(layer.data);
  } else if (layer.isImage()) {
    return AsyncRenderer.loadImage(layer.data);
  } else if (layer.isImageCanvas()) {
    return AsyncRenderer.loadImageCanvas(layer.data);
  }
};

// Returns a html canvas from an image file location.
AsyncRenderer.loadFile = function (src) {
  return function (_, callback) {
    var canvas = document.createElement("canvas");
    var ctx = canvas.getContext("2d");

    var source = new Image();
    source.onload = function () {
      canvas.width = source.width;
      canvas.height = source.height;
      ctx.drawImage(source, 0, 0, canvas.width, canvas.height);
      callback(null, canvas);
    };
    source.src = src;
  };
};

// Passes a html canvas.
AsyncRenderer.loadHtmlCanvas = function (canvas) {
  return function (_, callback) {
    callback(null, canvas);
  };
};

// Returns a html canvas from rendering an ImageCanvas.
AsyncRenderer.loadImageCanvas = function (iCanvas) {
  return function (_, callback) {
    iCanvas.render(function (canvas) {
      callback(null, canvas);
    });
  };
};

// Returns a html canvas from rendering a stored Image file.
AsyncRenderer.loadImage = function (img) {
  return function (_, callback) {
    var canvas = CanvasRenderer.loadImage(img);
    callback(null, canvas);
  };
};

// Returns a html canvas with a solid fill color.
AsyncRenderer.generateColor = function (iCanvas, layer) {
  return function (_, callback) {
    var canvas = CanvasRenderer.generateColor(iCanvas, layer);
    callback(null, canvas);
  };
};

// Returns a html canvas with a gradient.
AsyncRenderer.generateGradient = function (iCanvas, layer) {
  return function (_, callback) {
    var canvas = CanvasRenderer.generateGradient(iCanvas, layer);
    callback(null, canvas);
  };
};

// PROCESSING OF LAYERS.

// Performs a number of filtering operations on an html image.
// This method executes on the main thread if web workers aren't available on the current system.
AsyncRenderer.processImage = function (filters) {
  if (filters.length === 0) {
    return passThrough;
  }

  return function (canvas, callback) {
    CanvasRenderer.processImage(canvas, filters);
    callback(null, canvas);
  };
};

// Renders the layer mask and applies it to the layer that it is supposed to mask.
AsyncRenderer.processMask = function (mask) {
  if (mask.layers.length === 0) {
    return passThrough;
  }
  return function (canvas, callback) {
    mask.width = canvas.width;
    mask.height = canvas.height;

    // First, make a black and white version of the masking canvas and pass
    // the result to the masking operation.
    AsyncRenderer.renderBW(mask, function (c) {
      var data = c.getContext("2d").getImageData(0, 0, c.width, c.height).data;
      var maskFilter = {
        name: "mask",
        options: { data: data, x: 0, y: 0, width: c.width, height: c.height },
      };
      var fn = AsyncRenderer.processImage([maskFilter]);
      fn(canvas, callback);
    });
  };
};

// Processes a single layer. First the layer image is loaded, then a mask (if applicable) is applied to it,
// and finally the filters (if any) are applied to it.
function processLayers(iCanvas) {
  return function (layer, callback) {
    async.compose(
      AsyncRenderer.processImage(layer.filters),
      AsyncRenderer.processMask(layer.mask),
      AsyncRenderer.load(iCanvas, layer)
    )(null, callback);
  };
}

// LAYER BLENDING.

// Blends the subsequent layer images with the base layer and returns a single image.
// This method is used when web workers aren't available for use on this system.
AsyncRenderer.mergeManualBlend = function (iCanvas, layerData) {
  return function (canvas, callback) {
    CanvasRenderer.mergeManualBlend(iCanvas, layerData)(canvas);
    callback(null, canvas);
  };
};

// Blends the subsequent layer images with the base layer and returns the resulting image.
// This method is used when the system supports the requested blending mode(s).
AsyncRenderer.mergeNativeBlend = function (iCanvas, layerData) {
  return function (canvas, callback) {
    CanvasRenderer.mergeNativeBlend(iCanvas, layerData)(canvas);
    callback(null, canvas);
  };
};

// Merges the different canvas layers together in a single image and returns this as a html canvas.
AsyncRenderer.merge = function (iCanvas, layerData, callback) {
  var renderPipe = CanvasRenderer.createRenderPipe(
    AsyncRenderer,
    iCanvas,
    layerData
  );
  renderPipe.reverse();

  var canvas = CanvasRenderer.singleLayerWithOpacity(iCanvas, layerData[0]);
  renderPipe.push(function (_, cb) {
    cb(null, canvas);
  });

  async.compose.apply(null, renderPipe)(null, function () {
    callback(canvas);
  });
};

AsyncRenderer.composite = function (iCanvas, layerData, callback) {
  if (!layerData || layerData.length === 0) {
    callback(null);
    return;
  }
  if (layerData.length === 1) {
    callback(CanvasRenderer.singleLayerWithOpacity(iCanvas, layerData[0]));
    return;
  }

  AsyncRenderer.merge(iCanvas, layerData, callback);
};

// Renders the image canvas. Top level.
AsyncRenderer.render = function (iCanvas, callback) {
  async.map(
    iCanvas.layers,
    processLayers(iCanvas),
    function (err, layerImages) {
      if (callback) {
        AsyncRenderer.composite(
          iCanvas,
          CanvasRenderer.getLayerData(iCanvas, layerImages),
          callback
        );
      }
    }
  );
};

// Renders the image canvas and turns it into a black and white image. Useful for rendering a layer mask.
AsyncRenderer.renderBW = function (iCanvas, callback) {
  AsyncRenderer.render(iCanvas, function (canvas) {
    var data = canvas
      .getContext("2d")
      .getImageData(0, 0, canvas.width, canvas.height).data;
    var bwFilter = { name: "desaturate", options: { method: "ITU-R BT.709" } };
    var fn = AsyncRenderer.processImage([bwFilter]);
    fn(canvas, function (err, c) {
      callback(c);
    });
  });
};

export default AsyncRenderer;
