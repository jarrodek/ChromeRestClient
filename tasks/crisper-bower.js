const gulp = require('gulp');
const crisper = require('gulp-crisper');
gulp.src('app/bower_components/**/*.html')
.pipe(crisper({
  scriptInHead: false,
  onlySplit: false,
  alwaysWriteScript: false
}))
.pipe(gulp.dest('app/bower_components/'));
