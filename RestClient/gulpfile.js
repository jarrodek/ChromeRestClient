'use strict';

var gulp = require('gulp');
var vulcanize = require('gulp-vulcanize');
var crisper = require('gulp-crisper');

gulp.task('vulcanize', function () {
    return gulp.src('war/components/elements.html')
        .pipe(vulcanize({
            abspath: '',
            excludes: [],
            stripExcludes: false,
            inlineScripts: true,
            inlineCss: true,
            stripComments: true
        }))
        //.pipe($.rename('elements.vulcanized.html'))
        .pipe(crisper({
            scriptInHead: false, // true is default 
            onlySplit: false
        }))
        .pipe(gulp.dest('war/components/vulcanized'));
});


gulp.task('serve', function () {
    // java -cp D:\SDK\gwt\gwt-2.7.0\gwt-dev.jar com.google.gwt.dev.DevMode -startupUrl RestClient.html -logLevel INFO -war F:\workspace\ChromeRestClient\RestClient\war -server com.google.appengine.tools.development.gwt.AppEngineLauncher -superDevMode -codeServerPort 9997 -port 8888 org.rest.RestClient -remoteUI "${gwt_remote_ui_server_port}:${unique_id}"
});