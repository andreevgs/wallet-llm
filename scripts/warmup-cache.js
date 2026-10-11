import fs from "node:fs";
import { performance } from "node:perf_hooks";
import { getLlama, LlamaLogLevel, LlamaChatSession } from "node-llama-cpp";
import {
  defaultModelPath,
  defaultStateCachePath,
  SYSTEM_PROMPT,
} from "../src/config.js";

export async function warmupCache(options = {}) {
  const {
    modelPath = process.env.MODEL_PATH || defaultModelPath,
    cachePath = defaultStateCachePath,
    force = false,
  } = options;

  if (!fs.existsSync(modelPath)) {
    throw new Error(
      `Model not found at: ${modelPath}\n` +
        "Run: npm run download-model first.",
    );
  }

  if (fs.existsSync(cachePath) && !force) {
    process.stderr.write(`[KV-Cache] Cache already exists at: ${cachePath}\n`);
    return;
  }

  process.stderr.write(
    "[KV-Cache] Warming up system prompt KV-cache (this takes ~20s once)...\n",
  );
  const t0 = performance.now();

  const llama = await getLlama({
    logLevel: LlamaLogLevel.disabled,
  });

  const model = await llama.loadModel({
    modelPath,
    gpuLayers: "max",
  });

  const context = await model.createContext({
    contextSize: 1024,
    batchSize: 1024,
  });

  const sequence = context.getSequence();
  const session = new LlamaChatSession({
    contextSequence: sequence,
    systemPrompt: SYSTEM_PROMPT,
  });

  await session.preloadPrompt("");
  const tPreload = performance.now();

  await sequence.saveStateToFile(cachePath);

  const stats = fs.statSync(cachePath);
  const sizeMb = (stats.size / (1024 * 1024)).toFixed(1);

  process.stderr.write(
    `[KV-Cache] Done! Preload: ${(tPreload - t0).toFixed(0)} ms | ` +
      `Saved: ${sizeMb} MB to ${cachePath}\n`,
  );
}

if (process.argv[1] && process.argv[1].endsWith("warmup-cache.js")) {
  warmupCache({ force: process.argv.includes("--force") })
    .then(() => process.exit(0))
    .catch((err) => {
      process.stderr.write(`[Error] ${err.message}\n`);
      process.exit(1);
    });
}
