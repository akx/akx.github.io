/* eslint-disable no-console */
const fs = require('fs');
const GitHub = require('@octokit/rest');

const gh = new GitHub({
  version: '3.0.0',
  debug: true,
  headers: { 'user-agent': 'akx.github.io-buildtool' },
});
let repos = [];
let page = 1;

function complete() {
  fs.writeFileSync('repos.json', JSON.stringify(repos), 'UTF-8');
}

function getPage() {
  console.log('...', page);
  gh.repos.getForUser({
    username: 'akx',
    page,
    per_page: 100,
  }, (err, res) => {
    repos = repos.concat(res.data);
    if (res.data.length > 0) {
      page += 1;
      getPage();
    } else {
      complete();
    }
  });
}

getPage();
