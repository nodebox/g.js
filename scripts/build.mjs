import * as esbuild from "esbuild";

await esbuild.build({
  entryPoints: ["src/g.js"],
  bundle: true,
  minify: true,
  sourcemap: true,
  format: "esm",
  outfile: "dist/esm/g.min.js",
});

await esbuild.build({
  entryPoints: ["src/g.js"],
  bundle: true,
  minify: true,
  sourcemap: true,
  format: "iife",
  outfile: "dist/iife/g.min.js",
});
