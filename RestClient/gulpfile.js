'use strict';

//Include Gulp & tools we'll use
var gulp = require('gulp');
var vulcanize = require('gulp-vulcanize');
var crisper = require('gulp-crisper');
var $ = require('gulp-load-plugins')();

gulp.task('vulcanize', function () {
    return gulp.src('war/components/elements.html')
        .pipe(vulcanize({
            abspath: '',
            excludes: [],
            stripExcludes: false,
            inlineScripts: true,
            stripComments: true
        }))
        //.pipe($.rename('elements.vulcanized.html'))
        .pipe(crisper({
            scriptInHead: false, // true is default 
            onlySplit: false
        }))
        .pipe(gulp.dest('war/components/vulcanized/'));
});