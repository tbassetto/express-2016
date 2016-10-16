/* eslint no-param-reassign:0 */

const _ = require('lodash');
const highlight = require('highlight.js');
const MarkdownIt = require('markdown-it');
const matter = require('gray-matter');
const path = require('path');
const slugify = require('slug');

const files = require('./files');

const md = new MarkdownIt({
  highlight(str, lang) {
    if (lang && highlight.getLanguage(lang)) {
      try {
        return highlight.highlight(lang, str).value;
      } catch (err) {
        console.error(err);
      }
    }
    return ''; // use external default escaping
  },
});

const defaultMetadata = {
  abstract: null,
  customCSS: null,
  customJS: null,
  layout: 'post',
  longArticle: false,
  published: true,
};

const loadMetadata = (file) => {
  file.frontMatter = matter(file.content);
  file.metadata = _.assign(matter(file.content).data, defaultMetadata);
  file.metadata.slug = slugify(file.metadata.title, { lower: true });
  return file;
};

const convertMarkdown = (file) => {
  file.html = md.render(file.frontMatter.content);
  return file;
};

const onlyKeepInterestingStuff = file => ({
  metadata: file.metadata,
  html: file.html,
});

const filterNotPublished = posts =>
  _.filter(posts, post =>
    post.metadata.published
  );

const sortByDate = posts => _.orderBy(posts, post => post.metadata.date, 'desc');

const loadAll = () => files.readDir(path.join(__dirname, '../posts/'))
  .then((filenames) => {
    const promises = filenames.map(filename => files.readFile(filename)
      .then(loadMetadata)
      .then(convertMarkdown)
      .then(onlyKeepInterestingStuff)
    );
    return Promise.all(promises)
      .then(filterNotPublished)
      .then(sortByDate);
  });

const getAll = () => loadAll();

const getOne = slug => getAll()
  .then(posts =>
    _.find(posts, post =>
      post.metadata.slug === slug
    )
  );

// TODO
const getNext = post => post;
const getPrev = post => post;
const getSimilar = post => post; // use tags and categories

module.exports = {
  getAll,
  getOne,
  getNext,
  getPrev,
  getSimilar,
};
