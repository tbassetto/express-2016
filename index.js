const port = process.env.PORT || 4000;

const autoprefixer = require('autoprefixer-stylus');
const compression = require('compression');
const express = require('express');
const helmet = require('helmet');
const path = require('path');
const stylus = require('stylus');

const app = express();
const routes = require('./routes');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.locals.mainTitle = 'Thomas Bassetto';
app.locals.author = 'Thomas Bassetto';
app.locals.mainDescription = 'Personal website for Thomas Bassetto — ' +
  'a French developer with a passion for technology';

const compileStylus = (str, p) => stylus(str)
  .use(autoprefixer())
  .set('filename', p)
  .set('sourcemap', {
    inline: app.get('env') !== 'production',
  })
  .set('compress', app.get('env') === 'production')
  .set('include css', true);
app.use(stylus.middleware({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  compile: compileStylus,
}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(helmet());
app.use(compression());

// Custom middlewares

app.use((req, res, next) => {
  /* eslint no-param-reassign:0 */
  res.locals.currentUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
  next();
});

app.use((req, res, next) => {
  // res.setHeader('Access-Control-Allow-Origin', '*');
  next();
});

app.use('/', routes);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

if (app.get('env') !== 'production') {
  /* eslint no-unused-vars:0 */
  app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err,
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {},
  });
});

app.listen(port, () => {
  console.log(`App listening on http://127.0.0.1:${port}!`);
});
