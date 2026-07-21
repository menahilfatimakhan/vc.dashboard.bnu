// Deterministic PRNG (mulberry32) so dummy data is stable across reloads/rebuilds.
// Never seed with Date.now() — see DATA_SEED below and store.ts for per-generator offsets.

function createPRNG(seed: number) {
  let a = seed >>> 0;
  return function next(): number {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export interface SeededRandom {
  float(min?: number, max?: number): number;
  int(min: number, max: number): number;
  bool(p?: number): boolean;
  pick<T>(arr: readonly T[]): T;
  weightedPick<T>(items: readonly { item: T; weight: number }[]): T;
  gaussian(mean: number, sd: number): number;
  shuffle<T>(arr: T[]): T[];
}

export function seededRandom(seed: number): SeededRandom {
  const rand = createPRNG(seed);

  function float(min = 0, max = 1): number {
    return min + rand() * (max - min);
  }

  function int(min: number, max: number): number {
    return Math.floor(min + rand() * (max - min + 1));
  }

  function bool(p = 0.5): boolean {
    return rand() < p;
  }

  function pick<T>(arr: readonly T[]): T {
    return arr[Math.floor(rand() * arr.length)];
  }

  function weightedPick<T>(items: readonly { item: T; weight: number }[]): T {
    const total = items.reduce((sum, i) => sum + i.weight, 0);
    let r = rand() * total;
    for (const entry of items) {
      r -= entry.weight;
      if (r <= 0) return entry.item;
    }
    return items[items.length - 1].item;
  }

  // Box-Muller transform
  function gaussian(mean: number, sd: number): number {
    let u = 0;
    let v = 0;
    while (u === 0) u = rand();
    while (v === 0) v = rand();
    const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    return mean + z * sd;
  }

  function shuffle<T>(arr: T[]): T[] {
    const copy = arr.slice();
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(rand() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  return { float, int, bool, pick, weightedPick, gaussian, shuffle };
}

// Fixed constant — every generator derives its own instance from DATA_SEED + a
// fixed offset (see store.ts) so unrelated generators never desync from each other.
export const DATA_SEED = 0xb4a17e;
