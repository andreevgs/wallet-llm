import test from "node:test";
import assert from "node:assert/strict";
import { preprocessInput, postprocessResult } from "../src/transforms.js";

test("Transforms - preprocessInput replaces European decimal commas", () => {
  assert.equal(
    preprocessInput("Купил чай за 14,50 картой"),
    "Купил чай за 14.50 картой",
  );
  assert.equal(preprocessInput("125,5"), "125.5");
  assert.equal(preprocessInput("Zapłaciłem 18,99 zł"), "Zapłaciłem 18.99 zł");
});

test("Transforms - preprocessInput preserves text commas and collapses whitespace", () => {
  assert.equal(
    preprocessInput("Купил   хлеб,   масло и сыр за 20"),
    "Купил хлеб, масло и сыр за 20",
  );
  assert.equal(preprocessInput(""), "");
  assert.equal(preprocessInput(null), "");
});

test("Transforms - postprocessResult rounds numbers to 2 decimal places", () => {
  assert.deepEqual(
    postprocessResult({ amount: 14.5000000002, payment_method: "card" }),
    { amount: 14.5, payment_method: "card" },
  );
  assert.deepEqual(
    postprocessResult({ amount: 18.994, payment_method: "cash" }),
    { amount: 18.99, payment_method: "cash" },
  );
  assert.deepEqual(
    postprocessResult({ amount: 18.996, payment_method: "cash" }),
    { amount: 19, payment_method: "cash" },
  );
});

test("Transforms - postprocessResult normalizes missing amount and invalid payment method", () => {
  assert.deepEqual(
    postprocessResult({ amount: "invalid", payment_method: "crypto" }),
    { amount: 0, payment_method: "unknown" },
  );
  assert.deepEqual(postprocessResult({}), {
    amount: 0,
    payment_method: "unknown",
  });
  assert.deepEqual(postprocessResult(null), {
    amount: 0,
    payment_method: "unknown",
  });
});
