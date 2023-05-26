import * as esbuild from "esbuild";

(async () => {
  await esbuild.build({
    entryPoints: ["src/g.mjs"],
    bundle: true,
    minify: true,
    sourcemap: true,
    format: "esm",
    outfile: "dist/esm/g.min.js",
  });

  await esbuild.build({
    entryPoints: ["src/g.mjs"],
    bundle: true,
    minify: true,
    sourcemap: true,
    globalName: "g",
    format: "iife",
    outfile: "dist/iife/g.min.js",
  });
})();
