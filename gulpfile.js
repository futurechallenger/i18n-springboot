const gulp = require('gulp');
const eslint = require('gulp-eslint');

gulp.task('lint', () => {
  return gulp.src('./*.js')
    .pipe(eslint())
    .pipe(eslint.format());
});

gulp.task('default', ['lint',], () => {
  console.log('#####gulp default task!')
});