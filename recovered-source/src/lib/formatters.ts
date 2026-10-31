export function formatPrice(amount: number, currency: string = '₹'): string {
  if (isNaN(amount) || amount === null || amount === undefined) return `${currency}0`;
  // Format numbers in Indian numbering system (e.g., 1,50,000)
  const formattedNumber = Math.round(amount).toLocaleString('en-IN');
  return `${currency}${formattedNumber}`;
}
