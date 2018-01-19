/* eslint-disable no-console */
const fs = require('fs');
const toml = require('toml');
const _ = require('lodash');

const repoData = JSON.parse(fs.readFileSync('repos.json', 'UTF-8'));
const tomlData = toml.parse(fs.readFileSync('../content/repos.toml', 'UTF-8'));
const newRepos = _.sortBy(repoData.filter((repo) => {
  const id = repo.name.replace('.', '-');
  if (repo.fork) return false;
  if (tomlData[id] !== undefined) return false;
  if (repo.name === 'akx.github.io') return false;
  return true;
}), 'created_at');

const w = require('./wb')();

newRepos.forEach((repo) => {
  const id = repo.name.replace('.', '-');
  w('[%s]\n', id);
  if (id !== repo.name) w("name = '%s'\n" % repo.name);
  w('description = %s\n', JSON.stringify(repo.description));
  if (repo.homepage) w("homepage = '%s'\n", repo.homepage);
  w("url = '%s'\n", repo.html_url);
  w("language = '%s'\n", repo.language);
  w("date = '%s'\n", repo.created_at.split('T')[0]);
  w("category = 'Other stuff'\n");
  w('\n');
});

console.log(w.getOutput());
