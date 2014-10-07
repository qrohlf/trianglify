var gulp = require('gulp');
var uglify = require('gulp-uglify');
var jshint = require('gulp-jshint');
var rename = require('gulp-rename');
var stylish = require('jshint-stylish');
var del = require('del');

gulp.task('clean', function(callback) {
  del('trianglify.min.js', callback);
});

gulp.task('jshint', function() {
  return gulp.src('trianglify.js')
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(jshint.reporter('fail'));
});

gulp.task('minify', ['clean', 'jshint'], function() {
  // Minify and copy the javascript after removing the old file
  // and running the new stuff through jshint
  return gulp.src('trianglify.js')
    .pipe(uglify())
    .pipe(rename('trianglify.min.js'))
    .pipe(gulp.dest('.'));
});

gulp.task('default', ['minify']);
