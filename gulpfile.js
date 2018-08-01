
// Gulp packages.
var gulp             = require('gulp'), // gulp core.
    sass             = require('gulp-sass'), // Compile SASS code.
    postcss          = require('gulp-postcss'), // Post CSS features.
    autoprefixer     = require('autoprefixer'); // Add browsers prefix.

// Define the default task.
gulp.task('default', ['watch']);

// Watch.
gulp.task('watch', function() {
  gulp.watch('src/*.scss', ['build-css']);
});

// Compile SASS.
gulp.task('build-css', function() {

  return gulp.src('src/*.scss')
    .pipe(sass())
    .on('error', onError)
    .pipe(postcss([ autoprefixer({ browsers: ['last 3 versions', '> 1%'] }) ]))
    .pipe(gulp.dest('src'));

});


// Avoid crash on error
function onError(err) {
  gutil.log(err.message);
  this.emit('end');
}
