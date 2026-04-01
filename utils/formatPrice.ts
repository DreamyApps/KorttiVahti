export function formatPrice(price: number): string {
  return price.toLocaleString('fi-FI', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function formatPriceCompact(price: number): string {
  return `${price.toFixed(2).replace('.', ',')} €`;
}

export function formatPriceChange(current: number, previous: number): string {
  const diff = current - previous;
  const sign = diff > 0 ? '+' : '';
  return `${sign}${diff.toFixed(2).replace('.', ',')} €`;
}

export function calculateDiscount(current: number, original: number): number {
  if (original <= 0) return 0;
  return Math.round(((original - current) / original) * 100);
}
