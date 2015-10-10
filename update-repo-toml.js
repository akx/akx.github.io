var fs = require("fs");
var toml = require("toml");
var _ = require("lodash");

var repoData = JSON.parse(fs.readFileSync("repos.json", "UTF-8"));
var tomlData = toml.parse(fs.readFileSync("repos.toml", "UTF-8"));
var newRepos = _.sortBy(repoData.filter(function(repo) {
	var id = repo.name.replace(".", "-");
	if(repo.fork) return false;
	if(tomlData[id] !== undefined) return false;
	if(repo.name == "akx.github.io") return false;
	return true;
}), "created_at");

var w = require("./wb")();

newRepos.forEach(function(repo) {
	var id = repo.name.replace(".", "-");
	w("[%s]\n", id);
	if(id !== repo.name) w("name = '%s'\n" % repo.name);
	w("description = %s\n", JSON.stringify(repo.description));
	if(repo.homepage) w("homepage = '%s'\n", repo.homepage);
	w("url = '%s'\n", repo.html_url);
	w("language = '%s'\n", repo.language);
	w("date = '%s'\n", repo.created_at.split("T")[0]);
	w("category = 'Other stuff'\n");
	w("\n");
});

console.log(w.getOutput());