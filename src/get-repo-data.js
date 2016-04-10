var fs = require("fs");
var GitHub = require("github");
var gh = new GitHub({
    version: "3.0.0",
    debug: true,
    headers: {"user-agent": "akx.github.io-buildtool"}
});
var repos = [];
var page = 1;
function complete() {
    fs.writeFileSync("repos.json", JSON.stringify(repos), "UTF-8");
}
function getPage() {
    console.log("...", page);
    gh.repos.getFromUser({user: "akx", page: page, "per_page": 100}, function(err, res) {
        repos = repos.concat(res);
        if(res.length > 0) {
            page++;
            getPage();
        } else {
            complete();
        }

    });
}

getPage();