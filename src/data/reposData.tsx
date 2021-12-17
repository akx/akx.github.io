import { sortBy, groupBy } from 'lodash';
// eslint-disable-next-line import/no-unresolved
// @ts-ignore
import rawData from '!toml-loader!./repos.toml';
import { Empty, Repository } from './types';

const data: Record<string, Repository | Empty> = rawData;

function isRepository(x: Repository | Empty): x is Repository {
  return !!x.category;
}

export default function massageReposData(): { categories: Record<string, Repository[]> } {
  Object.keys(data).forEach((key) => {
    data[key].name = data[key].name || key;
  });
  const repos = sortBy(Object.values(data).filter(isRepository), 'date');
  const categories = groupBy(repos, 'category');
  return { categories };
}
