# wallet-llm

[![Node.js](https://img.shields.io/badge/Node.js-v22+-green.svg)](https://nodejs.org/)
[![Model](https://img.shields.io/badge/Model-Qwen2.5--1.5B--Instruct-blue.svg)](https://huggingface.co/Qwen/Qwen2.5-1.5B-Instruct-GGUF)
[![Tests](https://img.shields.io/badge/Tests-60%20passed-brightgreen.svg)]()

Atomic, zero-daemon CLI tool that extracts structured expense data (`amount`, `payment_method`) from free-form text in English, Russian, and Polish using a local Qwen 2.5 1.5B model and GBNF grammars.

Runs 100% locally on CPU without background daemons (no Docker, no Ollama). Clean JSON is printed to `stdout`, and telemetry goes to `stderr`.

## Performance on a Low-Power CPU

Evaluating a 640-token system prompt takes ~20 seconds on a basic laptop CPU. To avoid that overhead without running a background server, `wallet-llm` dumps the pre-evaluated KV-cache state to a ~17 MB file on disk. Subsequent CLI runs load this state in **~170 ms**.

Tested on a 15W ultrabook CPU (**Intel Core i7-10510U**, 4 cores / 8 threads, integrated GPU only):

| Execution Phase            | Cold (No Cache) | Hot (KV-Cache Hit) | Speedup          |
| :------------------------- | :-------------- | :----------------- | :--------------- |
| Model & Context Setup      | ~2.9s           | ~2.5s              | -                |
| Time to First Token (TTFT) | 20.7s           | **2.1s**           | **~10x faster**  |
| Total End-to-End Latency   | 26.3s           | **7.6s**           | **~3.5x faster** |

## Quick Start

```bash
git clone https://github.com/andreevgs/wallet-llm.git
cd wallet-llm
npm install
npm run download-model   # downloads Qwen 2.5 1.5B (~980MB) and warms up KV-cache
```

## Usage

```bash
node wallet.js "Bought 3 packs of coffee for 45 with card"
```

```json
{
  "amount": 45,
  "payment_method": "card"
}
```

### With latency telemetry (`--bench`)

```bash
node wallet.js "Spent 200 on taxi" --bench
```

Telemetry is printed to `stderr` without breaking Unix JSON pipelines.

### Multilingual examples

- **EN:** `node wallet.js "Spent 2.5k on flights via wire transfer"` &rarr; `{"amount": 2500, "payment_method": "card"}`
- **RU:** `node wallet.js "Взял 3 пачки кофе за 45 картой"` &rarr; `{"amount": 45, "payment_method": "card"}`
- **PL:** `node wallet.js "Kupiłem bilet za 14,50 gotówką"` &rarr; `{"amount": 14.5, "payment_method": "cash"}`
- **Non-expense:** `node wallet.js "Hello there"` &rarr; `{"amount": 0, "payment_method": "unknown"}`

> **Language support:** Prompt rules and few-shot examples are calibrated specifically for English, Russian, and Polish. Other languages may work, but extraction accuracy is not guaranteed.

## Testing

```bash
npm run test:unit   # fast regex & transforms check (~100 ms)
npm test            # 60 integration test cases (20 RU, 20 EN, 20 PL)
```
