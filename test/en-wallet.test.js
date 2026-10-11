import test from "node:test";
import assert from "node:assert/strict";
import { runWallet } from "./helpers.js";

test("EN 1. Card payment with slang (bucks and credit card)", () => {
  const result = runWallet("Spent 50 bucks on gas with credit card");
  assert.deepEqual(result, {
    amount: 50,
    payment_method: "card",
  });
});

test("EN 2. Cash payment for food (bucks and cash)", () => {
  const result = runWallet("Paid 30 bucks in cash for pizza");
  assert.deepEqual(result, {
    amount: 30,
    payment_method: "cash",
  });
});

test("EN 3. Unknown payment method (stationery)", () => {
  const result = runWallet("Spent 35 on stationery");
  assert.deepEqual(result, {
    amount: 35,
    payment_method: "unknown",
  });
});

test("EN 4. Large slang multiplier (10k) via wire transfer", () => {
  const result = runWallet("Sent 10k by wire for the used car");
  assert.deepEqual(result, {
    amount: 10000,
    payment_method: "card",
  });
});

test("EN 5. Irrelevant / non-expense statement", () => {
  const result = runWallet("The meeting is rescheduled to Monday morning");
  assert.deepEqual(result, {
    amount: 0,
    payment_method: "unknown",
  });
});

test("EN 6. Item quantity vs total amount", () => {
  const result = runWallet("Bought 4 bagels for 16 dollars with card");
  assert.deepEqual(result, {
    amount: 16,
    payment_method: "card",
  });
});

test("EN 7. Decimal price with cents in cash", () => {
  const result = runWallet("Grabbed a lunch for 14.50 in cash");
  assert.deepEqual(result, {
    amount: 14.5,
    payment_method: "cash",
  });
});

test("EN 8. Apple Pay payment", () => {
  const result = runWallet("Paid 25 for movie tickets with Apple Pay");
  assert.deepEqual(result, {
    amount: 25,
    payment_method: "card",
  });
});

test("EN 9. Slang multiplier (2.5k)", () => {
  const result = runWallet("Spent 2.5k on a new laptop using card");
  assert.deepEqual(result, {
    amount: 2500,
    payment_method: "card",
  });
});

test("EN 10. Unspecified payment method for household supplies", () => {
  const result = runWallet("Spent 85 on household supplies");
  assert.deepEqual(result, {
    amount: 85,
    payment_method: "unknown",
  });
});

test("EN 11. Item quantity vs total amount (3 packs of coffee)", () => {
  const result = runWallet("Bought 3 packs of coffee for 40 with card");
  assert.deepEqual(result, {
    amount: 40,
    payment_method: "card",
  });
});

test("EN 12. Cash payment with bills", () => {
  const result = runWallet("Paid 70 in bills for the antique mirror");
  assert.deepEqual(result, {
    amount: 70,
    payment_method: "cash",
  });
});

test("EN 13. Bank transfer payment", () => {
  const result = runWallet("Sent 200 via bank transfer for utilities");
  assert.deepEqual(result, {
    amount: 200,
    payment_method: "card",
  });
});

test("EN 14. Debit card grocery expense", () => {
  const result = runWallet("Bought groceries for 62.25 with debit card");
  assert.deepEqual(result, {
    amount: 62.25,
    payment_method: "card",
  });
});

test("EN 15. Unspecified pharmacy expense", () => {
  const result = runWallet("Spent 18 at the pharmacy");
  assert.deepEqual(result, {
    amount: 18,
    payment_method: "unknown",
  });
});

test("EN 16. Cash payment for street food", () => {
  const result = runWallet("Got two tacos for 9 in cash");
  assert.deepEqual(result, {
    amount: 9,
    payment_method: "cash",
  });
});

test("EN 17. Unspecified textbook purchase", () => {
  const result = runWallet("Spent 55 on textbooks");
  assert.deepEqual(result, {
    amount: 55,
    payment_method: "unknown",
  });
});

test("EN 18. Card payment for taxi ride", () => {
  const result = runWallet("Took a taxi for 28 paid with card");
  assert.deepEqual(result, {
    amount: 28,
    payment_method: "card",
  });
});

test("EN 19. Cash payment for downtown parking", () => {
  const result = runWallet("Paid 5 in cash for downtown parking");
  assert.deepEqual(result, {
    amount: 5,
    payment_method: "cash",
  });
});

test("EN 20. Irrelevant conversational greeting", () => {
  const result = runWallet("Good morning, how was your weekend trip?");
  assert.deepEqual(result, {
    amount: 0,
    payment_method: "unknown",
  });
});
