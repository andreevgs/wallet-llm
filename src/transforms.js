export function preprocessInput(text) {
  if (typeof text !== "string") {
    return "";
  }
  return text
    .trim()
    .replace(/(\d+),(\d{1,2})(?!\d)/g, "$1.$2")
    .replace(/\s+/g, " ");
}

export function postprocessResult(parsed) {
  const rawAmount = typeof parsed?.amount === "number" ? parsed.amount : 0;
  return {
    amount: Math.round(rawAmount * 100) / 100,
    payment_method: ["cash", "card", "unknown"].includes(parsed?.payment_method)
      ? parsed.payment_method
      : "unknown",
  };
}
