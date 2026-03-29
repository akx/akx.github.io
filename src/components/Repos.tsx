import * as React from 'react';
import RepoCard from './RepoCard';
import massageReposData from '../data/reposData';
import colors from '../data/colors.json';
import type { Repository } from '../data/types';
import { statusTiers } from '../data/consts.ts';

const { categories, count } = massageReposData();

function slugifyCategoryName(name: string) {
  return name.toLowerCase().replaceAll(/\s+/g, '-');
}

function putArchivedLast(a: Repository, b: Repository) {
  const aTier = statusTiers[a.status || 'Sketch'] || 99;
  const bTier = statusTiers[b.status || 'Sketch'] || 99;
  if (aTier !== bTier) return aTier - bTier;
  if (a.archived && !b.archived) return 1;
  if (!a.archived && b.archived) return -1;
  return a.name.localeCompare(b.name);
}

interface CategoryProperties {
  name: string;
  repos: readonly Repository[];
  index: number;
}

function Category({ name, repos, index }: CategoryProperties) {
  const { hex } = colors[index % colors.length];
  const sorted = [...repos].sort(putArchivedLast);
  const slugified = slugifyCategoryName(name);

  return (
    <div className="category" id={slugified}>
      <div
        className="category-label px-2 py-0.5 text-sm font-bold tracking-wide uppercase"
        style={{ background: hex, color: 'rgba(0,0,0,0.7)' }}
      >
        {name}
        <span className="font-normal opacity-60 ml-1">({repos.length})</span>
      </div>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(12rem,1fr))]" style={{ borderLeft: `3px solid ${hex}` }}>
        {sorted.map((repo) => (
          <RepoCard key={repo.name} repo={repo} color={hex} />
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
      <div className="my-2 flex flex-wrap gap-2 items-start">
        <div className="p-2 bg-white/80 border border-black/10">
          <span className="font-bold">{count}</span> projects
          {' · '}
          <span className="font-bold">{languages.length}</span> languages
          {languageFilter ? (
            <>
              {' · '}
              <button className="underline" onClick={() => setLanguageFilter(null)}>
                clear filter
              </button>
            </>
          ) : null}
        </div>
        <div className="p-2 bg-white/80 border border-black/10 flex flex-wrap gap-x-1 gap-y-0">
          {languages.map(([language, langCount]) => (
            <button
              key={language}
              className={`px-1 hover:bg-black/10 transition-colors ${languageFilter === language ? 'bg-black text-white' : ''}`}
              onClick={() => setLanguageFilter(languageFilter === language ? null : language)}
            >
              {language}
              <span className="opacity-50 ml-0.5">{langCount}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="flex flex-wrap gap-2 mb-2">
        {categoryList.map(([category], index) => {
          const { hex } = colors[index % colors.length];
          return (
            <a
              href={`#${slugifyCategoryName(category)}`}
              key={category}
              className="px-1 text-black/70 hover:text-black transition-colors"
              style={{ background: hex, color: 'rgba(0,0,0,0.7)' }}
            >
              {category}
            </a>
          );
        })}
      </div>
      {categoryList.map(([category, repos], index) => (
        <Category name={category} repos={repos} index={index} key={category} />
      ))}
    </>
  );
}
