import fs from "node:fs/promises";
import MagicString from "magic-string";
import { type Plugin } from "rollup";

/**
 * Rollup plugin to import a worker and get the worker URL.
 *
 * @public
 */
export function workerPlugin(): Plugin {
	const mapping = new Map<string, string>();

	return {
		name: "rollup-plugin-worker",

		async resolveId(id, importer) {
			if (id.endsWith("?worker&url")) {
				const filePath = id.replace("?worker&url", "");
				const scopedId = `worker:${filePath}`;
				const resolved = await this.resolve(filePath, importer);
				if (resolved) {
					mapping.set(scopedId, resolved.id);
					return scopedId;
				}
			}
			return null;
		},

		async load(id) {
			if (id.startsWith("worker:")) {
				const resolvedId = mapping.get(id);
				if (!resolvedId) {
					return null;
				}
				return await fs.readFile(resolvedId, "utf-8");
			}
			return null;
		},

		transform(_code, id) {
			if (id.startsWith("worker:")) {
				const resolvedId = mapping.get(id);
				if (!resolvedId) {
					return null;
				}
				const chunkRef = this.emitFile({
					id: resolvedId,
					type: "chunk",
				});
				return {
					code: `export default new URL(__getWorkerFilename__("${chunkRef}"), import.meta.url);`,
					map: { mappings: "" },
				};
			}
			return null;
		},

		renderChunk(code) {
			const regex = /__getWorkerFilename__\("([^"]+)"\)/g;
			const matches = [];
			let match;
			while ((match = regex.exec(code)) !== null) {
				const chunkRef = match[1]!; // eslint-disable-line @typescript-eslint/no-non-null-assertion -- the group will definitly exist */
				const filename = this.getFileName(chunkRef);
				matches.push({
					filename,
					begin: match.index,
					end: regex.lastIndex,
				});
			}
			if (matches.length === 0) {
				return null;
			}
			const ms = new MagicString(code);
			for (const { filename, begin, end } of matches) {
				ms.overwrite(begin, end, JSON.stringify(`./${filename}`));
			}
			return {
				code: ms.toString(),
				map: ms.generateMap({ hires: true }),
			};
		},
	};
}
