import * as React from 'react';
import RepoCard from './RepoCard';
import massageReposData from '../data/reposData';
import colors from '../data/colors.json';
import type { Repository } from '../data/types';
import { groupBy, sortBy } from '../helpers.ts';

const data = massageReposData();

const statusTiers: Record<string, number> = {
  Release: 1,
  Beta: 2,
  Alpha: 3,
};

interface CategoryProperties {
  name: string;
  repos: readonly Repository[];
  index: number;
}

function Category({ name, repos, index }: CategoryProperties) {
  const color = colors[index % colors.length];
  const byStatus = groupBy([...repos].reverse(), (s) => s.status || 'Sketch');
  const statusesInOrder = sortBy(Object.keys(byStatus), (s) => statusTiers[s] || 99);

  return (
    <div className="category" style={{ background: color.hex }} id={name.toLowerCase()}>
      <h2 className="category-header" style={{ color: color.hex }}>
        {name}
      </h2>
      <div className="category-body">
        {statusesInOrder.map((status) => (
          <div className="status-tier" key={status}>
            <h3>{status}</h3>
            <div className="status-tier-body">
              {byStatus[status].map((repo) => (
                <RepoCard key={repo.name} repo={repo} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Repos() {
  const { categories } = data;
  const languages: [string, number][] = React.useMemo(() => {
    const languageCounts: Record<string, number> = {};
    for (const repos of Object.values(categories)) {
      for (const repo of repos) {
        const language = repo.language ?? 'Unknown';
        languageCounts[language] = (languageCounts[language] || 0) + 1;
      }
    }
    return Object.keys(languageCounts)
      .sort()
      .map((lang) => [lang, languageCounts[lang]]);
  }, [categories]);
  const [languageFilter, setLanguageFilter] = React.useState<string | null>(null);

  const categoryList = React.useMemo(() => {
    const filtered: [string, Repository[]][] = [];
    for (const name of Object.keys(categories).sort()) {
      const cat = categories[name];
      const filteredRepos = cat.filter(
        (repo) => languageFilter === null || (repo.language ?? 'Unknown') === languageFilter,
      );
      if (filteredRepos.length > 0) {
        filtered.push([name, filteredRepos]);
      }
    }
    return filtered;
  }, [categories, languageFilter]);

  return (
    <>
      {languages.length > 0 && (
        <p>
          <label htmlFor="language-filter">
            Filter by language:{' '}
            <select
              name="language-filter"
              value={languageFilter || ''}
              onChange={(event) => setLanguageFilter(event.target.value || null)}
            >
              <option value="">All</option>
              {languages.map(([language, count]) => (
                <option key={language} value={language}>
                  {language} ({count})
                </option>
              ))}
            </select>
          </label>
        </p>
      )}
      {categoryList.map(([category, repos], index) => (
        <Category name={category} repos={repos} index={index} key={category} />
      ))}
    </>
  );
}
