// Draw objects to the canvas

"use strict";

import Color from "../objects/color";

// Return true if an object can be drawn using the `g.draw` function.
export function isDrawable(o) {
  if (Array.isArray(o)) {
    o = o[0];
  }
  if (!o) {
    return false;
  } else if (typeof o.draw === "function") {
    return true;
  } else if (typeof o.x === "number" && typeof o.y === "number") {
    return true;
  } else if (
    typeof o.r === "number" &&
    typeof o.g === "number" &&
    typeof o.b === "number"
  ) {
    return true;
  } else {
    return false;
  }
}

export function drawPoints(ctx, points) {
  ctx.fillStyle = "blue";
  ctx.beginPath();
  var pt;
  for (var i = 0; i < points.length; i += 1) {
    pt = points[i];
    ctx.moveTo(pt.x, pt.y);
    ctx.arc(pt.x, pt.y, 2, 0, Math.PI * 2, false);
  }
  ctx.fill();
}

export function drawColoredPoints(ctx, points) {
  var pt;
  for (var i = 0, n = points.length; i < n; i += 1) {
    pt = points[i];
    ctx.fillStyle = Color.toCSS(pt);
    ctx.fillRect(pt.x - 2, pt.y - 2, 4, 4);
  }
}

export function drawRectangles(ctx, rectangles) {
  ctx.save();
  var r;
  for (var i = 0; i < rectangles.length; i += 1) {
    r = rectangles[i];
    ctx.strokeStyle = "black";
    ctx.strokeWidth = 1;
    ctx.rect(r.x, r.y, r.width, r.height);
    ctx.stroke();
  }
  ctx.restore();
}

export function drawColors(ctx, colors) {
  ctx.save();
  var c;
  for (var i = 0; i < colors.length; i += 1) {
    c = colors[i];
    ctx.fillStyle = Color.toCSS(c);
    ctx.fillRect(0, 0, 30, 30);
    ctx.translate(30, 0);
  }
  ctx.restore();
}

export function draw(ctx, o) {
  var k = o;
  var isArray = false;
  if (Array.isArray(o)) {
    k = o[0];
    isArray = true;
  }

  if (k) {
    if (typeof k.draw === "function") {
      if (isArray) {
        for (var i = 0, n = o.length; i < n; i += 1) {
          draw(ctx, o[i]);
        }
      } else {
        o.draw(ctx);
      }
    } else if (typeof k.x === "number" && typeof k.y === "number") {
      if (
        typeof k.r === "number" &&
        typeof k.g === "number" &&
        typeof k.b === "number"
      ) {
        drawColoredPoints(ctx, isArray ? o : [o]);
      } else if (typeof k.width === "number" && typeof k.height === "number") {
        drawRectangles(ctx, isArray ? o : [o]);
      } else {
        drawPoints(ctx, isArray ? o : [o]);
      }
    } else if (
      typeof k.r === "number" &&
      typeof k.g === "number" &&
      typeof k.b === "number"
    ) {
      drawColors(ctx, isArray ? o : [o]);
    }
  }
}

export function toSVG(o, options) {
  options = options || {};
  var includeHeader = options.header === true;
  var x = options.x !== undefined ? options.x : 0;
  var y = options.y !== undefined ? options.y : 0;
  var width = options.width !== undefined ? options.width : 500;
  var height = options.height !== undefined ? options.height : 500;
  var svg = "";
  if (o) {
    if (typeof o.toSVG === "function") {
      svg = o.toSVG();
    } else if (Array.isArray(o)) {
      svg = "<g>\n";
      for (var i = 0, n = o.length; i < n; i += 1) {
        svg += vg.toSVG(o[i]) + "\n";
      }
      svg += "</g>\n";
    }
  }
  if (includeHeader) {
    svg =
      `<?xml version="1.0" encoding="utf-8"?>\n` +
      `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="${x}" y="${y}" width="${width}px" height="${height}px" viewBox="${x} ${y} ${width} ${height}">\n` +
      svg +
      "\n" +
      `</svg>\n`;
  }
  return svg;
}
