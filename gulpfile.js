var gulp = require('gulp');
var gutil = require('gulp-util');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var cssnano = require('cssnano');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var dust = require('gulp-dust');
var sourcemaps = require('gulp-sourcemaps');
var del = require('del');
var gulpif = require('gulp-if');
var inject = require('gulp-inject');
var series = require('stream-series');
var argv = require('yargs').argv;
var replace = require('gulp-replace');
var rename = require('gulp-rename');
var environment = argv.env || 'development';
console.log(environment);
gulp.task('clean-map-scripts', function cleanMapJs() {
  return del(['public/js/map.min.js', 'public/js/map.js']);
});
gulp.task('clean-map-css', function cleanMapCss() {
  return del(['public/css/map.min.css', 'public/css/map.css']);
});
gulp.task('clean-admin-scripts', function cleanAdminJs() {
  return del(['public/js/admin.min.js', 'public/js/admin.js']);
});
gulp.task('clean-admin-css', function cleanAdminCss() {
  return del(['public/css/admin.min.css', 'public/css/admin.css']);
});
gulp.task('clean-templates', function cleanAdminCss() {
  return del(['public/js/templates.js', 'templates/js/*.js']);
});
gulp.task('clean-vendor', function cleanAdminCss() {
  return del(['public/vendor/*.*']);
});
gulp.task('scripts-map', function scriptsMap() {
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
  .pipe(concat('map.js'))
  .pipe(gulpif(environment === 'production', rename('map.min.js')))
  .pipe(gulpif(environment === 'production', replace('127.0.0.1:3000', 'www.geomerchant.eu')))
  .pipe(gulpif(environment === 'production', uglify()))
  .pipe(sourcemaps.write())
  .pipe(gulp.dest('public/js'))
  .on('error', gutil.log);
});
gulp.task('scripts-admin', function scriptsAdmin() {
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
  .pipe(concat('admin.js'))
  .pipe(gulpif(environment === 'production', rename('admin.min.js')))
  .pipe(gulpif(environment === 'production', replace('127.0.0.1:3000', 'www.geomerchant.eu')))
  .pipe(gulpif(environment === 'production', uglify()))
  .pipe(sourcemaps.write())
  .pipe(gulp.dest('public/js'))
  .on('error', gutil.log);
});
gulp.task('css-map', function cssMap() {
  var processors = [
  autoprefixer({
    browsers: ['last 2 version']
  }),
  cssnano({
    cascade: false
  })
  ];
  return gulp.src(['dev/stylesheets/map/base.css', 'dev/stylesheets/map/!(base)*.css'])
  .pipe(sourcemaps.init())
  .pipe(concat('map.css'))
  .pipe(gulpif(environment !== 'production', postcss([processors[0]])))
  .pipe(gulpif(environment === 'production', postcss(processors)))
  .pipe(gulpif(environment === 'production', rename('map.min.css')))
  .pipe(sourcemaps.write())
  .pipe(gulp.dest('public/css'))
  .on('error', gutil.log);
});
gulp.task('css-admin', function cssAdmin() {
  var processors = [
    autoprefixer({
      browsers: ['last 2 version']
    }),
    cssnano({
      cascade: false
    })
  ];
  return gulp.src(['dev/stylesheets/admin/base.css', 'dev/stylesheets/admin/!(base)*.css'])
  .pipe(sourcemaps.init())
  .pipe(concat('admin.css'))
  .pipe(gulpif(environment !== 'production', postcss([processors[0]])))
  .pipe(gulpif(environment === 'production', postcss(processors)))
  .pipe(gulpif(environment === 'production', rename('admin.min.css')))
  .pipe(sourcemaps.write())
  .pipe(gulp.dest('public/css'))
  .on('error', gutil.log);
});

// templates

gulp.task('dust-compile', ['clean-templates'], function dustCompile() {
  return gulp.src('templates/*.dust')
  .pipe(dust())
  .pipe(gulp.dest('templates/js'));
});
gulp.task('templates', ['dust-compile'], function concatTeplates() {
  return gulp.src('templates/js/*.js')
  .pipe(sourcemaps.init())
  .pipe(concat('templates.js'))
  .pipe(uglify())
  .pipe(sourcemaps.write())
  .pipe(gulp.dest('public/js'))
  .on('error', gutil.log);
});

// injects
gulp.task('inject-map', ['scripts-map', 'css-map'], function injectMap() {
  var target = gulp.src('./views/map.dust');
  var appStream;
  var vendorStream = gulp.src([
    './public/vendor/bowser.min.js',
    './public/vendor/ol.js',
    './public/vendor/bluebird.min.js',
    './public/vendor/jquery.min.js',
    './public/vendor/dust-core.min.js',
    './public/vendor/dust-helpers.min.js',
    './public/vendor/material.min.js',
    './public/vendor/lodash.min.js',
    './public/vendor/moment.min.js',
    './public/vendor/toastr.min.js',
    // './public/libs/cloudinary.js',
    './public/vendor/cloudinary-jquery-file-upload.min.js',
    './public/vendor/getmdl-select.min.js',
    './public/vendor/auth0-lock.min.js',
    './public/vendor/parsley.min.js',
    './public/vendor/clusterize.min.js',
    './public/vendor/dialog-polyfill.js',
    './public/vendor/normalize.css',
    './public/vendor/ol.css',
    './public/vendor/material.blue_grey-red.min.css',
    './public/vendor/toastr.min.css',
    './public/vendor/getmdl-select.min.css',
    './public/vendor/clusterize.css',
    './public/vendor/dialog-polyfill.css'
    ], { read: false });
  if (environment === 'production') {
    appStream = gulp.src(['./public/js/map.min.js', './public/css/map.min.css'], { read: false });
  } else {
    appStream = gulp.src(['./public/js/map.js', './public/css/map.css'],
      { read: false });
  }
  return target.pipe(inject(series(vendorStream, appStream), { ignorePath: 'public' }))
  .pipe(gulp.dest('./views'));
});

gulp.task('build', ['clean-vendor'], function build() {
  return gulp.src([
    './node_modules/bowser/bowser.min.js',
    './node_modules/openlayers/dist/ol.js',
    './node_modules/bluebird/js/browser/bluebird.min.js',
    './node_modules/jquery/dist/jquery.min.js',
    './node_modules/dustjs-linkedin/dist/dust-core.min.js',
    './node_modules/dustjs-helpers/dist/dust-helpers.min.js',
    './node_modules/material-design-lite/material.min.js',
    './node_modules/lodash/lodash.min.js',
    './node_modules/moment/min/moment.min.js',
    './node_modules/toastr/build/toastr.min.js',
    './node_modules/auth0-lock/build/auth0-lock.min.js',
    './node_modules/getmdl-select/getmdl-select.min.js',
    './node_modules/clusterize.js/clusterize.min.js',
    './node_modules/md-date-time-picker/dist/js/draggabilly.pkgd.min.js',
    './node_modules/md-date-time-picker/dist/js/mdDateTimePicker.min.js',
    './node_modules/cloudinary-jquery-file-upload/cloudinary-jquery-file-upload.min.js',
    './node_modules/cloudinary/cloudinary.js',
    './node_modules/parsleyjs/dist/parsley.min.js',
    './node_modules/dialog-polyfill/dialog-polyfill.js',
    './node_modules/normalize.css/normalize.css',
    './node_modules/openlayers/dist/ol.css',
    './node_modules/material-design-lite/dist/material.blue_grey-red.min.css',
    './node_modules/toastr/build/toastr.min.css',
    './node_modules/getmdl-select/getmdl-select.min.css',
    './node_modules/md-date-time-picker/dist/css/mdDateTimePicker.min.css',
    './node_modules/dialog-polyfill/dialog-polyfill.css',
    './node_modules/clusterize.js/clusterize.css'
  ])
  .pipe(gulp.dest('public/vendor'))
  .on('error', gutil.log);
});
gulp.task('inject-admin', ['scripts-admin', 'css-admin'], function injectAdmin() {
  var target = gulp.src('./views/admin.dust');
  var appStream;
  var vendorStream = gulp.src([
    './public/vendor/bowser.min.js',
    './public/vendor/ol.js',
    './public/vendor/bluebird.min.js',
    './public/vendor/jquery.min.js',
    './public/vendor/dust-core.min.js',
    './public/vendor/dust-helpers.min.js',
    './public/vendor/material.min.js',
    './public/vendor/lodash.min.js',
    './public/vendor/moment.min.js',
    './public/vendor/toastr.min.js',
    './public/vendor/getmdl-select.min.js',
    './public/vendor/draggabilly.pkgd.min.js',
    './public/vendor/mdDateTimePicker.min.js',
    './public/vendor/cloudinary-jquery-file-upload.min.js',
    './public/libs/cloudinary.js',
    './public/vendor/parsley.min.js',
    './public/vendor/dialog-polyfill.js',
    './public/vendor/normalize.css',
    './public/vendor/ol.css',
    './public/vendor/material.blue_grey-red.min.css',
    './public/vendor/toastr.min.css',
    './public/vendor/getmdl-select.min.css',
    './public/vendor/mdDateTimePicker.min.css',
    './public/vendor/dialog-polyfill.css'
  ],
   { read: false });
  if (environment === 'production') {
    appStream = gulp.src(['./public/js/admin.min.js', './public/css/admin.min.css'],
      { read: false });
  } else {
    appStream = gulp.src(['./public/js/admin.js', './public/css/admin.css'],
      { read: false });
  }
  return target.pipe(inject(series(vendorStream, appStream), { ignorePath: 'public' }))
  .pipe(gulp.dest('./views'));
});
gulp.task('watch', function watchChanges() {
  gulp.watch('dev/*/map/**/*.*', ['clean-map-scripts', 'clean-map-css', 'inject-map'])
  .on('error', gutil.log);
  gulp.watch('dev/*/admin/**/*.*',
    ['clean-admin-scripts', 'clean-admin-css', 'inject-admin'])
  .on('error', gutil.log);

  gulp.watch('templates/*.dust', ['templates'])
  .on('error', gutil.log);
});

gulp.task('default', ['watch']);
