import { groupBy } from '../helpers.ts';
import rawData from './repos.toml';
import type { Empty, Repository } from './types';

const data: Record<string, Repository | Empty> = rawData;

function isRepository(x: Repository | Empty): x is Repository {
  return !!x.category;
}

export default function massageReposData(): { categories: Record<string, Repository[]> } {
  for (const key of Object.keys(data)) {
    data[key].name = data[key].name || key;
  }
  const repos = Object.values(data)
    .filter(isRepository)
    .sort((a, b) => a.date.localeCompare(b.date));
  const categories = groupBy(repos, (r) => r.category);
  return { categories };
}
