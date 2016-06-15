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

gulp.task('clean-map-scripts', function(cb) {
    return del(['public/js/map.min.js']);
    cb();
});
gulp.task('clean-map-css', function(cb) {
    return del(['public/css/map.min.css']);
    cb();
});
gulp.task('clean-admin-scripts', function(cb) {
    return del(['public/js/admin.min.js']);
    cb();
});
gulp.task('clean-admin-css', function(cb) {
    return del(['public/css/admin.min.css']);
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
    return gulp.src([
      'dev/javascripts/commons/polyfills/*.js',
      'dev/javascripts/commons/globals.js',
      'dev/javascripts/commons/!(globals)*.js',
      'dev/javascripts/map/modules/ol3-map.js',
      'dev/javascripts/map/modules/info.js',
      'dev/javascripts/map/modules/filters.js',
      'dev/javascripts/map/index.js'
      ])
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
    return gulp.src([
        'dev/javascripts/commons/polyfills/*.js',
        'dev/javascripts/commons/globals.js',
        'dev/javascripts/commons/!(globals)*.js',
        'dev/javascripts/admin/modules/ol3-map.js',
        'dev/javascripts/admin/modules/info.js',
        'dev/javascripts/admin/modules/edit.js',
        'dev/javascripts/admin/modules/delete.js',
        'dev/javascripts/admin/modules/insert.js',
        'dev/javascripts/admin/index.js'
        ])
        .pipe(sourcemaps.init())
        .pipe(concat('admin.min.js'))
        .pipe(gulpif(environment === 'production', uglify()))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('public/js'))
        .on('error', gutil.log);
        cb();
});
gulp.task('minify-css-map', function(cb) {
    return gulp.src(['dev/stylesheets/map/*.css'])
        .pipe(sourcemaps.init())
        .pipe(concat('map.min.css'))
        .pipe(gulpif(environment === 'production', cssnano({
          browsers: ['last 4 versions'],
          cascade: false
        })))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('public/css'))
        .on('error', gutil.log);
        cb();
});
gulp.task('minify-css-admin', function(cb) {
    return gulp.src(['dev/stylesheets/admin/base.css', 'dev/stylesheets/admin/!(base)*.css'])
        .pipe(sourcemaps.init())
        .pipe(concat('admin.min.css'))
        .pipe(gulpif(environment === 'production', cssnano({
          browsers: ['last 4 versions'],
          cascade: false
        })))
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

gulp.task('inject-map',['scripts-map','minify-css-map'], function () {
  var target = gulp.src('./views/map.dust');
  var appStream = gulp.src(['./public/js/map.min.js', './public/css/map.min.css'], {read: false});
  var vendorStream = gulp.src([
    './public/libs/bowser/src/bowser.js',
    './public/libs/openlayers/dist/ol.js',
    './public/libs/bluebird/js/browser/bluebird.min.js',
    './public/libs/jquery/dist/jquery.min.js',
    './public/libs/dustjs-linkedin/dist/dust-full.min.js',
    './public/libs/dustjs-helpers/dist/dust-helpers.min.js',
    './public/libs/material-design-lite/material.min.js',
    './public/libs/lodash/dist/lodash.min.js',
    './public/libs/moment/moment.js',
    './public/libs/cloudinary-jquery/cloudinary-jquery.min.js',
    './public/libs/toastr/toastr.min.js',
    './public/libs/getmdl-select/src/js/getmdl-select.js',
    './public/libs/auth0-lock/build/auth0-lock.min.js',
    './public/libs/parsleyjs/dist/parsley.min.js',
    './public/libs/clusterize/clusterize.min.js',
    './public/libs/dialog-polyfill/dialog-polyfill.js',
    './public/libs/normalize-css/normalize.css',
    './public/libs/openlayers/dist/ol.css',
    './public/libs/material-design-lite/material.min.css',
    './public/libs/toastr/toastr.min.css',
    './public/libs/getmdl-select/getmdl-select.min.css',
    './public/libs/clusterize/clusterize.css',
    ], {read: false});

  return target.pipe(inject(series(vendorStream, appStream), {ignorePath: 'public'}))
    .pipe(gulp.dest('./views'));
})
gulp.task('inject-admin',['scripts-admin','minify-css-admin'], function () {
  var target = gulp.src('./views/admin.dust');
  var appStream = gulp.src(['./public/js/admin.min.js', './public/css/admin.min.css'], {read: false});
  var vendorStream = gulp.src([
    './public/libs/bowser/src/bowser.js',
    './public/libs/openlayers/dist/ol.js',
    './public/libs/bluebird/js/browser/bluebird.min.js',
    './public/libs/jquery/dist/jquery.min.js',
    './public/libs/dustjs-linkedin/dist/dust-full.min.js',
    './public/libs/dustjs-helpers/dist/dust-helpers.min.js',
    './public/libs/material-design-lite/material.min.js',
    './public/libs/lodash/dist/lodash.min.js',
    './public/libs/moment/moment.js',
    './public/libs/toastr/toastr.min.js',
    './public/libs/getmdl-select/src/js/getmdl-select.js',
    './public/libs/md-date-time-picker/dist/js/draggabilly.pkgd.min.js',
    './public/libs/md-date-time-picker/dist/js/mdDateTimePicker.min.js',
    './public/libs/cloudinary-jquery-file-upload/cloudinary-jquery-file-upload.min.js',
    './public/libs/cloudinary.js',
    './public/libs/parsleyjs/dist/parsley.min.js',
    './public/libs/dialog-polyfill/dialog-polyfill.js',
    './public/libs/normalize-css/normalize.css',
    './public/libs/openlayers/dist/ol.css',
    './public/libs/material-design-lite/material.min.css',
    './public/libs/toastr/toastr.min.css',
    './public/libs/getmdl-select/getmdl-select.min.css',
    './public/libs/md-date-time-picker/dist/css/mdDateTimePicker.min.css',
    ], {read: false});
  return target.pipe(inject(series(vendorStream, appStream), {ignorePath: 'public'}))
    .pipe(gulp.dest('./views'));
})
gulp.task('watch', function() {
    gulp.watch('dev/javascripts/map/**/*.*', ['clean-map-scripts','clean-map-css','inject-map']).on('error', gutil.log);
    gulp.watch('dev/javascripts/admin/**/*.*', ['clean-admin-scripts','clean-admin-css','inject-admin']).on('error', gutil.log);
    // gulp.watch('dev/stylesheets/**/*.css', ['clean-css','minify-css-map','minify-css-admin']).on('error', gutil.log);
    gulp.watch('templates/*.dust', ['dust-compile'])
        .on('error', gutil.log);
});
gulp.task('default', ['watch']);
