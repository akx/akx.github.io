/* eslint-disable no-console */
const CleanCSS = require('clean-css');
const fs = require('fs');
const pug = require('pug');
const merge = require('merge');
const metaMarked = require('meta-marked');
const { minify } = require('html-minifier');
const _ = require('lodash');
const path = require('path');
const { promisify } = require('util');
const tomlToMarkdown = require('./toml-to-markdown');

const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);

const srcPath = path.normalize(path.join(__dirname, '..', 'content'));
const outputPath = path.normalize(path.join(__dirname, '..'));

pug.filters.css = function (source) {
  return new CleanCSS().minify(source).styles;
};

const templates = {};

function getTemplate(filename) {
  if (templates[filename]) {
    return Promise.resolve(templates[filename]);
  }
  const templatePath = path.join('templates', filename || 'default.pug');
  return readFileAsync(templatePath, 'UTF-8').then((text) => {
    const template = pug.compile(text, { filename: templatePath });
    templates[filename] = template;
    return template;
  });
}

function getEnv(filename) {
  return {
    filename,
    reposMarkdown() {
      const data = fs.readFileSync(path.join(srcPath, 'repos.toml'), 'UTF-8');
      return tomlToMarkdown(data);
    },
  };
}

function build(filename) {
  return readFileAsync(filename, 'UTF-8').then((content) => {
    const basename = path.basename(filename);
    const baseExt = path.basename(filename, path.extname(filename));
    let meta = {};
    let html;
    if (content.indexOf('<%') > -1) {
      content = _.template(content)(getEnv(filename));
    }
    html = content;
    if (/md$/.test(filename)) {
      const result = metaMarked(content);
      meta = result.meta || {};
      html = result.html;
    }
    meta.path = filename;
    meta.basename = basename;
    meta.slug = baseExt;
    meta.outputName = path.join(outputPath, `${baseExt}.html`);
    return getTemplate(meta.template)
      .then((template) => minify(template(merge({ content: html }, meta)), {
        collapseWhitespace: true,
        removeAttributeQuotes: true,
        removeRedundantAttributes: true,
      }))
      .then((output) => writeFileAsync(meta.outputName, output, 'utf8').then(() => {
        console.log('[+]', meta.path, '->', meta.outputName);
      }));
  });
}

fs.readdir(srcPath, (err, files) => {
  if (err) throw err;
  files.filter((f) => /\.md$/.test(f)).map((f) => path.join(srcPath, f)).forEach(build);
});
