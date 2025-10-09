/* eslint-disable no-console -- expected to log */
import fs from "node:fs/promises";
import { Extractor, ExtractorConfig } from "@microsoft/api-extractor";
import * as esbuild from "esbuild";
import isCI from "is-ci";

async function build() {
	const result = await esbuild.build({
		entryPoints: ["src/index.ts"],
		outdir: "dist",
		sourcemap: true,
		bundle: true,
		platform: "node",
		target: "node20",
		format: "esm",
		metafile: true,
		logLevel: "info",
	});
	console.log(await esbuild.analyzeMetafile(result.metafile));
}

async function apiExtractor() {
	if (isCI) {
		console.group(`Running API Extractor in CI mode.`);
	} else {
		console.group(`Running API Extractor in local mode.`);
	}
	const config = ExtractorConfig.loadFileAndPrepare("api-extractor.json");
	const result = Extractor.invoke(config, {
		localBuild: !isCI,
		showVerboseMessages: true,
	});
	if (result.succeeded) {
		console.log(`API Extractor completed successfully`);
	} else {
		const { errorCount, warningCount } = result;
		console.error(
			[
				"API Extractor completed with",
				`${errorCount} error(s) and ${warningCount} warning(s)`,
			].join("\n"),
		);
		process.exitCode = 1;
	}
	console.groupEnd();
}

await fs.rm("dist", { force: true, recursive: true });
await build();
await apiExtractor();
await fs.copyFile("src/client-types.d.ts", "dist/client-types.d.ts");
