import * as React from 'react';
import RepoCard from './RepoCard';
import massageReposData from '../data/reposData';

const data = massageReposData();

export default function Repos() {
  const { categories } = data;
  const categoryList = Object.keys(categories).sort();
  return (
    <>
      {categoryList.map((category) => {
        const repos = [...categories[category]].reverse();
        return (
          <React.Fragment key={category}>
            <h2>{category}</h2>
            {repos.map((repo) => <RepoCard key={repo.name} repo={repo} />)}
          </React.Fragment>
        );
      })}
    </>
  );
}
