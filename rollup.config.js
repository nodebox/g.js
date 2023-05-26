import { nodeResolve } from "@rollup/plugin-node-resolve";

export default {
  input: "src/g.mjs",
  output: {
    dir: "dist/iife",
    format: "iife",
  },
  plugins: [nodeResolve()],
};
