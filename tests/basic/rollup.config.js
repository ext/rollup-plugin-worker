import { defineConfig } from "rollup";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import { workerPlugin } from "../../dist/index.js";

export default defineConfig({
	input: "src/index.js",
	output: {
		dir: "dist",
		format: "esm",
	},
	plugins: [nodeResolve(), workerPlugin()],
});
