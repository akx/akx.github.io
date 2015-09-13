var CleanCSS = require('clean-css');
var fs = require("fs");
var jade = require("jade");
var merge = require("merge");
var metaMarked = require("meta-marked");
var minify = require('html-minifier').minify;
var path = require("path");

var srcPath = "src";
var outputPath = ".";

jade.filters.css = function(source) {
	return new CleanCSS().minify(source).styles;
};

var templates = {};
function getTemplate(filename, callback) {
	if(templates[filename]) {
		callback(templates[filename]);
		return;
	}
	var templatePath = path.join("templates", filename || "default.jade");
	fs.readFile(templatePath, "UTF-8", function(err, text) {
		if(err) throw err;
		var template = jade.compile(text, {filename: templatePath});
		templates[filename] = template;
		callback(template);
	});
}

function build(filename) {
	fs.readFile(filename, "UTF-8", function(err, content) {
		var basename = path.basename(filename);
		var baseExt = path.basename(filename, path.extname(filename));
		var meta = {}, html = content;
		if(/md$/.test(filename)) {
			var result = metaMarked(content);
			meta = result.meta || {};
			html = result.html;
		}
		meta.path = filename;
		meta.basename = basename;
		meta.slug = baseExt;
		meta.outputName = path.join(outputPath, baseExt + ".html");
		getTemplate(meta.template, function(template) {
			var output = minify(template(merge({content: html}, meta)), {
				collapseWhitespace: true,
				removeAttributeQuotes: true,
				removeRedundantAttributes: true
			});
			fs.writeFile(meta.outputName, output, "utf8", function(err) {
				if(err) throw err;
				console.log("[+]", meta.path, "->", meta.outputName);
			});
		});
	});
}

fs.readdir(srcPath, function (err, files) {
	if(err) throw err;
	files.map(function(f) { return path.join(srcPath, f); }).forEach(build);
});