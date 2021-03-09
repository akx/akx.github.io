/* eslint-disable no-console */
const fs = require('fs');
const toml = require('toml');
const { sortBy } = require('lodash');

const repoData = JSON.parse(fs.readFileSync('repos.json', 'UTF-8'));
const tomlData = toml.parse(fs.readFileSync('src/data/repos.toml', 'UTF-8'));
const newRepos = sortBy(
  repoData.filter((repo) => {
    const id = repo.name.replace('.', '-');
    if (repo.fork) return false;
    if (repo.archived) return false;
    if (tomlData[id] !== undefined) return false;
    if (repo.name === 'akx.github.io') return false;
    return true;
  }),
  'created_at',
);

const buffer = [];
const w = buffer.push.bind(buffer);

newRepos.forEach((repo) => {
  const id = repo.name.replace('.', '-');
  w(`[${id}]\n`);
  if (id !== repo.name) w(`name = '${repo.name}'`);
  w(`description = ${JSON.stringify(repo.description || '')}\n`);
  if (repo.homepage) w(`homepage = '${repo.homepage}'\n`);
  w(`url = '${repo.html_url}'\n`);
  w(`language = '${repo.language}'\n`);
  w(`date = '${repo.created_at.split('T')[0]}'\n`);
  w("category = 'Uncategorized'\n");
  w('\n');
});

console.log(buffer.join(''));
