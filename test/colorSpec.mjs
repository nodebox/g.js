import assert from "assert";
import { describe, it } from "mocha";
import * as g from "../src/g/index.mjs";

describe("The color object", function () {
  it("can mix two colors", function () {
    var red = new g.Color(1.0, 0.0, 0.0);
    var blue = new g.Color(0.0, 0.0, 1.0);
    assert.deepEqual(g.mix(red, blue), new g.Color(0.5, 0.0, 0.5));
    var r1 = { r: 0.1, g: 0.4, b: 0.7, a: 0.0 };
    var r2 = { r: 0.3, g: 0.6, b: 0.9, a: 1.0 };
    assert.deepEqual(g.mix(r1, r2), new g.Color(0.2, 0.5, 0.8, 0.5));
  });

  it("can treat objects as colors", function () {
    var c1 = { r: 1.0, g: 0.25, b: 0.75 };
    assert.equal(g.Color.toCSS(c1), "rgb(255, 64, 191)");
    var c2 = { r: 1.0, g: 0.25, b: 0.75, a: 0.5 };
    assert.equal(g.Color.toCSS(c2), "rgba(255, 64, 191, 0.5)");
  });
});
