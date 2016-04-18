var path = require('path')
var gulp = require('gulp');
var gutil = require('gulp-util');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var cssnano = require('gulp-cssnano');
var dust = require('gulp-dust');
var sourcemaps = require('gulp-sourcemaps');
var del = require('del');
var watch = require('gulp-watch');
var changed = require('gulp-changed');
var autoprefixer = require('gulp-autoprefixer');
var stripDebug = require('gulp-strip-debug');
var eslint = require('gulp-eslint');
var exists = require('path-exists').sync;
var gulpif = require('gulp-if');
var argv = require('yargs').argv;
var environment = argv.env || 'development';
console.log(environment);
gulp.task('clean-scripts', function() {
    return del(['public/js/*.js']);
});
gulp.task('lint',function() {
 return gulp.src(['dev/javascripts/**/map.js', 'dev/javascripts/map/!(map)*.js'],{base: './'})
    .pipe(eslint({ fix: true }))
     // .pipe(eslint.format())
        .pipe(eslint.results(function (results) {
        // Called once for all ESLint results.
        console.log('Total Results: ' + results.length);
        console.log('Total Warnings: ' + results.warningCount);
        console.log('Total Errors: ' + results.errorCount);
        }))
        .pipe(gulp.dest('./'))
})
gulp.task('scripts-map',  function() {
    return gulp.src(['dev/javascripts/map/map.js', 'dev/javascripts/map/!(map)*.js'])
        // .pipe(changed('public/js'))
        .pipe(sourcemaps.init())
        .pipe(concat('map.min.js'))
        // .pipe(stripDebug())
        .pipe(gulpif(environment === 'production', uglify()))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('public/js'))
        .on('error', gutil.log);
});
gulp.task('scripts-admin', function() {
    return gulp.src(['dev/javascripts/admin/*.js'])
        .pipe(changed('public/js'))
        .pipe(sourcemaps.init())
        .pipe(concat('admin.min.js'))
        // .pipe(stripDebug())
        .pipe(gulpif(environment === 'production', uglify()))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('public/js'))
        .on('error', gutil.log);
});
gulp.task('clean-css', function() {
    return del(['public/css/*.css']);
});
gulp.task('minify-css-map', function() {
    return gulp.src(['dev/stylesheets/*.css','dev/stylesheets/map/*.css'])
        .pipe(changed('public/css/map'))
        .pipe(sourcemaps.init())
        .pipe(concat('map.min.css'))
        .pipe(autoprefixer({
          browsers: ['last 4 versions'],
          cascade: false
        }))
        .pipe(cssnano({autoprefixer:false, zindex: false}))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('public/css'))
        .on('error', gutil.log);
});
gulp.task('minify-css-admin', function() {
    return gulp.src(['dev/stylesheets/*.css','dev/stylesheets/admin/*.css'])
        .pipe(changed('public/css/admin'))
        .pipe(sourcemaps.init())
        .pipe(concat('admin.min.css'))
        .pipe(autoprefixer({
          browsers: ['last 4 versions'],
          cascade: false
        }))
        .pipe(cssnano({autoprefixer:false,zindex: false}))
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
    gulp.watch('dev/javascripts/**/*.js', ['clean-scripts','scripts-map','scripts-admin']).on('error', gutil.log);
    gulp.watch('dev/stylesheets/**/*.css', ['clean-css','minify-css-map','minify-css-admin']).on('error', gutil.log);
    gulp.watch('templates/*.dust', ['dust-compile'])
        .on('error', gutil.log);
});
gulp.task('default', ['watch']);
