import * as React from 'react';
import {groupBy, sortBy} from 'lodash';
import RepoCard from './RepoCard';
import massageReposData from '../data/reposData';
import colors from '../data/colors.json';

const data = massageReposData();

const statusTiers = {
  'Release': 1,
  'Beta': 2,
  'Alpha': 3,
}

function Category({name, repos, index}) {
  const color = colors[index % colors.length];
  const byStatus = groupBy([...repos].reverse(), s => s.status || 'Sketch');
  const statusesInOrder = sortBy(Object.keys(byStatus), (s) => statusTiers[s] || 99);

  return (
    <div className="category" style={{background: color.hex}}>
      <h2 className="category-header" style={{color: color.hex}}>
        {name}
      </h2>
      <div className="category-body">
        {statusesInOrder.map(status => (
          <div className="status-tier" key={status}>
            <h3>{status}</h3>
            <div className="status-tier-body">
              {byStatus[status].map((repo) => (
                <RepoCard key={repo.name} repo={repo}/>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Repos() {
  const {categories} = data;
  const categoryList = Object.keys(categories).sort();
  return (
    <>
      {categoryList.map((category, i) => (
        <Category name={category} repos={categories[category]} index={i} key={category}/>
      ))}
    </>
  );
}
