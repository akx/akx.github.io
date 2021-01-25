/* eslint-disable no-console, no-await-in-loop */
const fs = require('fs');
const { Octokit } = require('@octokit/rest');

const gh = new Octokit({
  version: '3.0.0',
  debug: true,
  headers: { 'user-agent': 'akx.github.io-buildtool' },
});

function complete(repos) {
  fs.writeFileSync('repos.json', JSON.stringify(repos), 'UTF-8');
}

async function getContent() {
  let repos = [];
  for (let page = 1; ; page += 1) {
    console.log('...', page);
    const res = await gh.repos.listForUser({
      username: 'akx',
      page,
      per_page: 100,
    });
    repos = repos.concat(res.data);
    if (res.data.length <= 0) {
      break;
    }
  }
  return repos;
}

getContent().then(complete);
