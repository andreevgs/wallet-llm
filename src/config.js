import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const defaultModelPath = path.resolve(
  __dirname,
  "..",
  "models",
  "qwen2.5-1.5b-instruct-q4_k_m.gguf",
);

export const expenseSchema = {
  type: "object",
  properties: {
    amount: {
      type: "number",
      description: "Expense amount as a number",
    },
    payment_method: {
      type: "string",
      enum: ["cash", "card", "unknown"],
      description: "Payment method: cash, card, or unknown",
    },
  },
  required: ["amount", "payment_method"],
};

export const SYSTEM_PROMPT = `You are a multilingual financial expense extractor. Extract the total expense amount (amount: number) and payment method (payment_method: "cash" | "card" | "unknown") from RU, EN, PL text.

Rules:
- amount: The TOTAL PRICE/COST paid (associated with currency or "for"/"за"/"za"). NEVER extract item quantity/count (e.g., "3 packs of coffee for 60" -> 60, NOT 3).
- Numerals: "k"/"к" = 1000 ("1.5k" -> 1500), "stówa"/"сотка" = 100, "двести" = 200, "pięćdziesiąt" = 50, "koło"/"tysiak"/"косарь" = 1000.
- If amount is missing or text is not about expenses: amount = 0.
- payment_method:
  * "cash": ONLY if explicitly stated (cash, bills, нал, наличка, gotówka). Currency names (zł, $, €, etc.) are NOT payment methods.
  * "card": ONLY if explicitly stated (card, wire, Apple Pay, transfer, карта, картой, безнал, безналом, перевод, karta, kartą, przelew, przelewem, BLIK).
  * "unknown": DEFAULT whenever payment method is not explicitly named. Do not guess cash or card.

Examples:
Input: "Взял 3 пачки кофе за 60 картой" -> {"amount": 60, "payment_method": "card"}
Input: "Zapłaciłem 14.50 gotówką za bilet" -> {"amount": 14.5, "payment_method": "cash"}
Input: "Spent 45 on groceries" -> {"amount": 45, "payment_method": "unknown"}
Input: "Kupiłem obiad za pięćdziesiąt złotych" -> {"amount": 50, "payment_method": "unknown"}
Input: "Wydałem stówę na zakupy" -> {"amount": 100, "payment_method": "unknown"}
Input: "Kupiłem kurtkę za 120 zł" -> {"amount": 120, "payment_method": "unknown"}
Input: "Потратил двести на такси" -> {"amount": 200, "payment_method": "unknown"}
Input: "Пообедал на 15 картой" -> {"amount": 15, "payment_method": "card"}
Input: "Zatankowałem za koło gotówką" -> {"amount": 1000, "payment_method": "cash"}
Input: "Cześć, co tam słychać?" -> {"amount": 0, "payment_method": "unknown"}`;

export const promptHash = crypto
  .createHash("sha256")
  .update(SYSTEM_PROMPT)
  .digest("hex")
  .slice(0, 8);

export const defaultStateCachePath = path.resolve(
  __dirname,
  "..",
  "models",
  `prompt-cache-${promptHash}.bin`,
);
