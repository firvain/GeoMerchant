var path = require('path');
var gulp = require('gulp');
var gutil = require('gulp-util');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var minifyCss = require('gulp-minify-css');
var dust = require('gulp-dust');
var sourcemaps = require('gulp-sourcemaps');
var del = require('del');
var watch = require('gulp-watch');
var changed = require('gulp-changed');
gulp.task('clean-scripts', function() {
    return del(['public/**/*.js']);
});
gulp.task('scripts', ['clean-scripts'], function() {
    return gulp.src(['dev/javascripts/map.js', 'dev/javascripts/!(map)*.js'])
        .pipe(changed('public/js'))
        .pipe(sourcemaps.init())
        .pipe(uglify())
        .pipe(concat('scripts.min.js'))
        .pipe(gulp.dest('public/js'))
        .on('error', gutil.log);
});
gulp.task('clean-css', function() {
    return del(['public/**/*.css']);
});
gulp.task('minify-css', ['clean-css'], function() {
    return gulp.src(['dev/stylesheets/resets.css','dev/stylesheets/!(resets)*.css'])
        .pipe(changed('public/css'))
        .pipe(sourcemaps.init())
        .pipe(minifyCss())
        .pipe(concat('styles.min.css'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('public/css'))
        .on('error', gutil.log);
});
gulp.task('dust-compile', function() {
    return gulp.src('templates/*.dust')
        .pipe(changed('public/templates/js'))
        .pipe(dust())
        .pipe(gulp.dest('public/templates/js'));
});

gulp.task('watch', function() {
    gulp.watch('dev/**/*.js', ['scripts']);
    gulp.watch('dev/**/*.css', ['minify-css'])
        .on('error', gutil.log);
});
gulp.task('default', ['watch']);
