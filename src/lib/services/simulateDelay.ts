// UI-timing jitter only — never touches data values, so it doesn't affect the
// determinism of the numbers themselves.
export function simulateDelay(minMs = 250, maxMs = 450): Promise<void> {
  const delay = minMs + Math.random() * (maxMs - minMs);
  return new Promise((resolve) => setTimeout(resolve, delay));
}
