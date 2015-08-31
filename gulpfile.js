var path = require('path');
var gulp = require('gulp');
var gutil = require('gulp-util');
var concat = require('gulp-concat');
var clean = require('gulp-clean');
var uglify = require('gulp-uglify');
var minifyCss = require('gulp-minify-css');
var dust = require('gulp-dust');
// var changed = require('gulp-changed');  
var watch = require('gulp-watch');
var sourcemaps = require('gulp-sourcemaps');
gulp.task('clean-scripts', function() {
  return gulp.src('./public/js/*.js', {
      read: false
    })
    .pipe(clean());
});
gulp.task('scripts', ['clean-scripts'], function() {
  return gulp.src('./dev/javascripts/*.js')
    .pipe(concat('scripts.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./public/js'))
    .on('error', gutil.log);
});

gulp.task('clean-css', function() {
  return gulp.src('./public/css/*.css', {
      read: false
    })
    .pipe(clean());
});
gulp.task('minify-css', ['clean-css'], function() {
  return gulp.src('./dev/stylesheets/*.css')
    .pipe(sourcemaps.init())
    .pipe(concat('styles.css'))
    .pipe(minifyCss())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./public/css'))
    .on('error', gutil.log);
});
gulp.task('dust-compile', function () {
    return gulp.src('views/*.dust')
        .pipe(dust())
        .pipe(gulp.dest('./public/js'));
});
gulp.task('watch', function() {
  gulp.watch('./dev/javascripts/*.js', ['scripts']);
  gulp.watch('./dev/stylesheets/*.css', ['minify-css']);

});
gulp.task('default', ['watch']);
