var gulp = require('gulp');
var uglify = require('gulp-uglify');
var jshint = require('gulp-jshint');
var rename = require('gulp-rename');
var stylish = require('jshint-stylish');
var del = require('del');
var mocha = require('gulp-mocha');

gulp.task('clean', function(callback) {
  del('trianglify.min.js', callback);
});

// Check source for syntax errors and style issues
gulp.task('jshint', function() {
  return gulp.src('trianglify.js')
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(jshint.reporter('fail'));
});

// Run test suite
gulp.task('test', ['jshint'], function () {
    return gulp.src('test/test.js', {read: false})
        .pipe(mocha({reporter: 'spec'}));
});

// Minify the hinted and tested code
gulp.task('minify', ['clean', 'jshint', 'test'], function() {
  return gulp.src('trianglify.js')
    .pipe(uglify())
    .pipe(rename('trianglify.min.js'))
    .pipe(gulp.dest('.'));
});

gulp.task('default', ['minify']);
