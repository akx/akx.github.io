const toml = require('toml');
const _ = require('lodash');
const w = require('./wb')();

function formatRepoData(tomlData) {
  const data = toml.parse(tomlData);
  _.forEach(data, (obj, name) => {
    obj.name = obj.name || name;
  });
  const repos = _(data).values().filter(obj => !!obj.category).sortBy('date')
    .value();
  const categories = _.groupBy(repos, 'category');
  _.keys(categories).sort().forEach((category) => {
    w('## %s\n\n', category);
    categories[category].reverse().forEach((repo) => {
      w('### %s\n\n', repo.name);
      w(`${repo.description || 'XXX: Missing description'}\n\n`);
      if (repo.language) w('* %s\n', repo.language);
      let { date } = repo;
      if (/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(date)) date = date.substr(0, 7);
      w('* %s\n', date);
      if (repo.platform) w('* Platform: %s\n', repo.platform);
      if (repo.status) w('* Status: %s\n', repo.status);
      if (repo.homepage) w('* Online: %s\n', repo.homepage);
      if (repo.download) w('* Download: %s\n', repo.download);
      w('* Repo: %s\n', repo.url);
      w('\n');
    });
  });
  return _.trim(w.getOutput());
}

module.exports = formatRepoData;
