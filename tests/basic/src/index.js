import * as assert from "node:assert/strict";
import { Worker } from "node:worker_threads";
import workerUrl from "./worker?worker&url";

const worker = new Worker(workerUrl);

const watchDog = setTimeout(() => {
	try {
		worker.terminate();
	} finally {
		assert.fail("timed out");
	}
}, 1000);

worker.on("message", (message) => {
	assert.deepEqual(message, {
		result: 5,
	});
	worker.terminate();
	clearTimeout(watchDog);
});

worker.on("error", (err) => {
	/* eslint-disable-next-line no-console -- expected to log */
	console.error(err);
	assert.fail("worker error");
	clearTimeout(watchDog);
});

worker.postMessage([2, 3]);
