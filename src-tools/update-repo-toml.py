# /// script
# python-version = ">=3.11"
# ///
import json
import tomllib
import operator

def main():
    # Load the repo data from the JSON file
    with open("repos.json", "r", encoding="utf-8") as f:
        repo_data = json.load(f)
    
    # Load the existing TOML data
    with open("src/data/repos.toml", "rb") as f:
        toml_data = tomllib.load(f)
    
    # Filter and sort the repos
    new_repos = sorted(
        [
            repo for repo in repo_data
            if not repo["fork"] 
            and not repo["archived"]
            and repo["name"].replace(".", "-") not in toml_data
            and repo["name"] != "akx.github.io"
        ],
        key=operator.itemgetter("created_at")
    )
    
    # Generate the TOML content for new repos
    buffer = []
    for repo in new_repos:
        repo_id = repo["name"].replace(".", "-")
        buffer.append(f"[{repo_id}]\n")
        
        if repo_id != repo["name"]:
            buffer.append(f"name = '{repo['name']}'\n")
        
        buffer.append(f'description = "{repo["description"] or ""}"\n')
        
        if repo.get("homepage"):
            buffer.append(f"homepage = '{repo['homepage']}'\n")
        
        buffer.append(f"url = '{repo['html_url']}'\n")
        buffer.append(f"language = '{repo['language']}'\n")
        buffer.append(f"date = '{repo['created_at'].split('T')[0]}'\n")
        buffer.append("category = 'Uncategorized'\n")
        buffer.append("\n")
    
    print("".join(buffer))

if __name__ == "__main__":
    main()
