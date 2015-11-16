var gulp = require('gulp');
var source = require('vinyl-source-stream');
var browserify = require('browserify');
var less = require('gulp-less');
var minifyCSS = require('gulp-minify-css');
var runSequence = require('run-sequence');
var rename = require('gulp-rename');

gulp.task('default', ['build']);

gulp.task('browserify', function() {
  var b = browserify('./client/js/main.js', {debug: true})
  return b.bundle()
    .pipe(source('app.bsfy.js'))
    .pipe(gulp.dest('./build'))
});

gulp.task('minify', ['styles'], function() {
  return gulp.src('./build/bundle.css')
    .pipe(minifyCSS())
    .pipe(rename('app.min.css'))
    .pipe(gulp.dest('./public/css'))
});
 
gulp.task('styles', function() {
  return gulp.src('./client/less/index.less')
    .pipe(less())
    .pipe(prefix({ cascade: true }))
    .pipe(rename('bundle.css'))
    .pipe(gulp.dest('./build'))
});

gulp.task('uglify', function() {
  return gulp.src('./build/app.bsfy.js')
    .pipe(uglify())
    .pipe(rename('app.min.js'))
    .pipe(gulp.dest('./client/public/js'));
});

gulp.task('rename', function() {
  return gulp.src('./build/app.bsfy.js')
    .pipe(rename('app.js'))
    .pipe(gulp.dest('./client/public/js'));
});

gulp.task('build', function(done) {
  return runSequence('browserify', 'rename', done);
});

gulp.task('watch', function(done){
  return runSequence('build', function() {
    gulp.watch('./client/js/**/*.js', ['build']);
    done()
  })
});