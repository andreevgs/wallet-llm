import test from "node:test";
import assert from "node:assert/strict";
import { runWallet } from "./helpers.js";

test("RU 1. Card payment for fuel (neutral amount)", () => {
  const result = runWallet("Заправил авто картой на 45");
  assert.deepEqual(result, {
    amount: 45,
    payment_method: "card",
  });
});

test("RU 2. Cash payment for haircut (neutral amount)", () => {
  const result = runWallet("Отдал за стрижку 25 наличными");
  assert.deepEqual(result, {
    amount: 25,
    payment_method: "cash",
  });
});

test("RU 3. Unknown payment method (gift)", () => {
  const result = runWallet("Потратил 50 на подарок");
  assert.deepEqual(result, {
    amount: 50,
    payment_method: "unknown",
  });
});

test("RU 4. Item quantity vs total cost (3 packs of coffee)", () => {
  const result = runWallet("Взял 3 пачки кофе за 45 картой");
  assert.deepEqual(result, {
    amount: 45,
    payment_method: "card",
  });
});

test("RU 5. Irrelevant / non-expense statement", () => {
  const result = runWallet("Позвони мне завтра в три часа");
  assert.deepEqual(result, {
    amount: 0,
    payment_method: "unknown",
  });
});

test("RU 6. Item quantity vs total cost (croissants)", () => {
  const result = runWallet("Взял 4 круассана за 16 картой");
  assert.deepEqual(result, {
    amount: 16,
    payment_method: "card",
  });
});

test("RU 7. European decimal comma with card", () => {
  const result = runWallet("Купил чай за 4,50 картой");
  assert.deepEqual(result, {
    amount: 4.5,
    payment_method: "card",
  });
});

test("RU 8. Decimal comma with cash", () => {
  const result = runWallet("Отдал 12,80 наличными за обед");
  assert.deepEqual(result, {
    amount: 12.8,
    payment_method: "cash",
  });
});

test("RU 9. Slang denomination (сотка = 100) with cash", () => {
  const result = runWallet("Заплатил сотку наличными за проезд");
  assert.deepEqual(result, {
    amount: 100,
    payment_method: "cash",
  });
});

test("RU 10. Word numeral (двести) with card", () => {
  const result = runWallet("Потратил двести на такси картой");
  assert.deepEqual(result, {
    amount: 200,
    payment_method: "card",
  });
});

test("RU 11. Word numeral (пятьдесят) with cash", () => {
  const result = runWallet("Отдал пятьдесят наличными за мойку");
  assert.deepEqual(result, {
    amount: 50,
    payment_method: "cash",
  });
});

test("RU 12. Card payment for subscription", () => {
  const result = runWallet("Оплатил подписку картой на 15");
  assert.deepEqual(result, {
    amount: 15,
    payment_method: "card",
  });
});

test("RU 13. Card payment via Apple Pay", () => {
  const result = runWallet("Купил билет через Apple Pay за 8");
  assert.deepEqual(result, {
    amount: 8,
    payment_method: "card",
  });
});

test("RU 14. Cash slang (наличка)", () => {
  const result = runWallet("Купил овощи на рынке за 18 наличкой");
  assert.deepEqual(result, {
    amount: 18,
    payment_method: "cash",
  });
});

test("RU 15. Unknown payment method (repairs)", () => {
  const result = runWallet("Ремонт велосипеда стоил 65");
  assert.deepEqual(result, {
    amount: 65,
    payment_method: "unknown",
  });
});

test("RU 16. Unknown payment method (dry cleaning)", () => {
  const result = runWallet("Химчистка одежды стоила 35");
  assert.deepEqual(result, {
    amount: 35,
    payment_method: "unknown",
  });
});

test("RU 17. Bank transfer (переводом)", () => {
  const result = runWallet("Скинул за пиццу переводом 30");
  assert.deepEqual(result, {
    amount: 30,
    payment_method: "card",
  });
});

test("RU 18. Card payment (с карты)", () => {
  const result = runWallet("Оплатил картой отель на 90");
  assert.deepEqual(result, {
    amount: 90,
    payment_method: "card",
  });
});

test("RU 19. Cash slang (налом)", () => {
  const result = runWallet("Отдал налом 40 за доставку");
  assert.deepEqual(result, {
    amount: 40,
    payment_method: "cash",
  });
});

test("RU 20. Irrelevant question without expenses", () => {
  const result = runWallet("Какая завтра будет погода?");
  assert.deepEqual(result, {
    amount: 0,
    payment_method: "unknown",
  });
});
