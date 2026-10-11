#!/usr/bin/env node
import process from "node:process";
import { extractExpense } from "./src/extractor.js";
import { formatBenchmarkTable } from "./src/benchmark.js";

const isBench = process.argv.includes("--bench") || Boolean(process.env.BENCH);
const cleanArgs = process.argv.slice(2).filter((arg) => arg !== "--bench");
const rawInput = cleanArgs[0];

if (
  !rawInput ||
  process.argv.includes("--help") ||
  process.argv.includes("-h")
) {
  process.stderr.write(
    'Usage: node wallet.js "<expense description>" [--bench]\n' +
      'Example: node wallet.js "Bought coffee with card for 25" --bench\n',
  );
  process.exit(rawInput ? 0 : 1);
}

async function main() {
  try {
    const { result, benchmark } = await extractExpense(rawInput, { isBench });

    process.stdout.write(JSON.stringify(result, null, 2) + "\n");

    if (benchmark) {
      process.stderr.write(formatBenchmarkTable(benchmark) + "\n");
    }

    process.exit(0);
  } catch (error) {
    process.stderr.write(`[Fatal Error] ${error.message}\n`);
    if (process.env.DEBUG) {
      process.stderr.write(`${error.stack}\n`);
    }
    process.exit(1);
  }
}

main();
