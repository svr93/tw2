var gulp = require('gulp');

/* ----- html processing modules ----- */

var replaceHtmlBlocks = require('gulp-html-replace');
var minifyHtml = require('gulp-html-minifier');
var checkHtml = require('gulp-w3cjs');

/* ----- css processing ----- */

var translateLess = require('gulp-less');

var LessPluginCleanCSS = require('less-plugin-clean-css');
var cleanCss = new LessPluginCleanCSS({ advanced: true });

var checkCss = require('gulp-csslint');

/* ----- js processing modules ----- */

var checkJs = require('gulp-jshint');
var styleOutput = require('jshint-stylish');
var transformJs = require('gulp-jstransform');
var minifyJs = require('gulp-closure-compiler-service');

/* ----- other modules ----- */

var gulpif = require('gulp-if');
var concat = require('gulp-concat');
var connect = require('gulp-connect');

/* ----- configuration vars ----- */

var production = (process.argv.indexOf('--production') != -1);

var AUTORELOAD_TASK = 'autoreload';
var watch = (process.argv.indexOf(AUTORELOAD_TASK) != -1);

var DIR = 'server';

/* ----- tasks ----- */

gulp.task('html', function() {

  gulp.src('index.html')
      .pipe(gulpif(production, replaceHtmlBlocks({

        'css': 'css/main.min.css',

        'js': {
          src: 'js/main.min.js',
          tpl: '<script defer src="%s"></script>'
        }

      })))
      .pipe(gulpif(production, minifyHtml({

        removeComments: true,
        collapseWhitespace: true,
        minifyCSS: true,
        minifyJS: true

      })))
      .pipe(checkHtml())
      .pipe(gulp.dest('../' + DIR))
      .pipe(gulpif(watch, connect.reload()));

});

gulp.task('css', function() {

  gulp.src('less/*.less')
      .pipe(gulpif(production, translateLess({

        plugins: [cleanCss]

      }), translateLess()))
      .pipe(checkCss())
      .pipe(checkCss.reporter())
      .pipe(gulpif(production, concat('main.min.css')))
      .pipe(gulp.dest('../' + DIR + '/css'))
      .pipe(gulpif(watch, connect.reload()));
});

gulp.task('js', function() {

  gulp.src([
    'js/uploader.js',
    'js/init.js'
  ])
      .pipe(checkJs())
      .pipe(checkJs.reporter(styleOutput))
      .pipe(transformJs({

        harmony: true,
        target: 'es5'

      }))
      .pipe(gulpif(production, minifyJs()))
      .pipe(gulpif(production, concat('main.min.js')))
      .pipe(gulp.dest('../' + DIR + '/js'))
      .pipe(gulpif(watch, connect.reload()));
});

gulp.task('connect', function() {

  connect.server({
    port: 8080,
    root: '../' + DIR,
    livereload: true
  });

});

gulp.task('watch', function() {

  gulp.watch('index.html', ['html']);
  gulp.watch('less/*.less', ['css']);
  gulp.watch('js/*.js', ['js']);

});

gulp.task('default', ['html', 'css', 'js']);
gulp.task(AUTORELOAD_TASK, ['default', 'connect', 'watch']);
