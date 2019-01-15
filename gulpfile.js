
/*
 * Require necessary dependencies
 */

var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var sass = require('gulp-sass');
var cleanCSS = require('gulp-clean-css');
var maps = require('gulp-sourcemaps');
var imagemin = require('gulp-imagemin');
var webserver = require('gulp-webserver');
var livereload = require('gulp-livereload');
var del = require('del');

/*
 * Concatenate, minify, and copy all JS files into all.min.js file
 * Copy all.min.js file to dist/scripts folder
 * Generate source maps for the JS files
 */
gulp.task("scripts", function() {
  return gulp.src(['./js/circle/*.js'])
      .pipe(maps.init())
      .pipe(concat("all.min.js"))
      .pipe(uglify())
      .pipe(maps.write('./'))
      .pipe(gulp.dest('dist/scripts'));
});

/*
 * Compile all SCSS files into CSS files
 * Concatenate and minify the CSS files into all.min.cs
 * Copy all.min.css to dist/styles folder
 * Generate source maps for the CSS files
 */
gulp.task("styles", function() {
  return gulp.src('./sass/*.scss')
      .pipe(maps.init())
      .pipe(sass())
      .pipe(concat("all.min.css"))
      .pipe(cleanCSS())
      .pipe(maps.write('./'))
      .pipe(gulp.dest('dist/styles'));
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
  gulp.watch('sass/*.scss', gulp.parallel('styles'));
});


/*
 * Reloads project in browser
 */
gulp.task('reload', function() {
  livereload.listen();
});

/*
 * Runs the 'clean' command
 * Then runs 'scripts', 'styles', and 'images' commands
 */
gulp.task("build",
  gulp.series('clean', gulp.parallel('scripts', 'styles', 'images'))
);

/*
 * Runs 'build' command as default behaviour, ie. when 'gulp' is called
 * Serves project using local web server on port 3000
 */
gulp.task("default", gulp.parallel(
  'watch', gulp.series('build', function() {
    webserver({
      port: 3000,
      livereload: true,
      open: 'http://localhost:3000'
    });
  })
));
