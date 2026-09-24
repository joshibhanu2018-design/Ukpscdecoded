/** Pure formatting helpers — safe to import from client components. */
export function formatINR(amount: number): string {
  return `₹${Math.round(amount).toLocaleString("en-IN")}`;
}
