let fs = require('fs');
let path = require('path');

let browserify = require('browserify');
let gulp = require('gulp');
let watchify = require('watchify');
let babelify = require('babelify');
let source = require('vinyl-source-stream');
let buffer = require('vinyl-buffer');
let size = require('gulp-size');
let gutil = require('gulp-util');
let bowerFiles = require('main-bower-files')();
let sourcemaps = require('gulp-sourcemaps');
let sass = require('gulp-sass');
let flatten = require('gulp-flatten');
let minifyCSS = require('gulp-minify-css');
let notifier = require('node-notifier');

let browserSync = require('browser-sync');
let reload = browserSync.reload;

let production = process.env.NODE_ENV == 'production';

// Spin up a watchify instance
let bundler = watchify(browserify('./js/app.jsx', watchify.args));
bundler.transform(babelify);
bundler.on('update', ()=> gulp.start('watchify'));

gulp.task('watchify', function() {
  // start the deps bundler

  return bundler.bundle()
    .on('error', function(error) {
      notifier.notify({
        'title': 'Browserify Build Failed',
        'message': path.relative(__dirname, error.filename)+':'+error.loc.line
      });
      console.log(error.message);
      this.emit('end');
    })
    .pipe(source('./bundle.js'))
    .pipe(gulp.dest('dist'))
    .pipe(reload({stream: true}));
});


gulp.task('sass', function() {
  let include_paths = bowerFiles.map(path.dirname);

  gulp.src('css/style.scss')
    .pipe(sourcemaps.init())
      .pipe(sass({
        includePaths: include_paths,
        // outputStyle: 'compressed', // this breaks sourcemaps...
      }))
      .on('error', function(error) {
        notifier.notify({
          'title': 'SASS Build Failed',
          'message': path.relative(__dirname, error.fileName)+':'+error.lineNumber
        });
        console.log(error.message+' at '+error.fileName+':'+error.lineNumber);
      })
      .pipe(minifyCSS())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('dist'))
    .pipe(reload({ stream: true }));
});

gulp.task('clean', (done)=> fs.unlink('dist', done));


gulp.task('index', function() {
  gulp.src('html/index.html')
    .pipe(gulp.dest('dist'));
});

gulp.task('images', function() {
  gulp.src('images/**')
    .pipe(gulp.dest('dist/images'));
});

gulp.task('fonts', function() {
  gulp.src(['fonts/**', 'bower_components/**/*.{ttf,woff,eof,svg}'])
    .pipe(flatten())
    .pipe(gulp.dest('dist/fonts'));
});


gulp.task('watch', ['watchify', 'sass', 'index', 'images', 'fonts'], function() {
  gulp.watch('./css/**', ['sass']);
  gulp.watch('./html/index.html', ['index']);
  gulp.watch('./images/**', ['images']);
});

gulp.task('serve', ['watch'], function() {
  browserSync({
    server: {
      baseDir: 'dist'
    }
  });
})


gulp.task('default', ['watchify', 'sass', 'index', 'serve']);