'use strict';

<<<<<<< HEAD
//Include Gulp & tools we'll use
var gulp = require('gulp');
var vulcanize = require('gulp-vulcanize');
var crisper = require('gulp-crisper');
var $ = require('gulp-load-plugins')();
=======
var gulp = require('gulp');
var vulcanize = require('gulp-vulcanize');
var crisper = require('gulp-crisper');
>>>>>>> develop

gulp.task('vulcanize', function () {
    return gulp.src('war/components/elements.html')
        .pipe(vulcanize({
            abspath: '',
            excludes: [],
            stripExcludes: false,
            inlineScripts: true,
<<<<<<< HEAD
            stripComments: true
        }))
        //.pipe($.rename('elements.vulcanized.html'))
=======
            inlineCss: true
        }))
>>>>>>> develop
        .pipe(crisper({
            scriptInHead: false, // true is default 
            onlySplit: false
        }))
<<<<<<< HEAD
        .pipe(gulp.dest('war/components/vulcanized/'));
=======
        .pipe(gulp.dest('war/components/vulcanized'));
>>>>>>> develop
});