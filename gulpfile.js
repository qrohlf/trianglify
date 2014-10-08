var gulp = require('gulp');
var uglify = require('gulp-uglify');
var jshint = require('gulp-jshint');
var rename = require('gulp-rename');
var stylish = require('jshint-stylish');
var del = require('del');
var mocha = require('gulp-mocha');
var git = require('gulp-git');
var bump = require('gulp-bump');
var filter = require('gulp-filter');
var tag_version = require('gulp-tag-version');

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

function version_bump(type) {
    // get all the files to bump version in
    return gulp.src(['./package.json', './bower.json'])
        // bump the version number in those files
        .pipe(bump({type: type}))
        // save it back to filesystem
        .pipe(gulp.dest('./'))
        // commit the changed version number
        .pipe(git.commit('bump package version'))

        // read only one file to get the version number
        .pipe(filter('package.json'))
        // **tag it in the repository**
        .pipe(tag_version());
}

gulp.task('patch', function() { return version_bump('patch'); });
gulp.task('feature', function() { return version_bump('minor'); });
gulp.task('release', function() { return version_bump('major'); });

gulp.task('default', ['minify']);
