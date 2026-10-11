export function formatBenchmarkTable({
  engineMs = 0,
  modelMs = 0,
  setupMs = 0,
  cacheMs = 0,
  isCacheHit = false,
  inferenceMs = 0,
  totalMs = 0,
  ttftMs = 0,
  tps = "N/A",
  tokenCount = 0,
}) {
  const cacheStatus = isCacheHit
    ? "HIT (Loaded from SSD)"
    : "MISS (Computed & Saved)";

  return [
    "",
    "==================== [ Performance Benchmark ] ====================",
    `  1. Engine Init (node-llama-cpp):    ${engineMs.toFixed(1).padStart(8)} ms`,
    `  2. Model Load (GGUF mapping):        ${modelMs.toFixed(1).padStart(8)} ms`,
    `  3. Context & GBNF Setup:             ${setupMs.toFixed(1).padStart(8)} ms`,
    `     * KV-Cache State:                 ${cacheStatus.padStart(25)}`,
    `     * Cache Load/Prep:                ${cacheMs.toFixed(1).padStart(8)} ms`,
    `  4. LLM Inference (Prompt & Eval):    ${inferenceMs.toFixed(1).padStart(8)} ms`,
    `     * Time to First Token (TTFT):     ${ttftMs.toFixed(1).padStart(8)} ms`,
    `     * Generation Speed:               ${String(tps).padStart(8)} tok/sec (${tokenCount} chunks)`,
    "--------------------------------------------------------------------",
    `  Total End-to-End Latency:            ${totalMs.toFixed(1).padStart(8)} ms`,
    "====================================================================",
    "",
  ].join("\n");
}
