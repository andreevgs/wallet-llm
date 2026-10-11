import fs from "node:fs";
import path from "node:path";
import { Readable } from "node:stream";
import { finished } from "node:stream/promises";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const targetDir = path.resolve(__dirname, "..", "models");
const fileName = "qwen2.5-1.5b-instruct-q4_k_m.gguf";
const targetPath = path.join(targetDir, fileName);

const MODEL_URL =
  "https://huggingface.co/Qwen/Qwen2.5-1.5B-Instruct-GGUF/resolve/main/qwen2.5-1.5b-instruct-q4_k_m.gguf";

async function download() {
  if (fs.existsSync(targetPath)) {
    console.log(`Model already exists at: ${targetPath}`);
    return;
  }

  fs.mkdirSync(targetDir, { recursive: true });
  console.log(`Downloading Qwen 2.5 1.5B Instruct (Q4_K_M)...`);
  console.log(`Source URL: ${MODEL_URL}`);

  const response = await fetch(MODEL_URL, { redirect: "follow" });
  if (!response.ok) {
    throw new Error(
      `Download failed: ${response.status} ${response.statusText}`,
    );
  }

  const totalBytes = Number(response.headers.get("content-length") || 0);
  let downloadedBytes = 0;

  const fileStream = fs.createWriteStream(targetPath);
  const reader = response.body.getReader();

  const nodeStream = new Readable({
    async read() {
      const { done, value } = await reader.read();
      if (done) {
        this.push(null);
      } else {
        downloadedBytes += value.length;
        if (totalBytes > 0) {
          const percent = ((downloadedBytes / totalBytes) * 100).toFixed(1);
          process.stdout.write(
            `\rProgress: ${percent}% (${(downloadedBytes / 1024 / 1024).toFixed(1)} MB)`,
          );
        }
        this.push(Buffer.from(value));
      }
    },
  });

  await finished(nodeStream.pipe(fileStream));
  console.log(`\nModel successfully saved to: ${targetPath}`);
}

async function main() {
  await download();
  const { warmupCache } = await import("./warmup-cache.js");
  await warmupCache();
}

main().catch((err) => {
  console.error("\nError:", err);
  process.exit(1);
});
