import { parentPort } from "node:worker_threads";

/**
 * @param {number[] values}
 * @return {number}
 */
function add(values) {
	return values.reduce((sum, it) => sum + it, 0);
}

parentPort.on("message", (values) => {
	parentPort.postMessage({ result: add(values) });
});
