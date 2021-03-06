
/*
 * Require necessary dependencies
 */

var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var sass = require('gulp-sass');
var csso = require('gulp-csso');
var maps = require('gulp-sourcemaps');
var imagemin = require('gulp-imagemin');
var webserver = require('gulp-webserver');
var livereload = require('gulp-livereload');
var del = require('del');

/*
 * Concatenate, minify, and copy all JS files into all.min.js file
 * Copy all.min.js file to dist/scripts folder
 * Generate source maps for the JS files and copy to dist folder
 */
gulp.task("scripts", function() {
 return gulp.src(['./js/**/*.js'])
   .pipe(concat('all.js'))
   .pipe(uglify())
   .pipe(rename('all.min.js'))
   .pipe(maps.init())
   .pipe(maps.write('../'))
   .pipe(gulp.dest('dist/scripts'));
});

/*
 * Compile all SCSS files into CSS files
 * Concatenate to css/global.css
 * Concatenate and minify the CSS files into all.min.cs
 * Copy all.min.css to dist/styles folder
 * Generate source maps for the CSS files and copy to dist folder
 */
gulp.task("styles", function() {
  return gulp.src('./sass/**/**.scss')
      .pipe(sass())
      .pipe(concat('global.css'))
      .pipe(gulp.dest('css'))
      .pipe(csso())
      .pipe(rename("all.min.css"))
      .pipe(maps.init())
      .pipe(maps.write('../'))
      .pipe(gulp.dest('dist/styles'))
});

/*
 * Optimise size of all JPEG and PNG files
 * Copy optimised images to dist/content folder
 */
gulp.task("images", function() {
  return gulp.src(['images/*.jpg', 'images/*.png'])
      .pipe(imagemin())
      .pipe(gulp.dest('dist/content'));
});

/*
 * Move icons folder into dist/icons folder
 */
gulp.task("icons", function() {
  return gulp.src(['icons/**'])
      .pipe(gulp.dest('dist/icons'))
});

/*
 * Move index.html into dist folder
 */
gulp.task("html", function() {
  return gulp.src(['*.html'])
      .pipe(gulp.dest('dist'))
});

/*
 * Delete all files and folders in dist folder
 */
gulp.task("clean", function() {
  return del('dist/*');
});

/*
 * Watch for any changes to any .scss files
 * Run 'styles' task if any changes found
 * Reloads project in browser
 */
gulp.task('watch', function() {
  gulp.watch('sass/*.scss', gulp.series('styles', 'reload'));
});

/*
 * Reloads project in browser
 */
gulp.task('reload', function() {
  return gulp.src('dist')
      .pipe(livereload());
});

/*
 * Runs the 'clean' command
 * Then runs 'scripts', 'styles', and 'images' commands
 */
gulp.task("build",
  gulp.series('clean', gulp.parallel('scripts', 'styles', 'images', 'icons', 'html'))
);

/*
 * Serves project using local web server on port 3000
 */
gulp.task("serve", function() {
  return gulp.src('./')
      .pipe(webserver({
          port: 3000,
          livereload: true,
          open: 'http://localhost:3000'
      }));
});

/*
 * Runs 'build' command as default behaviour, ie. when 'gulp' is called
 * Serves project using local web server on port 3000
 */
gulp.task("default", gulp.series('build', 'serve', 'watch'));
