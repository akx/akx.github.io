update-repo-toml:
	node src-tools/get-repo-data.js
	node src-tools/update-repo-toml.js >> src/data/repos.toml