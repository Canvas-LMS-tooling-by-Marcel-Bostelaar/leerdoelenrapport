export function groupBy<T, K>(
  array: T[],
  key: (item: T) => K
): Array<{ key: K; items: T[] }> {
  const map = new Map<K, T[]>();

  for (const item of array) {
    const k = key(item);
    (map.get(k) ?? map.set(k, []).get(k)!).push(item);
  }

  return Array.from(map, ([key, items]) => ({ key, items }));
}

export function groupByMap<T, K>(
  array: T[],
  key: (item: T) => K
): Map<K, T[]> {
  const map = new Map<K, T[]>();

  for (const item of array) {
    const k = key(item);
    map.set(k, [...(map.get(k) ?? []), item]);
  }

  return map;
}