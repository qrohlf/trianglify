var fs = require('fs');
var path = require('path');

var browserify = require('browserify');
var gulp = require('gulp');
var source = require('vinyl-source-stream');
var sourcemaps = require('gulp-sourcemaps');
var notifier = require('node-notifier');

var production = process.env.NODE_ENV == 'production';

// Spin up a browserify instance
var bundler = browserify('./lib/trianglify.js', {
  standalone: 'Trianglify',
  cache: {},
  packageCache: {},
  fullPaths: true
});

gulp.task('browserify', function() {
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
    .pipe(gulp.dest('dist'));
});

gulp.task('clean', function(done) {fs.unlink('dist', done)});

gulp.task('default', ['browserify']);