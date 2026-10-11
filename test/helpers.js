import { execFileSync } from "node:child_process";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const walletScript = path.resolve(__dirname, "..", "wallet.js");

export function runWallet(input, flags = []) {
  const output = execFileSync(
    process.execPath,
    [walletScript, input, ...flags],
    {
      encoding: "utf-8",
    },
  );
  return JSON.parse(output.trim());
}
