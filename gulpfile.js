const gulp = require('gulp');
const path = require('path');
const del = require('del');
const history = require('connect-history-api-fallback');
const $ = require('gulp-load-plugins')({
  pattern: ['*', '!jshint', '!connect-history-api-fallback']
});
const jetpack = require('fs-jetpack');

const environment = $.util.env.type || 'development';
const isProduction = environment === 'production';
const webpackConfig = require('./webpack/gulp.config.js')[environment];
const merge = require('merge-stream');
const imagemin = require('gulp-imagemin');
const noop = require('gulp-noop');

const port = $.util.env.port || 9000;
const src = 'src/';
const dist = 'dist/';

let webpackChangeHandler = function(err, stats) {
  if (err) {
    $.util.log('[Webpack] Error:', err);
  }
  $.util.log(
    stats.toString({
      colors: $.util.colors.supportsColor,
      chunks: false,
      hash: false,
      version: false
    })
  );

  $.connect.reload();
};

gulp.task('webpack', () => {
  $.webpackStream(webpackConfig, null, webpackChangeHandler)
    .on('error', function(error) {
      $.util.log($.util.colors.red(error.message));
      this.emit('end');
    })
    .pipe(gulp.dest(dist))
    .pipe($.size({ title: 'webpack' }))
    .pipe($.connect.reload());
});

gulp.task('pages', () => {
  return gulp
    .src(src + 'pages/*')
    .pipe(gulp.dest(dist))
    .pipe($.size({ title: 'pages' }))
    .pipe($.connect.reload());
});

gulp.task('serve', () => {
  $.connect.server({
    root: dist,
    port: port,
    livereload: {
      port: 35728
    },
    middleware: (connect, opt) => {
      return [history()];
    }
  });
});

gulp.task('static', () => {
  let fonts = gulp
    .src(src + 'static/fonts/*')
    .pipe($.size({ title: 'static/fonts' }))
    .pipe(gulp.dest(dist + 'static/fonts/'));
  let images = gulp
    .src(src + 'static/images/*')
    .pipe($.size({ title: 'static/images' }))
    .pipe(isProduction ? imagemin() : noop())
    .pipe(gulp.dest(dist + 'static/images/'));

  return merge(fonts, images);
});

gulp.task('clean', cb => {
  del([dist], cb);
});

gulp.task('environment', () => {
  const projectDir = jetpack;
  const commonDir = jetpack.cwd('./' + src + 'common');
  const configFile = './config/env_' + environment + '.json';

  projectDir.copy(configFile, commonDir.path('env.json'), { overwrite: true });
});

gulp.task('default', ['build', 'serve']);

gulp.task('build', cb => {
  if (isProduction) {
    $.runSequence('clean', 'environment', 'static', 'pages', 'webpack', cb);
  } else {
    $.runSequence('clean', 'environment', 'static', 'pages', 'webpack', cb);
  }
});
