export function normalize(raw) {
  const priceMatch = raw.price_text.match(/[\d.]+/);
  const price_gbp = priceMatch ? parseFloat(priceMatch[0]) : null;

  return {
    ...raw,
    price_gbp
  };
}