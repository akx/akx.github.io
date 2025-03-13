import * as React from 'react';
import RepoCard from './RepoCard';
import massageReposData from '../data/reposData';
import colors from '../data/colors.json';
import type { Repository } from '../data/types';
import { groupBy, sortBy } from '../helpers.ts';
import { statusTiers } from '../data/consts.ts';

const { categories, count } = massageReposData();

interface CategoryProperties {
  name: string;
  repos: readonly Repository[];
  index: number;
}

function slugifyCategoryName(name: string) {
  return name.toLowerCase().replaceAll(/\s+/g, '-');
}

function LanguageFilter({
  languages,
  setLanguageFilter,
  languageFilter,
}: {
  languages: [string, number][];
  setLanguageFilter: (lang: string | null) => void;
  languageFilter: string | null;
}) {
  return (
    <label htmlFor="language-filter">
      Filter by language:{' '}
      <span>
        <label>
          <input
            name="language-filter"
            checked={!languageFilter}
            type="radio"
            value=""
            onChange={() => setLanguageFilter(null)}
          />{' '}
          All ({count})
        </label>
        {languages.map(([language, count]) => (
          <label className="ps-2 inline-block whitespace-nowrap" key={language}>
            <input
              type="radio"
              name="language-filter"
              value={language}
              checked={language === languageFilter}
              onChange={(event) => setLanguageFilter(event.target.value || null)}
            />{' '}
            {language} ({count})
          </label>
        ))}
      </span>
    </label>
  );
}

function Category({ name, repos, index }: CategoryProperties) {
  const { hex } = colors[index % colors.length];
  const byStatus = groupBy([...repos].reverse(), (s) => s.status || 'Sketch');
  const statusesInOrder = sortBy(Object.keys(byStatus), (s) => statusTiers[s] || 99);

  const slugified = slugifyCategoryName(name);
  return (
    <div className="category" style={{ background: hex }} id={slugified}>
      <h2 className="category-header p-2 text-center bg-black/80 text-2xl" style={{ color: hex }}>
        {name}
      </h2>
      <div className="category-body p-2 flex flex-col gap-2">
        {statusesInOrder.map((status) => (
          <div className="grid-cols-2 lg:grid-cols-4 grid gap-2 justify-center" key={status}>
            {byStatus[status].map((repo) => (
              <RepoCard key={repo.name} repo={repo} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Repos() {
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
      <div className="my-2 grid grid-cols-2 gap-2">
        {languages.length > 0 && (
          <div className="p-2 bg-white">
            <LanguageFilter
              languages={languages}
              setLanguageFilter={setLanguageFilter}
              languageFilter={languageFilter}
            />
          </div>
        )}
        <div className="p-2 bg-white">
          Skip to category:
          {categoryList.map(([category, repos]) => (
            <a
              href={`#${slugifyCategoryName(category)}`}
              className="ps-2 inline-block whitespace-nowrap"
              key={category}
            >
              <span className="underline">{category}</span>
              <span className="ps-1 no-underline">({repos.length})</span>
            </a>
          ))}
        </div>
      </div>
      {categoryList.map(([category, repos], index) => (
        <Category name={category} repos={repos} index={index} key={category} />
      ))}
    </>
  );
}
