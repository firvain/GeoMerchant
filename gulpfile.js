var path = require('path')
,gulp = require('gulp')
,gutil = require('gulp-util')
,concat = require('gulp-concat')
,uglify = require('gulp-uglify')
,cssnano = require('gulp-cssnano')
,dust = require('gulp-dust')
,sourcemaps = require('gulp-sourcemaps')
,del = require('del')
,watch = require('gulp-watch')
,changed = require('gulp-changed')
,autoprefixer = require('gulp-autoprefixer')
,stripDebug = require('gulp-strip-debug')
,eslint = require('gulp-eslint')
,exists = require('path-exists').sync;
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
        // .pipe(stripDebug())
        .pipe(uglify())
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
