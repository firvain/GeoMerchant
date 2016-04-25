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
var inject = require('gulp-inject');
var series = require('stream-series');
var argv = require('yargs').argv;
var environment = argv.env || 'development';
console.log(environment);

gulp.task('clean-scripts', function() {
    return del(['public/js/*.js']);
});
gulp.task('clean-vendor', function() {
    return del(['public/lib/*.*']);
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
// gulp.task('map', function () {
//   var target = gulp.src('./views/map.dust');
//   var sources = gulp.src(['./public/js/map.min.js', './public/css/map.min.css'], {read: false});
//   return target.pipe(inject(sources, {ignorePath: 'public'}))
//     .pipe(gulp.dest('./views'));
// })
gulp.task('map', function () {
  var target = gulp.src('./views/map.dust');
  var appStream = gulp.src(['./public/js/map.min.js', './public/css/map.min.css'], {read: false});
  var vendorStream = gulp.src([
    './public/libs/jquery/dist/jquery.min.js',
    './public/libs/dustjs-linkedin/dist/dust-core.min.js',
    './public/libs/dustjs-helpers/dist/dust-helpers.min.js',
    './public/libs/material-design-lite/material.min.js',
    './public/libs/toastr/toastr.min.js',
    './public/libs/parsleyjs/dist/parsley.min.js',
    './public/libs/mdl-selectfield/mdl-selectfield.min.js',
    './public/libs/auth0-lock/build/auth0-lock.min.js',
    './public/libs/dialog-polyfill/dialog-polyfill.js'
    ], {read: false});

  return target.pipe(inject(series(vendorStream, appStream), {ignorePath: 'public'}))
    .pipe(gulp.dest('./views'));
})

gulp.task('watch', function() {
    gulp.watch('dev/javascripts/**/*.js', ['clean-scripts','scripts-map','scripts-admin','map']).on('error', gutil.log);
    gulp.watch('dev/stylesheets/**/*.css', ['clean-css','minify-css-map','minify-css-admin']).on('error', gutil.log);
    gulp.watch('templates/*.dust', ['dust-compile'])
        .on('error', gutil.log);
});
gulp.task('default', ['watch']);
