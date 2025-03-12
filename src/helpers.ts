export function sortBy<T>(items: readonly T[], sorter: (item: T) => number): T[] {
  return [...items].sort((a, b) => sorter(a) - sorter(b));
}

export function groupBy<T>(items: readonly T[], grouper: (item: T) => string): Record<string, T[]> {
  const groups: Record<string, T[]> = {};
  for (const item of items) {
    const key = grouper(item);
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(item);
  }
  return groups;
}
