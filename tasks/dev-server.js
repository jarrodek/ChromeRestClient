'use strict';

var gulp = require('gulp');
var connect = require('gulp-connect');
// var modRewrite = require('connect-modrewrite');

gulp.task('connect', function() {
  connect.server({
    root: [__dirname + '/'],
    livereload: true,
    port: 8888,
    // middleware: function() {
    //   return [
    //     modRewrite([
    //       //'^/app/bower_components/(.*)$ /bower_components/$1 [L]',
    //     ])
    //   ];
    // }
  });
});
gulp.task('html', function() {
  gulp.src('./app/*.html')
    .pipe(connect.reload());
});
gulp.task('watch', function() {
  gulp.watch(['./app/*.html'], ['html']);
});
gulp.task('elements-webserver', ['connect', 'watch']);
