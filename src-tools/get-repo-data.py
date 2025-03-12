# /// script
# dependencies = ["httpx"]
# ///
import httpx
import json
from itertools import count


def get_content():
    with httpx.Client() as c:
        for page in count(1):
            print(f"... {page}")
            response = c.get(
                "https://api.github.com/users/akx/repos",
                params={"page": page, "per_page": 100},
                headers={"User-Agent": "akx.github.io-buildtool"},
            )
            response.raise_for_status()
            data = response.json()
            yield from data
            if not data:
                break

if __name__ == "__main__":
    with open("repos.json", "w", encoding="utf-8") as f:
        json.dump(list(get_content()), f)
