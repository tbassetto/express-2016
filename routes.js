/* eslint new-cap:0 */

const express = require('express');

const Posts = require('./lib/posts');

const router = express.Router();

router.get('/', (req, res) => {
  res.render('home', {
    pageTitle: null,
    bodyCss: 'home',
  });
});

router.get('/atom.xml', (req, res) => {
  const xml = '<atom></atom>';
  res.set('Content-Type', 'application/rss+xml');
  res.send(xml);
});

router.get('/sitemap.xml', (req, res) => {
  // https://www.npmjs.com/package/node-rss
  // https://harpjs.com/recipes/blog-rss-feed
  const xml = '<sitemap></sitemap>';
  res.set('Content-Type', 'application/rss+xml');
  res.send(xml);
});

router.get('/blog', (req, res, next) => {
  Posts.getAll()
    .then((posts) => {
      res.render('blog', {
        pageTitle: 'Blog',
        bodyCss: 'blog',
        posts,
      });
    })
    .catch((err) => {
      next(err);
    });
});

router.get('/blog/:slug', (req, res, next) => {
  Posts.getOne(req.params.slug)
    .then((post) => {
      res.render('post', {
        pageTitle: post.metadata.title,
        bodyCss: 'post',
        metadata: post.metadata,
        html: post.html,
      });
    })
    .catch((err) => {
      next(err);
    });
});

router.get('/about', (req, res) => {
  res.render('about', {
    pageTitle: 'About',
    bodyCss: 'about',
  });
});

module.exports = router;
