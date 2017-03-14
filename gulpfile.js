"use strict";
var pkg = require("./package.json");

var gulp = require('gulp');
var concat = require('gulp-concat');
var header = require('gulp-header');
var connect = require("gulp-connect");
var less = require("gulp-less");
var autoprefixer = require('gulp-autoprefixer');
var ejs = require("gulp-ejs");
var uglify = require('gulp-uglify');
var ext_replace = require('gulp-ext-replace');
var cssmin = require('gulp-cssmin');
var runSequence = require('run-sequence');



var banner = '/*!\n' +
  ' * =====================================================\n' +
  ' * SUI Mobile - http://m.sui.taobao.org/\n' +
  ' *\n' +
  ' * =====================================================\n' +
  ' */\n';

gulp.task('js', function(cb) {

  var count = 0;
  var end = function() {
    count++;
    if (count >= 3) cb();
  };

  gulp.src([
      './src/js/city-data.js',
      './src/js/city-picker.js'
    ])
    .pipe(concat({ path: 'sm-city-picker.js' }))
    .pipe(gulp.dest('./dist/js/'))
    .on("end", end);

  gulp.src([
      './src/js/swiper.js',
      './src/js/swiper-init.js',
      './src/js/photo-browser.js'
    ])
    .pipe(concat({ path: 'sm-extend.js' }))
    .pipe(gulp.dest('./dist/js/'))
    .on("end", end);

  gulp.src([
      './src/js/intro.js',
      './src/js/util.js',
      './src/js/zepto-adapter.js',
      './src/js/device.js',
      './src/js/fastclick.js',
      './src/js/modal.js',
      './src/js/calendar.js',
      './src/js/picker.js',
      './src/js/datetime-picker.js',
      './src/js/iscroll.js',
      './src/js/scroller.js',
      './src/js/tabs.js',
      './src/js/fixed-tab.js',
      './src/js/pull-to-refresh-js-scroll.js',
      './src/js/pull-to-refresh.js',
      './src/js/infinite-scroll.js',
      './src/js/searchbar.js',
      './src/js/panels.js',
      './src/js/router.js',
      './src/js/last-position.js',
      './src/js/init.js',
      './src/js/scroll-fix.js',
      './src/js/accordion.js',
      './src/js/vendor/slider.js'
    ])
    .pipe(concat({ path: 'sm.js' }))
    .pipe(header(banner))
    .pipe(gulp.dest('./dist/js/'))
    .on("end", end);


});

gulp.task('uglify', ["js"], function() {
  return gulp.src(['./dist/js/*.js', '!./dist/js/*.min.js'])
    .pipe(uglify({
      preserveComments: "license"
    }))
    .pipe(ext_replace('.min.js'))
    .pipe(gulp.dest('./dist/js'));
});

gulp.task('less', function() {
  gulp.src(['./src/less/sm.less'])
    .pipe(less())
    .pipe(autoprefixer())
    .pipe(header(banner))
    .pipe(gulp.dest('./dist/css/'));

  gulp.src(['./src/less/sm-extend.less'])
    .pipe(less())
    .pipe(autoprefixer())
    .pipe(header(banner))
    .pipe(gulp.dest('./dist/css/'));
});

gulp.task('cssmin', ["less"], function() {
  gulp.src(['./dist/css/*.css', '!./dist/css/*.min.css'])
    .pipe(cssmin())
    .pipe(header(banner))
    .pipe(ext_replace('.min.css'))
    .pipe(gulp.dest('./dist/css/'));
});

gulp.task('ejs', function() {
  gulp.src(["./src/docs/**/*.html", "!./src/docs/**/_*.html"])
    .pipe(ejs({}))
    .pipe(gulp.dest("./dist/docs"));
});

gulp.task('copy', function() {
  gulp.src(['./src/docs/assets/**/*'])
    .pipe(gulp.dest('./dist/assets/'));

  gulp.src(['./src/fonts/**/*'])
    .pipe(gulp.dest('./dist/fonts/'));

  gulp.src(['./src/lib/**/*'])
    .pipe(gulp.dest('./dist/lib/'));
});

gulp.task('watch', function() {
  gulp.watch('src/js/**/*.js', ['js']);
  gulp.watch('src/less/**/*.less', ['less', 'cssmin']);
  gulp.watch('src/docs/**/*.html', ['ejs']);
});

gulp.task('server', function() {
  connect.server({
    root: 'dist',
    livereload: true
  });
});
// gulp.task("default", ['watch', 'server']);
// gulp.task("build", ['uglify', 'cssmin', 'copy', 'ejs', 'docs']);
gulp.task('default', function(callback) {
  runSequence(
    ['watch', 'server'],
    callback
  );
});

gulp.task('build', function(callback) {
  runSequence(
    ['uglify', 'cssmin', 'copy', 'ejs'],
    callback
  );
});
