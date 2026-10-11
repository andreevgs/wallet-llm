import os from "node:os";
import fs from "node:fs";
import { performance } from "node:perf_hooks";
import { getLlama, LlamaLogLevel, LlamaChatSession } from "node-llama-cpp";
import {
  defaultModelPath,
  defaultStateCachePath,
  expenseSchema,
  SYSTEM_PROMPT,
} from "./config.js";
import { preprocessInput, postprocessResult } from "./transforms.js";

export async function extractExpense(rawInput, options = {}) {
  const {
    modelPath = process.env.MODEL_PATH || defaultModelPath,
    cachePath = defaultStateCachePath,
    isBench = false,
  } = options;

  if (!fs.existsSync(modelPath)) {
    throw new Error(
      `Model file not found at: ${modelPath}\n` +
        "Please download the model into models/ or set the MODEL_PATH environment variable.\n" +
        "Run: npm run download-model",
    );
  }

  const t0 = performance.now();

  const llama = await getLlama({
    logLevel: LlamaLogLevel.disabled,
  });
  const tEngine = performance.now();

  const model = await llama.loadModel({
    modelPath,
    gpuLayers: "max",
  });
  const tModel = performance.now();

  const threads = Math.max(1, Math.min(os.cpus().length, 8));
  const context = await model.createContext({
    contextSize: 1024,
    batchSize: 1024,
    threads,
  });

  const grammar = await llama.createGrammarForJsonSchema(expenseSchema);
  const sequence = context.getSequence();

  let isCacheHit = false;
  const tCacheStart = performance.now();

  if (fs.existsSync(cachePath)) {
    try {
      await sequence.loadStateFromFile(cachePath, { acceptRisk: true });
      isCacheHit = true;
    } catch {
      isCacheHit = false;
    }
  }

  const session = new LlamaChatSession({
    contextSequence: sequence,
    systemPrompt: SYSTEM_PROMPT,
  });

  if (!isCacheHit) {
    await session.preloadPrompt("");
    try {
      await sequence.saveStateToFile(cachePath);
    } catch {
      //
    }
  }

  const tCacheEnd = performance.now();
  const cacheMs = tCacheEnd - tCacheStart;
  const tSetup = tCacheEnd;

  const sanitizedInput = preprocessInput(rawInput);

  let firstTokenTime = null;
  let tokenCount = 0;
  const tPromptStart = performance.now();

  const responseText = await session.prompt(sanitizedInput, {
    grammar,
    maxTokens: 64,
    temperature: 0,
    onTextChunk: isBench
      ? () => {
          if (firstTokenTime === null) {
            firstTokenTime = performance.now();
          }
          tokenCount++;
        }
      : undefined,
  });
  const tInference = performance.now();

  const parsed = JSON.parse(responseText.trim());
  const result = postprocessResult(parsed);

  let benchmark = null;
  if (isBench) {
    const engineMs = tEngine - t0;
    const modelMs = tModel - tEngine;
    const setupMs = tSetup - tModel;
    const inferenceMs = tInference - tSetup;
    const totalMs = tInference - t0;
    const ttftMs = firstTokenTime !== null ? firstTokenTime - tPromptStart : 0;
    const genTimeSec =
      firstTokenTime !== null ? (tInference - firstTokenTime) / 1000 : 0;
    const tps =
      genTimeSec > 0 && tokenCount > 0
        ? (tokenCount / genTimeSec).toFixed(1)
        : "N/A";

    benchmark = {
      engineMs,
      modelMs,
      setupMs,
      cacheMs,
      isCacheHit,
      inferenceMs,
      totalMs,
      ttftMs,
      tps,
      tokenCount,
    };
  }

  return { result, benchmark };
}
