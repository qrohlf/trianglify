var fs = require('fs');
var path = require('path');

var browserify = require('browserify');
var gulp = require('gulp');
var jshint = require('gulp-jshint');
var notifier = require('node-notifier');
var source = require('vinyl-source-stream');
var sourcemaps = require('gulp-sourcemaps');
var stylish = require('jshint-stylish');
var minify = require('gulp-babel-minify');
var buffer = require('vinyl-buffer');

var production = process.env.NODE_ENV == 'production';

// Spin up a browserify instance
var bundler = browserify('./lib/trianglify.js', {
  standalone: 'Trianglify',
  cache: {},
  packageCache: {},
  fullPaths: true
});
bundler.exclude('crypto');

gulp.task('browserify', ['jshint'], function() {
  // start the deps bundler
  return bundler.bundle()
    .on('error', function(error) {
      notifier.notify({
        'title': 'Browserify Build Failed',
        'message': path.relative(__dirname, error.filename)
      });
      console.log(error.message);
      this.emit('end');
    })
    .pipe(source('./trianglify.min.js'))
    .pipe(buffer())
    .pipe(minify())
    .pipe(gulp.dest('dist'));
});

gulp.task('browser-test', ['jshint'], function() {
  var testBundler = browserify('./test/test.js', {
    standalone: 'Trianglify',
    cache: {},
    packageCache: {},
    fullPaths: true
  });

  return testBundler.bundle()
  .pipe(source('test.browserify.js'))
  .pipe(gulp.dest('test'));
});

// Check source for syntax errors and style issues
// TODO notifications. Probably need to look into switching to gulp-notify
gulp.task('jshint', function() {
  return gulp.src(['lib/**/*.js', 'test/**/*.js', '!test/test.browserify.js', 'gulpfile.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(jshint.reporter('fail'));
});

gulp.task('watch', ['browserify'], function() {
  gulp.watch('lib/**/*.js', ['browserify']);
});

gulp.task('clean', function(done) {fs.unlink('dist', done);});

gulp.task('default', ['browserify']);
