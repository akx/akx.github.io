update-repo-toml:
	uv run src-tools/get-repo-data.py
	uv run src-tools/update-repo-toml.py >> src/data/repos.toml
