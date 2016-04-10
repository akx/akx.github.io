var toml = require('toml');
var _ = require('lodash');
var w = require('./wb')();

function formatRepoData(tomlData) {
  var data = toml.parse(tomlData);
  _.forEach(data, function (obj, name) {
    obj.name = obj.name || name;
  });
  var repos = _(data).values().filter(function (obj) {
    return !!obj.category;
  }).sortBy('date').value();
  var categories = _.groupBy(repos, 'category');
  _.keys(categories).sort().forEach(function (category) {
    w('## %s\n\n', category);
    categories[category].reverse().forEach(function (repo) {
      w('### %s\n\n', repo.name);
      w((repo.description || 'XXX: Missing description') + '\n\n');
      if (repo.language) w('* %s\n', repo.language);
      var date = repo.date;
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
