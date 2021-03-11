import * as React from 'react';
import RepoCard from './RepoCard';
import massageReposData from '../data/reposData';
import colors from '../data/colors.json';

const data = massageReposData();

function Category({ name, repos, index }) {
  const color = colors[index % colors.length];
  repos = [...repos].reverse();
  return (
    <div className="category" style={{ background: color.hex }}>
      <h2 className="category-header" style={{ color: color.hex }}>
        {name}
      </h2>
      <div className="category-body">
        {repos.map((repo) => (
          <RepoCard key={repo.name} repo={repo} />
        ))}
      </div>
    </div>
  );
}

export default function Repos() {
  const { categories } = data;
  const categoryList = Object.keys(categories).sort();
  return (
    <>
      {categoryList.map((category, i) => (
        <Category name={category} repos={categories[category]} index={i} key={category} />
      ))}
    </>
  );
}
