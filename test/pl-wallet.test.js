import test from "node:test";
import assert from "node:assert/strict";
import { runWallet } from "./helpers.js";

test("PL 1. BLIK payment for groceries", () => {
  const result = runWallet("Zapłaciłem 65 zł BLIKiem za zakupy w Biedronce");
  assert.deepEqual(result, {
    amount: 65,
    payment_method: "card",
  });
});

test("PL 2. Cash payment for transport ticket", () => {
  const result = runWallet("Kupiłem bilet autobusowy za 6 zł gotówką");
  assert.deepEqual(result, {
    amount: 6,
    payment_method: "cash",
  });
});

test("PL 3. Unknown payment method (jacket)", () => {
  const result = runWallet("Kupiłem kurtkę za 120 zł");
  assert.deepEqual(result, {
    amount: 120,
    payment_method: "unknown",
  });
});

test("PL 4. Item quantity vs total cost (3 packs of coffee)", () => {
  const result = runWallet("Kupiłem 3 paczki kawy za 45 zł kartą");
  assert.deepEqual(result, {
    amount: 45,
    payment_method: "card",
  });
});

test("PL 5. European decimal comma with cash", () => {
  const result = runWallet("Zapłaciłem 18,50 zł gotówką w piekarni");
  assert.deepEqual(result, {
    amount: 18.5,
    payment_method: "cash",
  });
});

test("PL 6. Word numeral (pięćdziesiąt)", () => {
  const result = runWallet("Zapłaciłem pięćdziesiąt złotych za obiad kartą");
  assert.deepEqual(result, {
    amount: 50,
    payment_method: "card",
  });
});

test("PL 7. Slang denomination (stówa = 100)", () => {
  const result = runWallet("Wydałem stówę na paliwo gotówką");
  assert.deepEqual(result, {
    amount: 100,
    payment_method: "cash",
  });
});

test("PL 8. Card payment for utilities", () => {
  const result = runWallet("Opłaciłem rachunek kartą na 1200 zł");
  assert.deepEqual(result, {
    amount: 1200,
    payment_method: "card",
  });
});

test("PL 9. Slang multiplier (2.5k)", () => {
  const result = runWallet("Kupiłem rower za 2.5k kartą");
  assert.deepEqual(result, {
    amount: 2500,
    payment_method: "card",
  });
});

test("PL 10. Irrelevant / non-expense text", () => {
  const result = runWallet("Dzień dobry, o której jutro zaczynamy warsztaty?");
  assert.deepEqual(result, {
    amount: 0,
    payment_method: "unknown",
  });
});

test("PL 11. BLIK payment for online book order", () => {
  const result = runWallet("Kupiłem książkę za 42 zł BLIKiem");
  assert.deepEqual(result, {
    amount: 42,
    payment_method: "card",
  });
});

test("PL 12. Decimal comma with card in pharmacy", () => {
  const result = runWallet("Zapłaciłem 24,90 zł kartą w aptece");
  assert.deepEqual(result, {
    amount: 24.9,
    payment_method: "card",
  });
});

test("PL 13. Cash payment for market fruits", () => {
  const result = runWallet("Kupiłem owoce na targu za 15 zł gotówką");
  assert.deepEqual(result, {
    amount: 15,
    payment_method: "cash",
  });
});

test("PL 14. Unknown payment method for shoes", () => {
  const result = runWallet("Kupiłem buty za 230 zł");
  assert.deepEqual(result, {
    amount: 230,
    payment_method: "unknown",
  });
});

test("PL 15. Item quantity vs total cost (pastries)", () => {
  const result = runWallet("Wziąłem 4 drożdżówki za 20 zł gotówką");
  assert.deepEqual(result, {
    amount: 20,
    payment_method: "cash",
  });
});

test("PL 16. Slang denomination (koło = 1000)", () => {
  const result = runWallet("Kupiłem używany laptop za koło kartą");
  assert.deepEqual(result, {
    amount: 1000,
    payment_method: "card",
  });
});

test("PL 17. Apple Pay payment for cinema ticket", () => {
  const result = runWallet("Zapłaciłem 35 zł przez Apple Pay za bilet do kina");
  assert.deepEqual(result, {
    amount: 35,
    payment_method: "card",
  });
});

test("PL 18. Unknown payment method for backpack", () => {
  const result = runWallet("Kupiłem plecak za 85 zł");
  assert.deepEqual(result, {
    amount: 85,
    payment_method: "unknown",
  });
});

test("PL 19. Cash payment for parking", () => {
  const result = runWallet("Zapłaciłem 8 zł gotówką za parking");
  assert.deepEqual(result, {
    amount: 8,
    payment_method: "cash",
  });
});

test("PL 20. Irrelevant question", () => {
  const result = runWallet("Czy mógłbyś podesłać mi ten raport do wglądu?");
  assert.deepEqual(result, {
    amount: 0,
    payment_method: "unknown",
  });
});
