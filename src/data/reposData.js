import { sortBy, groupBy } from 'lodash';
// eslint-disable-next-line import/no-unresolved
import data from '!toml-loader!./repos.toml';

export default function massageReposData() {
  Object.keys(data).forEach((key) => {
    data[key].name = data[key].name || key;
  });
  const repos = sortBy(
    Object.values(data).filter((obj) => !!obj.category),
    'date',
  );
  const categories = groupBy(repos, 'category');
  return { categories };
}
