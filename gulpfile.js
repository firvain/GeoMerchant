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
var eslint = require('gulp-eslint');
var gulpif = require('gulp-if');
var inject = require('gulp-inject');
var series = require('stream-series');
var argv = require('yargs').argv;
var environment = argv.env || 'development';
console.log(environment);

gulp.task('clean-scripts', function(cb) {
    return del(['public/js/*.js']);
    cb();
});
gulp.task('clean-css', function(cb) {
    return del(['public/css/*.css']);
    cb();
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
gulp.task('scripts-map',  function(cb) {
    return gulp.src(['dev/javascripts/map/map.js', 'dev/javascripts/map/!(map)*.js'])
        .pipe(sourcemaps.init())
        .pipe(concat('map.min.js'))
        // .pipe(stripDebug())
        .pipe(gulpif(environment === 'production', uglify()))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('public/js'))
        .on('error', gutil.log);
        cb();
});
gulp.task('scripts-admin', function(cb) {
    return gulp.src(['dev/javascripts/admin/*.js'])
        .pipe(sourcemaps.init())
        .pipe(concat('admin.min.js'))
        .pipe(gulpif(environment === 'production', uglify()))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('public/js'))
        .on('error', gutil.log);
        cb();
});
gulp.task('minify-css-map', function(cb) {
    return gulp.src(['/public/libs/normalize-css/normalize.css','dev/stylesheets/map/*.css'])
        .pipe(sourcemaps.init())
        .pipe(concat('map.min.css'))
        .pipe(cssnano({
          browsers: ['last 4 versions'],
          cascade: false
        }))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('public/css'))
        .on('error', gutil.log);
        cb();
});
gulp.task('minify-css-admin', function(cb) {
    return gulp.src(['/public/libs/normalize-css/normalize.css','dev/stylesheets/admin/*.css'])
        .pipe(sourcemaps.init())
        .pipe(concat('admin.min.css'))
        .pipe(cssnano({
          browsers: ['last 4 versions'],
          cascade: false
        }))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('public/css'))
        .on('error', gutil.log);
        cb();
});
gulp.task('dust-compile', function() {
    return gulp.src('templates/*.dust')
        .pipe(dust())
        .pipe(gulp.dest('public/js/tpl'));
});

gulp.task('inject-map',['scripts-map','scripts-admin','minify-css-map','minify-css-admin'], function () {
  var target = gulp.src('./views/map.dust');
  var appStream = gulp.src(['./public/js/map.min.js', './public/css/map.min.css'], {read: false});
  var vendorStream = gulp.src([
    './public/libs/jquery/dist/jquery.min.js',
    './public/libs/dustjs-linkedin/dist/dust-core.min.js',
    './public/libs/dustjs-helpers/dist/dust-helpers.min.js',
    './public/libs/material-design-lite/material.min.js',
    './public/libs/toastr/toastr.min.js',
    './public/libs/parsleyjs/dist/parsley.min.js',
    './public/vendor/getmdl-select/getmdl-select.min.js',
    './public/libs/auth0-lock/build/auth0-lock.min.js',
    './public/libs/dialog-polyfill/dialog-polyfill.js',
    './public/libs/material-design-lite/material.min.css',
    './public/libs/toastr/toastr.min.css',
    './public/vendor/getmdl-select/getmdl-select.min.css'
    ], {read: false});

  return target.pipe(inject(series(vendorStream, appStream), {ignorePath: 'public'}))
    .pipe(gulp.dest('./views'));
})

gulp.task('watch', function() {
    gulp.watch('dev/**/*.*', ['clean-scripts','clean-css','inject-map']).on('error', gutil.log);
    // gulp.watch('dev/stylesheets/**/*.css', ['clean-css','minify-css-map','minify-css-admin']).on('error', gutil.log);
    gulp.watch('templates/*.dust', ['dust-compile'])
        .on('error', gutil.log);
});
gulp.task('default', ['watch']);
