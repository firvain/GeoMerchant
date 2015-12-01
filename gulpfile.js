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
    return del(['public/js/*.js']);
});
gulp.task('scripts-map',  function() {
    return gulp.src(['dev/javascripts/map/map.js', 'dev/javascripts/map/!(map)*.js'])
        .pipe(changed('public/js'))
        .pipe(sourcemaps.init())
        .pipe(concat('map.min.js'))
        .pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('public/js'))
        .on('error', gutil.log);
});
gulp.task('scripts-admin', function() {
    return gulp.src(['dev/javascripts/admin/*.js'])
        .pipe(changed('public/js'))
        .pipe(sourcemaps.init())
        .pipe(concat('admin.min.js'))
        .pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('public/js'))
        .on('error', gutil.log);
});
gulp.task('clean-css', function() {
    return del(['public/css/*.css']);
});
gulp.task('minify-css-map', function() {
    return gulp.src(['dev/stylesheets/map/*.css'])
        .pipe(changed('public/css/map'))
        .pipe(sourcemaps.init())
        .pipe(concat('map.min.css'))
        .pipe(minifyCss())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('public/css'))
        .on('error', gutil.log);
});
gulp.task('minify-css-admin', function() {
    return gulp.src(['dev/stylesheets/admin/*.css'])
        .pipe(changed('public/css/admin'))
        .pipe(sourcemaps.init())
        .pipe(concat('admin.min.css'))
        .pipe(minifyCss())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('public/css'))
        .on('error', gutil.log);
});
gulp.task('dust-compile', function() {
    return gulp.src('templates/*.dust')
        .pipe(dust())
        .pipe(gulp.dest('public/js/tpl'));
});

gulp.task('watch', function() {
    gulp.watch('dev/javascripts/**/*.js', ['scripts-map'],['scripts-admin'],['clean-scripts']).on('error', gutil.log);
    gulp.watch('dev/stylesheets/**/*.css', ['clean-css','minify-css-map','minify-css-admin']).on('error', gutil.log);
    gulp.watch('templates/*.dust', ['dust-compile'])
        .on('error', gutil.log);
});
gulp.task('default', ['watch']);
