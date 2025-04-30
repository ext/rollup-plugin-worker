# @sidvind/rollup-plugin-worker

![NPM Version](https://img.shields.io/npm/v/%40sidvind%2Frollup-plugin-worker)
![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/ext/rollup-plugin-worker/.github%2Fworkflows%2Fbuild.yml)

Rollup plugin to import a worker and get the worker URL.

- Import worker as URL
- Generates separate chunk for each worker.
- ESM only
- Typescript compatible

> [!IMPORTANT]
> This plugin is intended for my own use-cases and I'll maintain it as such.
> Feel free to use it as you feel fit but I will not accept feature requests without pull requests, i.e. if you don't intend to put in the work yourself it is unlikely to be implemented.
> Issues and bugs are accepted.

## Usage

```ts
import { Worker } from "node:worker_threads";
import workerUrl from "./awesome-worker?worker&url";

const worker = new Worker(workerUrl);
```

This generates a separate chunk `awesome-worker-[chunk].js` and is exported as a URL to the chunk.
